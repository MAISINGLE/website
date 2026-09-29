const clean = (value, max) => typeof value === 'string' ? value.trim().slice(0, max) : ''

function safeFailureDetails(value, env, inquiry) {
  let details = clean(value, 1000)
  const privateValues = [
    env.RESEND_API_KEY,
    env.EMAIL_FROM,
    env.INQUIRY_NOTIFICATION_EMAIL,
    inquiry.name,
    inquiry.email,
    inquiry.eventType,
    inquiry.eventDate,
    inquiry.message,
    inquiry.venue,
    inquiry.coverage,
    inquiry.budget,
  ].filter((item) => typeof item === 'string' && item.length >= 2)

  for (const privateValue of privateValues) {
    details = details.split(privateValue).join('[redacted]')
  }

  return details
    .replace(/\bBearer\s+\S+/gi, 'Bearer [redacted]')
    .replace(/\bre_[A-Za-z0-9_-]+\b/g, '[redacted]')
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '[email]')
    .replace(/[\u0000-\u001f\u007f]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 500)
}

async function recordFailure(env, inquiryId, attemptedAt, details, responseStatus = null) {
  await env.DB.prepare(`UPDATE inquiries
    SET notification_status='failed', notification_response_status=?, notification_resend_id='', notification_error=?
    WHERE id=?`).bind(responseStatus, details, inquiryId).run()
  return { status: 'failed', responseStatus, error: details, attemptedAt }
}

/** Attempts one notification for an inquiry, recording only provider status and redacted failure details. */
export async function sendInquiryNotification(env, inquiryId) {
  const inquiry = await env.DB.prepare(`SELECT id, name, email, event_type AS eventType, event_date AS eventDate,
    message, guest_count AS guestCount, budget, venue, coverage, notification_status AS notificationStatus
    FROM inquiries WHERE id=?`).bind(inquiryId).first()
  if (!inquiry) return { status: 'not_found' }
  if (inquiry.notificationStatus === 'sent') return { status: 'already_sent' }

  const attemptedAt = new Date().toISOString()
  const staleBefore = new Date(Date.now() - 5 * 60 * 1000).toISOString()
  const claim = await env.DB.prepare(`UPDATE inquiries
    SET notification_status='sending', notification_attempts=notification_attempts+1,
        notification_last_attempt_at=?, notification_response_status=NULL,
        notification_resend_id='', notification_error=''
    WHERE id=? AND (
      notification_status IN ('pending', 'failed') OR
      (notification_status='sending' AND notification_last_attempt_at < ?)
    )`).bind(attemptedAt, inquiryId, staleBefore).run()
  if (!claim.meta?.changes) return { status: 'busy' }

  if (!env.RESEND_API_KEY || !env.EMAIL_FROM || !env.INQUIRY_NOTIFICATION_EMAIL) {
    return recordFailure(env, inquiryId, attemptedAt, 'Email notification configuration is incomplete.')
  }

  const recipient = clean(env.INQUIRY_NOTIFICATION_EMAIL, 254)
  const lines = [
    `Name: ${inquiry.name}`, `Email: ${inquiry.email}`, `Session: ${inquiry.eventType || 'Not specified'}`,
    `Date: ${inquiry.eventDate || 'Not set'}`, `Venue/location: ${inquiry.venue || 'Not specified'}`,
    `Coverage: ${inquiry.coverage || 'Not specified'}`, `Guest count: ${inquiry.guestCount || 'Not specified'}`,
    `Budget: ${inquiry.budget || 'Not specified'}`, '', 'Message:', inquiry.message || 'No additional details provided.',
  ]

  let response
  try {
    response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: env.EMAIL_FROM, to: [recipient], reply_to: inquiry.email, subject: `New photography inquiry from ${inquiry.name}`, text: lines.join('\n') }),
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to reach Resend.'
    return recordFailure(env, inquiryId, attemptedAt, `Network error: ${safeFailureDetails(message, env, inquiry) || 'Unable to reach Resend.'}`)
  }

  let result = null
  try { result = await response.json() } catch { /* Provider error bodies are optional. */ }

  if (!response.ok) {
    const errorName = clean(result?.name || result?.type, 80)
    const errorMessage = clean(result?.message, 800)
    const providerDetails = [`HTTP ${response.status}`, errorName, errorMessage].filter(Boolean).join(': ')
    return recordFailure(env, inquiryId, attemptedAt, safeFailureDetails(providerDetails, env, inquiry) || `Resend returned HTTP ${response.status}.`, response.status)
  }

  const resendId = clean(result?.id, 128)
  await env.DB.prepare(`UPDATE inquiries
    SET notification_status='sent', notification_response_status=?, notification_resend_id=?, notification_error=''
    WHERE id=?`).bind(response.status, resendId, inquiryId).run()
  return { status: 'sent', responseStatus: response.status, resendId, attemptedAt }
}

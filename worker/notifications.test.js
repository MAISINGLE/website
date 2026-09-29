import assert from 'node:assert/strict'
import { webcrypto } from 'node:crypto'
import { test } from 'node:test'
import worker from './index.js'
import { sendInquiryNotification } from './notifications.js'

const inquiryFields = ['name', 'email', 'eventType', 'eventDate', 'message', 'guestCount', 'budget', 'venue', 'coverage']

class MemoryD1 {
  constructor() { this.rows = new Map(); this.nextId = 1 }

  prepare(sql) {
    const statement = {
      values: [],
      bind: (...values) => { statement.values = values; return statement },
      first: async () => {
        if (!sql.includes('FROM inquiries WHERE id=?')) throw new Error(`Unexpected first query: ${sql}`)
        const row = this.rows.get(Number(statement.values[0]))
        if (!row) return null
        return {
          id: row.id, name: row.name, email: row.email, eventType: row.event_type, eventDate: row.event_date,
          message: row.message, guestCount: row.guest_count, budget: row.budget, venue: row.venue,
          coverage: row.coverage, notificationStatus: row.notification_status,
        }
      },
      run: async () => {
        const values = statement.values
        if (sql.startsWith('INSERT INTO inquiries')) {
          const row = Object.fromEntries(inquiryFields.map((field, index) => [field, values[index]]))
          const id = this.nextId++
          this.rows.set(id, {
            id, name: row.name, email: row.email, event_type: row.eventType, event_date: row.eventDate,
            message: row.message, guest_count: row.guestCount, budget: row.budget, venue: row.venue,
            coverage: row.coverage, notification_status: 'pending', notification_attempts: 0,
            notification_last_attempt_at: '', notification_response_status: null,
            notification_resend_id: '', notification_error: '', created_at: values.at(-1),
          })
          return { meta: { last_row_id: id } }
        }
        if (sql.includes("SET notification_status='sending'")) {
          const [attemptedAt, id, staleBefore] = values
          const row = this.rows.get(Number(id))
          const claimable = row && (['pending', 'failed'].includes(row.notification_status) || (row.notification_status === 'sending' && row.notification_last_attempt_at < staleBefore))
          if (!claimable) return { meta: { changes: 0 } }
          row.notification_status = 'sending'
          row.notification_attempts += 1
          row.notification_last_attempt_at = attemptedAt
          row.notification_response_status = null
          row.notification_resend_id = ''
          row.notification_error = ''
          return { meta: { changes: 1 } }
        }
        if (sql.includes("SET notification_status='failed'")) {
          const [status, error, id] = values
          const row = this.rows.get(Number(id))
          if (row) Object.assign(row, { notification_status: 'failed', notification_response_status: status, notification_resend_id: '', notification_error: error })
          return { meta: { changes: row ? 1 : 0 } }
        }
        if (sql.includes("SET notification_status='sent'")) {
          const [status, resendId, id] = values
          const row = this.rows.get(Number(id))
          if (row) Object.assign(row, { notification_status: 'sent', notification_response_status: status, notification_resend_id: resendId, notification_error: '' })
          return { meta: { changes: row ? 1 : 0 } }
        }
        throw new Error(`Unexpected run query: ${sql}`)
      },
    }
    return statement
  }
}

const envFor = (DB) => ({
  DB,
  RESEND_API_KEY: 're_private_test_key',
  EMAIL_FROM: 'Olive Lane <studio@olivelane.photo>',
  INQUIRY_NOTIFICATION_EMAIL: 'studio-inbox@olivelane.photo',
})

async function createInquiry(env, tasks = []) {
  const request = new Request('https://olive-lane.test/api/inquiries', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Jamie Customer', email: 'jamie@example.com', eventType: 'Wedding', eventDate: '2027-04-10', message: 'We are planning a garden wedding.' }),
  })
  const response = await worker.fetch(request, env, { waitUntil: (task) => tasks.push(task) })
  return { response, body: await response.json() }
}

test('Resend acceptance is recorded for an inquiry', async () => {
  const DB = new MemoryD1()
  DB.rows.set(1, {
    id: 1, name: 'Jamie Customer', email: 'jamie@example.com', event_type: 'Wedding', event_date: '2027-04-10',
    message: 'We are planning a garden wedding.', guest_count: 0, budget: '', venue: '', coverage: '',
    notification_status: 'pending', notification_attempts: 0, notification_last_attempt_at: '',
    notification_response_status: null, notification_resend_id: '', notification_error: '',
  })
  const originalFetch = globalThis.fetch
  globalThis.fetch = async () => Response.json({ id: 'resend-email-123' }, { status: 200 })
  try {
    const result = await sendInquiryNotification(envFor(DB), 1)
    assert.equal(result.status, 'sent')
    assert.equal(DB.rows.get(1).notification_status, 'sent')
    assert.equal(DB.rows.get(1).notification_response_status, 200)
    assert.equal(DB.rows.get(1).notification_resend_id, 'resend-email-123')
    assert.equal(DB.rows.get(1).notification_attempts, 1)
    assert.equal(DB.rows.get(1).notification_error, '')
  } finally { globalThis.fetch = originalFetch }
})

test('inquiry creation succeeds when Resend rejects email and private error values are redacted', async () => {
  const DB = new MemoryD1()
  const env = envFor(DB)
  const tasks = []
  const originalFetch = globalThis.fetch
  globalThis.fetch = async () => Response.json({
    name: 'validation_error',
    message: `Rejected ${env.RESEND_API_KEY} for jamie@example.com and studio-inbox@olivelane.photo`,
  }, { status: 422 })
  try {
    const { response, body } = await createInquiry(env, tasks)
    assert.equal(response.status, 201)
    assert.equal(body.ok, true)
    assert.equal(body.message, 'Thanks for reaching out. Your note has been received.')
    assert.equal(JSON.stringify(body).includes('notification'), false)
    assert.equal(JSON.stringify(body).includes('jamie@example.com'), false)
    assert.equal(JSON.stringify(body).includes(env.RESEND_API_KEY), false)
    assert.equal(tasks.length, 1)
    await Promise.all(tasks)
    const saved = DB.rows.get(body.inquiryId)
    assert.equal(saved.notification_status, 'failed')
    assert.equal(saved.notification_response_status, 422)
    assert.equal(saved.notification_attempts, 1)
    assert.match(saved.notification_error, /HTTP 422/)
    assert.match(saved.notification_error, /validation_error/)
    assert.equal(saved.notification_error.includes(env.RESEND_API_KEY), false)
    assert.equal(saved.notification_error.includes('jamie@example.com'), false)
    assert.equal(saved.notification_error.includes('studio-inbox@olivelane.photo'), false)
  } finally { globalThis.fetch = originalFetch }
})

test('network failures are stored instead of thrown', async () => {
  const DB = new MemoryD1()
  DB.rows.set(3, {
    id: 3, name: 'Jamie Customer', email: 'jamie@example.com', event_type: 'Wedding', event_date: '',
    message: 'We are planning a garden wedding.', guest_count: 0, budget: '', venue: '', coverage: '',
    notification_status: 'pending', notification_attempts: 0, notification_last_attempt_at: '',
    notification_response_status: null, notification_resend_id: '', notification_error: '',
  })
  const originalFetch = globalThis.fetch
  globalThis.fetch = async () => { throw new TypeError('fetch failed') }
  try {
    const result = await sendInquiryNotification(envFor(DB), 3)
    assert.equal(result.status, 'failed')
    assert.match(DB.rows.get(3).notification_error, /Network error/)
    assert.equal(DB.rows.get(3).notification_response_status, null)
  } finally { globalThis.fetch = originalFetch }
})

test('retry route requires an admin bearer token', async () => {
  const DB = new MemoryD1()
  const request = new Request('https://olive-lane.test/api/admin/inquiries/1/retry-notification', { method: 'POST' })
  const response = await worker.fetch(request, {
    DB,
    ADMIN_PASSWORD: 'configured',
    ADMIN_TOTP_SECRET: 'JBSWY3DPEHPK3PXP',
    ADMIN_TOKEN_SECRET: 'test-secret-that-is-long-enough',
  })
  assert.equal(response.status, 401)
  assert.equal(DB.rows.size, 0)
  assert.deepEqual(await response.json(), { message: 'Please sign in again.' })
})

async function createAdminToken(secret) {
  const encode = (bytes) => Buffer.from(bytes).toString('base64url')
  const payload = encode(new TextEncoder().encode(JSON.stringify({ sub: 'studio-admin', exp: Math.floor(Date.now() / 1000) + 3600 })))
  const key = await webcrypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const signature = await webcrypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload))
  return `${payload}.${encode(signature)}`
}

test('authorized retry sends the failed inquiry and records the new Resend result', async () => {
  const DB = new MemoryD1()
  DB.rows.set(4, {
    id: 4, name: 'Jamie Customer', email: 'jamie@example.com', event_type: 'Wedding', event_date: '2027-04-10',
    message: 'We are planning a garden wedding.', guest_count: 0, budget: '', venue: '', coverage: '',
    notification_status: 'failed', notification_attempts: 1, notification_last_attempt_at: new Date().toISOString(),
    notification_response_status: 422, notification_resend_id: '', notification_error: 'HTTP 422: validation_error',
  })
  const secret = 'test-secret-that-is-long-enough'
  const token = await createAdminToken(secret)
  const originalFetch = globalThis.fetch
  let deliveryCalls = 0
  globalThis.fetch = async () => { deliveryCalls += 1; return Response.json({ id: 'resend-retry-456' }, { status: 200 }) }
  try {
    const request = new Request('https://olive-lane.test/api/admin/inquiries/4/retry-notification', {
      method: 'POST', headers: { Authorization: `Bearer ${token}` },
    })
    const response = await worker.fetch(request, { ...envFor(DB), ADMIN_PASSWORD: 'configured', ADMIN_TOTP_SECRET: 'JBSWY3DPEHPK3PXP', ADMIN_TOKEN_SECRET: secret })
    assert.equal(response.status, 200)
    assert.deepEqual(await response.json(), { ok: true, notificationStatus: 'sent' })
    assert.equal(deliveryCalls, 1)
    assert.equal(DB.rows.get(4).notification_status, 'sent')
    assert.equal(DB.rows.get(4).notification_attempts, 2)
    assert.equal(DB.rows.get(4).notification_response_status, 200)
    assert.equal(DB.rows.get(4).notification_resend_id, 'resend-retry-456')
    assert.equal(DB.rows.get(4).notification_error, '')
  } finally { globalThis.fetch = originalFetch }
})

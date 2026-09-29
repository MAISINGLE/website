import assert from 'node:assert/strict'
import { test } from 'node:test'
import worker from './index.js'

test('public studio knowledge API returns approved business facts and FAQs only', async () => {
  const response = await worker.fetch(new Request('https://olive-lane.test/api/studio-knowledge'), {})
  assert.equal(response.status, 200)
  const data = await response.json()
  assert.equal(data.profile.contactEmail, 'hello@olivelane.photo')
  assert.equal(data.profile.base, 'Melbourne and Sydney, Australia')
  assert.match(data.profile.serviceArea, /Australia/)
  assert.ok(data.faqs.some((faq) => faq.id === 'payment-methods'))
  assert.ok(data.faqs.some((faq) => faq.id === 'inquiry-privacy'))
  assert.ok(data.faqs.some((faq) => faq.id === 'photographer-background'))
  assert.ok(data.faqs.some((faq) => faq.id === 'weather-plan'))
  assert.ok(data.faqs.some((faq) => faq.id === 'image-usage'))
  assert.equal(JSON.stringify(data).includes('RESEND_API_KEY'), false)
  assert.equal(JSON.stringify(data).includes('admin_notes'), false)
  assert.equal(JSON.stringify(data).includes('keywords'), false)
})

test('public package endpoint includes Sydney location ideas for wedding and portrait inquiries', async () => {
  const response = await worker.fetch(new Request('https://olive-lane.test/api/packages'), {})
  assert.equal(response.status, 200)
  const packages = await response.json()
  const weddingPackages = packages.filter((item) => item.category === 'Weddings')
  const portraitPackage = packages.find((item) => item.id === 'portrait')
  assert.ok(weddingPackages.every((item) => item.locationIdeas.some((place) => place.includes('Sydney'))))
  assert.ok(portraitPackage.locationIdeas.some((place) => place.includes('Sydney')))
})

test('Gemini receives only relevant curated public facts and chat returns source links', async () => {
  const originalFetch = globalThis.fetch
  let requestUrl
  let requestInit
  globalThis.fetch = async (url, init) => {
    requestUrl = String(url)
    requestInit = init
    return Response.json({ candidates: [{ content: { parts: [{ text: 'Payment details are confirmed in your written proposal.' }] } }] })
  }
  try {
    const request = new Request('https://olive-lane.test/api/chat', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Which payment methods do you accept?' }),
    })
    const response = await worker.fetch(request, {
      GEMINI_API_KEY: 'gemini_test_secret',
      DB: { prepare: () => { throw new Error('The assistant must not read inquiry records.') } },
    })
    const data = await response.json()
    const payload = JSON.parse(requestInit.body)
    const modelContext = payload.systemInstruction.parts[0].text
    assert.equal(response.status, 200)
    assert.match(requestUrl, /generativelanguage\.googleapis\.com\/v1beta\/models\/gemini-2\.5-flash:generateContent/)
    assert.equal(requestInit.headers['x-goog-api-key'], 'gemini_test_secret')
    assert.match(modelContext, /payment options are not listed/i)
    assert.match(modelContext, /No payment is collected in the inquiry form/i)
    assert.equal(modelContext.includes('gemini_test_secret'), false)
    assert.match(modelContext, /Customer inquiries are stored separately/)
    assert.ok(data.sources.some((source) => source.href === '#faq'))
    assert.equal(data.reply, 'Payment details are confirmed in your written proposal.')
    assert.equal(data.mode, 'gemini')
  } finally { globalThis.fetch = originalFetch }
})

test('follow-up questions retain relevant FAQ context from recent customer turns', async () => {
  const originalFetch = globalThis.fetch
  let requestBody
  globalThis.fetch = async (_url, init) => {
    requestBody = JSON.parse(init.body)
    return Response.json({ candidates: [{ content: { parts: [{ text: 'The Full Story is 10 hours and starts at AUD $4,200; travel is itemised separately.' }] } }] })
  }
  try {
    const request = new Request('https://olive-lane.test/api/chat', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Would that include the 10-hour option?',
        history: [
          { role: 'user', text: 'Do you cover destination weddings in Japan, and are travel and accommodation included?' },
          { role: 'assistant', text: 'Destination work is considered, and travel is itemised in the proposal.' },
        ],
      }),
    })
    const response = await worker.fetch(request, { GEMINI_API_KEY: 'gemini_test_secret' })
    const data = await response.json()
    const context = requestBody.systemInstruction.parts[0].text
    assert.equal(response.status, 200)
    assert.match(context, /Are travel and accommodation included\?/)
    assert.match(context, /The Full Story.*10 hours/)
    assert.equal(requestBody.contents[0].parts[0].text, 'Do you cover destination weddings in Japan, and are travel and accommodation included?')
    assert.equal(data.mode, 'gemini')
  } finally { globalThis.fetch = originalFetch }
})

test('offline assistant answers payment questions without inventing a provider', async () => {
  const request = new Request('https://olive-lane.test/api/chat', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: 'Can I pay by card or bank transfer?' }),
  })
  const response = await worker.fetch(request, {})
  const data = await response.json()
  assert.equal(response.status, 200)
  assert.equal(data.mode, 'faq')
  assert.match(data.reply, /payment options are not listed/i)
  assert.match(data.reply, /written proposal/i)
  assert.ok(data.sources.some((source) => source.href === '#faq'))
})

test('offline assistant answers common new questions without inventing studio policies', async () => {
  const questions = [
    ['Do you provide RAW files?', /does not state whether RAW or unedited files are supplied/i],
    ['What if it rains on the day?', /does not publish a weather or rescheduling plan/i],
    ['Can I request a second photographer?', /can ask about a second photographer/i],
    ['Do I get a contract?', /does not specify whether there is a separate contract/i],
  ]
  for (const [message, expectedAnswer] of questions) {
    const request = new Request('https://olive-lane.test/api/chat', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    })
    const response = await worker.fetch(request, {})
    const data = await response.json()
    assert.equal(response.status, 200)
    assert.equal(data.mode, 'faq')
    assert.match(data.reply, expectedAnswer)
  }
})

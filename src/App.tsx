import { useCallback, useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import './App.css'
import { heroImage, photographs, type PortfolioPhoto } from './portfolio-data'

const galleryGroups = {
  Weddings: ['Weddings'],
  People: ['Portraits', 'Studio', 'Outdoor'],
  Brands: ['Commercial'],
  Places: ['Travel'],
  Street: ['Street'],
} as const
type GalleryGroup = 'All' | keyof typeof galleryGroups
const categories: GalleryGroup[] = ['All', 'Weddings', 'People', 'Brands', 'Places', 'Street']
const categoryLabel = (value: PortfolioPhoto['category']) => value === 'Commercial' ? 'Brands' : value === 'Travel' ? 'Places' : ['Portraits', 'Studio', 'Outdoor'].includes(value) ? 'People' : value
const uniquePhotos = (items: PortfolioPhoto[]) => [...new Map(items.map((photo) => [photo.image, photo])).values()]
const interleave = (groups: PortfolioPhoto[][]) => {
  const result: PortfolioPhoto[] = []
  const longest = Math.max(0, ...groups.map((group) => group.length))
  for (let index = 0; index < longest; index += 1) {
    groups.forEach((group) => { if (group[index]) result.push(group[index]) })
  }
  return result
}
const organizeStories = (items: PortfolioPhoto[], group: GalleryGroup) => {
  const unique = uniquePhotos(items)
  if (group === 'All') return interleave(Object.values(galleryGroups).map((members) => unique.filter((photo) => members.includes(photo.category as never))))
  const members = galleryGroups[group]
  const matching = unique.filter((photo) => members.includes(photo.category as never))
  return group === 'People' ? interleave(members.map((member) => matching.filter((photo) => photo.category === member))) : matching
}
const serviceFromCategory = (value: string) => value === 'Weddings' ? 'Wedding' : ['Portraits', 'Studio', 'Outdoor'].includes(value) ? 'Portrait session' : value === 'Commercial' ? 'Commercial photography' : value === 'Street' ? 'Street photography' : value
const storyType = (value: string) => value === 'Weddings' ? 'wedding' : ['Portraits', 'Studio', 'Outdoor'].includes(value) ? 'portrait' : value.toLowerCase()
const API_URL = import.meta.env.VITE_API_URL || '/api'
const defaultPackages = [
  { id: 'intimate', name: 'The Intimate', category: 'Weddings', hours: '6 hours', deliverables: '350+ edited images', priceFrom: 2800, currency: 'AUD', description: 'For heartfelt celebrations.' },
  { id: 'full-day', name: 'The Full Story', category: 'Weddings', hours: '10 hours', deliverables: '650+ edited images', priceFrom: 4200, currency: 'AUD', description: 'A whole day, from getting ready to the last dance.' },
  { id: 'portrait', name: 'The Portrait Session', category: 'Portraits', hours: '90 minutes', deliverables: '60+ edited images', priceFrom: 650, currency: 'AUD', description: 'A relaxed portrait session.' },
  { id: 'destination', name: 'The Faraway', category: 'Travel', hours: 'Custom', deliverables: 'Curated gallery', priceFrom: 1800, currency: 'AUD', description: 'Destination celebrations and travel stories.' },
]
type Inquiry = { id: number; name: string; email: string; eventType: string; eventDate: string; guestCount: number; budget: string; venue?: string; coverage?: string; priorities?: string; referralSource?: string; contactPreference?: string; message: string; status: string; adminNotes: string; createdAt: string; notificationStatus: 'pending' | 'sending' | 'sent' | 'failed' | 'not_recorded'; notificationAttempts: number; notificationLastAttemptAt: string; notificationResponseStatus: number | null; notificationResendId: string; notificationError: string }
type ChatMessage = { role: 'assistant' | 'user'; text: string }

function App() {
  const [appearance, setAppearance] = useState<'default' | 'night'>(() => {
    try {
      return window.localStorage.getItem('olive-appearance') === 'night' ? 'night' : 'default'
    } catch {
      return 'default'
    }
  })
  const [activeCategory, setActiveCategory] = useState<GalleryGroup>('All')
  const [menuOpen, setMenuOpen] = useState(false)
  const [stories, setStories] = useState(() => organizeStories(photographs, 'All'))
  const [visibleCount, setVisibleCount] = useState(6)
  const [packages, setPackages] = useState(defaultPackages)
  const [adminMode, setAdminMode] = useState(window.location.hash === '#admin')
  const storyId = new URLSearchParams(window.location.search).get('story') || window.location.pathname.match(/^\/stories\/([a-z0-9-]+)\/?$/)?.[1] || null
  const [formState, setFormState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const initialPackage = new URLSearchParams(window.location.search).get('collection') || ''
  const [selectedPackage, setSelectedPackage] = useState(initialPackage)
  const [eventType, setEventType] = useState(() => serviceFromCategory(new URLSearchParams(window.location.search).get('service') || defaultPackages.find((item) => item.id === initialPackage)?.category || ''))
  const [chatOpen, setChatOpen] = useState(false)
  const [chatInput, setChatInput] = useState('')
  const [chatSending, setChatSending] = useState(false)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([{ role: 'assistant', text: 'Hello! I can help with collections, starting prices, travel, delivery and booking. What would you like to know?' }])

  useEffect(() => {
    document.documentElement.dataset.appearance = appearance
    try {
      window.localStorage.setItem('olive-appearance', appearance)
    } catch {
      // The selected appearance still applies for this visit if storage is unavailable.
    }
  }, [appearance])

  useEffect(() => {
    setVisibleCount(6)
    fetch(`${API_URL}/portfolio`)
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((items: typeof photographs) => setStories(organizeStories(items, activeCategory)))
      .catch(() => setStories(organizeStories(photographs, activeCategory)))
  }, [activeCategory])

  useEffect(() => {
    fetch(`${API_URL}/packages`).then((response) => response.ok ? response.json() : Promise.reject())
      .then(setPackages).catch(() => setPackages(defaultPackages))
  }, [])

  useEffect(() => {
    const story = stories.find((item) => item.id === storyId)
    const title = story ? `${story.title} | Olive Lane Photography` : 'Olive Lane Photography | Melbourne Wedding, Portrait & Travel Photographer'
    const description = story ? `Explore an editorial ${story.category.toLowerCase()} image study from Olive Lane Photography.` : 'Melbourne photographer for weddings, portraits and travel stories. Explore image studies, collections and booking details.'
    document.title = title
    document.querySelector('meta[name="description"]')?.setAttribute('content', description)
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', title)
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', description)
    document.querySelector('meta[property="og:url"]')?.setAttribute('content', window.location.href)
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', window.location.href)
    const image = story ? `https://images.unsplash.com/${story.image}?auto=format&fit=crop&w=1200&q=78` : `https://images.unsplash.com/${heroImage}?auto=format&fit=crop&w=1200&q=78`
    document.querySelector('meta[property="og:image"]')?.setAttribute('content', image)
    document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', title)
    document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', description)
    document.querySelector('meta[name="twitter:image"]')?.setAttribute('content', image)
  }, [storyId, stories])

  useEffect(() => {
    const onHashChange = () => setAdminMode(window.location.hash === '#admin')
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  useEffect(() => {
    const targetId = window.location.hash.slice(1)
    if (!targetId) return
    window.requestAnimationFrame(() => window.requestAnimationFrame(() => document.getElementById(targetId)?.scrollIntoView({ behavior: 'instant' })))
  }, [])

  async function sendInquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormState('sending')
    const formElement = event.currentTarget
    const form = new FormData(formElement)
    const message = String(form.get('message') || '').trim()
    const serviceNotes = String(form.get('serviceNotes') || '').trim()
    const location = String(form.get('location') || '').trim()
    const setting = String(form.get('setting') || '').trim()
    const editingStyle = String(form.get('editingStyle') || '').trim()
    const videoHighlight = form.get('videoHighlight') === 'on'
    const collection = String(form.get('collection') || '').trim()
    form.set('message', [message, setting && `Preferred setting: ${setting}`, editingStyle && `Editing style: ${editingStyle}`, videoHighlight && 'Interested in a short video highlight reel (please quote).', location && `Preferred location: ${location}`, serviceNotes && `Additional details: ${serviceNotes}`, collection && `Collection of interest: ${collection}`].filter(Boolean).join('\n\n') || 'No additional details provided.')
    try {
      const response = await fetch(`${API_URL}/inquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(form.entries())),
      })
      if (!response.ok) throw new Error('Could not send inquiry')
      setFormState('sent')
      formElement.reset()
      setEventType('')
      setSelectedPackage('')
    } catch {
      setFormState('error')
    }
  }

  async function sendChat(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault()
    const message = chatInput.trim()
    if (message.length < 2 || chatSending) return
    setChatInput('')
    setChatMessages((previous) => [...previous, { role: 'user', text: message }])
    setChatSending(true)
    try {
      const history = chatMessages.slice(-8).map((item) => ({ role: item.role, text: item.text }))
      const response = await fetch(`${API_URL}/chat`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message, history }) })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Unable to answer right now')
      setChatMessages((previous) => [...previous, { role: 'assistant', text: data.reply }])
    } catch {
      setChatMessages((previous) => [...previous, { role: 'assistant', text: 'I couldn’t reach the chat service just now. Please email hello@olivelane.photo or use the inquiry form.' }])
    } finally { setChatSending(false) }
  }

  function handleChatKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); void sendChat() }
  }

  if (adminMode) return <AdminDashboard />

  const selectedStory = stories.find((story) => story.id === storyId)
  if (selectedStory) return <StoryPage story={selectedStory} />

  return (
    <main>
      <header className="topbar">
        <a className="wordmark" href="#home" aria-label="Olive Lane home">OLIVE LANE<span>PHOTOGRAPHY</span></a>
        <button className="menu-toggle" aria-label="Toggle navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? 'CLOSE' : 'MENU'}</button>
        <nav className={menuOpen ? 'navigation is-open' : 'navigation'}>
          <a href="#portfolio" onClick={() => setMenuOpen(false)}>Portfolio</a><a href="#about" onClick={() => setMenuOpen(false)}>About</a><a href="#packages" onClick={() => setMenuOpen(false)}>Pricing</a>
          <a className="nav-cta" href="#contact" onClick={() => setMenuOpen(false)}>Enquire <span>↗</span></a>
        </nav>
      </header>

      <section className="hero" id="home">
        <img className="hero-image" src={`https://images.unsplash.com/${heroImage}?auto=format&fit=crop&w=1500&q=78`} srcSet={[900, 1500, 2100].map((width) => `https://images.unsplash.com/${heroImage}?auto=format&fit=crop&w=${width}&q=78 ${width}w`).join(', ')} sizes="100vw" fetchPriority="high" alt="Illustrative wedding celebration in a sunlit garden" />
        <div className="hero-shade" />
        <div className="hero-copy"><span className="eyebrow light">PHOTOGRAPHS WITH A FEELING</span><h1>For the days<br />you’ll <em>always</em> remember.</h1><div className="hero-actions"><a className="hero-primary" href="#contact">Enquire about your session <span>↗</span></a><a className="hero-link" href="#portfolio">Explore the stories <span>↓</span></a></div></div>
        <span className="hero-note">BASED IN MELBOURNE · AVAILABLE EVERYWHERE</span>
      </section>

      <section className="portfolio section-wrap" id="portfolio">
        <div className="section-heading"><div><span className="eyebrow">SELECTED WORK</span><h2>Stories worth <em>keeping.</em></h2></div><span className="image-count">A CURATED GLIMPSE INTO THE OLIVE LANE STYLE</span></div>
        <div className="filters" aria-label="Filter portfolio">{categories.map((category) => <button key={category} type="button" className={activeCategory === category ? 'filter active' : 'filter'} aria-pressed={activeCategory === category} onClick={() => setActiveCategory(category)}>{category}</button>)}<span className="filter-count" aria-live="polite">{stories.length} {stories.length === 1 ? 'image study' : 'image studies'}</span></div>
        <p className="portfolio-note">A balanced edit across celebrations, people, brands, places and street work. Every visible frame is unique, and the groups make it easier to find the kind of photography you have in mind.</p>
        <div className="gallery">{stories.slice(0, visibleCount).map((photo, i) => <article className={`photo-card card-${i + 1}`} key={photo.id}><a className="photo-image" href={`/stories/${encodeURIComponent(photo.id)}`} aria-label={`View ${photo.category.toLowerCase()} image study: ${photo.title}`}><img src={`https://images.unsplash.com/${photo.image}?auto=format&fit=crop&w=980&q=78`} srcSet={[520, 980, 1400].map((width) => `https://images.unsplash.com/${photo.image}?auto=format&fit=crop&w=${width}&q=78 ${width}w`).join(', ')} sizes="(max-width: 700px) 86vw, 40vw" alt={`Illustrative ${storyType(photo.category)} study: ${photo.title}`} loading="lazy" decoding="async"/><span className="photo-arrow" aria-hidden="true">↗</span></a><div className="photo-caption"><h3><a href={`/stories/${encodeURIComponent(photo.id)}`}>{photo.title}</a></h3><span className="photo-category">{categoryLabel(photo.category)}</span></div><div className="photo-context"><span><small>LOCATION IDEA</small><a href={photo.locationUrl} target="_blank" rel="noreferrer">{photo.place} ↗</a></span><span><small>BEST LIGHT</small><strong>{photo.time}</strong></span></div></article>)}</div>
        {stories.length > visibleCount && <button className="gallery-more" type="button" onClick={() => setVisibleCount((count) => count + 6)}>View more stories <span>({stories.length - visibleCount} remaining)</span></button>}
      </section>

      <section className="team-profile section-wrap" id="about">
        <div><span className="eyebrow">MEET YOUR PHOTOGRAPHER</span><h2>A small studio,<br /><em>a personal touch.</em></h2><p>Nam leads every inquiry and session, from the first conversation through to your finished gallery. You’ll know who you’re speaking with and who will be behind the camera.</p><a className="text-link" href="#contact">Tell me what you’re planning <span>↗</span></a></div>
        <article className="team-card"><div className="team-portrait" aria-label="Nam Vu, lead photographer"><span className="team-portrait-placeholder" aria-hidden="true"><small>OLIVE LANE</small>NV<small>MELBOURNE</small></span></div><div className="team-copy"><span className="eyebrow">YOUR PHOTOGRAPHER</span><h3>Nam Vu</h3><p>WARM DIRECTION · HONEST MOMENTS</p></div></article>
      </section>

      <section className="experience section-wrap" id="experience">
        <div className="section-heading"><div><span className="eyebrow">FROM FIRST HELLO TO FOREVER</span><h2>Easy as <em>it should be.</em></h2></div><span className="image-count">A LITTLE MORE ABOUT WHAT TO EXPECT</span></div>
        <div className="steps-grid">
          <article><span>01</span><h3>Tell me your plans</h3><p>Send a note with your date, location, and the feeling you want your photographs to hold. A few details are plenty to get us started.</p></article>
          <article><span>02</span><h3>Let’s make a plan</h3><p>We’ll talk through the schedule, location, light, and the moments that matter most. I’ll help you feel prepared without over-planning.</p></article>
          <article><span>03</span><h3>Be right there</h3><p>On the day, I’ll give gentle direction when it helps and leave room for the real moments to happen naturally.</p></article>
          <article><span>04</span><h3>Relive it all</h3><p>Your carefully edited photographs arrive in a private online gallery, ready to share, download, and revisit whenever you like.</p></article>
        </div>
        <div className="included-note"><div><span className="eyebrow">IN EVERY COLLECTION</span><h3>The thoughtful details, taken care of.</h3></div><ul><li>A planning call and timeline guidance</li><li>Careful hand editing in a warm, natural style</li><li>A private online gallery for easy sharing</li><li>High-resolution files for personal printing</li></ul></div>
      </section>

      <section className="packages section-wrap" id="packages"><div className="section-heading"><div><span className="eyebrow">PRICING & COVERAGE</span><h2>Thoughtfully <em>made.</em></h2></div><span className="image-count">EVERY COLLECTION INCLUDES A PRIVATE ONLINE GALLERY</span></div><div className="package-grid">{packages.map((item) => <article className="package-card" key={item.id}><span className="eyebrow">{item.category}</span><h3>{item.name}</h3><p>{item.description}</p><div className="package-details"><span>Coverage · {item.hours}</span><span>{item.deliverables}</span></div><strong>From ${item.priceFrom.toLocaleString()} {item.currency}</strong><a href={`/?collection=${encodeURIComponent(item.id)}#contact`} onClick={() => { setFormState('idle'); setSelectedPackage(item.id); setEventType(serviceFromCategory(item.category)) }}>Ask about this collection <span>↗</span></a></article>)}</div><p className="package-note">Starting prices are in AUD. The final quote depends on coverage, date, location and any travel. Send your preferred date through the inquiry form to check availability. Your written proposal will set out the deliverables, travel costs and payment terms before you decide. No payment is taken through this inquiry form.</p></section>

      <section className="faq section-wrap" id="faq"><div className="section-heading"><div><span className="eyebrow">GOOD TO KNOW</span><h2>A few little <em>answers.</em></h2></div><a className="text-link" href="#contact">Ask me anything <span>↗</span></a></div><div className="faq-list">
        <details><summary>Is a deposit due when I send an inquiry?</summary><p>No. Sending an inquiry doesn’t reserve a date or charge you. If the date is available, your written proposal will explain the retainer, payment dates and what completes the booking before you choose to proceed.</p></details>
        <details><summary>Are travel costs included in the starting price?</summary><p>Travel is not assumed to be included. Any travel or accommodation costs for your location will be itemised in the proposal before you book, so you can review the full amount first.</p></details>
        <details><summary>When will we receive our photos?</summary><p>Your proposal will give the estimated gallery delivery window for your date and collection. We’ll agree that timing in writing before booking, and you’ll be contacted if anything needs to change.</p></details>
        <details><summary>What if we need to reschedule or cancel?</summary><p>Please get in touch as soon as plans change. Availability for a new date, any fees, and how a retainer is handled depend on the written booking terms. Review those terms before confirming your date.</p></details>
        <details><summary>Can we get prints or an album?</summary><p>Your collection includes high-resolution images for personal printing in a private online gallery. Albums and print options can be discussed and quoted separately when you choose your collection.</p></details>
        <details><summary>What if you’re unavailable for our date?</summary><p>I’ll let you know before you make a booking. If helpful, you can ask whether I have a suitable photographer to recommend, though referrals depend on availability.</p></details>
        <details><summary>Where are you based, and do you travel?</summary><p>I’m based in Melbourne and photograph weddings, portraits and travel stories across Australia and abroad. Send your location with your inquiry so travel needs can be included in the proposal.</p></details>
        <details><summary>We’re camera shy. Is that okay?</summary><p>Absolutely. You don’t need to know how to pose. I’ll offer simple direction when it’s useful, then give you space to be together and let things unfold.</p></details>
        <details><summary>Can we customise a collection?</summary><p>Yes. If your plans don’t fit neatly into one of the listed options, include a note about what you need and I’ll suggest a tailored approach.</p></details>
      </div></section>

      <section className="contact" id="contact"><div><span className="eyebrow">NEW BOOKING INQUIRIES</span><h2>Something good<br />starts <em>here.</em></h2><p className="contact-intro">Tell me what you’re dreaming up. No payment is due with an inquiry. The studio aims to reply by email within two business days.</p><a className="text-link" href="#packages">View pricing & coverage <span>↑</span></a><p className="contact-email">Prefer email? <a href="mailto:hello@olivelane.photo">hello@olivelane.photo</a></p><p className="existing-booking-note">Already booked? <a href="mailto:hello@olivelane.photo?subject=Question%20about%20an%20existing%20booking">Email customer care about your booking</a>.</p></div><form className="contact-form" onSubmit={sendInquiry}>
        {selectedPackage && <input type="hidden" name="collection" value={packages.find((item) => item.id === selectedPackage)?.name || ''} />}
        {selectedPackage && <p className="selected-collection">You’re asking about <strong>{packages.find((item) => item.id === selectedPackage)?.name || 'a collection'}</strong>. <button type="button" onClick={() => setSelectedPackage('')}>Change</button></p>}
        <div className="form-row"><label>Your name <span className="field-hint">Required</span><input name="name" autoComplete="name" required minLength={2} maxLength={100} placeholder="Name" /></label><label>Email address <span className="field-hint">Required</span><input name="email" type="email" autoComplete="email" required maxLength={254} placeholder="you@example.com" /></label></div>
        <div className="form-row"><label>What are you planning? <span className="field-hint">Required</span><select name="eventType" value={eventType} onChange={(event) => { setEventType(event.target.value); setSelectedPackage('') }} required aria-describedby="event-type-help"><option value="">Choose a session</option><option>Wedding</option><option>Portrait session</option><option>Travel</option><option>Commercial photography</option><option>Street photography</option><option>Something else</option></select><span className="sr-only" id="event-type-help">Choose the kind of photography you are interested in.</span></label><label>Date <span className="field-hint">Optional</span><input name="eventDate" type="date" aria-describedby="date-hint" /><span className="sr-only" id="date-hint">You can leave this blank if your date is not set.</span></label></div>
        {eventType === 'Portrait session' && <div className="form-row"><label>Preferred setting <span className="field-hint">Optional</span><select name="setting"><option value="">Choose a setting</option><option>Studio</option><option>Outdoor</option><option>At home</option><option>Somewhere meaningful to me</option></select></label><label>Preferred location <span className="field-hint">Optional</span><input name="location" maxLength={140} placeholder="Neighbourhood, park, studio…" /></label></div>}
        {eventType === 'Travel' && <label>Destination <span className="field-hint">Optional</span><input name="location" maxLength={140} placeholder="City, region or route" /></label>}
        {(eventType === 'Something else' || !eventType) && <label>Location or venue <span className="field-hint">Optional</span><input name="location" maxLength={140} placeholder="Where would you like to meet?" /></label>}
        <div className="booking-addons"><span className="eyebrow">PERSONALISE YOUR COLLECTION</span><div className="form-row"><label>Editing look <span className="field-hint">Optional</span><select name="editingStyle"><option value="">Choose a preference</option><option>Clean, modern digital</option><option>Warm, film-inspired</option><option>Let’s decide together</option></select></label><label className="addon-check"><input type="checkbox" name="videoHighlight" /><span><strong>Short video highlight</strong><small>Ask about a 30–60 second reel; quoted with your collection.</small></span></label></div></div>
        <label>Venue or preferred location <span className="field-hint">Optional</span><input name="venue" maxLength={160} placeholder="Venue, city or setting" /></label>
        <div className="form-row"><label>Coverage you have in mind <span className="field-hint">Optional</span><input name="coverage" maxLength={120} placeholder="A few hours, full day…" /></label>{eventType === 'Wedding' && <label>Approximate guest count <span className="field-hint">Optional</span><input name="guestCount" type="number" min="1" max="10000" inputMode="numeric" placeholder="About how many?" /></label>}</div>
        <div className="form-row"><label>Budget range <span className="field-hint">Optional</span><select name="budget"><option value="">Prefer to discuss</option><option>Under AUD $1,000</option><option>AUD $1,000–$2,500</option><option>AUD $2,500–$4,500</option><option>AUD $4,500–$7,500</option><option>AUD $7,500+</option><option>Not sure yet</option></select></label><label>How did you find Olive Lane? <span className="field-hint">Optional</span><select name="referralSource"><option value="">Choose if you like</option><option>Instagram</option><option>Google</option><option>Friend or family</option><option>Venue or vendor</option><option>Other</option></select></label></div>
        <label>What matters most to you? <span className="field-hint">Optional</span><textarea name="priorities" maxLength={1500} rows={3} placeholder="Moments, people, style, accessibility or other needs…" /></label>
        <label>Anything else? <span className="field-hint">Optional</span><textarea name="message" maxLength={3000} rows={3} placeholder="The place, the people, the feeling…" /></label>
        <button className="contact-button" type="submit" disabled={formState === 'sending'}>{formState === 'sending' ? 'Sending…' : 'Send your note'} <span aria-hidden="true">↗</span></button>
        {formState === 'sent' ? <div className="form-result" role="status" aria-live="polite"><strong>Your note has been received.</strong><p>You’ll hear back by email within two business days. Your date isn’t reserved until you review and agree to the booking details.</p></div> : formState === 'error' ? <div className="form-result form-error" role="alert"><strong>Your note couldn’t be sent.</strong><p>Please check the required fields and try again. If it keeps failing, email <a href="mailto:hello@olivelane.photo?subject=Photography%20inquiry">customer care</a>.</p></div> : <p className="reply-note">Date and guest count are optional. I’ll reply within two business days.</p>}
      </form></section>

      <footer className="footer"><a className="wordmark" href="#home">OLIVE LANE<span>PHOTOGRAPHY</span></a><span>MADE WITH CARE, IN MELBOURNE</span><div><a href="#contact">ENQUIRE</a><a href="#portfolio">PORTFOLIO ↗</a><label className="appearance-setting"><span>APPEARANCE</span><select aria-label="Appearance" value={appearance} onChange={(event) => setAppearance(event.target.value as 'default' | 'night')}><option value="default">Light</option><option value="night">Night</option></select></label><span>© {new Date().getFullYear()} OLIVE LANE PHOTOGRAPHY · ALL RIGHTS RESERVED</span></div><p className="copyright-note">Original Olive Lane photographs and written content are protected by copyright. Do not copy, reproduce, or use them without written permission. Portfolio previews are illustrative stock images and are not represented as client work.</p></footer>
      <section className={`studio-chat ${chatOpen ? 'is-open' : ''}`} aria-label="Olive Lane customer assistant">
        {chatOpen && <div className="chat-panel" role="dialog" aria-modal="false" aria-labelledby="chat-title"><div className="chat-header"><div className="chat-brand"><span className="chat-avatar" aria-hidden="true">OL</span><div><span className="eyebrow">OLIVE LANE · BOOKING STUDIO</span><h2 id="chat-title">A little help, anytime.</h2><span className="chat-presence"><i /> Your photography assistant</span></div></div><button type="button" className="chat-close" onClick={() => setChatOpen(false)} aria-label="Close chat">×</button></div><div className="chat-intro"><p>Ask about collections, destinations, pricing or what happens next. I can help you find a good place to start.</p></div><div className="chat-suggestions" aria-label="Suggested questions">{['Wedding collections', 'Travel destinations', 'What does it cost?'].map((prompt) => <button type="button" key={prompt} disabled={chatSending} onClick={() => { setChatInput(prompt); window.setTimeout(() => document.getElementById('chat-input')?.focus(), 0) }}>{prompt}</button>)}</div><div className="chat-messages" aria-live="polite" aria-relevant="additions">{chatMessages.map((item, index) => <p className={`chat-bubble ${item.role}`} key={`${index}-${item.role}`}>{item.text}</p>)}{chatSending && <p className="chat-bubble assistant chat-thinking" role="status"><i /><i /><i /><span className="sr-only">Thinking</span></p>}</div><form className="chat-form" onSubmit={(event) => void sendChat(event)}><label className="sr-only" htmlFor="chat-input">Your question</label><textarea id="chat-input" value={chatInput} onChange={(event) => setChatInput(event.target.value)} onKeyDown={handleChatKeyDown} placeholder="Write your question…" maxLength={900} rows={2} /><button type="submit" aria-label="Send message" disabled={chatSending || chatInput.trim().length < 2}>↗</button></form><p className="chat-privacy">Please don’t share payment details or private information.</p><a className="chat-inquiry-link" href="#contact" onClick={() => setChatOpen(false)}>Ready to enquire? <strong>Tell us about your plans ↗</strong></a></div>}
        <button className="chat-launcher" type="button" aria-expanded={chatOpen} aria-controls="chat-title" onClick={() => setChatOpen(!chatOpen)}><span className="chat-launcher-mark" aria-hidden="true">{chatOpen ? '×' : '✳'}</span>{chatOpen ? 'Close' : 'Chat with Olive Lane'}</button>
      </section>
    </main>
  )
}

function PhotoLikeButton({ photoId }: { photoId: string }) {
  const storageKey = `olive-photo-liked:${photoId}`
  const [liked, setLiked] = useState(() => window.localStorage.getItem(storageKey) === '1')
  function toggleLike() {
    const next = !liked
    setLiked(next)
    if (next) window.localStorage.setItem(storageKey, '1')
    else window.localStorage.removeItem(storageKey)
  }
  return <button className={`photo-like ${liked ? 'is-liked' : ''}`} type="button" aria-pressed={liked} onClick={toggleLike}>{liked ? '♥ Liked' : '♡ Like'}</button>
}

function StoryPage({ story }: { story: PortfolioPhoto }) {
  const frames = photographs.filter((photo) => photo.category === story.category && photo.id !== story.id)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const lightboxCloseRef = useRef<HTMLButtonElement>(null)
  const summaries: Record<string, string> = {
    Weddings: 'A visual study in the atmosphere of an event: anticipation, closeness, and the joyful blur of being together.',
    Portraits: 'A visual study in portraiture: gentle light, a little room to breathe, and the personality found between poses.',
    Travel: 'A visual study in travel: open landscapes, changing light, and the details that make a place linger in memory.',
    Studio: 'A visual study in studio portraiture: considered light, simple backdrops, and space to settle in.',
    Outdoor: 'A visual study in outdoor portraiture: natural light, open air, and settings that invite ease.',
    Commercial: 'A visual study in commercial photography: shape, texture, and purposeful product storytelling.',
    Street: 'A visual study in street photography: passing moments, city patterns, and everyday movement.',
  }
  const summary = summaries[story.category] || summaries.Travel

  useEffect(() => {
    if (lightboxIndex === null) return
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    lightboxCloseRef.current?.focus()
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') setLightboxIndex(null)
      if (event.key === 'ArrowRight') setLightboxIndex((index) => index === null ? 0 : (index + 1) % frames.length)
      if (event.key === 'ArrowLeft') setLightboxIndex((index) => index === null ? 0 : (index - 1 + frames.length) % frames.length)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
      previousFocus?.focus()
    }
  }, [lightboxIndex, frames.length])
  return (
    <main className="story-page" id="story">
      <header className="story-topbar"><a className="wordmark" href="/#home">OLIVE LANE<span>PHOTOGRAPHY</span></a><nav><a href="/#portfolio">← Portfolio</a><a className="nav-cta" href={`/?service=${encodeURIComponent(serviceFromCategory(story.category))}#contact`}>Ask about a session <span>↗</span></a></nav></header>
      <section className="story-hero"><img src={`https://images.unsplash.com/${story.image}?auto=format&fit=crop&w=1500&q=78`} srcSet={[800, 1500, 2100].map((width) => `https://images.unsplash.com/${story.image}?auto=format&fit=crop&w=${width}&q=78 ${width}w`).join(', ')} sizes="100vw" fetchPriority="high" alt={`Editorial ${storyType(story.category)} photograph`} /><div className="story-hero-copy"><span className="eyebrow light">EDITORIAL IMAGE STUDY · {story.category.toUpperCase()}</span><h1>{story.title}</h1><p>Location idea · {story.place}<br />Best light · {story.time}</p></div></section>
      <section className="story-intro"><span className="story-label">IMAGE STUDY · {story.category.toUpperCase()}</span><h2>A feeling-first approach<br /><em>to {storyType(story.category)} photography.</em></h2><p>{summary}</p><p className="story-disclosure">The photographs here are stock imagery used to present the studio’s visual direction. They are not Olive Lane client photographs. Commissioned galleries will show original work shared with permission.</p></section>
      <section className="story-gallery" aria-label={`${story.category} editorial image study`}>
        {frames.map((photo, index) => <figure className={`story-frame story-frame-${index + 1}`} key={photo.id}><button className="story-frame-open" type="button" onClick={() => setLightboxIndex(index)} aria-label={`Enlarge image ${index + 1}: ${photo.title}`}><img src={`https://images.unsplash.com/${photo.image}?auto=format&fit=crop&w=900&q=76`} srcSet={[520, 900, 1300].map((width) => `https://images.unsplash.com/${photo.image}?auto=format&fit=crop&w=${width}&q=76 ${width}w`).join(', ')} sizes="(max-width: 700px) 86vw, 40vw" alt={`Illustrative ${storyType(photo.category)} image: ${photo.title}`} loading="lazy" decoding="async" /></button><figcaption><span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><strong>{photo.title}</strong><p>{photo.description}</p><p className="story-context"><a href={photo.locationUrl} target="_blank" rel="noreferrer">{photo.place} ↗</a><span>{photo.time}</span></p><div className="photo-meta"><span>Location idea · Best light</span><PhotoLikeButton photoId={photo.id} /></div></figcaption></figure>)}
      </section>
      {lightboxIndex !== null && <div className="lightbox" role="dialog" aria-modal="true" aria-label={`${story.category} image gallery`} onClick={() => setLightboxIndex(null)}><button ref={lightboxCloseRef} className="lightbox-close" type="button" aria-label="Close enlarged image" onClick={() => setLightboxIndex(null)}>×</button><button className="lightbox-nav lightbox-previous" type="button" aria-label="Previous image" onClick={(event) => { event.stopPropagation(); setLightboxIndex((lightboxIndex - 1 + frames.length) % frames.length) }}>←</button><figure className="lightbox-figure" onClick={(event) => event.stopPropagation()}><img src={`https://images.unsplash.com/${frames[lightboxIndex].image}?auto=format&fit=crop&w=2000&q=88`} alt={`Illustrative image: ${frames[lightboxIndex].title}`} /><figcaption>{frames[lightboxIndex].description}<span>{lightboxIndex + 1} / {frames.length}</span></figcaption></figure><button className="lightbox-nav lightbox-next" type="button" aria-label="Next image" onClick={(event) => { event.stopPropagation(); setLightboxIndex((lightboxIndex + 1) % frames.length) }}>→</button></div>}
      <section className="story-outro"><span className="eyebrow">A STORY THAT FEELS LIKE YOURS</span><h2>Tell me what you’re <em>planning.</em></h2><p>Share a date, a location and a few details about what matters to you. I’ll reply with availability and the next steps.</p><a className="contact-button" href={`/?service=${encodeURIComponent(serviceFromCategory(story.category))}#contact`}>Ask about {storyType(story.category)} photography <span>↗</span></a><a className="story-back" href="/#portfolio">← Back to the portfolio</a></section>
    </main>
  )
}

function AdminDashboard() {
  const [token, setToken] = useState(sessionStorage.getItem('olive-admin-token-v2') || '')
  const [password, setPassword] = useState('')
  const [authenticatorCode, setAuthenticatorCode] = useState('')
  const [loginEnabled, setLoginEnabled] = useState(true)
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [overview, setOverview] = useState({ total: 0, new: 0, booked: 0, upcoming: 0, notificationIssues: 0 })
  const [filter, setFilter] = useState('')
  const [error, setError] = useState('')
  const [siteReview, setSiteReview] = useState('')
  const [siteReviewLoading, setSiteReviewLoading] = useState(false)
  const [siteReviewError, setSiteReviewError] = useState('')
  const [retryingNotificationId, setRetryingNotificationId] = useState<number | null>(null)

  useEffect(() => {
    fetch(`${API_URL}/security-config`).then((response) => response.json())
      .then((config) => setLoginEnabled(Boolean(config.adminLoginEnabled)))
      .catch(() => setLoginEnabled(false))
  }, [])

  const api = useCallback(async (path: string, options: RequestInit = {}) => {
    const response = await fetch(`${API_URL}${path}`, { ...options, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, ...options.headers } })
    const data = await response.json()
    if (!response.ok) throw new Error(data.message || 'Request failed')
    return data
  }, [token])

  const load = useCallback(async () => {
    try {
      const [summary, records] = await Promise.all([api('/admin/overview'), api(`/admin/inquiries${filter ? `?status=${filter}` : ''}`)])
      setOverview(summary.stats); setInquiries(records); setError('')
    } catch (err) { setError(err instanceof Error ? err.message : 'Unable to load inquiries') }
  }, [api, filter])

  useEffect(() => { if (token) void load() }, [load, token])

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    try {
      const response = await fetch(`${API_URL}/admin/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password, authenticatorCode }) })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message)
      sessionStorage.setItem('olive-admin-token-v2', data.token); setToken(data.token); setError('')
    } catch (err) { setError(err instanceof Error ? err.message : 'Sign in failed') }
  }

  async function update(id: number, values: Partial<Inquiry>) {
    try { await api(`/admin/inquiries/${id}`, { method: 'PATCH', body: JSON.stringify(values) }); await load() }
    catch (err) { setError(err instanceof Error ? err.message : 'Update failed') }
  }

  async function retryNotification(id: number) {
    setRetryingNotificationId(id)
    try {
      await api(`/admin/inquiries/${id}/retry-notification`, { method: 'POST', body: JSON.stringify({}) })
      await load()
    } catch (err) { setError(err instanceof Error ? err.message : 'Notification retry failed') }
    finally { setRetryingNotificationId(null) }
  }

  async function addBlockedDate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const data = new FormData(event.currentTarget)
    try { await api('/admin/blocked-dates', { method: 'POST', body: JSON.stringify(Object.fromEntries(data.entries())) }); event.currentTarget.reset() }
    catch (err) { setError(err instanceof Error ? err.message : 'Could not block date') }
  }

  async function requestSiteReview() {
    setSiteReviewLoading(true)
    setSiteReviewError('')
    setSiteReview('')
    try {
      const result = await api('/admin/site-review', { method: 'POST', body: JSON.stringify({}) })
      setSiteReview(result.review)
    } catch (err) {
      setSiteReviewError(err instanceof Error ? err.message : 'Could not request a website review')
    } finally {
      setSiteReviewLoading(false)
    }
  }

  if (!token) return <main className="admin-page"><a className="wordmark" href="#home">OLIVE LANE<span>PHOTOGRAPHY</span></a><form className="admin-login" onSubmit={login}><span className="eyebrow">PRIVATE STUDIO · TWO-STEP SIGN-IN</span><h1>Welcome <em>back.</em></h1><label>Admin password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required autoComplete="current-password" /></label><label>6-digit authenticator code<input type="text" inputMode="numeric" pattern="[0-9]{6}" maxLength={6} value={authenticatorCode} onChange={(event) => setAuthenticatorCode(event.target.value.replace(/\D/g, '').slice(0, 6))} required autoComplete="one-time-code" placeholder="000000" /></label><p className="admin-security-note">Enter the current code from your authenticator app. Sign-in is rate-limited after repeated failed attempts.</p><button className="contact-button" disabled={!loginEnabled}>Sign in securely <span>↗</span></button>{!loginEnabled && <p className="admin-error">Admin sign-in is not configured yet. Set up the password, token secret, and authenticator secret in the backend environment.</p>}{error && <p className="admin-error">{error}</p>}</form></main>

  return <main className="admin-page"><header className="admin-header"><div><span className="eyebrow">OLIVE LANE · STUDIO</span><h1>Inquiries <em>& bookings.</em></h1></div><div className="admin-actions"><a className="text-link" href={`${API_URL}/admin/inquiries.csv`} onClick={async (event) => { event.preventDefault(); const response = await fetch(`${API_URL}/admin/inquiries.csv`, { headers: { Authorization: `Bearer ${token}` } }); if (response.ok) { const blob = await response.blob(); const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href=url; link.download='olive-lane-inquiries.csv'; link.click(); URL.revokeObjectURL(url) } }}>Export CSV ↗</a><button className="admin-signout" onClick={() => { sessionStorage.removeItem('olive-admin-token-v2'); setToken('') }}>Sign out</button></div></header>
    {error && <p className="admin-error">{error}</p>}
    <section className="site-review-card" aria-labelledby="site-review-title"><div><span className="eyebrow">PRIVATE STUDIO · AI DESIGN REVIEW</span><h2 id="site-review-title">Make the website feel more professional.</h2><p>Ask Gemini for prioritized design and booking-flow recommendations using the site details and anonymous inquiry totals.</p><p className="site-review-privacy">Customer names, emails, dates, messages, venues, and private notes are never sent.</p></div><button className="contact-button" type="button" onClick={() => void requestSiteReview()} disabled={siteReviewLoading}>{siteReviewLoading ? 'Reviewing…' : 'Ask AI for recommendations'} <span aria-hidden="true">↗</span></button>{siteReviewError && <p className="admin-error" role="alert">{siteReviewError}</p>}{siteReview && <div className="site-review-result" aria-live="polite"><h3>Website review</h3><div>{siteReview}</div></div>}</section>
    <div className="stats-grid">{[['All inquiries', overview.total], ['New notes', overview.new], ['Booked', overview.booked], ['Upcoming sessions', overview.upcoming], ['Email attention', overview.notificationIssues]].map(([label, value]) => <div className="stat-card" key={label}><span>{label}</span><strong>{value}</strong></div>)}</div>
    <div className="admin-toolbar"><label>Show<select value={filter} onChange={(event) => setFilter(event.target.value)}><option value="">All inquiries</option><option value="new">New</option><option value="replied">Replied</option><option value="booked">Booked</option><option value="archived">Archived</option><option value="notification-issues">Email delivery needs attention</option></select></label><form className="block-date-form" onSubmit={addBlockedDate}><label>Block a date<input name="date" type="date" required /></label><label>Note<input name="note" placeholder="Optional note" maxLength={200} /></label><button className="contact-button">Block date</button></form></div>
    <section className="inquiry-list">{inquiries.length ? inquiries.map((item) => <article className="inquiry-card" key={item.id}><div className="inquiry-top"><div><span className="eyebrow">{item.eventType || 'Photography inquiry'} · {new Date(item.createdAt).toLocaleDateString()}</span><h2>{item.name}</h2><a href={`mailto:${item.email}`}>{item.email}</a></div><select value={item.status} onChange={(event) => void update(item.id, { status: event.target.value })}><option value="new">New</option><option value="replied">Replied</option><option value="booked">Booked</option><option value="archived">Archived</option></select></div><section className={`notification-panel notification-${item.notificationStatus}`} aria-live="polite"><div><strong>Notification · {item.notificationStatus === 'sent' ? 'Accepted by Resend' : item.notificationStatus === 'failed' ? 'Failed' : item.notificationStatus === 'sending' ? 'Sending' : item.notificationStatus === 'pending' ? 'Pending' : 'Not tracked for this inquiry'}</strong>{item.notificationResponseStatus !== null && <span>Resend HTTP {item.notificationResponseStatus}</span>}{item.notificationAttempts > 0 && <span>{item.notificationAttempts} attempt{item.notificationAttempts === 1 ? '' : 's'}</span>}</div>{item.notificationError && <p>{item.notificationError}</p>}{(['pending', 'failed'].includes(item.notificationStatus) || (item.notificationStatus === 'sending' && item.notificationLastAttemptAt && Date.now() - new Date(item.notificationLastAttemptAt).getTime() > 5 * 60 * 1000)) && <button className="notification-retry" type="button" onClick={() => void retryNotification(item.id)} disabled={retryingNotificationId === item.id}>{retryingNotificationId === item.id ? 'Retrying…' : item.notificationStatus === 'pending' ? 'Send notification' : 'Retry notification'}</button>}</section><div className="inquiry-meta"><span>Event date: {item.eventDate || 'Not set'}</span><span>Guests: {item.guestCount || 'Not set'}</span><span>Budget: {item.budget || 'Not set'}</span>{item.venue && <span>Venue: {item.venue}</span>}{item.coverage && <span>Coverage: {item.coverage}</span>}{item.referralSource && <span>Found via: {item.referralSource}</span>}</div><p>{item.message}</p><label>Private notes<textarea defaultValue={item.adminNotes} rows={2} placeholder="Add a follow-up note…" onBlur={(event) => { if (event.target.value !== item.adminNotes) void update(item.id, { adminNotes: event.target.value }) }} /></label></article>) : <p className="empty-state">No inquiries in this view yet.</p>}</section><a className="admin-back" href="#home">← Back to website</a></main>
}

export default App

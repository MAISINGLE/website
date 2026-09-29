export type StudioProfile = {
  name: string
  photographer: string
  base: string
  contactEmail: string
  responseWindow: string
  serviceArea: string
}

export type StudioFaq = {
  id: string
  category?: string
  question: string
  answer: string
  keywords: string[]
  sourceLabel: string
  href: string
}

export type StudioPackage = {
  id: string
  name: string
  category: string
  hours: string
  deliverables: string
  priceFrom: number
  currency: string
  description: string
  inclusions: string[]
  locationIdeas: string[]
}

export const studioProfile: StudioProfile = {
  name: 'Olive Lane Photography',
  photographer: 'Nam Vu',
  base: 'Melbourne, Australia',
  contactEmail: 'hello@olivelane.photo',
  responseWindow: 'within two business days',
  serviceArea: 'Melbourne, across Australia, and for selected destination work overseas',
}

export const studioPackages: StudioPackage[] = [
  {
    id: 'intimate', name: 'The Intimate', category: 'Weddings', hours: '6 hours', deliverables: '350+ edited images', priceFrom: 2800, currency: 'AUD',
    description: 'For heartfelt celebrations, with room for the moments that matter most.',
    inclusions: ['Six hours of wedding photography', '350+ edited images', 'Planning call and timeline guidance', 'Private online gallery'],
    locationIdeas: ['Royal Botanic Gardens', 'Fitzroy Gardens', 'Abbotsford Convent', 'Carlton Gardens'],
  },
  {
    id: 'full-day', name: 'The Full Story', category: 'Weddings', hours: '10 hours', deliverables: '650+ edited images', priceFrom: 4200, currency: 'AUD',
    description: 'A fuller wedding story, from getting ready through to the last dance.',
    inclusions: ['Ten hours of wedding photography', '650+ edited images', 'Planning call and timeline guidance', 'Private online gallery'],
    locationIdeas: ['Melbourne Town Hall', 'Montsalvat', 'Rippon Lea Estate', 'Yarra Valley'],
  },
  {
    id: 'portrait', name: 'The Portrait Session', category: 'Portraits', hours: '90 minutes', deliverables: '60+ edited images', priceFrom: 650, currency: 'AUD',
    description: 'A relaxed portrait session for couples, families, or an individual.',
    inclusions: ['90-minute portrait session', '60+ edited images', 'Studio, outdoor, or at-home setting options', 'Private online gallery'],
    locationIdeas: ['Studio session', 'Royal Botanic Gardens', 'Brighton Beach', 'At home'],
  },
  {
    id: 'destination', name: 'The Faraway', category: 'Travel', hours: 'Custom', deliverables: 'Curated gallery', priceFrom: 1800, currency: 'AUD',
    description: 'A custom story for destination celebrations and travel photography.',
    inclusions: ['Custom coverage planned around your trip', 'Curated edited gallery', 'Planning call and location guidance', 'Private online gallery'],
    locationIdeas: ['Great Ocean Road', 'Grampians', 'Mornington Peninsula', 'Phillip Island'],
  },
]

export const studioFaqs: StudioFaq[] = [
  {
    id: 'services', question: 'What can I book Olive Lane to photograph?',
    answer: 'Olive Lane photographs weddings, portraits, travel stories, commercial projects, and street work. Portfolio previews are illustrative stock studies; commissioned galleries feature original photographs shared with permission.',
    keywords: ['services', 'photography', 'wedding', 'portrait', 'travel', 'commercial', 'street', 'portfolio'], sourceLabel: 'Services and portfolio', href: '#portfolio',
  },
  {
    id: 'collections', question: 'What collections and starting prices are available?',
    answer: 'Current collections and starting prices are listed on the Collections & Pricing page. The final proposal depends on coverage, date, location, travel needs, and any requested additions; commercial, street, and custom projects are quoted individually.',
    keywords: ['price', 'pricing', 'cost', 'collection', 'package', 'budget', 'quote'], sourceLabel: 'Collections and pricing', href: '#packages',
  },
  {
    id: 'availability', question: 'Can you confirm whether my date is available?',
    answer: 'The assistant cannot confirm a date. Send your preferred date through the inquiry form and the studio will check availability before preparing a proposal.',
    keywords: ['available', 'availability', 'date', 'calendar', 'open', 'free'], sourceLabel: 'Booking inquiry', href: '#contact',
  },
  {
    id: 'booking-process', question: 'What happens after I send an inquiry?',
    answer: 'The studio reviews your plans and checks the requested date, then replies by email with next steps and a written proposal when appropriate. An inquiry does not reserve a date or commit you to a booking.',
    keywords: ['after', 'process', 'steps', 'booking', 'book', 'proposal', 'reserve', 'reservation', 'next'], sourceLabel: 'How it works', href: '#experience',
  },
  {
    id: 'payment-methods', question: 'Which payment methods do you accept?',
    answer: 'The inquiry form does not take payment, and payment options are not listed on this website. If you proceed, the written proposal will confirm the accepted payment method, retainer, amount, and due dates. Do not send card numbers or payment credentials through the form or chat.',
    keywords: ['payment method', 'payment', 'pay', 'card', 'credit card', 'bank transfer', 'paypal', 'stripe', 'checkout', 'invoice'], sourceLabel: 'Payment and booking FAQs', href: '#faq',
  },
  {
    id: 'payment-timing', question: 'When is a retainer or payment due?',
    answer: 'Nothing is due when you submit an inquiry. If you decide to book, the written proposal explains the retainer and payment schedule before you agree to the booking.',
    keywords: ['retainer', 'deposit', 'payment due', 'pay', 'due', 'charge', 'cost upfront'], sourceLabel: 'Payment and booking FAQs', href: '#faq',
  },
  {
    id: 'travel', question: 'Are travel and accommodation included?',
    answer: 'Travel and accommodation are not assumed to be included in starting prices. Any travel needed for your location is itemised in the written proposal before you decide to book.',
    keywords: ['travel', 'destination', 'accommodation', 'flight', 'included', 'location'], sourceLabel: 'Travel and coverage', href: '#packages',
  },
  {
    id: 'delivery', question: 'When will I receive my photographs?',
    answer: 'Every collection includes a private online gallery. The estimated delivery window for your date and collection is confirmed in the written proposal.',
    keywords: ['delivery', 'deliver', 'when', 'gallery', 'photos', 'photographs', 'images', 'receive'], sourceLabel: 'Frequently asked questions', href: '#faq',
  },
  {
    id: 'custom-work', question: 'Can I customise a collection or add a video?',
    answer: 'Yes. You can describe the coverage, editing look, accessibility needs, or other priorities in your inquiry. Video highlights, albums, and other additions are discussed and quoted for the project.',
    keywords: ['custom', 'customise', 'customize', 'video', 'reel', 'album', 'editing', 'style', 'accessibility', 'add-on'], sourceLabel: 'Collections and inquiry form', href: '#contact',
  },
  {
    id: 'commercial-work', question: 'Do you photograph brands and businesses?',
    answer: 'Commercial and product photography can be discussed as a project-specific inquiry. Share the intended use, scope, timing, and location so the studio can prepare a suitable quote.',
    keywords: ['brand', 'commercial', 'business', 'product', 'campaign', 'quote'], sourceLabel: 'Commercial inquiries', href: '#contact',
  },
  {
    id: 'contact', question: 'How do I contact the studio?',
    answer: `Email ${studioProfile.contactEmail} or use the booking inquiry form. If you already have a booking, email the studio directly and mention your booking so your message can be routed appropriately.`,
    keywords: ['contact', 'email', 'phone', 'human', 'person', 'speak', 'existing booking', 'care'], sourceLabel: 'Contact Olive Lane', href: '#contact',
  },
  {
    id: 'response-time', question: 'How quickly will the studio reply?',
    answer: `The studio aims to reply by email ${studioProfile.responseWindow}.`,
    keywords: ['reply', 'response', 'respond', 'how long', 'when hear', 'business days', 'waiting'], sourceLabel: 'Contact Olive Lane', href: '#contact',
  },
  {
    id: 'inquiry-details', question: 'What should I include in my inquiry?',
    answer: 'A session type, preferred date if known, location, and a few details about what matters to you are a helpful start. Date and guest count are optional, and you can leave budget or other preferences blank.',
    keywords: ['include', 'inquiry', 'form', 'details', 'information', 'date', 'guest', 'budget'], sourceLabel: 'Booking inquiry form', href: '#contact',
  },
  {
    id: 'inquiry-privacy', question: 'How is my inquiry information used?',
    answer: 'Your name, email, and plans are saved in the studio’s private inquiry system so the studio can follow up. The customer assistant does not read customer inquiry records. Please do not include payment details or highly sensitive information.',
    keywords: ['privacy', 'private', 'data', 'information', 'stored', 'database', 'secure', 'customer details'], sourceLabel: 'Inquiry form and privacy', href: '#contact',
  },
  {
    id: 'changes', question: 'What if I need to reschedule or cancel?',
    answer: 'Please contact the studio as soon as plans change. New date availability, any fees, and how a retainer is handled depend on the written booking terms.',
    keywords: ['reschedule', 'cancel', 'cancellation', 'change date', 'refund', 'retainer'], sourceLabel: 'Booking FAQs', href: '#faq',
  },
  {
    id: 'travel-area', question: 'Where are you based, and do you travel?',
    answer: `Olive Lane is based in ${studioProfile.base} and works across ${studioProfile.serviceArea}. Share your location in the inquiry so travel needs can be included in the proposal.`,
    keywords: ['based', 'melbourne', 'where', 'travel', 'australia', 'overseas', 'destination'], sourceLabel: 'Travel and coverage', href: '#packages',
  },
  {
    id: 'location-ideas', question: 'Which places can I choose for a session?',
    answer: 'The collections page includes location ideas such as Melbourne gardens and heritage venues, Brighton Beach, the Great Ocean Road, the Grampians, and the Yarra Valley. They are suggestions rather than included venue bookings; access, permits, travel and any fees are confirmed in your proposal. You can also suggest a place of your own.',
    keywords: ['place', 'places', 'location', 'locations', 'venue', 'park', 'garden', 'beach', 'included'], sourceLabel: 'Collections and location ideas', href: '#packages',
  },
  {
    id: 'camera-shy', question: 'What if I feel awkward in front of the camera?',
    answer: 'You do not need to know how to pose. The photographer offers gentle direction when it helps, while leaving room for people to relax and be together.',
    keywords: ['camera shy', 'awkward', 'pose', 'nervous', 'comfortable'], sourceLabel: 'The Olive Lane experience', href: '#experience',
  },
  {
    id: 'prints', question: 'Can I order prints or an album?',
    answer: 'Collections include high-resolution images for personal printing in a private online gallery. Albums and print options can be discussed and quoted separately.',
    keywords: ['print', 'prints', 'album', 'albums', 'printing'], sourceLabel: 'Frequently asked questions', href: '#faq',
  },
  {
    id: 'photographer-background', category: 'Photographer and experience', question: 'Who will photograph my session, and what is their experience?',
    answer: 'Nam Vu leads every inquiry and photography session. The website does not list a detailed résumé, years of experience, or qualifications, and its portfolio previews are illustrative stock images rather than client work. Email hello@olivelane.photo if you would like to ask Nam directly about his background or see original work shared with permission.',
    keywords: ['who photographs', 'who will photograph', 'photographer background', 'experience', 'years', 'qualified', 'qualifications', 'résumé', 'portfolio work'], sourceLabel: 'Meet your photographer', href: '#about',
  },
  {
    id: 'second-photographer', category: 'Coverage and options', question: 'Can I request a second photographer?',
    answer: 'You can ask about a second photographer in the inquiry form. Availability and any additional cost are confirmed by the studio in a project proposal; the website does not promise that one will be available.',
    keywords: ['second photographer', 'additional photographer', 'two photographers', 'extra shooter', 'second shooter'], sourceLabel: 'Inquiry options', href: '#contact',
  },
  {
    id: 'permits-and-fees', category: 'Locations and travel', question: 'Are venue fees, permits, and travel included?',
    answer: 'They are not assumed to be included in starting prices. Venue access, permits, travel, and accommodation needs are confirmed and itemised in the written proposal before you decide to book.',
    keywords: ['permit', 'permits', 'venue fee', 'venue fees', 'access fee', 'travel included', 'accommodation included', 'extra costs'], sourceLabel: 'Collections and location ideas', href: '#packages',
  },
  {
    id: 'weather-plan', category: 'Planning and contingencies', question: 'What happens if the weather changes our outdoor plans?',
    answer: 'The website does not publish a weather or rescheduling plan for outdoor sessions. Contact the studio with your location and date so the arrangements can be confirmed for your booking.',
    keywords: ['rain', 'weather', 'bad weather', 'wet weather', 'backup location', 'outdoor plan', 'contingency'], sourceLabel: 'Booking inquiry', href: '#contact',
  },
  {
    id: 'raw-files', category: 'Images and delivery', question: 'Can I receive unedited or RAW files?',
    answer: 'The website describes edited image collections and does not state whether RAW or unedited files are supplied. Ask the studio about this before booking so the answer can be confirmed for your proposal.',
    keywords: ['raw', 'raw files', 'unedited', 'original files', 'source files', 'all photos'], sourceLabel: 'Collections and pricing', href: '#packages',
  },
  {
    id: 'image-usage', category: 'Images and permissions', question: 'Can I share or use my photographs online or for my business?',
    answer: 'The website says collections include a private gallery and high-resolution files for personal printing, but does not publish complete sharing, licensing, or commercial-use terms. Check the written terms with the studio before using images for business or advertising.',
    keywords: ['share online', 'post photos', 'social media', 'instagram photos', 'commercial use', 'licence', 'license', 'copyright', 'image rights', 'usage rights'], sourceLabel: 'Collections and booking inquiry', href: '#contact',
  },
  {
    id: 'booking-contract', category: 'Booking and terms', question: 'Do I receive a contract, and when is my date confirmed?',
    answer: 'The studio provides a written proposal with booking details, and an inquiry alone does not reserve a date. The website does not specify whether there is a separate contract; ask the studio to confirm the documents and terms before you agree to book.',
    keywords: ['contract', 'agreement', 'sign', 'signature', 'date confirmed', 'lock in date', 'secure date', 'reserve date'], sourceLabel: 'How it works', href: '#experience',
  },
  {
    id: 'booking-lead-time', category: 'Booking and availability', question: 'How far in advance should I enquire?',
    answer: 'The website does not publish a minimum booking lead time. Send an inquiry with your preferred date as soon as you can; the studio will check availability and reply with next steps.',
    keywords: ['how far ahead', 'how early', 'advance', 'lead time', 'months before', 'when should i book', 'book early'], sourceLabel: 'Booking inquiry', href: '#contact',
  },
  {
    id: 'photographer-emergency', category: 'Planning and contingencies', question: 'What is the backup plan if the photographer is ill or cannot attend?',
    answer: 'A substitute-photographer or emergency coverage policy is not published on the website. Please ask the studio directly before booking so any applicable arrangements are clear in writing.',
    keywords: ['backup photographer', 'replacement', 'ill', 'sick', 'emergency', 'cannot attend', 'equipment failure', 'backup plan'], sourceLabel: 'Booking inquiry', href: '#contact',
  },
]

export function getRelevantStudioFaqs(message: string, limit = 4) {
  const normalized = message.toLowerCase()
  const words = new Set(normalized.match(/[a-z0-9]{3,}/g) || [])
  return studioFaqs
    .map((faq) => {
      const keywordScore = faq.keywords.reduce((score, keyword) => score + (normalized.includes(keyword) ? 2 : 0), 0)
      const questionScore = [...words].reduce((score, word) => score + (faq.question.toLowerCase().includes(word) ? 1 : 0), 0)
      return { ...faq, score: keywordScore + questionScore }
    })
    .filter((faq) => faq.score > 0)
    .sort((first, second) => second.score - first.score)
    .slice(0, limit)
}

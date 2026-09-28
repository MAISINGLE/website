export type PortfolioPhoto = {
  id: string
  title: string
  category: 'Weddings' | 'Portraits' | 'Travel' | 'Studio' | 'Outdoor' | 'Commercial' | 'Street'
  place: string
  time: string
  image: string
  description: string
  locationUrl: string
}

const series: Array<{
  category: PortfolioPhoto['category']
  titles: string[]
  images: string[]
  places: string[]
  descriptions: string[]
}> = [
  {
    category: 'Weddings',
    titles: ['A garden gathering', 'A moment together', 'Around the table', 'The joyful in-between', 'Vows beneath the trees', 'A flower-lined aisle', 'The first dance', 'A quiet promise', 'The room before everyone arrives', 'The celebration carries on'],
    images: ['photo-1519741497674-611481863552', 'photo-1511285560929-80b456fea0bc', 'photo-1511988617509-a57c8a288659', 'photo-1537633552985-df8429e8048b', 'photo-1773688200380-a85294a92398', 'photo-1736310973291-80fd8ca76404', 'photo-1771254240695-5cf1d2f2f4ec', 'photo-1773021372855-3a57faeed446', 'photo-1765614767515-e76eef559ffc', 'photo-1464366400600-7168b8af9bc3'],
    places: ['Royal Botanic Gardens', 'Fitzroy Gardens', 'Rippon Lea Estate', 'Abbotsford Convent', 'Montsalvat', 'Carlton Gardens', 'Melbourne Town Hall', 'Treasury Gardens', 'State Library Victoria', 'Yarra Valley'],
    descriptions: ['Soft garden light frames the start of the day.', 'A calm portrait keeps the focus on the couple.', 'Table details set the feeling before guests arrive.', 'An unplanned laugh brings the day to life.', 'Greenery and open shade create a gentle ceremony frame.', 'Flowers and a simple aisle make a natural focal point.', 'Warm reception light carries the celebration into evening.', 'A quiet exchange gives the ceremony room to breathe.', 'A considered room detail hints at the day ahead.', 'A wider view gathers the energy of everyone together.'],
  },
  {
    category: 'Portraits',
    titles: ['In a softer light', 'The last of the afternoon', 'A little more like you', 'The way the light finds you', 'A familiar smile', 'A thoughtful pause', 'Easy in your own skin', 'The portrait between poses', 'A little time for yourself', 'Light on the details'],
    images: ['photo-1534528741775-53994a69daeb', 'photo-1524504388940-b1c1722653e1', 'photo-1508214751196-bcfd4ca60f91', 'photo-1500648767791-00dcc994a43e', 'photo-1527980965255-d3b416303d12', 'photo-1507003211169-0a1dd7228f2d', 'photo-1529626455594-4ff0802cfb7e', 'photo-1517841905240-472988babdf9', 'photo-1488426862026-3ee34a7d66df', 'photo-1531123897727-8f129e1688ce'],
    places: ['Royal Botanic Gardens', 'Carlton Gardens', 'Edinburgh Gardens', 'Albert Park', 'Brighton Beach', 'Melbourne CBD', 'Abbotsford Convent', 'Southbank Promenade', 'Fitzroy Gardens', 'St Kilda Pier'],
    descriptions: ['Gentle light and a relaxed gaze keep the portrait simple.', 'A warm late-day tone adds softness without feeling posed.', 'A natural expression makes the frame feel personal.', 'Open shade brings an even, easy light to the face.', 'A close crop draws attention to expression and character.', 'A clean background keeps the portrait calm and focused.', 'A loose pose leaves room for a little movement.', 'The in-between moment feels more like a conversation.', 'A quiet frame gives the subject space to settle.', 'A little texture and light make a simple portrait memorable.'],
  },
  {
    category: 'Travel',
    titles: ['Following the light', 'A little room to wander', 'Out in the open', 'Where the day opens up', 'The lake at first light', 'A path through the green', 'Beyond the ridgeline', 'Still water, wide sky', 'A road into the hills', 'The coast before dusk'],
    images: ['photo-1490750967868-88aa4486c946', 'photo-1470252649378-9c29740c9fa8', 'photo-1464822759023-fed622ff2c3b', 'photo-1500530855697-b586d89ba3ee', 'photo-1501785888041-af3ef285b470', 'photo-1441974231531-c6227db76b6e', 'photo-1469474968028-56623f02e42e', 'photo-1470770841072-f978cf4d019e', 'photo-1473116763249-2faaef81ccda', 'photo-1518837695005-2083093ee35b'],
    places: ['Grampians National Park', 'Great Ocean Road', 'Mount Buffalo', 'Yarra Valley', 'Lake Eildon', 'Dandenong Ranges', 'Victorian High Country', 'Daylesford', 'Mornington Peninsula', 'Phillip Island'],
    descriptions: ['A broad landscape lets the light set the pace.', 'The low sun draws a quiet line across the horizon.', 'A distant ridge gives the view depth and scale.', 'Open space and natural colour make a calm travel frame.', 'Still water mirrors the shapes along the shore.', 'A shaded trail invites a slower look at the details.', 'Clouds and peaks shift the mood across the scene.', 'A simple horizon leaves room for reflection.', 'The winding road turns the landscape into a journey.', 'Coastal texture and soft evening colour close the day.'],
  },
  {
    category: 'Studio',
    titles: ['A portrait in the studio', 'Inside the portrait session', 'The clean backdrop', 'A quiet profile', 'A look in soft focus', 'A moment between frames', 'A simple headshot', 'Light, shaped by hand', 'A modern portrait', 'The studio, pared back'],
    images: ['photo-1540921423588-6137a18070c9', 'photo-1758613654240-e531842faea6', 'photo-1726650680145-d441d5882bdb', 'photo-1605980776566-0486c3ac7617', 'photo-1728323791476-dc693d9a7bf3', 'photo-1521577352947-9bb58764b69a', 'photo-1506794778202-cad84cf45f1d', 'photo-1535713875002-d1d0cf377fde', 'photo-1544005313-94ddf0286df2', 'photo-1488161628813-04466f872be2'],
    places: ['Collingwood studio', 'Fitzroy studio', 'Richmond studio', 'South Melbourne studio', 'Brunswick studio', 'Prahran studio', 'Melbourne CBD studio', 'Northcote studio', 'Port Melbourne studio', 'Carlton studio'],
    descriptions: ['A neutral backdrop keeps the expression at the centre.', 'The working moment shows how gentle direction can help.', 'A clear studio set leaves room for different portrait styles.', 'Controlled light gives the frame a little more contrast.', 'Bright tones make this portrait feel open and fresh.', 'A small gesture adds movement to a simple studio frame.', 'A confident pose works well for a straightforward headshot.', 'A dark background creates a more considered mood.', 'Soft light flatters without taking away the subject’s character.', 'A pared-back composition lets the styling speak.'],
  },
  {
    category: 'Outdoor',
    titles: ['Among the green', 'A hillside afternoon', 'The garden path', 'A little shade to settle in', 'The river bends', 'A walk beneath the trees', 'A clearing in the woods', 'A bright open field', 'The quiet edge of the park', 'Sun through the leaves'],
    images: ['photo-1634597385875-7a0ff386facf', 'photo-1639540431529-8a02d4030dfa', 'photo-1618463744383-bdf28f447513', 'photo-1607239796348-db67387052cd', 'photo-1561642873-f96d911cb887', 'photo-1513986727526-d32d19c2437b', 'photo-1737801154224-8f7b8a1be7a2', 'photo-1511497584788-876760111969', 'photo-1472396961693-142e6e269027', 'photo-1482192596544-9eb780fc7f66'],
    places: ['Yarra Bend Park', 'Westerfolds Park', 'Sherbrooke Forest', 'Studley Park', 'Albert Park Lake', 'Edinburgh Gardens', 'Rippon Lea Gardens', 'Woodlands Historic Park', 'Princes Park', 'Dandenong Ranges'],
    descriptions: ['A riverside setting keeps the portrait relaxed and informal.', 'A green hillside adds colour without crowding the frame.', 'Tree cover creates a soft, natural background.', 'An open patch of shade keeps light even and comfortable.', 'A nearby waterline adds gentle texture behind the subject.', 'A simple park setting leaves room to move between frames.', 'Soft foliage gives this portrait a quiet, seasonal feel.', 'A wider view balances the subject with the open landscape.', 'A tree-lined edge makes a calm place to pause.', 'Filtered sunlight brings a little movement to the background.'],
  },
  {
    category: 'Commercial',
    titles: ['A considered craft', 'Made with intention', 'Botanical, in close', 'A clean product frame', 'Everyday essentials', 'The shape of the object', 'A small brand story', 'Colour and material', 'The beauty of the detail', 'Product, in its element'],
    images: ['photo-1718466044521-d38654f3ba0a', 'photo-1623088274683-7e3a02048e4c', 'photo-1519668963014-2308b08e5e9b', 'photo-1490312278390-ab64016e0aa9', 'photo-1523275335684-37898b6baf30', 'photo-1542291026-7eec264c27ff', 'photo-1572635196237-14b3f281503f', 'photo-1602143407151-7111542de6e8', 'photo-1600185365483-26d7a4cc7519', 'photo-1607082349566-187342175e2f'],
    places: ['Collingwood studio', 'Fitzroy café', 'Richmond studio', 'Melbourne CBD studio', 'South Melbourne studio', 'Prahran studio', 'Carlton lifestyle space', 'Brunswick studio', 'Port Melbourne interior', 'Melbourne retail space'],
    descriptions: ['Soft reflections bring out the glass and shape of the object.', 'A warm surface gives this product frame an everyday feel.', 'Dark tones make the label and silhouette stand out.', 'Simple styling keeps attention on material and form.', 'A close crop gives the accessory a clean editorial feel.', 'A strong colour makes the object easy to notice.', 'A lifestyle context suggests how the product might be used.', 'A clear background helps the packaging read quickly.', 'Texture and form make this frame feel tactile.', 'A considered arrangement gives a product room to breathe.'],
  },
  {
    category: 'Street',
    titles: ['Between the crossings', 'The city in motion', 'A corner at blue hour', 'People passing through', 'The long way home', 'A city in reflection', 'Lines along the avenue', 'A pause at the lights', 'The night shift', 'A familiar street, reframed'],
    images: ['photo-1449824913935-59a10b8d2000', 'photo-1555786456-1e99d24fed39', 'photo-1519501025264-65ba15a82390', 'photo-1514565131-fce0801e5785', 'photo-1480714378408-67cf0d13bc1b', 'photo-1519608487953-e999c86e7455', 'photo-1494522358652-f30e61a60313', 'photo-1517457373958-b7bdd4587205', 'photo-1477959858617-67f85cf4f1df', 'photo-1467269204594-9661b134dd2b'],
    places: ['Flinders Street', 'Bourke Street', 'Hosier Lane', 'Chinatown Melbourne', 'Collins Street', 'Southbank', 'Degraves Street', 'Federation Square', 'Fitzroy', 'Docklands'],
    descriptions: ['A broad street gives the passing crowd a sense of rhythm.', 'A crossing turns an everyday moment into a moving frame.', 'City light changes the feeling of the street after dusk.', 'Bright signs and passing people create an energetic scene.', 'Tall buildings make a strong frame for city movement.', 'Night colour softens into reflections and passing light.', 'A street-level view finds pattern in the everyday.', 'A brief pause lets the city gather around the subject.', 'Architecture and foot traffic share the frame.', 'A familiar block takes on a different mood after dark.'],
  },
]

const timeSuggestions: Record<PortfolioPhoto['category'], string[]> = {
  Weddings: ['Late morning', 'Golden hour', 'Early afternoon', 'Evening', 'Late afternoon', 'Midday', 'After sunset', 'Golden hour', 'Morning', 'Evening'],
  Portraits: ['Soft morning light', 'Golden hour', 'Late afternoon', 'Open shade · midday', 'Early evening', 'Morning', 'Golden hour', 'Late afternoon', 'Soft morning light', 'Early evening'],
  Travel: ['Early morning', 'Golden hour', 'Late afternoon', 'Morning', 'Sunrise', 'Mid-morning', 'Late afternoon', 'Sunrise', 'Golden hour', 'Before sunset'],
  Studio: ['Morning session', 'Early afternoon', 'Midday', 'Late afternoon', 'Morning session', 'Early afternoon', 'Mid-morning', 'Late afternoon', 'Morning session', 'Early afternoon'],
  Outdoor: ['Early morning', 'Golden hour', 'Late afternoon', 'Open shade · midday', 'Early evening', 'Morning', 'Golden hour', 'Late afternoon', 'Soft morning light', 'Before sunset'],
  Commercial: ['Morning studio light', 'Mid-morning', 'Early afternoon', 'Morning session', 'Midday', 'Late afternoon', 'Morning session', 'Early afternoon', 'Mid-morning', 'Late afternoon'],
  Street: ['Morning rush', 'Late afternoon', 'Blue hour', 'Evening', 'Mid-morning', 'After sunset', 'Early afternoon', 'Golden hour', 'Night', 'Blue hour'],
}

export const photographs: PortfolioPhoto[] = series.flatMap((group) =>
  group.images.map((image, index) => ({
    id: `${group.category.toLowerCase()}-${index + 1}`,
    title: group.titles[index],
    category: group.category,
    place: group.places[index],
    time: timeSuggestions[group.category][index],
    description: group.descriptions[index],
    image,
    locationUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${group.places[index]}, Victoria, Australia`)}`,
  })),
)

export const heroImage = 'photo-1519225421980-715cb0215aed'

export const editorialImages = [
  { image: 'photo-1523438885200-e635ba2c371e', alt: 'A quiet wedding celebration in warm light' },
  { image: 'photo-1511895426328-dc8714191300', alt: 'A couple sharing a relaxed outdoor moment' },
  { image: 'photo-1492691527719-9d1e07e534b4', alt: 'A photographer capturing a candid moment' },
  { image: 'photo-1530103862676-de8c9debad1d', alt: 'A lively gathering filled with colour' },
  { image: 'photo-1529636798458-92182e662485', alt: 'A portrait made in soft natural light' },
  { image: 'photo-1515886657613-9f3515b0c78f', alt: 'An editorial fashion portrait' },
  { image: 'photo-1529139574466-a303027c1d8b', alt: 'A contemporary street-style portrait' },
  { image: 'photo-1483985988355-763728e1935b', alt: 'A considered lifestyle detail' },
  { image: 'photo-1524250502761-1ac6f2e30d43', alt: 'A quiet portrait in a natural setting' },
  { image: 'photo-1507504031003-b417219a0fde', alt: 'A celebration seen in soft evening light' },
]

const portfolioImageIds = photographs.map((photo) => photo.image)
const allImageIds = [...portfolioImageIds, heroImage, ...editorialImages.map((photo) => photo.image)]
if (new Set(allImageIds).size !== allImageIds.length) {
  throw new Error('Portfolio, hero, and editorial images must all be unique.')
}

const portfolioCategories = [...new Set(photographs.map((photo) => photo.category))]
if (portfolioCategories.some((category) => photographs.filter((photo) => photo.category === category).length < 10)) {
  throw new Error('Each portfolio category must include at least 10 image studies.')
}

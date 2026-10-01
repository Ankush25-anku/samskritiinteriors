// All site copy and content in one place — edit here, every section updates.
// Images are referenced by slot name — see src/components/Img.jsx and scripts/process-images.mjs.
// Anything in [square brackets] is a placeholder for the owner to fill in — see CONTENT-TODO.md.
// Headlines: *one word* between asterisks becomes the italic coral accent.

/* ---------- the business ---------- */
export const business = {
  name: 'The Samskriti Interiors & Design Studio',
  short: 'Samskriti Interiors',
  since: 2018,
  tagline: 'Clean, modern, signature interiors — delivered on time and within budget.',
  about: 'A young multidisciplinary team of architects and interior designers in Whitefield, Bengaluru. MSME registered, since 2018.',
  address: ['No. 14, 1st Floor, Opposite Pyda Palms Apartment', '80 Feet Road, Belathur, Kadugodi Post', 'Whitefield, Bengaluru, Karnataka 560067'],
  phone: '080954 99968',
  tel: 'tel:+918095499968',
  whatsapp: 'https://wa.me/918095499968',
  directions: 'https://www.google.com/maps/search/?api=1&query=The+Samskriti+Interiors+Belathur+Kadugodi+Whitefield+Bengaluru+560067',
  website: 'www.thesamskriti.com',
  email: '', // [owner to confirm] — shown nowhere until it is filled in
  instagram: '', // [owner to add]
  hours: null, // [owner to confirm] e.g. { days: 'Mon–Sat', open: [10, 19] }
};

// Sections that wait for real content (no invented people or reviews on the site)
export const SHOW_TEAM = false;          // turn on once real names, roles and photos are in `team`
export const SHOW_TESTIMONIALS = false;  // turn on once there are real client reviews in `voices`

/** ₹ in lakh: 4.99 → "₹4.99 L", 12 → "₹12 L", 3.8 → "₹3.8 L" */
export const lakh = (v) => `₹${Number(v.toFixed(2)).toString()} L`;

export const nav = [
  { id: 'studio', label: 'Studio', href: '#studio' },
  { id: 'services', label: 'Services', href: '#services' },
  { id: 'work', label: 'Work', href: '#work' },
  { id: 'process', label: 'Process', href: '#process' },
  { id: 'contact', label: 'Contact', href: '#contact' },
];

/* ---------- hero storyboard — one scene per screen ---------- */
export const story = [
  { id: 'line', title: 'Line', headline: ['It starts', 'with a *line*.'] },
  { id: 'sketch', title: 'Sketch', headline: ['Then', 'a *sketch*.'], callout: 'Lumen · brushed brass' },
  { id: 'detail', title: 'Detail', headline: ['Then every', '*detail*.'] },
  { id: 'home', title: 'Home', headline: ['Then', 'your *home*.'] },
  { id: 'light', title: 'Light', headline: ['From line', 'to *light*.'] },
];

export const heroCopy = {
  eyebrow: 'Whitefield, Bengaluru · Since 2018',
  roomAlt: 'A 3D living room drawn in real time: an arched window at dusk, a curved sofa, a round table and Lumen, a brass pendant lamp, lighting the room',
  hint: 'hold the light · move your cursor',
  hintTouch: 'drag to swing the lamp · tap to switch it off',
  photoAlt: 'A bright living room: two cream sofas, an oak block coffee table, an olive tree and framed art on a pale wall',
  cta: [{ label: 'View our work', href: '#work' }, { label: 'Book a free consultation', href: '#contact' }],
};

// Scene 03: the finishes that settle under the lamp (what each is for, not a code)
export const specChips = [
  { id: 'brass', name: 'Brass hardware', role: 'Handles', cls: 'sw-brass' },
  { id: 'quartz', name: 'Quartz', role: 'Countertop', img: 'material-stone' },
  { id: 'veneer', name: 'Oak veneer', role: 'Shutters', cls: 'sw-oak' },
];

// Lumen — the brass pendant that carries the story down the page.
export const lumen = {
  name: 'Lumen',
  dims: { width: 'Ø 480', drop: '1 200' }, // the lamp's own drawing, scene 03
  footerNote: 'lights out. see you soon.',
};

/* ---------- studio (manifesto) ---------- */
export const manifesto = {
  eyebrow: 'The studio',
  // read by lamplight: plain words, and three phrases that carry a red-pen mark
  text: ['Samskriti', 'means', { mark: 0, words: ['refinement.'] }, 'We', 'design', 'homes', 'that', 'feel', 'calm,', { mark: 1, words: ['crafted'] }, 'and', { mark: 2, words: ['completely', 'yours.'] }],
  lead: 'Clean, modern, signature interiors — delivered on time and within budget, by a young team of architects and interior designers.',
  note: '— the Samskriti studio, Whitefield',
  link: 'See how we work →',
  studiesLabel: 'Morning · afternoon · evening',
  stampsLabel: 'What we design',
};
export const tape = ['Whitefield', 'Bengaluru', 'Since 2018', 'MSME registered', 'On time', 'Within budget'];
export const stamps = ['Modular kitchens', 'Wardrobes', 'Villas', 'Full-home interiors', 'Offices', 'Lighting'];
export const lightStudies = [
  { time: 'morning', caption: 'morning light', grade: 'cool' },
  { time: 'afternoon', caption: 'afternoon', grade: 'neutral' },
  { time: 'evening', caption: 'evening, one lamp', grade: 'night' },
];

/* ---------- services — five rooms, lit one at a time ---------- */
export const services = [
  { n: 1, title: 'Full-home interiors', img: 'svc-residential', alt: 'A bright living room with a cream sofa, a stone wall and a garden view',
    desc: 'Complete interiors for apartments and 3BHK homes — planned, designed and delivered turnkey, from the first measurement to handover.',
    tags: ['Space planning & 3D design', 'Furniture, ceilings & lighting', 'Turnkey execution & handover'], pin: [235, 240] },
  { n: 2, title: 'Modular kitchens', img: 'svc-kitchen', alt: 'A modular kitchen with a gas hob, a chimney and a tiled backsplash',
    desc: 'Kitchens planned around how you cook: storage that works, finishes that last and a layout that suits your home.',
    tags: ['Layout & storage planning', 'Cabinets, shutters & countertops', 'Hardware & appliance planning'], pin: [645, 170] },
  { n: 3, title: 'Wardrobes & bedrooms', img: 'svc-wardrobe', alt: 'A calm bedroom with light wooden wardrobes',
    desc: 'Custom wardrobes and cabinetry built to your room and your routine — and bedrooms that feel calm and uncluttered.',
    tags: ['Custom wardrobes & lofts', 'Beds, side tables & storage', 'Laminate, veneer or PU finishes'], pin: [635, 365] },
  { n: 4, title: 'Villa interiors', img: 'svc-villa', alt: 'A double-height villa living room opening onto a garden',
    desc: 'Larger homes designed as one story — living, dining, bedrooms and outdoor spaces with one consistent, signature feel.',
    tags: ['Whole-villa design concept', 'Custom furniture & lighting', 'Material & finish selection'], pin: [170, 505] },
  { n: 5, title: 'Commercial & office spaces', img: 'svc-workplace', alt: 'An office with oak-framed glass rooms, plants and artwork',
    desc: 'Offices and commercial spaces that work hard and look calm — with zones, storage and lighting planned for your team.',
    tags: ['Workspace planning', 'Reception & meeting rooms', 'Lighting & acoustics'], pin: [560, 555] },
];
export const servicesIntro = {
  label: 'Services',
  lines: ['Five rooms.', 'One *studio*.'],
  note: '↓ scroll to switch on each room',
  establishing: { slot: 'svc-dusk', alt: 'A bedroom at dusk with the lights off' },
  cta: 'Talk to us about this',
};

/* ---------- in numbers — only true ones ---------- */
export const statsCopy = { eyebrow: 'In numbers', lines: ['Since 2018,', 'to *scale*.'], note: 'measured, not claimed ↘' };
export const stats = [
  { k: 'Designing since', n: 2018, w: 0.5, d: 'Established in Whitefield, Bengaluru. MSME registered.' },
  { k: 'Design services', n: 50, s: '+', w: 0.72, d: 'From a single wardrobe to a complete villa.' },
  { k: 'Full 3BHK interiors from', n: 4.99, dec: 2, pre: '₹', s: ' L', w: 1, d: 'Most projects fall between ₹3.8 lakh and ₹50 lakh.' },
  { k: 'Homes delivered', n: null, s: '+', w: 0.86, d: '[owner to add the number of homes delivered]' }, // hidden while n is null
];

/* ---------- selected work ---------- */
export const projects = [
  { id: 'banashankari', name: 'Luxury Villa', loc: 'Banashankari, Bengaluru', scope: 'Villa interiors', area: '[area]', dur: '[duration]', year: '[year]',
    photo: 'villa', alt: '[placeholder photo — replace with the Banashankari villa]', drawing: 'villa-drawing' },
  { id: 'thanisandra', name: 'Ultima Smart Homes', loc: 'Thanisandra, Bengaluru', scope: 'Apartment interiors', area: '[area]', dur: '[duration]', year: '[year]',
    photo: 'bedroom', alt: '[placeholder photo — replace with Ultima Smart Homes]', drawing: 'bedroom-drawing' },
  { id: 'bengaluru', name: 'Residential Interiors', loc: 'Bengaluru', scope: 'Full-home interiors', area: '[area]', dur: '[duration]', year: '[year]',
    photo: 'dining', alt: '[placeholder photo — replace with this residence]', drawing: 'dining-drawing' },
];
export const workIntro = {
  label: 'Selected work',
  lines: ['Drawn.', 'Then *built*.'],
  note: '← same room, drawing and built',
  badge: 'View project ↗',
};

/* ---------- process — four steps, one room built on screen ---------- */
export const phases = [
  { n: 1, t: 'Consultation & site measurement', len: '[duration]', label: 'Consultation · measurement', visual: 'survey', lamp: ['line'],
    s: 'We visit your home, measure every wall and window, and understand how you live and what you want to spend.' },
  { n: 2, t: 'Design & 3D visualisation', len: '[duration]', label: 'Design · 3D', visual: 'moodboard', lamp: ['sketch'],
    s: 'Layouts, a moodboard and 3D views of every room — so you see your home before anything is made.' },
  { n: 3, t: 'Materials, finishes & final quote', len: '[duration]', label: 'Materials · final quote', visual: 'render', lamp: ['spec', 'built'],
    s: 'You choose laminates, veneers, stone and hardware with us, and receive a detailed final quote.' },
  { n: 4, t: 'Execution & handover', len: '[duration]', label: 'Execution · handover', visual: 'handover', lamp: ['lit'],
    s: 'We build, install and finish your home — then hand it over, on time and within budget.' },
];
export const processIntro = {
  label: 'How we work',
  lines: ['Four steps', 'to your *keys*.'],
  note: '↑ you see every room in 3D before anything is built',
  survey: [{ x: 20, y: 18, t: '2 800' }, { x: 8, y: 58, t: '3 600' }, { x: 86, y: 14, t: 'N ↑' }, { x: 58, y: 70, t: '+0.00' }],
  moodboard: [
    { slot: 'detail', x: 6, y: 9, w: 24, r: -6 },
    { slot: 'material-stone', x: 34, y: 5, w: 19, r: 3 },
    { cls: 'sw-oak', x: 57, y: 12, w: 19, r: -3 },
    { cls: 'sw-brass', x: 20, y: 54, w: 17, r: 5 },
    { cls: 'sw-pu', x: 44, y: 50, w: 17, r: -4 },
  ],
  render: '3D view',
  stamp: 'Handed over ✓',
};

/* ---------- materials — the sample table ---------- */
export const materialsCopy = {
  eyebrow: 'Materials',
  lines: ['Touch it before', 'you *choose* it.'],
  lead: 'Laminates, veneers, quartz, PU finishes, fluted panels and brass hardware — see and feel them at our Whitefield studio. Build a box of three here and bring it to your consultation.',
  box: 'Your sample box',
  boxHint: 'Drag up to three samples here',
  boxHintTouch: 'Tap + on up to three samples',
  add: 'Add to sample box',
  use: 'Use this palette in my brief',
  flip: 'Turn over for details',
  tableHint: 'drag samples into your box · click one to turn it over ↻',
  tableHintTouch: 'tap a sample to turn it over ↻ · + to box it',
  back: { best: 'Best for', finish: 'Finish', lead: 'Lead time', pairs: 'Pairs well with' },
};
export const materials = [
  { code: 'laminate', name: 'Matte laminate', short: 'Laminate', meta: 'Wardrobes · shutters', cls: 'sw-laminate', rot: -42, best: 'Wardrobes, kitchen shutters', finish: 'Matte, easy to clean', lead: '[confirm]', pairs: 'Oak veneer, brass hardware' },
  { code: 'veneer', name: 'Oak veneer', short: 'Veneer', meta: 'Wardrobe fronts · panels', cls: 'sw-oak', rot: -26, best: 'Wardrobe fronts, wall panels', finish: 'Natural grain, lacquered', lead: '[confirm]', pairs: 'Matte laminate, quartz' },
  { code: 'quartz', name: 'Quartz', short: 'Quartz', meta: 'Countertops · vanities', img: 'material-stone', rot: -10, best: 'Kitchen countertops, vanities', finish: 'Polished or honed', lead: '[confirm]', pairs: 'PU finish, brass hardware' },
  { code: 'pu', name: 'PU finish', short: 'PU', meta: 'Shutters · feature units', cls: 'sw-pu', rot: 6, best: 'Kitchen shutters, feature units', finish: 'Smooth paint, matte or gloss', lead: '[confirm]', pairs: 'Quartz, fluted panels' },
  { code: 'fluted', name: 'Fluted panels', short: 'Fluted', meta: 'TV walls · wardrobes', cls: 'sw-fluted', rot: 22, best: 'TV walls, wardrobes, doors', finish: 'Ribbed veneer or laminate', lead: '[confirm]', pairs: 'Brass hardware, oak veneer' },
  { code: 'brass', name: 'Brass hardware', short: 'Brass', meta: 'Handles · profiles', cls: 'sw-brass', rot: 38, best: 'Handles, profiles, fittings', finish: 'Brushed, lacquered', lead: '[confirm]', pairs: 'Oak veneer, PU finish' },
];

/* ---------- team — hidden until real people are added (SHOW_TEAM) ---------- */
export const teamCopy = { eyebrow: 'Team', lines: ['The people', 'on *site*.'], hint: 'click a card to read their site diary ↓', diary: 'Site diary', now: 'On site now', fav: 'Favourite material', back: 'Turn the card back' };
export const team = [
  { name: '[Name]', role: 'Principal designer', id: 'principal', img: 'team-1', sig: '[Name]', diary: { project: '[current project]', material: { name: 'Oak veneer', cls: 'sw-oak' }, words: '[a line in their own words]' } },
  { name: '[Name]', role: 'Architect', id: 'architect', img: 'team-2', sig: '[Name]', diary: { project: '[current project]', material: { name: 'Quartz', img: 'material-stone' }, words: '[a line in their own words]' } },
  { name: '[Name]', role: 'Interior designer', id: 'designer', img: 'team-3', sig: '[Name]', diary: { project: '[current project]', material: { name: 'PU finish', cls: 'sw-pu' }, words: '[a line in their own words]' } },
  { name: '[Name]', role: 'Site supervisor', id: 'site', img: 'team-4', sig: '[Name]', diary: { project: '[current project]', material: { name: 'Brass hardware', cls: 'sw-brass' }, words: '[a line in their own words]' } },
];

/* ---------- testimonials — hidden until there are real reviews (SHOW_TESTIMONIALS) ---------- */
export const voicesCopy = { eyebrow: 'Client notes', lines: ['Their words,', '*not* ours.'], seal: ['[rating]', '[number] reviews'], prev: 'Previous note', next: 'Next note', drag: 'drag a note — it springs back to its pin' };
export const voices = [
  { id: 'a', room: 'villa', roomName: '[project]', pin: [50, 50], pinLabel: '[spot]', q: '[a real client review]', name: '[Client name]', role: '[Homeowner · area]', img: 'team-3', r: -3 },
  { id: 'b', room: 'bedroom', roomName: '[project]', pin: [46, 60], pinLabel: '[spot]', q: '[a real client review]', name: '[Client name]', role: '[Homeowner · area]', img: 'team-1', r: 2 },
  { id: 'c', room: 'dining', roomName: '[project]', pin: [72, 58], pinLabel: '[spot]', q: '[a real client review]', name: '[Client name]', role: '[Homeowner · area]', img: 'team-4', r: -1.5 },
];

/* ---------- fees — an indicative estimate in BHK terms ---------- */
// [confirm] every figure below with the studio. Anchors: full 3BHK interiors from ₹4.99 lakh; most projects ₹3.8–50 lakh.
export const homeTypes = [
  { key: '1bhk', label: '1BHK', fullFrom: 3.8 },   // [confirm]
  { key: '2bhk', label: '2BHK', fullFrom: 4.4 },   // [confirm]
  { key: '3bhk', label: '3BHK', fullFrom: 4.99 },  // the published starting price
  { key: '4bhk', label: '4BHK', fullFrom: 6.8 },   // [confirm]
  { key: 'villa', label: 'Villa', fullFrom: 12 },  // [confirm]
  { key: 'office', label: 'Office', fullFrom: 6 }, // [confirm]
];
export const scopes = [
  { key: 'kitchen', label: 'Kitchen only', factor: 0.32 },        // [confirm]
  { key: 'kitchenWardrobes', label: 'Kitchen + wardrobes', factor: 0.6 }, // [confirm]
  { key: 'full', label: 'Full home', factor: 1 },
];
export const pricing = { spread: 1.8, max: 50, // the range shown: from → from × spread, never above ₹50 lakh [confirm]
  eyebrow: 'Fees', lines: ['What will it', '*cost*?'],
  lead: 'Pick your home and what you need. You get an indicative range; the final quote comes after a free site visit.',
  disclaimer: 'Indicative estimate · final quote after site visit',
  send: 'Send this to the studio',
  tableTitle: 'Indicative starting prices',
  note: 'full 3BHK interiors from ₹4.99 lakh',
};
/** Indicative range in lakh for a home type and scope. */
export function estimate({ home, scope }) {
  const h = homeTypes.find((x) => x.key === home), s = scopes.find((x) => x.key === scope);
  const low = Math.round(h.fullFrom * s.factor * 100) / 100;
  const high = Math.min(pricing.max, Math.round(low * pricing.spread * 10) / 10);
  return { low, high, home: h.label, scope: s.label };
}

/* ---------- FAQ ---------- */
export const faqCats = ['Pricing', 'Process', 'Service'];
export const faqs = [
  { q: 'What’s included in the ₹4.99 L 3BHK package?', cat: 'Pricing',
    a: 'It’s our starting price for complete interiors of a 3BHK home. [confirm: what the package covers — e.g. modular kitchen, wardrobes, TV unit, false ceiling, lighting — and what is extra.] You get the exact list in writing with your quote after the site visit.' },
  { q: 'Do you show 3D designs before work starts?', cat: 'Process',
    a: 'Yes. Design and 3D visualisation is a step in every project, so you see your rooms before anything is made. [confirm: how many design revisions are included.]' },
  { q: 'How long does a full-home project take?', cat: 'Process',
    a: 'It depends on the size of your home and the scope. [confirm: a typical timeline, e.g. X–Y weeks for a 3BHK.] We agree the timeline in writing before work starts — delivering on time is part of how we work.' },
  { q: 'Do you work outside Whitefield?', cat: 'Service',
    a: 'Yes. Our studio is in Whitefield and we work across Bengaluru — for example in Banashankari and Thanisandra. [confirm: areas or cities outside Bengaluru.]' },
  { q: 'Is there a warranty?', cat: 'Service',
    a: '[confirm: warranty period on modular furniture, hardware and workmanship.] Ask us about warranty terms during your consultation.' },
  { q: 'Can I do just a kitchen or wardrobes?', cat: 'Pricing',
    a: 'Yes. We design and build modular kitchens and wardrobes on their own, as well as full-home interiors. Use the estimate above to see an indicative range.' },
];
export const faqCopy = {
  label: 'Questions',
  lines: ['Asked.', '*Answered*.'],
  lead: 'Straight answers to the questions we hear most. Can’t find yours? Type it — it goes straight to the studio.',
  search: 'Type your question',
  none: 'Not answered here yet.',
  send: 'Ask the studio',
  signer: 'Samskriti',
  signerRole: 'Design team',
};

/* ---------- contact ---------- */
export const contactCopy = {
  eyebrow: 'Contact',
  lines: ['Let’s design', 'your *home*.'],
  lead: 'Tell us a little about your home and a designer will call you to book a free consultation.',
  types: ['1BHK', '2BHK', '3BHK', '4BHK', 'Villa', 'Office'],
  icons: [0, 0, 0, 0, 4, 2], // which room drawing each home type shows on the live sheet
  budgets: ['Under ₹5 L', '₹5 L – ₹10 L', '₹10 L – ₹25 L', '₹25 L – ₹50 L', '₹50 L +'],
  need: 'we’ll need this',
  received: 'Thank you — your details reached the studio. We’ll call you on the number you gave us.',
  preview: 'Your home, drawn live',
  sheetTitle: 'Your brief',
  directions: 'Get directions',
  call: 'Call',
  whatsapp: 'WhatsApp',
};
// Areas we know → coordinates for the sheet's title block (anything else waits for the site visit)
export const places = {
  whitefield: '12.9698° N · 77.7500° E', kadugodi: '12.9986° N · 77.7609° E', belathur: '12.9989° N · 77.7489° E',
  banashankari: '12.9255° N · 77.5468° E', thanisandra: '13.0545° N · 77.6331° E', 'electronic city': '12.8452° N · 77.6602° E',
  indiranagar: '12.9784° N · 77.6408° E', koramangala: '12.9352° N · 77.6245° E', marathahalli: '12.9569° N · 77.7011° E',
  'hsr layout': '12.9116° N · 77.6389° E', hebbal: '13.0358° N · 77.5970° E', jayanagar: '12.9308° N · 77.5838° E',
  bengaluru: '12.9716° N · 77.5946° E', bangalore: '12.9716° N · 77.5946° E',
};

/* ---------- footer ---------- */
export const footerCopy = {
  visit: 'Visit the studio',
  explore: 'Explore',
  reach: 'Reach us',
  cord: 'Pull the cord',
  off: 'Switch the light off',
  on: 'Switch the light back on and return to the top',
  top: 'Back to top ↑',
  copyright: '© 2026 The Samskriti Interiors & Design Studio',
};

/* ---------- the menu: six rooms, each with the photo the arch shows while you point at it ---------- */
export const menu = {
  links: [
    { id: 'studio', label: 'Studio', img: 'detail' },
    { id: 'services', label: 'Services', img: 'svc-kitchen' },
    { id: 'work', label: 'Work', img: 'villa' },
    { id: 'process', label: 'Process', img: 'svc-wardrobe' },
    { id: 'materials', label: 'Materials', img: 'material-stone' },
    { id: 'contact', label: 'Contact', img: 'svc-villa' },
  ],
  home: 'hero', // what the arch shows until you point at a link
  cta: 'Book a free consultation',
  place: 'Whitefield, Bengaluru',
};

/* ---------- section index (scroll tracking) — hidden sections drop out ---------- */
export const sheets = [
  { title: 'Home', id: 'top', icon: 'lamp' },
  { title: 'Studio', id: 'studio', icon: 'polaroid' },
  { title: 'Services', id: 'services', icon: 'arch' },
  { title: 'In numbers', id: 'stats', icon: 'dim' },
  { title: 'Work', id: 'work', icon: 'film' },
  { title: 'Process', id: 'process', icon: 'gantt' },
  { title: 'Materials', id: 'materials', icon: 'fan' },
  ...(SHOW_TEAM ? [{ title: 'Team', id: 'team', icon: 'pass' }] : []),
  ...(SHOW_TESTIMONIALS ? [{ title: 'Client notes', id: 'voices', icon: 'note' }] : []),
  { title: 'Fees', id: 'fees', icon: 'table' },
  { title: 'Questions', id: 'faq', icon: 'rfi' },
  { title: 'Contact', id: 'contact', icon: 'stamp' },
];

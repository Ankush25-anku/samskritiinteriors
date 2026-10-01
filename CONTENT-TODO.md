# Content to confirm or add — The Samskriti Interiors

The site only uses facts the studio has given us. Everything below is either a placeholder shown in **[square brackets]** on the site, or something hidden until you add it.
Edit it all in **`src/data.js`**; each item lists where it lives there.

## Contact details
- [ ] **Email address.** No email is shown anywhere until this is filled in. (`business.email`)
- [ ] **Opening hours** (for example Mon–Sat, 10:00–19:00). Once they're added, the footer skyline shows "open / closed" live. (`business.hours`)
- [ ] **Instagram link.** It appears in the footer once added. (`business.instagram`)

## Photos
- [ ] **Work, all three projects:** replace the placeholder photos with your real project photos (the photo plus a line-drawing version of it).
  - Luxury Villa, Banashankari
  - Ultima Smart Homes, Thanisandra
  - Residential Interiors, Bengaluru
  
  Put the originals in `scripts/raw/` and update `projects[].photo` / `drawing`. The alt text says "[placeholder photo…]" until then. (`projects`)
- [ ] **Logo:** a larger PNG (≥ 1500 px wide) or an SVG, so the big app icons are perfectly crisp.

## Work: project details
For each project: **area**, **duration** and **year** are shown as `[area]`, `[duration]`, `[year]`. (`projects[].area / dur / year`)
- [ ] More projects to add, if you'd like more than three. Each one also needs a photo and a drawing.

## In numbers
- [ ] **Homes delivered.** This row stays hidden until you add the number. (`stats` → "Homes delivered", `n: null`)

## Process
- [ ] **Duration of each step**, shown as `[duration]`. (`phases[].len`)
  - Consultation & site measurement
  - Design & 3D visualisation
  - Materials, finishes & final quote
  - Execution & handover

## Materials
- [ ] **Lead time** for each finish (laminate, oak veneer, quartz, PU finish, fluted panels, brass hardware), shown as `[confirm]` on the back of each sample. (`materials[].lead`)

## Fees (indicative estimate)
Only the 3BHK full-home price (₹4.99 L) and the ₹3.8 L – ₹50 L range are confirmed. Please confirm or correct the rest (`homeTypes`, `scopes`, `pricing.spread`):
- [ ] Full-home "from" price for **1BHK** (₹3.8 L), **2BHK** (₹4.4 L), **4BHK** (₹6.8 L), **Villa** (₹12 L), **Office** (₹6 L)
- [ ] **Kitchen only** = 32% of full home; **Kitchen + wardrobes** = 60% of full home
- [ ] Upper end of each range = starting price × 1.8 (never above ₹50 L)

## FAQ answers to confirm (`faqs`)
- [ ] What the ₹4.99 L 3BHK package includes (e.g. modular kitchen, wardrobes, TV unit, false ceiling, lighting) and what's extra
- [ ] How many design revisions are included
- [ ] A typical timeline for a full-home 3BHK project
- [ ] Areas or cities you work in outside Bengaluru
- [ ] Warranty period on modular furniture, hardware and workmanship

## Hidden sections (switch them on when there's real content)
- [ ] **Team** (`SHOW_TEAM = false`): real names, roles and photos for each person in `team`. The roles are pre-filled: Principal designer, Architect, Interior designer, Site supervisor.
- [ ] **Client notes / testimonials** (`SHOW_TESTIMONIALS = false`): real client reviews with the client's permission, their name and area, and the project photo each note is pinned to. Also the review rating and count shown on the seal.

## Already true on the site (from the studio)
Name; "since 2018"; MSME registered; the address; the phone and WhatsApp (080954 99968); the website; full 3BHK interiors from ₹4.99 lakh; typical projects ₹3.8 L – ₹50 L; the services; the three project names and areas; the four process steps.

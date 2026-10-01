# NOVARA — Art direction + responsive parity pass: progress

Not a git repo, so this audit comes from reading the code (2026-10-01). `npm run build` passes with no warnings.

## Checklist

### Prerequisite: stability
- [x] P1 DONE: scene hysteresis in `src/sections/Hero.jsx:168` (3% band); Lumen state hysteresis in `Lumen.jsx` (pend ref)
- [x] P2 DONE: one Lenis with a module guard (`App.jsx:17-18`), `main.jsx:12` scrollRestoration manual, hero mode stored once (`three/support.js:7` `novara-hero-mode`), the facade order is seeded (Math.sin)
- [x] P3 DONE: grain has no blend mode, no backdrop-filter is used, off-screen sections are paused (`App.jsx` usePauseOffscreen), and the fixed ruler's blend mode was removed (`styles.css:133`, Chunk A). `content-visibility` is **deliberately not used** because it breaks Lumen anchor measurement and the sticky pins; pausing off-screen sections does the same job.
- [x] P4 DONE: compositor-only preloader (`--p`), `compileAsync` (`Stage3D.jsx:120`), 2.5 s / 8 s ceiling fallback (`Chrome.jsx:77-89`)
- [x] P5 DONE: one CSS marquee loop (`styles.css:1222`), static stamps, pauses off-screen

### Part 1: Hero
- [x] H1 DONE: one headline, one visual, slate line and film strip
- [x] H2 DONE: text zone and plum gradient (`styles.css:293`); portrait zone from the bottom (`styles.css:365`)
- [x] H3 DONE: `--fs-display` (`styles.css:21`), 2 lines with no wrapping, in by line and out upward, one headline at a time. *Decision:* the headline box is 48% wide, with the size capped at `min(--fs-display, 4.8vw)`, so the longest line ("THEN EVERY") always fits on one line. At exactly 40% it wrapped to 3–4 lines.
- [x] H4 DONE: `Room.jsx:44` EdgesGeometry 20°, leaves without edges (`Room.jsx:203`), hero drawing regenerated (`process-images.mjs:21` blur 2.5, minFrag 40)
- [x] H5 DONE: callout "A1 · Lumen, brushed brass" (`data.js:15`), new hero photo with no arc lamp
- [x] H6 DONE: coordinates chip, ruler and sheet tag hidden in the hero (`styles.css:350`, observer `Hero.jsx:150`); REC removed; 2 dimension lines, both in scene 3 only
- [x] H7 DONE: `--hm: max(6vw, 24px)` (`styles.css:269`), held scenes (curveU), 0.9–1.2 s transitions
- [x] H8 DONE: centred poster (`styles.css:305`), vignette, two buttons. Checked at 1440, 768 and 390

### Part 2: Whole-site art direction
- [x] A1 DONE (Chunk D): every CSS font-size uses a token. Replaced 78 fixed px sizes, 8 one-off clamp/em sizes, the nav logo and Contact's inline sizes. The only fixed sizes left are SVG text in viewBox units, which scales with its SVG:
  - Kept: `.plot-text` (preloader word, viewBox), `.sig text` (team signature, viewBox 240×60), `.seal text` (review seal ring, viewBox 120), `.rfi-sign text` (FAQ signature, viewBox 220×44), Contact stamp ring `fontSize="15"` (viewBox 200), Footer wordmark `fontSize="318"` (viewBox 1360×300), Lumen's spec label `fontSize 10.5` (inside Lumen's SVG, scales with the lamp)
  - Follow-ups: tape numbers now sit above their labels; swatch backs scroll inside when the spec runs long; menu card codes no longer wrap
- [x] A2 DONE: `--sec` (`styles.css:27`), `--head-gap` 56px (`styles.css:28`, `:84`); Process header now reads label → headline
- [~] A3 PARTIAL: code changes made, not yet reviewed visually
  - [x] Nav/Menu  [x] Manifesto  [x] Services  [x] Stats: done in Chunk D. Screenshots at 390, 768, 1024 landscape and 1440. Contrast at least 4.5:1 (3:1 for large text) on every solid background in view; 0 overflow; 0 errors
  - [~] Work  [~] Process  [~] Materials
  - [~] Team  [~] Testimonials  [ ] Fees  [ ] FAQ  [~] Contact  [~] Footer
- [ ] A4 NOT DONE: per-section before/after list (draft below)

### Part 3: Responsive parity
- [x] R1 DONE: portrait camera path, dpr 1 on small screens, no post-processing, below 45 fps → photo storyboard with the same 5 scenes (checked at 390, 360 `?no3d`, 768)
- [x] R2 DONE: drag swings and tap toggles (`Stage3D.jsx:342`)
- [~] R3 PARTIAL: mobile-scale and parking attributes added to the pinned-section anchors; not verified
- [~] R4 PARTIAL: touch light pool (`Chrome.jsx` TouchPool), tab press-and-hold plus a one-time hint (`Projects.jsx` Tabs), raking-light auto hint (`Materials.jsx`). Press feedback is in CSS (`.btn:active` scale .97 under `hover: none`). Left to do: check it on a real device
- [~] R5 PARTIAL: tap alternatives exist (+ button, ← → arrows, cord click); sample buttons are below 44px
- [x] R6 DONE (Chunk A): the pinned Services, Work and Process sections run on phones and tablets with portrait layouts (`styles.css`, "RESPONSIVE PARITY" block). Each scene has a snap point (`ui.jsx` SnapPoints, touch screens only, `scroll-snap-type: y proximity`). Calm mode keeps the still stacks. Checked at 390×844 and 768×1024: scrollWidth equals innerWidth, 0 console errors.
  - Chunk A2 (same content as desktop, tucked rather than removed):
    - Services: the tick list and the full-width floor plan sit behind "Details +" (44px, aria-expanded, height animation). It closes by itself on the next room. While it's open the arch steps back (grid rows animate), so the page never jumps (measured scroll change: 0px).
    - The room rail is now a numbered 01–05 progress row pinned at the top of the sequence. It replaces the big "02 / 05" counter, which showed the same number.
    - The lead is clamped to 3 lines, with "Read more +" showing only when text is actually cut (`ui.jsx` ReadMore).
    - Process and Work keep their single desktop note on phones, placed under the room image and under the title.
    - The Work tab row now also shows on short phones.
    - Checked at 360×740, 390×844 and 768×1024: no overflow, 0 errors, panel 44px tall, closes on the next step.
  - *Note:* the correction said "Room rail (Process)", but the room rail belongs to Services, so that's where the progress row went. Process already shows its progress in place (week counter and the 24-week bar).
- [ ] R7 NOT DONE: 4 `100vh` uses left (some are fallbacks)
- [~] R8 PARTIAL: `viewport-fit=cover`, `--pad` respects the safe area, nav, menu, film strip and footer done
- [~] R9 PARTIAL: orientation re-dispatches resize after it settles (`App.jsx`); reel uses a ResizeObserver
- [~] R10 PARTIAL: chips, filters, toggle, checkboxes, fields, cord and brief ✕ are now 44px; sw-btn and tray ✕ now have 44px invisible hit areas and ds-close is 44px (Chunk A); a full audit is still due in Chunk H; the keyboard no longer fights Lenis (`App.jsx` focusin)

### Part 4: Testing
- [ ] T1  [ ] T2  [ ] T3  [ ] T4

## Before/after (final for the sections marked [x])
- **Hero**
  - Packed HUD → slate, film strip and one callout
  - 3–4-line headlines → 2 lines
  - Arc lamp → Lumen only
- **Nav/Menu**
  - Signature: the drawing-set index, unchanged
  - Logo 21px → lead token
  - Menu card codes wrapped on phones ("A-/03") → one line
  - Close button 40px → 44px
- **Manifesto**
  - Signature: the paragraph read by lamplight
  - Moving tape → still tape with quiet 12px numbers
  - 2 handwritten notes → 1 (the founder's line); the prints' caption is a plain label, without the "tap to fan" that was wrong on desktop
  - Prints no longer sway
  - "Read how we work" is a 44px label link
  - Founder note is 5.5:1 on lavender (was 4.24:1)
- **Services**
  - Signature: rooms lit one at a time in the arch
  - Room titles at h2 were clipped ("HOSPITALIT") → columns 52/48 and a 150px rail, so the full word fits
  - Pulsing plan pin → still
  - Phones: the rail becomes a top progress row; ticks and plan sit behind "Details +"; Read more appears when text is cut
- **Stats**
  - Signature: the laser measuring each number
  - Award plaques flipped in 3D → 12px fade-rise
  - Lumen hung over a description → now hangs beside the headline in empty space
  - Laser note is 5.5:1 (was 4.24:1)

## Before/after (draft for the remaining sections, finished in Chunks E and F)
- Work: card label no longer repeats the counter; tabs rise 16px instead of 30px; press-and-hold reveals the drawing on touch
- Process: label moved to the header; 2 notes → 1 (mood note removed)
- Materials: handwritten table hint → quiet label; count sizes use the scale
- Team: idle swing removed (scroll physics kept); drop 80px with bounce → 16px fade
- Testimonials: spinning seal → still
- Contact: "press the stamp" note removed; the stamp only turns on hover; placeholder contrast fixed
- Global: foil shimmer → static; Rise 28px → 16px

## Approved decisions
- P3: `content-visibility` is not used (it breaks Lumen anchor measurement and the sticky pins); pausing off-screen sections does the same job. **Approved by the user (2026-10-01).**
- H3: the headline box is 48% wide with the size capped at `min(--fs-display, 4.8vw)`, so headlines stay at 2 lines. **Approved by the user (2026-10-01).**
- Phones get the SAME content as desktop. Secondary content can be tucked behind "Details +" or "Read more", never removed (user correction, 2026-10-01).

## Chunk log
- Chunk A (done): removed the leftover scripts/_art*.cjs; R6 portrait and snap CSS; P3 ruler blend; ds-close is 44px; touch press feedback, tab peek, touch pool and sample-button hit areas (CSS). Build clean.
- Chunk A2 (done): same content on phones (Details +, Read more, Services rail as a top progress row, notes kept, Work tabs on short phones).
- Chunk D (done): A1 tokens everywhere; A3 for Nav/Menu, Manifesto, Services and Stats; added `--coral-ink` (#A8301E, derived from coral-deep) for handwritten text on lavender to reach 4.5:1.
- Chunk D2 "Clean & luminous" (done): see below.

## Chunk D2: Clean & luminous

### 1. Line budget: decorative lines, before → after
Counted by `scratchpad/real/linecount.mjs` on one 1440×900 screen of each section: border sides drawn, thin rule elements, and grid/tick stripes in backgrounds.

| Section | Before | After |
| --- | --- | --- |
| Hero (photo path, SC03 frame) | 142 | 25 (the 4% drafting grid, SC01–03 only, fades out by SC04) |
| Manifesto | 639 | 1 |
| Services | 103 | 1 (the active-room marker) |
| Stats | 119 | 6 (the laser dimension lines, the signature) |
| Work | 121 | 7 (progress bar and drawing seam, the signature) |
| Process | 241 | 1 |
| Materials | 133 | 5 |
| Team | 140 | 17 (to clean up in Chunk E) |
| Testimonials | 117 | 4 |
| Fees | 152 | 24 (to clean up in Chunk F) |
| FAQ | 135 | 5 |
| Contact | 234 | 9 |
| Footer | 95 | 1 |
| **Total** | **2371** | **106 (−95.5%)** |

Fixed chrome went from 5 → 0: crosshair hairlines, the coordinates chip, the right-edge ruler, the "A-000 · COVER" sheet tag and the nav border. The progress line is kept.

What changed:
- Every sheet (plum, night, lavender) and the pinned stages (Services, Work, Menu, Footer) are flat: no blueprint grid. The Work drawings were regenerated without the baked-in grid.
- Cards, chips and panels use tonal fills with 12–16px corners, and get an outline only on hover, focus or active. This covers menu cards, stamps, plaques, tabs, the Process gantt, Materials counts, tray and slots, testimonial notes, Fees columns and toggle, FAQ RFIs and filters, Contact fields and chips. It lives in the "CLEAN & LUMINOUS" block at the end of `styles.css`; Chunks E and F fold it into each section.
- **Nav:** no borders. It's transparent over the hero, then soft solid plum (`rgba(42,29,82,.92)`, 14px corners). The calm toggle is a tonal pill.
- **Secondary buttons** (`.btn-ghost`, `.btn-link`) are underlined text with an arrow, never a box.
- **Kept on purpose:** the preloader's drafting paper (shown briefly, outside any section).

### 2. Hero drawing: hand-authored, not traced
- `src/components/RoomDrawing.jsx`: 32 clean paths (back wall corner, two framed artworks, curtains and window, both sofas with cushions, the block coffee table with bowl and vase, pouf, olive tree in its pot). Each is a uniform 1.25px line with round caps, in `--line` at 70%. Lumen isn't drawn in it, because the lamp is its own travelling element.
- Checked against the photo with an overlay (`rd-overlay2.jpg`): every object lines up, so the SC03→SC04 crossfade reads as the drawing becoming the room.
- It plots itself on with `stroke-dashoffset` over SC01→SC02, staggered path by path. Phones get a 9:16 window onto the same drawing that matches the portrait photo crop.
- **Decision:** the stroke stays exactly 1.25px on screen, but it's computed from the rendered scale (a ResizeObserver sets `--sw`) rather than with `vector-effect: non-scaling-stroke`, because that switches off `pathLength` for the dash animation in Chrome.
- The 3D edges use the same colour at 70% (`Stage3D.jsx:205`).
- Process now uses the same drawing over the same photo; the traced hero drawing is deleted. Testimonials no longer has a traced drawing behind it.
- **SC03:** material chips are tonal cards (12px corners, no outline); still 2 dimensions.

### 3. Hero finale
- **New photo:** bright, warm, minimal; cream sofas, an oak block table, an olive tree, framed art, and no lamp of its own. It's shown **mirrored**, so the clear space above the table sits under Lumen.
- **Crops:** 16:10 for landscape, plus a separate 9:16 portrait crop centred on the table for phones. Both are AVIF/WebP/JPG through the sharp pipeline.
- **Grade:** a new `warm` grade (no plum lift, no desaturation, slightly warm). Only an edge vignette (plum 0 → 55%) plus a soft band behind the poster text.
- **Light:**
  - The coral cone is now warm white (`#FFE9C7` family) with a floor light pool.
  - The bulb bloom is warm; coral stays an accent.
  - **Decision:** normal blending at low opacity rather than `mix-blend-mode: screen`. Blend modes on Lumen's moving layer were a measured performance cost on your integrated GPU, and with warm white at low alpha the result looks nearly identical.
- **Lamp:**
  - Deeper brass gradient, top-down shading and a specular streak.
  - A warm-lit inner lip of the shade, and a soft shadow beside the cord.
  - Same Lumen design.
- **SC05 layout:**
  - Lumen moves to the centre, high above the poster, with a softer beam. The photo slides so the lit table stays under it.
  - The small label is removed (it collided with the lamp).
  - The film strip is hidden.
  - Buttons: solid primary plus an underlined link.
- **Contrast,** measured on the real photo (the brightest 5% of the pixels in each text box, halo included):

  | | 1440 | 768 | 390 |
  | --- | --- | --- | --- |
  | FROM LINE | 5.12 | 6.96 | 6.71 |
  | TO | 6.23 | 6.98 | 6.33 |
  | LIGHT. (darkest gradient stop) | 4.68 | 6.12 | 5.31 |
  | Link | 4.95 | 6.28 | 5.09 |

  All pass 4.5:1. *Decision:* "LIGHT." is a pale brass-to-peach gradient (`#FFEECC → #FFD8B8`) rather than coral. Solid coral can't reach 4.5:1 on a bright room without darkening the room again. The text sits on a soft band (max 62% plum) plus a tight dark halo around the glyphs, so the room stays bright around the type.
- **Bug fixed:** the room vanished in SC05 on the photo path. Framer Motion was handing the hero's array-form scroll opacities to the browser's ScrollTimeline, which measured the whole page rather than the hero. The opacities now use a plain `ramp()` function (`Hero.jsx`). The same bug affected the earlier 360/390 photo-path SC05.
- **Bug fixed:** the SC04 light pool now centres under the lamp on screen. It was drifting to the lower right because the landscape frame transform was ignored.
- **Debug badge:** only with `?debug`, never by default, not even in dev (`Debug.jsx`).
- **Not changed:** the 3D room's own lighting in SC05 is the existing evening render; the poster treatment is shared. Re-lighting the 3D room warm is a separate task, if you want it.

### 4. Services
- Each room has its own warm photo, graded alike: `svc-residential`, `svc-hospitality`, `svc-workplace`, `svc-materials`, `svc-turnkey`.
- "Lights off" is a dusk bedroom (`svc-dusk`), recognisable with warm hints, instead of the dark wall of windows. Unlit rooms are dimmed to 34%, not black.
- Removed: the arch's second outline, the room-list divider, the grid, the tick-list hairlines, the coordinates chip, the sheet tag and the ruler.
- The room list is a quiet row under the "00 / 05" counter, and the copy column is wider (46/54), so "FIVE ROOMS. ONE PRACTICE." holds 2 lines at 1440.
- The floor plan is smaller (168px), with no box, at 75% opacity. The "ROOM 00 · LIGHTS OFF" caption has room under the arch.

### 5. Checks
- Screenshots: hero SC01–SC05 at 1440 (photo and 3D), 768 and 390 (photo); Services lights-off and room 02 at 1440, 768 and 390.
- `npm run build`: no warnings. Overflow 0 at 390 and 768; −15 at 1440 is the scrollbar. Console errors: 0.

### Image credits
All photos are free under the Unsplash License. The full list is in `CREDITS.md` and the footer, generated by `node scripts/credits.mjs`.

| Slot | Photo | Photographer |
| --- | --- | --- |
| hero (+ hero-portrait) | https://unsplash.com/photos/a-living-room-filled-with-furniture-and-a-large-window-x3mSC1WnWhc | Spacejoy (@spacejoy) |
| svc-residential | https://unsplash.com/photos/12WFO8yWrsw | Caroline Badran (@___atmos) |
| svc-hospitality | https://unsplash.com/photos/jHyxPnJTvIQ | Cody Chan (@cceee) |
| svc-workplace | https://unsplash.com/photos/B74lBYC3PXI | Caroline Badran (@___atmos) |
| svc-materials | https://unsplash.com/photos/pdCTX1harH4 | Karolina Grabowska (@kaboompics) |
| svc-turnkey | https://unsplash.com/photos/GEtu7WhqU2M | Warren Hansen (@hansen_pix) |
| svc-dusk | https://unsplash.com/photos/KD_o-Ml2F_w | Bilal Mansuri (@itsbilalmn) |

## Rebrand: The Samskriti Interiors
Order: R1 → R2 → R3 → R4 → R5, then Chunks E and F under the same rules.

### Chunk R1: logo, brand, fonts (done)
- **Logo assets** (`scripts/brand.mjs` → `public/brand/`, each as WebP + PNG at 1x and 2x). The source is cleaned first: edge colours are taken from solid neighbours, the faint fringe is eroded, and isolated specks are removed.
  - `logo-full`, 320/640 wide: the whole stacked logo (footer).
  - `logo-header`, 44/88 tall: stacked, without the web address, as requested.
  - `logo-lockup`, 44/88 tall: the window mark beside "THE SAMSKRITI / INTERIORS", built from the same artwork. Used in the header.
  - `logo-mark`, 160/320 square.
  - `logo-markonly`: the full logo's canvas with only the mark, for the preloader.
  - Icons on plum: `favicon.ico` (16/32/48 PNG-in-ICO), `apple-touch-icon.png` (180), `icon-192.png`, `icon-512.png`.
- **Decision (header):** the supplied logo is stacked, so as a 44px-tall header logo its "INTERIORS" line would be about 5px tall, unreadable even on desktop. Rather than live text, the header uses the horizontal lockup made from the real logo artwork. "INTERIORS" renders about 14px tall at 44px and about 10px at 32px, readable everywhere. Measured in the bar: 246×44 desktop, 201×36 tablet, 179×32 phone, always inside the bar. The old NOVARA wordmark and the "ARCHITECTURE + INTERIORS" label are gone.
- **Source resolution:** the source is 743×480. That's enough for crisp 2x header, footer and preloader images. The 512px icon needs a slight upscale of the mark (it's 319px wide in the source), so it's a little soft. **Owner: a larger PNG (≥1500px wide) or an SVG of the logo would make the big icons perfectly crisp.**
- **Footer:** `logo-full` at max 320px (220px on phones), inside its column (checked at 390, 768 and 1440). It rises in on view and glows softly coral when the lights are out; this replaces the old plotted NOVARA wordmark.
- **Preloader:** the plotter pen draws the window mark in, then the full logo fades in on top. The readout says "Loading · %". The static HTML placeholder matches.
- **Names:** every user-visible NOVARA reference was replaced: header, preloader, footer copyright, Contact "approved" stamp, team pass band, hero heading for screen readers, debug badge, CSS banner, console tags. Internal storage keys (`novara-calm`, `novara-seen`…) are kept on purpose, so visitors don't lose their settings. The non-existent `hello@novara.studio` links became the real phone number (`tel:+918095499968`) plus WhatsApp until an email is confirmed.
- **index.html:**
  - `lang="en-IN"`, the new `<title>`, and a meta description from the real facts.
  - Favicon, apple-touch and 192 icons; Open Graph tags.
  - LocalBusiness JSON-LD (`InteriorDesigner`) with the address, phone, founding year (2018) and price range. theme-color stays plum.
  - The stale preload of the deleted hero drawing is removed.
- **Fonts:**
  - Fraunces Variable, full axes for optical size and SOFT, plus italic: headlines at weight 590, `SOFT 50`, letter-spacing −0.02em, sentence case, line height 1.02.
  - The accent word (`.foil` / `.foil-p`) is Fraunces italic in solid coral on dark backgrounds and coral-ink on light ones. The hero poster keeps its warm light gradient for 4.5:1 on the bright room.
  - Manrope Variable for body and UI. IBM Plex Mono only for small labels.
  - Handwritten notes are now Fraunces italic at `--fs-lead`.
  - Archivo and Architects Daughter are uninstalled.
- **Type scale:** the tokens are unchanged. Sentence-case Fraunces is narrower than the old expanded capitals, so everything fits. Checked with `heads.mjs` at 360, 390, 768, 1024 and 1440: all 18 headlines are at most 2 lines with 0 overflow, after making the Materials headline two lines.
- **Build:** no warnings. Console errors 0. Page overflow 0 (−15 at 1440 is the scrollbar).

### Preloader fix (done)
- **Background:** deep plum (flat plum around the logo, fading to night at the edges). No grid. The static HTML curtain matches, so there's no lavender flash.
- **Logo:** the stacked logo without the web address (`logo-stack`), split by `scripts/brand.mjs` into a mark layer and a name layer on the same canvas. 280px wide on desktop, 200px on phones, centred, with safe-area padding.
- **On-light variants:** `logo-full-light`, `logo-lockup-light` and `logo-stack-light` turn the white parts plum and keep the orange and yellow. Every place the logo shows today is dark (preloader plum, header over the dark hero or solid plum, footer night), so the white version never sits on a light surface. The `-light` files are ready for any light surface, and the R4 menu will use them if it's light.
- **Sequence** (transform and opacity only, about 2.4 s):
  1. The mark fades and scales in (0.96 → 1).
  2. The name is revealed left to right by a plum cover with a soft edge.
  3. Lumen descends from the top on its brass cord and stops with its bulb 40px above the logo.
  4. The bulb switches on and a warm glow lights the logo.
  5. The plum curtain lifts.
- **Progress:** a thin 2px coral line, 120px wide, with no numbers. "LOADING · %" is gone.
- **Never hangs:** the logo layers are preloaded (`<link rel="preload" as="image">`) and `img.decode()`d before anything moves. The curtain lifts once the sequence has played and the hero image (the crop this screen uses) is decoded, or at a 3 s hard cap. The 3D stage no longer compiles under the preloader: it mounts only after the curtain has lifted, with an 8 s fallback to the photo storyboard.
- **Modes:** the full sequence plays once per session (sessionStorage); reloads get the quick version; calm mode gets a simple fade.
- **Hidden until done** (via `html.pre`): nav, progress line, Lumen, slate, film strip, 3D hint, debug badge, cursor, touch pool.
- **Measured:** first visit, the preloader is gone 2.6 s after navigation starts (2.4 s of sequence plus script load) at 1440 and 390; on reload, 0.67 s. Console errors 0.

### Status check after the interrupted run (2026-10-01)
- Part 1 Preloader: **DONE** (plum, no grid; on-light variants; sequence with Lumen 40px above the logo; progress line; chrome hidden via `html.pre`; quick reload version; 3 s cap).
- Part 2 R2 content: **PARTIAL**. All code is in place: `data.js` has the Samskriti content, the `SHOW_TEAM` and `SHOW_TESTIMONIALS` flags are in `Rest.jsx`, and every section reads from data. The old-copy grep returns 0 matches. Still to do: `CONTENT-TODO.md`, one "RFI:" label in the Contact sheet, the per-section list, and screenshots and overflow checks.
- Part 3 R3 codes: **MOSTLY DONE in code**. The regex finds 10 matches, all code comments or CSS aspect-ratio queries, so 0 are user-visible. Still to do: the visual check at 1440 and 390, and the report.
- Build: passes with no warnings.

### Part 2 / R2: content (DONE)
- **Where the copy lives:** all of it is in `src/data.js`, from the studio's facts. Every unknown is a [bracketed] placeholder listed in `CONTENT-TODO.md`.
- **Hidden sections:** Team and Testimonials are off (`SHOW_TEAM` and `SHOW_TESTIMONIALS` are false) and hold only role and placeholder data; they also drop out of the menu.
- **Removed:** invented content (the 340-project facade, award plaques and evidence photos in Stats; fake client stamps; the dollar fee plans and monthly retainer; the newsletter; the Milano and New York clocks; the fake 24-hour callback promise; the 4.9 rating).
- **New photos:** for Services, a modular kitchen (iKshana Productions), a bedroom with wardrobes (McFollis) and a villa living room (Alef Morais), all free Unsplash. Full-home uses the living room and Commercial uses the office.
- **Old-copy grep** (Novara, Milano, Milan, New York, 2014, USD, €, `$` followed by a number, and every old project, client and team name) across `src/` and `index.html`: **0 matches**. A bare "$" only appears in JavaScript template syntax.
- **Checks:** headlines at most 2 lines at 360, 390, 768, 1024 and 1440 (the Process headline was shortened to "Four steps / to your *keys*."). Overflow 0 at every width (1440 shows −15, the scrollbar). Console errors 0. Build has no warnings.

| Section | Eyebrow | Headline | First body line |
| --- | --- | --- | --- |
| Hero | Whitefield, Bengaluru · Since 2018 | It starts with a *line*. → Then a *sketch*. → Then every *detail*. → Then your *home*. → From line to *light*. | Buttons: View our work · Book a free consultation |
| Studio | The studio | Samskriti means refinement. We design homes that feel calm, crafted and completely yours. | Clean, modern, signature interiors — delivered on time and within budget, by a young team of architects and interior designers. |
| Services | Services | Five rooms. One *studio*. | Full-home interiors: "Complete interiors for apartments and 3BHK homes — planned, designed and delivered turnkey…" |
| In numbers | In numbers | Since 2018, to *scale*. | Designing since 2018 · 50+ design services · Full 3BHK interiors from ₹4.99 L |
| Work | Selected work | Drawn. Then *built*. | Luxury Villa (Banashankari) · Ultima Smart Homes (Thanisandra) · Residential Interiors (Bengaluru) |
| Process | How we work | Four steps to your *keys*. | Step 1, Consultation & site measurement: "We visit your home, measure every wall and window…" |
| Materials | Materials | Touch it before you *choose* it. | Laminates, veneers, quartz, PU finishes, fluted panels and brass hardware — see and feel them at our Whitefield studio. |
| Fees | Fees | What will it *cost*? | Pick your home and what you need. You get an indicative range; the final quote comes after a free site visit. |
| FAQ | Questions | Asked. *Answered*. | Straight answers to the questions we hear most. |
| Contact | Contact | Let's design your *home*. | Tell us a little about your home and a designer will call you to book a free consultation. |
| Footer | — | Visit the *studio*. | No. 14, 1st Floor, Opposite Pyda Palms Apartment… · 080954 99968 · © 2026 The Samskriti Interiors & Design Studio |

### Part 3 / R3: number codes (DONE)
- **Removed:** sheet codes (A-000…A-12, A-201…, S-01…, R-01…, M-01…), the "(A-0x)" eyebrow prefixes, the slate and timecode (now the eyebrow "Whitefield, Bengaluru · Since 2018"), film-strip numbers ("01 LINE" → "Line"), the Services "00 / 05" counter (the room name and room list remain; phones get dots), menu "01/12" counters, RFI numbers, team IDs and the drawing number.
- **Kept:** prices, the phone, the real stats, Process steps as "Step 1–4", the copyright year, and the lamp and room dimensions in the drawings.
- **Regex count:** a "before" count wasn't recorded during the edits. After: 10 matches, all code comments or CSS `max-aspect-ratio` queries, so **0 user-visible**. Confirmed on screen at 1440 and 390.
- Part 1 (preloader): DONE (see above).

### R4: menu redesign (DONE)
- **Removed:** the old tile grid (`DrawingSet`, `SheetIcon`) and all of its CSS.
- **New `Menu`** (`Chrome.jsx`; content in `data.js` → `menu`):
  - A plum curtain drops (0.7 s, `--curtain`). Lumen follows it down, switches on, and gets a warm glow.
  - Left 55%: six links in Fraunces, `clamp(40px, 5.5vw, 88px)`, revealed line by line through a mask, 60 ms apart.
  - Pointing at or keyboard-focusing a link gives it the italic coral accent; the others step back to 55%. *Decision:* 55% rather than 45%, so the dimmed links still read at 4.5:1 on plum.
  - The current section's link gets a coral dot.
  - Right 45%: the Services arch (no outline). It crossfades (0.5 s) to that section's photo, and Lumen leans toward the room you point at. The default is the hero room.
- **Header:** the nav bar stays on top as the menu's header, with the logo and the burger morphing into the close icon (two lines, no box). The nav's links, CTA and calm toggle step aside while the menu is open.
- **Bottom strip:** "Book a free consultation" · Call 080954 99968 · WhatsApp · Whitefield, Bengaluru · Get directions · Instagram (appears once the link is added) · the Calm toggle.
- **Phone and tablet portrait:**
  - Links are stacked in 56px rows at `clamp(34px, 9vw, 48px)`.
  - The arch becomes a full-bleed background behind a 76% plum scrim.
  - Lumen is smaller, at the top right.
  - The CTA, Call and WhatsApp are pinned at the bottom with safe-area padding.
  - The menu scrolls inside itself on short screens.
- **Behaviour:**
  - Esc or the close button closes it. Focus is trapped (burger plus menu) and returns to the burger.
  - Accessibility attributes: `aria-expanded` and `aria-controls` on the burger; `role="dialog"`, `aria-modal`, and `inert` while closed.
  - Lenis stops while it's open and the body scroll locks; `scrollbar-gutter: stable` prevents a page jump.
  - Clicking a link lifts the curtain, then smooth-scrolls there.
  - Photos load the first time the menu opens (`sizes` resolves to the 800px versions on phones and at 1440).
  - Calm or reduced motion: a 0.2 s fade, no swing.
- **Checks** (`menucheck.mjs`) at 360, 390, 768 portrait, 1024 landscape and 1440:
  - Overflow 0; all six links fully visible (rows at least 56px); the lamp never over a link.
  - Link contrast 8.1–15.7:1, measured on the real pixels.
  - **0 long tasks while opening** (phones at 4× CPU).
  - Esc closes it and focus returns to the burger. 0 console errors.
  - Build has no warnings.

## Next chunk
R5: mobile smoothness. (all copy into `data.js`, real facts only, placeholders in [brackets] listed in CONTENT-TODO.md, Team and Testimonials hidden behind flags, Indian pricing configurator, new Services photos).

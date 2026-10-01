// node scripts/credits.mjs — photo credits for every image slot the site actually uses
// reads the slot → photo map in process-images.mjs and the download records in raw/meta.json;
// writes src/credits.json (shown in the footer), scripts/credits.json and CREDITS.md
import fs from 'fs';
const src = fs.readFileSync('scripts/process-images.mjs', 'utf8');
const slots = [...src.matchAll(/^\s+'?([\w-]+)'?: \{ id: '([^']+)'(?:, raw: '([^']+)')?/gm)].map(([, slot, id, raw]) => ({ slot, id, raw: raw || slot }));
const meta = JSON.parse(fs.readFileSync('scripts/raw/meta.json', 'utf8'));
const code = ['src/data.js', ...fs.readdirSync('src/sections').map((f) => `src/sections/${f}`), ...fs.readdirSync('src/components').map((f) => `src/components/${f}`), 'src/styles.css']
  .map((f) => fs.readFileSync(f, 'utf8')).join('\n');
// a slot counts when the code hands it to an image (slot= / img: / inset: / photo: / drawing:) or links its file in CSS
const used = (slot) => new RegExp(`((slot|img|inset|photo|drawing)\\s*[:=]\\s*\\{?\\s*['"]${slot}(-drawing)?['"])|(/img/${slot}-)`).test(code);
const seen = new Set(), out = [];
for (const s of slots) {
  if (!used(s.slot) || seen.has(s.id)) continue;
  const m = meta[`${s.raw}-${s.id}`];
  if (!m) { console.warn('no record for', s.slot, s.id); continue; }
  seen.add(s.id);
  out.push({ slot: s.slot, photo: m.url, photographer: m.photographer, profile: m.profile });
}
fs.writeFileSync('src/credits.json', JSON.stringify(out, null, 2));
fs.writeFileSync('scripts/credits.json', JSON.stringify(out, null, 2));
const md = ['# Photo credits', '', 'Every photograph on the site is from [Unsplash](https://unsplash.com), used under the free [Unsplash License](https://unsplash.com/license).', '',
  '| Slot | Photographer | Photo |', '| --- | --- | --- |',
  ...out.map((c) => `| ${c.slot} | [${c.photographer}](${c.profile}) | ${c.photo} |`), '',
  'The hero room line drawing (`src/components/RoomDrawing.jsx`) is hand-authored for this site. The hero photo is shown mirrored.', ''];
fs.writeFileSync('CREDITS.md', md.join('\n'));
console.log(out.length, 'credits:', out.map((c) => c.slot).join(', '));

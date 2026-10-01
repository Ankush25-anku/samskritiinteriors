// node scripts/brand.mjs — brand assets from public/brand/samskriti-logo.webp
// The source is a stacked logo (window mark / THE SAMSKRITI / INTERIORS / www.thesamskriti.com), 743×480 with a
// speckled dark fringe left by an earlier background removal. This cleans the edges and cuts out:
//   logo-full     the whole stacked logo                      (footer)
//   logo-header   stacked, without the web address line       (as requested; too small to read in a 44px bar)
//   logo-lockup   mark beside "THE SAMSKRITI / INTERIORS"     (header: readable at 32–44px)
//   logo-mark     the window mark alone, square               (preloader, icons)
//   favicon.ico (16/32/48), apple-touch-icon.png (180), icon-512.png on plum
// Each image is exported as WebP + PNG at 1x and 2x.
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const SRC = 'public/brand/samskriti-logo.webp';
const OUT = 'public/brand';
const PLUM = { r: 0x2a, g: 0x1d, b: 0x52, alpha: 1 };

/* ---------- 1. clean the edges: defringe colours, then a slight alpha erode ---------- */
const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const W = info.width, H = info.height, px = Buffer.from(data);
const at = (x, y) => (y * W + x) * 4;
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
  const i = at(x, y), a = data[i + 3];
  if (a === 0 || a === 255) continue;
  // semi-transparent edge pixel: take its colour from the nearest solid neighbours (kills the dark/white halo)
  let r = 0, g = 0, b = 0, n = 0;
  for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) {
    const xx = x + dx, yy = y + dy; if (xx < 0 || yy < 0 || xx >= W || yy >= H) continue;
    const j = at(xx, yy); if (data[j + 3] === 255) { r += data[j]; g += data[j + 1]; b += data[j + 2]; n++; }
  }
  if (n) { px[i] = r / n; px[i + 1] = g / n; px[i + 2] = b / n; }
  // erode: faint fringe goes, the anti-aliased edge stays
  px[i + 3] = Math.max(0, Math.min(255, Math.round((a - 96) * (255 / (255 - 96)))));
}
// isolated specks: a solid pixel with almost no solid neighbours is noise
const clean = Buffer.from(px);
for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) {
  const i = at(x, y); if (!px[i + 3]) continue;
  let n = 0; for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) if ((dx || dy) && px[at(x + dx, y + dy) + 3] > 60) n++;
  if (n <= 1) clean[i + 3] = 0;
}
const base = () => sharp(clean, { raw: { width: W, height: H, channels: 4 } });
const cut = async (left, top, width, height) => sharp(await base().extract({ left, top, width, height }).png().toBuffer()).trim({ threshold: 1 }).png().toBuffer();

const parts = {
  full: await cut(0, 0, W, H),
  header: await cut(0, 0, W, 428),
  mark: await cut(200, 0, 345, 280),
  text: await cut(0, 280, W, 146),
};

/* ---------- 2. compositions ---------- */
const meta = async (b) => sharp(b).metadata();
// square mark with a little air
async function square(buf, size, bg = { r: 0, g: 0, b: 0, alpha: 0 }, fill = 0.82) {
  const inner = Math.round(size * fill);
  const m = await sharp(buf).resize({ width: inner, height: inner, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
  return sharp({ create: { width: size, height: size, channels: 4, background: bg } }).composite([{ input: m, gravity: 'centre' }]).png().toBuffer();
}
// horizontal lockup at height h: mark full height, the two text lines at 74% of it, vertically centred
async function lockup(h) {
  const mk = await sharp(parts.mark).resize({ height: h }).png().toBuffer();
  const tx = await sharp(parts.text).resize({ height: Math.round(h * 0.74) }).png().toBuffer();
  const [a, b] = [await meta(mk), await meta(tx)];
  const gap = Math.round(h * 0.28);
  return sharp({ create: { width: a.width + gap + b.width, height: h, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{ input: mk, left: 0, top: 0 }, { input: tx, left: a.width + gap, top: Math.round((h - b.height) / 2) }]).png().toBuffer();
}

async function emit(name, make1x, make2x) {
  for (const [suffix, make] of [['', make1x], ['@2x', make2x]]) {
    const buf = await make();
    await sharp(buf).png({ compressionLevel: 9 }).toFile(path.join(OUT, `${name}${suffix}.png`));
    await sharp(buf).webp({ quality: 92, alphaQuality: 100, effort: 6 }).toFile(path.join(OUT, `${name}${suffix}.webp`));
    const m = await meta(buf);
    console.log(`${name}${suffix}`, `${m.width}×${m.height}`);
  }
}
const fit = (buf, opt) => () => sharp(buf).resize(opt).png().toBuffer();

await emit('logo-full', fit(parts.full, { width: 320 }), fit(parts.full, { width: 640 }));
await emit('logo-header', fit(parts.header, { height: 44 }), fit(parts.header, { height: 88 }));
await emit('logo-lockup', () => lockup(44), () => lockup(88));
await emit('logo-mark', () => square(parts.mark, 160, undefined, 1), () => square(parts.mark, 320, undefined, 1));
// the preloader: the full logo's canvas with only the mark visible, so the mark can be plotted in and the
// full logo faded in exactly on top of it
const markOnly = async (w) => {
  const full = await sharp(parts.full).resize({ width: w }).raw().toBuffer({ resolveWithObject: true });
  const cutY = Math.round(full.info.height * (272 / 453)); // the mark ends above "THE SAMSKRITI"
  for (let i = cutY * full.info.width * 4 + 3; i < full.data.length; i += 4) full.data[i] = 0;
  return sharp(full.data, { raw: full.info }).png().toBuffer();
};
await emit('logo-markonly', () => markOnly(320), () => markOnly(640));

/* ---------- the preloader logo: stacked, no web address, split into mark and text layers (same canvas) ---------- */
// the row where the mark ends: the longest fully transparent band between 40% and 85% of the height
async function splitRow(buf) {
  const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
  const empty = (y) => { for (let x = 0; x < info.width; x++) if (data[(y * info.width + x) * 4 + 3] > 30) return false; return true; };
  let best = [0, 0], run = null;
  for (let y = Math.floor(info.height * 0.4); y < info.height * 0.85; y++) {
    if (empty(y)) { run = run || [y, y]; run[1] = y; if (run[1] - run[0] > best[1] - best[0]) best = [...run]; } else run = null;
  }
  return { y: Math.round((best[0] + best[1]) / 2), info, data };
}
async function layer(w, keep) { // keep: 'mark' | 'text'
  const buf = await sharp(parts.header).resize({ width: w }).png().toBuffer();
  const { y, info, data } = await splitRow(buf);
  const d = Buffer.from(data);
  for (let yy = 0; yy < info.height; yy++) if ((keep === 'mark') !== (yy < y)) for (let x = 0; x < info.width; x++) d[(yy * info.width + x) * 4 + 3] = 0;
  return sharp(d, { raw: info }).png().toBuffer();
}
await emit('logo-stack', fit(parts.header, { width: 280 }), fit(parts.header, { width: 560 }));
await emit('logo-stack-mark', () => layer(280, 'mark'), () => layer(560, 'mark'));
await emit('logo-stack-text', () => layer(280, 'text'), () => layer(560, 'text'));

/* ---------- logo-on-light: the white parts (roof, INTERIORS) become plum, orange and yellow stay ---------- */
async function onLight(buf) {
  const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
  const d = Buffer.from(data);
  for (let i = 0; i < d.length; i += 4) {
    const r = d[i], g = d[i + 1], b = d[i + 2];
    if (Math.min(r, g, b) > 170 && Math.max(r, g, b) - Math.min(r, g, b) < 40) { d[i] = 0x2a; d[i + 1] = 0x1d; d[i + 2] = 0x52; }
  }
  return sharp(d, { raw: info }).png().toBuffer();
}
await emit('logo-full-light', async () => onLight(await fit(parts.full, { width: 320 })()), async () => onLight(await fit(parts.full, { width: 640 })()));
await emit('logo-lockup-light', async () => onLight(await lockup(44)), async () => onLight(await lockup(88)));
await emit('logo-stack-light', async () => onLight(await fit(parts.header, { width: 280 })()), async () => onLight(await fit(parts.header, { width: 560 })()));

/* ---------- 3. icons on plum ---------- */
const icon = (size) => square(parts.mark, size, PLUM, 0.74);
await sharp(await icon(180)).png().toFile('public/apple-touch-icon.png');
await sharp(await icon(512)).png().toFile('public/icon-512.png');
await sharp(await icon(192)).png().toFile('public/icon-192.png');
// favicon.ico: an ICO container holding PNG images (valid for every current browser)
const sizes = [16, 32, 48];
const pngs = await Promise.all(sizes.map(async (s) => sharp(await icon(s)).png().toBuffer()));
const head = Buffer.alloc(6 + 16 * sizes.length);
head.writeUInt16LE(0, 0); head.writeUInt16LE(1, 2); head.writeUInt16LE(sizes.length, 4);
let off = head.length;
sizes.forEach((s, i) => {
  const e = 6 + 16 * i;
  head.writeUInt8(s, e); head.writeUInt8(s, e + 1); head.writeUInt8(0, e + 2); head.writeUInt8(0, e + 3);
  head.writeUInt16LE(1, e + 4); head.writeUInt16LE(32, e + 6); head.writeUInt32LE(pngs[i].length, e + 8); head.writeUInt32LE(off, e + 12);
  off += pngs[i].length;
});
fs.writeFileSync('public/favicon.ico', Buffer.concat([head, ...pngs]));
console.log('favicon.ico, apple-touch-icon.png, icon-192.png, icon-512.png');
const mk = await meta(parts.mark), fl = await meta(parts.full);
console.log('source sizes — mark', `${mk.width}×${mk.height}`, '· full', `${fl.width}×${fl.height}`);

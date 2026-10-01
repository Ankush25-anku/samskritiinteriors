// NOVARA image pipeline — run with `node scripts/process-images.mjs`
// Crops each chosen Unsplash original (scripts/raw/<slot>-<id>.jpg) to its slot, applies one consistent grade,
// writes AVIF/WebP/JPG at 800/1600/2400 into public/img/, builds blueprint "drawing" versions of the interiors,
// and writes src/img-placeholders.json (dimensions, available widths, 24px blurred placeholder).
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const RAW = path.join(root, 'scripts/raw');
const OUT = path.join(root, 'public/img');
const WIDTHS = [800, 1600, 2400];
const Q = { avif: 55, webp: 72, jpg: 80 };

// slot → chosen photo. aspect = [w, h]; grade = interior grade; drawing = build a blueprint version.
// widths: override the 800/1600/2400 set (team portraits also serve 38px avatars; materials serve small swatches).
// position: sharp crop strategy (default 'attention'); team portraits keep the head in frame.
const SLOTS = {
  // hero: bright, warm, no lamp of its own (Lumen is the only lamp in the story). Its line drawing is hand-authored SVG
  // (src/components/RoomDrawing.jsx), not traced. A portrait crop serves phones.
  hero: { id: 'x3mSC1WnWhc', aspect: [16, 10], grade: 'warm', flop: true, cx: 0.5 },
  'hero-portrait': { id: 'x3mSC1WnWhc', raw: 'hero', aspect: [9, 16], grade: 'warm', flop: true, cx: 0.562, widths: [800, 1200, 1600] },
  // Services: one warm room per service, plus a dusk room for 'lights off'; all graded alike (warm)
  'svc-residential': { id: '12WFO8yWrsw', aspect: [4, 5], grade: 'warm' },
  'svc-kitchen': { id: '6W_4ztpmK-E', aspect: [4, 5], grade: 'warm' },
  'svc-wardrobe': { id: 'f16A1-u0oW4', aspect: [4, 5], grade: 'warm' },
  'svc-villa': { id: '1iiFe6dFQ_M', aspect: [4, 5], grade: 'warm' },
  'svc-workplace': { id: 'B74lBYC3PXI', aspect: [4, 5], grade: 'warm' },
  'svc-dusk': { id: 'KD_o-Ml2F_w', aspect: [4, 5], grade: 'warm' },
  bedroom: { id: 'RUvW1KGD9a4', aspect: [16, 10], grade: true, drawing: true },
  dining: { id: 'Mxy87tWuMVE', aspect: [16, 10], grade: true, drawing: true },
  cafe: { id: 'ZEfHrVDF3NM', aspect: [16, 10], grade: true, drawing: true },
  office: { id: 'bEBLQQPhqi8', aspect: [16, 10], grade: true, drawing: true },
  villa: { id: 'Id7u0EkTjBE', aspect: [16, 10], grade: true, drawing: true },
  penthouse: { id: '-RWieW0kJ1E', aspect: [16, 10], grade: true, drawing: true },
  arch: { id: 'WhqHH3L47nY', aspect: [4, 5], grade: true },
  detail: { id: 'uluH5a0sRdw', aspect: [9, 10], grade: true },
  'material-stone': { id: 'ZSZClcM0qWQ', aspect: [3, 4], widths: [160, 400, 800, 1600, 2400] },
  'material-nero': { id: 'osuiatBDTww', aspect: [3, 4], widths: [160, 400, 800, 1600, 2400] },
  'team-1': { id: 'N3KUeEzHkMM', raw: 'team', aspect: [1, 1], widths: [160, 400, 800, 1600], position: 'north' },
  'team-2': { id: '7oMpkXrMCmw', raw: 'team', aspect: [1, 1], widths: [160, 400, 800, 1600], position: 'north' },
  'team-3': { id: 'WUY0W2RSiBw', raw: 'team', aspect: [1, 1], widths: [160, 400, 800, 1600], position: 'attention' },
  'team-4': { id: 'D-8XODEIr_s', raw: 'team', aspect: [1, 1], widths: [160, 400, 800, 1600], position: 'attention' },
};

/* ---------- grade: one look for every interior ---------- */
const PLUM = { r: 0x1b, g: 0x12, b: 0x36 };
async function warm(img) {
  const { channels } = await img.clone().stats();
  const mean = (channels[0].mean + channels[1].mean + channels[2].mean) / 3;
  const expo = Math.min(1.12, Math.max(0.97, Math.pow(132 / mean, 0.3))); // keep rooms bright
  const c = 1.03;
  return sharp(await img.modulate({ saturation: 1.02 }).linear([expo * c * 1.035, expo * c * 1.005, expo * c * 0.955], [-(128 * (c - 1)), -(128 * (c - 1)), -(128 * (c - 1))]).toBuffer());
}
async function grade(img) {
  const { channels } = await img.clone().stats();
  const mean = (channels[0].mean + channels[1].mean + channels[2].mean) / 3;
  const expo = Math.min(1.1, Math.max(0.94, Math.pow(118 / mean, 0.3))); // slight exposure normalise
  const c = 1.06; // contrast +6%
  const buf = await img
    .modulate({ saturation: 0.92 }) // saturation −8%
    .linear([expo * c * 1.01, expo * c, expo * c * 0.975], [-(128 * (c - 1)), -(128 * (c - 1)), -(128 * (c - 1))]) // contrast + warm highlights
    .toBuffer();
  const { width, height } = await sharp(buf).metadata();
  // lift the blacks toward plum: a 6% plum layer in screen mode only touches the shadows
  const lift = await sharp({ create: { width, height, channels: 4, background: { ...PLUM, alpha: 0.06 } } }).png().toBuffer();
  return sharp(buf).composite([{ input: lift, blend: 'screen' }]);
}

/* ---------- drawing: Sobel edges → clean lilac lines on plum (no grid: lines are rare and meaningful) ---------- */
// opts (per slot): blur before edge detection, lo/hi levels, minFrag = drop edge fragments shorter than this (px),
// suppress = [[x0,y0,x1,y1] in % of the frame] regions to leave empty (e.g. busy plants)
async function drawing(src, W, H, opts = {}) {
  const { blur = 1.2, lo = 0.26, hi = 0.66, minFrag = 0, suppress = [] } = opts === true ? {} : opts;
  const grey = await sharp(src).resize(W, H).greyscale().normalise({ lower: 1, upper: 99 }).median(5).blur(blur).toBuffer();
  const sob = (kernel) => sharp(grey).convolve({ width: 3, height: 3, kernel, scale: 4, offset: 128 }).greyscale().raw().toBuffer();
  const [gx, gy] = await Promise.all([sob([-1, 0, 1, -2, 0, 2, -1, 0, 1]), sob([-1, -2, -1, 0, 0, 0, 1, 2, 1])]);
  const n = W * H, mag = new Float32Array(n);
  for (let i = 0; i < n; i++) mag[i] = Math.hypot(gx[i] - 128, gy[i] - 128);
  // normalise against the 98.5th percentile, then levels so only real edges survive
  const sorted = Float32Array.from(mag).sort();
  const p99 = sorted[Math.floor(n * 0.985)] || 1;
  const LO = lo, HI = hi;
  // levels first, then drop short fragments (8-connected components whose bounding box is under minFrag px)
  const A = new Float32Array(n);
  for (let i = 0; i < n; i++) { const a = Math.min(1, Math.max(0, (mag[i] / p99 - LO) / (HI - LO))); A[i] = a * a * (3 - 2 * a) * 0.92; }
  for (const [x0, y0, x1, y1] of suppress) for (let y = Math.floor(y0 / 100 * H); y < y1 / 100 * H; y++) for (let x = Math.floor(x0 / 100 * W); x < x1 / 100 * W; x++) A[y * W + x] = 0;
  if (minFrag) {
    const seen = new Uint8Array(n), stack = new Int32Array(n);
    for (let i0 = 0; i0 < n; i0++) {
      if (seen[i0] || A[i0] < 0.08) continue;
      let sp = 0, cnt = 0, minx = W, maxx = 0, miny = H, maxy = 0; const comp = [];
      stack[sp++] = i0; seen[i0] = 1;
      while (sp) {
        const i = stack[--sp], x = i % W, y = (i / W) | 0; comp.push(i); cnt++;
        if (x < minx) minx = x; if (x > maxx) maxx = x; if (y < miny) miny = y; if (y > maxy) maxy = y;
        for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
          const nx = x + dx, ny = y + dy; if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
          const j = ny * W + nx; if (!seen[j] && A[j] >= 0.08) { seen[j] = 1; stack[sp++] = j; }
        }
      }
      if (Math.hypot(maxx - minx, maxy - miny) < minFrag) for (const i of comp) A[i] = 0;
    }
  }
  const out = Buffer.alloc(n * 3);
  const bg = [0x2a, 0x1d, 0x52], ln = [0xd6, 0xcc, 0xff], grid = [184, 166, 255];
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const i = y * W + x;
    const a = A[i];
    const g = 0;
    for (let k = 0; k < 3; k++) {
      const base = bg[k] + (grid[k] - bg[k]) * g;
      out[i * 3 + k] = Math.round(base + (ln[k] - base) * a);
    }
  }
  return sharp(await sharp(out, { raw: { width: W, height: H, channels: 3 } }).png().toBuffer());
}

/* ---------- output ---------- */
async function emit(name, img, fullW, list = WIDTHS) {
  const widths = list.filter((w) => w <= fullW);
  if (!widths.length) widths.push(fullW);
  const buf = await img.toBuffer();
  for (const w of widths) {
    const r = sharp(buf).resize({ width: w });
    await r.clone().avif({ quality: Q.avif, effort: 5 }).toFile(path.join(OUT, `${name}-${w}.avif`));
    await r.clone().webp({ quality: Q.webp }).toFile(path.join(OUT, `${name}-${w}.webp`));
    await r.clone().jpeg({ quality: Q.jpg, mozjpeg: true }).toFile(path.join(OUT, `${name}-${w}.jpg`));
  }
  const plainW = Math.min(1600, fullW);
  await sharp(buf).resize({ width: plainW }).jpeg({ quality: Q.jpg, mozjpeg: true }).toFile(path.join(OUT, `${name}.jpg`));
  const ph = await sharp(buf).resize({ width: 24 }).blur(0.6).webp({ quality: 40 }).toBuffer();
  const { width, height } = await sharp(buf).metadata();
  return { w: width, h: height, widths, ph: `data:image/webp;base64,${ph.toString('base64')}` };
}

fs.mkdirSync(OUT, { recursive: true });
const manifest = {};
const only = process.argv.slice(2);
for (const [slot, cfg] of Object.entries(SLOTS)) {
  if (only.length && !only.includes(slot)) continue;
  const file = path.join(RAW, `${cfg.raw || slot}-${cfg.id}.jpg`);
  const meta = await sharp(file).metadata();
  const [aw, ah] = cfg.aspect;
  let cw = meta.width, ch = Math.round((meta.width * ah) / aw);
  if (ch > meta.height) { ch = meta.height; cw = Math.round((meta.height * aw) / ah); }
  // flop: mirror the room (the hero is mirrored so its clear space above the table sits under Lumen);
  // cx: crop centred on this fraction of the (mirrored) width instead of a gravity guess
  let src = file;
  if (cfg.flop) src = await sharp(file).rotate().flop().toBuffer();
  let img = cfg.cx != null
    ? sharp(src).rotate().extract({ left: Math.max(0, Math.min(meta.width - cw, Math.round(cfg.cx * meta.width - cw / 2))), top: Math.round((meta.height - ch) / 2), width: cw, height: ch })
    : sharp(src).rotate().resize(cw, ch, { fit: 'cover', position: cfg.position || 'attention' });
  if (cfg.grade) img = cfg.grade === 'warm' ? await warm(img) : await grade(img);
  const cropped = await img.jpeg({ quality: 95 }).toBuffer();
  manifest[slot] = await emit(slot, sharp(cropped), cw, cfg.widths);
  if (cfg.drawing) {
    const W = 1600, H = Math.round((1600 * ah) / aw);
    manifest[`${slot}-drawing`] = await emit(`${slot}-drawing`, await drawing(cropped, W, H, cfg.drawing), W);
  }
  console.log(slot, `${cw}×${ch}`, manifest[slot].widths.join('/'));
}
// the site-wide grain overlay: a lossy WebP next to the original PNG (it's noise — the loss is invisible)
if (!only.length || only.includes('grain')) await sharp(path.join(OUT, 'grain.png')).webp({ quality: 85, alphaQuality: 80 }).toFile(path.join(OUT, 'grain.webp'));

const phFile = path.join(root, 'src/img-placeholders.json');
const prev = only.length && fs.existsSync(phFile) ? JSON.parse(fs.readFileSync(phFile, 'utf8')) : {};
fs.writeFileSync(phFile, JSON.stringify({ ...prev, ...manifest }, null, 2));
console.log('wrote', Object.keys(manifest).length, 'entries');

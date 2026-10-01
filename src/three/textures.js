// Procedural textures, drawn once into small canvases — nothing is downloaded.
import * as THREE from 'three';

function rng(seed) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}

/** Tileable value noise heightfield (0..1), `cells` blobs per side, `octaves` layers. */
function heightfield(size, cells, octaves, seed) {
  const r = rng(seed), h = new Float32Array(size * size);
  for (let o = 0; o < octaves; o++) {
    const c = cells * 2 ** o, grid = Array.from({ length: c * c }, () => r()), amp = 0.5 ** o;
    for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
      const gx = (x / size) * c, gy = (y / size) * c, x0 = Math.floor(gx), y0 = Math.floor(gy);
      const fx = gx - x0, fy = gy - y0, sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy);
      const g = (i, j) => grid[((j % c) + c) % c * c + (((i % c) + c) % c)];
      const a = g(x0, y0) + (g(x0 + 1, y0) - g(x0, y0)) * sx;
      const b = g(x0, y0 + 1) + (g(x0 + 1, y0 + 1) - g(x0, y0 + 1)) * sx;
      h[y * size + x] += (a + (b - a) * sy) * amp;
    }
  }
  return h;
}

/** Heightfield → tangent-space normal map (Sobel). */
export function noiseNormal({ size = 256, cells = 8, octaves = 3, strength = 2, seed = 7, repeat = 1 } = {}) {
  const h = heightfield(size, cells, octaves, seed);
  const cv = document.createElement('canvas');
  cv.width = cv.height = size;
  const ctx = cv.getContext('2d'), img = ctx.createImageData(size, size);
  const at = (x, y) => h[((y + size) % size) * size + ((x + size) % size)];
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const dx = (at(x + 1, y) - at(x - 1, y)) * strength, dy = (at(x, y + 1) - at(x, y - 1)) * strength;
    const l = Math.hypot(dx, dy, 1), i = (y * size + x) * 4;
    img.data[i] = (-dx / l * 0.5 + 0.5) * 255;
    img.data[i + 1] = (-dy / l * 0.5 + 0.5) * 255;
    img.data[i + 2] = (1 / l * 0.5 + 0.5) * 255;
    img.data[i + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  const t = new THREE.CanvasTexture(cv);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(repeat, repeat);
  t.colorSpace = THREE.NoColorSpace;
  return t;
}

/** Pale oak planks: varied board tones, grain streaks, fine seams. */
export function oakTexture() {
  const W = 1024, H = 1024, boards = 8, r = rng(42);
  const cv = document.createElement('canvas');
  cv.width = W; cv.height = H;
  const ctx = cv.getContext('2d');
  const tones = ['#D8BF9A', '#D2B690', '#DDC6A3', '#CFB18A', '#D6BC96', '#E0CAA8', '#D4B892', '#DAC19D'];
  const bw = W / boards;
  for (let b = 0; b < boards; b++) {
    ctx.fillStyle = tones[b];
    ctx.fillRect(b * bw, 0, bw, H);
    for (let k = 0; k < 26; k++) { // grain
      const x0 = b * bw + r() * bw, wob = 2 + r() * 5, ph = r() * 6;
      ctx.strokeStyle = `rgba(120,86,50,${0.05 + r() * 0.1})`;
      ctx.lineWidth = 0.6 + r() * 1.4;
      ctx.beginPath();
      for (let y = 0; y <= H; y += 16) { const x = x0 + Math.sin(y / 90 + ph) * wob; y ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
      ctx.stroke();
    }
    const cut = r() * H; // butt joint
    ctx.fillStyle = 'rgba(90,64,40,.35)';
    ctx.fillRect(b * bw, cut, bw, 2);
    ctx.fillStyle = 'rgba(90,64,40,.45)'; // seam
    ctx.fillRect(b * bw, 0, 2, H);
  }
  const t = new THREE.CanvasTexture(cv);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

/** Evening sky for behind the window: lilac overhead → warm peach at the horizon, with a low sun glow. */
export function skyTexture() {
  const cv = document.createElement('canvas');
  cv.width = 64; cv.height = 256;
  const ctx = cv.getContext('2d');
  const g = ctx.createLinearGradient(0, 0, 0, 256);
  g.addColorStop(0, '#8E86C4');
  g.addColorStop(0.45, '#C9A9C8');
  g.addColorStop(0.75, '#F6C6A2');
  g.addColorStop(1, '#FFDDB8');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 256);
  const t = new THREE.CanvasTexture(cv);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

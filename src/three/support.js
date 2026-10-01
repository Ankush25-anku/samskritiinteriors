// Hero mode — decided ONCE, before any WebGL code is downloaded, and never changed mid-session.
//   '3d'    → the real-time room (decision stored per browser after a 120-frame probe)
//   'photo' → the photo/drawing storyboard
// The stored decision lives in localStorage('novara-hero-mode'); ?no3d / ?force3d override it for testing.
import { getCalm } from '../store/calm.js';

const KEY = 'novara-hero-mode';
const params = () => new URLSearchParams(window.location.search);
export const force3D = () => params().has('force3d');

let gpuCache;
/** One throwaway context, released immediately. Returns { webgl2, renderer, integrated }. */
export function gpuInfo() {
  if (gpuCache) return gpuCache;
  gpuCache = { webgl2: false, renderer: '', integrated: true };
  try {
    const c = document.createElement('canvas');
    const gl = c.getContext('webgl2');
    if (gl) {
      gpuCache.webgl2 = true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      gpuCache.renderer = ext ? String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)) : '';
      // integrated: Intel / Apple / AMD "Radeon(TM) Graphics" APUs / mobile GPUs — anything that isn't a named discrete card
      gpuCache.integrated = !/(RTX|GTX|Quadro|Radeon\s?(RX|Pro)|Arc\s?A\d)/i.test(gpuCache.renderer);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    }
  } catch { /* no WebGL */ }
  return gpuCache;
}

const read = () => { try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch { return null; } };
export function storeHeroMode(mode, reason, fps) {
  try { localStorage.setItem(KEY, JSON.stringify({ mode, reason, fps: fps ? Math.round(fps) : undefined, at: Date.now() })); } catch { /* private mode */ }
}

let initial;
/** The starting decision: { mode: '3d' | 'photo' | 'probe', reason } — 'probe' = 3D, pending the one-time fps test.
 *  Computed once per page load. */
export function initialHeroMode() {
  if (initial) return initial;
  const decide = () => {
    if (params().has('no3d')) return { mode: 'photo', reason: 'url ?no3d' };
    if (force3D()) return { mode: '3d', reason: 'url ?force3d' };
    if (getCalm()) return { mode: 'photo', reason: 'calm mode' };
    // phones and tablets: the photo storyboard, always — no WebGL context, no three.js download (only ?force3d)
    if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return { mode: 'photo', reason: 'touch device' };
    const saved = read();
    if (saved && (saved.mode === '3d' || saved.mode === 'photo')) return { mode: saved.mode, reason: `saved · ${saved.reason}${saved.fps ? ` (${saved.fps} fps)` : ''}` };
    if (!gpuInfo().webgl2) { storeHeroMode('photo', 'no WebGL2'); return { mode: 'photo', reason: 'no WebGL2' }; }
    if ((navigator.hardwareConcurrency || 8) <= 4 && window.innerWidth < 768) { storeHeroMode('photo', 'low-end phone'); return { mode: 'photo', reason: 'low-end phone' }; }
    return { mode: 'probe', reason: 'first visit — measuring' };
  };
  initial = decide();
  return initial;
}

export const canUse3D = () => initialHeroMode().mode !== 'photo';

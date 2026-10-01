// Shared, render-free state between the 3D hero and the SVG Lumen (src/components/Lumen.jsx).
// The 3D scene writes the lamp's projected screen position every frame; the SVG lamp reads it.
export const lumen3d = {
  active: false, // true while the 3D lamp *is* Lumen (hero on screen, WebGL running)
  x: 0,          // projected shade centre, viewport px
  y: 0,
  r: 64,         // projected shade radius, px (the SVG shade radius is 64 units)
  handoff: 0,    // 0 = SVG Lumen hidden … 1 = SVG Lumen fully visible (last 5% of the hero)
  subs: new Set(),
  emit() { this.subs.forEach((f) => f()); },
  subscribe(f) { this.subs.add(f); return () => this.subs.delete(f); },
};

// The travelling SVG Lumen publishes where it is (viewport px) so sections can react to its light.
export const lumenPos = {
  on: false, x: 0, y: 0, s: 1, beam: 0,
  subs: new Set(),
  emit() { this.subs.forEach((f) => f()); },
  subscribe(f) { this.subs.add(f); return () => this.subs.delete(f); },
};

// Resolves once the 3D scene has compiled every shader (the preloader waits for it).
let warmResolve;
export const warmed = new Promise((r) => { warmResolve = r; });
export const markWarmed = () => warmResolve();

// Small remote control for the travelling lamp: the footer's pull cord and the "sheet sent" flash.
export const lumenCtl = {
  footerOff: false,
  flashAt: 0,
  subs: new Set(),
  set(patch) { Object.assign(this, patch); this.subs.forEach((f) => f()); },
  subscribe(f) { this.subs.add(f); return () => this.subs.delete(f); },
};

// The hero's gate: the preloader waits on it. Settled once with the final hero mode for this session.
export const heroGate = {
  state: null, // { mode: '3d' | 'photo', reason }
  subs: new Set(),
  settle(mode, reason) { if (this.state) return; this.state = { mode, reason }; this.subs.forEach((f) => f(this.state)); },
  subscribe(f) { this.subs.add(f); if (this.state) f(this.state); return () => this.subs.delete(f); },
};

// Live counters for the debug badge
export const debugInfo = { webgl: 0, lenis: 0, commits: 0, contextLost: 0 };

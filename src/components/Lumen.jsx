import { useEffect, useId, useRef, useState } from 'react';
import { animate, motion, useMotionTemplate, useMotionValue, useMotionValueEvent, useScroll, useSpring, useTransform, useVelocity } from 'framer-motion';
import { lumen as copy } from '../data.js';
import { CURTAIN } from './ui.jsx';
import { lumen3d, lumenPos, lumenCtl } from '../three/store.js';
import { useCalm } from '../store/calm.js';

/*
  Lumen — the brass pendant that tells the story.
  Anchors are plain elements carrying data-lumen="<name>":
    data-lumen-state   line | sketch | spec | built | lit | off
    data-lumen-scale   size multiplier            data-lumen-beam        beam width multiplier
    data-lumen-bg      "light" on lavender sheets  data-lumen-mobile-beam / -scale / -y / -y2  overrides below 760px
    data-lumen-hold    a tall tracker inside a pinned section: while the viewport centre is inside it,
                       the lamp holds still at data-lumen-y (→ data-lumen-y2), fractions of the viewport.
  The anchor point is the middle of the shade (svg 100,160). The cord top (svg y 0) is the pivot.
*/

const SPRING = { stiffness: 90, damping: 22 };
const MOBILE = 760;
const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const num = (v, f) => (v == null || v === '' ? f : parseFloat(v));

/* ---------- The drawing itself: one SVG, one group per stage of its life ---------- */
export function LumenLamp({ state = 'lit', light }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  const is = (...k) => k.includes(state);
  const fade = { duration: 0.6, ease: 'easeInOut' };
  const draw = { pathLength: { duration: 1.4, ease: CURTAIN }, opacity: fade };
  const sketch = is('sketch', 'spec') ? { pathLength: 1, opacity: 1 } : is('line') ? { pathLength: 0, opacity: 0 } : { opacity: 0 };
  const pencil = { fill: 'none', stroke: '#D6CCFF', strokeWidth: 1.6, strokeLinecap: 'round' };
  const mono = { fill: '#FF6F59', fontFamily: 'IBM Plex Mono, monospace', fontSize: 10.5, letterSpacing: 1.2 };

  return (
    <svg className="lumen-svg" viewBox="0 0 200 320" width="200" height="320" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}br`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#5E4220" /><stop offset=".22" stopColor="#A57A3E" /><stop offset=".42" stopColor="#E9CD95" /><stop offset=".5" stopColor="#F7E6C2" /><stop offset=".62" stopColor="#C29454" /><stop offset=".86" stopColor="#7E5B2C" /><stop offset="1" stopColor="#4F3719" />
        </linearGradient>
        <linearGradient id={`${id}sh`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".18" /><stop offset=".55" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor="#1B1236" stopOpacity=".32" />
        </linearGradient>
        <linearGradient id={`${id}sp`} gradientUnits="userSpaceOnUse" x1="60" y1="176" x2="100" y2="132">
          <stop offset="0" stopColor="#FFF8E8" stopOpacity="0" /><stop offset=".5" stopColor="#FFF8E8" stopOpacity=".95" /><stop offset="1" stopColor="#FFF8E8" stopOpacity=".15" />
        </linearGradient>
        <radialGradient id={`${id}ul`} cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor="#FFF4DD" /><stop offset=".6" stopColor="#FFD9A0" /><stop offset="1" stopColor="#E0A860" />
        </radialGradient>
        <linearGradient id={`${id}cl`} gradientUnits="userSpaceOnUse" x1="0" y1="-40" x2="0" y2="118">
          <stop offset="0" stopColor="#D6CCFF" stopOpacity="0" /><stop offset="1" stopColor="#D6CCFF" />
        </linearGradient>
        <linearGradient id={`${id}cb`} gradientUnits="userSpaceOnUse" x1="0" y1="-40" x2="0" y2="118">
          <stop offset="0" stopColor="#B38B4F" stopOpacity="0" /><stop offset="1" stopColor="#B38B4F" />
        </linearGradient>
        <pattern id={`${id}bh`} width="4" height="3" patternUnits="userSpaceOnUse">
          <rect width="4" height="1" fill="rgba(255,255,255,.14)" />
        </pattern>
      </defs>

      {/* 1 · the pencil line that starts everything — drops from the top of the screen */}
      <motion.path d="M100 -1400 V160" fill="none" stroke="#FF6F59" strokeWidth="2" strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 1 }} animate={is('line') ? { pathLength: [0, 1], opacity: 1 } : { opacity: 0 }}
        transition={{ pathLength: { duration: 1.6, ease: CURTAIN }, opacity: fade }} />

      {/* cord — lilac while drawn, brass once built; both fade out towards the ceiling */}
      <motion.path d="M100 -40 V120" fill="none" stroke={`url(#${id}cl)`} strokeWidth="1.6" initial={{ opacity: 0 }} animate={{ opacity: is('sketch', 'spec') ? 1 : 0 }} transition={fade} />
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: is('built', 'lit', 'off') ? 1 : 0 }} transition={fade}>
        <path d="M103 -40 V118" fill="none" stroke="#1B1236" strokeOpacity=".16" strokeWidth="3" />
        <path d="M100 -40 V120" fill="none" stroke={`url(#${id}cb)`} strokeWidth="2" />
      </motion.g>

      {/* 2 · sketch — the shade and bulb in pencil, drawn on */}
      <g>
        <motion.path {...pencil} d="M94 128 V116 H106 V128" initial={{ pathLength: 0, opacity: 0 }} animate={sketch} transition={draw} />
        <motion.path {...pencil} d="M36 190 C36 150 66 128 100 128 C134 128 164 150 164 190 Z" initial={{ pathLength: 0, opacity: 0 }} animate={sketch} transition={{ ...draw, pathLength: { duration: 1.6, ease: CURTAIN, delay: 0.15 } }} />
        <motion.ellipse {...pencil} cx="100" cy="190" rx="64" ry="3" initial={{ pathLength: 0, opacity: 0 }} animate={sketch} transition={{ ...draw, pathLength: { duration: 1, ease: CURTAIN, delay: 0.5 } }} />
        <motion.circle {...pencil} cx="100" cy="200" r="8" initial={{ pathLength: 0, opacity: 0 }} animate={sketch} transition={{ ...draw, pathLength: { duration: 0.8, ease: CURTAIN, delay: 0.8 } }} />
        {/* second, looser pass — the pencil's double line */}
        <motion.path d="M37.5 191.5 C38 152 67 130 101 129.5 C135 130 163 152 162.5 191" fill="none" stroke="#D6CCFF" strokeWidth=".8" strokeDasharray="3 5"
          initial={{ opacity: 0 }} animate={{ opacity: is('sketch', 'spec') ? 0.45 : 0 }} transition={{ ...fade, delay: is('sketch') ? 1.2 : 0 }} />
      </g>

      {/* 3 · spec — dimension lines and the handwritten callout */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: is('spec') ? 1 : 0 }} transition={fade}>
        <g stroke="#FF6F59" strokeWidth="1.2">
          <line x1="36" y1="214" x2="164" y2="214" /><line x1="31" y1="219" x2="41" y2="209" /><line x1="159" y1="219" x2="169" y2="209" />
          <line x1="36" y1="194" x2="36" y2="220" strokeOpacity=".5" /><line x1="164" y1="194" x2="164" y2="220" strokeOpacity=".5" />
          <line x1="184" y1="0" x2="184" y2="190" /><line x1="179" y1="5" x2="189" y2="-5" /><line x1="179" y1="195" x2="189" y2="185" />
        </g>
        <text {...mono} x="100" y="234" textAnchor="middle">{copy.dims.width}</text>
        <text {...mono} x="198" y="95" textAnchor="middle" transform="rotate(90 198 95)">{copy.dims.drop}</text>
        {/* no handwritten callout here: each scene carries at most one, placed by the hero */}
      </motion.g>

      {/* 4 · built — brushed brass */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: is('built', 'lit', 'off') ? 1 : 0 }} transition={fade}>
        <rect x="93" y="114" width="14" height="15" rx="2" fill={`url(#${id}br)`} />
        <path d="M36 190 C36 150 66 128 100 128 C134 128 164 150 164 190 Z" fill={`url(#${id}br)`} />
        <path d="M36 190 C36 150 66 128 100 128 C134 128 164 150 164 190 Z" fill={`url(#${id}sh)`} />
        <path d="M36 190 C36 150 66 128 100 128 C134 128 164 150 164 190 Z" fill={`url(#${id}bh)`} opacity=".6" />
        <path d="M54 176 C60 152 78 138 99 134" fill="none" stroke={`url(#${id}sp)`} strokeWidth="3.2" strokeLinecap="round" />
        <path d="M124 136 C140 142 152 154 158 170" fill="none" stroke="#FFF2D6" strokeWidth="1.2" strokeLinecap="round" strokeOpacity=".35" />
        <ellipse cx="100" cy="190" rx="64" ry="3.6" fill="#4A3319" stroke="#F3DDB0" strokeWidth="1" />
        <circle cx="100" cy="199" r="8" fill="#4A3C5E" />
      </motion.g>

      {/* 5 · lit — the bulb glows (opacity follows the flicker) */}
      <motion.g style={{ opacity: light ?? (is('lit') ? 1 : 0) }}>
        <ellipse cx="100" cy="190.5" rx="62" ry="3.2" fill={`url(#${id}ul)`} />
        <circle cx="100" cy="199" r="8" fill="#FFF7E8" />
      </motion.g>
    </svg>
  );
}

/* ---------- Light cone. Lives on its own layer so it can blend with the page ---------- */
function LumenCone() {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  return (
    <svg className="lumen-cone" viewBox="0 0 800 760" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}g`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="rgba(255,233,199,.30)" /><stop offset=".5" stopColor="rgba(255,233,199,.10)" /><stop offset="1" stopColor="rgba(255,233,199,0)" />
        </linearGradient>
        <linearGradient id={`${id}s`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#000" /><stop offset=".22" stopColor="#fff" /><stop offset=".78" stopColor="#fff" /><stop offset="1" stopColor="#000" />
        </linearGradient>
        <mask id={`${id}m`} maskContentUnits="objectBoundingBox"><rect width="1" height="1" fill={`url(#${id}s)`} /></mask>
        <radialGradient id={`${id}p`} cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor="rgba(255,233,199,.22)" /><stop offset=".6" stopColor="rgba(255,233,199,.07)" /><stop offset="1" stopColor="rgba(255,233,199,0)" />
        </radialGradient>
      </defs>
      <path d="M338 0 H462 L800 760 H0 Z" fill={`url(#${id}g)`} mask={`url(#${id}m)`} />
      <ellipse cx="400" cy="700" rx="380" ry="70" fill={`url(#${id}p)`} />
    </svg>
  );
}

/* ---------- Anchor geometry: read once on mount / resize / load, never per frame ---------- */
function readAnchors() {
  const W = window.innerWidth, H = window.innerHeight, sy = window.scrollY, mobile = W < MOBILE;
  const docH = document.documentElement.scrollHeight;
  const vMin = H / 2, vMax = Math.max(vMin, docH - H / 2);
  const segs = [];
  document.querySelectorAll('[data-lumen]').forEach((el) => {
    if (!el.getClientRects().length) return; // display:none at this breakpoint
    const d = el.dataset, r0 = el.getBoundingClientRect();
    // sections that slide in as a new drawing sheet may still be offset: measure where they will settle
    const sheet = el.closest('.sheet-in');
    const off = sheet ? parseFloat(getComputedStyle(sheet).translate.split(' ')[1] || getComputedStyle(sheet).translate) || 0 : 0;
    const r = { top: r0.top - off, bottom: r0.bottom - off, left: r0.left, width: r0.width, height: r0.height };
    let scale = num(d.lumenScale, 1), beam = num(d.lumenBeam, 1);
    const reach = num(d.lumenReach, 1);
    if (mobile) { scale = num(d.lumenMobileScale, scale * 0.6); beam = num(d.lumenMobileBeam, beam); }
    const s = { name: d.lumen, state: d.lumenState || 'lit', scale, beam, reach, rot: num(d.lumenRot, 0), bg: d.lumenBg === 'light' ? 1 : 0 };
    if ('lumenHold' in d) {
      s.hold = true;
      s.x = r.left + r.width / 2;
      const y1 = mobile ? num(d.lumenMobileY, num(d.lumenY, 0.5)) : num(d.lumenY, 0.5);
      s.y1 = y1 * H;
      s.y2 = (mobile ? num(d.lumenMobileY2, num(d.lumenY2, y1)) : num(d.lumenY2, y1)) * H;
      s.a = clamp(r.top + sy, vMin, vMax);
      s.b = clamp(r.bottom + sy, vMin, vMax);
    } else {
      s.x = r.left + r.width / 2;
      if (mobile && !('lumenMobileFree' in d)) s.x = clamp(s.x, W * 0.72, W - 36); // right third on phones
      s.doc = r.top + sy + r.height / 2;
      s.a = s.b = clamp(s.doc, vMin, vMax);
    }
    segs.push(s);
  });
  segs.sort((p, q) => p.a - q.a);

  // Long stretches with no anchor: the lamp retreats to the right edge like a sconce, then returns.
  const out = [];
  segs.forEach((s, i) => {
    out.push(s);
    const n = segs[i + 1];
    if (n && n.a - s.b > 2.6 * H) {
      out.push({ name: 'park', state: 'lit', hold: true, x: W - (mobile ? 30 : 76), y1: H * 0.3, y2: H * 0.3, scale: mobile ? 0.3 : 0.42, beam: 0, rot: 0, bg: 0.5, a: s.b + H * 0.9, b: n.a - H * 0.9 });
    }
  });
  return { segs: out, W, H };
}

/* ---------- The traveller ---------- */
function Traveller() {
  const { scrollY } = useScroll();
  const geo = useRef({ segs: [], W: 0, H: 0 });
  const first = useRef(true);
  const stateRef = useRef('line');
  const [state, setState] = useState('line');
  const bodyRef = useRef(null), lightRef = useRef(null);
  const pend = useRef(null); // state hysteresis: { st, at } — a new state must hold for 3% of a screen of scroll

  const tx = useMotionValue(0), ty = useMotionValue(0), ts = useMotionValue(1), tb = useMotionValue(0), tr = useMotionValue(0), tg = useMotionValue(0);
  const x = useSpring(tx, SPRING), y = useSpring(ty, SPRING), s = useSpring(ts, SPRING);
  const beam = useSpring(tb, SPRING), rot = useSpring(tr, SPRING), bg = useSpring(tg, SPRING);
  const trc = useMotionValue(1), reach = useSpring(trc, SPRING);
  const light = useMotionValue(0);
  const vis = useMotionValue(1); // 0 while the 3D lamp is Lumen (hero), 1 once it has been handed over

  // Pendulum: the lamp lags behind horizontal movement, then settles into its sway.
  const vx = useVelocity(x), vy = useVelocity(y);
  const rotate = useTransform([rot, vx], ([r, v]) => r + clamp(v / 90, -9, 9));
  const transform = useMotionTemplate`translate3d(${x}px, ${y}px, 0) scale(${s})`;
  const beamO = useTransform(beam, [0, 0.12], [0, 1]);
  // one light layer, no blend modes: slightly softer on the lavender sheets
  const lightO = useTransform([light, bg, vis], ([l, g, o]) => l * (1 - g * 0.4) * o);

  const frame = (sy) => {
    const { segs, W, H } = geo.current;
    if (!segs.length) return;
    const vc = sy + H / 2;
    let k = segs.findIndex((g) => g.a > vc);
    if (k === -1) k = segs.length;
    let A, B = null, t = 0;
    if (k === 0) A = segs[0];
    else {
      A = segs[k - 1];
      if (vc > A.b && k < segs.length) { B = segs[k]; t = (vc - A.b) / Math.max(1, B.a - A.b); }
    }
    const at = (g, end) => (g.hold ? [g.x, end ? (g.b > g.a ? lerp(g.y1, g.y2, clamp((vc - g.a) / (g.b - g.a), 0, 1)) : g.y1) : g.y1] : [g.x, g.doc - sy]);
    // In the hero the real-time 3D lamp is Lumen: follow its projected position, hidden, until the hand-off.
    const in3D = lumen3d.active && A.name.startsWith('hero-');
    let px, py, sc, bm, rr, bgv, rc, st, alpha = 1;
    if (!B) {
      [px, py] = at(A, true);
      ({ scale: sc, beam: bm, rot: rr, bg: bgv, state: st, reach: rc } = A);
      if (in3D) { px = lumen3d.x; py = lumen3d.y; sc = lumen3d.r / 64; rr = 0; alpha = lumen3d.handoff; }
    } else {
      const e = easeInOutCubic(t);
      const [ax, ay] = in3D ? [lumen3d.x, lumen3d.y] : A.hold ? [A.x, A.y2] : [A.x, A.doc - sy];
      if (in3D) A = { ...A, scale: lumen3d.r / 64, rot: 0 };
      const [bx, by] = B.hold ? [B.x, B.y1] : [B.x, B.doc - sy];
      px = lerp(ax, bx, e); py = lerp(ay, by, e);
      sc = lerp(A.scale, B.scale, e); bm = lerp(A.beam, B.beam, e); rr = lerp(A.rot, B.rot, e); bgv = lerp(A.bg, B.bg, e); rc = lerp(A.reach ?? 1, B.reach ?? 1, e);
      st = t < 0.5 ? A.state : B.state;
    }
    // Stay clear of the nav and inside the screen (not while shadowing the 3D lamp — the hand-off must be exact).
    if (!(in3D && !B)) {
      const half = 64 * sc;
      px = clamp(px, half + 8, W - half - 8);
      py = clamp(py, 90 + 40 * sc, H - 30);
    }
    // the footer's pull cord can switch the lamp off where it hangs
    if (lumenCtl.footerOff && ((!B && A.name === 'footer') || (B && B.name === 'footer' && t > 0.5))) st = 'off';
    tx.set(px); ty.set(py); ts.set(sc); tb.set(bm); tr.set(rr); tg.set(bgv); trc.set(rc ?? 1);
    vis.set(alpha);
    if (in3D && !B && alpha < 0.02) [x, y, s].forEach((m, i) => m.jump([px, py, sc][i])); // hidden: no lag
    const firstFrame = first.current;
    if (first.current) { first.current = false; [x, y, s, beam, rot, bg].forEach((m, i) => m.jump([px, py, sc, bm, rr, bgv][i])); }
    // hysteresis: a change of state only commits after 3% of a screen of further scroll, so tiny movements at a
    // boundary can't toggle line/sketch/spec/built/lit back and forth
    if (st === stateRef.current) pend.current = null;
    else if (!pend.current || pend.current.st !== st) pend.current = { st, at: sy };
    if (pend.current && (firstFrame || Math.abs(sy - pend.current.at) >= H * 0.03)) {
      stateRef.current = st; pend.current = null; setState(st);
    }
  };

  useMotionValueEvent(scrollY, 'change', frame);
  // the 3D camera keeps gliding after the scroll stops, so the 3D scene also pings us every frame
  useEffect(() => lumen3d.subscribe(() => frame(window.scrollY)), []);
  useEffect(() => lumenCtl.subscribe(() => {
    frame(window.scrollY);
    // a sheet was sent: the lamp above Contact flashes once
    if (performance.now() - lumenCtl.flashAt < 200 && stateRef.current === 'lit') animate(light, [1, 0.15, 1.6, 0.6, 1], { duration: 0.7, times: [0, 0.2, 0.45, 0.7, 1] });
  }), []);

  // publish the lamp's position (and whether it is lit and visible) for sections that react to its light
  const publish = () => {
    lumenPos.on = stateRef.current === 'lit' && vis.get() > 0.5;
    lumenPos.x = x.get(); lumenPos.y = y.get(); lumenPos.s = s.get(); lumenPos.beam = beam.get();
    lumenPos.emit();
  };
  useMotionValueEvent(y, 'change', publish);
  useMotionValueEvent(x, 'change', publish);
  useEffect(() => () => { lumenPos.on = false; lumenPos.emit(); }, []);

  useEffect(() => {
    let raf = 0;
    const measure = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => { geo.current = readAnchors(); frame(window.scrollY); });
    };
    measure();
    // anchors are read once, then again only when the layout really changes — debounced, and never for the
    // height-only resizes a phone's URL bar makes while you scroll (that would mean layout reads mid-scroll)
    let t = 0, lastW = window.innerWidth, lastH = window.innerHeight;
    const later = () => { clearTimeout(t); t = setTimeout(measure, 150); };
    const onResize = () => {
      const w = window.innerWidth, h = window.innerHeight;
      if (w === lastW && Math.abs(h - lastH) < 160) return;
      lastW = w; lastH = h; later();
    };
    const ro = new ResizeObserver(later); // the page got taller/shorter (a section loaded, a panel opened)
    ro.observe(document.body);
    window.addEventListener('resize', onResize);
    window.addEventListener('load', measure);
    document.fonts?.ready.then(measure);
    return () => { cancelAnimationFrame(raf); clearTimeout(t); ro.disconnect(); window.removeEventListener('resize', onResize); window.removeEventListener('load', measure); };
  }, []);

  // Switch-on flicker; fade when switched off or when the lamp goes back to paper.
  useEffect(() => {
    const c = state === 'lit'
      ? (light.get() < 0.5 ? animate(light, [0, 1, 0.6, 1], { duration: 0.4, times: [0, 0.35, 0.65, 1] }) : animate(light, 1, { duration: 0.3 }))
      : animate(light, 0, { duration: 0.6 });
    return () => c.stop();
  }, [state]);

  // Sway only when resting.
  const moving = useRef(false);
  const onVel = () => {
    const m = Math.abs(vx.get()) + Math.abs(vy.get()) > 24;
    if (m === moving.current) return;
    moving.current = m;
    [bodyRef, lightRef].forEach((r) => { if (r.current) r.current.toggleAttribute('data-moving', m); });
  };
  useMotionValueEvent(vx, 'change', onVel);
  useMotionValueEvent(vy, 'change', onVel);

  return (
    <>
      <motion.div ref={lightRef} className="lumen-layer lumen-light" style={{ transform, opacity: lightO }} aria-hidden="true">
        <motion.div className="lumen-rot" style={{ rotate }}>
          <div className="lumen-sway">
            <div className="lumen-glow" />
            <motion.div className="lumen-beam" style={{ scaleX: beam, scaleY: reach, opacity: beamO }}><LumenCone /></motion.div>
          </div>
        </motion.div>
      </motion.div>
      <motion.div ref={bodyRef} className="lumen-layer lumen-body" style={{ transform, opacity: vis }} aria-hidden="true" data-state={state}>
        <motion.div className="lumen-rot" style={{ rotate }}>
          <div className="lumen-sway"><LumenLamp state={state} light={light} /></div>
        </motion.div>
      </motion.div>
    </>
  );
}

/** The travelling lamp. Calm mode / reduced motion: nothing travels — the hero renders <LumenStatic /> instead. */
export default function Lumen({ ready }) {
  const calm = useCalm();
  if (calm || !ready) return null;
  return <Traveller />;
}

/** A still, lit Lumen placed by its parent (reduced-motion hero). */
export function LumenStatic({ scale = 1, className = '' }) {
  return (
    <div className={'lumen-static ' + className} style={{ transform: `scale(${scale})` }} aria-hidden="true">
      <div className="lumen-light"><div className="lumen-glow" /><div className="lumen-beam"><LumenCone /></div></div>
      <LumenLamp state="lit" />
    </div>
  );
}

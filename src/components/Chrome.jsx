import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion';
import { nav, sheets, menu, business } from '../data.js';
import { EASE, Arrow, Logo, scrollToY, smooth } from './ui.jsx';
import Img from './Img.jsx';
import { useCalm, setCalm, getCalm } from '../store/calm.js';
import { LumenLamp } from './Lumen.jsx';

/* ============================================================
   Current sheet — which section is under the middle of the screen
   ============================================================ */
const sheetStore = {
  i: 0, subs: new Set(),
  set(i) { if (i !== this.i) { this.i = i; this.subs.forEach((f) => f()); } },
  subscribe(f) { this.subs.add(f); return () => this.subs.delete(f); },
};
export const useCurrentSheet = () => useSyncExternalStore((f) => sheetStore.subscribe(f), () => sheetStore.i);

function useSheetTracker() {
  useEffect(() => {
    let raf = 0;
    const check = () => {
      raf = 0;
      const mid = window.innerHeight * 0.45;
      let cur = 0;
      sheets.forEach((s, i) => { const el = document.getElementById(s.id); if (el && el.getBoundingClientRect().top <= mid) cur = i; });
      sheetStore.set(cur);
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(check); };
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    check();
    return () => { window.removeEventListener('scroll', on); window.removeEventListener('resize', on); cancelAnimationFrame(raf); };
  }, []);
}

/* Sheet transition: each section starts 40px low and slides up once with its paper shadow as it comes into view.
   (A one-off transition per section — cheaper than a scroll-driven animation running every frame.) */
export function useSheetFallback() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('sheet-io');
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting || e.boundingClientRect.top < 0) { e.target.classList.add('in'); io.unobserve(e.target); }
    }), { rootMargin: '0px 0px -8% 0px' });
    const watch = () => document.querySelectorAll('.sheet-in:not(.in)').forEach((s) => io.observe(s));
    watch();
    const mo = new MutationObserver(watch); // sections that swap layout (pinned ↔ stacked) re-render
    mo.observe(document.querySelector('main') || document.body, { childList: true, subtree: false });
    return () => { io.disconnect(); mo.disconnect(); root.classList.remove('sheet-io'); };
  }, []);
}

/* ============================================================
   PRELOADER — the logo, then the light.
   The window mark fades in → the name is revealed → Lumen descends and stops above the logo (≥ 32px clear) →
   the bulb switches on and warms the logo → the plum curtain lifts. About 2.0–2.4 s, transform and opacity only.
   The curtain lifts once the sequence has played AND the hero image is decoded, or at the 3 s hard cap.
   No 3D work happens underneath: the 3D stage only mounts after the curtain has lifted.
   First visit per session: the full sequence. Reloads: a 0.6 s version. Calm / reduced motion: a simple fade.
   ============================================================ */
const SEEN = 'novara-seen';
const T = { mark: 80, text: 520, lamp: 860, light: 1450, lift: 1900, liftDur: 520, cap: 3000 };
const LEVELS = ['mark', 'text', 'lamp', 'light'];
export function Preloader({ onDone }) {
  const calm = getCalm();
  const repeat = useRef((() => { try { return sessionStorage.getItem(SEEN) === '1'; } catch { return false; } })()).current;
  const quick = repeat || calm;
  const [lvl, setLvl] = useState(0);        // 0 nothing · 1 mark · 2 text · 3 lamp · 4 light
  const [lift, setLift] = useState(false);
  const [show, setShow] = useState(true);
  const root = useRef(null);
  useEffect(() => {
    try { sessionStorage.setItem(SEEN, '1'); } catch { /* private mode */ }
    document.getElementById('pre-static')?.remove();
    let alive = true;
    const timers = [];
    const at = (ms, fn) => timers.push(setTimeout(() => { if (alive) fn(); }, ms));
    const t0 = performance.now();
    const cap = new Promise((res) => setTimeout(res, T.cap));
    // the logo layers are decoded before anything moves, so nothing pops in half-drawn
    const imgs = [...root.current.querySelectorAll('img')];
    const decoded = Promise.race([Promise.all(imgs.map((i) => (i.decode ? i.decode().catch(() => {}) : null))), cap]);
    // the hero image this screen will show (landscape or portrait crop), decoded
    const heroDecoded = new Promise((res) => {
      const look = () => {
        const im = document.querySelector('.story-stage img.story-photo');
        if (im) (im.decode ? im.decode() : Promise.resolve()).then(res, res);
        else if (performance.now() - t0 < T.cap) setTimeout(look, 60); else res();
      };
      look();
    });
    const fonts = document.fonts?.ready ?? Promise.resolve();
    const finish = () => {
      setLift(true);
      at(quick ? 360 : T.liftDur, () => { setShow(false); document.documentElement.classList.remove('pre'); onDone?.(); });
    };
    decoded.then(() => {
      if (!alive) return;
      const s = performance.now();
      if (quick) at(0, () => setLvl(4));
      else LEVELS.forEach((_, i) => at([T.mark, T.text, T.lamp, T.light][i], () => setLvl(i + 1)));
      const played = new Promise((res) => setTimeout(res, quick ? 240 : T.lift - Math.min(300, s - t0)));
      Promise.race([Promise.all([played, heroDecoded, fonts]), cap]).then(() => { if (alive) finish(); });
    });
    return () => { alive = false; timers.forEach(clearTimeout); };
  }, []);
  if (!show) return null;
  const cls = ['preloader', quick && 'quick', calm && 'fade', lift && 'lift', ...LEVELS.filter((_, i) => lvl > i).map((l) => 's-' + l)].filter(Boolean).join(' ');
  return (
    <div ref={root} className={cls} role="status" aria-label="Loading The Samskriti Interiors">
      <div className="pl-stage">
        <div className="pl-lamp" aria-hidden="true">
          <div className="pl-glow" />
          <LumenLamp state={lvl >= 4 ? 'lit' : 'built'} />
        </div>
        <div className="pl-logo">
          <Logo kind="stack-mark" alt="" className="pl-mark" fetchPriority="high" />
          <div className="pl-name">
            <Logo kind="stack-text" alt="The Samskriti Interiors" className="pl-text" fetchPriority="high" />
            <i className="pl-cover" aria-hidden="true" />
          </div>
        </div>
        <div className="pl-progress" aria-hidden="true"><i /></div>
      </div>
    </div>
  );
}

/* ============================================================
   NAV — hides on scroll down; drawing-set index; calm toggle; plotted scroll line
   ============================================================ */
const LampIcon = ({ on }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
    <path d="M12 2v5" /><path d="M5 15a7 7 0 0 1 14 0z" fill={on ? 'currentColor' : 'none'} />
    {on && <><path d="M12 18v3" /><path d="M7 19.5l-1.5 2" /><path d="M17 19.5l1.5 2" /></>}
  </svg>
);

/* ============================================================
   MENU — a plum curtain drops; Lumen follows it down and switches on.
   Six rooms on the left; on the right an arch shows the room you point at, and the lamp swings toward it.
   (Phones: the arch becomes a dimmed full-bleed background.) The nav bar stays on top as the menu's header:
   the logo, and the burger that has become the close button.
   Transform / opacity only. Photos load the first time the menu opens.
   ============================================================ */
function Menu({ open, onClose, calm }) {
  const cur = useCurrentSheet();
  const ref = useRef(null);
  const [live, setLive] = useState(false);   // photos + lamp exist only while the menu is open (and while it lifts)
  const [hot, setHot] = useState(-1);        // the link being pointed at / focused
  useEffect(() => {
    if (open) { setLive(true); return; }
    setHot(-1);
    const t = setTimeout(() => setLive(false), 600); // after the curtain has lifted
    return () => clearTimeout(t);
  }, [open]);
  useEffect(() => {
    if (!open) return;
    const burger = document.querySelector('.burger');
    requestAnimationFrame(() => ref.current?.focus({ preventScroll: true })); // the dialog itself; Tab reaches the first link
    const key = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); onClose(); }
      if (e.key === 'Tab') { // focus stays inside the menu (the burger, now the close button, is part of it)
        const f = [burger, ...ref.current.querySelectorAll('a, button')].filter(Boolean);
        const i = f.indexOf(document.activeElement);
        if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
      }
    };
    window.addEventListener('keydown', key);
    return () => { window.removeEventListener('keydown', key); burger?.focus({ preventScroll: true }); };
  }, [open]);
  const curId = sheets[cur]?.id;
  const go = (e, id) => {
    e.preventDefault();
    onClose();
    const el = document.getElementById(id);
    setTimeout(() => { if (el) scrollToY(el.getBoundingClientRect().top + window.scrollY); }, calm ? 0 : 520); // after the curtain lifts
  };
  const shown = hot >= 0 ? menu.links[hot].img : menu.home;
  const lean = hot < 0 ? 0 : (hot - (menu.links.length - 1) / 2) * -2.4; // the lamp leans toward the room you point at
  return (
    <div ref={ref} id="site-menu" className={'menu' + (open ? ' open' : '') + (calm ? ' fade' : '')} role="dialog" aria-modal="true" aria-label="Menu" tabIndex={-1}
      aria-hidden={!open} inert={!open}>
      <div className="menu-room" aria-hidden="true">
        <div className="menu-arch">
          {live && [menu.home, ...menu.links.map((l) => l.img)].filter((v, i, a) => a.indexOf(v) === i).map((slot) => (
            <Img key={slot} slot={slot} alt="" className={'menu-photo' + (slot === shown ? ' on' : '')} sizes="(max-aspect-ratio: 1/1) 100vw, 40vw" eager fade={false} />
          ))}
        </div>
        {/* two layers: the drop when the menu opens, and the swing toward the room you point at */}
        <div className="menu-lamp">
          <div className="menu-swing" style={{ '--lean': `${lean}deg` }}>
            <div className="menu-glow" />
            {live && <LumenLamp state={open ? 'lit' : 'built'} />}
          </div>
        </div>
      </div>
      <div className="menu-scroll">
        <nav className="menu-links" aria-label="Sections" onPointerLeave={() => setHot(-1)}>
          {menu.links.map((l, i) => (
            <span className="mask" key={l.id} style={{ '--i': i }}>
              <a href={`#${l.id}`} className={l.id === curId ? 'here' : undefined} aria-current={l.id === curId ? 'location' : undefined}
                onPointerEnter={() => setHot(i)} onFocus={() => setHot(i)} onClick={(e) => go(e, l.id)}>{l.label}</a>
            </span>
          ))}
        </nav>
        <div className="menu-foot">
          <a className="btn btn-coral" href="#contact" onClick={(e) => go(e, 'contact')}>{menu.cta} <Arrow /></a>
          <a className="mf-link" href={business.tel}>Call {business.phone}</a>
          <a className="mf-link" href={business.whatsapp} target="_blank" rel="noopener noreferrer">WhatsApp ↗</a>
          <span className="mf-place">{menu.place} · <a href={business.directions} target="_blank" rel="noopener noreferrer">Get directions ↗</a></span>
          {business.instagram && <a className="mf-link" href={business.instagram} target="_blank" rel="noopener noreferrer">Instagram ↗</a>}
          <CalmToggle />
        </div>
      </div>
    </div>
  );
}

function CalmToggle() {
  const calm = useCalm();
  return (
    <button type="button" className={'calm-btn' + (calm ? ' on' : '')} aria-pressed={calm} onClick={() => setCalm(!getCalm())}
      aria-label={calm ? 'Calm mode is on — turn motion back on' : 'Calm mode — turn off non-essential motion'} title="Calm mode">
      <LampIcon on={!calm} /><span className="calm-lbl">Calm · {calm ? 'on' : 'off'}</span>
    </button>
  );
}

/* the plotted progress line under the nav (one of the few lines we keep; no sheet tag riding on it) */
function PlotLine({ hidden }) {
  const { scrollYProgress: p } = useScroll(); // Lenis already smooths the scroll; no second spring on top
  return (
    <motion.div className="plotline" aria-hidden="true" animate={{ y: hidden ? -74 : 0 }} transition={{ duration: 0.5, ease: EASE }}>
      <motion.i className="plotline-ink" style={{ scaleX: p }} />
    </motion.div>
  );
}

export function Nav() {
  useSheetTracker();
  useSheetFallback();
  const calm = useCalm();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const flags = useRef({ solid: false, hidden: false });
  useMotionValueEvent(scrollY, 'change', (v) => {
    const prev = scrollY.getPrevious() ?? 0;
    const solidNow = v > 60, hiddenNow = v > prev && v > 400 && !open;
    if (solidNow !== flags.current.solid) { flags.current.solid = solidNow; setSolid(solidNow); }
    if (hiddenNow !== flags.current.hidden) { flags.current.hidden = hiddenNow; setHidden(hiddenNow); }
  });
  // while the menu is open the page stays put: Lenis pauses (desktop) and the body stops scrolling (touch)
  useEffect(() => {
    if (open) smooth.lenis?.stop(); else smooth.lenis?.start();
    document.body.style.overflow = open ? 'hidden' : '';
    document.documentElement.classList.toggle('menu-on', open);
  }, [open]);
  return (
    <>
      <motion.header className={'nav' + (solid ? ' solid' : '') + (open ? ' menu-open' : '')} animate={{ y: hidden && !open ? -100 : 0 }} transition={{ duration: 0.5, ease: EASE }}>
        <a href="#top" className="brand" aria-label="The Samskriti Interiors — home">
          <Logo kind="lockup" alt="The Samskriti Interiors" />
        </a>
        <nav className="links" aria-label="Main">
          {nav.map((n) => <a key={n.id} href={n.href}>{n.label}</a>)}
        </nav>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button type="button" className={'calm-btn' + (calm ? ' on' : '')} aria-pressed={calm} onClick={() => setCalm(!getCalm())}
            aria-label={calm ? 'Calm mode is on — turn motion back on' : 'Calm mode — turn off non-essential motion'} title="Calm mode">
            <LampIcon on={!calm} /><span className="calm-lbl">Calm · {calm ? 'on' : 'off'}</span>
          </button>
          <a className="btn btn-coral cta" href="#contact">Book a consultation <Arrow /></a>
          <button className={'burger' + (open ? ' open' : '')} aria-label={open ? 'Close the menu' : 'Open the menu'} aria-expanded={open} aria-controls="site-menu" aria-haspopup="dialog" onClick={() => setOpen(!open)}>
            <span /><span />
          </button>
        </div>
      </motion.header>
      <PlotLine hidden={hidden} />
      <Menu open={open} onClose={() => setOpen(false)} calm={calm} />
    </>
  );
}

/* ============================================================
   CURSOR — CAD crosshair; a pool of lamplight over photographs; a coral target over things you can press.
   Also makes every .btn magnetic. Fine pointers only; off in calm mode.
   ============================================================ */
const LINKISH = '[data-cursor], a, button, .btn, input[type="range"], select, label.chk';
const labelFor = (el) => {
  if (el.dataset.cursor) return el.dataset.cursor;
  if (el.closest('.reel-card, .ptab')) return 'VIEW';
  if (el.closest('form, .stamp-btn') && (el.type === 'submit' || el.classList.contains('stamp-btn'))) return 'SEND';
  return 'OPEN';
};

export function Crosshair() {
  const calm = useCalm();
  const h = useRef(null), v = useRef(null), tag = useRef(null), pool = useRef(null), box = useRef(null);
  useEffect(() => {
    if (calm || !window.matchMedia('(pointer: fine)').matches) return;
    let x = -300, y = -300, cx = x, cy = y, raf, mode = '', label = '';
    let mag = null;
    const setMode = (m, l = '') => {
      if (m === mode && l === label) return;
      mode = m; label = l;
      document.documentElement.dataset.cur = m;
      if (box.current) box.current.dataset.label = l;
    };
    const move = (e) => {
      x = e.clientX; y = e.clientY;
      lastMove = performance.now();
      if (!running) { running = true; raf = requestAnimationFrame(loop); }
      const t = e.target instanceof Element ? e.target : null;
      const link = t?.closest(LINKISH);
      if (link) setMode('link', labelFor(link));
      else if (t?.closest('img, picture, .face')) setMode('image');
      else setMode('');
      // magnetic buttons: lean toward the cursor (max 8px)
      const btn = t?.closest('.btn');
      if (mag && mag !== btn) { mag.style.removeProperty('--mx'); mag.style.removeProperty('--my'); }
      mag = btn;
      if (btn) {
        const r = btn.getBoundingClientRect();
        const dx = (x - (r.left + r.width / 2)) / (r.width / 2), dy = (y - (r.top + r.height / 2)) / (r.height / 2);
        btn.style.setProperty('--mx', `${Math.max(-1, Math.min(1, dx)) * 8}px`);
        btn.style.setProperty('--my', `${Math.max(-1, Math.min(1, dy)) * 8}px`);
      }
    };
    const leave = () => setMode('');
    let running = false, lastMove = 0;
    const loop = () => {
      if (performance.now() - lastMove > 450) { running = false; return; }
      cx += (x - cx) * 0.25; cy += (y - cy) * 0.25;
      if (h.current) h.current.style.transform = `translateY(${cy}px)`;
      if (v.current) v.current.style.transform = `translateX(${cx}px)`;
      if (pool.current) pool.current.style.transform = `translate(${x}px, ${y}px)`;
      if (box.current) box.current.style.transform = `translate(${cx}px, ${cy}px)`;
      if (tag.current) {
        tag.current.style.transform = `translate(${cx + 10}px, ${cy + 10}px)`;
        tag.current.textContent = `X ${String(Math.round(cx)).padStart(4, '0')} · Y ${String(Math.round(cy + window.scrollY)).padStart(5, '0')}`;
      }
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerleave', leave);
    return () => {
      window.removeEventListener('pointermove', move); document.removeEventListener('pointerleave', leave);
      cancelAnimationFrame(raf); delete document.documentElement.dataset.cur;
      if (mag) { mag.style.removeProperty('--mx'); mag.style.removeProperty('--my'); }
    };
  }, [calm]);
  if (calm) return null;
  return (
    <div className="xhair" aria-hidden="true">
      <div className="xh-pool" ref={pool} />
      <div className="xh-box" ref={box} />
    </div>
  );
}

/* ---------- Touch: the lamplight pool follows your finger while it rests on a photograph ----------
   touchmove keeps firing while the page scrolls under the finger (pointermove would be cancelled). */
export function TouchPool() {
  const calm = useCalm();
  const ref = useRef(null);
  useEffect(() => {
    if (calm || !window.matchMedia('(hover: none)').matches) return;
    const el = ref.current;
    let on = false;
    const place = (t) => { el.style.transform = `translate(${t.clientX}px, ${t.clientY}px)`; };
    const start = (e) => {
      const t = e.touches[0], tg = e.target instanceof Element ? e.target : null;
      if (e.touches.length !== 1 || !tg?.closest('img, picture, .face') || tg.closest('.story, canvas')) return;
      on = true; place(t); el.classList.add('on');
    };
    const move = (e) => { if (on) place(e.touches[0]); };
    const end = () => { if (on) { on = false; el.classList.remove('on'); } };
    window.addEventListener('touchstart', start, { passive: true });
    window.addEventListener('touchmove', move, { passive: true });
    window.addEventListener('touchend', end, { passive: true });
    window.addEventListener('touchcancel', end, { passive: true });
    return () => { ['touchstart', 'touchmove', 'touchend', 'touchcancel'].forEach((t, i) => window.removeEventListener(t, [start, move, end, end][i])); };
  }, [calm]);
  if (calm) return null;
  return <div className="touch-pool" ref={ref} aria-hidden="true" />;
}


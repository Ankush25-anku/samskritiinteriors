import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useMotionTemplate, useMotionValue, useMotionValueEvent, useScroll, useSpring, useTransform } from 'framer-motion';
import { projects, workIntro as intro } from '../data.js';
import { EASE, MaskLines, SnapPoints, scrollToY } from '../components/ui.jsx';
import { useCalm } from '../store/calm.js';
import Img from '../components/Img.jsx';

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const CARD_SIZES = '(max-width: 900px) 92vw, min(62vw, 880px)';
const TAB_SIZES = '(max-width: 480px) 50vw, (max-width: 960px) 33vw, 16vw';

/* The six project tabs: real photo, blueprint wiping back in on hover/focus (drawn ← built). */
const HOLD = 280; // ms: a touch held this long peeks at the drawing instead of selecting
function Tabs({ active, go }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  // touch: press and hold a tab to see the drawing (the hover reveal); a quick tap still selects it
  const [peek, setPeek] = useState(-1);
  const hold = useRef({ t: 0, held: false });
  const down = (i) => (e) => {
    if (e.pointerType === 'mouse') return;
    hold.current.held = false;
    clearTimeout(hold.current.t);
    hold.current.t = setTimeout(() => { hold.current.held = true; setPeek(i); }, HOLD);
  };
  const up = () => { clearTimeout(hold.current.t); setPeek(-1); };
  // …shown once, the first time the tabs appear on a touch screen
  useEffect(() => {
    if (!inView || !window.matchMedia('(hover: none)').matches) return;
    try { if (sessionStorage.getItem('novara-peek')) return; sessionStorage.setItem('novara-peek', '1'); } catch { /* private mode */ }
    const a = setTimeout(() => setPeek(0), 700), b = setTimeout(() => setPeek(-1), 2300);
    return () => { clearTimeout(a); clearTimeout(b); };
  }, [inView]);
  return (
    <nav className="reel-tabs" ref={ref} aria-label="Projects" style={{ '--n': projects.length }}>
      {projects.map((p, i) => (
        <motion.button key={p.id} type="button" className={'ptab' + (i === active ? ' on' : '') + (i === peek ? ' peek' : '')}
          onClick={() => { if (hold.current.held) { hold.current.held = false; return; } go(i); }}
          onPointerDown={down(i)} onPointerUp={up} onPointerCancel={up} onPointerLeave={up} onContextMenu={(e) => e.preventDefault()}
          aria-label={`Show ${p.name}, ${p.loc}`} aria-current={i === active ? 'true' : undefined}
          initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : undefined} transition={{ duration: 0.6, ease: EASE, delay: i * 0.06 }}>
          <span className="ptab-media">
            <Img slot={p.photo} alt="" className="ptab-photo" sizes={TAB_SIZES} fade={false} />
            <span className="ptab-draw"><Img slot={p.drawing} alt="" sizes={TAB_SIZES} fade={false} /></span>
            <span className="ptab-seam" />
          </span>
          <span className="ptab-code"><i />{p.scope}</span>
          <span className="ptab-name">{p.name}</span>
          <span className="ptab-city">{p.loc.split(',')[0]}</span>
          {i === active && <span className="ptab-flash" aria-hidden="true" />}
        </motion.button>
      ))}
    </nav>
  );
}

/* One project: the drawing underneath, the built photo wiping in over it along a coral light seam. */
function Card({ p, i, wipe, onFocus }) {
  const clip = useMotionTemplate`inset(0 ${useTransform(wipe, (w) => (1 - w) * 100)}% 0 0)`;
  const seamX = useTransform(wipe, (w) => `${w * 100}%`);
  const seamO = useTransform(wipe, [0, 0.03, 0.97, 1], [0, 1, 1, 0]);
  // "View case" badge follows the pointer inside the card (fine pointers only)
  const bx = useMotionValue(0), by = useMotionValue(0);
  const sx = useSpring(bx, { stiffness: 260, damping: 26 }), sy = useSpring(by, { stiffness: 260, damping: 26 });
  const [hover, setHover] = useState(false);
  const move = (e) => {
    if (e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    bx.set(e.clientX - r.left); by.set(e.clientY - r.top); setHover(true);
  };
  return (
    <a className="reel-card" href="#contact" onFocus={onFocus} onPointerMove={move} onPointerLeave={() => setHover(false)}>
      <div className="reel-media">
        <Img slot={p.drawing} alt="" className="reel-img" sizes={CARD_SIZES} fade={false} aria-hidden="true" />
        <motion.div className="reel-photo" style={{ clipPath: clip }}><Img slot={p.photo} alt={p.alt} className="reel-img" sizes={CARD_SIZES} fade={false} /></motion.div>
        <motion.div className="reel-seam" style={{ x: seamX, opacity: seamO }} aria-hidden="true"><i /></motion.div>
      </div>
      <span className="reel-year">{p.year}</span>
      <div className="reel-info">
        <span className="label">{p.scope}</span>
        <h3 className="disp reel-name">{p.name}</h3>
        <span className="reel-spec">{p.loc} · {p.scope} · {p.area} · drawing → keys <b>{p.dur}</b></span>
        <span className="sr-only"> — open case study</span>
      </div>
      <motion.span className={'reel-badge' + (hover ? ' on' : '')} style={{ x: sx, y: sy }} aria-hidden="true">{intro.badge}</motion.span>
    </a>
  );
}

/* ---------- Desktop: a pinned horizontal film reel ---------- */
function Reel() {
  const ref = useRef(null), track = useRef(null);
  const geo = useRef({ W: 1440, cw: 880, offs: [], shift: 1 });
  const [snaps, setSnaps] = useState([]);
  const shift = useMotionValue(0); // track overflow in px
  const [active, setActive] = useState(0);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const x = useTransform([p, shift], ([v, s]) => -v * s);

  useEffect(() => {
    const measure = () => {
      const t = track.current;
      const cards = [...t.querySelectorAll('.reel-card')];
      geo.current = { W: window.innerWidth, cw: cards[0].offsetWidth, offs: cards.map((c) => c.offsetLeft), shift: t.scrollWidth - window.innerWidth };
      shift.set(geo.current.shift);
      const { W, cw, offs, shift: s } = geo.current;
      setSnaps(offs.map((o) => clamp01((o + cw / 2 - W / 2) / s)));
    };
    measure();
    const ro = new ResizeObserver(measure); // orientation changes, URL bar, fonts
    ro.observe(track.current);
    window.addEventListener('resize', measure);
    return () => { ro.disconnect(); window.removeEventListener('resize', measure); };
  }, []);

  // Each card's wipe comes from its own position: drawing at the right edge, built by the time it reaches the centre.
  const wipes = projects.map((_, i) => useTransform([x, shift], ([v]) => {
    const { W, cw, offs } = geo.current;
    const centre = (offs[i] ?? 0) + v + cw / 2;
    return clamp01(1 - (centre - W / 2) / (W * 0.42));
  }));

  useMotionValueEvent(x, 'change', (v) => {
    const { W, cw, offs } = geo.current;
    let best = 0, d = Infinity;
    offs.forEach((o, i) => { const e = Math.abs(o + v + cw / 2 - W / 2); if (e < d) { d = e; best = i; } });
    setActive(best);
  });

  const focusCard = (i) => {
    const el = ref.current, { W, cw, offs, shift: s } = geo.current;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const t = clamp01((offs[i] + cw / 2 - W / 2) / s);
    scrollToY(top + (el.offsetHeight - window.innerHeight) * t);
  };
  const bar = useTransform(p, [0, 1], [0, 1]);

  return (
    <section id="work" ref={ref} className="reel" aria-label="Selected work">
      <span className="story-track" style={{ top: '50svh', height: 'calc(100% - 100svh)' }} aria-hidden="true"
        data-lumen="work" data-lumen-hold="" data-lumen-state="lit" data-lumen-y=".2" data-lumen-scale=".9" data-lumen-beam="1.4"
        data-lumen-mobile-y=".3" data-lumen-mobile-scale=".3" data-lumen-mobile-beam="0" />
      <SnapPoints ts={snaps} />
      <div className="reel-stage">
        <div className="reel-head">
          <div>
            <span className="label">{intro.label}</span>
            <MaskLines lines={intro.lines} className="disp reel-title" />
          </div>
          <span className="note">{intro.note}</span>
        </div>
        <div className="reel-film">
          <motion.div className="reel-track" ref={track} style={{ x }}>
            {projects.map((pr, i) => <Card key={pr.id} p={pr} i={i} wipe={wipes[i]} onFocus={() => focusCard(i)} />)}
          </motion.div>
        </div>
        <div className="reel-progress">
          <div className="reel-bar"><motion.i style={{ scaleX: bar }} /></div>
          <span className="reel-now" aria-live="polite">{projects[active].name} · {projects[active].loc}</span>
        </div>
        <Tabs active={active} go={focusCard} />
      </div>
    </section>
  );
}

/* ---------- Mobile / reduced motion: a vertical stack, each card wiping as it scrolls up the screen ---------- */
function StackCard({ p, i, still, onActive }) {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.6 });
  useEffect(() => { if (inView) onActive(i); }, [inView]);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center 45%'] });
  const wipe = useTransform(scrollYProgress, (v) => (still ? 1 : clamp01(v * 1.15)));
  return <div ref={ref} id={`work-${p.id}`}><Card p={p} i={i} wipe={wipe} /></div>;
}

function Stack({ still }) {
  const [active, setActive] = useState(0);
  const go = (i) => { const el = document.getElementById(`work-${projects[i].id}`); scrollToY(el.getBoundingClientRect().top + window.scrollY - 90); };
  return (
    <section id="work" className="sheet sheet-night reel-stack" aria-label="Selected work">
      <div className="wrap">
        <div className="sec-head">
          <div>
            <span className="label">{intro.label}</span>
            <MaskLines lines={intro.lines} className="disp h2" />
          </div>
          <span className="lumen-pt" style={{ right: 28, bottom: -20 }} data-lumen="work" data-lumen-state="lit" data-lumen-scale=".8" data-lumen-beam="0" />
        </div>
        <Tabs active={active} go={go} />
        <div className="reel-cards">{projects.map((pr, i) => <StackCard key={pr.id} p={pr} i={i} still={still} onActive={setActive} />)}</div>
      </div>
    </section>
  );
}

export default function Projects() {
  return useCalm() ? <Stack still /> : <Reel />;
}

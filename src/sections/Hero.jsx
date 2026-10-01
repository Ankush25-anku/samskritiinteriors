import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionTemplate, useMotionValue, useMotionValueEvent, useScroll, useTransform } from 'framer-motion';
import { story, heroCopy, specChips } from '../data.js';
import { EASE, CURTAIN, Arrow, accent, scrollToY, useMedia } from '../components/ui.jsx';
import { useCalm } from '../store/calm.js';
import { initialHeroMode, storeHeroMode } from '../three/support.js';
import { heroGate, lumen3d, lumenPos } from '../three/store.js';
import { LumenStatic } from '../components/Lumen.jsx';
import Img, { imgUrl } from '../components/Img.jsx';
import RoomDrawing from '../components/RoomDrawing.jsx';

// The real-time 3D stage lives in its own chunk and only loads after first paint.
const Stage3D = lazy(() => import('../three/Stage3D.jsx'));

/* ------------------------------------------------------------
   Composition: every scene has a TEXT ZONE (left 40% on landscape, bottom 38% on portrait) and a VISUAL ZONE.
   The lamp — Lumen, the scene's focal point — lives in the visual zone. One headline, one visual, at most one callout.
   ------------------------------------------------------------ */
const N = story.length;
const LAMP_Y = 0.38;   // where Lumen hangs, as a fraction of the stage height
const HERO_SIZES = '(max-aspect-ratio: 19/20) 100vw, (max-aspect-ratio: 16/10) 95vh, 100vw';
const PORTRAIT = '(max-aspect-ratio: 19/20)';

// Lumen's part in the hero, in scene units (0–5). Each entry becomes a hold anchor on the scroll track.
const holds = [
  { state: 'line', from: 0, to: 1 },
  { state: 'sketch', from: 1, to: 2 },
  { state: 'spec', from: 2, to: 3 },
  { state: 'built', from: 3, to: 3.15 },
  { state: 'lit', from: 3.15, to: 4 },
  { state: 'lit', from: 4, to: 5, lift: 0.14, mobileLift: 0.22, centre: true, beam: 0.45 }, // scene 05: centred, high above the poster, a softer beam
];



/* One headline at a time: lines rise out of their masks, the previous headline drifts up and fades. */
function SceneHead({ s, className }) {
  const line = (i) => ({
    hidden: { y: '105%' },
    show: { y: '0%', transition: { duration: 1.15, ease: EASE, delay: 0.35 + i * 0.12 } },
    exit: { y: '-40%', opacity: 0, transition: { duration: 0.8, ease: EASE, delay: i * 0.05 } },
  });
  return (
    <motion.h2 className={'disp ' + className} initial="hidden" animate="show" exit="exit">
      {s.headline.map((l, i) => (
        <span className="mask" key={i}><motion.span style={{ display: 'inline-block' }} variants={line(i)}>{accent(l)}</motion.span></span>
      ))}
    </motion.h2>
  );
}

/* piecewise-linear map as a plain function: framer would otherwise hand array-form scroll transforms to the
   browser's ScrollTimeline, which measures the whole page instead of this section (the room vanished in SC05) */
const ramp = (xs, ys) => (v) => { if (v <= xs[0]) return ys[0]; for (let i = 1; i < xs.length; i++) if (v <= xs[i]) return ys[i - 1] + ((v - xs[i - 1]) / (xs[i] - xs[i - 1])) * (ys[i] - ys[i - 1]); return ys[ys.length - 1]; };

/* Where the lamp is on screen right now — from the 3D room, or from the travelling SVG Lumen in the photo path. */
function lampOnScreen() {
  if (lumen3d.active) return { x: lumen3d.x, y: lumen3d.y, r: lumen3d.r };
  return { x: lumenPos.x, y: lumenPos.y, r: 64 * lumenPos.s };
}

/* Places an element next to the lamp, inside the visual zone, never over the headline. mode: 'side' | 'below' */
function useFollowLamp(ref, active, mode) {
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    const place = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const W = window.innerWidth, H = window.innerHeight, portrait = W < H * 0.95;
      const m = Math.max(24, W * 0.06);
      const zoneRight = portrait ? m : W * 0.42;        // left edge of the visual zone
      const zoneBottom = portrait ? H * 0.6 : H - 120;   // above the headline (portrait) / film strip
      const L = lampOnScreen();
      const w = el.offsetWidth, h = el.offsetHeight;
      let x, y, flip = false;
      if (mode === 'below') { x = L.x - w / 2; y = L.y + L.r * 0.6 + 64; }
      else {
        x = L.x + L.r + 34; y = L.y - h / 2;
        if (x + w > W - m) { x = L.x - L.r - 34 - w; flip = true; }
      }
      x = Math.min(Math.max(x, zoneRight), W - m - w);
      y = Math.min(Math.max(y, 110), zoneBottom - h);
      el.style.transform = `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0)`;
      el.classList.toggle('flip', flip);
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(place); };
    place();
    const u1 = lumen3d.subscribe(kick), u2 = lumenPos.subscribe(kick);
    window.addEventListener('resize', kick);
    return () => { u1(); u2(); window.removeEventListener('resize', kick); cancelAnimationFrame(raf); };
  }, [active, mode]);
}

/* Reduced motion / calm: no pinning, no scenes — just the poster frame, lamp lit. */
function StaticHero() {
  const portrait = useMedia(PORTRAIT);
  return (
    <section id="top" className="story is-static" aria-label="Introduction">
      <div className="story-stage">
        <Img slot={portrait ? 'hero-portrait' : 'hero'} className="story-photo" alt={heroCopy.photoAlt} sizes={HERO_SIZES} eager />
        <div className="story-vignette" />
        <LumenStatic className="story-static-lamp" />
        <div className="story-final">
          <span className="label">{heroCopy.eyebrow}</span>
          <h1 className="disp story-final-h">{story[N - 1].headline.map((l, i) => <span className="mask" key={i}>{accent(l)}</span>)}</h1>
          <div className="btns">{heroCopy.cta.map((c, i) => <a key={c.href} className={'btn ' + (i ? 'btn-link' : 'btn-light')} href={c.href}>{c.label} <Arrow /></a>)}</div>
        </div>
      </div>
    </section>
  );
}

function Storyboard({ ready }) {
  const ref = useRef(null);
  const stageEl = useRef(null);
  const calloutRef = useRef(null), chipsRef = useRef(null);
  const [sc, setSc] = useState(0);
  const sceneRef = useRef(0); // hysteretic scene index, shared with the 3D room without re-rendering it
  const portrait = useMedia(PORTRAIT);
  // Hero mode is decided ONCE (see three/support.js) and settled before the preloader lifts; it never swaps mid-session.
  const init = useRef(initialHeroMode()).current;
  const [mode, setMode] = useState(() => heroGate.state?.mode ?? (init.mode === 'photo' ? 'photo' : 'pending'));
  const [stage, setStageMounted] = useState(false); // the 3D chunk loads only after the first frame has painted
  const [lost, setLost] = useState(false);         // WebGL context lost → photo, until it is restored
  const small = useMedia('(max-width: 767px)');
  const touch = useMedia('(hover: none)');
  useEffect(() => {
    if (init.mode === 'photo') heroGate.settle('photo', init.reason);
    const un = heroGate.subscribe((st) => setMode(st.mode));
    return un;
  }, []);
  // the 3D chunk (and its shader compile) only starts once the preloader has lifted, so the intro never stutters;
  // until then — and if the 3D decision never comes — the photo storyboard is what you see
  useEffect(() => {
    if (!ready || init.mode === 'photo') return;
    setStageMounted(true);
    const t = setTimeout(() => { if (!heroGate.state) heroGate.settle('photo', '3D decision timeout'); }, 8000);
    return () => clearTimeout(t);
  }, [ready]);
  const decided = (m, fps) => {
    if (fps != null) storeHeroMode(m, m === '3d' ? 'probe ok' : `probe below ${small ? 45 : 30} fps`, fps);
    heroGate.settle(m, fps != null ? `probe ${Math.round(fps)} fps` : init.reason);
  };
  const is3d = mode === '3d' && !lost;
  const keepStage = stage && mode !== 'photo';

  // the fixed site chrome that doesn't belong in a film (crosshair readout, ruler, sheet tag) steps aside in the hero
  useEffect(() => {
    // 'in the hero' = the hero still covers the middle of the screen
    const io = new IntersectionObserver(([e]) => document.documentElement.classList.toggle('in-hero', e.isIntersecting), { rootMargin: '0px 0px -50% 0px' });
    io.observe(ref.current);
    return () => { io.disconnect(); document.documentElement.classList.remove('in-hero'); };
  }, []);

  const bw = useMotionValue(1440), bh = useMotionValue(900), lx = useMotionValue(0.68);
  useEffect(() => {
    const measure = () => {
      const r = stageEl.current.getBoundingClientRect();
      bw.set(r.width); bh.set(r.height); lx.set(r.width > r.height * 0.95 ? 0.68 : 0.5);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  useMotionValueEvent(p, 'change', (v) => {
    // hysteresis: the scene only changes once scroll is 3% of the hero track past a boundary
    const raw = v * N, cur = sceneRef.current, band = 0.15;
    let i = cur;
    if (raw >= cur + 1 + band || raw < cur - band) i = Math.min(N - 1, Math.max(0, Math.floor(raw)));
    if (i !== cur) { sceneRef.current = i; setSc(i); }
  });

  // photo path. Scene 02–03: the clean sketch; 04: the lamp's light pool reveals the photograph; 05: the poster.
  const drawO = useTransform(p, ramp([0.1, 0.16, 0.6, 0.68, 0.8, 0.86], [0, 1, 1, 0.25, 0.25, 0]));
  const drawP = useTransform(p, [0.12, 0.34], [0, 1]); // the room plots itself on, SC01 → SC02
  const k = useTransform(p, [0.63, 0.8], [0, 1]);
  const rx = useTransform([k, bw, bh, lx], ([v, w, h, x]) => Math.max(1, (Math.hypot(Math.max(x, 1 - x) * w, ((LAMP_Y + 0.4) * h) / 0.8) / 0.7) * 1.04 * Math.pow(v, 1.3)));
  const mw = useTransform(rx, (r) => r * 2), mh = useTransform(rx, (r) => r * 1.6);
  // the pool is centred under the lamp on SCREEN: undo the landscape frame offset (translateX 11.5%, scale 1.14 about 60% 50%)
  const toLocalX = (x, land) => (land ? (x - 0.715) / 1.14 + 0.6 : x), toLocalY = (y, land) => (land ? (y - 0.5) / 1.14 + 0.5 : y);
  const mx = useTransform([rx, bw, bh, lx], ([r, w, h, x]) => w * toLocalX(x, w > h * 0.95) - r);
  const my = useTransform([rx, bw, bh], ([r, w, h]) => toLocalY(LAMP_Y + 0.4, w > h * 0.95) * h - r * 0.8);
  const maskSize = useMotionTemplate`${mw}px ${mh}px`;
  const maskPos = useMotionTemplate`${mx}px ${my}px`;
  const photoO = useTransform(p, ramp([0.625, 0.64], [0, 1]));
  const photoS = useTransform(p, ramp([0.8, 1], [1.08, 1.02])); // scene 05: slow settle
  const photoX = useTransform([p, bw, lx], ([v, w, x]) => -Math.min(1, Math.max(0, (v - 0.8) / 0.08)) * (x - 0.5) * w * 0.85);
  const posterO = useTransform(p, ramp([0.8, 0.87], [0, 1]));
  const zoneO = useTransform(p, ramp([0.78, 0.86], [1, 0]));  // the text-zone scrim gives way to the poster's vignette
  const playX = useTransform(p, (v) => `${v * 100}%`);

  useFollowLamp(calloutRef, sc === 1, 'side');
  useFollowLamp(chipsRef, sc === 2, 'below');

  const go = (i) => {
    const el = ref.current;
    const top = el.getBoundingClientRect().top + window.scrollY;
    scrollToY(top + (el.offsetHeight - window.innerHeight) * ((i + 0.45) / N));
  };

  const s = story[sc];

  return (
    <section id="top" ref={ref} className="story" aria-label="Introduction">
      <h1 className="sr-only">The Samskriti Interiors — interior designers in Whitefield, Bengaluru. From line to light.</h1>
      {holds.map((h, i) => (
        <span key={i} className="story-track" aria-hidden="true"
          style={{ top: `calc(50svh + (100% - 100svh) * ${h.from / N})`, height: `calc((100% - 100svh) * ${(h.to - h.from) / N})`, ...(h.centre ? { left: '50%' } : null) }}
          data-lumen={`hero-${i}`} data-lumen-hold="" data-lumen-state={h.state} data-lumen-y={LAMP_Y} data-lumen-y2={h.lift ?? LAMP_Y} data-lumen-mobile-y2={h.mobileLift ?? h.lift ?? LAMP_Y}
          data-lumen-scale="1.3" data-lumen-mobile-scale=".7" data-lumen-beam={h.beam ?? 1} data-lumen-mobile-beam={h.beam ?? 0.85} />
      ))}

      <div className={'story-stage' + (is3d ? ' is-3d' : '') + ' sc-' + sc} ref={stageEl}>
        <div className="story-grid" aria-hidden="true" />
        {is3d ? (
          <Img slot={portrait ? 'hero-portrait' : 'hero'} className="story-photo" alt={heroCopy.photoAlt} sizes={HERO_SIZES} eager fade={false} />
        ) : (
          <div className="story-frame">
            <Img as={motion.img} slot={portrait ? 'hero-portrait' : 'hero'} className="story-photo" alt={heroCopy.photoAlt} sizes={HERO_SIZES} eager fade={false}
              fetchPriority="high"
              style={touch
                ? { opacity: photoO, scale: photoS } /* touch: a plain fade — animating a mask over a big photo repaints every frame */
                : { opacity: photoO, scale: photoS, x: portrait ? 0 : photoX, maskSize, WebkitMaskSize: maskSize, maskPosition: maskPos, WebkitMaskPosition: maskPos }} />
            <motion.div className="story-draw" style={{ opacity: drawO }} aria-hidden="true"><RoomDrawing progress={drawP} portrait={portrait} /></motion.div>
          </div>
        )}
        {keepStage && (
          <Suspense fallback={null}>
            <Stage3D p={p} sceneRef={sceneRef} sc={sc} small={small} touch={touch} ready={ready} needProbe={init.mode === 'probe'}
              live={is3d} onDecided={decided} onContextLost={() => setLost(true)} onContextRestored={() => setLost(false)} />
          </Suspense>
        )}
        {/* the text zone: plum fading out across the stage, so no line ever runs behind a headline */}
        <motion.div className="story-zone" style={{ opacity: zoneO }} aria-hidden="true" />
        <motion.div className="story-vignette" style={{ opacity: posterO }} aria-hidden="true" />

        {/* at most ONE callout per scene, in the visual zone, following the lamp */}
        <AnimatePresence>
          {sc === 1 && s.callout && (
            <motion.div key="c1" ref={calloutRef} className="callout" aria-hidden="true"
              initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 0.9, delay: 0.9 } }} exit={{ opacity: 0, transition: { duration: 0.4 } }}>
              <i /><span className="hand">{s.callout}</span>
            </motion.div>
          )}
        </AnimatePresence>
        {/* scene 03's one callout: the three specified materials, settling under the lamp */}
        <div ref={chipsRef} className={'spec-chips' + (sc === 2 ? ' on' : '')} aria-hidden={sc !== 2}>
          {specChips.map((c, i) => (
            <motion.div key={c.id} className="mchip" initial={{ y: 16, opacity: 0 }}
              animate={sc === 2 ? { y: 0, opacity: 1 } : { y: 16, opacity: 0 }}
              transition={sc === 2 ? { duration: 0.9, ease: EASE, delay: 0.6 + i * 0.12 } : { duration: 0.35 }}>
              <i className={'sw ' + (c.cls || '')} style={c.img ? { backgroundImage: `url(${imgUrl(c.img, 160)})` } : undefined} />
              <span><b>{c.name}</b><small>{c.role}</small></span>
            </motion.div>
          ))}
        </div>

        {/* one headline at a time, in the text zone */}
        <div className="story-heads" aria-live="polite">
          <AnimatePresence>
            {ready && sc < N - 1 && <SceneHead key={s.id} s={s} className="story-head" />}
          </AnimatePresence>
        </div>
        {/* the finale: a poster */}
        <AnimatePresence>
          {sc === N - 1 && (
            <motion.div key="final" className="story-final" exit={{ opacity: 0, transition: { duration: 0.5 } }}>
              <SceneHead s={s} className="story-final-h" />
              <motion.div className="btns" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: EASE, delay: 0.9 }}>
                {heroCopy.cta.map((c, i) => <a key={c.href} className={'btn ' + (i ? 'btn-link' : 'btn-light')} href={c.href}>{c.label} <Arrow /></a>)}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* minimal film chrome: one slate line, and the film strip */}
        <div className="story-top">
          <span className="label slate">{heroCopy.eyebrow}</span>
        </div>
        <nav className="strip" aria-label="Storyboard scenes">
          <span className="label strip-now">{s.title}</span>
          <div className="strip-frames">
            {story.map((x, i) => (
              <button key={x.id} type="button" className={'scene-fr' + (i === sc ? ' on' : '')} aria-label={`Go to the ${x.title.toLowerCase()} scene`} aria-current={i === sc ? 'step' : undefined} onClick={() => go(i)}>
                <span className={'th th-' + i} aria-hidden="true" />
                <span className="cap">{x.title}</span>
              </button>
            ))}
            <div className="strip-ph" aria-hidden="true"><motion.i style={{ x: playX }} /></div>
          </div>
        </nav>
      </div>
    </section>
  );
}

export default function Hero({ ready }) {
  const reduced = useCalm();
  return reduced ? <StaticHero /> : <Storyboard ready={ready} />;
}

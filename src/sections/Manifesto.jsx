import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { manifesto as copy, stamps, tape, lightStudies } from '../data.js';
import { CURTAIN } from '../components/ui.jsx';
import Img from '../components/Img.jsx';
import { lumenPos } from '../three/store.js';
import { useCalm } from '../store/calm.js';

/* The manifesto (src/data.js): plain words, and three phrases that carry a red-pen mark. */
const TEXT = copy.text;
const WORDS = TEXT.flatMap((t) => (typeof t === 'string' ? [t] : t.words));
const MARKS = [
  { box: '0 0 100 40', d: 'M52 3 C 20 2, 2 12, 4 22 C 7 36, 60 40, 92 30 C 104 24, 96 6, 60 4 C 50 4, 40 6, 34 9', style: { left: -14, top: -6, width: 'calc(100% + 26px)', height: 'calc(100% + 12px)' } },
  { box: '0 0 100 10', d: 'M2 6 C 30 2, 60 9, 98 3', style: { left: 0, bottom: -4, width: '100%', height: 14 } },
  { box: '0 0 100 10', d: 'M2 5 C 20 9, 40 1, 60 6 S 90 2, 98 5', style: { left: 0, bottom: -6, width: '100%', height: 16 } },
];

const Mark = ({ m, on }) => (
  <svg viewBox={m.box} preserveAspectRatio="none" style={m.style} aria-hidden="true">
    <motion.path d={m.d} fill="none" stroke="var(--coral-deep)" strokeWidth="3" strokeLinecap="round" vectorEffect="non-scaling-stroke"
      initial={{ pathLength: 0 }} animate={{ pathLength: on ? 1 : 0 }} transition={{ duration: 1, ease: CURTAIN }} />
  </svg>
);

/* The paragraph as word spans. `overlay` = the lit copy that the light pool reveals (no marks). */
function Words({ lit, overlay }) {
  let k = 0;
  const word = (w) => { const i = k++; return <span key={i} className={'w' + (lit?.[i] ? ' lit' : '')} data-i={i}>{w}</span>; };
  return TEXT.map((t, n) => {
    if (typeof t === 'string') return <span key={n}>{word(t)} </span>;
    const first = k;
    const inner = t.words.map((w, j) => <span key={j}>{j ? ' ' : ''}{word(w)}</span>);
    const on = !overlay && lit && t.words.every((_, j) => lit[first + j]);
    return <span key={n}><span className="hl">{inner}{!overlay && <Mark m={MARKS[t.mark]} on={on} />}</span> </span>;
  });
}

/* ---------- "Read by lamplight": words stay dim until Lumen's pool of light (or your reading line) reaches them ---------- */
function Lamplit() {
  const calm = useCalm();
  const ref = useRef(null), over = useRef(null);
  const [lit, setLit] = useState(() => WORDS.map(() => false));
  const litRef = useRef(lit);
  useEffect(() => {
    if (calm) { litRef.current = WORDS.map(() => true); setLit(litRef.current); return; }
    const el = ref.current;
    let words = [], raf = 0;
    const measure = () => {
      const sy = window.scrollY;
      words = [...el.querySelectorAll('.w')].map((w) => { const r = w.getBoundingClientRect(); return { i: +w.dataset.i, x: r.left + r.width / 2, y: r.top + sy + r.height / 2 }; });
    };
    const check = () => {
      raf = 0;
      const sy = window.scrollY, H = window.innerHeight, pr = el.getBoundingClientRect();
      if (pr.bottom < -200 || pr.top > H + 200) return;
      const on = lumenPos.on, s = lumenPos.s;
      const px = lumenPos.x, py = lumenPos.y + 90 + 120 * s, R = 150 + 220 * s; // where the beam lands
      if (over.current) { // the soft pool on the lit copy, positioned from Lumen's screen position
        over.current.style.setProperty('--px', `${px - pr.left}px`);
        over.current.style.setProperty('--py', `${py - pr.top}px`);
        over.current.style.setProperty('--pr', `${on ? R : 0}px`);
      }
      let changed = false;
      const next = litRef.current.slice();
      words.forEach((w) => {
        if (next[w.i]) return;
        const vy = w.y - sy;
        // once lit, a word stays lit; the reading line makes sure nothing stays dark once you've read past it
        if ((on && Math.hypot(w.x - px, vy - py) < R) || vy < H * 0.36) { next[w.i] = true; changed = true; }
      });
      if (changed) { litRef.current = next; setLit(next); }
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(check); };
    measure(); kick();
    const ro = new ResizeObserver(() => { measure(); kick(); });
    ro.observe(el);
    window.addEventListener('scroll', kick, { passive: true });
    const unsub = lumenPos.subscribe(kick);
    return () => { ro.disconnect(); window.removeEventListener('scroll', kick); unsub(); cancelAnimationFrame(raf); };
  }, [calm]);
  return (
    <div className="lamplit">
      {/* phones: while the paragraph passes the middle of the screen, Lumen swings in to the centre and holds there */}
      <span className="lumen-hold-m" aria-hidden="true" data-lumen="manifesto-read-m" data-lumen-hold="" data-lumen-state="lit" data-lumen-y=".26"
        data-lumen-mobile-scale=".62" data-lumen-mobile-beam=".9" data-lumen-bg="light" />
      <p className="big" ref={ref}><Words lit={lit} /></p>
      <p className="big lamplit-over" ref={over} aria-hidden="true"><Words overlay /></p>
    </div>
  );
}

/* ---------- Three light studies of the same still life: fan out on hover / tap / keyboard ---------- */
function LightStudies() {
  const [fan, setFan] = useState(false);
  return (
    <button type="button" className={'studies' + (fan ? ' fan' : '')} aria-expanded={fan} data-cursor={fan ? 'STACK' : 'FAN'}
      onClick={() => setFan(!fan)} onPointerEnter={(e) => e.pointerType === 'mouse' && setFan(true)} onPointerLeave={(e) => e.pointerType === 'mouse' && setFan(false)}>
      {lightStudies.map((l, i) => (
        <span key={l.time} className={`polaroid study study-${i} g-${l.grade}`}>
          <Img slot="detail" alt="" sizes="300px" />
          <span className="hand">{l.caption}</span>
        </span>
      ))}
      <span className="sr-only"> — {fan ? 'stack the prints' : 'fan out the three prints'}</span>
    </button>
  );
}

/* ---------- What we design: ONE pure-CSS loop on the track; the stamps themselves never animate ----------
   The list is rendered twice (second copy hidden from screen readers) so translate3d(-50%) loops seamlessly.
   The row settles in once, the first time the section is seen — never per stamp. */
const TILT = [-3, 2, -1.5, 3, -2.5, 1.5]; // fixed, not random
function StampList({ hidden }) {
  return (
    <ul className="stamp-copy" aria-hidden={hidden || undefined}>
      {stamps.map((c, i) => <li key={c} className="stamp" style={{ '--r': `${TILT[i % TILT.length]}deg` }}>{c}</li>)}
    </ul>
  );
}
function Stamps() {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { threshold: 0.4 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return (
    <div className={'stamps' + (seen ? ' seen' : '')} ref={ref}>
      <span className="label" style={{ lineHeight: 1.6 }}>{copy.stampsLabel}</span>
      <div className="stamp-run">
        <div className="stamp-track">
          <StampList />
          <StampList hidden />
        </div>
      </div>
    </div>
  );
}

export default function Manifesto() {
  const cells = [...tape, ...tape];
  return (
    <section id="studio" className="sheet-in" aria-label="Studio">
      <div className="tape" aria-hidden="true">
        <div className="tape-track">
          {cells.map((w, i) => (
            <div className="tape-cell" key={i}><span className="mono">{w}</span></div>
          ))}
        </div>
      </div>
      <div className="sheet sheet-lav">
        <div className="wrap">
          <div className="manifesto">
            <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 30 }}>
              {/* Lumen crosses over the text and reads it by lamplight — on phones it swings in to the centre for this (mobile-free) */}
              <span style={{ left: '52%', top: -58 }} data-lumen="manifesto-read" data-lumen-state="lit" data-lumen-scale=".85" data-lumen-beam=".9" data-lumen-reach=".55" data-lumen-bg="light"
                className="lumen-pt lumen-desk" />
              <span className="label">{copy.eyebrow}</span>
              <Lamplit />
              <p className="lead" style={{ margin: 0, maxWidth: '52ch', color: 'var(--muted-l)' }}>{copy.lead}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px 24px', flexWrap: 'wrap' }}>
                <span className="note">{copy.note}</span>
                <a className="label" href="#process" style={{ color: 'var(--plum)', borderBottom: '1px solid var(--plum)', display: 'inline-flex', alignItems: 'center', minHeight: 44 }}>{copy.link}</a>
              </div>
            </div>
            <div className="pol-wrap" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 26 }}>
              <span className="lumen-pt" style={{ left: '50%', top: -120 }} data-lumen="manifesto" data-lumen-state="lit" data-lumen-scale=".8" data-lumen-beam=".5" data-lumen-bg="light" />
              <LightStudies />
              <span className="label" style={{ color: 'var(--muted-l)' }}>{copy.studiesLabel}</span>
            </div>
          </div>
          <Stamps />
        </div>
      </div>
    </section>
  );
}

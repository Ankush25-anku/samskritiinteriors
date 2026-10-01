import { useEffect, useRef, useState } from 'react';
import { animate, motion, useInView, useMotionValue, useMotionValueEvent, useTransform } from 'framer-motion';
import { stats, statsCopy as copy } from '../data.js';
import { SecHead } from '../components/ui.jsx';
import { useCalm } from '../store/calm.js';

const DUR = 2.4;
const EASE = [0.16, 1, 0.3, 1];

/* One true number, measured on site: a laser runs the dimension line and the figure counts up with it. */
function Row({ s, i }) {
  const calm = useCalm();
  const ref = useRef(null), num = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [done, setDone] = useState(false);
  const p = useMotionValue(0);
  const tip = useTransform(p, (v) => `${v * 100}%`);
  // years count up from a few years earlier, not from zero; everything else from zero
  const from = s.n > 1900 ? s.n - 8 : 0;
  const out = (v) => { if (num.current) num.current.textContent = (from + (s.n - from) * v).toFixed(s.dec || 0); };
  useMotionValueEvent(p, 'change', out);
  useEffect(() => {
    if (!inView) return;
    if (calm) { p.set(1); out(1); setDone(true); return; }
    const c = animate(p, 1, { duration: DUR, ease: EASE, delay: i * 0.12, onComplete: () => setDone(true) });
    return () => c.stop();
  }, [inView, calm]);
  return (
    <div className={'stat-row' + (done ? ' done' : '')} ref={ref}>
      <span className="k">{s.k}</span>
      <div className="dim-area">
        <div className="dim disp" style={{ width: `${s.w * 100}%` }}>
          <i className="tick t0" />
          <motion.i className="dline" style={{ scaleX: p }} />
          <motion.span className="laser" style={{ x: tip }} aria-hidden="true"><b /></motion.span>
          <i className="tick t1" />
          <span className="val">{s.pre && <em>{s.pre}</em>}<span ref={num}>{from.toFixed(s.dec || 0)}</span>{s.s && <em>{s.s}</em>}</span>
        </div>
      </div>
      <div className="d"><span>{s.d}</span></div>
    </div>
  );
}

export default function Stats() {
  const rows = stats.filter((s) => s.n != null); // a stat without a real number stays hidden
  return (
    <section id="stats" className="sheet sheet-lav sheet-in" aria-label="In numbers">
      <span className="lumen-pt" style={{ right: '36%', top: 'calc(var(--sec) * .55)' }} data-lumen="stats" data-lumen-state="lit" data-lumen-scale=".5" data-lumen-beam="0" data-lumen-bg="light" />
      <div className="wrap">
        <SecHead label={copy.eyebrow} lines={copy.lines} right={<span className="note">{copy.note}</span>} />
        <div>{rows.map((s, i) => <Row key={s.k} s={s} i={i} />)}</div>
      </div>
    </section>
  );
}

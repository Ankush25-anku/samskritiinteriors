import { useEffect, useRef, useState } from 'react';
import { animate, motion, useInView, useMotionValue } from 'framer-motion';
import { materials, materialsCopy as copy } from '../data.js';
import { MaskLines, Rise, Arrow, scrollToY } from '../components/ui.jsx';
import Img from '../components/Img.jsx';
import { useCalm } from '../store/calm.js';
import { setBrief } from '../store/brief.js';

const MAX = 3;
const JITTER = [-4, 3, -2, 4, -3, 2]; // how each sample lies on the table
let topZ = 10;                         // the last sample you touched lies on top

/* a small square of the material (tray slots) */
const Chip = ({ m }) => (
  <span className={'chip-sw ' + (m.cls || '')}>{m.img && <Img slot={m.img} alt="" sizes="48px" />}</span>
);

/* ---------- One sample: fans out, lies on the table, drags, flips; the cursor rakes light across it ---------- */
function Swatch({ m, i, phase, calm, inBox, onAdd, trayRef, bounds }) {
  const [flip, setFlip] = useState(false);
  const boxed = useRef(false); // dropped on the tray: glide back to its place once the throw has settled
  const ref = useRef(null);
  const x = useMotionValue(0), y = useMotionValue(0), z = useMotionValue(i + 1);
  const table = phase === 'table';

  const rake = (e) => { // a low raking light: highlight at the cursor, shadow thrown the other way
    const r = ref.current.getBoundingClientRect();
    const lx = (e.clientX - r.left) / r.width, ly = (e.clientY - r.top) / r.height;
    const s = ref.current.style;
    s.setProperty('--lx', `${lx * 100}%`); s.setProperty('--ly', `${ly * 100}%`);
    s.setProperty('--sx', `${(0.5 - lx) * 22}px`); s.setProperty('--sy', `${(0.5 - ly) * 16 + 14}px`);
    s.setProperty('--rk', '1');
  };
  const unrake = () => ref.current?.style.setProperty('--rk', '0');
  const overTray = (pt) => {
    const r = trayRef.current?.getBoundingClientRect();
    const px = pt.x - window.scrollX, py = pt.y - window.scrollY;
    return r && px > r.left && px < r.right && py > r.top && py < r.bottom;
  };

  return (
    <motion.div ref={ref} layout className={'swatch' + (flip ? ' flipped' : '') + (inBox ? ' boxed' : '')} data-cursor={table && !calm ? 'DRAG' : 'SPEC'}
      style={{ x, y, zIndex: z }}
      initial={false}
      animate={{ rotate: phase === 'closed' ? 0 : phase === 'fan' ? m.rot : JITTER[i] }}
      transition={{ type: 'spring', stiffness: 70, damping: 14, delay: phase === 'fan' ? 0.2 + i * 0.06 : 0, layout: { type: 'spring', stiffness: 190, damping: 26, delay: i * 0.04 } }}
      drag={table && !calm} dragElastic={0.18} dragTransition={{ power: 0.22, timeConstant: 240 }}
      whileDrag={{ scale: 1.07, rotate: JITTER[i] + 7 }}
      onDragStart={() => z.set(++topZ)}
      whileHover={table ? { scale: 1.03 } : undefined}
      onDrag={(e, info) => trayRef.current?.classList.toggle('hot', !!overTray(info.point))}
      onDragEnd={(e, info) => {
        trayRef.current?.classList.remove('hot');
        boxed.current = !!overTray(info.point);
        if (boxed.current) onAdd(m.code);
      }}
      onDragTransitionEnd={() => {
        // back to its place if it went into the box, or if it was thrown off the table
        const r = ref.current.getBoundingClientRect(), t = bounds.current.getBoundingClientRect();
        const off = r.right < t.left + 40 || r.left > t.right - 40 || r.bottom < t.top + 40 || r.top > t.bottom - 40;
        if (boxed.current || off) {
          boxed.current = false;
          animate(x, 0, { type: 'spring', stiffness: 200, damping: 24 });
          animate(y, 0, { type: 'spring', stiffness: 200, damping: 24 });
        }
      }}
      onTap={(e) => { if (!e.target.closest('button')) setFlip((f) => !f); }}
      onPointerDown={rake} onPointerMove={rake} onPointerLeave={unrake} onPointerUp={(e) => e.pointerType !== 'mouse' && unrake()}>
      <div className="swatch-in">
        <div className="side front">
          <div className={'face ' + (m.cls || '')}>
            {m.img && <Img slot={m.img} alt={`${m.name} sample`} sizes="(max-width: 960px) 30vw, 200px" />}
            <span className="rake" aria-hidden="true" />
          </div>
          <div className="cap"><b>{m.name}</b><small>{m.meta}</small></div>
        </div>
        <div className="side back" aria-hidden={!flip}>
          <span className="mono">{m.short} · details</span>
          <b>{m.name}</b>
          <dl>
            <dt>{copy.back.best}</dt><dd>{m.best}</dd>
            <dt>{copy.back.finish}</dt><dd>{m.finish}</dd>
            <dt>{copy.back.lead}</dt><dd>{m.lead}</dd>
            <dt>{copy.back.pairs}</dt><dd>{m.pairs}</dd>
          </dl>
        </div>
      </div>
      {table && (
        <div className="sw-acts">
          <button type="button" className="sw-btn" onClick={() => setFlip((f) => !f)} aria-pressed={flip} aria-label={`${flip ? 'Show the' : 'Turn over the'} ${m.name} sample — ${flip ? 'front' : 'spec'}`}>↻</button>
          <button type="button" className="sw-btn add" onClick={() => onAdd(m.code)} disabled={inBox} aria-label={inBox ? `${m.name} is in your sample box` : `${copy.add}: ${m.name}`}>{inBox ? '✓' : '+'}</button>
        </div>
      )}
    </motion.div>
  );
}

/* ---------- The sample box: up to three materials become a named palette for the brief ---------- */
function Tray({ box, remove, trayRef, touch }) {
  const picked = box.map((c) => materials.find((m) => m.code === c));
  const name = picked.map((m) => m.short).join(' · ');
  const use = () => {
    setBrief({ palette: picked.map((m) => ({ code: m.code, name: m.short, cls: m.cls || '', img: m.img || '' })) });
    const el = document.getElementById('contact');
    if (el) scrollToY(el.getBoundingClientRect().top + window.scrollY - 40);
  };
  return (
    <div className="tray" ref={trayRef}>
      <span className="label tray-lbl" aria-live="polite">{copy.box} ({box.length}/{MAX})</span>
      <div className="tray-slots">
        {Array.from({ length: MAX }, (_, k) => {
          const m = picked[k];
          return m ? (
            <motion.div key={m.code} className="slot full" initial={{ scale: 1.25, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 18 }}>
              <Chip m={m} /><span>{m.short}</span>
              <button type="button" onClick={() => remove(m.code)} aria-label={`Remove ${m.name} from the sample box`}>✕</button>
            </motion.div>
          ) : <div key={`e${k}`} className="slot"><span>{k === box.length ? (touch ? 'tap +' : 'drop here') : ''}</span></div>;
        })}
      </div>
      <p className={'tray-name ' + (name ? 'disp' : 'mono')}>{name || (touch ? copy.boxHintTouch : copy.boxHint)}</p>
      <button type="button" className="btn btn-coral" disabled={!box.length} onClick={use}>{copy.use} <Arrow /></button>
    </div>
  );
}

export default function Materials() {
  const calm = useCalm();
  const secRef = useRef(null), deck = useRef(null), trayRef = useRef(null);
  const inView = useInView(deck, { once: true, amount: 0.5 });
  const [phase, setPhase] = useState(calm ? 'table' : 'closed');
  const [box, setBox] = useState([]);
  const touch = window.matchMedia('(hover: none)').matches;

  useEffect(() => {
    if (calm) { setPhase('table'); return; }
    if (!inView) return;
    setPhase('fan');                                     // the fan deck is still the entrance moment…
    const t = setTimeout(() => setPhase('table'), 1700); // …then the samples spread onto the table
    return () => clearTimeout(t);
  }, [inView, calm]);

  // touch screens have no hover: once the samples are on the table, the raking light sweeps across the first one by itself
  useEffect(() => {
    if (phase !== 'table' || calm || !touch) return;
    const el = deck.current?.querySelector('.swatch');
    if (!el) return;
    const s = el.style;
    let ctl;
    const t = setTimeout(() => {
      s.setProperty('--rk', '1');
      ctl = animate(0, 1, { duration: 1.6, ease: 'easeInOut', onUpdate: (v) => { s.setProperty('--lx', `${v * 100}%`); s.setProperty('--ly', `${30 + v * 40}%`); s.setProperty('--sx', `${(0.5 - v) * 22}px`); },
        onComplete: () => s.setProperty('--rk', '0') });
    }, 600);
    return () => { clearTimeout(t); ctl?.stop(); };
  }, [phase]);

  const add = (code) => setBox((b) => (b.includes(code) || b.length >= MAX ? b : [...b, code]));
  const remove = (code) => setBox((b) => b.filter((c) => c !== code));

  return (
    <section id="materials" ref={secRef} className="sheet sheet-lav sheet-in" aria-label="Material library">
      <div className="wrap mat">
        <div className="table-wrap">
          <div ref={deck} className={'fan' + (phase === 'table' ? ' spread' : '')}>
            {materials.map((m, i) => (
              <Swatch key={m.code} m={m} i={i} phase={phase} calm={calm} inBox={box.includes(m.code)} onAdd={add} trayRef={trayRef} bounds={secRef} />
            ))}
            {phase !== 'table' && <div className="pivot" />}
          </div>
          {phase === 'table' && <p className="label table-note">{touch || calm ? copy.tableHintTouch : copy.tableHint}</p>}
        </div>
        <div className="mat-side">
          <span className="label">{copy.eyebrow}</span>
          <MaskLines className="disp h2" lines={copy.lines} />
          <Rise as="p" className="lead" style={{ margin: 0, color: 'var(--muted-l)' }}>{copy.lead}</Rise>
          <Tray box={box} remove={remove} trayRef={trayRef} touch={touch || calm} />
        </div>
      </div>
    </section>
  );
}

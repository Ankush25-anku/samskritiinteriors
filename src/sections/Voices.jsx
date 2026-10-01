import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useAnimationFrame, useInView } from 'framer-motion';
import { voices, voicesCopy as copy } from '../data.js';
import { SecHead } from '../components/ui.jsx';
import Img from '../components/Img.jsx';
import { useCalm } from '../store/calm.js';

const N = voices.length;

/* The embossed review seal, turning slowly in the corner */
const Seal = () => (
  <div className="seal" aria-label={`${copy.seal[0]} — ${copy.seal[1]}`} role="img">
    <svg viewBox="0 0 120 120" aria-hidden="true">
      <defs><path id="seal-c" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" /></defs>
      <text><textPath href="#seal-c">{`${copy.seal[1].toUpperCase()} · ★★★★★ · `}</textPath></text>
    </svg>
    <b className="disp">{copy.seal[0]}</b>
  </div>
);

/* The note on top: pinned to its spot in the room, draggable, springs back to its pin */
function Note({ v, active, calm, onPick, noteRef, i, k }) {
  return (
    <motion.button type="button" ref={active ? noteRef : undefined} className={'note-card' + (active ? ' active' : ' tucked')}
      layout onClick={() => !active && onPick(i)} aria-pressed={active} aria-label={active ? undefined : `Show the note from ${v.name}`}
      drag={active && !calm} dragSnapToOrigin dragElastic={0.35} dragTransition={{ bounceStiffness: 260, bounceDamping: 18 }}
      whileDrag={{ scale: 1.04, rotate: v.r * 2 }} data-cursor={active ? 'DRAG' : 'OPEN'}
      style={{ '--r': `${v.r}deg`, '--k': k }}
      transition={{ type: 'spring', stiffness: 120, damping: 18 }}>
      <span className="tp" />
      <span className="in">
        <span className="top"><span>Client note</span><span>{v.pinLabel}</span></span>
        <span className="q">“{v.q}”</span>
        <span className="who"><Img slot={v.img} sizes="38px" /><span><b>{v.name}</b><small>{v.role}</small></span></span>
      </span>
    </motion.button>
  );
}

export default function Voices() {
  const calm = useCalm();
  const [cur, setCur] = useState(0);
  const stage = useRef(null), note = useRef(null), line = useRef(null), dot = useRef(null);
  const inView = useInView(stage, { amount: 0.1 });
  const v = voices[cur];

  // the leader line stays attached — from the pin in the photo to the note, even while it is dragged
  useAnimationFrame(() => {
    if (!inView || !stage.current || !note.current || !line.current) return;
    const s = stage.current.getBoundingClientRect(), n = note.current.getBoundingClientRect();
    const ph = stage.current.querySelector('.room-ph').getBoundingClientRect();
    const px = ph.left - s.left + (v.pin[0] / 100) * ph.width, py = ph.top - s.top + (v.pin[1] / 100) * ph.height;
    // attach to the nearest point on the note's edge
    const nx = Math.min(Math.max(px, n.left - s.left + 12), n.right - s.left - 12);
    const ny = Math.min(Math.max(py, n.top - s.top + 12), n.bottom - s.top - 12);
    if (![px, py, nx, ny].every(Number.isFinite)) return;
    line.current.setAttribute('d', `M${px},${py} L${nx},${ny}`);
    dot.current.setAttribute('cx', px); dot.current.setAttribute('cy', py);
  });

  const go = (d) => setCur((c) => (c + d + N) % N);
  useEffect(() => { note.current?.blur?.(); }, [cur]);

  return (
    <section id="voices" className="sheet sheet-lav voices sheet-in" aria-label="Client testimonials">
      <div className="wrap" style={{ position: 'relative' }}>
        <SecHead label={copy.eyebrow} lines={copy.lines}
          right={<Seal />} />
        <div className={'rooms-stage n' + cur} ref={stage}>
          <div className="room-ph">
            <AnimatePresence initial={false}>
              <motion.div key={v.room} className="room-img" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.9 }}>
                <motion.div className="kb" initial={{ scale: calm ? 1 : 1.12 }} animate={{ scale: 1 }} transition={{ duration: 9, ease: 'easeOut' }}>
                  <Img slot={v.room} alt={v.roomName} sizes="(max-width: 900px) 92vw, 1300px" fade={false} />
                </motion.div>
              </motion.div>
            </AnimatePresence>
            <span className="room-tag mono">{v.roomName}</span>
          </div>
          <svg className="leader" aria-hidden="true">
            <path ref={line} />
            <circle ref={dot} r="7" cx="-20" cy="-20" />
          </svg>
          <div className={'notes-layer' + (v.pin[0] > 55 ? ' left' : ' right')}>
            {voices.map((x, i) => (
              <Note key={x.id} v={x} i={i} k={(i - cur - 1 + N) % N} active={i === cur} calm={calm} onPick={setCur} noteRef={note} />
            ))}
          </div>
          <div className="room-nav">
            <button type="button" onClick={() => go(-1)} aria-label={copy.prev}>←</button>
            <span className="mono" aria-live="polite">{String(cur + 1).padStart(2, '0')} / {String(N).padStart(2, '0')} · {v.roomName}</span>
            <button type="button" onClick={() => go(1)} aria-label={copy.next}>→</button>
          </div>
        </div>
        {!calm && <p className="note drag-hint">{copy.drag}</p>}
      </div>
    </section>
  );
}

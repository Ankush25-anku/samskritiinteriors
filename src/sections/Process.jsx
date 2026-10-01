import { useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useMotionValueEvent, useScroll, useTransform } from 'framer-motion';
import { phases, processIntro as intro } from '../data.js';
import { EASE, CURTAIN, MaskLines, Odometer, ReadMore, SnapPoints } from '../components/ui.jsx';
import { useCalm } from '../store/calm.js';
import Img from '../components/Img.jsx';
import RoomDrawing from '../components/RoomDrawing.jsx';

const N = phases.length;
const STAGE_SIZES = '(max-width: 900px) 92vw, 56vw';

/* ---------- The room stage: one room, four layered states ---------- */
function RoomStage({ phase }) {
  const v = phases[Math.max(0, phase)].visual;
  const drawO = { survey: 0.4, moodboard: 0.4, render: 0.5, handover: 0 }[v];
  return (
    <div className={'room-stage v-' + v}>
      {/* 3–4 · the room itself: a grey render first, then the real thing */}
      <div className="room-photo" style={{ opacity: v === 'render' || v === 'handover' ? 1 : 0 }}>
        <Img slot="hero" alt="" sizes={STAGE_SIZES} fade={false} />
      </div>
      {/* the line drawing underneath everything until handover */}
      <div className="room-draw" style={{ opacity: drawO }}><RoomDrawing /></div>

      {/* 1 · survey grid and measurement points */}
      <div className="room-survey" style={{ opacity: v === 'survey' ? 1 : 0 }} aria-hidden="true">
        {intro.survey.map((pt, i) => (
          <motion.span key={pt.t} className="survey-pt" style={{ left: `${pt.x}%`, top: `${pt.y}%` }}
            initial={false} animate={v === 'survey' ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 380, damping: 16, delay: v === 'survey' ? 0.3 + i * 0.18 : 0 }}>
            <i />{pt.t}
          </motion.span>
        ))}
      </div>

      {/* 2 · moodboard pinned over the drawing */}
      <div className="room-mood" aria-hidden="true">
        {intro.moodboard.map((t, i) => (
          <motion.div key={i} className="mood-tile" style={{ left: `${t.x}%`, top: `${t.y}%`, width: `${t.w}%` }}
            initial={false}
            animate={v === 'moodboard' ? { opacity: 1, y: 0, rotate: t.r, scale: 1 } : { opacity: 0, y: 70, rotate: t.r + 12, scale: 1.08 }}
            transition={v === 'moodboard' ? { type: 'spring', stiffness: 140, damping: 16, delay: 0.15 + i * 0.1 } : { duration: 0.4, ease: CURTAIN }}>
            {t.slot ? <Img slot={t.slot} alt="" sizes="16vw" fade={false} /> : <div className={'mood-sw ' + t.cls} />}
          </motion.div>
        ))}
      </div>

      {/* 3 · render tag */}
      <span className="room-tag" style={{ opacity: v === 'render' ? 1 : 0 }}>{intro.render}</span>

      {/* 4 · handover stamp */}
      <AnimatePresence>
        {v === 'handover' && (
          <motion.div key="stamp" className="room-stamp" initial={{ opacity: 0, scale: 2.6, rotate: -10 }} animate={{ opacity: 1, scale: 1, rotate: -10 }} exit={{ opacity: 0 }} transition={{ duration: 0.5, ease: EASE, delay: 0.5 }}>
            <span className="disp">{intro.stamp}</span>
          </motion.div>
        )}
      </AnimatePresence>
      <span className="room-cap">{phases[Math.max(0, phase)].label}</span>
    </div>
  );
}

/* One slim progress row, four equal steps: finished steps solid coral, the active one filling as you scroll. */
function MiniGantt({ phase, local }) {
  return (
    <div className="mini-gantt" aria-hidden="true">
      {phases.map((ph, i) => {
        const l = i / N, w = 1 / N;
        return (
          <div key={ph.n} className={'mg-bar' + (i === phase ? ' on' : '')} style={{ left: `${l * 100}%`, width: `${w * 100}%` }}>
            <motion.i style={{ scaleX: i < phase ? 1 : i === phase ? local : 0 }} />
          </div>
        );
      })}
    </div>
  );
}

function Script({ phase, local }) {
  const ph = phases[phase];
  return (
    <div className="script">
      <div className="week disp" aria-label={`Step ${phase + 1} of ${N}`}>Step <Odometer value={String(phase + 1)} /></div>
      <div className="script-body" aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.div key={ph.n} className="script-copy" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.45, ease: EASE }}>
            <span className="mono step">{ph.len}</span>
            <h3 className="disp script-title">{ph.t}</h3>
            <ReadMore text={ph.s} />
          </motion.div>
        </AnimatePresence>
      </div>
      <MiniGantt phase={phase} local={local} />
    </div>
  );
}

/* ---------- Desktop: pinned, the room is built as you scroll ---------- */
function Build() {
  const ref = useRef(null);
  const [phase, setPhase] = useState(0);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const local = useTransform(p, (v) => { const x = Math.min(0.9999, v) * N; return x - Math.floor(x); });
  useMotionValueEvent(p, 'change', (v) => {
    const x = Math.min(0.9999, Math.max(0, v)) * N, i = Math.floor(x);
    setPhase(i);
  });
  // Lumen is re-assembled in step with the room: one hold anchor per lamp state.
  const holds = phases.flatMap((ph, i) => ph.lamp.map((st, j) => ({ st, from: i + j / ph.lamp.length, to: i + (j + 1) / ph.lamp.length })));
  return (
    <section id="process" ref={ref} className="build" aria-label="Process">
      {holds.map((h, k) => (
        <span key={k} className="build-track" aria-hidden="true"
          style={{ top: `calc(50svh + (100% - 100svh) * ${h.from / N})`, height: `calc((100% - 100svh) * ${(h.to - h.from) / N})` }}
          data-lumen={`process-${k}`} data-lumen-hold="" data-lumen-state={h.st} data-lumen-y=".24" data-lumen-scale=".75" data-lumen-beam=".7" data-lumen-rot={h.st === 'lit' ? -16 : 0}
          data-lumen-mobile-y=".3" data-lumen-mobile-scale=".3" data-lumen-mobile-beam="0" />
      ))}
      <SnapPoints ts={phases.map((_, i) => (i + 0.5) / N)} />
      <div className="build-stage sheet-plum">
        <div className="build-head">
          <span className="label">{intro.label}</span>
          <MaskLines lines={intro.lines} className="disp build-title" />
        </div>
        <Script phase={phase} local={local} />
        <div className="build-right">
          <RoomStage phase={phase} />
          <p className="note">{intro.note}</p>
        </div>
      </div>
    </section>
  );
}

/* ---------- Mobile / reduced motion: four stacked phase cards ---------- */
function PhaseCard({ ph, i, still }) {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.5, once: true });
  return (
    <article className="phase-card" ref={ref}>
      <span className="lumen-pt" style={{ right: 28, top: -30 }} data-lumen={`process-${i}`} data-lumen-state={ph.lamp[ph.lamp.length - 1]} data-lumen-scale=".7" data-lumen-beam="0" />
      {still || inView ? <RoomStage phase={i} /> : <div className="room-stage" />}
      <span className="mono step">Step {ph.n} · {ph.len}</span>
      <h3 className="disp script-title">{ph.t}</h3>
      <p className="lead">{ph.s}</p>
      <MiniGantt phase={i} local={1} />
    </article>
  );
}

function Stack({ still }) {
  return (
    <section id="process" className="sheet sheet-plum build-stack" aria-label="Process">
      <div className="wrap">
        <div className="sec-head">
          <div>
            <span className="label">{intro.label}</span>
            <MaskLines lines={intro.lines} className="disp h2" />
          </div>
        </div>
        <div className="phase-cards">{phases.map((ph, i) => <PhaseCard key={ph.n} ph={ph} i={i} still={still} />)}</div>
        <p className="note" style={{ marginTop: 28 }}>{intro.note}</p>
      </div>
    </section>
  );
}

export default function Process() {
  return useCalm() ? <Stack still /> : <Build />;
}

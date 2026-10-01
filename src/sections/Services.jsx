import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useMotionValueEvent, useScroll, useTransform } from 'framer-motion';
import { services, servicesIntro as intro } from '../data.js';
import { EASE, CURTAIN, Arrow, MaskLines, PORTRAIT, ReadMore, SnapPoints, scrollToY, useMedia } from '../components/ui.jsx';
import { useCalm } from '../store/calm.js';
import Img from '../components/Img.jsx';

const N = services.length;
const INTRO = 0.1;                   // share of the scroll spent in the dark, before room 01 lights up
const STEP = (1 - INTRO) / N;
const stepAt = (p) => (p < INTRO ? -1 : Math.min(N - 1, Math.floor((p - INTRO) / STEP)));
const ARCH_SIZES = '(max-width: 900px) 92vw, 34vw';

/* ---------- The studio plan, one room per service ---------- */
const rooms = [
  { x: 30, y: 30, w: 410, h: 350 }, { x: 440, y: 30, w: 390, h: 240 }, { x: 440, y: 270, w: 390, h: 210 },
  { x: 30, y: 380, w: 280, h: 250 }, { x: 310, y: 480, w: 520, h: 150 },
];
const furniture = [
  <g key="f0"><rect x="120" y="90" width="230" height="70" rx="30" /><circle cx="235" cy="240" r="46" /><rect x="70" y="300" width="80" height="40" /></g>,
  <g key="f1"><rect x="470" y="60" width="330" height="36" />{[510, 600, 690, 780].map((x) => <circle key={x} cx={x} cy="170" r="22" />)}</g>,
  <g key="f2">{[[480, 310], [650, 310], [480, 380], [650, 380]].map(([x, y]) => <rect key={x + y} x={x} y={y} width="140" height="40" />)}</g>,
  <g key="f3">{[60, 90, 120].map((x) => <line key={x} x1={x} y1="420" x2={x} y2="600" />)}<rect x="170" y="440" width="100" height="100" /></g>,
  <g key="f4"><rect x="420" y="520" width="200" height="60" /><rect x="660" y="510" width="130" height="80" strokeDasharray="6 6" /></g>,
];
function FloorPlan({ active }) {
  const s = services[Math.max(0, active)];
  return (
    <svg className="mini-plan" viewBox="0 0 860 660" role="img" aria-label={`Studio plan — ${s.title} highlighted`}>
      <defs>
        <pattern id="svc-hatch" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="12" height="12" fill="rgba(255,111,89,0.18)" /><line x1="0" y1="0" x2="0" y2="12" stroke="#FF6F59" strokeWidth="3" />
        </pattern>
      </defs>
      {rooms.map((r, i) => <rect key={i} x={r.x} y={r.y} width={r.w} height={r.h} fill={i === active ? 'url(#svc-hatch)' : 'transparent'} style={{ transition: 'fill .5s' }} />)}
      <g fill="none" stroke="#D6CCFF" strokeWidth="3" opacity=".7">{furniture}</g>
      <g fill="none" stroke="#F7F3FF" strokeWidth="10" strokeLinecap="square">
        <path d="M30 30 H830 V630 H30 Z" /><path d="M440 30 V120 M440 200 V480" /><path d="M440 270 H600 M680 270 H830" />
        <path d="M30 380 H180 M260 380 H440" /><path d="M310 380 V480 M310 560 V630" /><path d="M310 480 H520 M600 480 H830" />
      </g>
      {active >= 0 && <motion.circle className="pulse" r="14" fill="#FF6F59" initial={{ cx: s.pin[0], cy: s.pin[1] }} animate={{ cx: s.pin[0], cy: s.pin[1] }} transition={{ type: 'spring', stiffness: 120, damping: 18 }} />}
    </svg>
  );
}

/* ---------- One room in the arch: a dark print underneath, a lit copy revealed by the lamp's light ---------- */
function Room({ slot, alt, inset, on, visible, p, range, eager }) {
  const scale = useTransform(p, range, [1.12, 1]); // slow settle while this room is lit
  return (
    <div className={'arch-room' + (on ? ' on' : '') + (visible ? ' vis' : '')}>
      <motion.div className="arch-zoom" style={{ scale }}>
        <Img slot={slot} alt="" className="arch-dark" sizes={ARCH_SIZES} eager={eager} fade={false} aria-hidden="true" />
        <div className="arch-lit"><Img slot={slot} alt={alt} sizes={ARCH_SIZES} eager={eager} fade={false} /></div>
      </motion.div>
      {inset && <div className="arch-inset"><Img slot={inset} alt="" sizes="160px" /></div>}
    </div>
  );
}

function Rail({ active, go }) {
  return (
    <nav className="svc-rail" aria-label="Rooms">
      {services.map((s, i) => (
        <button key={s.n} type="button" className={i === active ? 'on' : ''} aria-label={`Show ${s.title}`} aria-current={i === active ? 'step' : undefined} onClick={() => go(i)}>
          <i /><b className="rail-n" aria-hidden="true" /><span>{s.title}</span>
        </button>
      ))}
    </nav>
  );
}

function Copy({ s, i, portrait, more, setMore, setRead }) {
  const ticks = <ul className="ticks">{s.tags.map((t) => <li key={t}><b>✓</b>{t}</li>)}</ul>;
  return (
    <motion.div key={s.n} className="svc-copy" initial="hidden" animate="show" exit="exit">
      <h3 className="disp svc-title">
        <span className="mask"><motion.span style={{ display: 'inline-block' }} variants={{ hidden: { y: '105%' }, show: { y: 0, transition: { duration: 0.9, ease: EASE } }, exit: { y: '-105%', transition: { duration: 0.45, ease: CURTAIN } } }}>{s.title}</motion.span></span>
      </h3>
      <motion.div variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE, delay: 0.15 } }, exit: { opacity: 0, transition: { duration: 0.25 } } }}>
        <ReadMore text={s.desc} onToggle={setRead} />
        {portrait ? (
          <>
            <button type="button" className="more-btn mono" aria-expanded={more} aria-controls={`svc-more-${s.n}`} onClick={() => setMore(!more)}>{more ? 'Details −' : 'Details +'}</button>
            <AnimatePresence initial={false}>
              {more && (
                <motion.div id={`svc-more-${s.n}`} className="more-panel" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.45, ease: EASE }}>
                  {ticks}
                  <FloorPlan active={i} />
                </motion.div>
              )}
            </AnimatePresence>
          </>
        ) : ticks}
      </motion.div>
    </motion.div>
  );
}

/* ---------- Desktop: pinned dark gallery ---------- */
function Gallery() {
  const ref = useRef(null);
  const [step, setStep] = useState(-1);
  const portrait = useMedia(PORTRAIT);
  const [more, setMore] = useState(false), [read, setRead] = useState(false);
  useEffect(() => { setMore(false); setRead(false); }, [step]);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  useMotionValueEvent(p, 'change', (v) => setStep(stepAt(v)));
  const go = (i) => {
    const el = ref.current;
    const top = el.getBoundingClientRect().top + window.scrollY;
    scrollToY(top + (el.offsetHeight - window.innerHeight) * (INTRO + (i + 0.5) * STEP));
  };
  const s = services[Math.max(0, step)];
  return (
    <section id="services" ref={ref} className="svc-gallery" aria-label="Services">
      <div aria-hidden="true">
        <span className="svc-track" data-lumen="services" data-lumen-hold="" data-lumen-state="lit" data-lumen-y=".2" data-lumen-scale=".9" data-lumen-beam="1.2" data-lumen-mobile-y=".13" data-lumen-mobile-scale=".45" data-lumen-mobile-beam=".8" />
        <SnapPoints ts={[INTRO / 2, ...services.map((_, i) => INTRO + (i + 0.5) * STEP)]} />
      </div>
      <div className={'svc-stage' + (more || read ? ' expanded' : '')}>
        <div className="svc-left">
          <div className="arch">
            <div className="arch-in">
              <Room slot={intro.establishing.slot} alt={intro.establishing.alt} on visible={step === -1} p={p} range={[0, INTRO]} />{/* lights off: the room at dusk, dim but recognisable */}
              {services.map((x, i) => (
                <Room key={x.n} slot={x.img} alt={x.alt} inset={x.inset} on={i === step} visible={i === step} p={p} range={[INTRO + i * STEP, INTRO + (i + 1) * STEP]} />
              ))}
            </div>
            <span className="arch-cap">{step < 0 ? 'Lights off' : s.title}</span>
          </div>
        </div>
        <div className="svc-right">
          <span className="label">{intro.label}</span>
          <Rail active={step} go={go} />
          <div className="svc-body" aria-live="polite">
            <AnimatePresence mode="wait">
              {step < 0 ? (
                <motion.div key="intro" className="svc-copy" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.25 } }}>
                  <MaskLines as="h2" lines={intro.lines} className="disp svc-title" once={false} />
                  <span className="note">{intro.note}</span>
                </motion.div>
              ) : <Copy key={s.n} s={s} i={step} portrait={portrait} more={more} setMore={setMore} setRead={setRead} />}
            </AnimatePresence>
          </div>
          <div className="svc-foot">
            {!portrait && <FloorPlan active={step} />}
            <a className="btn btn-coral" href="#contact" tabIndex={step < 0 ? -1 : 0} style={{ opacity: step < 0 ? 0 : 1 }}>{intro.cta} <Arrow /></a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Mobile / reduced motion: one arched card per room ---------- */
function Card({ s, i, still }) {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.5 });
  const lit = still || inView;
  return (
    <article className="svc-card" ref={ref}>
      <span className="lumen-pt" style={{ right: 28, top: -34 }} data-lumen={`services-${i}`} data-lumen-state="lit" data-lumen-scale=".8" data-lumen-beam=".9" />
      <div className="arch">
        <div className="arch-in">
          <div className={'arch-room vis' + (lit ? ' on' : '')}>
            <div className="arch-zoom">
              <Img slot={s.img} alt="" className="arch-dark" sizes={ARCH_SIZES} fade={false} aria-hidden="true" />
              <div className="arch-lit"><Img slot={s.img} alt={s.alt} sizes={ARCH_SIZES} fade={false} /></div>
            </div>
            {s.inset && <div className="arch-inset"><Img slot={s.inset} alt="" sizes="120px" /></div>}
          </div>
        </div>
        <span className="arch-cap">{s.title}</span>
      </div>
      <h3 className="disp svc-title">{s.title}</h3>
      <p className="lead">{s.desc}</p>
      <ul className="ticks">{s.tags.map((t) => <li key={t}><b>✓</b>{t}</li>)}</ul>
      <a className="btn btn-coral" href="#contact">{intro.cta} <Arrow /></a>
    </article>
  );
}

function Stack({ still }) {
  return (
    <section id="services" className="svc-stack sheet sheet-night" aria-label="Services">
      <div className="wrap">
        <div className="sec-head">
          <div>
            <span className="label">{intro.label}</span>
            <MaskLines lines={intro.lines} className="disp h2" />
          </div>
        </div>
        <div className="svc-cards">{services.map((s, i) => <Card key={s.n} s={s} i={i} still={still} />)}</div>
      </div>
    </section>
  );
}

export default function Services() {
  // phones and tablets get the same pinned sequence in a portrait layout (CSS); calm mode reads as a still stack
  return useCalm() ? <Stack still /> : <Gallery />;
}

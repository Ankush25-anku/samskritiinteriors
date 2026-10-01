import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useSpring, useTransform, useVelocity } from 'framer-motion';
import { team, teamCopy as copy } from '../data.js';
import { SecHead } from '../components/ui.jsx';
import Img from '../components/Img.jsx';
import { useCalm } from '../store/calm.js';
import { lumenPos } from '../three/store.js';

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

/* the signature, drawn on like a pen stroke */
function Signature({ text, on }) {
  return (
    <svg className={'sig' + (on ? ' on' : '')} viewBox="0 0 240 60" aria-label={`Signed ${text}`} role="img">
      <text x="6" y="44">{text}</text>
      <path d="M8 52 C 60 46, 140 58, 226 48" />
    </svg>
  );
}

function Pass({ m, i, impulse, calm }) {
  const [flip, setFlip] = useState(false);
  // physical swing: scroll velocity pushes each pass; a soft spring lets it settle (each a little differently)
  const push = useTransform(impulse, (v) => v * [1, -0.8, 1.15, -0.9][i]);
  const rotate = useSpring(push, { stiffness: 38 + i * 6, damping: 4.5, mass: 1.2 });
  return (
    <motion.div className="pass-hang" style={{ rotate: calm ? 0 : rotate }}>
      <div className="pass" style={{ animationDelay: `${[0, -1.3, -2.4, -0.7][i]}s` }}>
        <div className="strap" /><div className="clip" />
        <button type="button" className={'card3d' + (flip ? ' flipped' : '')} onClick={() => setFlip(!flip)} aria-pressed={flip}
          aria-label={flip ? `${copy.back}: ${m.name}` : `Read ${m.name}'s site diary`} data-cursor={flip ? 'BACK' : 'DIARY'}>
          <span className="card-in">
            <span className="card face-f">
              <span className="slot"><i /></span>
              <span className="band"><span>SITE PASS</span><span>SAMSKRITI</span></span>
              <span className="photo"><Img slot={m.img} alt={`Portrait of ${m.name}`} sizes="(max-width: 1024px) 42vw, 240px" /></span>
              <span className="info">
                <b>{m.name}</b><small>{m.role}</small>
                <span className="bar"><i /></span>
              </span>
            </span>
            <span className="card face-b" aria-hidden={!flip}>
              <span className="slot"><i /></span>
              <span className="band"><span>{copy.diary.toUpperCase()}</span><span>SAMSKRITI</span></span>
              <span className="diary">
                <span className="mono dk">{copy.now}</span>
                <b>{m.diary.project}</b>
                <span className="mono dk">{copy.fav}</span>
                <span className="fav"><i className={m.diary.material.cls || ''}>{m.diary.material.img && <Img slot={m.diary.material.img} alt="" sizes="40px" />}</i>{m.diary.material.name}</span>
                <span className="words">“{m.diary.words}”</span>
                <Signature text={m.sig} on={flip} />
              </span>
            </span>
          </span>
        </button>
      </div>
    </motion.div>
  );
}

export default function Team() {
  const calm = useCalm();
  const ref = useRef(null);
  const { scrollY } = useScroll();
  const vel = useVelocity(scrollY);
  const impulse = useTransform(vel, (v) => clamp(v / 140, -14, 14));

  // when Lumen passes, lanyards glow and portraits turn from greyscale to colour inside its beam
  useEffect(() => {
    if (calm) return;
    const passes = [...ref.current.querySelectorAll('.pass')];
    let raf = 0;
    const paint = () => {
      raf = 0;
      const on = lumenPos.on, px = lumenPos.x, py = lumenPos.y, R = 260 + 260 * lumenPos.s;
      passes.forEach((p) => {
        const r = p.getBoundingClientRect();
        if (r.bottom < 0 || r.top > window.innerHeight) return;
        const d = Math.hypot(r.left + r.width / 2 - px, r.top + r.height * 0.45 - (py + 120));
        p.style.setProperty('--lit', on ? clamp(1 - d / R, 0, 1).toFixed(3) : '0');
      });
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(paint); };
    const un = lumenPos.subscribe(kick);
    window.addEventListener('scroll', kick, { passive: true });
    return () => { un(); window.removeEventListener('scroll', kick); cancelAnimationFrame(raf); };
  }, [calm]);

  return (
    <section id="team" ref={ref} className="sheet sheet-night sheet-in" aria-label="Team" style={{ paddingBottom: 'calc(var(--sec) + 20px)' }}>
      <div className="wrap" style={{ position: 'relative' }}>
        <SecHead label={copy.eyebrow} lines={copy.lines}
          right={<span className="note">{window.matchMedia('(hover: none)').matches ? copy.hint.replace('click', 'tap') : copy.hint}</span>} />
        <span className="lumen-pt" style={{ left: '50%', top: '34%' }} data-lumen="team" data-lumen-state="lit" data-lumen-scale=".8" data-lumen-beam="1.3" data-lumen-mobile-beam="1" />
        <div className="rail" />
        <div className="passes">
          {team.map((m, i) => (
            <motion.div key={m.id} initial={{ y: -16, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: i * 0.08 }}>
              <Pass m={m} i={i} impulse={impulse} calm={calm} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

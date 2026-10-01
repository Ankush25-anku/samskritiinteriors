import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useMotionValue, useTransform } from 'framer-motion';
import { nav, lumen, business, footerCopy as copy } from '../data.js';
import credits from '../credits.json';
import { Logo, scrollToY } from '../components/ui.jsx';
import { useCalm } from '../store/calm.js';
import { lumenCtl } from '../three/store.js';

/* ---------- the studio's window on a line-drawn skyline, with Bengaluru's live time ----------
   The window is lit while the studio is open — once the opening hours are confirmed (business.hours in data.js). */
function studioNow() {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', weekday: 'short', hour12: false }).formatToParts(new Date()).map((p) => [p.type, p.value]));
  const h = +parts.hour % 24, hrs = business.hours;
  const open = hrs ? parts.weekday !== 'Sun' && h >= hrs.open[0] && h < hrs.open[1] : null;
  return { time: `${String(h).padStart(2, '0')}:${parts.minute}`, open };
}
function Skyline() {
  const [t, setT] = useState(studioNow);
  useEffect(() => { const id = setInterval(() => setT(studioNow()), 20000); return () => clearInterval(id); }, []);
  return (
    <div className="skyline">
      <svg viewBox="0 0 520 150" aria-hidden="true">
        <path className="sk-line" d="M0 140 H40 V96 H70 V120 H96 V60 H136 V140 H186 V104 H210 V140 H300 V84 H322 V36 H350 V84 H372 V140 H420 V110 H452 V74 H486 V140 H520" />
        <rect className={'sk-win' + (t.open ? ' lit' : '')} x="329" y="48" width="14" height="18" />
      </svg>
      <div className="sk-labels">
        <div className={'sk-st' + (t.open ? ' open' : '')}>
          <span className="mono"><i aria-hidden="true" />Whitefield · <b>{t.time}</b> IST{t.open != null && <> · {t.open ? 'open' : 'closed'}</>}</span>
        </div>
      </div>
    </div>
  );
}

/* ---------- Lumen's pull cord: drag it down (or click / Enter) to switch the lamp ---------- */
function PullCord({ off, toggle }) {
  const y = useMotionValue(0);
  const tension = useTransform(y, [0, 36], [1, 1.35]);
  return (
    <div className="cord">
      <motion.i className="cord-chain" style={{ scaleY: tension }} aria-hidden="true" />
      <motion.button type="button" className="cord-pull" style={{ y }}
        drag="y" dragConstraints={{ top: 0, bottom: 40 }} dragElastic={0.12} dragSnapToOrigin
        onDragEnd={(e, info) => { if (info.offset.y > 22) toggle(); }}
        onClick={(e) => { if (e.detail === 0 || Math.abs(y.get()) < 4) toggle(); }}
        aria-pressed={off} aria-label={off ? copy.on : copy.off} data-cursor="PULL">
        <span aria-hidden="true" />
      </motion.button>
    </div>
  );
}

export default function Footer() {
  const calm = useCalm();
  const ref = useRef(null), wm = useRef(null);
  const inView = useInView(wm, { once: true, amount: 0.5 });
  const [off, setOff] = useState(false);
  // as the footer rises, the rest of the page dims around the lamp
  const dim = useMotionValue(0);
  useEffect(() => {
    let raf = 0;
    const measure = () => {
      raf = 0;
      const r = ref.current.getBoundingClientRect(), H = window.innerHeight;
      const p = Math.min(1, Math.max(0, (H - r.top) / Math.max(1, Math.min(r.height, H) * 0.8)));
      dim.set(p * 0.6);
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(measure); };
    window.addEventListener('scroll', on, { passive: true });
    measure();
    return () => { window.removeEventListener('scroll', on); cancelAnimationFrame(raf); };
  }, []);

  useEffect(() => { lumenCtl.set({ footerOff: off }); }, [off]);
  const toggle = () => {
    if (!off) { setOff(true); return; }
    setOff(false);                                   // light back on…
    setTimeout(() => scrollToY(0), calm ? 0 : 500);  // …and back up to the lit room
  };

  return (
    <>
      {!calm && <motion.div className={'night' + (off ? ' out' : '')} style={{ opacity: off ? 0.9 : dim }} aria-hidden="true" />}
      <footer className={'footer' + (off ? ' dark' : '')} ref={ref}>
        <div className="wrap">
          <div className="f-top">
            <div className="f-news">
              <span className="disp f-title">Visit the <span className="foil">studio</span>.</span>
              <address className="f-address">{business.address.map((l) => <span key={l}>{l}</span>)}</address>
            </div>
            <Skyline />
            <div className="f-cols">
              <div><span className="t">{copy.explore}</span>{nav.map((n) => <a key={n.id} href={n.href}>{n.label}</a>)}</div>
              <div><span className="t">{copy.reach}</span><a href={business.tel}>{business.phone}</a><a href={business.whatsapp} target="_blank" rel="noopener noreferrer">WhatsApp ↗</a><a href={business.directions} target="_blank" rel="noopener noreferrer">Get directions ↗</a>{business.instagram && <a href={business.instagram} target="_blank" rel="noopener noreferrer">Instagram ↗</a>}</div>
            </div>
          </div>
          <div className="lights-out">
            <span className="lumen-pt" style={{ left: '50%', top: 0 }} data-lumen="footer" data-lumen-state="lit" data-lumen-scale=".8" data-lumen-beam=".6" data-lumen-mobile-free="" data-lumen-mobile-beam=".5" />
            <PullCord off={off} toggle={toggle} />
            <span className="note lo-note">{off ? lumen.footerNote : 'pull the cord when you’re done ↓'}</span>
          </div>
          <div ref={wm} className={'f-logo' + (inView ? ' in' : '') + (off ? ' plotted' : '')}>
            <Logo kind="full" alt="The Samskriti Interiors — www.thesamskriti.com" />
          </div>
          <div className="f-bot">
            <span>{copy.copyright}</span>
            <details className="credits">
              <summary>Photography via Unsplash</summary>
              <ul>{credits.map((c) => <li key={c.slot}><span>{c.slot}</span><a href={c.photo} target="_blank" rel="noopener noreferrer">Photo</a> by <a href={c.profile} target="_blank" rel="noopener noreferrer">{c.photographer}</a></li>)}</ul>
            </details>
            <a href="#top" style={{ color: 'var(--white)' }}>{copy.top}</a>
          </div>
        </div>
      </footer>
    </>
  );
}

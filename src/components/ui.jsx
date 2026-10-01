import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

export const EASE = [0.16, 1, 0.3, 1];
export const CURTAIN = [0.77, 0, 0.18, 1];

/** Shared smooth-scroll: App registers its Lenis instance here; falls back to native smooth scroll. */
export const smooth = { lenis: null };
export function scrollToY(y) {
  if (smooth.lenis) smooth.lenis.scrollTo(y, { duration: 1.6 });
  else window.scrollTo({ top: y, behavior: 'smooth' });
}

/** "*word*" in a headline → the italic accent (coral on dark sections, coral-ink on lavender — see .foil in CSS). */
export function accent(text) {
  if (typeof text !== 'string' || !text.includes('*')) return text;
  return text.split(/\*([^*]+)\*/).map((part, i) => (i % 2 ? <span key={i} className="foil">{part}</span> : part));
}

/** Headline lines that rise out of an overflow mask when they enter the viewport. */
// The observer watches the (visible) heading; each line inherits the "show" state and rises in turn.
export function MaskLines({ lines, className = '', as = 'h2', delay = 0, once = true, style }) {
  const Tag = motion[as];
  return (
    <Tag className={className} style={style} initial="hidden" whileInView="show" viewport={{ once, amount: 0.4 }}>
      {lines.map((l, i) => (
        <span className="mask" key={i}>
          <motion.span
            style={{ display: 'inline-block' }}
            variants={{ hidden: { y: '105%' }, show: { y: '0%', transition: { duration: 1.1, ease: EASE, delay: delay + i * 0.1 } } }}
          >
            {accent(l)}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

/** Soft fade-up for supporting copy. */
export function Rise({ children, delay = 0, className, style, as = 'div' }) {
  const M = motion[as];
  return (
    <M className={className} style={style}
      initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.7, ease: EASE, delay }}>
      {children}
    </M>
  );
}

/** Section header: sheet code label + headline + optional right slot. */
export function SecHead({ label, lines, right }) {
  return (
    <div className="sec-head">
      <div>
        <span className="label">{label}</span>
        <MaskLines lines={lines} className="disp h2" />
      </div>
      {right}
    </div>
  );
}

export const Arrow = ({ size = 16, dir = 'right' }) => (
  <svg className="arr" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {dir === 'right' ? (<><path d="M5 12h14" /><path d="M13 6l6 6-6 6" /></>) : (<><path d="M7 17L17 7" /><path d="M8 7h9v9" /></>)}
  </svg>
);

/** True while a media query matches (read synchronously so the first render is right). */
export function useMedia(query) {
  const [on, setOn] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const fn = () => setOn(mq.matches);
    fn();
    mq.addEventListener('change', fn);
    return () => mq.removeEventListener('change', fn);
  }, [query]);
  return on;
}

/** Scroll-snap points inside a pinned section (touch screens only, see CSS): one per scene, at progress t of the pin. */
export function SnapPoints({ ts }) {
  return ts.map((t, i) => <span key={i} className="snap-pt" aria-hidden="true" style={{ top: `calc((100% - 100svh) * ${t.toFixed(4)})` }} />);
}

/** The portrait layout of the pinned sections (keep in sync with the CSS block "RESPONSIVE PARITY"). */
export const PORTRAIT = '(max-width: 900px), (max-aspect-ratio: 5/6)';

/** A paragraph that the portrait layout clamps (CSS `.clamp`); "Read more" appears only when text is actually cut off. */
export function ReadMore({ text, className = 'lead', onToggle }) {
  const ref = useRef(null);
  const [open, setOpen] = useState(false);
  const [cut, setCut] = useState(false);
  useEffect(() => {
    const el = ref.current;
    const check = () => setCut(el.scrollHeight > el.clientHeight + 2);
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const flip = () => { setOpen(!open); onToggle?.(!open); };
  return (
    <>
      <p ref={ref} className={className + ' clamp' + (open ? ' open' : '')}>{text}</p>
      {(cut || open) && <button type="button" className="read-more mono" aria-expanded={open} onClick={flip}>{open ? 'Read less −' : 'Read more +'}</button>}
    </>
  );
}

/** The Samskriti logo (public/brand, built by scripts/brand.mjs): WebP + PNG, 1x/2x, never stretched. */
const LOGO = {
  lockup: [248, 44], full: [320, 203], mark: [160, 160], markonly: [320, 203], stack: [280, 159], 'stack-mark': [280, 159], 'stack-text': [280, 159],
  'lockup-light': [248, 44], 'full-light': [320, 203], 'stack-light': [280, 159], // the -light variants: white parts in plum, for light surfaces
};
export function Logo({ kind = 'lockup', alt = 'The Samskriti Interiors', className = '', ...rest }) {
  const [w, h] = LOGO[kind], f = `./brand/logo-${kind}`;
  return (
    <picture className="pic">
      <source type="image/webp" srcSet={`${f}.webp 1x, ${f}@2x.webp 2x`} />
      <img className={'logo logo-' + kind + (className ? ' ' + className : '')} src={`${f}.png`} srcSet={`${f}.png 1x, ${f}@2x.png 2x`} width={w} height={h} alt={alt} decoding="async" {...rest} />
    </picture>
  );
}

/** Digits that roll like an odometer. */
export function Odometer({ value, className = '' }) {
  return (
    <span className={'odo ' + className} aria-label={value}>
      {String(value).split('').map((ch, i) => (/\d/.test(ch)
        ? <span className="odo-col" key={i} aria-hidden="true"><span className="odo-strip" style={{ transform: `translateY(${-Number(ch) * 10}%)` }}>{'0123456789'.split('').map((d) => <span key={d}>{d}</span>)}</span></span>
        : <span key={i} aria-hidden="true">{ch}</span>))}
    </span>
  );
}

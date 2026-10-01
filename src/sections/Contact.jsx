import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { contactCopy as copy, places, business, lakh } from '../data.js';
import { MaskLines, EASE, CURTAIN } from '../components/ui.jsx';
import Img from '../components/Img.jsx';
import { useBrief, setBrief } from '../store/brief.js';
import { useCalm } from '../store/calm.js';
import { lumenCtl } from '../three/store.js';
import { submitEnquiry } from '../lib/submitEnquiry.js';

const coordsFor = (loc) => {
  const key = loc.toLowerCase().split(',')[0].trim();
  return places[key] || (key ? '— noted for the site visit —' : '');
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* a small line drawing of the room type */
function RoomIcon({ type: home }) {
  const type = copy.icons[home] ?? 0;
  const g = [
    <><path d="M18 58h84M24 58V44q0-6 6-6h60q6 0 6 6v14M30 38v-6q0-4 4-4h52q4 0 4 4v6" /><path d="M24 58v6M96 58v6" /><path d="M104 20v26M98 46h12" /><path d="M96 20h16l-4-8h-8z" /></>,
    <><circle cx="60" cy="50" r="16" /><path d="M60 66v6M50 72h20" /><rect x="22" y="44" width="12" height="18" rx="2" /><rect x="86" y="44" width="12" height="18" rx="2" /><path d="M60 6v12M50 26a10 8 0 0 1 20 0z" /></>,
    <><path d="M14 44h92M20 44v24M100 44v24" /><rect x="36" y="22" width="30" height="20" /><path d="M51 42v2M44 44h14" /><path d="M78 56h14M85 56v12M78 68h14" /><path d="M72 30h20" /></>,
    <><path d="M12 68h96" /><path d="M20 68V24h50v44" /><path d="M20 36h50M20 48h50M20 60h50M45 24v12M33 36v12M57 36v12M45 48v12" /><path d="M84 30l18 18-6 6-18-18z" /><path d="M78 36l-6 20" /></>,
    <><path d="M16 68h88" /><path d="M28 68V38l32-22 32 22v30" /><rect x="52" y="48" width="16" height="20" /><circle cx="94" cy="26" r="6" /><path d="M94 32v14M94 40h6M94 44h4" /></>,
  ][type];
  return <svg className="room-ico" viewBox="0 0 120 80" aria-hidden="true">{g}</svg>;
}

/* ---------- the live drawing sheet ---------- */
function Sheet({ f, brief, today, stamped }) {
  const { palette, scope, question } = brief;
  return (
    <div className="dsheet">
      <div className="ds-draw">
        <span className="ds-code mono">{copy.sheetTitle}</span>
        <RoomIcon type={f.type} />
        <span className="ds-type disp">{copy.types[f.type]}</span>
        {palette.length > 0 && (
          <div className="ds-pal" aria-label={`Palette: ${palette.map((m) => m.name).join(', ')}`}>
            {palette.map((m) => <span key={m.code} className={'ds-sw ' + (m.cls || '')} title={m.name}>{m.img && <Img slot={m.img} alt="" sizes="40px" />}</span>)}
            <em className="mono">{palette.map((m) => m.name).join(' · ')}</em>
          </div>
        )}
        {scope && (
          <ul className="ds-scope">
            <li><b>✓</b>{scope.scope} · {scope.home}</li>
            <li className="mono">indicative {lakh(scope.low)} – {lakh(scope.high)}</li>
          </ul>
        )}
        {question && <p className="ds-q hand">Your question: “{question}”</p>}
        {!palette.length && !scope && !question && <p className="ds-hint hand">fill in the title block — your sheet draws itself here</p>}
      </div>
      <div className="ds-block">
        <div className="wide"><span>CLIENT</span><b>{f.name || '—'}</b></div>
        <div><span>LOCATION</span><b>{f.location || '—'}</b><i>{coordsFor(f.location)}</i></div>
        <div><span>BUDGET</span><b>{copy.budgets[f.budget]}</b>
          <span className="scalebar" aria-hidden="true">{[0, 1, 2].map((s) => <i key={s} className={s <= f.budget ? 'on' : ''} />)}</span>
        </div>
        <div><span>DATE</span><b>{today}</b></div>
        <div><span>PHONE</span><b>{f.phone ? `+91 ${f.phone}` : '—'}</b></div>
      </div>
      <AnimatePresence>
        {stamped && (
          <motion.div className="ds-approved" initial={{ opacity: 0, scale: 2.4, rotate: -14 }} animate={{ opacity: 1, scale: 1, rotate: -10 }} transition={{ duration: 0.4, ease: EASE }}>
            <span className="disp">APPROVED</span><span className="mono">SAMSKRITI · {today}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* the sheet folds in thirds, slides into an envelope and flies out of frame */
function Folding({ children, phase }) {
  const folded = ['fold', 'envelope', 'fly'].includes(phase);
  return (
    <motion.div className="fold-wrap" animate={phase === 'fly' ? { y: '-120vh', rotate: -8, opacity: 0 } : { y: 0 }} transition={{ duration: 0.8, ease: CURTAIN }}>
      {[0, 1, 2].map((p) => (
        <motion.div key={p} className={'fold-panel p' + p}
          animate={folded ? { rotateX: p === 0 ? -178 : p === 2 ? 178 : 0 } : { rotateX: 0 }}
          transition={{ duration: 0.55, ease: CURTAIN, delay: p === 0 ? 0.45 : 0 }}>
          <div className="fold-front"><div className="fold-inner">{children}</div></div>
          <div className="fold-back" />
        </motion.div>
      ))}
      <AnimatePresence>
        {(phase === 'envelope' || phase === 'fly') && (
          <motion.div className="envelope" initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.45, ease: EASE }}>
            <svg viewBox="0 0 200 110" preserveAspectRatio="none" aria-hidden="true">
              <path className="env-body" d="M2 2h196v106H2z" />
              <path className="env-fold" d="M2 108 L100 50 L198 108" />
              <motion.path className="env-flap" d="M2 2 L100 62 L198 2" initial={{ scaleY: -1 }} animate={{ scaleY: 1 }} transition={{ duration: 0.4, delay: 0.3 }} style={{ transformOrigin: '50% 0%' }} />
            </svg>
            <span className="mono">SAMSKRITI</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* a red-pen circle around a field we need, with a handwritten note */
const RedPen = ({ show }) => (
  <AnimatePresence>
    {show && (
      <motion.span className="redpen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} aria-hidden="true">
        <svg viewBox="0 0 200 60" preserveAspectRatio="none"><motion.path d="M100 4 C 30 2, 4 16, 6 32 C 8 52, 70 58, 150 55 C 196 52, 198 20, 170 10 C 140 1, 90 3, 60 8"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, ease: CURTAIN }} /></svg>
        <em className="hand">{copy.need}</em>
      </motion.span>
    )}
  </AnimatePresence>
);

export default function Contact() {
  const calm = useCalm();
  const brief = useBrief();
  const { palette, scope, question } = brief;
  const [f, setF] = useState({ name: '', phone: '', email: '', type: 2, location: '', budget: 0, text: '' });
  const [err, setErr] = useState({});
  const [phase, setPhase] = useState('idle'); // idle → stamp → fold → envelope → fly → done
  const [showPrev, setShowPrev] = useState(false);
  const nameRef = useRef(null), phoneRef = useRef(null), emailRef = useRef(null), doneRef = useRef(null);
  const today = new Date().toLocaleDateString('en-GB').replace(/\//g, '.');
  const set = (key) => (e) => { setF({ ...f, [key]: e.target.value }); if (err[key]) setErr({ ...err, [key]: false }); };

  const lines = [
    palette.length && { tag: 'Palette', text: palette.map((m) => m.name).join(' · '), clear: () => setBrief({ palette: [] }) },
    scope && { tag: 'Estimate', text: `${scope.scope} · ${scope.home} · indicative ${lakh(scope.low)} – ${lakh(scope.high)}`, clear: () => setBrief({ scope: null }) },
    question && { tag: 'Question', text: `“${question}”`, clear: () => setBrief({ question: '' }) },
  ].filter(Boolean);
  const fullBrief = [...lines.map((l) => `${l.tag}: ${l.text}`), f.text.trim()].filter(Boolean).join('\n');

  const submit = async (e) => {
    e?.preventDefault();
    if (phase !== 'idle') return;
    const phone = f.phone.replace(/\D/g, '').replace(/^(91|0)(?=\d{10}$)/, '');
    const bad = { name: !f.name.trim(), phone: !/^[6-9]\d{9}$/.test(phone), email: !!f.email.trim() && !/^\S+@\S+\.\S+$/.test(f.email.trim()) };
    setErr(bad);
    if (bad.name || bad.phone || bad.email) { (bad.name ? nameRef : bad.phone ? phoneRef : emailRef).current.focus(); return; }
    setShowPrev(true);
    const sending = submitEnquiry({
      name: f.name.trim(), phone: `+91 ${phone}`, email: f.email.trim(), type: copy.types[f.type], location: f.location.trim(), budget: copy.budgets[f.budget],
      brief: fullBrief, palette: palette.map((m) => m.name), scope, question, date: today,
    });
    if (!calm) {
      setPhase('stamp'); await sleep(750);
      setPhase('fold'); await sleep(1100);
      setPhase('envelope'); await sleep(900);
    }
    try { await sending; } catch { setPhase('idle'); setErr({ send: true }); return; }
    if (!calm) { setPhase('fly'); await sleep(750); }
    setPhase('done');
    lumenCtl.set({ flashAt: performance.now() }); // Lumen, parked above, flashes once
  };
  useEffect(() => { if (phase === 'done') doneRef.current?.focus(); }, [phase]);
  const reset = () => { setPhase('idle'); setF({ name: '', phone: '', email: '', type: 2, location: '', budget: 0, text: '' }); setBrief({ palette: [], scope: null, question: '' }); };

  return (
    <section id="contact" className="sheet sheet-lav sheet-in" aria-label="Start a project">
      <div className="wrap frame">
        <div className="zones top" aria-hidden="true">{[1, 2, 3, 4, 5, 6, 7, 8].map((n) => <span key={n}>{n}</span>)}</div>
        <div className="zones side" aria-hidden="true">{['A', 'B', 'C', 'D', 'E'].map((n) => <span key={n}>{n}</span>)}</div>
        <div className="contact-head">
          <div className="contact-side">
            <span className="label">{copy.eyebrow}</span>
            <MaskLines className="disp h2" lines={copy.lines} />
          </div>
          <div className="contact-side">
            <p className="lead" style={{ margin: 0, color: 'var(--muted-l)' }}>{copy.lead}</p>
            <address className="c-address">{business.address.map((l) => <span key={l}>{l}</span>)}</address>
            <div className="links">
              <a href={business.tel}>{copy.call} · {business.phone}</a>
              <a href={business.whatsapp} target="_blank" rel="noopener noreferrer">{copy.whatsapp} →</a>
              <a href={business.directions} target="_blank" rel="noopener noreferrer">{copy.directions} →</a>
            </div>
          </div>
        </div>
        <div className="contact">
          <div style={{ position: 'relative' }}>
            <form className="tform" onSubmit={submit} noValidate>
              <label className="odd fld-wrap"><span className="tlbl">Client name *</span>
                <input ref={nameRef} className="cellf" type="text" name="name" value={f.name} onChange={set('name')} placeholder="Your full name" autoComplete="name" aria-invalid={!!err.name} aria-describedby={err.name ? 'err-name' : undefined} />
                <RedPen show={err.name} />{err.name && <span id="err-name" className="sr-only">Please add your name</span>}
              </label>
              <label className="fld-wrap"><span className="tlbl">Phone *</span>
                <span className="phone-in"><span className="cc" aria-hidden="true">+91</span>
                  <input ref={phoneRef} className="cellf" type="tel" inputMode="tel" name="phone" value={f.phone} onChange={set('phone')} placeholder="98xxx xxxxx" autoComplete="tel-national" aria-invalid={!!err.phone} aria-describedby={err.phone ? 'err-phone' : undefined} /></span>
                <RedPen show={err.phone} />{err.phone && <span id="err-phone" className="sr-only">Please add a 10-digit mobile number</span>}
              </label>
              <label className="odd fld-wrap"><span className="tlbl">Email</span>
                <input ref={emailRef} className="cellf" type="email" name="email" value={f.email} onChange={set('email')} placeholder="you@email.com (optional)" autoComplete="email" aria-invalid={!!err.email} aria-describedby={err.email ? 'err-email' : undefined} />
                <RedPen show={err.email} />{err.email && <span id="err-email" className="sr-only">Please check the email address</span>}
              </label>
              <label><span className="tlbl">Location / area</span><input className="cellf" type="text" name="location" value={f.location} onChange={set('location')} placeholder="e.g. Whitefield" autoComplete="address-level3" /></label>
              <div className="span">
                <span className="tlbl" id="type-lbl">Home type</span>
                <div className="chips" role="group" aria-labelledby="type-lbl">{copy.types.map((x, i) => <button type="button" key={x} className={i === f.type ? 'on' : ''} aria-pressed={i === f.type} onClick={() => setF({ ...f, type: i })}>{x}</button>)}</div>
              </div>
              <label className="odd"><span className="tlbl">Budget</span>
                <select className="cellf" name="budget" value={f.budget} onChange={(e) => setF({ ...f, budget: +e.target.value })}>{copy.budgets.map((b, i) => <option key={b} value={i}>{b}</option>)}</select>
              </label>
              <div className="last"><span className="tlbl">Date</span><span className="mono">{today}</span></div>
              <div className="span brief-cell last">
                <label className="tlbl" htmlFor="brief-text">Message</label>
                {lines.length > 0 && (
                  <ul className="brief-lines" aria-label="Added from the page">
                    {lines.map((l) => (
                      <li key={l.tag}><span className="mono">{l.tag}</span><span className="bl-text">{l.text}</span>
                        <button type="button" onClick={l.clear} aria-label={`Remove ${l.tag.toLowerCase()} from the brief`}>✕</button></li>
                    ))}
                  </ul>
                )}
                <textarea id="brief-text" className="cellf" rows="3" name="brief-notes" value={f.text} onChange={set('text')} placeholder="Tell us about your home and what you’d like to do…" />
                <input type="hidden" name="brief" value={fullBrief} />
                <input type="hidden" name="palette" value={palette.map((m) => m.name).join(' · ')} />
                <input type="hidden" name="scope" value={scope ? JSON.stringify(scope) : ''} />
                <input type="hidden" name="question" value={question} />
              </div>

            </form>
            {err.send && <p className="note" role="alert">the sheet didn’t reach us — please try the stamp again</p>}
            <div className="form-foot" style={{ position: 'relative' }}>
              <button type="button" className="stamp-btn" aria-label="Send — approve and send your sheet" onClick={submit} disabled={phase !== 'idle' && phase !== 'done'} data-cursor="SEND">
                <svg width="168" height="168" viewBox="0 0 200 200" aria-hidden="true">
                  <defs><path id="sc" d="M100,100 m-76,0 a76,76 0 1,1 152,0 a76,76 0 1,1 -152,0" /></defs>
                  <text fill="#2A1D52" fontFamily="IBM Plex Mono, monospace" fontSize="15" letterSpacing="4.6"><textPath href="#sc">APPROVE · SIGN · SEND · APPROVE · SIGN · </textPath></text>
                </svg>
                <span className="core">SEND ↗</span>
              </button>
            </div>
          </div>
          <div className={'preview' + (showPrev ? ' open' : '')}>
            <button type="button" className="prev-toggle mono" aria-expanded={showPrev} onClick={() => setShowPrev(!showPrev)}>{copy.preview} {showPrev ? '▴' : '▾'}</button>
            <span className="lumen-pt contact-pt" data-lumen="contact" data-lumen-state="lit" data-lumen-scale=".8" data-lumen-beam=".8" data-lumen-mobile-beam=".6" data-lumen-bg="light" />
            <div className="prev-body" aria-live="off">
              <span className="label prev-lbl">{copy.preview}</span>
              {phase === 'done' ? (
                <motion.div ref={doneRef} tabIndex={-1} className="received" role="status" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE }}>
                  <span className="disp">Received.</span>
                  <p>{copy.received}</p>
                  <button type="button" className="btn btn-ink" onClick={reset}>Start another sheet</button>
                </motion.div>
              ) : phase === 'idle' || phase === 'stamp' ? (
                <Sheet f={f} brief={brief} today={today} stamped={phase === 'stamp'} />
              ) : (
                <Folding phase={phase}><Sheet f={f} brief={brief} today={today} stamped /></Folding>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

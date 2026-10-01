import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { faqs, faqCats, faqCopy as copy } from '../data.js';
import { MaskLines, EASE, Arrow, scrollToY } from '../components/ui.jsx';
import { useCalm } from '../store/calm.js';
import { setBrief } from '../store/brief.js';

/* ---------- fuzzy matching: every query word must match a word in the RFI (prefix, substring or one typo) ---------- */
const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const words = (s) => norm(s).match(/[a-z0-9]+/g) || [];
function near(a, b) { // edit distance ≤ 1
  if (Math.abs(a.length - b.length) > 1) return false;
  let i = 0, j = 0, e = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) { i++; j++; continue; }
    if (++e > 1) return false;
    if (a.length > b.length) i++; else if (b.length > a.length) j++; else { i++; j++; }
  }
  return e + (a.length - i) + (b.length - j) <= 1;
}
const STOP = new Set(['a', 'an', 'the', 'do', 'does', 'is', 'are', 'i', 'my', 'you', 'your', 'to', 'of', 'it', 'can', 'how', 'what', 'and', 'in', 'on', 'for']);
const hit = (qw, w) => w.startsWith(qw) || (qw.length >= 4 && (w.includes(qw) || near(qw, w)));
function search(query) {
  const qs = words(query).filter((w) => w.length > 1 && !STOP.has(w));
  if (!qs.length) return { list: faqs.map((f, i) => ({ ...f, i })), terms: [] };
  const list = faqs.map((f, i) => ({ ...f, i })).filter((f) => {
    const ws = words(`${f.q} ${f.a} ${f.cat}`);
    return qs.every((q) => ws.some((w) => hit(q, w)));
  });
  return { list, terms: qs };
}
/* wrap matched words in <mark> */
function Hl({ text, terms }) {
  if (!terms.length) return text;
  return text.split(/(\s+)/).map((tok, k) => {
    const w = words(tok)[0];
    return w && terms.some((q) => hit(q, w)) ? <mark key={k}>{tok}</mark> : tok;
  });
}

/* ---------- the answer types itself in mono, then the designer signs, then ANSWERED slams ---------- */
function Answer({ text, terms, calm, onDone }) {
  const [n, setN] = useState(calm ? text.length : 0);
  const done = n >= text.length;
  useEffect(() => {
    if (calm) { setN(text.length); return; }
    const t0 = performance.now();
    let raf;
    const tick = () => { const k = Math.min(text.length, Math.floor((performance.now() - t0) / 12)); setN(k); if (k < text.length) raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text, calm]);
  useEffect(() => { if (done) onDone?.(); }, [done]);
  return (
    <>
      <p className="typed">
        <span className="sr-only">{text}</span>
        <span aria-hidden="true">{done ? <Hl text={text} terms={terms} /> : text.slice(0, n)}</span>
        {!done && <i className="caret" aria-hidden="true" />}
      </p>
      <span className={'rfi-sign' + (done ? ' on' : '')}>
        <svg viewBox="0 0 220 44" aria-hidden="true"><text x="2" y="34">{copy.signer}</text></svg>
        <span className="sig">SIGNED — {copy.signer.toUpperCase()} · {copy.signerRole.toUpperCase()}</span>
      </span>
    </>
  );
}

export default function Faq() {
  const calm = useCalm();
  const [open, setOpen] = useState(0);
  const [signed, setSigned] = useState(-1);
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('All');
  const input = useRef(null);
  const { list, terms } = useMemo(() => search(q), [q]);
  const shown = list.filter((f) => cat === 'All' || f.cat === cat);

  // the first match opens as you type
  useEffect(() => { if (terms.length && shown[0] && shown[0].i !== open) setOpen(shown[0].i); }, [q]);

  const send = () => {
    setBrief({ question: q.trim() });
    const el = document.getElementById('contact');
    if (el) scrollToY(el.getBoundingClientRect().top + window.scrollY - 40);
  };

  return (
    <section id="faq" className="sheet sheet-night sheet-in" aria-label="Frequently asked questions">
      <div className="wrap faq">
        <div className="faq-side">
          <span className="label">{copy.label}</span>
          <MaskLines className="disp h2" lines={copy.lines} />
          <p className="lead" style={{ margin: 0, color: 'var(--muted-d)' }}>{copy.lead}</p>
        </div>
        <div className="rfis-wrap">
          <form className="rfi-entry" role="search" onSubmit={(e) => { e.preventDefault(); if (!shown.length && q.trim()) send(); }}>
            <label className="rfi-code" htmlFor="rfi-q">Ask</label>
            <input ref={input} id="rfi-q" className="rfi-line" type="search" value={q} onChange={(e) => setQ(e.target.value)}
              placeholder={copy.search} autoComplete="off" aria-describedby="rfi-count" />
            {q && <button type="button" className="rfi-clear" onClick={() => { setQ(''); input.current.focus(); }} aria-label="Clear the question">✕</button>}
          </form>
          <div className="rfi-cats" role="group" aria-label="Filter by category">
            {['All', ...faqCats].map((c) => <button key={c} type="button" className={c === cat ? 'on' : ''} aria-pressed={c === cat} onClick={() => setCat(c)}>{c}</button>)}
          </div>
          <p id="rfi-count" className="sr-only" aria-live="polite">{shown.length ? `${shown.length} answers match` : 'No answer yet — you can send the question to the studio'}</p>
          <div className="rfis">
            {shown.map((f) => {
              const isOpen = f.i === open;
              return (
                <div key={f.q} className={'rfi' + (isOpen ? ' open' : '')}>
                  <button type="button" onClick={() => setOpen(isOpen ? -1 : f.i)} aria-expanded={isOpen} aria-controls={`rfi-${f.i}`}>
                    <span className="q"><Hl text={f.q} terms={terms} /></span>
                    <span className="st">{isOpen ? 'OPEN ▲' : 'VIEW ▼'}</span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div id={`rfi-${f.i}`} className="ans" initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} transition={{ duration: 0.45, ease: EASE }}>
                        <div className="ans-in">
                          <span className="rfi-cat mono">{f.cat}</span>
                          <Answer key={`${f.i}-${terms.join()}`} text={f.a} terms={terms} calm={calm} onDone={() => setSigned(f.i)} />
                          {signed === f.i && (
                            <motion.span className="stamp" initial={{ opacity: 0, scale: 2.2, rotate: -12 }} animate={{ opacity: 1, scale: 1, rotate: -12 }}
                              transition={{ duration: 0.4, ease: EASE, delay: calm ? 0 : 0.9 }}>ANSWERED</motion.span>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
            {!shown.length && (
              <div className="rfi-none">
                <span className="note">{copy.none}</span>
                <span className="mono">“{q.trim()}”</span>
                <button type="button" className="btn btn-coral" onClick={send}>{copy.send} <Arrow /></button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

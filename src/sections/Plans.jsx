import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { homeTypes, scopes, pricing, estimate, lakh } from '../data.js';
import { SecHead, Arrow, Odometer, scrollToY } from '../components/ui.jsx';
import { setBrief } from '../store/brief.js';

/* a row of choices that behaves like radio buttons (arrow keys move, one is always chosen) */
function Choice({ label, items, value, onChange }) {
  const key = (e, i) => {
    const d = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const n = items[(i + d + items.length) % items.length];
    onChange(n.key);
    e.currentTarget.parentElement.children[(i + d + items.length) % items.length].focus();
  };
  return (
    <div className="cfg-opts">
      <span className="label" id={`lbl-${label}`}>{label}</span>
      <div className="seg-group" role="radiogroup" aria-labelledby={`lbl-${label}`}>
        {items.map((x, i) => (
          <button key={x.key} type="button" role="radio" aria-checked={x.key === value} tabIndex={x.key === value ? 0 : -1}
            onClick={() => onChange(x.key)} onKeyDown={(e) => key(e, i)}>{x.label}</button>
        ))}
      </div>
    </div>
  );
}

/* ---------- Your home + what you need → an indicative range, then on to Contact ---------- */
function Configurator({ home, setHome, scope, setScope, est }) {
  const send = () => {
    setBrief({ scope: { home: est.home, scope: est.scope, low: est.low, high: est.high } });
    const el = document.getElementById('contact');
    if (el) scrollToY(el.getBoundingClientRect().top + window.scrollY - 40);
  };
  return (
    <div className="cfg">
      <Choice label="Your home" items={homeTypes} value={home} onChange={setHome} />
      <Choice label="What you need" items={scopes} value={scope} onChange={setScope} />
      <div className="cfg-out">
        <span className="label">{pricing.disclaimer}</span>
        <div className="price-odo disp" aria-hidden="true">
          <Odometer value={lakh(est.low)} /><span className="dash">–</span><Odometer value={lakh(est.high)} />
        </div>
        <p className="sr-only" aria-live="polite">Indicative estimate for {est.scope.toLowerCase()}, {est.home}: {lakh(est.low)} to {lakh(est.high)}. Final quote after a site visit.</p>
        <button type="button" className="btn btn-coral" onClick={send}>{pricing.send} <Arrow /></button>
      </div>
    </div>
  );
}

export default function Plans() {
  const [home, setHome] = useState('3bhk');
  const [scope, setScope] = useState('full');
  const est = useMemo(() => estimate({ home, scope }), [home, scope]);
  return (
    <section id="fees" className="sheet sheet-plum sheet-in" aria-label="Fees">
      <div className="wrap">
        <SecHead label={pricing.eyebrow} lines={pricing.lines} right={<p className="lead">{pricing.lead}</p>} />
        <Configurator home={home} setHome={setHome} scope={scope} setScope={setScope} est={est} />
        {/* the same rules as a table: starting prices for every home and scope */}
        <div className="sched" role="table" aria-label={pricing.tableTitle}>
          <div className="col labels" role="rowgroup">
            <div className="hd" role="row"><span className="mono">{pricing.tableTitle}</span><b>Home</b><span /></div>
            {homeTypes.map((h) => <div className={'cell' + (h.key === home ? ' row-on' : '')} key={h.key} role="rowheader">{h.label}</div>)}
          </div>
          {scopes.map((s) => (
            <div key={s.key} className={'col' + (s.key === scope ? ' is-rec' : '')} role="rowgroup">
              <div className="hd" role="row">
                <span className="mono">from</span>
                <b>{s.label}</b>
                {s.key === scope && <motion.div key={scope} className="stampbig rec-stamp" initial={{ opacity: 0, scale: 1.6, rotate: -12 }} animate={{ opacity: 1, scale: 1, rotate: -8 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}>YOUR PICK</motion.div>}
              </div>
              {homeTypes.map((h) => {
                const e = estimate({ home: h.key, scope: s.key });
                return <div className={'cell' + (h.key === home && s.key === scope ? ' on' : '') + (h.key === home ? ' row-on' : '')} key={h.key} role="cell"><i>{h.label}</i><span>{lakh(e.low)}</span></div>;
              })}
            </div>
          ))}
        </div>
        <p className="note" style={{ marginTop: 18 }}>{pricing.note}</p>
      </div>
    </section>
  );
}

// Debug badge — only with ?debug in the URL. Shows what decided the hero, and live health numbers.
import { useEffect, useState } from 'react';
import { heroGate, debugInfo } from '../three/store.js';
import { useCalm } from '../store/calm.js';

export const debugOn = () => new URLSearchParams(location.search).has('debug'); // never by default, not even in dev

export function resetSettings() {
  try {
    Object.keys(localStorage).filter((k) => k.startsWith('novara-')).forEach((k) => localStorage.removeItem(k));
    sessionStorage.clear();
  } catch { /* ignore */ }
  location.reload();
}

export default function DebugBadge() {
  const calm = useCalm();
  const [s, setS] = useState({ fps: 0 });
  useEffect(() => {
    let n = 0, t0 = performance.now(), raf;
    const tick = (t) => {
      n++;
      if (t - t0 >= 1000) {
        setS({ fps: Math.round((n * 1000) / (t - t0)), hero: heroGate.state, lenis: debugInfo.lenis, webgl: debugInfo.webgl, canvases: document.querySelectorAll('canvas').length, lost: debugInfo.contextLost, commits: debugInfo.commits });
        n = 0; t0 = t;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <div className="debug-badge" role="status">
      <b>Samskriti debug</b>
      <span>hero: {s.hero ? `${s.hero.mode} — ${s.hero.reason}` : 'deciding…'}</span>
      <span>calm: {calm ? 'on' : 'off'} · lenis: {s.lenis} · webgl: {s.webgl} ({s.canvases} canvas) · lost: {s.lost}</span>
      <span>fps: {s.fps} · react commits: {s.commits}</span>
      <button type="button" onClick={resetSettings}>Reset settings</button>
    </div>
  );
}

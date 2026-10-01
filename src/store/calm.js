// Calm mode: switches off Lumen's travel, cursor effects and all non-essential motion.
// Defaults to the OS "reduce motion" setting until the visitor chooses; the choice is remembered.
import { useSyncExternalStore } from 'react';

const KEY = 'novara-calm';
const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
const stored = () => { try { const v = localStorage.getItem(KEY); return v == null ? null : v === '1'; } catch { return null; } };

let calm = stored() ?? mq.matches;
const subs = new Set();
const apply = () => { document.documentElement.classList.toggle('calm', calm); subs.forEach((f) => f()); };

export const getCalm = () => calm;
export function setCalm(v) {
  calm = v;
  try { localStorage.setItem(KEY, v ? '1' : '0'); } catch { /* private mode: still works for this visit */ }
  apply();
}
export const subscribeCalm = (f) => { subs.add(f); return () => subs.delete(f); };
export const useCalm = () => useSyncExternalStore(subscribeCalm, getCalm);

// follow the OS setting for as long as the visitor hasn't picked
mq.addEventListener('change', () => { if (stored() == null) { calm = mq.matches; apply(); } });
apply();

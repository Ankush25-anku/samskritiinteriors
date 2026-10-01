// One small shared store for what the visitor builds on the way down the page:
// a material palette (Materials), a scope (Fees) and a question (FAQ). Contact reads all three.
import { useSyncExternalStore } from 'react';

let state = { palette: [], scope: null, question: '' };
const subs = new Set();

export const getBrief = () => state;
export function setBrief(patch) {
  state = { ...state, ...(typeof patch === 'function' ? patch(state) : patch) };
  subs.forEach((f) => f());
}
export const subscribeBrief = (f) => { subs.add(f); return () => subs.delete(f); };
export const useBrief = () => useSyncExternalStore(subscribeBrief, getBrief);

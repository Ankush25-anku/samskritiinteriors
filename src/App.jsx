import { lazy, Profiler, Suspense, useEffect, useState } from 'react';
import { MotionConfig, MotionGlobalConfig } from 'framer-motion';
import Lenis from 'lenis';
import { Preloader, Nav, Crosshair, TouchPool } from './components/Chrome.jsx';
import Lumen from './components/Lumen.jsx';
import DebugBadge, { debugOn } from './components/Debug.jsx';
import { smooth } from './components/ui.jsx';
import { useCalm } from './store/calm.js';
import { debugInfo } from './three/store.js';
import Hero from './sections/Hero.jsx';
import Manifesto from './sections/Manifesto.jsx';
// Sections below the Manifesto live in their own chunk (see sections/Rest.jsx) so the hero paints sooner.
const Rest = lazy(() => import('./sections/Rest.jsx'));
const Footer = lazy(() => import('./sections/Rest.jsx').then((m) => ({ default: m.Footer })));

/* ONE scroll engine. A module-level guard means React StrictMode's double-mount can never leave two instances alive. */
function startLenis() {
  if (smooth.lenis) return smooth.lenis;
  const lenis = new Lenis({ lerp: 0.09, smoothWheel: true, syncTouch: false, wheelMultiplier: 1, anchors: { offset: -20 } });
  smooth.lenis = lenis;
  debugInfo.lenis++;
  let raf;
  const loop = (t) => { lenis.raf(t); raf = requestAnimationFrame(loop); };
  raf = requestAnimationFrame(loop);
  // Lenis owns the scroll position, which cancels the browser's own scroll-to-focus: do it for keyboard users here
  const onFocus = (e) => {
    const el = e.target;
    if (!(el instanceof Element) || el.closest('.menu')) return;
    // touch screens: the browser already scrolls a focused field above the on-screen keyboard — don't fight it
    if (el.matches('input, textarea, select') && window.matchMedia('(hover: none)').matches) return;
    const r = el.getBoundingClientRect();
    if (r.top < 90 || r.bottom > window.innerHeight - 20) lenis.scrollTo(el, { offset: -window.innerHeight * 0.3, duration: 0.7 });
  };
  document.addEventListener('focusin', onFocus);
  if (!location.hash) lenis.scrollTo(0, { immediate: true });
  lenis.__stop = () => { cancelAnimationFrame(raf); document.removeEventListener('focusin', onFocus); lenis.destroy(); debugInfo.lenis--; smooth.lenis = null; };
  return lenis;
}

/* Every section that is off screen pauses all of its CSS animations (marquees, swings, foils, blinking dots…). */
function usePauseOffscreen() {
  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => e.target.classList.toggle('offscreen', !e.isIntersecting)), { rootMargin: '120px 0px' });
    const seen = new WeakSet();
    const watch = () => document.querySelectorAll('main > section, footer').forEach((s) => { if (!seen.has(s)) { seen.add(s); io.observe(s); } });
    watch();
    const mo = new MutationObserver(watch);
    mo.observe(document.getElementById('root'), { childList: true, subtree: true });
    return () => { io.disconnect(); mo.disconnect(); };
  }, []);
}

export default function App() {
  const [ready, setReady] = useState(false);
  const calm = useCalm();
  // calm mode: every framer animation jumps straight to its end state (calm defaults to the OS reduce-motion setting)
  MotionGlobalConfig.skipAnimations = calm;

  // Keep the page hidden under the preloader until the web fonts are in, so nothing reflows (CLS 0).
  useEffect(() => { document.fonts.ready.then(() => document.documentElement.classList.remove('fonts-loading')); }, []);

  useEffect(() => {
    // touch screens scroll natively — the browser's own scrolling is smoother there than any JS smoothing;
    // Lenis only runs for a mouse wheel / trackpad
    if (calm || window.matchMedia('(hover: none), (pointer: coarse)').matches) return;
    const lenis = startLenis();
    return () => lenis.__stop();
  }, [calm]);

  usePauseOffscreen();

  // rotating a phone or tablet: some browsers report the new size late, so every measurement runs again once it settles
  useEffect(() => {
    const again = () => setTimeout(() => window.dispatchEvent(new Event('resize')), 350);
    const so = screen.orientation;
    so?.addEventListener?.('change', again);
    window.addEventListener('orientationchange', again);
    return () => { so?.removeEventListener?.('change', again); window.removeEventListener('orientationchange', again); };
  }, []);

  return (
    <Profiler id="novara" onRender={() => { debugInfo.commits++; }}>
      <MotionConfig reducedMotion="never">
        <Preloader onDone={() => setReady(true)} />
        <Nav />
        <Lumen ready={ready} />
        <Crosshair />
        <TouchPool />
        <main>
          <Hero ready={ready} />
          <Manifesto />
          <Suspense fallback={<div className="rest-pending" aria-busy="true" />}>
            <Rest />
          </Suspense>
        </main>
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
        {debugOn() && <DebugBadge />}
      </MotionConfig>
    </Profiler>
  );
}

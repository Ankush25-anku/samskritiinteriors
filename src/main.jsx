import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
// Display: Fraunces (all axes, for optical size and SOFT) + its italic for the one accent word per headline.
// Body / UI: Manrope. Small labels only: IBM Plex Mono.
import '@fontsource-variable/fraunces/full.css';
import '@fontsource-variable/fraunces/full-italic.css';
import '@fontsource-variable/manrope/wght.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import './styles.css';

// Every load starts at the top of the storyboard (unless a #section link was used): the browser must not
// restore a mid-page scroll position, or each reload would open on a different scene.
try { history.scrollRestoration = 'manual'; } catch { /* old browsers */ }
if (!location.hash) window.scrollTo(0, 0);

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

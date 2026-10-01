import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base: './' keeps every asset path relative, so the build runs from any folder or host.
// The lazy 3D hero is split in two: three.js core (no dependencies of its own) and the stage with react-three + effects,
// so no chunk is huge and nothing 3D ever lands in the main bundle.
export default defineConfig({
  base: './',
  plugins: [react()],
  server: { port: 5173, strictPort: true },
  preview: { port: 4173, strictPort: true },
  build: {
    assetsInlineLimit: 0,
    chunkSizeWarningLimit: 900,
    rolldownOptions: {
      output: {
        codeSplitting: {
          // three core has no dependencies, so keep the group from pulling shared modules (React…) out of the entry
          includeDependenciesRecursively: false,
          groups: [
            { name: 'three-core', test: /node_modules[\/]three[\/]build[\/]/ },
          ],
        },
      },
    },
  },
});

/**
 * Configuration utilisée UNIQUEMENT par le test de fumée (`scripts/smoke.mjs`).
 * Elle produit un bundle classique (IIFE, sans `type="module"`), seul format
 * que jsdom sait exécuter. Elle n'intervient jamais dans le build de production.
 */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  root: fileURLToPath(new URL('..', import.meta.url)),
  /* Build de développement de React : `act()` n'existe que dans celui-ci,
     et c'est lui qui signale les erreurs de rendu utiles au test. */
  mode: 'development',
  define: { 'process.env.NODE_ENV': JSON.stringify('development') },
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('../src', import.meta.url)) },
  },
  build: {
    outDir: fileURLToPath(new URL('../dist-smoke', import.meta.url)),
    emptyOutDir: true,
    target: 'es2020',
    minify: false,
    rollupOptions: {
      input: fileURLToPath(new URL('./smoke-entry.tsx', import.meta.url)),
      output: {
        format: 'iife',
        inlineDynamicImports: true,
        entryFileNames: 'app.js',
        assetFileNames: 'app[extname]',
      },
    },
  },
});

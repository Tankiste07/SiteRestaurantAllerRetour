/**
 * Bundle IIFE du tableau de bord pour le test de fumée (jsdom n'exécute pas
 * les modules ESM). N'intervient jamais dans `npm run dashboard`.
 */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  root: fileURLToPath(new URL('..', import.meta.url)),
  mode: 'development',
  define: { 'process.env.NODE_ENV': JSON.stringify('development') },
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('../src', import.meta.url)) },
  },
  build: {
    outDir: fileURLToPath(new URL('../dist-dashboard-smoke', import.meta.url)),
    emptyOutDir: true,
    target: 'es2020',
    minify: false,
    rollupOptions: {
      input: fileURLToPath(new URL('../src/dashboard/main.tsx', import.meta.url)),
      output: {
        format: 'iife',
        inlineDynamicImports: true,
        entryFileNames: 'dashboard-app.js',
        assetFileNames: 'dashboard-app[extname]',
      },
    },
  },
});

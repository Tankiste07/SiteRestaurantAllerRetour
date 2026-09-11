/**
 * Configuration Vite du TABLEAU DE BORD uniquement.
 * Entièrement séparée de `vite.config.ts` (le site public) : `dashboard.html`
 * n'est jamais inclus dans `npm run build`, et ce fichier n'est utilisé que
 * par `npm run dashboard` (serveur de développement local).
 */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5174,
    strictPort: true,
    open: '/dashboard.html',
  },
});

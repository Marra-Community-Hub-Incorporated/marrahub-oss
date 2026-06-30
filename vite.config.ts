import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

import { cloudflare } from "@cloudflare/vite-plugin";

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react(), tailwindcss(), cloudflare()],
  base: '/',
  build: {
    rollupOptions: {
      output: {
        // Keep the React/router runtime in its own long-lived vendor chunk so
        // app-code changes don't bust its cache. Per-page splitting comes from
        // the lazy routes in routes.ts.
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router'],
        },
      },
    },
  },
}));
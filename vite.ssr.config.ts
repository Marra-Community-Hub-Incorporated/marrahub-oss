import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * A second, deliberately minimal build that turns src/entry-server.tsx into a
 * plain Node ESM bundle for the prerender pass in scripts/seo-build.mjs.
 *
 * It leaves out the Cloudflare and Tailwind plugins on purpose: this bundle
 * never runs in the Worker and never ships to a browser, so it needs no Worker
 * runtime shims and no stylesheet — the client build owns the CSS. Output goes
 * to dist/ssr, which sits outside dist/client and so is never served.
 */
export default defineConfig({
  plugins: [react()],
  build: {
    ssr: 'src/entry-server.tsx',
    outDir: 'dist/ssr',
    emptyOutDir: true,
    // The prerender pass imports this bundle directly; nothing downstream reads
    // a manifest or cares about file hashes, so keep the name predictable.
    rollupOptions: {
      output: { entryFileNames: 'entry-server.js', format: 'esm' },
    },
    // Bundle the app but leave node_modules external — Node can resolve those
    // itself and inlining React into the bundle risks duplicate copies.
    minify: false,
  },
  ssr: { noExternal: false },
});

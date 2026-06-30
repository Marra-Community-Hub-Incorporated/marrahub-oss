# design-sync notes — marrahub-website

Repo-specific gotchas for future syncs. One bullet per quirk.

## Shape & build
- This is a **Vite app**, not a component library — no `module`/`main`/`exports`, no `.d.ts` build. The 7 DS components are bundled via a **synthetic barrel entry** at `.design-sync/ds-entry.ts` (`cfg.entry`), which re-exports them. Each is also pinned in `cfg.componentSrcMap` so discovery finds them (there are no `.d.ts` exports to auto-detect). `Seo` is intentionally not included (non-visual `react-helmet`-style head manager). **If a component is added/removed, update both `ds-entry.ts` and `componentSrcMap`.**
- **Prop contracts are hand-written** in `cfg.dtsPropsFor` (one body per component), because there is no built `.d.ts` and the extractor can't read `.tsx` source through the barrel. **If a component's props change, update its `dtsPropsFor` entry** — this is the contract the design agent codes against. (A throwaway symlink `node_modules/@types/react` → the staged copy was created during the run for an earlier extraction attempt; it is no longer load-bearing now that props come from `dtsPropsFor`. Harmless, gitignored.)
- **Tailwind v4** (`@tailwindcss/vite`). The real styling is the compiled CSS, which only exists after a build. `cfg.cssEntry` points at `.design-sync/compiled.css`, a **copy of the vite build output** (`dist/assets/index-*.css`). On re-sync you MUST `npx vite build` and re-copy that file (the hashed name changes each build) before running the converter.
- Header uses `import.meta.env.BASE_URL` and `motion/react`; both render fine in the preview bundle (verified — Header renders cleanly with the router provider).

## Provider
- `Button`, `Header`, `Footer`, and `CTABanner` (via `Button`) use react-router `<Link>` / `useLocation`. Previews are wrapped in `PreviewRouter` (a `MemoryRouter` shim in `.design-sync/ds-extras.tsx`, merged via `extraEntries`). Without it, those cards throw "useContext … Router".

## Fonts (RESOLVED — shipping brand fonts)
- Brand fonts **Inter** (sans) and **Ibarra Real Nova** (serif) are referenced by `theme.css` but **not shipped by the repo** (`fonts.css` is empty, no `<link>` in `index.html`; the live site falls back to Georgia/system).
- The sync ships them via a **remote `@import`** (Google Fonts) in `.design-sync/brand-fonts.css` (committed). The cssEntry file `.design-sync/compiled.css` is built as: `cat .design-sync/brand-fonts.css dist/assets/index-*.css > .design-sync/compiled.css` — the `@import` must stay first. This only affects the design system, NOT the live website source.
- `cfg.runtimeFontPrefixes` is kept as a harmless backstop (won't fire now that the fonts ship).

## Re-sync risks
- `cfg.cssEntry` depends on a freshly rebuilt + recopied `.design-sync/compiled.css` — stale copy = stale utilities/tokens in previews.
- Font decision above is unresolved; if fonts get wired later, update this file.

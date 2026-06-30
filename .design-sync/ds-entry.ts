// Synthetic library entry for design-sync.
// marrahub-website is a Vite app, not a published component library, so there is
// no dist entry to bundle. This barrel re-exports the design-system components so
// the converter can build them into window.MarraHub.*. Keep in sync with
// componentSrcMap in .design-sync/config.json.
export { Button } from '../src/app/components/Button';
export { CTABanner } from '../src/app/components/CTABanner';
export { Footer } from '../src/app/components/Footer';
export { Header } from '../src/app/components/Header';
export { ImpactCard } from '../src/app/components/ImpactCard';
export { ProgramCard } from '../src/app/components/ProgramCard';
export { SectionHeader } from '../src/app/components/SectionHeader';

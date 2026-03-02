import { Button } from '../components/Button';

export function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-background px-4 py-20">
      <div className="max-w-2xl text-center">
        <p className="text-sm font-semibold tracking-[0.2em] uppercase text-secondary mb-4">404</p>
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Page not found</h1>
        <p className="text-lg text-muted-foreground mb-8">
          This page is not available. Head back to MARRA to explore our community hub, programs,
          and contact information.
        </p>
        <Button href="/" size="lg">
          Back to Home
        </Button>
      </div>
    </div>
  );
}

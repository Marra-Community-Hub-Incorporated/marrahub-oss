import React from 'react';
import { MemoryRouter } from 'react-router';

// Preview-only wrapper. Button, Header, Footer (and CTABanner via Button) render
// react-router <Link> / useLocation, which require a Router context. Every preview
// card is wrapped in this provider (cfg.provider.component = "PreviewRouter") so
// those components render instead of throwing "useContext ... Router".
export function PreviewRouter({ children }: { children?: React.ReactNode }) {
  return <MemoryRouter initialEntries={['/']}>{children}</MemoryRouter>;
}

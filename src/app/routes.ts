import { createBrowserRouter } from 'react-router';
import { Layout } from './Layout';

// Layout (header/footer) stays eager since it renders on every route.
// Each page is code-split so visitors only download the page they navigate to.
export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, lazy: async () => ({ Component: (await import('./pages/Home')).Home }) },
      { path: 'about', lazy: async () => ({ Component: (await import('./pages/About')).About }) },
      { path: 'programs', lazy: async () => ({ Component: (await import('./pages/Programs')).Programs }) },
      { path: 'impact', lazy: async () => ({ Component: (await import('./pages/Impact')).Impact }) },
      { path: 'governance', lazy: async () => ({ Component: (await import('./pages/Governance')).Governance }) },
      { path: 'contact', lazy: async () => ({ Component: (await import('./pages/Contact')).Contact }) },
      {
        path: 'volunteer',
        lazy: async () => ({
          Component: (await import('./features/volunteer-agreement')).VolunteerAgreementPage,
        }),
      },
      { path: '*', lazy: async () => ({ Component: (await import('./pages/NotFound')).NotFound }) },
    ],
  },
]);

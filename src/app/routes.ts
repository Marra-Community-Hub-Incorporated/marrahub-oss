import { createBrowserRouter, redirect } from 'react-router';
import { Layout } from './Layout';
import { featureFlags } from './featureFlags';

// When the volunteer flow is live, /volunteer renders the agreement page.
// When it's hidden (see featureFlags), the route still exists but redirects to
// /contact so old links and bookmarks land somewhere useful instead of 404ing.
const volunteerRoute = featureFlags.volunteer
  ? {
      path: 'volunteer',
      lazy: async () => ({
        Component: (await import('./features/volunteer-agreement')).VolunteerAgreementPage,
      }),
    }
  : { path: 'volunteer', loader: () => redirect('/contact') };

// Layout (header/footer) stays eager since it renders on every route.
// Each page is code-split so visitors only download the page they navigate to.
export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, lazy: async () => ({ Component: (await import('./pages/Home')).Home }) },
      { path: 'launch', lazy: async () => ({ Component: (await import('./pages/LaunchEvent')).LaunchEvent }) },
      { path: 'about', lazy: async () => ({ Component: (await import('./pages/About')).About }) },
      { path: 'programs', lazy: async () => ({ Component: (await import('./pages/Programs')).Programs }) },
      { path: 'discover', lazy: async () => ({ Component: (await import('./pages/Discover')).Discover }) },
      { path: 'impact', lazy: async () => ({ Component: (await import('./pages/Impact')).Impact }) },
      { path: 'governance', lazy: async () => ({ Component: (await import('./pages/Governance')).Governance }) },
      { path: 'contact', lazy: async () => ({ Component: (await import('./pages/Contact')).Contact }) },
      volunteerRoute,
      { path: '*', lazy: async () => ({ Component: (await import('./pages/NotFound')).NotFound }) },
    ],
  },
]);

import { createBrowserRouter } from 'react-router';
import { Layout } from './Layout';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Programs } from './pages/Programs';
import { Impact } from './pages/Impact';
import { Governance } from './pages/Governance';
import { Contact } from './pages/Contact';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: 'about', Component: About },
      { path: 'programs', Component: Programs },
      { path: 'impact', Component: Impact },
      { path: 'governance', Component: Governance },
      { path: 'contact', Component: Contact },
    ],
  },
]);

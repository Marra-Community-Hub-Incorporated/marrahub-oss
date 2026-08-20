import { RouterProvider } from 'react-router';
import type { createAppRouter } from './routes';

export default function App({
  router,
}: {
  router: ReturnType<typeof createAppRouter>;
}) {
  return <RouterProvider router={router} />;
}

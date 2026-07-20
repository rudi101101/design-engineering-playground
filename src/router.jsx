import { createBrowserRouter } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { TrackListPage } from './pages/TrackListPage';
import { TermDetailPage } from './pages/TermDetailPage';

export const router = createBrowserRouter([
  { path: '/', element: <LandingPage /> },
  { path: '/:trackId', element: <TrackListPage /> },
  { path: '/:trackId/:termId', element: <TermDetailPage /> },
]);

import { Routes, Route } from "react-router-dom";
import Sidebar, { MobileTopBar } from "./components/Sidebar.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import TrackListPage from "./pages/TrackListPage.jsx";
import TermDetailPage from "./pages/TermDetailPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import Footer from "./components/Footer.jsx";

export default function App() {
  return (
    <div className="flex min-h-screen bg-lavender-canvas">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <MobileTopBar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/:trackSlug" element={<TrackListPage />} />
            <Route path="/:trackSlug/:termSlug" element={<TermDetailPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </div>
  );
}

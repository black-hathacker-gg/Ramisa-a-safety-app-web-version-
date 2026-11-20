import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import FeaturesPage from './pages/FeaturesPage';
import HardwarePage from './pages/HardwarePage';
import SafetyGuidePage from './pages/SafetyGuidePage';
import BlogPage from './pages/BlogPage';
import AboutPage from './pages/AboutPage';
import SupportPage from './pages/SupportPage';

const DocsPage = lazy(() => import('./pages/DocsPage'));

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="how-it-works" element={<Home />} />
          <Route path="features" element={<FeaturesPage />} />
          <Route path="app" element={<FeaturesPage />} />
          <Route path="hardware" element={<HardwarePage />} />
          <Route path="guide" element={<SafetyGuidePage />} />
          <Route path="blog" element={<BlogPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="support" element={<SupportPage />} />
          <Route path="docs" element={<Suspense fallback={<p className="landing-wrap py-12">Loading documentation…</p>}><DocsPage /></Suspense>} />
          <Route path="*" element={<Home />} />
        </Route>
      </Routes>
    </Router>
  );
}

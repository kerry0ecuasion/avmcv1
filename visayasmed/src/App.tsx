import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AdminAuthProvider } from './contexts/AdminAuthContext';
import ChatBot from './components/ChatBot';
import Navbar from './components/Navbar';
import PageTransition from './components/PageTransition';

import Home from './components/Home';
import AboutPage from './components/AboutPage';
import DoctorsPage from './components/DoctorsPage';
import ServicesPage from './components/ServicesPage';
import FAQsPage from './components/FAQsPage';
import ContactPage from './components/ContactPage';
import ServiceDetailPage from './components/ServiceDetailPage';
import Admin from './components/Admin';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';

const Layout: React.FC = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      {!isAdminRoute && <Navbar />}
      <PageTransition>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/doctors" element={<DoctorsPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/services/:slug" element={<ServiceDetailPage />} />
          <Route path="/faqs" element={<FAQsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route
            path="/admin"
            element={
              <ProtectedAdminRoute>
                <Admin />
              </ProtectedAdminRoute>
            }
          />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedAdminRoute>
                <AdminDashboard />
              </ProtectedAdminRoute>
            }
          />
        </Routes>
      </PageTransition>
    </>
  );
};

const App: React.FC = () => {
  // Fade out the HTML loading screen once app is ready
  React.useEffect(() => {
    const loader = document.getElementById('app-loader');
    if (loader) {
      // Small delay to let React paint the first frame
      const timer = setTimeout(() => {
        loader.classList.add('fade-out');
        // Remove from DOM after fade
        setTimeout(() => loader.remove(), 500);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <ThemeProvider>
      <ChatBot />
      <AdminAuthProvider>
        <div className="site-container">
          <Router>
            <Layout />
          </Router>
        </div>
      </AdminAuthProvider>
    </ThemeProvider>
  );
};

export default App;

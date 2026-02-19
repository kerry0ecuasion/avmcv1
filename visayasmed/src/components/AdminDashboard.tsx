import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import Navbar from './Navbar';
import Footer from './Footer';
import SlideshowManager from './AdminComponents/SlideshowManager';
import ContentEditor from './AdminComponents/ContentEditor';
import AdvancedContentEditor from './AdminComponents/AdvancedContentEditor';

const AdminDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [adminEmail, setAdminEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const email = localStorage.getItem('adminEmail');
    
    if (!token) {
      navigate('/admin/login');
      return;
    }
    
    setAdminEmail(email || '');
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminEmail');
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const navItems = [
    { id: 'home', label: 'Edit Home' },
    { id: 'about', label: 'Edit About' },
    { id: 'slideshow', label: 'Manage Slideshows' },
    { id: 'services', label: 'Edit Services' },
    { id: 'doctors', label: 'Edit Doctors' },
  ];

  const renderContent = () => {
    if (activeSection === 'slideshow') return <SlideshowManager />;
    if (activeSection === 'doctors' || activeSection === 'services') {
      return <AdvancedContentEditor page={activeSection} />;
    }
    return <ContentEditor page={activeSection} />;
  };

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300" style={{
      backgroundImage: "url('/mback.png')",
      backgroundSize: 'cover',
      backgroundPosition: 'center center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed'
    }}>
      <div className="absolute inset-0 bg-white/50 dark:bg-gray-900/90 transition-colors duration-300 pointer-events-none"></div>

      {/* Admin Top Bar */}
      <header className="relative z-10 bg-sky-600 dark:bg-sky-800 text-white py-4 shadow-lg transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">VisayasMed Admin</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm">{adminEmail}</span>
            <a 
              href="/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
            >
              View Live Site
            </a>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <Navbar active="admin" onNavigate={() => {}} />

      <main className="flex-1 relative z-10">
        <div className="max-w-7xl mx-auto flex gap-6 px-6 py-8">
          {/* Sidebar */}
          <aside className="w-64 flex-shrink-0">
            <nav className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sticky top-8">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-6">
                Quick Actions
              </h3>
              <ul className="space-y-2">
                {navItems.map(item => (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                        activeSection === item.id
                          ? 'bg-sky-600 text-white'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
              {renderContent()}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminDashboard;

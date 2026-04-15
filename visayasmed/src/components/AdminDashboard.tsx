import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import { useTheme } from '../contexts/ThemeContext';

import Footer from './Footer';
import SlideshowManager from './AdminComponents/SlideshowManager';
import ContentEditor from './AdminComponents/ContentEditor';
import AdvancedContentEditor from './AdminComponents/AdvancedContentEditor';
import NewsManager from './AdminComponents/NewsManager';
import TestimonialsManager from './AdminComponents/TestimonialsManager';
import StatsManager from './AdminComponents/StatsManager';
import FAQsManager from './AdminComponents/FAQsManager';
import HeroCarouselManager from './AdminComponents/HeroCarouselManager';

const AdminDashboard: React.FC = () => {
    const [activeSection, setActiveSection] = useState('about');
    const { adminEmail, logout } = useAdminAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/admin/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const navGroups = [
        {
            label: "Pages",
            items: [
                { id: 'home', label: 'Home Page' },
                { id: 'about', label: 'About Page' },
                { id: 'emergency', label: 'Emergency Services' },
                { id: 'cta', label: 'CTA Banner' },
                { id: 'contact', label: 'Contact / Footer' },
            ]
        },
        {
            label: "Sections",
            items: [
                { id: 'heroCarousel', label: '🖼️ Hero Carousel' },
                { id: 'slideshow', label: 'Slideshows' },
                { id: 'news', label: 'News & Events' },
                { id: 'doctors', label: 'Doctors' },
                { id: 'services', label: 'Services' },
                { id: 'stats', label: 'Stats Section' },
                { id: 'testimonials', label: 'Testimonials' },
                { id: 'faqs', label: 'FAQs' },
            ]
        }
    ];

    const renderContent = () => {
        switch (activeSection) {
            case 'heroCarousel': return <HeroCarouselManager />;
            case 'slideshow': return <SlideshowManager />;
            case 'doctors': return <AdvancedContentEditor page="doctors" />;
            case 'services': return <AdvancedContentEditor page="services" />;
            case 'news': return <NewsManager />;
            case 'testimonials': return <TestimonialsManager />;
            case 'stats': return <StatsManager />;
            case 'faqs': return <FAQsManager />;
            case 'home':
            case 'about':
            case 'emergency':
            case 'cta':
            case 'contact':
                return <ContentEditor page={activeSection} />;
            default:
                return <ContentEditor page={activeSection} />;
        }
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

            <header className="relative z-10 bg-sky-600 dark:bg-sky-800 text-white py-4 shadow-lg transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">VisayasMed Admin</h1>
                    <div className="flex items-center gap-4">
                        <span className="text-sm">{adminEmail}</span>
                        <a href="/" target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors">View Live Site</a>
                        <button
                            onClick={toggleTheme}
                            className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors flex items-center justify-center"
                            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                        >
                            {theme === 'light' ? (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                                    <circle cx="12" cy="12" r="4" />
                                    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                                </svg>
                            )}
                        </button>
                        <button onClick={handleLogout} className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-colors">Logout</button>
                    </div>
                </div>
            </header>

            <main className="flex-1 relative z-10">
                <div className="max-w-7xl mx-auto flex gap-6 px-6 py-8">
                    <aside className="w-64 flex-shrink-0">
                        <nav className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sticky top-8">
                            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Content Manager</h3>
                            {navGroups.map(group => (
                                <div key={group.label} className="mb-4">
                                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 px-2">{group.label}</p>
                                    <ul className="space-y-1">
                                        {group.items.map(item => (
                                            <li key={item.id}>
                                                <button
                                                    onClick={() => setActiveSection(item.id)}
                                                    className={`w-full text-left px-3 py-2 rounded-lg font-medium text-sm transition-colors ${activeSection === item.id
                                                        ? 'bg-sky-600 text-white'
                                                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                                        }`}
                                                >
                                                    {item.label}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </nav>
                    </aside>

                    <div className="flex-1 min-w-0">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 overflow-visible">
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

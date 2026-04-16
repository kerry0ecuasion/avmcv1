import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

const navItems = [
  { path: '/', label: 'Home', key: 'home' },
  { path: '/about', label: 'About Us', key: 'about' },
  { path: '/doctors', label: 'Doctors', key: 'doctors' },
  { path: '/services', label: 'Services', key: 'services' },
  { path: '/faqs', label: 'FAQs', key: 'faqs' },
];

const serviceSubItems = [
  { path: '/services/family-medicine', label: 'Family Medicine' },
  { path: '/services/pediatrics', label: 'Pediatrics' },
  { path: '/services/internal-medicine', label: 'Internal Medicine' },
  { path: '/services/surgery', label: 'Surgery' },
  { path: '/services/ob-gyne', label: 'OB & GYNE' },
];

const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
  </svg>
);

const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [showNav, setShowNav] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);

  useEffect(() => {
    setShowNav(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setMobileServicesOpen(false);
  }, [location.pathname]);

  const isActive = (item: typeof navItems[0]) => {
    if (item.path === '/' && location.pathname === '/') return true;
    if (item.key === 'about' && location.pathname === '/about') return true;
    if (item.key === 'services' && location.pathname.startsWith('/services')) return true;
    if (item.path !== '/' && item.path !== '/about' && location.pathname === item.path) return true;
    return false;
  };

  const handleNavClick = (_item: typeof navItems[0]) => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  };



  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${scrolled
      ? 'bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl shadow-lg shadow-black/5 dark:shadow-black/20 py-3'
      : 'bg-transparent py-5'
      }`}>
      {/* Subtle gradient line at top */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-60" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">
        {/* Logo Section */}
        <Link
          to="/"
          onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })}
          className={`flex items-center gap-3 transform transition-all duration-700 ${showNav ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}
        >
          <div className="relative">
            <img src="/VMlogo.png" alt="VisayasMed Logo" className="h-10 w-10 hover:animate-medical-pulse" />
            <div className="absolute -inset-1 bg-blue-500/20 rounded-full blur-md opacity-0 hover:opacity-100 transition-opacity duration-300" />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-lg bg-gradient-to-r from-blue-600 to-blue-600 dark:from-blue-400 dark:to-blue-400 bg-clip-text text-transparent leading-tight">
              VisayasMed
            </span>
            <span className="text-[10px] font-medium tracking-[0.2em] text-gray-400 dark:text-gray-500 uppercase">Hospital</span>
          </div>
        </Link>

        {/* Mobile menu toggle */}
        <button
          className="lg:hidden p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-1">
          {navItems.map((item, index) => {
            // Services item gets a dropdown
            if (item.key === 'services') {
              return (
                <div
                  key={item.key}
                  className="relative group"
                  style={{
                    animation: showNav ? `stagger-nav 0.5s ease-out ${index * 0.08}s forwards` : 'none',
                    opacity: showNav ? 1 : 0,
                  }}
                >
                  <Link
                    to={item.path}
                    onClick={() => handleNavClick(item)}
                    className={`relative text-[13px] font-semibold uppercase tracking-wider transition-all duration-300 cursor-pointer
                      px-4 py-2.5 rounded-xl flex items-center gap-1 ${isActive(item)
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-black dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                      }`}
                  >
                    <span className={`inline-block transition-all duration-300 ${isActive(item) ? 'scale-105' : 'group-hover:scale-105'}`}>
                      {item.label}
                    </span>
                    {/* Dropdown arrow */}
                    <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>

                    {/* Active underline */}
                    {isActive(item) && (
                      <span className="absolute left-2 right-2 -bottom-0.5 h-[2px] bg-gradient-to-r from-blue-500 to-blue-500 dark:from-blue-400 dark:to-blue-400 animate-underline-expand rounded-full" />
                    )}

                    {/* Hover glow */}
                    {!isActive(item) && (
                      <span className="absolute inset-0 rounded-xl bg-gray-100/0 dark:bg-gray-800/0 group-hover:bg-gray-100/80 dark:group-hover:bg-gray-800/50 transition-all duration-300 -z-10" />
                    )}
                  </Link>

                  {/* Dropdown Menu */}
                  <div className="absolute top-full left-0 pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl shadow-black/8 dark:shadow-black/30 border border-gray-200 dark:border-gray-700 py-3 min-w-[200px]">
                      {serviceSubItems.map((sub) => (
                        <Link
                          key={sub.path}
                          to={sub.path}
                          onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })}
                          className={`flex items-center justify-between px-5 py-2.5 text-sm transition-colors duration-150 ${location.pathname === sub.path
                              ? 'text-blue-600 dark:text-blue-400 font-semibold'
                              : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                            }`}
                        >
                          <span>{sub.label}</span>
                          <span className="text-gray-400 dark:text-gray-500 text-xs">›</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            }

            // Regular nav items
            return (
              <Link
                key={item.key}
                to={item.path}
                onClick={() => handleNavClick(item)}
                style={{
                  animation: showNav ? `stagger-nav 0.5s ease-out ${index * 0.08}s forwards` : 'none',
                  opacity: showNav ? 1 : 0,
                }}
                className={`relative text-[13px] font-semibold uppercase tracking-wider transition-all duration-300 cursor-pointer group
                  px-4 py-2.5 rounded-xl transition-colors ${isActive(item)
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-black dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                  }
                `}
              >
                <span className={`inline-block transition-all duration-300 ${isActive(item) ? 'scale-105' : 'group-hover:scale-105'}`}>
                  {item.label}
                </span>

                {/* Animated underline */}
                {isActive(item) && (
                  <span className="absolute left-2 right-2 -bottom-0.5 h-[2px] bg-gradient-to-r from-blue-500 to-blue-500 dark:from-blue-400 dark:to-blue-400 animate-underline-expand rounded-full" />
                )}

                {/* Hover glow effect */}
                {!isActive(item) && (
                  <span className="absolute inset-0 rounded-xl bg-gray-100/0 dark:bg-gray-800/0 group-hover:bg-gray-100/80 dark:group-hover:bg-gray-800/50 transition-all duration-300 -z-10" />
                )}
              </Link>
            );
          })}

          {/* Contact Us button */}
          <Link
            to="/contact"
            onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })}
            style={{
              animation: showNav ? `stagger-nav 0.5s ease-out ${navItems.length * 0.08}s forwards` : 'none',
              opacity: showNav ? 1 : 0,
            }}
            className={`px-6 py-2.5 rounded-full text-[13px] font-semibold uppercase tracking-wider transition-all duration-300 ${
              location.pathname === '/contact'
                ? 'bg-gradient-to-r from-blue-500 to-blue-500 text-white shadow-lg shadow-blue-500/30'
                : 'bg-gradient-to-r from-blue-600 to-blue-600 text-white hover:shadow-lg hover:shadow-blue-500/30 hover:scale-105'
            }`}
          >
            Contact Us
          </Link>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="ml-3 p-2.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-amber-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-110 hover:rotate-12 flex items-center justify-center group relative"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            <span className="absolute inset-0 rounded-full bg-blue-400/0 group-hover:bg-blue-400/10 transition-all duration-300" />
            <span className="relative z-10 transition-transform duration-500">
              {theme === 'light' ? <MoonIcon /> : <SunIcon />}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden transition-all duration-400 overflow-hidden ${mobileOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
        }`}>
        <div className="px-6 py-4 space-y-1 bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-800/50">
          {navItems.map((item) => {
            // Services item with mobile accordion
            if (item.key === 'services') {
              return (
                <div key={item.key}>
                  <div className="flex items-center">
                    <Link
                      to={item.path}
                      onClick={() => { handleNavClick(item); setMobileOpen(false); }}
                      className={`flex-1 text-left px-4 py-3 rounded-xl text-sm font-semibold uppercase tracking-wider transition-all duration-300 ${isActive(item)
                        ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                        : 'text-black dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                        }`}
                    >
                      {item.label}
                    </Link>
                    <button
                      onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                      className="p-3 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      aria-label="Toggle services submenu"
                    >
                      <svg className={`w-4 h-4 transition-transform duration-300 ${mobileServicesOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                  {/* Mobile sub-items */}
                  <div className={`overflow-hidden transition-all duration-300 ${mobileServicesOpen ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="pl-4 py-1 space-y-0.5">
                      {serviceSubItems.map((sub) => (
                        <Link
                          key={sub.path}
                          to={sub.path}
                          onClick={() => { window.scrollTo({ top: 0, behavior: 'instant' }); setMobileOpen(false); }}
                          className={`flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${location.pathname === sub.path
                              ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                            }`}
                        >
                          <span>{sub.label}</span>
                          <span className="text-gray-400 text-xs">›</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={item.key}
                to={item.path}
                onClick={() => { handleNavClick(item); setMobileOpen(false); }}
                className={`block w-full text-left px-4 py-3 rounded-xl text-sm font-semibold uppercase tracking-wider transition-all duration-300 ${isActive(item)
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                  }`}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            to="/contact"
            onClick={() => { window.scrollTo({ top: 0, behavior: 'instant' }); setMobileOpen(false); }}
            className={`block w-full text-left px-4 py-3 rounded-xl text-sm font-semibold uppercase tracking-wider transition-all duration-300 ${
              location.pathname === '/contact'
                ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                : 'text-black dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50'
            }`}
          >
            Contact Us
          </Link>
          <button
            onClick={toggleTheme}
            className="w-full px-4 py-3 rounded-xl text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 flex items-center gap-2 transition-all"
          >
            {theme === 'light' ? <MoonIcon /> : <SunIcon />}
            {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

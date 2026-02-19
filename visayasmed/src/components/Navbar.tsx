import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

type Props = {
  active: string;
  onNavigate: (page: string) => void;
}

const links = [
  'home',
  'about',
  'find-doctor',
  'services',
  'faqs',
  'contact',
]

const labels: Record<string, string> = {
  home: 'Home',
  about: 'About Us',
  'find-doctor': 'Doctors',
  services: 'Services',
  faqs: 'FAQs',
  contact: 'Contact Us',
}

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

const Navbar: React.FC<Props> = ({ active, onNavigate }) => {
  const { theme, toggleTheme } = useTheme();
  const [showNav, setShowNav] = useState(false);

  useEffect(() => {
    setShowNav(true);
  }, []);

  return (
    <nav className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-lg sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-8 py-5 flex flex-wrap gap-6 items-center justify-between">
        {/* Logo Section */}
        <div className={`flex items-center gap-3 transform transition-all duration-700 ${showNav ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
          <img src="/VMlogo.png" alt="VM Logo" className="h-8 w-8 hover:animate-medical-pulse" />
          <div className="font-bold text-sky-600 dark:text-sky-400 text-lg">VisayasMed</div>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-wrap gap-2 sm:gap-6 items-center">
          {links.map((link, index) => (
            <button
              key={link}
              type="button"
              onClick={() => onNavigate(link)}
              style={{
                animation: showNav ? `stagger-nav 0.5s ease-out ${index * 0.08}s forwards` : 'none',
                opacity: showNav ? 1 : 0,
              }}
              className={`relative text-sm font-bold uppercase transition-all duration-300 cursor-pointer group
                ${link === 'contact' 
                  ? `px-5 py-2.5 rounded-lg border-2 border-sky-600 dark:border-sky-400 ${
                      active === link 
                        ? 'bg-sky-600 dark:bg-sky-500 text-white shadow-lg shadow-sky-500/50 animate-link-glow' 
                        : 'text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-gray-800/80 hover:shadow-md hover:shadow-sky-400/30'
                    }` 
                  : `px-4 py-2.5 rounded-lg transition-colors ${
                      active === link 
                        ? 'text-sky-600 dark:text-sky-400' 
                        : 'text-gray-600 dark:text-gray-300 hover:text-sky-600 dark:hover:text-sky-400'
                    }`
                }
              `}
            >
              <span className={`inline-block transition-all duration-300 ${active === link ? 'scale-105' : 'group-hover:scale-110'}`}>
                {labels[link]}
              </span>
              
              {/* Animated underline for non-contact links */}
              {active === link && link !== 'contact' && (
                <span className="absolute left-0 -bottom-1 h-0.5 bg-gradient-to-r from-sky-500 via-sky-400 to-sky-500 dark:from-sky-400 dark:via-sky-300 dark:to-sky-400 animate-underline-expand shadow-md shadow-sky-400/50 rounded-full" />
              )}

              {/* Hover glow effect */}
              {link !== 'contact' && active !== link && (
                <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-sky-400/0 via-sky-400/10 to-sky-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
              )}
            </button>
          ))}

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="ml-4 p-2.5 rounded-full border-2 border-gray-400 dark:border-gray-400 text-gray-600 dark:text-yellow-300 hover:bg-sky-50 dark:hover:bg-gray-800 transition-all duration-300 hover:scale-110 hover:border-sky-500 dark:hover:border-sky-400 flex items-center justify-center group relative"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            <span className="absolute inset-0 rounded-full bg-sky-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md" />
            <span className="relative z-10">{theme === 'light' ? <MoonIcon /> : <SunIcon />}</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const COOKIE_CONSENT_KEY = 'visayasmed_cookie_consent';

const CookieConsent: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [animateOut, setAnimateOut] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      // Small delay to let the page load first
      const timer = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAgree = () => {
    setAnimateOut(true);
    setTimeout(() => {
      localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
      setVisible(false);
    }, 400);
  };

  const handleClose = () => {
    setAnimateOut(true);
    setTimeout(() => {
      localStorage.setItem(COOKIE_CONSENT_KEY, 'dismissed');
      setVisible(false);
    }, 400);
  };

  if (!visible) return null;

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className={`fixed inset-0 z-[99998] bg-black/50 backdrop-blur-sm transition-opacity duration-400 ${
          animateOut ? 'opacity-0' : 'opacity-100'
        }`}
        onClick={handleClose}
      />

      {/* Cookie consent modal */}
      <div
        className={`fixed z-[99999] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
          w-[95vw] max-w-[520px] transition-all duration-400
          ${animateOut ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}
        `}
        role="dialog"
        aria-modal="true"
        aria-label="Cookie consent"
        id="cookie-consent-dialog"
      >
        <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl shadow-black/20 dark:shadow-black/50 border border-gray-200 dark:border-gray-700/60 overflow-hidden">
          {/* Decorative top gradient bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500" />

          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-500 dark:hover:text-red-400 hover:border-red-200 dark:hover:border-red-700 transition-all duration-300 group"
            aria-label="Close cookie consent"
            id="cookie-consent-close"
          >
            <svg className="w-4 h-4 transition-transform duration-200 group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="p-6 pt-8">
            {/* Content area with badge and text */}
            <div className="flex gap-5 items-start">
              {/* DPO/DPS Badge */}
              <div className="flex-shrink-0 hidden sm:flex">
                <div className="w-[100px] h-[100px] rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20 border border-blue-200/60 dark:border-blue-700/40 flex flex-col items-center justify-center p-2 shadow-sm">
                  {/* Shield icon */}
                  <div className="relative mb-1">
                    <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900" />
                  </div>
                  <span className="text-[11px] font-bold text-blue-700 dark:text-blue-300 tracking-wide">DPO/DPS</span>
                  <span className="text-[8px] font-medium text-blue-500 dark:text-blue-400 uppercase tracking-wider">Compliant</span>
                </div>
              </div>

              {/* Text content */}
              <div className="flex-1 min-w-0">
                <p className="text-gray-700 dark:text-gray-300 text-[13px] leading-relaxed font-normal">
                  We use cookies to ensure you get the best browsing experience on our website. As we strive to provide you with exceptional healthcare, we also need to keep our{' '}
                  <Link
                    to="/privacy-policy"
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold underline underline-offset-2 decoration-blue-400/40 hover:decoration-blue-500 transition-colors duration-200"
                    onClick={handleAgree}
                  >
                    Privacy Policy
                  </Link>{' '}
                  up-to-date. By continued use of our website, you agree to our{' '}
                  <Link
                    to="/privacy-policy"
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold underline underline-offset-2 decoration-blue-400/40 hover:decoration-blue-500 transition-colors duration-200"
                    onClick={handleAgree}
                  >
                    Privacy Policy
                  </Link>{' '}
                  and accept our use of such cookies. You may read and review our{' '}
                  <Link
                    to="/privacy-policy"
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold underline underline-offset-2 decoration-blue-400/40 hover:decoration-blue-500 transition-colors duration-200"
                    onClick={handleAgree}
                  >
                    Privacy Policy
                  </Link>{' '}
                  and{' '}
                  <Link
                    to="/cookie-policy"
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold underline underline-offset-2 decoration-blue-400/40 hover:decoration-blue-500 transition-colors duration-200"
                    onClick={handleAgree}
                  >
                    Cookie Policy
                  </Link>{' '}
                  for more information.
                </p>
              </div>
            </div>

            {/* I Agree button */}
            <div className="mt-5">
              <button
                onClick={handleAgree}
                className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-emerald-500 text-white font-bold text-sm uppercase tracking-wider shadow-lg shadow-green-500/25 hover:shadow-green-500/40 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
                id="cookie-consent-agree"
              >
                I Agree
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CookieConsent;

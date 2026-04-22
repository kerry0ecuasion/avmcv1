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
      {/* Backdrop overlay - with stronger blur for premium feel */}
      <div
        className={`fixed inset-0 z-[99998] bg-black/60 backdrop-blur-md transition-opacity duration-500 ${
          animateOut ? 'opacity-0' : 'opacity-100'
        }`}
        onClick={handleClose}
      />

      {/* Cookie consent modal */}
      <div
        className={`fixed z-[99999] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
          w-[95vw] max-w-[540px] transition-all duration-500 ease-out
          ${animateOut ? 'opacity-0 scale-95 translate-y-[-45%]' : 'opacity-100 scale-100 translate-y-[-50%]'}
        `}
        role="dialog"
        aria-modal="true"
        aria-label="Cookie consent"
        id="cookie-consent-dialog"
      >
        <div className="relative bg-[#0f172a] rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-slate-700/50 overflow-hidden">
          {/* Decorative top gradient bar */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 z-20" />
          
          {/* Subtle glow effect in the corner */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-600/10 blur-[80px] rounded-full pointer-events-none" />
          
          {/* Close button - sleek and minimal */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-center text-slate-400 hover:text-white hover:bg-red-500/20 hover:border-red-500/30 transition-all duration-300 group z-10"
            aria-label="Close cookie consent"
            id="cookie-consent-close"
          >
            <svg className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="p-8 sm:p-10">
            {/* Content area with badge and text */}
            <div className="flex flex-col sm:flex-row gap-8 items-center sm:items-start text-center sm:text-left">
              {/* DPO/DPS Badge - Premium Glassmorphism style */}
              <div className="flex-shrink-0">
                <div className="w-[120px] h-[120px] rounded-[28px] bg-gradient-to-br from-blue-600/10 to-indigo-600/5 border border-blue-500/20 flex flex-col items-center justify-center p-4 relative group hover:scale-105 transition-transform duration-500">
                  {/* Subtle inner glow */}
                  <div className="absolute inset-0 bg-blue-500/5 rounded-[28px] blur-xl group-hover:bg-blue-500/10 transition-all duration-500" />
                  
                  {/* VisayasMed Logo */}
                  <div className="relative">
                    <img 
                      src="/VMlogo.png" 
                      alt="VisayasMed Logo" 
                      className="w-16 h-16 object-contain drop-shadow-[0_0_8px_rgba(96,165,250,0.3)]"
                    />
                  </div>
                </div>
              </div>

              {/* Text content */}
              <div className="flex-1 min-w-0">
                <p className="text-slate-300 text-[15px] leading-[1.7] font-medium">
                  We use cookies to ensure you get the best browsing experience on our website. As we strive to provide you with exceptional healthcare, we also need to keep our{' '}
                  <Link
                    to="/privacy-policy"
                    className="text-white hover:text-blue-400 font-bold underline underline-offset-4 decoration-slate-600 hover:decoration-blue-400/50 transition-all duration-300"
                    onClick={() => {}} // Remove redundant onClick
                  >
                    Privacy Policy
                  </Link>{' '}
                  up-to-date. By continued use of our website, you agree to our{' '}
                  <Link
                    to="/privacy-policy"
                    className="text-white hover:text-blue-400 font-bold underline underline-offset-4 decoration-slate-600 hover:decoration-blue-400/50 transition-all duration-300"
                  >
                    Privacy Policy
                  </Link>{' '}
                  and accept our use of such cookies. You may read and review our{' '}
                  <Link
                    to="/privacy-policy"
                    className="text-white hover:text-blue-400 font-bold underline underline-offset-4 decoration-slate-600 hover:decoration-blue-400/50 transition-all duration-300"
                  >
                    Privacy Policy
                  </Link>{' '}
                  and{' '}
                  <Link
                    to="/cookie-policy"
                    className="text-white hover:text-blue-400 font-bold underline underline-offset-4 decoration-slate-600 hover:decoration-blue-400/50 transition-all duration-300"
                  >
                    Cookie Policy
                  </Link>{' '}
                  for more information.
                </p>
              </div>
            </div>

            {/* I Agree button - Vibrant and large */}
            <div className="mt-10">
              <button
                onClick={handleAgree}
                className="w-full py-4 px-8 rounded-2xl bg-gradient-to-r from-[#059669] to-[#10b981] hover:from-[#10b981] hover:to-[#34d399] text-white font-black text-[16px] uppercase tracking-[0.15em] shadow-[0_10px_30px_rgba(16,185,129,0.3)] hover:shadow-[0_15px_40px_rgba(16,185,129,0.4)] transition-all duration-500 hover:-translate-y-1 active:translate-y-0.5 flex items-center justify-center group"
                id="cookie-consent-agree"
              >
                <span>I Agree</span>
                <svg className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CookieConsent;

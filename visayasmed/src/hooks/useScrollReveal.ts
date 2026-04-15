import { useEffect } from 'react';

/**
 * useScrollReveal — Observes elements with .reveal, .reveal-left,
 * .reveal-right, .reveal-scale classes and adds .revealed when they
 * enter the viewport. Hospital-appropriate: clean, subtle, one-shot.
 */
export function useScrollReveal() {
  useEffect(() => {
    const selectors = '.reveal, .reveal-left, .reveal-right, .reveal-scale';
    const elements = document.querySelectorAll(selectors);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target); // One-shot — don't re-animate
          }
        });
      },
      {
        threshold: 0.02,
        rootMargin: '0px 0px 0px 0px',
      }
    );

    elements.forEach((el) => observer.observe(el));

    // Fallback: immediately reveal anything already in view on page load
    // This is important on mobile where content may already be partially visible
    requestAnimationFrame(() => {
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          el.classList.add('revealed');
          observer.unobserve(el);
        }
      });
    });

    return () => observer.disconnect();
  }, []);
}

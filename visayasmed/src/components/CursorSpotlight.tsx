import React, { useEffect, useRef, useCallback, useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface CursorPosition {
  x: number;
  y: number;
}

const CursorSpotlight: React.FC = () => {
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const cursorPosRef = useRef<CursorPosition>({ x: -100, y: -100 });
  const animationFrameRef = useRef<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const SPOTLIGHT_RADIUS = 30;
  const GLOW_WIDTH = 50;

  // Update cursor position and spotlight mask
  const handleMouseMove = useCallback((e: MouseEvent) => {
    cursorPosRef.current = { x: e.clientX, y: e.clientY };

    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    animationFrameRef.current = requestAnimationFrame(() => {
      if (containerRef.current) {
        const { x, y } = cursorPosRef.current;

        // Update main spotlight overlay mask
        const maskGradient = `radial-gradient(circle ${SPOTLIGHT_RADIUS}px at ${x}px ${y}px, transparent 0%, transparent ${SPOTLIGHT_RADIUS}px, rgba(0, 0, 0, 0.95) ${SPOTLIGHT_RADIUS + GLOW_WIDTH}px)`;

        containerRef.current.style.maskImage = maskGradient;
        containerRef.current.style.webkitMaskImage = maskGradient;

        // Update glow circle position
        if (glowRef.current) {
          glowRef.current.style.left = `calc(${x}px - ${SPOTLIGHT_RADIUS + GLOW_WIDTH}px)`;
          glowRef.current.style.top = `calc(${y}px - ${SPOTLIGHT_RADIUS + GLOW_WIDTH}px)`;
        }
      }
    });
  }, []);

  const handleMouseEnter = useCallback(() => setIsVisible(true), []);
  const handleMouseLeave = useCallback(() => setIsVisible(false), []);

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [handleMouseMove, handleMouseEnter, handleMouseLeave]);

  const oppositeTheme = theme === 'light' ? 'dark' : 'light';
  const oppositeThemeClass = oppositeTheme === 'dark' ? 'dark' : '';

  return (
    <>
      {/* SVG Defs for Glow Filter */}
      <svg
        width="0"
        height="0"
        style={{ position: 'fixed', pointerEvents: 'none' }}
        aria-hidden="true"
      >
        <defs>
          <filter id="spotlightBorderGlow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      {/* Main Spotlight Overlay - Shows Opposite Theme */}
      <div
        ref={containerRef}
        className={`fixed inset-0 pointer-events-none z-40 transition-opacity duration-300 cursor-spotlight-container ${oppositeThemeClass}`}
        style={{
          opacity: isVisible ? 1 : 0,
          maskImage: `radial-gradient(circle ${SPOTLIGHT_RADIUS}px at 50% 50%, transparent 0%, transparent ${SPOTLIGHT_RADIUS}px, rgba(0, 0, 0, 0.95) ${SPOTLIGHT_RADIUS + GLOW_WIDTH}px)`,
          WebkitMaskImage: `radial-gradient(circle ${SPOTLIGHT_RADIUS}px at 50% 50%, transparent 0%, transparent ${SPOTLIGHT_RADIUS}px, rgba(0, 0, 0, 0.95) ${SPOTLIGHT_RADIUS + GLOW_WIDTH}px)`,
        }}
      >
        {/* Opposite Theme Background */}
        <div className="absolute inset-0 bg-white dark:bg-slate-950 transition-colors duration-200" />

        {/* Opposite Theme Text Color Layer */}
        <div className="absolute inset-0 text-slate-900 dark:text-white" />

        {/* Subtle radial overlay for smooth edges */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: oppositeTheme === 'dark'
              ? `radial-gradient(circle 80px at var(--cursor-x, 50%) var(--cursor-y, 50%), transparent 0%, rgba(15, 23, 42, 0.4) 100%)`
              : `radial-gradient(circle 80px at var(--cursor-x, 50%) var(--cursor-y, 50%), transparent 0%, rgba(248, 250, 252, 0.3) 100%)`,
          }}
        />
      </div>

      {/* Glow/Border Circle Effect */}
      <div
        ref={glowRef}
        className="fixed pointer-events-none z-40 transition-opacity duration-300"
        style={{
          opacity: isVisible ? 0.7 : 0,
          width: `${(SPOTLIGHT_RADIUS + GLOW_WIDTH) * 2}px`,
          height: `${(SPOTLIGHT_RADIUS + GLOW_WIDTH) * 2}px`,
          transform: 'translate(0, 0)',
          willChange: 'left, top',
        }}
      >
        <svg
          className="w-full h-full"
          viewBox={`0 0 ${(SPOTLIGHT_RADIUS + GLOW_WIDTH) * 2} ${(SPOTLIGHT_RADIUS + GLOW_WIDTH) * 2}`}
          style={{ pointerEvents: 'none' }}
          aria-hidden="true"
        >
          {/* Outer Glow Circle */}
          <circle
            cx={SPOTLIGHT_RADIUS + GLOW_WIDTH}
            cy={SPOTLIGHT_RADIUS + GLOW_WIDTH}
            r={SPOTLIGHT_RADIUS}
            fill="none"
            stroke={oppositeTheme === 'dark' ? 'rgba(56, 219, 255, 0.5)' : 'rgba(226, 232, 240, 0.4)'}
            strokeWidth="1.5"
            filter="url(#spotlightBorderGlow)"
            opacity="0.8"
          />

          {/* Inner Highlight Circle */}
          <circle
            cx={SPOTLIGHT_RADIUS + GLOW_WIDTH}
            cy={SPOTLIGHT_RADIUS + GLOW_WIDTH}
            r={SPOTLIGHT_RADIUS - 2}
            fill="none"
            stroke={oppositeTheme === 'dark' ? 'rgba(56, 219, 255, 0.3)' : 'rgba(148, 163, 184, 0.2)'}
            strokeWidth="0.5"
            opacity="0.6"
          />

          {/* Spotlight Center Dot */}
          <circle
            cx={SPOTLIGHT_RADIUS + GLOW_WIDTH}
            cy={SPOTLIGHT_RADIUS + GLOW_WIDTH}
            r="3"
            fill={oppositeTheme === 'dark' ? 'rgba(56, 219, 255, 0.6)' : 'rgba(100, 150, 200, 0.5)'}
            opacity="0.7"
          />
        </svg>
      </div>
    </>
  );
};

export default CursorSpotlight;

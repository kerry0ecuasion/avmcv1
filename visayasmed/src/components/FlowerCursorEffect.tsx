import React, { useEffect, useRef, useCallback, useState } from 'react';

interface Dot {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  life: number;
  maxLife: number;
  color: string;
}

const COLORS = [
  '#416BA9', // Pantone 7683C blue
  '#2B5597', // Pantone 7685C dark blue
  '#5383c1', // lighter blue
  '#F3265D', // Pantone 1788C red
  '#A2D45E', // Pantone 367C green
  '#C4BEB6', // Pantone 400C warm gray
  '#1e3f73', // deep blue
  '#7ea2d1', // soft blue
  '#d01e50', // dark red
  '#8BC34A', // darker green
];

// Section IDs where the animation should be HIDDEN
const HIDDEN_SECTIONS = ['about', 'find-doctor', 'services', 'faqs', 'emergency'];

const FlowerCursorEffect: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotsRef = useRef<Dot[]>([]);
  const mouseRef = useRef({ x: -200, y: -200 });
  const prevMouseRef = useRef({ x: -200, y: -200 });
  const animFrameRef = useRef<number>(0);
  const lastSpawnRef = useRef<number>(0);
  const isActiveRef = useRef(false);
  const [visible, setVisible] = useState(true);
  const visibleRef = useRef(true);

  // Keep ref in sync with state for use inside animation loop
  useEffect(() => {
    visibleRef.current = visible;
  }, [visible]);

  // Observe sections to hide/show the animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      () => {
        let shouldHide = false;
        for (const id of HIDDEN_SECTIONS) {
          const el = document.getElementById(id);
          if (el) {
            const rect = el.getBoundingClientRect();
            const viewH = window.innerHeight;
            // Section is covering a significant portion of the viewport
            const overlap = Math.max(0, Math.min(rect.bottom, viewH) - Math.max(rect.top, 0));
            if (overlap > viewH * 0.4) {
              shouldHide = true;
              break;
            }
          }
        }

        setVisible(!shouldHide);
      },
      { threshold: [0, 0.1, 0.3, 0.5, 0.7] }
    );

    // Start observing after a short delay to let DOM paint
    const timer = setTimeout(() => {
      for (const id of HIDDEN_SECTIONS) {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
      }
    }, 500);

    // Also listen to scroll for more responsive toggling
    const handleScroll = () => {
      let shouldHide = false;
      const viewH = window.innerHeight;
      for (const id of HIDDEN_SECTIONS) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          const overlap = Math.max(0, Math.min(rect.bottom, viewH) - Math.max(rect.top, 0));
          if (overlap > viewH * 0.4) {
            shouldHide = true;
            break;
          }
        }
      }
      setVisible(!shouldHide);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      clearTimeout(timer);
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const createDot = useCallback((x: number, y: number, vxBase: number, vyBase: number): Dot => {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 2.5 + 0.8;

    return {
      x: x + (Math.random() - 0.5) * 30,
      y: y + (Math.random() - 0.5) * 30,
      vx: Math.cos(angle) * speed + vxBase * 0.12,
      vy: Math.sin(angle) * speed + vyBase * 0.12,
      radius: Math.random() * 2.5 + 1,
      opacity: Math.random() * 0.5 + 0.5,
      life: 0,
      maxLife: Math.random() * 70 + 40,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const handleMouseMove = (e: MouseEvent) => {
      prevMouseRef.current = { ...mouseRef.current };
      mouseRef.current = { x: e.clientX, y: e.clientY };
      isActiveRef.current = true;
    };

    const handleMouseLeave = () => {
      isActiveRef.current = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    const animate = () => {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Only spawn new dots when animation is visible
      if (visibleRef.current) {
        const now = performance.now();
        const dx = mouseRef.current.x - prevMouseRef.current.x;
        const dy = mouseRef.current.y - prevMouseRef.current.y;
        const speed = Math.sqrt(dx * dx + dy * dy);

        if (isActiveRef.current && speed > 1 && now - lastSpawnRef.current > 20) {
          const spawnCount = Math.min(Math.floor(speed / 4) + 1, 6);
          for (let i = 0; i < spawnCount; i++) {
            dotsRef.current.push(
              createDot(mouseRef.current.x, mouseRef.current.y, dx, dy)
            );
          }
          lastSpawnRef.current = now;
        }
      }

      // Always update existing dots (so they finish fading even when hidden)
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const REPULSION_RADIUS = 80;
      const REPULSION_FORCE = 3;

      dotsRef.current = dotsRef.current.filter(dot => {
        dot.life++;
        if (dot.life >= dot.maxLife) return false;

        if (visibleRef.current) {
          const ddx = dot.x - mx;
          const ddy = dot.y - my;
          const dist = Math.sqrt(ddx * ddx + ddy * ddy);

          if (dist < REPULSION_RADIUS && dist > 0) {
            const force = (1 - dist / REPULSION_RADIUS) * REPULSION_FORCE;
            const angle = Math.atan2(ddy, ddx);
            dot.vx += Math.cos(angle) * force;
            dot.vy += Math.sin(angle) * force;
          }
        }

        dot.vy += 0.015;
        dot.vx *= 0.97;
        dot.vy *= 0.97;
        dot.x += dot.vx;
        dot.y += dot.vy;

        const progress = dot.life / dot.maxLife;
        const fadeIn = Math.min(progress * 6, 1);
        const fadeOut = 1 - Math.pow(progress, 1.5);
        const currentOpacity = dot.opacity * fadeIn * fadeOut;

        if (currentOpacity <= 0.01) return true;

        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.radius * (1 - progress * 0.3), 0, Math.PI * 2);
        ctx.fillStyle = dot.color;
        ctx.globalAlpha = currentOpacity;
        ctx.fill();
        ctx.globalAlpha = 1;

        return true;
      });

      if (dotsRef.current.length > 120) {
        dotsRef.current = dotsRef.current.slice(-120);
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [createDot]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 9999,
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.4s ease',
      }}
      aria-hidden="true"
    />
  );
};

export default FlowerCursorEffect;

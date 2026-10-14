import React, { Suspense, useEffect, useRef, useState } from 'react';
import { DotGrid } from '@/components/common/DotGrid';

function getCanMountCanvas() {
  if (typeof window === 'undefined') return false;
  const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(pointer: coarse)').matches;
  const isNarrow = window.innerWidth < 768;
  return !isReduced && !isTouch && !isNarrow;
}

export function HeroBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldMountCanvas, setShouldMountCanvas] = useState(getCanMountCanvas);
  const [isPaused, setIsPaused] = useState(false);

  // Palette tokens from guide
  const baseDot = '#CBD5FF';
  const activeDot = '#2547FF';

  useEffect(() => {
    const evaluateMount = () => setShouldMountCanvas(getCanMountCanvas());
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const pointerQuery = window.matchMedia('(pointer: coarse)');

    motionQuery.addEventListener('change', evaluateMount);
    pointerQuery.addEventListener('change', evaluateMount);
    window.addEventListener('resize', evaluateMount);

    return () => {
      motionQuery.removeEventListener('change', evaluateMount);
      pointerQuery.removeEventListener('change', evaluateMount);
      window.removeEventListener('resize', evaluateMount);
    };
  }, []);

  // Pause canvas when hero is scrolled out of view
  useEffect(() => {
    if (!containerRef.current || !shouldMountCanvas) return;
    const observer = new IntersectionObserver(([entry]) => setIsPaused(!entry.isIntersecting), { threshold: 0 });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [shouldMountCanvas]);

  return (
    <div
      ref={containerRef}
      className="hero-background absolute inset-0 z-0 overflow-hidden pointer-events-none"
      style={{
        maskImage: 'linear-gradient(to bottom, black 55%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, black 55%, transparent 100%)',
      }}
      aria-hidden="true"
    >
      {shouldMountCanvas ? (
        <Suspense fallback={null}>
          <DotGrid
            dotSize={3}
            gap={28}
            baseColor={baseDot}
            activeColor={activeDot}
            proximity={140}
            paused={isPaused}
            className="w-full h-full"
          />
        </Suspense>
      ) : (
        /* Zero-JS static fallback for mobile & reduced motion */
        <div
          className="hero-static-dots absolute inset-0 w-full h-full pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(${baseDot} 1.5px, transparent 1.5px)`,
            backgroundSize: '28px 28px',
            backgroundPosition: 'center',
          }}
          aria-hidden="true"
        />
      )}
    </div>
  );
}

export default HeroBackground;

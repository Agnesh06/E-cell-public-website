import React, { useRef, useEffect, useCallback, useMemo } from 'react';

const throttle = <T extends unknown[]>(func: (...args: T) => void, limit: number) => {
  let lastCall = 0;
  return function (this: unknown, ...args: T) {
    const now = performance.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      func.apply(this, args);
    }
  };
};

/**
 * Exact GSAP elastic.out(1, 0.75) spring curve
 * Amplitude = 1, Period = 0.75
 */
function easeElasticOut(p: number): number {
  if (p === 0) return 0;
  if (p === 1) return 1;
  const period = 0.75;
  const s = period / 4; // 0.1875
  return Math.pow(2, -10 * p) * Math.sin(((p - s) * (2 * Math.PI)) / period) + 1;
}

interface InertiaMotion {
  speed: number;
  dirX: number;
  dirY: number;
  coastDuration: number;
  peakDist: number;
  peakX: number;
  peakY: number;
  startTime: number;
  phase: 'coast' | 'return';
  returnDuration: number;
}

interface Dot {
  cx: number;
  cy: number;
  xOffset: number;
  yOffset: number;
  _inertiaApplied: boolean;
  inertia: InertiaMotion | null;
}

export interface DotGridProps {
  dotSize?: number;
  gap?: number;
  baseColor?: string;
  activeColor?: string;
  proximity?: number;
  speedTrigger?: number;
  shockRadius?: number;
  shockStrength?: number;
  maxSpeed?: number;
  resistance?: number;
  returnDuration?: number;
  paused?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

function hexToRgb(hex: string) {
  const m = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  if (!m) return { r: 0, g: 0, b: 0 };
  return {
    r: parseInt(m[1], 16),
    g: parseInt(m[2], 16),
    b: parseInt(m[3], 16)
  };
}

export const DotGrid: React.FC<DotGridProps> = ({
  dotSize = 3,
  gap = 28,
  baseColor = '#CBD5FF',
  activeColor = '#2547FF',
  proximity = 140,
  speedTrigger = 100,
  shockRadius = 250,
  shockStrength = 5,
  maxSpeed = 5000,
  resistance = 750,
  returnDuration = 1.5,
  paused = false,
  className = '',
  style
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotsRef = useRef<Dot[]>([]);
  const pointerRef = useRef({
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    speed: 0,
    lastTime: 0,
    lastX: 0,
    lastY: 0
  });

  const baseRgb = useMemo(() => hexToRgb(baseColor), [baseColor]);
  const activeRgb = useMemo(() => hexToRgb(activeColor), [activeColor]);

  // Pre-create Path2D circle to avoid thousands of ctx.arc calls per frame
  const circlePath = useMemo(() => {
    if (typeof window === 'undefined' || !window.Path2D) return null;
    const p = new Path2D();
    p.arc(0, 0, dotSize / 2, 0, Math.PI * 2);
    return p;
  }, [dotSize]);

  const buildGrid = useCallback(() => {
    const wrap = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const { width, height } = wrap.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.scale(dpr, dpr);

    const cols = Math.floor((width + gap) / (dotSize + gap));
    const rows = Math.floor((height + gap) / (dotSize + gap));
    const cell = dotSize + gap;

    const gridW = cell * cols - gap;
    const gridH = cell * rows - gap;
    const extraX = width - gridW;
    const extraY = height - gridH;

    const startX = extraX / 2 + dotSize / 2;
    const startY = extraY / 2 + dotSize / 2;

    const dots: Dot[] = [];
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        dots.push({
          cx: startX + x * cell,
          cy: startY + y * cell,
          xOffset: 0,
          yOffset: 0,
          _inertiaApplied: false,
          inertia: null
        });
      }
    }
    dotsRef.current = dots;
  }, [dotSize, gap]);

  const wakeRef = useRef<() => void>(() => {});

  useEffect(() => {
    if (!circlePath || paused) return;

    let rafId: number = 0;
    let isRunning = false;
    let idleCounter = 0;
    const proxSq = proximity * proximity;

    const draw = (now: number) => {
      rafId = 0;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const { x: px, y: py } = pointerRef.current;
      let hasActiveAnimation = false;

      for (const dot of dotsRef.current) {
        // Advance GSAP Inertia deceleration & elastic return
        if (dot.inertia) {
          hasActiveAnimation = true;
          const inet = dot.inertia;
          const elapsed = (now - inet.startTime) / 1000;

          if (inet.phase === 'coast') {
            if (elapsed < inet.coastDuration) {
              // Coasting deceleration: s(t) = v0 * t - 0.5 * resistance * t^2
              const s = inet.speed * elapsed - 0.5 * resistance * elapsed * elapsed;
              dot.xOffset = inet.dirX * s;
              dot.yOffset = inet.dirY * s;
            } else {
              // Transition to elastic snap-back
              inet.phase = 'return';
              inet.startTime = now;
              dot.xOffset = inet.peakX;
              dot.yOffset = inet.peakY;
            }
          } else {
            // Return phase: elastic.out(1, 0.75) over returnDuration (1.5s)
            const returnElapsed = (now - inet.startTime) / 1000;
            const p = Math.min(1, returnElapsed / inet.returnDuration);
            const ease = easeElasticOut(p);
            dot.xOffset = inet.peakX * (1 - ease);
            dot.yOffset = inet.peakY * (1 - ease);

            if (p >= 1 || (Math.abs(dot.xOffset) < 0.04 && Math.abs(dot.yOffset) < 0.04)) {
              dot.xOffset = 0;
              dot.yOffset = 0;
              dot.inertia = null;
              dot._inertiaApplied = false;
            }
          }
        }

        const ox = dot.cx + dot.xOffset;
        const oy = dot.cy + dot.yOffset;
        const dx = dot.cx - px;
        const dy = dot.cy - py;
        const dsq = dx * dx + dy * dy;

        let dotStyle = baseColor;
        if (dsq <= proxSq) {
          const dist = Math.sqrt(dsq);
          const t = 1 - dist / proximity;
          const r = Math.round(baseRgb.r + (activeRgb.r - baseRgb.r) * t);
          const g = Math.round(baseRgb.g + (activeRgb.g - baseRgb.g) * t);
          const b = Math.round(baseRgb.b + (activeRgb.b - baseRgb.b) * t);
          dotStyle = `rgb(${r},${g},${b})`;
        }

        ctx.save();
        ctx.translate(ox, oy);
        ctx.fillStyle = dotStyle;
        ctx.fill(circlePath);
        ctx.restore();
      }

      if (hasActiveAnimation) {
        idleCounter = 0;
        rafId = requestAnimationFrame(draw);
      } else {
        idleCounter++;
        if (idleCounter < 3) {
          rafId = requestAnimationFrame(draw);
        } else {
          isRunning = false; // Sleep animation loop when resting
        }
      }
    };

    const wake = () => {
      idleCounter = 0;
      if (!isRunning) {
        isRunning = true;
        rafId = requestAnimationFrame(draw);
      }
    };
    wakeRef.current = wake;

    wake();
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      isRunning = false;
    };
  }, [proximity, baseColor, activeRgb, baseRgb, circlePath, paused, resistance]);

  useEffect(() => {
    buildGrid();
    let ro: ResizeObserver | null = null;
    if ('ResizeObserver' in window) {
      ro = new ResizeObserver(buildGrid);
      if (wrapperRef.current) ro.observe(wrapperRef.current);
    } else {
      window.addEventListener('resize', buildGrid);
    }
    return () => {
      if (ro) ro.disconnect();
      else window.removeEventListener('resize', buildGrid);
    };
  }, [buildGrid]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const now = performance.now();
      const pr = pointerRef.current;
      const dt = pr.lastTime ? now - pr.lastTime : 16;
      const dx = e.clientX - pr.lastX;
      const dy = e.clientY - pr.lastY;
      let vx = (dx / dt) * 1000;
      let vy = (dy / dt) * 1000;
      let speed = Math.hypot(vx, vy);
      if (speed > maxSpeed) {
        const scale = maxSpeed / speed;
        vx *= scale;
        vy *= scale;
        speed = maxSpeed;
      }
      pr.lastTime = now;
      pr.lastX = e.clientX;
      pr.lastY = e.clientY;
      pr.vx = vx;
      pr.vy = vy;
      pr.speed = speed;

      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      pr.x = e.clientX - rect.left;
      pr.y = e.clientY - rect.top;

      wakeRef.current();

      // Evaluate proximity and velocity trigger
      for (const dot of dotsRef.current) {
        const dist = Math.hypot(dot.cx - pr.x, dot.cy - pr.y);

        if (speed > speedTrigger && dist < proximity && !dot._inertiaApplied) {
          dot._inertiaApplied = true;

          // Velocity impulse matching reference (pushX = dot.cx - pr.x + vx * 0.005)
          const pushX = dot.cx - pr.x + vx * 0.005;
          const pushY = dot.cy - pr.y + vy * 0.005;
          const pushSpeed = Math.hypot(pushX, pushY);

          if (pushSpeed > 1) {
            const dirX = pushX / pushSpeed;
            const dirY = pushY / pushSpeed;
            // Coast duration until velocity reaches zero under resistance (750)
            const coastDuration = pushSpeed / resistance;
            // Total inertia displacement: v^2 / (2 * a)
            const peakDist = (pushSpeed * pushSpeed) / (2 * resistance);

            dot.inertia = {
              speed: pushSpeed,
              dirX,
              dirY,
              coastDuration,
              peakDist,
              peakX: dirX * peakDist,
              peakY: dirY * peakDist,
              startTime: now,
              phase: 'coast',
              returnDuration
            };
          } else {
            dot._inertiaApplied = false;
          }
        }
      }
    };

    const onClick = (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      const now = performance.now();
      wakeRef.current();

      for (const dot of dotsRef.current) {
        const dist = Math.hypot(dot.cx - cx, dot.cy - cy);

        if (dist < shockRadius && !dot._inertiaApplied) {
          dot._inertiaApplied = true;
          const falloff = Math.max(0, 1 - dist / shockRadius);
          const pushX = (dot.cx - cx) * shockStrength * falloff;
          const pushY = (dot.cy - cy) * shockStrength * falloff;
          const pushSpeed = Math.hypot(pushX, pushY);

          if (pushSpeed > 1) {
            const dirX = pushX / pushSpeed;
            const dirY = pushY / pushSpeed;
            const coastDuration = pushSpeed / resistance;
            const peakDist = (pushSpeed * pushSpeed) / (2 * resistance);

            dot.inertia = {
              speed: pushSpeed,
              dirX,
              dirY,
              coastDuration,
              peakDist,
              peakX: dirX * peakDist,
              peakY: dirY * peakDist,
              startTime: now,
              phase: 'coast',
              returnDuration
            };
          } else {
            dot._inertiaApplied = false;
          }
        }
      }
    };

    const throttledMove = throttle(onMove, 50);
    window.addEventListener('mousemove', throttledMove, { passive: true });
    window.addEventListener('click', onClick);

    return () => {
      window.removeEventListener('mousemove', throttledMove);
      window.removeEventListener('click', onClick);
    };
  }, [maxSpeed, speedTrigger, proximity, resistance, returnDuration, shockRadius, shockStrength]);

  return (
    <section
      aria-hidden="true"
      className={`flex items-center justify-center h-full w-full relative ${className}`}
      style={style}
    >
      <div ref={wrapperRef} className="w-full h-full relative">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
          aria-hidden="true"
        />
      </div>
    </section>
  );
};

export default DotGrid;

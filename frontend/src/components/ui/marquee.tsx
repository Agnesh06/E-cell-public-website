import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface MarqueeProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  reverse?: boolean;
  pauseOnHover?: boolean;
  children?: React.ReactNode;
  duration?: number;
  speed?: number;
}

export function Marquee({
  className,
  reverse = false,
  pauseOnHover = true,
  children,
  duration = 32,
  speed,
  style,
  ...props
}: MarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const firstSetRef = useRef<HTMLDivElement>(null);

  const [isDragging, setIsDragging] = useState(false);

  // Interaction tracking refs
  const isPausedRef = useRef(false);
  const isHoveredRef = useRef(false);
  const isTouchingRef = useRef(false);
  const isDraggingRef = useRef(false);
  const isProgrammaticScrollRef = useRef(false);
  const startXRef = useRef(0);
  const startScrollLeftRef = useRef(0);
  const hasMovedRef = useRef(false);
  const resumeTimerRef = useRef<number | null>(null);
  const reducedMotionRef = useRef(false);

  // Pause helper
  const pause = () => {
    if (resumeTimerRef.current !== null) {
      window.clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }
    isPausedRef.current = true;
  };

  // Immediate resume helper (0ms delay)
  const resumeImmediately = () => {
    if (resumeTimerRef.current !== null) {
      window.clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }
    if (!isHoveredRef.current && !isTouchingRef.current && !isDraggingRef.current) {
      isPausedRef.current = false;
    }
  };

  // Debounced resume helper (e.g. for wheel events, max 100ms)
  const scheduleResume = (delay = 100) => {
    if (resumeTimerRef.current !== null) {
      window.clearTimeout(resumeTimerRef.current);
    }
    resumeTimerRef.current = window.setTimeout(() => {
      resumeTimerRef.current = null;
      if (!isHoveredRef.current && !isTouchingRef.current && !isDraggingRef.current) {
        isPausedRef.current = false;
      }
    }, delay);
  };

  // Prefers-reduced-motion listener
  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotionRef.current = mql.matches;
    const handleChange = (e: MediaQueryListEvent) => {
      reducedMotionRef.current = e.matches;
    };
    mql.addEventListener("change", handleChange);
    return () => {
      mql.removeEventListener("change", handleChange);
    };
  }, []);

  // RequestAnimationFrame auto-movement
  useEffect(() => {
    let lastTime: number | null = null;
    let rafId: number;

    const animate = (currentTime: number) => {
      if (lastTime !== null) {
        const deltaMs = currentTime - lastTime;
        // Cap dt to 100ms in case tab was backgrounded or frame rate stuttered
        const dt = Math.min(deltaMs, 100) / 1000;

        if (!isPausedRef.current && !reducedMotionRef.current) {
          const el = containerRef.current;
          const first = firstSetRef.current;
          if (el && first) {
            const setWidth = first.offsetWidth;
            if (setWidth > 0) {
              // Target ~0.5 - 1 px per frame (at 60fps, ~30-60 px/s)
              const pxPerSec = speed ?? setWidth / (duration || 32);
              const step = pxPerSec * dt * (reverse ? -1 : 1);

              let nextScroll = el.scrollLeft + step;
              while (nextScroll >= setWidth) {
                nextScroll -= setWidth;
              }
              while (nextScroll < 0) {
                nextScroll += setWidth;
              }

              isProgrammaticScrollRef.current = true;
              el.scrollLeft = nextScroll;
            }
          }
        }
      }
      lastTime = currentTime;
      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      if (resumeTimerRef.current !== null) {
        window.clearTimeout(resumeTimerRef.current);
      }
    };
  }, [duration, speed, reverse]);

  // Handle native scroll events (wheel, trackpad, touch swipe, scrollbar)
  const handleScroll = () => {
    if (isProgrammaticScrollRef.current) {
      isProgrammaticScrollRef.current = false;
      return;
    }

    const el = containerRef.current;
    const first = firstSetRef.current;
    if (!el || !first) return;
    const setWidth = first.offsetWidth;
    if (setWidth <= 0) return;

    // Seamless loop wrapping
    while (el.scrollLeft >= setWidth) {
      el.scrollLeft -= setWidth;
    }
    while (el.scrollLeft < 0) {
      el.scrollLeft += setWidth;
    }

    // Only pause if user is actively touching or dragging with mouse
    if (isTouchingRef.current || isDraggingRef.current) {
      pause();
    }
  };

  // Wheel event listener: pause and wrap before boundary clamping
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    pause();
    scheduleResume(100);

    const el = containerRef.current;
    const first = firstSetRef.current;
    if (!el || !first) return;
    const setWidth = first.offsetWidth;
    if (setWidth <= 0) return;

    if (e.deltaX < 0 && el.scrollLeft <= 5) {
      el.scrollLeft += setWidth;
    } else if (e.deltaX > 0 && el.scrollLeft >= setWidth - 5) {
      el.scrollLeft -= setWidth;
    }
  };

  // Pointer hover handlers (ignore on touch devices without hover capability)
  const handleMouseEnter = () => {
    if (pauseOnHover) {
      if (typeof window !== "undefined" && window.matchMedia && !window.matchMedia("(hover: hover)").matches) {
        return;
      }
      isHoveredRef.current = true;
      pause();
    }
  };

  const handleMouseLeave = () => {
    if (pauseOnHover) {
      isHoveredRef.current = false;
      resumeImmediately();
    }
  };

  // Pointer drag handlers (click-drag applies to mouse pointers only)
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "touch") {
      isTouchingRef.current = true;
      pause();
      return;
    }
    if (e.pointerType !== "mouse" || e.button !== 0) return; // Left click mouse only
    const el = containerRef.current;
    if (!el) return;

    isDraggingRef.current = true;
    hasMovedRef.current = false;
    startXRef.current = e.clientX;
    startScrollLeftRef.current = el.scrollLeft;

    pause();
    setIsDragging(true);

    try {
      el.setPointerCapture(e.pointerId);
    } catch {
      // Ignore
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || !isDraggingRef.current) return;
    const el = containerRef.current;
    const first = firstSetRef.current;
    if (!el || !first) return;

    const dx = e.clientX - startXRef.current;
    if (Math.abs(dx) > 3) {
      hasMovedRef.current = true;
    }

    const setWidth = first.offsetWidth;
    let nextScroll = startScrollLeftRef.current - dx;
    if (setWidth > 0) {
      while (nextScroll < 0) nextScroll += setWidth;
      while (nextScroll >= setWidth) nextScroll -= setWidth;
    }

    isProgrammaticScrollRef.current = true;
    el.scrollLeft = nextScroll;
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "touch") {
      isTouchingRef.current = false;
      resumeImmediately();
      return;
    }
    if (e.pointerType !== "mouse" || !isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsDragging(false);

    const el = containerRef.current;
    if (el) {
      try {
        el.releasePointerCapture(e.pointerId);
      } catch {
        // Ignore
      }
    }

    resumeImmediately();
  };

  const handlePointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    handlePointerUp(e);
  };

  // Native touch handlers for mobile swipe
  const handleTouchStart = () => {
    isTouchingRef.current = true;
    pause();
  };

  const handleTouchEnd = () => {
    isTouchingRef.current = false;
    resumeImmediately();
  };

  const handleTouchCancel = () => {
    isTouchingRef.current = false;
    resumeImmediately();
  };

  // Prevent click triggering on children if user dragged with mouse
  const handleClickCapture = (e: React.MouseEvent<HTMLDivElement>) => {
    if (hasMovedRef.current) {
      e.stopPropagation();
      e.preventDefault();
      hasMovedRef.current = false;
    }
  };

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      onWheel={handleWheel}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
      onClickCapture={handleClickCapture}
      className={cn(
        "marquee-container relative w-full overflow-x-auto overflow-y-hidden select-none py-2 touch-pan-x",
        "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
        isDragging ? "cursor-grabbing" : "cursor-grab",
        className
      )}
      style={{
        touchAction: "pan-x",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        ...style,
      }}
      {...props}
    >
      <div className="marquee-track flex flex-row flex-nowrap w-max shrink-0 items-center">
        <div ref={firstSetRef} className="flex flex-row flex-nowrap shrink-0 items-center">
          {children}
        </div>
        <div className="flex flex-row flex-nowrap shrink-0 items-center" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Marquee;

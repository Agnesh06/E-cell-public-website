/**
 * useFitCardText — binary-search font-size fitter for card grids.
 *
 * Writes CSS custom properties --card-body-size and --card-title-size
 * on a beat container element. The fit runs ONLY on mount, resize
 * (ResizeObserver on the stage), document.fonts.ready, and orientationchange.
 * Never on scroll, never per animation frame.
 */
import { useEffect, useRef } from 'react';

// ---------------------------------------------------------------------------
// Pure helper — unit-testable, no DOM dependency
// ---------------------------------------------------------------------------

/**
 * Finds the largest size in [min, max] such that fits(size) returns true.
 * Uses ~8 iterations of binary search.
 * - If fits(min) is false, returns min (content can't fit even at the smallest size).
 * - If fits(max) is true, returns max.
 */
export function binarySearchFit(
  min: number,
  max: number,
  fits: (size: number) => boolean,
  iterations = 8
): number {
  if (!fits(min)) return min;
  if (fits(max)) return max;

  let lo = min;
  let hi = max;
  for (let i = 0; i < iterations; i++) {
    const mid = (lo + hi) / 2;
    if (fits(mid)) {
      lo = mid;
    } else {
      hi = mid;
    }
  }
  return lo;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Minimum body font size in px — never go below this */
const BODY_MIN_PX = 14;
/** Maximum body font size in px */
const BODY_MAX_PX = 24; // 1.5rem at 16px base
/** Title is proportional to body */
const TITLE_RATIO = 1.3;
/** Maximum title font size in px */
const TITLE_MAX_PX = 32; // 2rem at 16px base
/** Minimum card padding in px (used when tightening under pressure) */
const PAD_MIN_PX = 12;
/** Normal card padding in px */
const PAD_NORMAL_PX = 20;

// ---------------------------------------------------------------------------
// DOM helpers
// ---------------------------------------------------------------------------

/**
 * Apply font sizes and optional padding to a container element,
 * then check whether any card's content overflows.
 *
 * We measure with offsetHeight/scrollHeight (not getBoundingClientRect)
 * so that scale/rotateX transforms during entrance animations don't skew results.
 */
function applyAndCheck(
  container: HTMLElement,
  bodySizePx: number,
  paddingPx: number
): boolean {
  const titleSizePx = Math.min(bodySizePx * TITLE_RATIO, TITLE_MAX_PX);
  container.style.setProperty('--card-body-size', `${bodySizePx}px`);
  container.style.setProperty('--card-title-size', `${titleSizePx}px`);
  container.style.setProperty('--card-pad', `${paddingPx}px`);

  // Force layout so measurements are accurate
  void container.offsetHeight;

  // Check every card's text elements for overflow
  const cards = container.querySelectorAll<HTMLElement>('.card-spotlight');
  for (const card of cards) {
    const textEls = card.querySelectorAll<HTMLElement>('h4, p');
    for (const el of textEls) {
      // scrollHeight > clientHeight means vertical overflow
      if (el.scrollHeight > el.clientHeight + 2) return false;
      // scrollWidth > clientWidth means horizontal overflow
      if (el.scrollWidth > el.clientWidth + 2) return false;
    }
  }
  return true;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export interface UseFitCardTextOptions {
  /** ref to the container that wraps ALL beat grids (the sticky stage) */
  stageRef: React.RefObject<HTMLElement | null>;
  /** Array of refs, one per beat container element */
  beatRefs: React.RefObject<HTMLElement | null>[];
}

export function useFitCardText({ stageRef, beatRefs }: UseFitCardTextOptions): void {
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    function runFit() {
      for (const ref of beatRefs) {
        const container = ref.current;
        if (!container) continue;

        // Try normal padding first; fall back to tight padding if needed
        const fitsWithNormalPad = (size: number) =>
          applyAndCheck(container, size, PAD_NORMAL_PX);
        const fitsWithTightPad = (size: number) =>
          applyAndCheck(container, size, PAD_MIN_PX);

        let chosen = binarySearchFit(BODY_MIN_PX, BODY_MAX_PX, fitsWithNormalPad);

        // If even at BODY_MIN with normal padding it overflows, try tighter padding
        if (!applyAndCheck(container, BODY_MIN_PX, PAD_NORMAL_PX)) {
          chosen = binarySearchFit(BODY_MIN_PX, BODY_MAX_PX, fitsWithTightPad);
          applyAndCheck(container, chosen, PAD_MIN_PX);
        } else {
          applyAndCheck(container, chosen, PAD_NORMAL_PX);
        }
      }
    }

    function schedule() {
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(runFit);
    }

    // Initial fit after fonts load
    if (document.fonts?.ready) {
      document.fonts.ready.then(schedule);
    } else {
      schedule();
    }

    // Resize via ResizeObserver on the stage
    const stage = stageRef.current;
    let ro: ResizeObserver | null = null;
    if (stage) {
      ro = new ResizeObserver(schedule);
      ro.observe(stage);
    }

    // Orientation change
    window.addEventListener('orientationchange', schedule, { passive: true });

    return () => {
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
      ro?.disconnect();
      window.removeEventListener('orientationchange', schedule);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stageRef, beatRefs]);
}

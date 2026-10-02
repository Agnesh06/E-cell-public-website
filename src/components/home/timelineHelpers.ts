import { BeatConfig } from '@/lib/constants';

export interface CardTiming {
  popStart: number;
  popEnd: number;
  exitStart: number;
  exitEnd: number;
}

export interface HeadingTiming {
  enterStart: number;
  enterEnd: number;
  exitStart: number;
  exitEnd: number;
  hasExit: boolean;
}

/**
 * Validates that beats are contiguous, strictly ordered, and span 0.0 to 1.0.
 */
export function validateBeats(beats: readonly BeatConfig[]): boolean {
  if (beats.length === 0) return false;
  if (Math.abs(beats[0].start - 0.0) > 1e-6) return false;
  if (Math.abs(beats[beats.length - 1].end - 1.0) > 1e-6) return false;

  for (let i = 0; i < beats.length; i++) {
    const beat = beats[i];
    if (beat.start >= beat.end) return false;
    if (i > 0) {
      const prev = beats[i - 1];
      if (Math.abs(beat.start - prev.end) > 1e-6) return false;
    }
  }
  return true;
}

/**
 * Heading enters in first 15% of range, exits in last 15% (if hasExit).
 */
export function getHeadingRange(beat: BeatConfig): HeadingTiming {
  const span = beat.end - beat.start;
  const enterStart = beat.start;
  const enterEnd = beat.start + span * 0.15;
  const exitStart = beat.hasExit ? beat.end - span * 0.15 : beat.end;
  const exitEnd = beat.end;

  return {
    enterStart,
    enterEnd,
    exitStart,
    exitEnd,
    hasExit: beat.hasExit,
  };
}

/**
 * Calculates pop-in range for card staggered between 15% and 70% of beat span.
 * Hold till 85% (beat.end - span * 0.15), then exit in last 15%.
 */
export function getCardRange(
  beat: BeatConfig,
  cardIndex: number,
  totalCards: number
): CardTiming {
  const span = beat.end - beat.start;
  // Card pop-in starts between 15% and 70%
  const popStartRatio =
    totalCards <= 1
      ? 0.15
      : 0.15 + (cardIndex / (totalCards - 1 || 1)) * 0.35; // Staggers start between 15% and 50%
  const popDurationRatio = 0.15; // 15% pop duration
  const popStart = beat.start + span * popStartRatio;
  const popEnd = Math.min(popStart + span * popDurationRatio, beat.start + span * 0.70);

  const exitStart = beat.hasExit ? beat.end - span * 0.15 : beat.end;
  const exitEnd = beat.end;

  return {
    popStart,
    popEnd,
    exitStart,
    exitEnd,
  };
}

/**
 * Strict monotonic bulb glow intensity calculation.
 * 0 to 0.12: 0 (unlit)
 * 0.12 to 1.0: strictly monotonically increasing up to exactly 1.0 at progress 1.0.
 */
export function calculateGlowIntensity(progress: number): number {
  if (progress <= 0.12) return 0;
  if (progress >= 1.0) return 1;
  const normalized = (progress - 0.12) / (1.0 - 0.12);
  // Strictly monotonic curve (smooth cubic-bezier style or ease-in-out)
  return Math.min(1, Math.max(0, Math.pow(normalized, 1.2)));
}

/**
 * Returns the index of the currently active beat.
 */
export function getActiveBeatIndex(
  progress: number,
  beats: readonly BeatConfig[]
): number {
  const clamped = Math.max(0, Math.min(1, progress));
  for (let i = 0; i < beats.length; i++) {
    const beat = beats[i];
    // For last beat, include progress === 1.0
    if (i === beats.length - 1) {
      if (clamped >= beat.start && clamped <= beat.end) {
        return i;
      }
    } else if (clamped >= beat.start && clamped < beat.end) {
      return i;
    }
  }
  return beats.length - 1;
}


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
  const enterEnd = beat.start + span * 0.22;
  const exitStart = beat.hasExit ? beat.end - span * 0.22 : beat.end;
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
  // Delay card pop-in a little so the scene feels more natural and editorial.
  const popStartRatio =
    totalCards <= 1
      ? 0.22
      : 0.22 + (cardIndex / (totalCards - 1 || 1)) * 0.28;
  const popDurationRatio = 0.18;
  const popStart = beat.start + span * popStartRatio;
  const popEnd = Math.min(popStart + span * popDurationRatio, beat.start + span * 0.70);

  const exitStart = beat.hasExit ? beat.end - span * 0.22 : beat.end;
  const exitEnd = beat.end;

  return {
    popStart,
    popEnd,
    exitStart,
    exitEnd,
  };
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


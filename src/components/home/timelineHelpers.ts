import { cubicBezier } from 'framer-motion';
import { BeatConfig } from '@/lib/constants';

export interface CardTiming {
  enterStart: number;
  enterEnd: number;
  opacityEnd: number;
  holdStart: number;
  holdEnd: number;
  holdMid: number;
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

export interface CardPose {
  y: number;
  scale: number;
  rotateX: number;
  opacity: number;
  accentScale: number;
  sheenX: number;
  sheenOpacity: number;
  shadowOpacity: number;
}

export interface HeadingPose {
  y: number;
  opacity: number;
}

export const ENTER_EASE = cubicBezier(0.22, 1, 0.36, 1);
export const EXIT_EASE = cubicBezier(0.55, 0, 1, 0.45);
export const LINEAR_EASE = cubicBezier(0, 0, 1, 1);

const CARD_ENTER_START = 0.12;
const CARD_ENTER_STAGGER = 0.06;
const CARD_ENTER_DURATION = 0.18;
const CARD_OPACITY_DURATION = CARD_ENTER_DURATION * 0.6;
const CARD_HOLD_END = 0.82;
const CARD_HOLD_MOTION_END = 0.80;
const CARD_EXIT_STAGGER = 0.02;
const CARD_EXIT_END = 0.97;

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
 * Headings enter early and clear before the next beat takes over.
 */
export function getHeadingRange(beat: BeatConfig): HeadingTiming {
  const span = beat.end - beat.start;
  const enterStart = beat.start;
  const enterEnd = beat.start + span * 0.14;
  const exitStart = beat.hasExit ? beat.start + span * CARD_HOLD_END : beat.end;
  const exitEnd = beat.hasExit ? beat.start + span * CARD_EXIT_END : beat.end;

  return {
    enterStart,
    enterEnd,
    exitStart,
    exitEnd,
    hasExit: beat.hasExit,
  };
}

export function getHeadingPose(progress: number, beat: BeatConfig): HeadingPose {
  const timing = getHeadingRange(beat);
  const enter = easedProgress(progress, timing.enterStart, timing.enterEnd, ENTER_EASE);
  const exit = timing.hasExit
    ? easedProgress(progress, timing.exitStart, timing.exitEnd, EXIT_EASE)
    : 0;

  return {
    y: 24 * (1 - enter),
    opacity: (progress < timing.enterStart ? 0 : enter) * (1 - exit),
  };
}

/**
 * Staggers card landings while leaving at least 35% of each beat for reading.
 */
export function getCardRange(
  beat: BeatConfig,
  cardIndex: number,
  totalCards: number
): CardTiming {
  const span = beat.end - beat.start;
  const enterStart = beat.start + span * (CARD_ENTER_START + cardIndex * CARD_ENTER_STAGGER);
  const enterEnd = enterStart + span * CARD_ENTER_DURATION;
  const holdStart = beat.start + span * (
    CARD_ENTER_START + Math.max(0, totalCards - 1) * CARD_ENTER_STAGGER + CARD_ENTER_DURATION
  );
  const holdEnd = beat.hasExit ? beat.start + span * CARD_HOLD_MOTION_END : beat.end;
  const exitStart = beat.hasExit
    ? beat.start + span * (CARD_HOLD_END + cardIndex * CARD_EXIT_STAGGER)
    : beat.end;
  const exitEnd = beat.hasExit ? beat.start + span * CARD_EXIT_END : beat.end;

  return {
    enterStart,
    enterEnd,
    opacityEnd: enterStart + span * CARD_OPACITY_DURATION,
    holdStart,
    holdEnd,
    holdMid: (holdStart + holdEnd) / 2,
    exitStart,
    exitEnd,
  };
}

export function getCardPose(
  progress: number,
  beat: BeatConfig,
  cardIndex: number,
  totalCards: number,
  compactMotion = false
): CardPose {
  const timing = getCardRange(beat, cardIndex, totalCards);
  const distance = compactMotion ? 32 : 56;
  const rotation = compactMotion ? 0 : 10;
  const drift = (cardIndex % 2 === 0 ? 1 : -1) * Math.min(8, (cardIndex + 1) * 2);
  const enter = easedProgress(progress, timing.enterStart, timing.enterEnd, ENTER_EASE);
  const opacityEnter = easedProgress(progress, timing.enterStart, timing.opacityEnd, ENTER_EASE);
  const exit = timing.exitEnd > timing.exitStart
    ? easedProgress(progress, timing.exitStart, timing.exitEnd, EXIT_EASE)
    : 0;

  let y = distance * (1 - enter);
  if (progress >= timing.holdStart && progress < timing.holdMid) {
    const driftIn = (progress - timing.holdStart) / (timing.holdMid - timing.holdStart);
    y = drift * Math.sin(Math.PI * driftIn);
  } else if (progress >= timing.holdMid && progress < timing.exitStart) {
    const driftOut = (progress - timing.holdMid) / (timing.exitStart - timing.holdMid);
    y = -drift * Math.sin(Math.PI * driftOut);
  }
  if (progress === timing.holdMid) y = 0;
  if (progress >= timing.exitStart && timing.exitEnd > timing.exitStart) {
    y = -36 * exit;
  }

  let scale = 0.94 + 0.06 * enter;
  let rotateX = rotation * (1 - enter);
  if (progress >= timing.exitStart && timing.exitEnd > timing.exitStart) {
    scale = 1 - 0.03 * exit;
    rotateX = -6 * exit;
  }

  let opacity = progress < timing.enterStart ? 0 : opacityEnter;
  if (progress >= timing.enterEnd) opacity = 1;
  if (progress >= timing.exitStart && timing.exitEnd > timing.exitStart) opacity = 1 - exit;
  if (progress >= timing.exitEnd && timing.exitEnd > timing.exitStart) opacity = 0;

  const sheenStart = timing.enterStart + (timing.enterEnd - timing.enterStart) * 0.65;
  const sheenProgress = easedProgress(progress, sheenStart, timing.enterEnd, LINEAR_EASE);
  const sheenOpacity = progress < sheenStart || progress >= timing.enterEnd
    ? 0
    : Math.sin(sheenProgress * Math.PI) * 0.7;

  return {
    y,
    scale,
    rotateX,
    opacity,
    accentScale: enter,
    sheenX: -1.5 + 4 * sheenProgress,
    sheenOpacity,
    shadowOpacity: opacity,
  };
}

export function getHeroPose(progress: number, beat: BeatConfig): HeadingPose {
  const exit = easedProgress(progress, beat.start, beat.end, EXIT_EASE);
  return {
    y: progress <= beat.start ? 0 : -80 * exit,
    opacity: 1 - exit,
  };
}

function easedProgress(
  progress: number,
  start: number,
  end: number,
  ease: (value: number) => number
): number {
  if (progress <= start) return 0;
  if (progress >= end) return 1;
  return ease((progress - start) / (end - start));
}

export function getActiveBeatIndexWithHysteresis(
  progress: number,
  beats: readonly BeatConfig[],
  currentIndex: number,
  hysteresis = 0.01
): number {
  const clamped = Math.max(0, Math.min(1, progress));
  let nextIndex = Math.max(0, Math.min(beats.length - 1, currentIndex));

  while (nextIndex < beats.length - 1 && clamped >= beats[nextIndex].end + hysteresis) {
    nextIndex += 1;
  }
  while (nextIndex > 0 && clamped < beats[nextIndex].start - hysteresis) {
    nextIndex -= 1;
  }

  return nextIndex;
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


import { describe, it, expect } from 'vitest';
import { BEATS } from '@/lib/constants';
import {
  validateBeats,
  getHeadingRange,
  getCardRange,
  getCardPose,
  getHeadingPose,
  getHeroPose,
  getActiveBeatIndex,
  getActiveBeatIndexWithHysteresis,
} from './timelineHelpers';

describe('timelineHelpers', () => {
  it('beats are ordered, contiguous, and the last beat ends at exactly 1', () => {
    expect(validateBeats(BEATS)).toBe(true);

    expect(BEATS[0].start).toBe(0.0);
    expect(BEATS[BEATS.length - 1].end).toBe(1.0);

    for (let i = 0; i < BEATS.length; i++) {
      expect(BEATS[i].start).toBeLessThan(BEATS[i].end);
      if (i > 0) {
        expect(BEATS[i].start).toBeCloseTo(BEATS[i - 1].end, 5);
      }
    }
  });

  it("each card's eased phase remains inside its beat with at least 35% reading hold", () => {
    const cardBeats = BEATS.filter((b) => b.totalCards > 0);

    for (const beat of cardBeats) {
      for (let i = 0; i < beat.totalCards; i++) {
        const { enterStart, enterEnd, opacityEnd, holdStart, holdMid, exitStart, exitEnd } = getCardRange(
          beat,
          i,
          beat.totalCards
        );

        const span = beat.end - beat.start;
        expect(enterStart).toBeGreaterThanOrEqual(beat.start);
        expect(enterEnd).toBeGreaterThan(enterStart);
        expect(enterEnd).toBeLessThanOrEqual(beat.end);
        expect(opacityEnd).toBeGreaterThan(enterStart);
        expect(opacityEnd).toBeLessThan(enterEnd);
        expect(holdMid).toBeGreaterThan(holdStart);
        expect(beat.end - holdMid).toBeGreaterThanOrEqual(span * 0.35);

        if (beat.hasExit) {
          expect(exitStart).toBeGreaterThan(holdMid);
          expect(exitEnd).toBeLessThan(beat.end);
          expect(getCardPose(exitEnd, beat, i, beat.totalCards).opacity).toBe(0);
        }
      }
    }
  });

  it('heading enter and exit phases stay within each unchanged beat range', () => {
    for (const beat of BEATS) {
      const { enterStart, enterEnd, exitStart, exitEnd, hasExit } =
        getHeadingRange(beat);
      const span = beat.end - beat.start;

      expect(enterStart).toBe(beat.start);
      expect(enterEnd).toBeCloseTo(beat.start + span * 0.14, 5);

      if (hasExit) {
        expect(exitStart).toBeCloseTo(beat.start + span * 0.82, 5);
        expect(exitEnd).toBeCloseTo(beat.start + span * 0.97, 5);
      } else {
        expect(exitStart).toBe(beat.end);
        expect(exitEnd).toBe(beat.end);
      }
    }
  });

  it('keeps opacity monotonic on enter and every pose continuous across dense progress samples', () => {
    for (const beat of [BEATS[1], BEATS[4]]) {
      for (let cardIndex = 0; cardIndex < beat.totalCards; cardIndex += 1) {
        const timing = getCardRange(beat, cardIndex, beat.totalCards);
        let previous = getCardPose(0, beat, cardIndex, beat.totalCards);
        let previousOpacity = getCardPose(timing.enterStart, beat, cardIndex, beat.totalCards).opacity;

        for (let sampleIndex = 1; sampleIndex <= 4000; sampleIndex += 1) {
          const progress = beat.start + (beat.end - beat.start) * sampleIndex / 4000;
          const pose = getCardPose(progress, beat, cardIndex, beat.totalCards);
          expect(
            Math.abs(pose.y - previous.y),
            `Y jump ${Math.abs(pose.y - previous.y)} at progress ${progress} in ${beat.id}, card ${cardIndex}`
          ).toBeLessThan(3);
          expect(Math.abs(pose.scale - previous.scale)).toBeLessThan(0.03);
          expect(Math.abs(pose.rotateX - previous.rotateX)).toBeLessThan(2.5);
          expect(Math.abs(pose.opacity - previous.opacity)).toBeLessThan(0.1);
          if (progress <= timing.opacityEnd) {
            expect(pose.opacity).toBeGreaterThanOrEqual(previousOpacity - 1e-9);
            previousOpacity = pose.opacity;
          }
          previous = pose;
        }

        const held = getCardPose(timing.holdMid, beat, cardIndex, beat.totalCards);
        expect(held.y).toBe(0);
        expect(held.scale).toBe(1);
        expect(held.rotateX).toBe(0);
        expect(held.opacity).toBe(1);
      }
    }
  });

  it('keeps outgoing and incoming cards below the overlap threshold across every beat boundary', () => {
    for (let beatIndex = 1; beatIndex < BEATS.length - 1; beatIndex += 1) {
      const outgoingBeat = BEATS[beatIndex];
      const incomingBeat = BEATS[beatIndex + 1];

      for (let sampleIndex = 0; sampleIndex <= 2000; sampleIndex += 1) {
        const progress = outgoingBeat.start +
          (incomingBeat.end - outgoingBeat.start) * sampleIndex / 2000;
        for (let outgoingIndex = 0; outgoingIndex < outgoingBeat.totalCards; outgoingIndex += 1) {
          const outgoingOpacity = getCardPose(
            progress,
            outgoingBeat,
            outgoingIndex,
            outgoingBeat.totalCards
          ).opacity;

          for (let incomingIndex = 0; incomingIndex < incomingBeat.totalCards; incomingIndex += 1) {
            const incomingOpacity = getCardPose(
              progress,
              incomingBeat,
              incomingIndex,
              incomingBeat.totalCards
            ).opacity;
            expect(outgoingOpacity > 0.35 && incomingOpacity > 0.35).toBe(false);
          }
        }
      }
    }
  });

  it('keeps the hero visible at zero and the final heading settled at progress one', () => {
    expect(getHeroPose(0, BEATS[0])).toEqual({ y: 0, opacity: 1 });
    expect(getHeadingPose(1, BEATS[6])).toEqual({ y: 0, opacity: 1 });
  });

  it('correctly identifies the active beat for given progress values', () => {
    expect(getActiveBeatIndex(0.0, BEATS)).toBe(0);
    expect(getActiveBeatIndex(0.05, BEATS)).toBe(0);
    expect(getActiveBeatIndex(0.10, BEATS)).toBe(1);
    expect(getActiveBeatIndex(0.24, BEATS)).toBe(2);
    expect(getActiveBeatIndex(0.95, BEATS)).toBe(6);
    expect(getActiveBeatIndex(1.0, BEATS)).toBe(6);
  });

  it('keeps the active beat stable inside the 0.01 boundary hysteresis band', () => {
    expect(getActiveBeatIndexWithHysteresis(0.10, BEATS, 0)).toBe(0);
    expect(getActiveBeatIndexWithHysteresis(0.111, BEATS, 0)).toBe(1);
    expect(getActiveBeatIndexWithHysteresis(0.105, BEATS, 1)).toBe(1);
    expect(getActiveBeatIndexWithHysteresis(0.089, BEATS, 1)).toBe(0);
  });
});


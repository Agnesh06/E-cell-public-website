import { describe, it, expect } from 'vitest';
import { BEATS } from '@/lib/constants';
import {
  validateBeats,
  getHeadingRange,
  getCardRange,
  getActiveBeatIndex,
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

  it("each card's pop-in range falls strictly inside its beat", () => {
    const cardBeats = BEATS.filter((b) => b.totalCards > 0);

    for (const beat of cardBeats) {
      for (let i = 0; i < beat.totalCards; i++) {
        const { popStart, popEnd, exitStart, exitEnd } = getCardRange(
          beat,
          i,
          beat.totalCards
        );

        // Pop-in must fall inside beat range
        expect(popStart).toBeGreaterThanOrEqual(beat.start);
        expect(popStart).toBeLessThan(popEnd);
        expect(popEnd).toBeLessThanOrEqual(beat.end);

        // Staggered pop-in must occur between 22% and 70% of beat
        const span = beat.end - beat.start;
        const minAllowedPop = beat.start + span * 0.22;
        const maxAllowedPop = beat.start + span * 0.70;

        expect(popStart).toBeGreaterThanOrEqual(minAllowedPop - 1e-6);
        expect(popEnd).toBeLessThanOrEqual(maxAllowedPop + 1e-6);

        // Exit occurs in the last 22% if hasExit
        if (beat.hasExit) {
          expect(exitStart).toBeCloseTo(beat.end - span * 0.22, 5);
          expect(exitEnd).toBe(beat.end);
        }
      }
    }
  });

  it('heading and cards reveal later so the motion feels more natural and less abrupt', () => {
    for (const beat of BEATS) {
      const { enterStart, enterEnd, exitStart, exitEnd, hasExit } =
        getHeadingRange(beat);
      const span = beat.end - beat.start;

      expect(enterStart).toBe(beat.start);
      expect(enterEnd).toBeCloseTo(beat.start + span * 0.22, 5);

      if (hasExit) {
        expect(exitStart).toBeCloseTo(beat.end - span * 0.22, 5);
        expect(exitEnd).toBe(beat.end);
      } else {
        expect(exitStart).toBe(beat.end);
        expect(exitEnd).toBe(beat.end);
      }
    }

    const beat = BEATS[1];
    const { popStart, popEnd } = getCardRange(beat, 0, beat.totalCards);
    const span = beat.end - beat.start;
    expect(popStart).toBeGreaterThanOrEqual(beat.start + span * 0.2);
    expect(popEnd).toBeLessThanOrEqual(beat.start + span * 0.7);
  });

  it('correctly identifies the active beat for given progress values', () => {
    expect(getActiveBeatIndex(0.0, BEATS)).toBe(0);
    expect(getActiveBeatIndex(0.05, BEATS)).toBe(0);
    expect(getActiveBeatIndex(0.10, BEATS)).toBe(1);
    expect(getActiveBeatIndex(0.24, BEATS)).toBe(2);
    expect(getActiveBeatIndex(0.95, BEATS)).toBe(6);
    expect(getActiveBeatIndex(1.0, BEATS)).toBe(6);
  });
});


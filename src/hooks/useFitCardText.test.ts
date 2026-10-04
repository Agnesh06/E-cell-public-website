import { describe, it, expect } from 'vitest';
import { binarySearchFit } from './useFitCardText';

describe('binarySearchFit', () => {
  it('returns the largest size that fits within [min, max]', () => {
    // fits if size <= 18 (threshold somewhere in the middle)
    const fits = (size: number) => size <= 18;
    const result = binarySearchFit(14, 24, fits);
    // Should be very close to 18 (within 8 iterations accuracy)
    expect(result).toBeGreaterThanOrEqual(17.9);
    expect(result).toBeLessThanOrEqual(18.0);
    expect(fits(result)).toBe(true);
  });

  it('returns min when nothing fits at the smallest size', () => {
    // never fits
    const fits = () => false;
    const result = binarySearchFit(14, 24, fits);
    expect(result).toBe(14);
  });

  it('returns max when everything fits', () => {
    // always fits
    const fits = () => true;
    const result = binarySearchFit(14, 24, fits);
    expect(result).toBe(24);
  });

  it('is monotonic — larger result means fewer overflows', () => {
    // fits if size <= some threshold
    const threshold = 19.5;
    const fits = (size: number) => size <= threshold;
    const result = binarySearchFit(14, 24, fits);
    // result should be <= threshold and the next step up should not fit
    expect(fits(result)).toBe(true);
    // slightly above result should not fit (within 2^-iterations precision)
    const precision = (24 - 14) / Math.pow(2, 8);
    if (result + precision * 2 <= 24) {
      expect(fits(result + precision * 2)).toBe(false);
    }
  });

  it('clamps result to max when fits is always true', () => {
    const result = binarySearchFit(10, 20, () => true);
    expect(result).toBe(20);
  });

  it('handles min === max', () => {
    // When min equals max, returns that value
    const result = binarySearchFit(16, 16, () => true);
    expect(result).toBe(16);
  });

  it('returns a larger size for a looser budget than a tighter one', () => {
    // Loose budget: fits if size <= 20
    const resultLoose = binarySearchFit(14, 24, (s) => s <= 20);
    // Tight budget: fits if size <= 15
    const resultTight = binarySearchFit(14, 24, (s) => s <= 15);
    expect(resultLoose).toBeGreaterThanOrEqual(resultTight);
  });
});

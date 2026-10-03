import { describe, expect, it } from 'vitest';
import {
  hexToVec3,
  readCssColorToken,
  selectRendererQuality,
} from './lineWavesHelpers';

describe('LineWaves helpers', () => {
  it('converts short and full hex colors to normalized shader vectors', () => {
    expect(hexToVec3('#2F7BF5')).toEqual([47 / 255, 123 / 255, 245 / 255]);
    expect(hexToVec3('#fff')).toEqual([1, 1, 1]);
  });

  it('reads the shared CSS theme token before converting it for the shader', () => {
    const root = document.documentElement;
    root.style.setProperty('--line-waves-bg-bottom', '#F2F8FF');

    const color = readCssColorToken(root, '--line-waves-bg-bottom', '#ffffff');

    expect(color).toBe('#F2F8FF');
    expect(hexToVec3(color)).toEqual([242 / 255, 248 / 255, 1]);
  });

  it('selects low-end quality on mobile, coarse input, or limited hardware', () => {
    const desktop = selectRendererQuality({
      viewportWidth: 1920,
      devicePixelRatio: 2,
      hasCoarsePointer: false,
      hardwareConcurrency: 8,
    });
    expect(desktop).toEqual({ tier: 'desktop', dpr: 1.5 });

    expect(selectRendererQuality({
      viewportWidth: 390,
      devicePixelRatio: 3,
      hasCoarsePointer: false,
      hardwareConcurrency: 8,
    })).toEqual({ tier: 'low-end', dpr: 1 });
    expect(selectRendererQuality({
      viewportWidth: 1024,
      devicePixelRatio: 2,
      hasCoarsePointer: true,
      hardwareConcurrency: 8,
    })).toEqual({ tier: 'low-end', dpr: 1 });
    expect(selectRendererQuality({
      viewportWidth: 1024,
      devicePixelRatio: 2,
      hasCoarsePointer: false,
      hardwareConcurrency: 4,
    })).toEqual({ tier: 'low-end', dpr: 1 });
  });
});
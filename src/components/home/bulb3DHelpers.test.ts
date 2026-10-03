import { describe, it, expect } from 'vitest';
import { COLOR_TOKENS } from '@/lib/constants';
import {
  calculateBulbAppearance,
  calculateLightIntensity,
  calculateFilamentEmissive,
  calculateBloomParams,
  calculateCameraTransform,
  calculateParticleParams,
  calculateBreathingPulse,
  clamp,
} from './bulb3DHelpers';

function hslToRgb(hsl: string): [number, number, number] {
  const channels = hsl.match(/[\d.]+/g);
  if (!channels || channels.length !== 3) {
    throw new Error(`Invalid HSL token: ${hsl}`);
  }

  const hue = Number(channels[0]);
  const saturation = Number(channels[1]) / 100;
  const lightness = Number(channels[2]) / 100;
  const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
  const section = hue / 60;
  const secondary = chroma * (1 - Math.abs((section % 2) - 1));
  let rgb: [number, number, number];

  if (section < 1) rgb = [chroma, secondary, 0];
  else if (section < 2) rgb = [secondary, chroma, 0];
  else if (section < 3) rgb = [0, chroma, secondary];
  else if (section < 4) rgb = [0, secondary, chroma];
  else if (section < 5) rgb = [secondary, 0, chroma];
  else rgb = [chroma, 0, secondary];

  const offset = lightness - chroma / 2;
  return rgb.map((channel) => Math.round((channel + offset) * 255)) as [
    number,
    number,
    number,
  ];
}

function relativeLuminance([red, green, blue]: [number, number, number]): number {
  const linearize = (value: number) => {
    const channel = value / 255;
    return channel <= 0.04045
      ? channel / 12.92
      : ((channel + 0.055) / 1.055) ** 2.4;
  };

  return (
    0.2126 * linearize(red) +
    0.7152 * linearize(green) +
    0.0722 * linearize(blue)
  );
}

function contrastRatio(
  foreground: [number, number, number],
  background: [number, number, number]
): number {
  const foregroundLuminance = relativeLuminance(foreground);
  const backgroundLuminance = relativeLuminance(background);
  const lighter = Math.max(foregroundLuminance, backgroundLuminance);
  const darker = Math.min(foregroundLuminance, backgroundLuminance);
  return (lighter + 0.05) / (darker + 0.05);
}

describe('bulb3DHelpers', () => {
  it('keeps theme and bulb palettes independent and text AA-readable across the gradient', () => {
    const themeValues = new Set<string>(Object.values(COLOR_TOKENS.theme));
    const bulbValues = Object.values(COLOR_TOKENS.bulb);
    expect(bulbValues.every((value) => !themeValues.has(value))).toBe(true);

    const backgrounds = [
      COLOR_TOKENS.theme.background,
      COLOR_TOKENS.theme.backgroundEnd,
    ].map(hslToRgb);
    const textColors = [
      COLOR_TOKENS.theme.text,
      COLOR_TOKENS.theme.mutedText,
      COLOR_TOKENS.theme.accent,
    ].map(hslToRgb);

    for (const background of backgrounds) {
      for (const text of textColors) {
        expect(contrastRatio(text, background)).toBeGreaterThanOrEqual(4.5);
      }
    }
  });

  it('keeps glow monotonic at requested checkpoints and maximal at progress 1', () => {
    const glow = [0.15, 0.5, 0.85, 1].map(calculateLightIntensity);
    expect(glow[1]).toBeGreaterThan(glow[0]);
    expect(glow[2]).toBeGreaterThan(glow[1]);
    expect(glow[3]).toBe(1);
  });

  it('clamp restricts values to min and max boundaries', () => {
    expect(clamp(-0.5, 0, 1)).toBe(0);
    expect(clamp(1.5, 0, 1)).toBe(1);
    expect(clamp(0.42, 0, 1)).toBe(0.42);
  });

  it('bulb visibility range: 0-0.03 hidden, 0.03-0.12 fades in unlit, 0.12-1.0 fully visible', () => {
    // 0 to 0.03: hidden
    expect(calculateBulbAppearance(0.0).opacity).toBe(0);
    expect(calculateBulbAppearance(0.02).opacity).toBe(0);

    // 0.03 to 0.12: fades in
    const midFade = calculateBulbAppearance(0.075);
    expect(midFade.opacity).toBeGreaterThan(0);
    expect(midFade.opacity).toBeLessThan(1);
    expect(midFade.scale).toBeGreaterThanOrEqual(0.85);
    expect(midFade.scale).toBeLessThanOrEqual(1.0);

    // at 0.12
    const atPointTwelve = calculateBulbAppearance(0.12);
    expect(atPointTwelve.opacity).toBe(1);
    expect(atPointTwelve.scale).toBeCloseTo(1.0, 4);

    // 0.12 to 1.0: stays fully visible and scales gently
    const atOne = calculateBulbAppearance(1.0);
    expect(atOne.opacity).toBe(1);
    expect(atOne.scale).toBeCloseTo(1.15, 4);

    // clamped outside range
    expect(calculateBulbAppearance(-0.5).opacity).toBe(0);
    expect(calculateBulbAppearance(1.5).opacity).toBe(1);
  });

  it('light intensity is 0 below 0.12, strictly monotonic from 0.12 to 1.0, and exactly 1.0 at progress 1.0', () => {
    expect(calculateLightIntensity(0.0)).toBe(0);
    expect(calculateLightIntensity(0.05)).toBe(0);
    expect(calculateLightIntensity(0.12)).toBe(0);
    expect(calculateLightIntensity(1.0)).toBe(1.0);

    // Strict monotonicity test across 100 intervals
    let prev = 0;
    for (let p = 0.13; p <= 1.0; p += 0.01) {
      const current = calculateLightIntensity(p);
      expect(current).toBeGreaterThan(prev);
      expect(current).toBeLessThanOrEqual(1.0);
      prev = current;
    }

    // Clamping checks
    expect(calculateLightIntensity(-0.1)).toBe(0);
    expect(calculateLightIntensity(1.2)).toBe(1.0);
  });

  it('filament emissive intensity is strictly monotonic and reaches maximum at 1.0', () => {
    expect(calculateFilamentEmissive(0.0)).toBe(0);
    expect(calculateFilamentEmissive(0.12)).toBe(0);
    expect(calculateFilamentEmissive(1.0)).toBe(1.0);

    let prev = 0;
    for (let p = 0.13; p <= 1.0; p += 0.01) {
      const current = calculateFilamentEmissive(p);
      expect(current).toBeGreaterThan(prev);
      expect(current).toBeLessThanOrEqual(1.0);
      prev = current;
    }
  });

  it('bloom parameters scale with progress and disable on low tier', () => {
    // Low tier should disable bloom
    const lowTier = calculateBloomParams(1.0, true);
    expect(lowTier.intensity).toBe(0);
    expect(lowTier.luminanceThreshold).toBe(1.0);

    // Normal tier: 0 intensity at 0.12, growing to peak at 1.0
    const atStart = calculateBloomParams(0.10, false);
    expect(atStart.intensity).toBe(0);

    const atEnd = calculateBloomParams(1.0, false);
    expect(atEnd.intensity).toBeGreaterThan(1.0);
    expect(atEnd.luminanceThreshold).toBeLessThanOrEqual(0.25);
  });

  it('camera transform smoothly dollies in and adjusts framing as progress increases', () => {
    const startCam = calculateCameraTransform(0.0, false);
    const endCam = calculateCameraTransform(1.0, false);

    // Dolly in: z distance decreases
    expect(endCam.z).toBeLessThan(startCam.z);
    expect(startCam.z).toBeGreaterThan(5.0);

    // Mobile camera offset places bulb higher up
    const mobileCam = calculateCameraTransform(0.5, true);
    const desktopCam = calculateCameraTransform(0.5, false);
    expect(mobileCam.y).toBeGreaterThan(desktopCam.y);
  });

  it('particle parameters scale brightness and size with glow', () => {
    const unlit = calculateParticleParams(0.05);
    expect(unlit.opacity).toBe(0);
    expect(calculateParticleParams(0.12).opacity).toBe(0);

    const fullyLit = calculateParticleParams(1.0);
    expect(fullyLit.opacity).toBeGreaterThan(0.7);
    expect(fullyLit.size).toBeGreaterThan(unlit.size);
  });

  it('breathing pulse stays gentle and restrained while keeping the bulb alive', () => {
    const atMid = calculateBreathingPulse(0.5, 2.5);
    expect(atMid.pulse).toBeGreaterThan(1);
    expect(atMid.pulse).toBeLessThan(1.12);
    expect(Math.abs(atMid.driftX)).toBeLessThan(0.2);
    expect(Math.abs(atMid.driftY)).toBeLessThan(0.15);
  });

  it('reuses supplied result objects for frame-time calculations', () => {
    const appearance = { opacity: 0, scale: 0 };
    const camera = { z: 0, y: 0, rotX: 0, rotY: 0 };
    const particles = { opacity: 0, size: 0 };
    const bloom = { intensity: 0, luminanceThreshold: 0 };

    expect(calculateBulbAppearance(0.5, appearance)).toBe(appearance);
    expect(calculateCameraTransform(0.5, false, camera)).toBe(camera);
    expect(calculateParticleParams(0.5, particles)).toBe(particles);
    expect(calculateBloomParams(0.5, false, bloom)).toBe(bloom);
  });
});

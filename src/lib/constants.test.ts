import { describe, it, expect } from 'vitest';
import { COLOR_TOKENS, getActiveNavKey } from './constants';

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

describe('theme color tokens', () => {
  it('keeps text colors WCAG AA readable across the background gradient', () => {
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
});

describe('nav route helper', () => {
  it('maps home, about, projects and collaboration routes to the correct nav key', () => {
    expect(getActiveNavKey('/', '')).toBe('home');
    expect(getActiveNavKey('/', '#about')).toBe('about');
    expect(getActiveNavKey('/projects', '')).toBe('projects');
    expect(getActiveNavKey('/projects', '#details')).toBe('projects');
    expect(getActiveNavKey('/collaboration', '')).toBe('contact');
    expect(getActiveNavKey('/team', '')).toBe('home');
  });
});

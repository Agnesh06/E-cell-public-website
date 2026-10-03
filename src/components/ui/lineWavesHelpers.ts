export type ColorVector = [number, number, number];

export type QualityTier = 'desktop' | 'low-end';

export interface DeviceCapabilities {
  viewportWidth: number;
  devicePixelRatio: number;
  hasCoarsePointer: boolean;
  hardwareConcurrency?: number;
}

export interface RendererQuality {
  tier: QualityTier;
  dpr: number;
}

export function hexToVec3(hex: string): ColorVector {
  const match = /^#?([\da-f]{3}|[\da-f]{6})$/i.exec(hex.trim());
  if (!match) throw new Error(`Invalid hex color: ${hex}`);

  const digits = match[1].length === 3
    ? [...match[1]].map((digit) => `${digit}${digit}`).join('')
    : match[1];
  const value = Number.parseInt(digits, 16);

  return [
    ((value >> 16) & 255) / 255,
    ((value >> 8) & 255) / 255,
    (value & 255) / 255,
  ];
}

export function readCssColorToken(
  element: HTMLElement,
  tokenName: string,
  fallback: string
): string {
  const view = element.ownerDocument.defaultView;
  const token = view?.getComputedStyle(element).getPropertyValue(tokenName).trim();
  return token || fallback;
}

export function selectRendererQuality({
  viewportWidth,
  devicePixelRatio,
  hasCoarsePointer,
  hardwareConcurrency,
}: DeviceCapabilities): RendererQuality {
  const isLowEnd =
    viewportWidth < 768 ||
    hasCoarsePointer ||
    (hardwareConcurrency !== undefined && hardwareConcurrency <= 4);

  return {
    tier: isLowEnd ? 'low-end' : 'desktop',
    dpr: isLowEnd ? 1 : Math.min(1.5, Math.max(1, devicePixelRatio)),
  };
}
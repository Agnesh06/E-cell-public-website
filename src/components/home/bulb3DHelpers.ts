export interface BulbAppearance {
  opacity: number;
  scale: number;
}

export interface BloomParams {
  intensity: number;
  luminanceThreshold: number;
}

export interface CameraTransform {
  z: number;
  y: number;
  rotX: number;
  rotY: number;
}

export interface ParticleParams {
  opacity: number;
  size: number;
}

export interface BreathingPulse {
  pulse: number;
  driftX: number;
  driftY: number;
}

/**
 * Clamps a number to [min, max].
 */
export function clamp(val: number, min = 0, max = 1): number {
  return Math.max(min, Math.min(max, val));
}

/**
 * Calculates bulb base appearance (fade in and scale).
 * - 0 to 0.03: hidden (opacity: 0)
 * - 0.03 to 0.12: fades in unlit (opacity: 0 -> 1, scale: 0.85 -> 1.0)
 * - 0.12 to 1.0: fully visible (opacity: 1, scale: 1.0 -> 1.15)
 */
export function calculateBulbAppearance(
  progress: number,
  result: BulbAppearance = { opacity: 0, scale: 0.85 }
): BulbAppearance {
  const p = clamp(progress, 0, 1);
  if (p < 0.03) {
    result.opacity = 0;
    result.scale = 0.85;
    return result;
  }
  if (p <= 0.12) {
    const t = (p - 0.03) / (0.12 - 0.03);
    result.opacity = clamp(t, 0, 1);
    result.scale = 0.85 + 0.15 * t;
    return result;
  }
  // 0.12 to 1.0
  const t = (p - 0.12) / (1.0 - 0.12);
  result.opacity = 1;
  result.scale = 1.0 + 0.15 * t;
  return result;
}

/**
 * Strictly monotonic light intensity from 0.12 to 1.0.
 * Maximum intensity at exactly 1.0. Never dims or flickers.
 */
export function calculateLightIntensity(progress: number): number {
  const p = clamp(progress, 0, 1);
  if (p <= 0.12) return 0;
  if (p >= 1.0) return 1.0;
  const t = (p - 0.12) / (1.0 - 0.12);
  // Smooth strictly monotonic power curve
  return Math.pow(t, 1.25);
}

/**
 * Strictly monotonic filament emissive intensity from 0.12 to 1.0.
 */
export function calculateFilamentEmissive(progress: number): number {
  const p = clamp(progress, 0, 1);
  if (p <= 0.12) return 0;
  if (p >= 1.0) return 1.0;
  const t = (p - 0.12) / (1.0 - 0.12);
  return Math.pow(t, 1.2);
}

/**
 * Bloom parameters as a function of progress and quality tier.
 */
export function calculateBloomParams(
  progress: number,
  isLowTier: boolean,
  result: BloomParams = { intensity: 0, luminanceThreshold: 1 }
): BloomParams {
  if (isLowTier) {
    result.intensity = 0;
    result.luminanceThreshold = 1.0;
    return result;
  }
  const intensityFactor = calculateLightIntensity(progress);
  result.intensity = intensityFactor * 1.5;
  result.luminanceThreshold = Math.max(0.2, 0.85 - intensityFactor * 0.65);
  return result;
}

/**
 * Camera dolly-in and slight orbit/tilt without covering DOM cards.
 */
export function calculateCameraTransform(
  progress: number,
  isMobile = false,
  result: CameraTransform = { z: 0, y: 0, rotX: 0, rotY: 0 }
): CameraTransform {
  const p = clamp(progress, 0, 1);
  // Gentle dolly-in: distance decreases slightly
  const baseZ = isMobile ? 7.5 : 5.8;
  const z = baseZ - 0.6 * p;
  // On mobile place bulb slightly higher so cards below have clear room
  const baseY = isMobile ? 0.75 : 0.15;
  const y = baseY + 0.1 * p;
  // Subtle tilt and orbit
  const rotX = -0.06 * p;
  const rotY = 0.08 * Math.sin(p * Math.PI);

  result.z = z;
  result.y = y;
  result.rotX = rotX;
  result.rotY = rotY;
  return result;
}

/**
 * Particle brightness and size scaling with progress.
 */
export function calculateParticleParams(
  progress: number,
  result: ParticleParams = { opacity: 0, size: 0.02 }
): ParticleParams {
  const p = clamp(progress, 0, 1);
  if (p <= 0.12) {
    result.opacity = 0;
    result.size = 0.02;
    return result;
  }
  const t = (p - 0.12) / (1.0 - 0.12);
  result.opacity = 0.8 * t;
  result.size = 0.02 + 0.04 * t;
  return result;
}

/**
 * A restrained breathing pulse that keeps the bulb alive without becoming noisy.
 * The animation stays gentle and bounded while preserving the existing scroll story.
 */
export function calculateBreathingPulse(
  progress: number,
  elapsedSeconds: number,
  result: BreathingPulse = { pulse: 1, driftX: 0, driftY: 0 }
): BreathingPulse {
  const p = clamp(progress, 0, 1);
  const breathe = 0.5 + 0.5 * Math.sin(elapsedSeconds * 0.9 + p * 2.4);
  const pulseStrength = 0.04 + (1 - p) * 0.03;
  const driftStrength = 0.08 + (1 - p) * 0.04;

  result.pulse = 1 + pulseStrength * breathe;
  result.driftX = Math.sin(elapsedSeconds * 0.7 + p * 1.8) * driftStrength;
  result.driftY = Math.cos(elapsedSeconds * 1.1 + p * 2.1) * (driftStrength * 0.7);

  return result;
}

/**
 * Detects whether the current device is a low-tier or mobile device.
 */
export function checkIsLowTier(): boolean {
  if (typeof window === 'undefined') return false;
  const isSmallScreen = window.innerWidth < 768;
  const hasCoarsePointer =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(pointer: coarse)').matches;
  const lowConcurrency =
    typeof navigator !== 'undefined' &&
    navigator.hardwareConcurrency !== undefined &&
    navigator.hardwareConcurrency <= 4;

  return isSmallScreen || hasCoarsePointer || lowConcurrency;
}

/**
 * Detects whether WebGL is supported and available in the current browser.
 */
export function isWebGLAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('webgl2');
    if (!context) return false;
    context.getExtension('WEBGL_lose_context')?.loseContext();
    return true;
  } catch {
    return false;
  }
}

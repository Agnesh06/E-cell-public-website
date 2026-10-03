import React from 'react';
import { motion, MotionValue, useTransform } from 'framer-motion';
import { COLOR_TOKENS } from '@/lib/constants';

interface BulbBackgroundProps {
  progress: MotionValue<number>;
  isReducedMotion?: boolean;
}

export const BulbBackground: React.FC<BulbBackgroundProps> = ({
  progress,
  isReducedMotion = false,
}) => {
  const { bulb } = COLOR_TOKENS;

  // Bulb entrance: 0 to 0.03 hidden, 0.03 to 0.12 fades in unlit
  const bulbOpacity = useTransform(progress, [0, 0.03, 0.12], [0, 0, 1]);
  const bulbBaseScale = useTransform(progress, [0, 0.03, 0.12, 1.0], [0.85, 0.85, 1.0, 1.25]);
  const bulbTranslateZ = useTransform(progress, [0.12, 1.0], [0, 60]);
  const bulbRotateX = useTransform(progress, [0.12, 1.0], [0, -5]);
  const bulbRotateY = useTransform(progress, [0.12, 0.5, 1.0], [0, 3, 0]);

  // Glow layers strictly monotonic from 0.12 to 1.0
  const coreGlowOpacity = useTransform(
    progress,
    [0, 0.12, 0.4, 0.7, 1.0],
    [0, 0, 0.45, 0.8, 1.0]
  );
  const coreGlowScale = useTransform(
    progress,
    [0, 0.12, 0.4, 0.7, 1.0],
    [0.7, 0.7, 1.1, 1.5, 2.0]
  );

  const midHaloOpacity = useTransform(
    progress,
    [0, 0.12, 0.4, 0.7, 1.0],
    [0, 0, 0.35, 0.65, 0.95]
  );
  const midHaloScale = useTransform(
    progress,
    [0, 0.12, 0.4, 0.7, 1.0],
    [0.8, 0.8, 1.3, 1.8, 2.5]
  );

  const wideHaloOpacity = useTransform(
    progress,
    [0, 0.12, 0.4, 0.7, 1.0],
    [0, 0, 0.2, 0.5, 0.9]
  );
  const wideHaloScale = useTransform(
    progress,
    [0, 0.12, 0.4, 0.7, 1.0],
    [0.9, 0.9, 1.6, 2.3, 3.2]
  );

  const raysOpacity = useTransform(
    progress,
    [0, 0.12, 0.4, 0.7, 1.0],
    [0, 0, 0.25, 0.55, 0.85]
  );
  const raysScale = useTransform(
    progress,
    [0, 0.12, 0.4, 0.7, 1.0],
    [0.8, 0.8, 1.1, 1.4, 1.8]
  );

  const filamentGlowOpacity = useTransform(
    progress,
    [0, 0.12, 0.3, 0.6, 1.0],
    [0, 0, 0.5, 0.85, 1.0]
  );

  if (isReducedMotion) {
    return (
      <div
        aria-hidden="true"
        className="relative flex items-center justify-center pointer-events-none my-8"
      >
        <div className="relative w-64 h-80 flex items-center justify-center">
          {/* Static halos */}
          <div
            className="absolute w-72 h-72 rounded-full blur-2xl"
            style={{ backgroundColor: bulb.outerHalo, opacity: 0.22 }}
          />
          <div
            className="absolute w-52 h-52 rounded-full blur-xl"
            style={{ backgroundColor: bulb.midHalo, opacity: 0.3 }}
          />
          <div
            className="absolute w-36 h-36 rounded-full blur-md"
            style={{ backgroundColor: bulb.core, opacity: 0.52 }}
          />

          {/* Static SVG Bulb */}
          <svg
            viewBox="0 0 200 300"
            className="w-48 h-72 relative z-10"
            fill="none"
          >
            <path
              d="M 60 190 C 40 160 30 130 30 95 C 30 50 62 15 100 15 C 138 15 170 50 170 95 C 170 130 160 160 140 190 Z"
              fill={bulb.glass}
              fillOpacity="0.48"
              stroke={bulb.glassEdge}
              strokeWidth="3.5"
            />
            {/* Filament */}
            <path
              d="M 85 185 L 85 130 L 95 110 L 105 110 L 115 130 L 115 185"
              stroke={bulb.filamentLit}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Screw base */}
            <path d="M 68 190 L 132 190 L 128 206 L 72 206 Z" fill={bulb.metal} />
            <path d="M 72 206 L 128 206 L 125 220 L 75 220 Z" fill={bulb.metalShadow} />
            <path d="M 75 220 L 125 220 L 122 232 L 78 232 Z" fill={bulb.metalShadow} />
            <path d="M 82 232 Q 100 244 118 232 Z" fill={bulb.filamentUnlit} />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 preserve-3d"
    >
      {/* Light ray spokes that slowly spin */}
      <motion.div
        style={{
          opacity: raysOpacity,
          scale: raysScale,
        }}
        className="absolute w-[600px] h-[600px] md:w-[900px] md:h-[900px] flex items-center justify-center"
      >
        <div className="w-full h-full animate-[spin_40s_linear_infinite]">
          <svg viewBox="0 0 400 400" className="w-full h-full opacity-60">
            <defs>
              <radialGradient id="rayGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={bulb.core} stopOpacity="0.52" />
                <stop offset="48%" stopColor={bulb.midHalo} stopOpacity="0.27" />
                <stop offset="100%" stopColor={bulb.outerHalo} stopOpacity="0" />
              </radialGradient>
            </defs>
            {Array.from({ length: 12 }).map((_, i) => (
              <polygon
                key={i}
                points="200,200 185,0 215,0"
                fill="url(#rayGrad)"
                transform={`rotate(${i * 30} 200 200)`}
              />
            ))}
          </svg>
        </div>
      </motion.div>

      {/* Pre-blurred stacked glow layers */}
      {/* 1. Wide Halo */}
      <motion.div
        style={{
          opacity: wideHaloOpacity,
          scale: wideHaloScale,
          backgroundColor: bulb.outerHalo,
        }}
        className="absolute w-[450px] h-[450px] md:w-[650px] md:h-[650px] rounded-full blur-3xl"
      />

      {/* 2. Mid Halo */}
      <motion.div
        style={{
          opacity: midHaloOpacity,
          scale: midHaloScale,
          backgroundColor: bulb.midHalo,
        }}
        className="absolute w-[280px] h-[280px] md:w-[420px] md:h-[420px] rounded-full blur-2xl"
      />

      {/* 3. Bright Core Halo */}
      <motion.div
        style={{
          opacity: coreGlowOpacity,
          scale: coreGlowScale,
          backgroundColor: bulb.core,
        }}
        className="absolute w-[160px] h-[160px] md:w-[260px] md:h-[260px] rounded-full blur-xl"
      />

      {/* 3D Tilted & Pushed-in Bulb Container */}
      <motion.div
        style={{
          scale: bulbBaseScale,
          z: bulbTranslateZ,
          rotateX: bulbRotateX,
          rotateY: bulbRotateY,
        }}
        className="relative flex items-center justify-center transform-gpu -translate-y-8 md:-translate-y-12"
      >
        <motion.svg
          style={{ opacity: bulbOpacity }}
          viewBox="0 0 200 300"
          className="w-44 h-64 md:w-56 md:h-80"
          fill="none"
        >
          {/* Glass Bulb Outline */}
          <path
            d="M 60 190 C 40 160 30 130 30 95 C 30 50 62 15 100 15 C 138 15 170 50 170 95 C 170 130 160 160 140 190 Z"
            fill={bulb.glass}
            fillOpacity="0.16"
            stroke={bulb.glassEdge}
            strokeWidth="3.5"
            className="transition-colors"
          />

          {/* Bulb Lit Inner Aura */}
          <motion.path
            d="M 60 190 C 40 160 30 130 30 95 C 30 50 62 15 100 15 C 138 15 170 50 170 95 C 170 130 160 160 140 190 Z"
            fill="url(#bulbInnerGlow)"
            style={{ opacity: filamentGlowOpacity }}
          />

          {/* Unlit filament wires */}
          <path
            d="M 85 185 L 85 130 L 95 110 L 105 110 L 115 130 L 115 185"
            stroke={bulb.filamentUnlit}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Lit glowing filament */}
          <motion.path
            d="M 85 185 L 85 130 L 95 110 L 105 110 L 115 130 L 115 185"
            stroke={bulb.filamentLit}
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              opacity: filamentGlowOpacity,
            }}
          />

          {/* Screw base */}
          <path d="M 68 190 L 132 190 L 128 206 L 72 206 Z" fill={bulb.metal} />
          <path d="M 72 206 L 128 206 L 125 220 L 75 220 Z" fill={bulb.metalShadow} />
          <path d="M 75 220 L 125 220 L 122 232 L 78 232 Z" fill={bulb.metalShadow} />
          <path d="M 82 232 Q 100 244 118 232 Z" fill={bulb.filamentUnlit} />

          {/* Inner bulb glow gradient definition */}
          <defs>
            <radialGradient id="bulbInnerGlow" cx="50%" cy="40%" r="55%">
              <stop offset="0%" stopColor={bulb.core} stopOpacity="0.92" />
              <stop offset="48%" stopColor={bulb.midHalo} stopOpacity="0.62" />
              <stop offset="100%" stopColor={bulb.outerHalo} stopOpacity="0.18" />
            </radialGradient>
          </defs>
        </motion.svg>
      </motion.div>
    </div>
  );
};


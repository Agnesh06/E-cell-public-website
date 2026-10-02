import React from 'react';
import { motion, MotionValue, useTransform } from 'framer-motion';

interface BulbBackgroundProps {
  progress: MotionValue<number>;
  isReducedMotion?: boolean;
}

export const BulbBackground: React.FC<BulbBackgroundProps> = ({
  progress,
  isReducedMotion = false,
}) => {
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
          <div className="absolute w-72 h-72 rounded-full bg-blue-300/30 blur-2xl" />
          <div className="absolute w-52 h-52 rounded-full bg-amber-200/50 blur-xl" />
          <div className="absolute w-36 h-36 rounded-full bg-white/70 blur-md" />

          {/* Static SVG Bulb */}
          <svg
            viewBox="0 0 200 300"
            className="w-48 h-72 drop-shadow-[0_0_25px_rgba(255,230,120,0.8)] relative z-10"
            fill="none"
          >
            <path
              d="M 60 190 C 40 160 30 130 30 95 C 30 50 62 15 100 15 C 138 15 170 50 170 95 C 170 130 160 160 140 190 Z"
              fill="rgba(255, 250, 220, 0.4)"
              stroke="#FDE047"
              strokeWidth="3.5"
            />
            {/* Filament */}
            <path
              d="M 85 185 L 85 130 L 95 110 L 105 110 L 115 130 L 115 185"
              stroke="#FEF08A"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Screw base */}
            <path d="M 68 190 L 132 190 L 128 206 L 72 206 Z" fill="#94A3B8" />
            <path d="M 72 206 L 128 206 L 125 220 L 75 220 Z" fill="#64748B" />
            <path d="M 75 220 L 125 220 L 122 232 L 78 232 Z" fill="#475569" />
            <path d="M 82 232 Q 100 244 118 232 Z" fill="#334155" />
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
                <stop offset="0%" stopColor="#93C5FD" stopOpacity="0.45" />
                <stop offset="50%" stopColor="#60A5FA" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
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
        }}
        className="absolute w-[450px] h-[450px] md:w-[650px] md:h-[650px] rounded-full bg-blue-400/30 blur-3xl"
      />

      {/* 2. Mid Halo */}
      <motion.div
        style={{
          opacity: midHaloOpacity,
          scale: midHaloScale,
        }}
        className="absolute w-[280px] h-[280px] md:w-[420px] md:h-[420px] rounded-full bg-amber-200/40 blur-2xl"
      />

      {/* 3. Bright Core Halo */}
      <motion.div
        style={{
          opacity: coreGlowOpacity,
          scale: coreGlowScale,
        }}
        className="absolute w-[160px] h-[160px] md:w-[260px] md:h-[260px] rounded-full bg-white/70 blur-xl"
      />

      {/* 3D Tilted & Pushed-in Bulb Container */}
      <motion.div
        style={{
          opacity: bulbOpacity,
          scale: bulbBaseScale,
          z: bulbTranslateZ,
          rotateX: bulbRotateX,
          rotateY: bulbRotateY,
        }}
        className="relative flex items-center justify-center transform-gpu -translate-y-8 md:-translate-y-12"
      >
        <svg
          viewBox="0 0 200 300"
          className="w-44 h-64 md:w-56 md:h-80 drop-shadow-[0_10px_35px_rgba(0,0,0,0.5)]"
          fill="none"
        >
          {/* Glass Bulb Outline */}
          <path
            d="M 60 190 C 40 160 30 130 30 95 C 30 50 62 15 100 15 C 138 15 170 50 170 95 C 170 130 160 160 140 190 Z"
            fill="rgba(255, 255, 255, 0.05)"
            stroke="rgba(226, 232, 240, 0.6)"
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
            stroke="rgba(148, 163, 184, 0.45)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Lit glowing filament */}
          <motion.path
            d="M 85 185 L 85 130 L 95 110 L 105 110 L 115 130 L 115 185"
            stroke="#FEF08A"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              opacity: filamentGlowOpacity,
              filter: 'drop-shadow(0 0 6px #FBBF24)',
            }}
          />

          {/* Screw base */}
          <path d="M 68 190 L 132 190 L 128 206 L 72 206 Z" fill="#94A3B8" />
          <path d="M 72 206 L 128 206 L 125 220 L 75 220 Z" fill="#64748B" />
          <path d="M 75 220 L 125 220 L 122 232 L 78 232 Z" fill="#475569" />
          <path d="M 82 232 Q 100 244 118 232 Z" fill="#334155" />

          {/* Inner bulb glow gradient definition */}
          <defs>
            <radialGradient id="bulbInnerGlow" cx="50%" cy="40%" r="55%">
              <stop offset="0%" stopColor="#FEF9C3" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#FDE047" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#60A5FA" stopOpacity="0.1" />
            </radialGradient>
          </defs>
        </svg>
      </motion.div>
    </div>
  );
};


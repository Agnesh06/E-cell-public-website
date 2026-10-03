import React, { Suspense, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { COLOR_TOKENS } from '@/lib/constants';
import type { LineWavesMode } from '@/components/ui/LineWaves';

const LazyLineWaves = React.lazy(() => import('@/components/ui/LineWaves'));

const GradientFallback: React.FC = () => (
  <div aria-hidden="true" className="absolute inset-0 line-waves-background" />
);

export const HomeBackground: React.FC = () => {
  const reducedMotion = useReducedMotion() ?? false;
  const [mode, setMode] = useState<LineWavesMode>('fallback');
  const { lineWaves } = COLOR_TOKENS;

  return (
    <div
      aria-hidden="true"
      data-testid="home-background"
      data-mode={mode}
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden line-waves-background"
    >
      <Suspense fallback={<GradientFallback />}>
        <LazyLineWaves
          className="absolute inset-0 h-full w-full"
          speed={0.18}
          innerLineCount={26}
          outerLineCount={30}
          warpIntensity={0.8}
          rotation={-45}
          edgeFadeWidth={0}
          colorCycleSpeed={0.6}
          brightness={0.16}
          color1={lineWaves.lineBlue1}
          color2={lineWaves.lineBlue2}
          color3={lineWaves.lineBlue3}
          baseColorTop={lineWaves.bgTop}
          baseColorBottom={lineWaves.bgBottom}
          enableMouseInteraction={false}
          lightMode
          reducedMotion={reducedMotion}
          onModeChange={(nextMode) => {
            setMode((currentMode) => currentMode === nextMode ? currentMode : nextMode);
          }}
        />
      </Suspense>
      <div className="pointer-events-none absolute inset-0 z-10 line-waves-readability-wash" />
    </div>
  );
};
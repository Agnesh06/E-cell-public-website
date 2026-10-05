import React from 'react';
import Topography from './Topography';

export interface AmbientTopographyProps {
  opacity?: number;
  className?: string;
}

/**
 * AmbientTopography
 * Subtle, low-contrast, non-intrusive topography background for content pages
 * (Projects, Team, Collaboration).
 * - pointer-events-none guarantees zero interference with user interactions.
 * - Gentle elevation blues matching the brand theme.
 * - Smooth, slow morph speed and low opacity so foreground content pops.
 */
export const AmbientTopography: React.FC<AmbientTopographyProps> = ({
  opacity = 0.32,
  className = '',
}) => {
  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 z-0 pointer-events-none overflow-hidden select-none ${className}`}
    >
      <Topography
        lowColor="#2547FF"
        midColor="#4B6FFF"
        highColor="#8CA6FE"
        speed={0.18}
        morphAmount={2.4}
        morphSpeed={0.025}
        bands={2.0}
        thickness={0.008}
        scale={2.2}
        pixelSize={1.0}
        glow={0.0}
        colorMode="elevation"
        contrast={1.6}
        brightness={1.0}
        fillBands={false}
        opacity={opacity}
        grain={false}
        grainIntensity={0.0}
        mouseInteraction={false}
      />
    </div>
  );
};

export default AmbientTopography;

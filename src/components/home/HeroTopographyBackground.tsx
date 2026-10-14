import React from "react";
import Topography from "@/components/ui/Topography";

/**
 * HeroTopographyBackground
 * Preserved backup of the original Hero section Topography background.
 * If you ever wish to roll back from DotGrid to Topography, simply import
 * this component and use it inside Hero.tsx:
 *
 *   <HeroTopographyBackground />
 */
export default function HeroTopographyBackground() {
  return (
    <Topography
      lowColor="#1B3AE5"
      midColor="#38BDF8"
      highColor="#FFFFFF"
      speed={0.35}
      morphAmount={3}
      morphSpeed={0.05}
      bands={2}
      thickness={0.01}
      scale={2}
      pixelSize={1}
      glow={0.05}
      colorMode="elevation"
      contrast={3}
      brightness={1}
      fillBands={false}
      grain={false}
      grainIntensity={0.05}
      opacity={1}
      mouseInteraction={true}
      mouseRadius={0.3}
      mouseStrength={0.4}
    />
  );
}

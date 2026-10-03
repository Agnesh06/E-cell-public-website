import React from 'react';
import { motion, MotionValue, useTransform } from 'framer-motion';
import { BeatConfig } from '@/lib/constants';
import { getCardRange } from './timelineHelpers';
import SpotlightCard from './SpotlightCard';

export interface IdeaCardProps {
  id: string;
  title?: string;
  subtitle?: string;
  description?: string;
  text?: string;
  cardIndex: number;
  totalCards: number;
  beat: BeatConfig;
  progress: MotionValue<number>;
  isReducedMotion?: boolean;
}

export const IdeaCard: React.FC<IdeaCardProps> = ({
  id,
  title,
  description,
  text,
  cardIndex,
  totalCards,
  beat,
  progress,
  isReducedMotion = false,
}) => {
  const { popStart, popEnd, exitStart, exitEnd } = getCardRange(
    beat,
    cardIndex,
    totalCards
  );

  // Compute 3D pop-in and recede exit transforms
  const opacity = useTransform(
    progress,
    beat.hasExit
      ? [beat.start, popStart, popEnd, exitStart, exitEnd, beat.end]
      : [beat.start, popStart, popEnd, beat.end],
    beat.hasExit ? [0, 0, 1, 1, 0, 0] : [0, 0, 1, 1]
  );

  const scale = useTransform(
    progress,
    beat.hasExit
      ? [beat.start, popStart, popEnd, exitStart, exitEnd, beat.end]
      : [beat.start, popStart, popEnd, beat.end],
    beat.hasExit ? [0.7, 0.7, 1.0, 1.0, 0.85, 0.85] : [0.7, 0.7, 1.0, 1.0]
  );

  const translateZ = useTransform(
    progress,
    beat.hasExit
      ? [beat.start, popStart, popEnd, exitStart, exitEnd, beat.end]
      : [beat.start, popStart, popEnd, beat.end],
    beat.hasExit ? [-200, -200, 0, 0, -150, -150] : [-200, -200, 0, 0]
  );

  const rotateX = useTransform(
    progress,
    beat.hasExit
      ? [beat.start, popStart, popEnd, exitStart, exitEnd, beat.end]
      : [beat.start, popStart, popEnd, beat.end],
    beat.hasExit ? [12, 12, 0, 0, -8, -8] : [12, 12, 0, 0]
  );

  // Keep the card groups balanced around the center of the stage.
  const getDesktopPlacement = () => {
    if (totalCards === 3) {
      if (cardIndex === 0) {
        // Left arc
        return 'md:top-[38%] md:left-8 lg:md:left-16 md:-translate-y-1/2 md:max-w-xs lg:max-w-sm';
      }
      if (cardIndex === 1) {
        // Bottom-center arc
        return 'md:bottom-10 md:left-1/2 md:-translate-x-1/2 md:max-w-md text-center';
      }
      // Right arc
      return 'md:top-[38%] md:right-8 lg:md:right-16 md:-translate-y-1/2 md:max-w-xs lg:max-w-sm';
    }

    if (totalCards === 4) {
      if (cardIndex === 0) {
        // Flank top-left
        return 'md:top-[22%] md:left-6 lg:md:left-16 md:max-w-xs lg:max-w-sm';
      }
      if (cardIndex === 1) {
        // Flank bottom-left
        return 'md:bottom-12 md:left-6 lg:md:left-16 md:max-w-xs lg:max-w-sm';
      }
      if (cardIndex === 2) {
        // Flank top-right
        return 'md:top-[22%] md:right-6 lg:md:right-16 md:max-w-xs lg:max-w-sm';
      }
      // Flank bottom-right
      return 'md:bottom-12 md:right-6 lg:md:right-16 md:max-w-xs lg:max-w-sm';
    }

    return 'md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-md';
  };

  const content = (
    <SpotlightCard
      className="p-5 md:p-6 rounded-2xl bg-card border border-border theme-card-shadow transition-all"
      spotlightColor="rgba(59, 130, 246, 0.16)"
    >
      {title && (
        <h4 className="text-lg md:text-xl font-bold text-card-foreground mb-2 tracking-tight">
          {title}
        </h4>
      )}
      <p className="text-sm md:text-base text-muted-foreground leading-relaxed font-normal">
        {description || text}
      </p>
    </SpotlightCard>
  );

  if (isReducedMotion) {
    return (
      <div key={id} className="w-full my-3">
        {content}
      </div>
    );
  }

  return (
    <motion.div
      key={id}
      style={{
        opacity,
        scale,
        z: translateZ,
        rotateX,
      }}
      className={`absolute w-[88%] left-[6%] md:w-auto md:left-auto transform-gpu preserve-3d z-20 ${getDesktopPlacement()}`}
    >
      {content}
    </motion.div>
  );
};


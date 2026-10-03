import React from 'react';
import { motion, MotionValue, useTransform } from 'framer-motion';
import { BeatConfig } from '@/lib/constants';
import {
  ENTER_EASE,
  EXIT_EASE,
  LINEAR_EASE,
  getCardRange,
} from './timelineHelpers';
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
  compactMotion?: boolean;
  isActiveBeat?: boolean;
  isNearActiveBeat?: boolean;
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
  compactMotion = false,
  isActiveBeat = true,
  isNearActiveBeat = true,
}) => {
  const timing = getCardRange(
    beat,
    cardIndex,
    totalCards
  );
  const enterDistance = compactMotion ? 32 : 56;
  const enterRotation = compactMotion ? 0 : 10;
  const drift = (cardIndex % 2 === 0 ? 1 : -1) * Math.min(8, (cardIndex + 1) * 2);
  const firstDriftMid = (timing.holdStart + timing.holdMid) / 2;
  const secondDriftMid = (timing.holdMid + timing.holdEnd) / 2;
  const isLastCardEntering = timing.enterEnd === timing.holdStart;
  const yInput = isLastCardEntering
    ? [
        timing.enterStart,
        timing.enterEnd,
        firstDriftMid,
        timing.holdMid,
        secondDriftMid,
        timing.holdEnd,
        timing.exitStart,
        timing.exitEnd,
      ]
    : [
        timing.enterStart,
        timing.enterEnd,
        timing.holdStart,
        firstDriftMid,
        timing.holdMid,
        secondDriftMid,
        timing.holdEnd,
        timing.exitStart,
        timing.exitEnd,
      ];
  const yOutput = isLastCardEntering
    ? [enterDistance, 0, drift, 0, -drift, 0, 0, -36]
    : [enterDistance, 0, 0, drift, 0, -drift, 0, 0, -36];
  const yEase = Array.from({ length: yInput.length - 1 }, (_, index) =>
    index === 0 ? ENTER_EASE : index === yInput.length - 2 ? EXIT_EASE : LINEAR_EASE
  );
  const y = useTransform(progress, yInput, yOutput, { ease: yEase });
  const scale = useTransform(
    progress,
    [timing.enterStart, timing.enterEnd, timing.exitStart, timing.exitEnd],
    [0.94, 1, 1, 0.97],
    { ease: [ENTER_EASE, LINEAR_EASE, EXIT_EASE] }
  );
  const rotateX = useTransform(
    progress,
    [timing.enterStart, timing.enterEnd, timing.exitStart, timing.exitEnd],
    [enterRotation, 0, 0, -6],
    { ease: [ENTER_EASE, LINEAR_EASE, EXIT_EASE] }
  );
  const opacity = useTransform(
    progress,
    [timing.enterStart, timing.opacityEnd, timing.exitStart, timing.exitEnd],
    [0, 1, 1, 0],
    { ease: [ENTER_EASE, LINEAR_EASE, EXIT_EASE] }
  );
  const accentScale = useTransform(
    progress,
    [timing.enterStart, timing.enterEnd],
    [0, 1],
    { ease: ENTER_EASE }
  );
  const sheenStart = timing.enterStart + (timing.enterEnd - timing.enterStart) * 0.65;
  const sheenMiddle = (sheenStart + timing.enterEnd) / 2;
  const sheenOpacity = useTransform(
    progress,
    [sheenStart, sheenMiddle, timing.enterEnd],
    [0, 0.7, 0],
    { ease: LINEAR_EASE }
  );
  const sheenX = useTransform(
    progress,
    [sheenStart, timing.enterEnd],
    ['-160%', '260%'],
    { ease: LINEAR_EASE }
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
      className="relative p-5 md:p-6 rounded-2xl bg-card border border-border theme-card-shadow"
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
      {!compactMotion && (
        <motion.div
          aria-hidden="true"
          className="card-spotlight__overlay pointer-events-none absolute -inset-y-1 left-1/2 top-0 z-0 h-[130%] w-1/2 bg-gradient-to-r from-transparent via-white/80 to-sky-100/20"
          style={{ opacity: sheenOpacity, x: sheenX, rotate: 18 }}
        />
      )}
      <motion.div
        aria-hidden="true"
        className="card-spotlight__overlay pointer-events-none absolute inset-x-0 top-0 z-10 h-[2px] origin-left rounded-full bg-gradient-to-r from-blue-700 via-blue-500 to-sky-300"
        style={{ scaleX: accentScale }}
      />
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
    <div
      key={id}
      style={{
        visibility: isActiveBeat ? 'visible' : 'hidden',
        pointerEvents: isActiveBeat ? 'auto' : 'none',
      }}
      {...(!isActiveBeat ? { inert: '' } : {})}
      className={`absolute w-[88%] left-[6%] md:w-auto md:left-auto transform-gpu preserve-3d ${getDesktopPlacement()}`}
    >
      <motion.div
      key={id}
      style={{
        opacity,
        scale,
        y,
        rotateX,
        transformOrigin: 'top center',
        willChange: isNearActiveBeat ? 'transform, opacity' : 'auto',
      }}
      data-testid={`idea-card-${beat.id}-${cardIndex}`}
      data-beat-id={beat.id}
      data-card-index={cardIndex}
      className="relative z-20 transform-gpu preserve-3d"
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-y-2 inset-x-1 rounded-2xl"
        style={{
          opacity,
          boxShadow: '0 16px 32px rgba(35, 82, 136, 0.18)',
        }}
      />
      {content}
      </motion.div>
    </div>
  );
};


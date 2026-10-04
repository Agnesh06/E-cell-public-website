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
  singleSlot?: boolean;
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
  singleSlot = false,
  isActiveBeat = true,
  isNearActiveBeat = true,
}) => {
  const timing = getCardRange(beat, cardIndex, totalCards, singleSlot);
  const enterDistance = compactMotion ? 32 : 56;
  const enterRotation = compactMotion ? 0 : 10;
  const drift = (cardIndex % 2 === 0 ? 1 : -1) * Math.min(8, (cardIndex + 1) * 2);
  const firstDriftMid = (timing.holdStart + timing.holdMid) / 2;
  const secondDriftMid = (timing.holdMid + timing.holdEnd) / 2;
  const hasExit = timing.hasExit && timing.exitEnd > timing.exitStart;
  const isLastCardEntering = !singleSlot && timing.enterEnd === timing.holdStart;
  const yInput = singleSlot
    ? hasExit
      ? [timing.enterStart, timing.enterEnd, timing.exitStart, timing.exitEnd]
      : [timing.enterStart, timing.enterEnd]
    : isLastCardEntering
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
  const yOutput = singleSlot
    ? hasExit
      ? [enterDistance, 0, 0, -36]
      : [enterDistance, 0]
    : isLastCardEntering
    ? [enterDistance, 0, drift, 0, -drift, 0, 0, -36]
    : [enterDistance, 0, 0, drift, 0, -drift, 0, 0, -36];
  const yEase = singleSlot
    ? hasExit ? [ENTER_EASE, LINEAR_EASE, EXIT_EASE] : [ENTER_EASE]
    : Array.from({ length: yInput.length - 1 }, (_, index) =>
        index === 0 ? ENTER_EASE : index === yInput.length - 2 ? EXIT_EASE : LINEAR_EASE
      );
  const y = useTransform(progress, yInput, yOutput, { ease: yEase });
  const scale = useTransform(
    progress,
    hasExit
      ? [timing.enterStart, timing.enterEnd, timing.exitStart, timing.exitEnd]
      : [timing.enterStart, timing.enterEnd],
    hasExit ? [0.94, 1, 1, 0.97] : [0.94, 1],
    { ease: hasExit ? [ENTER_EASE, LINEAR_EASE, EXIT_EASE] : [ENTER_EASE] }
  );
  const rotateX = useTransform(
    progress,
    hasExit
      ? [timing.enterStart, timing.enterEnd, timing.exitStart, timing.exitEnd]
      : [timing.enterStart, timing.enterEnd],
    hasExit ? [enterRotation, 0, 0, -6] : [enterRotation, 0],
    { ease: hasExit ? [ENTER_EASE, LINEAR_EASE, EXIT_EASE] : [ENTER_EASE] }
  );
  const opacity = useTransform(
    progress,
    hasExit
      ? [timing.enterStart, timing.opacityEnd, timing.exitStart, timing.exitEnd]
      : [timing.enterStart, timing.opacityEnd],
    hasExit ? [0, 1, 1, 0] : [0, 1],
    { ease: hasExit ? [ENTER_EASE, LINEAR_EASE, EXIT_EASE] : [ENTER_EASE] }
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

  const content = (
    <SpotlightCard
      className="relative flex h-full min-w-0 flex-col items-start overflow-hidden rounded-lg border border-border bg-card text-left theme-card-shadow"
      style={{ padding: 'var(--card-pad, clamp(0.75rem, 1.8vh, 1.25rem))' }}
      spotlightColor="rgba(59, 130, 246, 0.16)"
    >
      {title && (
        <h4
          className="mb-[0.4em] leading-[1.2] font-bold tracking-[-0.01em] text-foreground"
          style={{
            fontSize: 'var(--card-title-size, clamp(0.9rem, 1.8vw + 0.5rem, 1.35rem))',
            textWrap: 'balance' as React.CSSProperties['textWrap'],
          }}
        >
          {title}
        </h4>
      )}
      <p
        className="leading-[1.55] font-medium text-foreground/75"
        style={{
          fontSize: 'var(--card-body-size, clamp(0.875rem, 1.4vw + 0.35rem, 1.1rem))',
          textWrap: 'pretty' as React.CSSProperties['textWrap'],
        }}
      >
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
      <div key={id} data-testid={`idea-card-${beat.id}-${cardIndex}`} data-beat-id={beat.id} data-card-index={cardIndex} className="h-full min-w-0 w-full">
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
      data-testid={`idea-card-${beat.id}-${cardIndex}`}
      data-beat-id={beat.id}
      data-card-index={cardIndex}
      className={`h-full min-w-0 w-full ${singleSlot ? 'col-start-1 row-start-1' : ''}`}
    >
      <motion.div
        data-testid={`idea-card-motion-${beat.id}-${cardIndex}`}
        style={{
          opacity,
          scale,
          y,
          rotateX,
          transformOrigin: 'top center',
          willChange: isNearActiveBeat ? 'transform, opacity' : 'auto',
        }}
        className="h-full min-w-0 w-full transform-gpu preserve-3d"
      >
        {content}
      </motion.div>
    </div>
  );
};


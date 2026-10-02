import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValueEvent,
  useReducedMotion,
  MotionValue,
} from 'framer-motion';
import {
  BEATS,
  SCENE_CONFIG,
  GET_INVOLVED_PATH,
  BeatConfig,
} from '@/lib/constants';
import {
  getHeroData,
  getAboutData,
  getApproachData,
  getEcosystemData,
  getStudentJourneyData,
  getWhoIsECellForData,
  getFinalCTAData,
} from '@/data/home';
import { BulbBackground } from './BulbBackground';
import { IdeaCard } from './IdeaCard';
import { Button } from '@/components/ui/button';
import { getHeadingRange, getActiveBeatIndex } from './timelineHelpers';

interface SectionHeadingProps {
  beat: BeatConfig;
  progress: MotionValue<number>;
  title: string;
  subtitle?: string;
  eyebrow?: string;
  textColor: MotionValue<string>;
  mutedTextColor: MotionValue<string>;
}

const SectionHeading: React.FC<SectionHeadingProps> = ({
  beat,
  progress,
  title,
  subtitle,
  eyebrow,
  textColor,
  mutedTextColor,
}) => {
  const { enterStart, enterEnd, exitStart, exitEnd, hasExit } =
    getHeadingRange(beat);

  const opacity = useTransform(
    progress,
    hasExit
      ? [beat.start, enterStart, enterEnd, exitStart, exitEnd, beat.end]
      : [beat.start, enterStart, enterEnd, beat.end],
    hasExit ? [0, 0, 1, 1, 0, 0] : [0, 0, 1, 1]
  );

  const translateY = useTransform(
    progress,
    hasExit
      ? [beat.start, enterStart, enterEnd, exitStart, exitEnd, beat.end]
      : [beat.start, enterStart, enterEnd, beat.end],
    hasExit ? [30, 30, 0, 0, -25, -25] : [30, 30, 0, 0]
  );

  return (
    <motion.div
      style={{
        opacity,
        y: translateY,
      }}
      className="absolute top-16 md:top-20 inset-x-0 mx-auto px-6 max-w-3xl text-center pointer-events-none z-10"
    >
      {eyebrow && (
        <motion.p
          style={{ color: mutedTextColor }}
          className="text-xs md:text-sm font-semibold uppercase tracking-widest mb-1.5"
        >
          {eyebrow}
        </motion.p>
      )}
      <motion.h2
        style={{ color: textColor }}
        className="text-2xl md:text-4xl font-extrabold tracking-tight"
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          style={{ color: mutedTextColor }}
          className="mt-2 text-sm md:text-base font-normal max-w-xl mx-auto"
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
};

export const HomeScrollScene: React.FC = () => {
  const outerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // One progress MotionValue via useScroll
  const { scrollYProgress } = useScroll({
    target: outerRef,
    offset: ['start start', 'end end'],
  });

  // Smoothed once with a light spring
  const smoothedProgress = useSpring(scrollYProgress, {
    stiffness: 280,
    damping: 32,
    restDelta: 0.001,
  });

  const [activeBeatId, setActiveBeatId] = useState<string>(BEATS[0].id);

  // Update active beat React state ONLY on beat boundary changes
  useMotionValueEvent(smoothedProgress, 'change', (latest) => {
    const activeIdx = getActiveBeatIndex(latest, BEATS);
    const newBeatId = BEATS[activeIdx].id;
    if (newBeatId !== activeBeatId) {
      setActiveBeatId(newBeatId);
    }
  });

  // Stage background interpolation from deep navy to bright white-blue
  const stageBg = useTransform(
    smoothedProgress,
    [0, 1],
    [SCENE_CONFIG.STAGE_BG_START, SCENE_CONFIG.STAGE_BG_END]
  );

  // Dynamic text color interpolation ensuring WCAG AA contrast against stage background
  const textColor = useTransform(
    smoothedProgress,
    [0, 0.5, 1],
    ['rgb(248, 250, 252)', 'rgb(148, 163, 184)', 'rgb(15, 23, 42)']
  );
  const mutedTextColor = useTransform(
    smoothedProgress,
    [0, 0.5, 1],
    ['rgb(203, 213, 225)', 'rgb(100, 116, 139)', 'rgb(51, 65, 85)']
  );

  // Data sets
  const heroData = getHeroData();
  const aboutData = getAboutData();
  const approachData = getApproachData();
  const ecosystemData = getEcosystemData();
  const studentJourneyData = getStudentJourneyData();
  const whoIsECellForData = getWhoIsECellForData();
  const finalCTAData = getFinalCTAData();

  // Smooth scroll handler for "Explore Our Vision"
  const handleScrollToAbout = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!outerRef.current) return;
    const outerTop = outerRef.current.offsetTop;
    const scrollableHeight =
      outerRef.current.scrollHeight - window.innerHeight;
    const targetY = outerTop + scrollableHeight * BEATS[1].start;

    window.scrollTo({
      top: targetY,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  };

  // Hero transforms
  const heroOpacity = useTransform(
    smoothedProgress,
    [BEATS[0].start, 0.08, BEATS[0].end],
    [1, 1, 0]
  );
  const heroTranslateY = useTransform(
    smoothedProgress,
    [BEATS[0].start, 0.08, BEATS[0].end],
    [0, 0, -35]
  );

  // Final CTA transforms
  const finalCTAOpacity = useTransform(
    smoothedProgress,
    [BEATS[6].start, BEATS[6].start + 0.06, 1.0],
    [0, 1, 1]
  );
  const finalCTATranslateY = useTransform(
    smoothedProgress,
    [BEATS[6].start, BEATS[6].start + 0.06, 1.0],
    [30, 0, 0]
  );

  // -------------------------------------------------------------
  // Reduced Motion Fallback: normal stacked layout with static bulb
  // -------------------------------------------------------------
  if (prefersReducedMotion) {
    return (
      <div id="about" className="w-full bg-background text-foreground py-16 px-6">
        <div className="max-w-4xl mx-auto space-y-24">
          {/* Static Bulb */}
          <BulbBackground progress={smoothedProgress} isReducedMotion={true} />

          {/* Hero */}
          <section className="text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
              {heroData.title}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {heroData.description}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Button asChild size="lg">
                <Link to={GET_INVOLVED_PATH}>{heroData.primaryCta}</Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={handleScrollToAbout}
              >
                {heroData.secondaryCta}
              </Button>
            </div>
          </section>

          {/* About */}
          <section className="space-y-8">
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                {aboutData.eyebrow}
              </p>
              <h2 className="text-3xl font-bold tracking-tight mt-1">
                {aboutData.title}
              </h2>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {aboutData.cards.map((card, i) => (
                <IdeaCard
                  key={card.id}
                  id={card.id}
                  text={card.text}
                  cardIndex={i}
                  totalCards={aboutData.cards.length}
                  beat={BEATS[1]}
                  progress={smoothedProgress}
                  isReducedMotion={true}
                />
              ))}
            </div>
          </section>

          {/* Our Approach */}
          <section className="space-y-8">
            <h2 className="text-3xl font-bold tracking-tight text-center">
              {approachData.title}
            </h2>
            <div className="grid gap-4 md:grid-cols-3">
              {approachData.cards.map((card, i) => (
                <IdeaCard
                  key={card.id}
                  id={card.id}
                  title={card.title}
                  description={card.description}
                  cardIndex={i}
                  totalCards={approachData.cards.length}
                  beat={BEATS[2]}
                  progress={smoothedProgress}
                  isReducedMotion={true}
                />
              ))}
            </div>
          </section>

          {/* Ecosystem */}
          <section className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight">
                {ecosystemData.title}
              </h2>
              {ecosystemData.subtitle && (
                <p className="text-muted-foreground mt-1">
                  {ecosystemData.subtitle}
                </p>
              )}
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {ecosystemData.cards.map((card, i) => (
                <IdeaCard
                  key={card.id}
                  id={card.id}
                  title={card.title}
                  description={card.description}
                  cardIndex={i}
                  totalCards={ecosystemData.cards.length}
                  beat={BEATS[3]}
                  progress={smoothedProgress}
                  isReducedMotion={true}
                />
              ))}
            </div>
          </section>

          {/* Student Journey */}
          <section className="space-y-8">
            <h2 className="text-3xl font-bold tracking-tight text-center">
              {studentJourneyData.title}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {studentJourneyData.cards.map((card, i) => (
                <IdeaCard
                  key={card.id}
                  id={card.id}
                  title={card.title}
                  description={card.description}
                  cardIndex={i}
                  totalCards={studentJourneyData.cards.length}
                  beat={BEATS[4]}
                  progress={smoothedProgress}
                  isReducedMotion={true}
                />
              ))}
            </div>
          </section>

          {/* Who Is E-Cell For */}
          <section className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight">
                {whoIsECellForData.title}
              </h2>
              {whoIsECellForData.subtitle && (
                <p className="text-muted-foreground mt-1">
                  {whoIsECellForData.subtitle}
                </p>
              )}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {whoIsECellForData.cards.map((card, i) => (
                <IdeaCard
                  key={card.id}
                  id={card.id}
                  title={card.title}
                  description={card.description}
                  cardIndex={i}
                  totalCards={whoIsECellForData.cards.length}
                  beat={BEATS[5]}
                  progress={smoothedProgress}
                  isReducedMotion={true}
                />
              ))}
            </div>
          </section>

          {/* Final CTA */}
          <section className="text-center space-y-6 pt-12">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
              {finalCTAData.title}
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
              {finalCTAData.description}
            </p>
            <div className="pt-4">
              <Button asChild size="lg">
                <Link to={GET_INVOLVED_PATH}>{finalCTAData.ctaText}</Link>
              </Button>
            </div>
          </section>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // Full 3D Scroll-Driven Scene
  // -------------------------------------------------------------
  return (
    <div
      ref={outerRef}
      id="about"
      className="relative w-full"
      style={{ height: SCENE_CONFIG.DESKTOP_HEIGHT }}
    >
      {/* Sticky 100vh Stage */}
      <motion.div
        style={{
          backgroundColor: stageBg,
          perspective: SCENE_CONFIG.PERSPECTIVE,
        }}
        className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center preserve-3d transition-colors duration-200"
      >
        {/* Layered Inline SVG Bulb */}
        <BulbBackground progress={smoothedProgress} />

        {/* 1. HERO BEAT (0.00 - 0.10) */}
        <motion.div
          style={{
            opacity: heroOpacity,
            y: heroTranslateY,
          }}
          className={`absolute top-1/2 -translate-y-1/2 inset-x-0 mx-auto px-6 max-w-3xl text-center z-30 ${
            activeBeatId !== 'hero' ? 'pointer-events-none' : ''
          }`}
          {...(activeBeatId !== 'hero' ? { inert: '' } : {})}
        >
          <motion.h1
            style={{ color: textColor }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight"
          >
            {heroData.title}
          </motion.h1>
          <motion.p
            style={{ color: mutedTextColor }}
            className="mt-6 text-base sm:text-lg md:text-xl font-normal leading-relaxed max-w-2xl mx-auto"
          >
            {heroData.description}
          </motion.p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="lg" tabIndex={activeBeatId === 'hero' ? 0 : -1}>
              <Link to={GET_INVOLVED_PATH}>{heroData.primaryCta}</Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={handleScrollToAbout}
              tabIndex={activeBeatId === 'hero' ? 0 : -1}
            >
              {heroData.secondaryCta}
            </Button>
          </div>
        </motion.div>

        {/* 2. ABOUT BEAT (0.10 - 0.24) */}
        <SectionHeading
          beat={BEATS[1]}
          progress={smoothedProgress}
          title={aboutData.title}
          eyebrow={aboutData.eyebrow}
          textColor={textColor}
          mutedTextColor={mutedTextColor}
        />
        {aboutData.cards.map((card, i) => (
          <IdeaCard
            key={card.id}
            id={card.id}
            text={card.text}
            cardIndex={i}
            totalCards={aboutData.cards.length}
            beat={BEATS[1]}
            progress={smoothedProgress}
          />
        ))}

        {/* 3. APPROACH BEAT (0.24 - 0.38) */}
        <SectionHeading
          beat={BEATS[2]}
          progress={smoothedProgress}
          title={approachData.title}
          textColor={textColor}
          mutedTextColor={mutedTextColor}
        />
        {approachData.cards.map((card, i) => (
          <IdeaCard
            key={card.id}
            id={card.id}
            title={card.title}
            description={card.description}
            cardIndex={i}
            totalCards={approachData.cards.length}
            beat={BEATS[2]}
            progress={smoothedProgress}
          />
        ))}

        {/* 4. ECOSYSTEM BEAT (0.38 - 0.52) */}
        <SectionHeading
          beat={BEATS[3]}
          progress={smoothedProgress}
          title={ecosystemData.title}
          subtitle={ecosystemData.subtitle}
          textColor={textColor}
          mutedTextColor={mutedTextColor}
        />
        {ecosystemData.cards.map((card, i) => (
          <IdeaCard
            key={card.id}
            id={card.id}
            title={card.title}
            description={card.description}
            cardIndex={i}
            totalCards={ecosystemData.cards.length}
            beat={BEATS[3]}
            progress={smoothedProgress}
          />
        ))}

        {/* 5. STUDENT JOURNEY BEAT (0.52 - 0.68) */}
        <SectionHeading
          beat={BEATS[4]}
          progress={smoothedProgress}
          title={studentJourneyData.title}
          textColor={textColor}
          mutedTextColor={mutedTextColor}
        />
        {studentJourneyData.cards.map((card, i) => (
          <IdeaCard
            key={card.id}
            id={card.id}
            title={card.title}
            description={card.description}
            cardIndex={i}
            totalCards={studentJourneyData.cards.length}
            beat={BEATS[4]}
            progress={smoothedProgress}
          />
        ))}

        {/* 6. WHO IS E-CELL FOR BEAT (0.68 - 0.84) */}
        <SectionHeading
          beat={BEATS[5]}
          progress={smoothedProgress}
          title={whoIsECellForData.title}
          subtitle={whoIsECellForData.subtitle}
          textColor={textColor}
          mutedTextColor={mutedTextColor}
        />
        {whoIsECellForData.cards.map((card, i) => (
          <IdeaCard
            key={card.id}
            id={card.id}
            title={card.title}
            description={card.description}
            cardIndex={i}
            totalCards={whoIsECellForData.cards.length}
            beat={BEATS[5]}
            progress={smoothedProgress}
          />
        ))}

        {/* 7. FINAL CTA BEAT (0.84 - 1.00) - No Exit */}
        <motion.div
          style={{
            opacity: finalCTAOpacity,
            y: finalCTATranslateY,
          }}
          className={`absolute top-1/2 -translate-y-1/2 inset-x-0 mx-auto px-6 max-w-3xl text-center z-30 ${
            activeBeatId !== 'final-cta' ? 'pointer-events-none' : ''
          }`}
          {...(activeBeatId !== 'final-cta' ? { inert: '' } : {})}
        >
          <motion.h2
            style={{ color: textColor }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight"
          >
            {finalCTAData.title}
          </motion.h2>
          <motion.p
            style={{ color: mutedTextColor }}
            className="mt-6 text-base sm:text-lg md:text-xl font-normal leading-relaxed max-w-2xl mx-auto"
          >
            {finalCTAData.description}
          </motion.p>
          <div className="mt-8 flex justify-center">
            <Button
              asChild
              size="lg"
              tabIndex={activeBeatId === 'final-cta' ? 0 : -1}
            >
              <Link to={GET_INVOLVED_PATH}>{finalCTAData.ctaText}</Link>
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

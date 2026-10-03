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
import { IdeaCard } from './IdeaCard';
import TrueFocus from './TrueFocus';
import EchoText from './EchoText';
import { Button } from '@/components/ui/button';
import { getHeadingRange } from './timelineHelpers';
import { HomeBackground } from './HomeBackground';
import {
  ENTER_EASE,
  EXIT_EASE,
  LINEAR_EASE,
  getActiveBeatIndexWithHysteresis,
} from './timelineHelpers';

interface SectionHeadingProps {
  beat: BeatConfig;
  progress: MotionValue<number>;
  title: string;
  subtitle?: string;
  eyebrow?: string;
  isActiveBeat: boolean;
}

const SectionHeading: React.FC<SectionHeadingProps> = ({
  beat,
  progress,
  title,
  subtitle,
  eyebrow,
  isActiveBeat,
}) => {
  const { enterStart, enterEnd, exitStart, exitEnd, hasExit } = getHeadingRange(beat);
  const span = beat.end - beat.start;
  const subtitleStart = enterStart + span * 0.025;
  const subtitleEnd = enterStart + span * 0.17;

  const opacity = useTransform(
    progress,
    hasExit
      ? [enterStart, enterEnd, exitStart, exitEnd]
      : [enterStart, enterEnd],
    hasExit ? [0, 1, 1, 0] : [0, 1],
    hasExit
      ? { ease: [ENTER_EASE, LINEAR_EASE, EXIT_EASE] }
      : { ease: ENTER_EASE }
  );

  const translateY = useTransform(
    progress,
    hasExit
      ? [enterStart, enterEnd, exitStart, exitEnd]
      : [enterStart, enterEnd],
    hasExit ? [24, 0, 0, -24] : [24, 0],
    hasExit
      ? { ease: [ENTER_EASE, LINEAR_EASE, EXIT_EASE] }
      : { ease: ENTER_EASE }
  );
  const subtitleOpacity = useTransform(
    progress,
    hasExit
      ? [subtitleStart, subtitleEnd, exitStart, exitEnd]
      : [subtitleStart, subtitleEnd],
    hasExit ? [0, 1, 1, 0] : [0, 1],
    hasExit
      ? { ease: [ENTER_EASE, LINEAR_EASE, EXIT_EASE] }
      : { ease: ENTER_EASE }
  );
  const subtitleY = useTransform(
    progress,
    hasExit
      ? [subtitleStart, subtitleEnd, exitStart, exitEnd]
      : [subtitleStart, subtitleEnd],
    hasExit ? [12, 0, 0, -18] : [12, 0],
    hasExit
      ? { ease: [ENTER_EASE, LINEAR_EASE, EXIT_EASE] }
      : { ease: ENTER_EASE }
  );

  return (
    <motion.div
      style={{
        opacity,
        y: translateY,
        visibility: isActiveBeat ? 'visible' : 'hidden',
        pointerEvents: isActiveBeat ? 'none' : 'none',
      }}
      {...(!isActiveBeat ? { inert: '' } : {})}
      className="absolute top-16 md:top-[4.625rem] inset-x-0 mx-auto px-6 max-w-3xl text-center pointer-events-none z-10"
    >
      {eyebrow && (
        <motion.p className="text-xs md:text-sm font-semibold uppercase tracking-widest mb-0 text-primary">
          {eyebrow}
        </motion.p>
      )}
      <motion.h2 className="text-2xl md:text-4xl md:leading-9 font-extrabold tracking-tight text-foreground">
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          style={{ opacity: subtitleOpacity, y: subtitleY }}
          className="mt-2 text-sm md:text-base font-normal max-w-xl mx-auto text-muted-foreground"
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
    stiffness: 140,
    damping: 28,
    mass: 0.35,
    restDelta: 0.0004,
  });

  const [activeBeatId, setActiveBeatId] = useState<string>(BEATS[0].id);
  const activeBeatIndexRef = useRef(0);
  const [compactMotion, setCompactMotion] = useState(false);

  React.useEffect(() => {
    const media = window.matchMedia('(max-width: 767px), (pointer: coarse)');
    const updateCompactMotion = () => setCompactMotion(media.matches);
    updateCompactMotion();
    media.addEventListener('change', updateCompactMotion);
    return () => media.removeEventListener('change', updateCompactMotion);
  }, []);

  const activeBeatIndex = activeBeatIndexRef.current;
  const isBeatActive = (beatIndex: number) => activeBeatId === BEATS[beatIndex].id;
  const isBeatNearActive = (beatIndex: number) => Math.abs(activeBeatIndex - beatIndex) <= 1;

  useMotionValueEvent(smoothedProgress, 'change', (latest) => {
    const activeIdx = getActiveBeatIndexWithHysteresis(
      latest,
      BEATS,
      activeBeatIndexRef.current,
      0.01
    );
    if (activeIdx !== activeBeatIndexRef.current) {
      activeBeatIndexRef.current = activeIdx;
      const newBeatId = BEATS[activeIdx].id;
      setActiveBeatId(newBeatId);
    }
  });

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

    const aboutEl = document.getElementById('about');
    if (!aboutEl) return;

    const rect = aboutEl.getBoundingClientRect();
    const targetY = Math.max(
      window.scrollY + rect.top + window.innerHeight * 0.18,
      0
    );

    window.scrollTo({
      top: targetY,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  };

  // Hero transforms
  const heroOpacity = useTransform(
    smoothedProgress,
    [BEATS[0].start, BEATS[0].end],
    [1, 0],
    { ease: EXIT_EASE }
  );
  const heroTranslateY = useTransform(
    smoothedProgress,
    [BEATS[0].start, BEATS[0].end],
    [0, -80],
    { ease: EXIT_EASE }
  );

  // Final CTA transforms
  const finalCTAOpacity = useTransform(
    smoothedProgress,
    [BEATS[6].start, BEATS[6].start + (BEATS[6].end - BEATS[6].start) * 0.14, BEATS[6].end],
    [0, 1, 1],
    { ease: [ENTER_EASE, LINEAR_EASE] }
  );
  const finalCTATranslateY = useTransform(
    smoothedProgress,
    [BEATS[6].start, BEATS[6].start + (BEATS[6].end - BEATS[6].start) * 0.14, BEATS[6].end],
    [24, 0, 0],
    { ease: [ENTER_EASE, LINEAR_EASE] }
  );

  // -------------------------------------------------------------
  // Reduced motion uses a static stacked layout.
  // -------------------------------------------------------------
  if (prefersReducedMotion) {
    return (
      <div id="about" className="relative w-full theme-gradient text-foreground py-16 px-6">
        <HomeBackground />
        <div className="absolute top-24 inset-x-0 z-10 px-6 pointer-events-none">
          <TrueFocus
            sentence="CSEA E-CELL"
            manualMode
            blurAmount={2.5}
            borderColor="hsl(var(--primary))"
            focusColor="hsl(var(--primary) / 0.6)"
            animationDuration={0}
          />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto space-y-24 pt-16">
          {/* Hero */}
          <section className="text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-primary">
              <EchoText
                text={heroData.title}
                className="hero-title-echo"
                echoes={6}
                offset={12}
                fade={0.55}
                blur={1.5}
                duration={900}
                mode="entrance"
                fontSize="inherit"
                fontWeight="inherit"
                color="inherit"
              />
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              <EchoText
                text={heroData.description}
                className="hero-description-echo"
                echoes={3}
                lag={0.2}
                offset={6}
                fade={0.42}
                blur={0.8}
                duration={900}
                mode="entrance"
                fontSize="inherit"
                fontWeight="inherit"
                color="inherit"
              />
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
  // Scroll-driven story scene
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
          perspective: SCENE_CONFIG.PERSPECTIVE,
        }}
        className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center preserve-3d theme-gradient"
      >
        <HomeBackground />
        <motion.div
          style={{
            opacity: heroOpacity,
            visibility: isBeatActive(0) ? 'visible' : 'hidden',
            willChange: isBeatNearActive(0) ? 'transform, opacity' : 'auto',
          }}
          {...(!isBeatActive(0) ? { inert: '' } : {})}
          className="absolute top-6 inset-x-0 z-30 px-6 pointer-events-none"
        >
          <TrueFocus
            sentence="CSEA E-CELL"
            blurAmount={2.5}
            borderColor="hsl(var(--primary))"
            focusColor="hsl(var(--primary) / 0.6)"
            animationDuration={2.5}
            pauseBetweenAnimations={0.8}
          />
        </motion.div>

        {/* 1. HERO BEAT (0.00 - 0.10) */}
        <motion.div
          style={{
            opacity: heroOpacity,
            y: heroTranslateY,
            visibility: isBeatActive(0) ? 'visible' : 'hidden',
            willChange: isBeatNearActive(0) ? 'transform, opacity' : 'auto',
          }}
          className={`absolute top-1/2 -translate-y-1/2 inset-x-0 mx-auto px-6 max-w-3xl text-center z-30 ${
            activeBeatId !== 'hero' ? 'pointer-events-none' : ''
          }`}
          {...(activeBeatId !== 'hero' ? { inert: '' } : {})}
        >
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight text-primary"
          >
            <EchoText
              key={activeBeatId === 'hero' ? 'hero-active' : 'hero-inactive'}
              text={heroData.title}
              className="hero-title-echo"
              echoes={6}
              offset={12}
              fade={0.55}
              blur={1.5}
              duration={900}
              mode="entrance"
              fontSize="inherit"
              fontWeight="inherit"
              color="inherit"
            />
          </motion.h1>
          <motion.p
            className="mt-6 text-base sm:text-lg md:text-xl font-normal leading-relaxed max-w-2xl mx-auto text-muted-foreground"
          >
            <EchoText
              key={activeBeatId === 'hero' ? 'hero-active' : 'hero-inactive'}
              text={heroData.description}
              className="hero-description-echo"
              echoes={3}
              lag={0.2}
              offset={6}
              fade={0.42}
              blur={0.8}
              duration={900}
              mode="entrance"
              fontSize="inherit"
              fontWeight="inherit"
              color="inherit"
            />
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
          isActiveBeat={isBeatActive(1)}
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
            compactMotion={compactMotion}
            isActiveBeat={isBeatActive(1)}
            isNearActiveBeat={isBeatNearActive(1)}
          />
        ))}

        {/* 3. APPROACH BEAT (0.24 - 0.38) */}
        <SectionHeading
          beat={BEATS[2]}
          progress={smoothedProgress}
          title={approachData.title}
          isActiveBeat={isBeatActive(2)}
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
            compactMotion={compactMotion}
            isActiveBeat={isBeatActive(2)}
            isNearActiveBeat={isBeatNearActive(2)}
          />
        ))}

        {/* 4. ECOSYSTEM BEAT (0.38 - 0.52) */}
        <SectionHeading
          beat={BEATS[3]}
          progress={smoothedProgress}
          title={ecosystemData.title}
          subtitle={ecosystemData.subtitle}
          isActiveBeat={isBeatActive(3)}
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
            compactMotion={compactMotion}
            isActiveBeat={isBeatActive(3)}
            isNearActiveBeat={isBeatNearActive(3)}
          />
        ))}

        {/* 5. STUDENT JOURNEY BEAT (0.52 - 0.68) */}
        <SectionHeading
          beat={BEATS[4]}
          progress={smoothedProgress}
          title={studentJourneyData.title}
          isActiveBeat={isBeatActive(4)}
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
            compactMotion={compactMotion}
            isActiveBeat={isBeatActive(4)}
            isNearActiveBeat={isBeatNearActive(4)}
          />
        ))}

        {/* 6. WHO IS E-CELL FOR BEAT (0.68 - 0.84) */}
        <SectionHeading
          beat={BEATS[5]}
          progress={smoothedProgress}
          title={whoIsECellForData.title}
          subtitle={whoIsECellForData.subtitle}
          isActiveBeat={isBeatActive(5)}
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
            compactMotion={compactMotion}
            isActiveBeat={isBeatActive(5)}
            isNearActiveBeat={isBeatNearActive(5)}
          />
        ))}

        {/* 7. FINAL CTA BEAT (0.84 - 1.00) - No Exit */}
        <motion.div
          style={{
            opacity: finalCTAOpacity,
            y: finalCTATranslateY,
            visibility: isBeatActive(6) ? 'visible' : 'hidden',
            willChange: isBeatNearActive(6) ? 'transform, opacity' : 'auto',
          }}
          className={`absolute top-1/2 -translate-y-1/2 inset-x-0 mx-auto px-6 max-w-3xl text-center z-30 ${
            activeBeatId !== 'final-cta' ? 'pointer-events-none' : ''
          }`}
          {...(activeBeatId !== 'final-cta' ? { inert: '' } : {})}
        >
          <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-foreground"
          >
            {finalCTAData.title}
          </motion.h2>
          <motion.p
            className="mt-6 text-base sm:text-lg md:text-xl font-normal leading-relaxed max-w-2xl mx-auto text-muted-foreground"
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

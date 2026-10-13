import React, { useEffect, useState, useRef } from "react";
import GlyphPortal from "@/components/ui/glyph-portal";
import Topography from "@/components/ui/Topography";
import ReadyWord, { type ReadyWordRef } from "@/components/home/ReadyWord";
import ClickSpark from "@/components/ui/ClickSpark";
import { Eye, Target, Users, ArrowRight } from "lucide-react";

export interface HeroProps {
  /** The word displayed and zoomed through. Default: "READY" */
  word?: string;
  /** The letter to zoom into. Default: "E" */
  focusChar?: string;
  /** Scroll travel length in container heights. Default: 3.2 */
  scrollLength?: number;
}

export default function Hero({
  word = "READY",
  focusChar = "E",
  scrollLength = 3.2,
}: HeroProps) {
  const [fontReady, setFontReady] = useState(false);
  const heroContainerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const readyWordRef = useRef<ReadyWordRef>(null);

  useEffect(() => {
    let active = true;
    const fontSpec = `700 76px "Plus Jakarta Sans"`;
    const timer = setTimeout(() => {
      if (active) setFontReady(true);
    }, 1200);

    if (typeof document !== "undefined" && document.fonts) {
      document.fonts
        .load(fontSpec, "Build before you're READY.")
        .then(() => {
          if (active) setFontReady(true);
        })
        .catch(() => {
          if (active) setFontReady(true);
        });
    } else {
      setFontReady(true);
    }

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, []);

  // While font is loading, reserve a 100svh placeholder to prevent layout shifts
  if (!fontReady) {
    return (
      <div
        id="home"
        className="relative w-full h-[100svh] bg-transparent flex flex-col items-center justify-center select-none"
        aria-hidden="true"
      >
        <div className="flex flex-col items-center gap-4">
          <span className="font-display font-extrabold text-6xl sm:text-8xl tracking-tight text-[#0A0A0A]/10 uppercase select-none">
            {word}
          </span>
          <span className="text-xs font-mono tracking-widest text-[#0A0A0A]/40 uppercase animate-pulse">
            Loading Experience…
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={heroContainerRef}
      id="home"
      data-slipstream-hero
      data-pillars-ready="false"
      className="relative w-full overflow-x-clip select-text bg-transparent snap-start scroll-mt-0"
      style={{
        containerType: "inline-size",
        fontFamily: '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, sans-serif',
      }}
    >
      {/* React Bits Topography Background pinned across both opening frame & text reading buffer */}
      <div
        aria-hidden="true"
        className="sticky top-0 h-[100svh] w-full pointer-events-none z-0 -mb-[100svh] overflow-hidden select-none"
      >
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
      </div>

      <style>{`
        :root, [data-slipstream-hero] {
          --hero-left-edge: clamp(24px, 10vw, 150px);
        }
        @media (max-width: 767px) {
          :root, [data-slipstream-hero] {
            --hero-left-edge: 20px;
          }
        }

        /* Ensure front layer stays visible through the zoom transition instead of premature fading */
        [data-slipstream-hero] [data-gp-front] {
          opacity: 1 !important;
        }

        /* Hide the centered giant SVG glyph from GlyphPortal so right side remains completely open */
        [data-slipstream-hero] [data-gp-art] {
          display: none !important;
        }

        /* Hide the "Step inside" button */
        [data-slipstream-hero] [data-gp-caption] {
          display: none !important;
        }

        /* Blue field expands smoothly as zoom advances into the royal blue portal */
        [data-slipstream-hero] [data-gp-field] {
          clip-path: none !important;
          opacity: var(--hero-portal-opacity, 0) !important;
          pointer-events: none;
          transition: opacity 0.06s linear;
        }

        /* Top-Left: Logo & PSG Tech Club Name */
        .hero-brand-block {
          position: absolute;
          top: 36px;
          left: var(--hero-left-edge);
          display: flex;
          align-items: center;
          gap: 14px;
          z-index: 20;
          pointer-events: auto;
          will-change: opacity;
          opacity: var(--hero-aux-opacity, 1);
          transition: opacity 0.15s ease;
        }
        @media (max-width: 767px) {
          .hero-brand-block {
            top: 24px;
            gap: 10px;
          }
        }

        /* Soft white glow behind brand block so blue topography lines don't make it look dim */
        .hero-brand-glow {
          position: absolute;
          inset: -14px -28px -14px -14px;
          background: radial-gradient(ellipse at 40% 50%, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.88) 65%, rgba(255, 255, 255, 0) 100%);
          filter: blur(18px);
          pointer-events: none;
          z-index: -1;
        }

        .hero-logo-box {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          background: #FFFFFF;
          border: 1px solid rgba(0, 0, 0, 0.1);
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
          flex-shrink: 0;
        }
        @media (max-width: 767px) {
          .hero-logo-box {
            width: 40px;
            height: 40px;
            border-radius: 10px;
            padding: 3px;
          }
        }

        .hero-logo-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .hero-brand-text {
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 2px;
        }

        .hero-logo-text {
          font-size: 28px;
          font-weight: 800;
          line-height: 1.05;
          letter-spacing: -0.035em;
          color: #000000;
        }
        @media (max-width: 767px) {
          .hero-logo-text {
            font-size: 22px;
          }
        }

        .hero-college-text {
          font-size: 13px;
          font-weight: 600;
          line-height: 1.2;
          color: #1A1A1A;
          letter-spacing: 0.01em;
          margin: 0;
        }
        @media (max-width: 767px) {
          .hero-college-text {
            font-size: 11px;
          }
        }

        /* Main Headline Block (~55% vertical height) - Surrounding sentence remains static */
        .hero-headline-block {
          position: absolute;
          top: 55%;
          transform: translateY(-50%);
          left: var(--hero-left-edge);
          max-width: 620px;
          z-index: 20;
          pointer-events: auto;
          opacity: var(--hero-headline-opacity, 1);
        }
        @media (max-width: 767px) {
          .hero-headline-block {
            top: 45%;
            max-width: calc(100vw - 40px);
          }
        }

        /* Soft radial fade behind headline block for contour line readability */
        .hero-text-glow {
          position: absolute;
          inset: -36px -60px -40px -40px;
          background: radial-gradient(ellipse at 35% 45%, rgba(250, 250, 252, 0.88) 0%, rgba(250, 250, 252, 0.76) 45%, rgba(250, 250, 252, 0) 100%);
          filter: blur(48px);
          pointer-events: none;
          z-index: -1;
        }

        .hero-headline-text {
          margin: 0;
          font-family: inherit;
          font-size: clamp(44px, 5.2vw, 76px);
          font-weight: 700;
          line-height: 1.05;
          letter-spacing: -0.035em;
          color: #0A0A0A;
          text-wrap: balance;
        }
        @media (max-width: 767px) {
          .hero-headline-text {
            font-size: 40px;
            line-height: 1.1;
          }
        }

        .hero-ready-word {
          display: inline-block;
        }

        .hero-supporting-text {
          margin: 28px 0 0 0;
          font-size: 17px;
          font-weight: 400;
          line-height: 1.6;
          color: #262626;
          max-width: 520px;
          text-wrap: pretty;
          will-change: opacity;
          opacity: var(--hero-aux-opacity, 1);
          transition: opacity 0.15s ease;
        }
        @media (max-width: 767px) {
          .hero-supporting-text {
            font-size: 15px;
            max-width: 300px;
            margin-top: 20px;
          }
        }

        /* Bottom-Center Scroll Indicator */
        .hero-scroll-indicator {
          position: absolute;
          bottom: 40px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          color: #262626;
          opacity: 0.6;
          font-size: 11px;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          pointer-events: none;
          z-index: 20;
          will-change: opacity;
          opacity: var(--hero-aux-opacity, 1);
          transition: opacity 0.15s ease;
        }

        /* Smooth Bottom-to-Top Sequential 1:1 Scroll-Driven Container */
        [data-slipstream-hero] [data-gp-content]{
          padding: clamp(2.5rem, 7svh, 5.5rem) clamp(1.25rem, 5cqw, 5.5rem);
          min-height: var(--gp-height, 100svh);
          height: var(--gp-height, 100svh);
          box-sizing: border-box;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          font-family: inherit;
          background: transparent !important;
          overflow: hidden;
          z-index: 40 !important;
          opacity: 1 !important;
          pointer-events: auto !important;
        }

        .hero-copy-wrapper {
          display: flex;
          width: min(100%, 82rem);
          margin: 0 auto;
          flex-direction: column;
          align-items: flex-start;
          gap: clamp(1.25rem, 2.5svh, 2.25rem);
          will-change: transform;
          transform: translateY(calc(var(--hero-exit-y, 0px) - clamp(0px, 2.5svh, 24px)));
          pointer-events: auto;
        }

        .hero-eyebrow-flow {
          will-change: transform, opacity;
          opacity: var(--hero-head-opacity, 0);
          transform: translateY(var(--hero-head-y, 90px));
        }

        .hero-headline-flow {
          overflow: hidden;
          will-change: transform, opacity;
          opacity: var(--hero-head-opacity, 0);
          transform: translateY(var(--hero-head-y, 90px));
        }

        .hero-pillars-grid {
          border-color: rgba(255, 255, 255, calc(0.22 * var(--hero-grid-border-opacity, 0)));
        }

        .hero-col-1 {
          border-color: rgba(255, 255, 255, calc(0.22 * var(--hero-div1-opacity, 0)));
          transition: border-color 0.35s ease;
        }

        .hero-col-2 {
          border-color: rgba(255, 255, 255, calc(0.22 * var(--hero-div2-opacity, 0)));
          transition: border-color 0.35s ease;
        }

        /* Pillars Column Base: Non-interactive while text is rising in */
        .hero-pillar-item {
          position: relative;
          pointer-events: none;
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* Luminous Architectural Spotlight Layer */
        .hero-spotlight-layer {
          position: absolute;
          inset: 0;
          border-radius: 18px;
          background: radial-gradient(ellipse 95% 75% at 50% 0%, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.015) 60%, transparent 100%);
          box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.35);
          border: 1px solid rgba(255, 255, 255, 0.08);
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1), transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          transform: translateY(2px);
          z-index: 0;
        }

        /* Luminous Top Hairline Accent Beam */
        .hero-spotlight-beam {
          position: absolute;
          top: 0;
          left: 10%;
          right: 10%;
          height: 1.5px;
          border-radius: 9999px;
          background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.65) 50%, transparent 100%);
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.35s ease, transform 0.35s ease;
          transform: scaleX(0.8);
          z-index: 1;
        }

        /* DESKTOP ONLY: Hover activates ONLY when text has finished entering (data-pillars-ready="true") */
        @media (min-width: 768px) and (hover: hover) {
          [data-slipstream-hero][data-pillars-ready="true"] .hero-pillar-item {
            pointer-events: auto;
          }

          [data-slipstream-hero][data-pillars-ready="true"] .hero-pillar-item:hover .hero-spotlight-layer {
            opacity: 1;
            transform: translateY(0);
          }

          [data-slipstream-hero][data-pillars-ready="true"] .hero-pillar-item:hover .hero-spotlight-beam {
            opacity: 1;
            transform: scaleX(1);
          }

          [data-slipstream-hero][data-pillars-ready="true"] .hero-pillar-item:hover .hero-badge {
            transform: scale(1.08);
            background: rgba(255, 255, 255, 0.22);
            border-color: rgba(255, 255, 255, 0.45);
            box-shadow: 0 0 24px rgba(255, 255, 255, 0.32);
          }

          [data-slipstream-hero][data-pillars-ready="true"] .hero-pillar-item:hover .hero-pillar-body-text {
            color: rgba(255, 255, 255, 0.98);
          }

          /* Subtle border brighten on adjacent divider lines on hover */
          [data-slipstream-hero][data-pillars-ready="true"] .hero-col-1:hover {
            border-color: rgba(255, 255, 255, 0.35);
          }
          [data-slipstream-hero][data-pillars-ready="true"] .hero-col-2:hover {
            border-color: rgba(255, 255, 255, 0.35);
          }
        }

        /* MOBILE & TOUCH SCREENS: Strictly disable all hover states, spotlights, and transforms */
        @media (max-width: 767px), (hover: none) {
          .hero-pillar-item {
            pointer-events: auto !important;
            padding: 0 !important;
            margin: 0 !important;
          }

          .hero-spotlight-layer,
          .hero-spotlight-beam {
            display: none !important;
            opacity: 0 !important;
          }

          .hero-pillar-item:hover .hero-spotlight-layer,
          .hero-pillar-item:hover .hero-spotlight-beam {
            display: none !important;
            opacity: 0 !important;
          }

          .hero-pillar-item:hover .hero-badge {
            transform: none !important;
            background: rgba(255, 255, 255, 0.1) !important;
            border-color: rgba(255, 255, 255, 0.2) !important;
            box-shadow: 0 0 16px rgba(255, 255, 255, 0.12) !important;
          }

          .hero-pillar-item:hover .hero-pillar-body-text {
            color: rgba(255, 255, 255, 0.8) !important;
          }
        }

        .hero-c1-head {
          will-change: transform, opacity;
          opacity: var(--hero-c1-head-opacity, 0);
          transform: translateY(var(--hero-c1-head-y, 60px));
        }

        .hero-c1-body {
          will-change: transform, opacity;
          opacity: var(--hero-c1-body-opacity, 0);
          transform: translateY(var(--hero-c1-body-y, 50px));
        }

        .hero-c2-head {
          will-change: transform, opacity;
          opacity: var(--hero-c2-head-opacity, 0);
          transform: translateY(var(--hero-c2-head-y, 60px));
        }

        .hero-c2-body {
          will-change: transform, opacity;
          opacity: var(--hero-c2-body-opacity, 0);
          transform: translateY(var(--hero-c2-body-y, 50px));
        }

        .hero-c3-head {
          will-change: transform, opacity;
          opacity: var(--hero-c3-head-opacity, 0);
          transform: translateY(var(--hero-c3-head-y, 60px));
        }

        .hero-c3-body {
          will-change: transform, opacity;
          opacity: var(--hero-c3-body-opacity, 0);
          transform: translateY(var(--hero-c3-body-y, 50px));
        }

        .hero-cta-flow {
          will-change: transform, opacity;
          opacity: var(--hero-cta-opacity, 0);
          transform: translateY(var(--hero-cta-y, 45px));
        }
      `}</style>

      <GlyphPortal
        id="hero-portal"
        word={word}
        focusChar={focusChar}
        interactive={false}
        scrollLength={scrollLength}
        fontWeight={800}
        fontFamily='"Plus Jakarta Sans", -apple-system, sans-serif'
        enterLabel=""
        onProgress={(p) => {
          const hero = heroContainerRef.current;
          if (!hero) return;

          // Drive independent vector-sharp READY zoom
          readyWordRef.current?.updateProgress(p);

          // Clamping and smooth hermite easing helper
          const clampVal = (n: number, a = 0, b = 1) => Math.min(b, Math.max(a, n));
          const ease = (min: number, max: number, val: number) => {
            const x = clampVal((val - min) / (max - min));
            return x * x * (3 - 2 * x);
          };

          // Step 1: Camera zoom into 'E' in READY (p: 0.00 -> 0.36)
          const headlineOpacity = Math.max(0, 1 - Math.min(1, Math.max(0, (p - 0.04) / 0.12)));
          const auxOpacity = Math.max(0, 1 - Math.min(1, Math.max(0, p / 0.08)));
          const portalOpacity = clampVal((p - 0.16) / 0.12);

          // Step 2: Sequential One-By-One Rising Flow starting AFTER READY zoom finishes (p >= 0.36)
          // 1. Eyebrow + Headline (0.36 -> 0.48)
          const tHead = ease(0.36, 0.48, p);
          const headOpacity = tHead;
          const headY = (1 - tHead) * 90;

          // Grid top border line (0.46 -> 0.54)
          const gridBorderOpacity = ease(0.46, 0.54, p);

          // 2. Pillar 1: Our Vision (Header: 0.48 -> 0.56, Body: 0.54 -> 0.62)
          const tC1Head = ease(0.48, 0.56, p);
          const c1HeadOpacity = tC1Head;
          const c1HeadY = (1 - tC1Head) * 60;

          const tC1Body = ease(0.54, 0.62, p);
          const c1BodyOpacity = tC1Body;
          const c1BodyY = (1 - tC1Body) * 50;

          // Divider 1 (0.58 -> 0.66)
          const div1Opacity = ease(0.58, 0.66, p);

          // 3. Pillar 2: Our Mission (Header: 0.60 -> 0.68, Body: 0.66 -> 0.74)
          const tC2Head = ease(0.60, 0.68, p);
          const c2HeadOpacity = tC2Head;
          const c2HeadY = (1 - tC2Head) * 60;

          const tC2Body = ease(0.66, 0.74, p);
          const c2BodyOpacity = tC2Body;
          const c2BodyY = (1 - tC2Body) * 50;

          // Divider 2 (0.70 -> 0.78)
          const div2Opacity = ease(0.70, 0.78, p);

          // 4. Pillar 3: About Us (Header: 0.72 -> 0.80, Body: 0.78 -> 0.86)
          const tC3Head = ease(0.72, 0.80, p);
          const c3HeadOpacity = tC3Head;
          const c3HeadY = (1 - tC3Head) * 60;

          const tC3Body = ease(0.78, 0.86, p);
          const c3BodyOpacity = tC3Body;
          const c3BodyY = (1 - tC3Body) * 50;

          // 5. Pill CTA: Explore our projects -> (0.84 -> 0.94)
          const tCta = ease(0.84, 0.94, p);
          const ctaOpacity = tCta;
          const ctaY = (1 - tCta) * 45;

          // 6. Seamless Exit & Handoff to Projects (0.95 -> 1.00)
          const tExit = ease(0.95, 1.00, p);
          const exitY = -tExit * 24;

          hero.style.setProperty("--hero-headline-opacity", headlineOpacity.toFixed(4));
          hero.style.setProperty("--hero-aux-opacity", auxOpacity.toFixed(4));
          hero.style.setProperty("--hero-portal-opacity", portalOpacity.toFixed(4));

          hero.style.setProperty("--hero-head-opacity", headOpacity.toFixed(4));
          hero.style.setProperty("--hero-head-y", `${headY.toFixed(2)}px`);

          hero.style.setProperty("--hero-grid-border-opacity", gridBorderOpacity.toFixed(4));
          hero.style.setProperty("--hero-div1-opacity", div1Opacity.toFixed(4));
          hero.style.setProperty("--hero-div2-opacity", div2Opacity.toFixed(4));

          hero.style.setProperty("--hero-c1-head-opacity", c1HeadOpacity.toFixed(4));
          hero.style.setProperty("--hero-c1-head-y", `${c1HeadY.toFixed(2)}px`);
          hero.style.setProperty("--hero-c1-body-opacity", c1BodyOpacity.toFixed(4));
          hero.style.setProperty("--hero-c1-body-y", `${c1BodyY.toFixed(2)}px`);

          hero.style.setProperty("--hero-c2-head-opacity", c2HeadOpacity.toFixed(4));
          hero.style.setProperty("--hero-c2-head-y", `${c2HeadY.toFixed(2)}px`);
          hero.style.setProperty("--hero-c2-body-opacity", c2BodyOpacity.toFixed(4));
          hero.style.setProperty("--hero-c2-body-y", `${c2BodyY.toFixed(2)}px`);

          hero.style.setProperty("--hero-c3-head-opacity", c3HeadOpacity.toFixed(4));
          hero.style.setProperty("--hero-c3-head-y", `${c3HeadY.toFixed(2)}px`);
          hero.style.setProperty("--hero-c3-body-opacity", c3BodyOpacity.toFixed(4));
          hero.style.setProperty("--hero-c3-body-y", `${c3BodyY.toFixed(2)}px`);

          hero.style.setProperty("--hero-cta-opacity", ctaOpacity.toFixed(4));
          hero.style.setProperty("--hero-cta-y", `${ctaY.toFixed(2)}px`);
          hero.style.setProperty("--hero-exit-y", `${exitY.toFixed(2)}px`);

          // Pillars become interactive ONLY once all 3 pillars have fully settled into place (p >= 0.84)
          const isPillarsReady = p >= 0.84 && p <= 0.98;
          hero.dataset.pillarsReady = isPillarsReady ? "true" : "false";
        }}
        style={{
          "--gp-paper": "transparent",
          "--gp-ink": "#0A0A0A",
          "--gp-field": "#2547FF",
          "--gp-foreground": "#FFFFFF",
          fontFamily: '"Plus Jakarta Sans", -apple-system, sans-serif',
        }}
        background={
          <div
            data-gp-default-field
            style={{
              position: "absolute",
              inset: 0,
              transform: "scale(var(--gp-field-scale,1))",
              background: "radial-gradient(circle at 85% 15%, #2547FF 0%, #1636DB 45%, #0B1E8A 100%)",
            }}
          >
            {/* Luminous Concentric Radar Wave Rings in top-right */}
            <div
              aria-hidden="true"
              className="absolute -top-28 -right-28 w-[800px] h-[800px] pointer-events-none select-none opacity-30"
            >
              <svg viewBox="0 0 800 800" className="w-full h-full animate-[spin_240s_linear_infinite]" fill="none">
                <circle cx="400" cy="400" r="130" stroke="rgba(255,255,255,0.22)" strokeWidth="1.2" />
                <circle cx="400" cy="400" r="220" stroke="rgba(255,255,255,0.18)" strokeWidth="1.2" strokeDasharray="5 5" />
                <circle cx="400" cy="400" r="320" stroke="rgba(255,255,255,0.14)" strokeWidth="1.2" />
                <circle cx="400" cy="400" r="430" stroke="rgba(255,255,255,0.09)" strokeWidth="1.2" strokeDasharray="8 6" />
                <circle cx="400" cy="400" r="550" stroke="rgba(255,255,255,0.05)" strokeWidth="1.2" />
              </svg>
            </div>
          </div>
        }
        front={
          <div className="absolute inset-0 pointer-events-none select-text">
            {/* Top-Left: Logo & PSG Tech Club Name */}
            <a
              href="#home"
              className="hero-brand-block group transition-transform hover:scale-[1.02] cursor-pointer"
              aria-label="PSG Tech E-Cell Home"
            >
              {/* Soft Radial Fade for Readability over Topography Lines */}
              <div className="hero-brand-glow" aria-hidden="true" />

              <div className="hero-logo-box">
                <img
                  src="/images/ecell-logo.png"
                  alt="PSG Tech E-Cell Logo"
                  className="hero-logo-img"
                />
              </div>
              <div className="hero-brand-text">
                <span className="hero-logo-text">
                  E-Cell
                </span>
                <span className="hero-college-text">
                  PSG College of Technology
                </span>
              </div>
            </a>

            {/* Center-Left: Headline & Supporting Text Block at ~55% height */}
            <div ref={headlineRef} className="hero-headline-block">
              {/* Soft Radial Fade for Readability over Topography Lines */}
              <div className="hero-text-glow" aria-hidden="true" />

              {/* Main Headline */}
              <h1 className="hero-headline-text">
                <span>Build before</span>
                <br />
                <span>you&apos;re </span>
                <ReadyWord ref={readyWordRef} word={word} focusChar={focusChar} />
                <span className="text-[#2547FF]">.</span>
              </h1>

              {/* Supporting Text */}
              <p className="hero-supporting-text">
                A place to start, learn, and build. Turn your ideas into ventures and
                your ventures into impact.
              </p>
            </div>

            {/* Bottom-Center: Scroll to Explore Indicator */}
            <div className="hero-scroll-indicator">
              <span>SCROLL TO EXPLORE</span>
              <span className="text-[12px] animate-bounce">↓</span>
            </div>
          </div>
        }
      >
        {/* Floating 3-Column Content Scrubbed from Bottom-to-Top on Scroll */}
        <div className="hero-copy-wrapper">
          <ClickSpark
            sparkColor="#fff"
            sparkSize={10}
            sparkRadius={15}
            sparkCount={8}
            duration={400}
            className="flex flex-col items-start gap-[clamp(1.25rem,2.5svh,2.25rem)] w-full"
          >
            {/* Eyebrow: ● PSG TECH ENTREPRENEURSHIP CELL */}
            <div className="hero-eyebrow-flow flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.9)] animate-pulse" />
              <span className="font-mono text-xs font-normal tracking-[0.2em] text-white/90 uppercase select-none">
                PSG Tech Entrepreneurship Cell
              </span>
            </div>

            {/* Bold 2-Line Headline from Reference Image - Rises from Bottom */}
            <div className="hero-headline-flow">
              <h2 className="text-white font-display font-normal text-[36px] sm:text-[48px] md:text-[60px] lg:text-[72px] leading-[1.05] tracking-[-0.035em] text-balance">
                Where student ideas
                <br />
                become real ventures.
              </h2>
            </div>

            {/* 3 Pillars / Columns with Glass Circular Icon Badges & Perfectly Aligned Dividers */}
            <div className="hero-pillars-grid grid grid-cols-1 md:grid-cols-3 w-full border-t pt-7 sm:pt-9 gap-8 md:gap-0 transition-colors">
              {/* 01 — Our Vision */}
              <div className="hero-col-1 md:pr-10 md:border-r transition-colors">
                <div className="hero-pillar-item relative p-3.5 sm:p-4 -m-3.5 sm:-m-4 rounded-2xl">
                  {/* Architectural Spotlight & Hairline Beam (Desktop Hover Only, after text settles) */}
                  <div className="hero-spotlight-layer" aria-hidden="true" />
                  <div className="hero-spotlight-beam" aria-hidden="true" />

                  <div className="relative z-10">
                    <div className="hero-c1-head flex items-center gap-3.5 mb-3.5">
                      <div className="hero-badge w-11 h-11 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shrink-0 shadow-[0_0_16px_rgba(255,255,255,0.12)] transition-all duration-300">
                        <Eye className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-white font-sans font-medium text-xl tracking-tight">Our Vision</h3>
                    </div>
                    <div className="hero-c1-body">
                      <p className="hero-pillar-body-text text-white/80 font-sans font-normal text-base leading-[1.6] transition-colors duration-300">
                        To inspire students to think boldly, build fearlessly, and shape the future.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 02 — Our Mission */}
              <div className="hero-col-2 md:px-10 md:border-r transition-colors">
                <div className="hero-pillar-item relative p-3.5 sm:p-4 -m-3.5 sm:-m-4 rounded-2xl">
                  {/* Architectural Spotlight & Hairline Beam (Desktop Hover Only, after text settles) */}
                  <div className="hero-spotlight-layer" aria-hidden="true" />
                  <div className="hero-spotlight-beam" aria-hidden="true" />

                  <div className="relative z-10">
                    <div className="hero-c2-head flex items-center gap-3.5 mb-3.5">
                      <div className="hero-badge w-11 h-11 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shrink-0 shadow-[0_0_16px_rgba(255,255,255,0.12)] transition-all duration-300">
                        <Target className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-white font-sans font-medium text-xl tracking-tight">Our Mission</h3>
                    </div>
                    <div className="hero-c2-body">
                      <p className="hero-pillar-body-text text-white/80 font-sans font-normal text-base leading-[1.6] transition-colors duration-300">
                        To turn ideas into action through innovation, collaboration, and opportunity.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 03 — About Us */}
              <div className="hero-col-3 md:pl-10">
                <div className="hero-pillar-item relative p-3.5 sm:p-4 -m-3.5 sm:-m-4 rounded-2xl">
                  {/* Architectural Spotlight & Hairline Beam (Desktop Hover Only, after text settles) */}
                  <div className="hero-spotlight-layer" aria-hidden="true" />
                  <div className="hero-spotlight-beam" aria-hidden="true" />

                  <div className="relative z-10">
                    <div className="hero-c3-head flex items-center gap-3.5 mb-3.5">
                      <div className="hero-badge w-11 h-11 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shrink-0 shadow-[0_0_16px_rgba(255,255,255,0.12)] transition-all duration-300">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-white font-sans font-medium text-xl tracking-tight">About Us</h3>
                    </div>
                    <div className="hero-c3-body">
                      <p className="hero-pillar-body-text text-white/80 font-sans font-normal text-base leading-[1.6] transition-colors duration-300">
                        A student-driven community at PSG Tech fostering entrepreneurship, creativity, and real-world impact.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pill Button: Explore our projects → */}
            <div className="hero-cta-flow pt-2">
              <a
                href="#projects"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="group inline-flex items-center gap-3 bg-white text-[#1B3AE5] hover:bg-[#F2F4FF] hover:text-[#122CB0] px-7 py-3.5 rounded-full font-sans font-medium text-sm tracking-tight shadow-xl shadow-black/15 hover:shadow-2xl hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 cursor-pointer"
              >
                <span>Explore our projects</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </a>
            </div>
          </ClickSpark>
        </div>
      </GlyphPortal>
    </div>
  );
}

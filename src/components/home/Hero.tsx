import React, { useEffect, useState, useRef } from "react";
import GlyphPortal from "@/components/ui/glyph-portal";
import Topography from "@/components/ui/Topography";
import ReadyWord, { type ReadyWordRef } from "@/components/home/ReadyWord";

export interface HeroProps {
  /** The word displayed and zoomed through. Default: "READY" */
  word?: string;
  /** The letter to zoom into. Default: "E" */
  focusChar?: string;
  /** Scroll travel length in container heights. Default: 3.6 */
  scrollLength?: number;
}

export default function Hero({
  word = "READY",
  focusChar = "E",
  scrollLength = 3.6,
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

        /* Smooth Bottom-to-Top Floating Animation for the 3-Column Text */
        [data-slipstream-hero] [data-gp-content]{
          padding: clamp(3.5rem, 8svh, 6rem) clamp(1.25rem, 5cqw, 5rem) clamp(2rem, 5svh, 4rem);
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
        }

        [data-slipstream-copy]{
          display: flex;
          width: min(100%, 80rem);
          margin: 0 auto;
          flex-direction: column;
          align-items: flex-start;
          gap: clamp(1.5rem, 4svh, 3rem);
          will-change: transform, opacity;
          opacity: var(--gp-reveal, 0);
          transition: opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }

        [data-slipstream-copy] h2{
          max-width: 52rem;
          margin: 0;
          color: #FFFFFF;
          font-size: clamp(2rem, 1.2rem + 2.4cqw, 2.85rem);
          font-weight: 500;
          line-height: 1.22;
          letter-spacing: -0.02em;
          text-wrap: balance;
          opacity: var(--gp-reveal, 0);
          transform: translateY(calc((1 - var(--gp-reveal, 0)) * 45vh));
          transition: opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        [data-slipstream-features]{
          display: grid;
          width: 100%;
          grid-template-columns: 1fr;
          gap: 2rem;
        }

        @media(min-width: 768px){
          [data-slipstream-features]{
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 3.5rem;
          }
        }

        [data-slipstream-feature]{
          border-top: 1px solid rgba(255, 255, 255, 0.24);
          padding-top: 1.35rem;
          opacity: var(--gp-reveal, 0);
          transition: opacity 0.45s cubic-bezier(0.16, 1, 0.3, 1), transform 0.45s cubic-bezier(0.16, 1, 0.3, 1);
        }

        [data-slipstream-feature]:nth-child(1){
          transform: translateY(calc((1 - var(--gp-reveal, 0)) * 52vh));
          transition-delay: 0.03s;
        }
        [data-slipstream-feature]:nth-child(2){
          transform: translateY(calc((1 - var(--gp-reveal, 0)) * 58vh));
          transition-delay: 0.07s;
        }
        [data-slipstream-feature]:nth-child(3){
          transform: translateY(calc((1 - var(--gp-reveal, 0)) * 64vh));
          transition-delay: 0.11s;
        }

        [data-slipstream-bridge]{
          opacity: var(--gp-reveal, 0);
          transform: translateY(calc((1 - var(--gp-reveal, 0)) * 70vh));
          transition: opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          transition-delay: 0.15s;
        }

        [data-slipstream-feature] h3{
          margin: 0;
          color: #FFFFFF;
          font-size: 1.25rem;
          font-weight: 600;
          line-height: 1.25;
          letter-spacing: 0;
          display: flex;
          align-items: baseline;
          gap: 0.65rem;
        }

        [data-slipstream-feature] p{
          margin: 0.7rem 0 0;
          color: rgba(255, 255, 255, 0.85);
          font-size: 0.95rem;
          line-height: 1.62;
        }

        [data-slipstream-no]{
          display: inline-block;
          color: rgba(255, 255, 255, 0.7);
          font: 600 0.8rem ui-monospace, monospace;
          letter-spacing: 0.08em;
          transform: translateY(-0.05em);
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

          // Surrounding headline fades out early (0.06 to 0.18) so no ghost letters remain
          const headlineOpacity = Math.max(0, 1 - Math.min(1, Math.max(0, (p - 0.06) / 0.12)));
          // Auxiliary items (logo, subtitle, scroll prompt) fade out quickly
          const auxOpacity = Math.max(0, 1 - Math.min(1, Math.max(0, p / 0.10)));
          // Background portal stays 0 (pure white background) until letter E covers the screen (0.28 to 0.35)
          const portalOpacity = Math.min(1, Math.max(0, (p - 0.28) / 0.07));

          hero.style.setProperty("--hero-headline-opacity", headlineOpacity.toFixed(4));
          hero.style.setProperty("--hero-aux-opacity", auxOpacity.toFixed(4));
          hero.style.setProperty("--hero-portal-opacity", portalOpacity.toFixed(4));
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
              background: "#2547FF",
            }}
          />
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
        {/* Floating 3-Column Content Rising from Bottom-to-Top on Scroll */}
        <div data-slipstream-copy>
          <h2>A different way into what comes next.</h2>

          <div data-slipstream-features>
            {/* 01 — Our Vision */}
            <div data-slipstream-feature>
              <h3>
                <span data-slipstream-no>01 —</span>
                <span>Our Vision</span>
              </h3>
              <p>
                To inspire students to think boldly, build fearlessly, and shape the future.
              </p>
            </div>

            {/* 02 — Our Mission */}
            <div data-slipstream-feature>
              <h3>
                <span data-slipstream-no>02 —</span>
                <span>Our Mission</span>
              </h3>
              <p>
                To turn ideas into action through innovation, collaboration, and opportunity.
              </p>
            </div>

            {/* 03 — About Us */}
            <div data-slipstream-feature>
              <h3>
                <span data-slipstream-no>03 —</span>
                <span>About Us</span>
              </h3>
              <p>
                A student-driven community at PSG Tech fostering entrepreneurship, creativity, and real-world impact.
              </p>
            </div>
          </div>

          {/* Minimal Elegant Bottom Bridge to Projects */}
          <div data-slipstream-bridge className="pt-6 w-full flex justify-between items-center border-t border-white/15 mt-2">
            <span className="font-mono text-xs text-white/50 tracking-wider uppercase">
              PSG Tech Entrepreneurship Cell
            </span>
            <a
              href="#projects"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-white/80 hover:text-white uppercase transition-colors group cursor-pointer"
            >
              <span>Explore Projects Showcase</span>
              <span className="transition-transform group-hover:translate-y-0.5">↓</span>
            </a>
          </div>
        </div>
      </GlyphPortal>
    </div>
  );
}

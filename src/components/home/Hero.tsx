import React, { useEffect, useState } from "react";
import GlyphPortal from "@/components/ui/glyph-portal";
import Topography from "@/components/ui/Topography";

export interface HeroProps {
  /** The word displayed and zoomed through. Default: "IDEAS" */
  word?: string;
  /** The letter to zoom into. Default: "D" (auto-falls back if not present) */
  focusChar?: string;
  /** Scroll travel length in container heights. Default: 2.3 */
  scrollLength?: number;
}

export default function Hero({
  word = "IDEAS",
  focusChar = "D",
  scrollLength = 3.6,
}: HeroProps) {
  const [fontReady, setFontReady] = useState(false);

  useEffect(() => {
    let active = true;
    const fontSpec = `800 100px "Plus Jakarta Sans"`;
    // Timeout fallback (1800ms) to ensure Hero renders promptly even if network lags
    const timer = setTimeout(() => {
      if (active) setFontReady(true);
    }, 1800);

    if (typeof document !== "undefined" && document.fonts) {
      document.fonts
        .load(fontSpec, word)
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
  }, [word]);

  // While font is loading, reserve a 100svh placeholder to prevent layout shifts or premature offset math
  if (!fontReady) {
    return (
      <div
        id="home"
        className="relative w-full h-[100svh] bg-transparent flex flex-col items-center justify-center select-none"
        aria-hidden="true"
      >
        <div className="flex flex-col items-center gap-4">
          <span className="font-display font-extrabold text-7xl sm:text-9xl tracking-tight text-[#0A0A0A]/10 uppercase select-none">
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
        [data-slipstream-hero] [data-gp-caption]{inset:calc(var(--gp-word-bottom,50%) + 82px) 24px auto;justify-content:center;}
        [data-slipstream-hero] [data-gp-hint]{display:none;}
        [data-slipstream-hero] [data-gp-enter]{min-height:46px;padding:0 24px;gap:20px;background:#2547FF;border:1px solid rgba(255,255,255,0.25);border-radius:9999px;color:#fff;font-size:13px;font-weight:600;letter-spacing:0.04em;box-shadow:0 4px 16px rgba(37,71,255,0.35);transition:all .2s ease;}
        [data-slipstream-hero] [data-gp-enter]:hover{background:#1B3AE5;box-shadow:0 6px 22px rgba(37,71,255,0.48);transform:scale(1.02);}
        [data-slipstream-hero] [data-gp-enter]:focus-visible{outline:2px solid #8CA6FE;outline-offset:4px;}
        [data-slipstream-hero] [data-gp-touch-picker]{top:auto;bottom:18px;left:50%;}
        [data-slipstream-hero] [data-gp-select]{border-color:transparent;border-radius:8px;font-size:12px;color:#262626;}
        [data-sublime-header]{position:absolute;inset:clamp(24px,4.5cqw,48px) clamp(24px,5cqw,64px) auto;display:flex;align-items:center;justify-content:space-between;gap:20px;z-index:10;}
        [data-sublime-logo]{font-size:22px;font-weight:800;letter-spacing:-.04em;color:#0A0A0A;}
        [data-sublime-category]{font-size:12px;font-weight:500;line-height:1.5;color:#262626;opacity:0.7;font-family:inherit;}
        [data-sublime-eyebrow]{position:absolute;inset:auto 24px calc(100% - var(--gp-word-top,35%) + 32px);margin:0;text-align:center;font-size:14px;font-weight:500;line-height:1.5;letter-spacing:.01em;color:#262626;opacity:0.8;pointer-events:none;}
        [data-sublime-support]{position:absolute;inset:calc(var(--gp-word-bottom,50%) + 32px) 24px auto;margin:0;text-align:center;font-size:16px;font-weight:400;line-height:1.5;color:#262626;opacity:0.75;pointer-events:none;}
        [data-sublime-scroll]{position:absolute;inset:auto 24px 7%;text-align:center;color:#262626;opacity:0.6;font-size:11px;font-family:ui-monospace, monospace;letter-spacing:.08em;text-transform:uppercase;pointer-events:none;}
        [data-gp-motion=off] [data-sublime-scroll]{display:none;}
        @media(any-pointer:coarse){[data-sublime-scroll]{bottom:13%;}}
        @container(max-width:450px){[data-sublime-category]{max-width:14ch;text-align:right;}[data-sublime-eyebrow]{font-size:12px;}[data-sublime-support]{font-size:14px;}[data-slipstream-hero] [data-gp-caption]{top:calc(var(--gp-word-bottom,50%) + 76px);}}
        @container(max-height:479px){[data-sublime-header]{top:18px;}[data-sublime-support]{top:calc(var(--gp-word-bottom,50%) + 16px);}[data-slipstream-hero] [data-gp-caption]{top:calc(var(--gp-word-bottom,50%) + 60px);}[data-sublime-scroll]{display:none;}}

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
        enterLabel="Step inside"
        style={{
          "--gp-paper": "transparent",
          "--gp-ink": "#0A0A0A",
          "--gp-field": "#0B134A",
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
              background:
                "radial-gradient(ellipse at 50% 40%, #2547FF 0%, #1632D6 48%, #0B134A 100%)",
            }}
          />
        }
        front={
          <>
            <div data-sublime-header>
              <span data-sublime-logo>
                ecell<span className="text-[#2547FF]">.</span>
              </span>
              <span data-sublime-category>PSG College of Technology</span>
            </div>
            <p data-sublime-eyebrow>Ideas are just the beginning.</p>
            <p data-sublime-support>A space to ideate, collaborate, and build.</p>
            <span data-sublime-scroll>Scroll for a closer look ↓</span>
          </>
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

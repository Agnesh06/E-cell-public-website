import LineWaves from './LineWaves';

export default function Hero() {
  return (
    <section
      id="home"
      className="relative w-full min-h-screen overflow-hidden bg-[#FAFAFC] flex flex-col justify-between scroll-mt-20"
      aria-labelledby="hero-title"
    >
      {/* Interactive WebGL Background */}
      <div className="absolute inset-0 z-0">
        <LineWaves
          speed={0.3}
          innerLineCount={32}
          outerLineCount={36}
          warpIntensity={1.0}
          rotation={-45}
          edgeFadeWidth={0.0}
          colorCycleSpeed={1.0}
          brightness={0.2}
          color1="#2547FF"
          color2="#EDEFFC"
          color3="#FFFFFF"
          enableMouseInteraction={true}
          mouseInfluence={2.0}
          lightMode={true}
        />
      </div>

      {/* Hero Typography Content */}
      <div className="relative z-10 pointer-events-none max-w-[1280px] w-full mx-auto px-6 sm:px-10 lg:px-16 pt-36 sm:pt-44 md:pt-48 pb-16 flex-1 flex flex-col justify-center">
        <div className="max-w-2xl sm:max-w-3xl pointer-events-auto select-text">
          <h1
            id="hero-title"
            className="font-display font-bold text-[44px] leading-[1.08] sm:text-[60px] sm:leading-[1.06] md:text-[68px] md:leading-[1.05] lg:text-[76px] lg:leading-[1.04] text-[#0A0A0A] tracking-[-0.035em]"
          >
            Ideas are just <br className="hidden sm:inline" />
            the beginning<span className="text-[#2547FF]">.</span>
          </h1>

          <p className="mt-7 sm:mt-9 font-sans font-normal text-[17px] leading-[1.65] sm:text-[19px] sm:leading-[1.65] text-[#262626]/85 max-w-[580px] tracking-[-0.012em]">
            A space to ideate, collaborate, and build. Turn your curiosity into ideas and your ideas into something that matters.
          </p>
        </div>
      </div>

      {/* Refined Scroll Indicator */}
      <div className="relative z-10 pointer-events-none pb-10 flex justify-center items-center">
        <a
          href="#projects"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="flex flex-col items-center gap-2.5 font-mono text-[11px] font-medium tracking-[0.22em] text-[#262626]/60 uppercase pointer-events-auto cursor-pointer transition-colors duration-200 hover:text-[#0A0A0A] group"
          aria-label="Scroll to explore projects"
        >
          <span>SCROLL TO EXPLORE</span>
          <svg
            className="w-3.5 h-3.5 text-[#262626]/60 animate-bounce transition-colors duration-200 group-hover:text-[#0A0A0A]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.75}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </a>
      </div>
    </section>
  );
}

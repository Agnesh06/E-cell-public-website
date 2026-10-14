import * as React from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowDown, ExternalLink } from "lucide-react";
import Topography from "@/components/ui/Topography";
import { ScrollStack, ScrollStackItem } from "@/components/projects/ScrollStack";
import { LineSidebar } from "@/components/projects/LineSidebar";
import MobileProjectsGallery from "@/components/projects/MobileProjectsGallery";
import { getProjects } from "@/data/projects";

export default function Projects() {
  const navigate = useNavigate();
  const allProjects = useMemo(() => getProjects(), []);
  const projectTitles = useMemo(() => allProjects.map((p) => p.title), [allProjects]);

  const stackRef = useRef<HTMLDivElement>(null);
  const pinPointsRef = useRef<number[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const [isReducedMotion, setIsReducedMotion] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false
  );

  // Guarantee that navigating or loading this page starts at the very top (first project)
  useEffect(() => {
    if (typeof window !== "undefined") {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
    setActiveIndex(0);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Compute exact window.scrollY position where each card pins
  const updatePinPoints = useCallback(() => {
    const stackEl = stackRef.current;
    if (!stackEl) return;

    const slots = stackEl.querySelectorAll<HTMLElement>("[data-stack-slot]");
    if (!slots.length) return;

    const stackPosition = 130;
    const itemStackDistance = 20;
    const stackDocTop = stackEl.getBoundingClientRect().top + window.scrollY;

    const pins: number[] = [];
    slots.forEach((slot, i) => {
      const naturalTop =
        window.scrollY === 0
          ? slot.getBoundingClientRect().top
          : stackDocTop + slot.offsetTop;
      const pin = naturalTop - (stackPosition + i * itemStackDistance);
      pins.push(pin);
    });

    pinPointsRef.current = pins;
  }, []);

  useEffect(() => {
    updatePinPoints();
    const frameId = requestAnimationFrame(updatePinPoints);
    window.addEventListener("resize", updatePinPoints);
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", updatePinPoints);
    };
  }, [updatePinPoints]);

  // Sync scroll position with active sidebar index
  useEffect(() => {
    let rafId: number | null = null;
    const handleScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        const currentY = window.scrollY;
        const pins = pinPointsRef.current;
        if (!pins.length) return;

        let nextIndex = 0;
        for (let i = 0; i < pins.length; i++) {
          if (currentY >= pins[i] - 16) nextIndex = i;
        }
        setActiveIndex((prev) => (prev !== nextIndex ? nextIndex : prev));
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Jump to specific project pin on sidebar click
  const handleSidebarClick = useCallback((index: number) => {
    if (index === 0) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const pins = pinPointsRef.current;
    const targetPin = pins[index];
    if (targetPin === undefined) return;
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({
      top: Math.max(0, targetPin),
      behavior: isReduced ? "instant" : "smooth",
    });
  }, []);

  return (
    <main className="relative w-full min-h-screen bg-[#FAFAFC] text-[#0A0A0A] selection:bg-[#2547FF] selection:text-white">
      {/* Pinned Sticky Background: Exactly identical look, feel, speed, and parameters as Home Page */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
      >
        <Topography
          lowColor="#2547FF"
          midColor="#4B6FFF"
          highColor="#8CA6FE"
          speed={0.08}
          morphAmount={1.4}
          morphSpeed={0.012}
          bands={2.4}
          thickness={0.007}
          scale={2.0}
          pixelSize={1.0}
          glow={0.0}
          colorMode="elevation"
          contrast={1.4}
          brightness={1.0}
          fillBands={false}
          opacity={0.16}
          grain={false}
          grainIntensity={0.0}
          mouseInteraction={false}
        />
      </div>

      {/* Floating Back to Home Button - Redirects directly to the projects section on the main page */}
      <div className="fixed top-4 left-4 sm:top-5 sm:left-6 lg:left-12 z-40 pointer-events-auto">
        <Link
          to="/#projects"
          onClick={(e) => {
            e.preventDefault();
            navigate("/#projects");
            setTimeout(() => {
              document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
            }, 100);
          }}
          className="inline-flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-mono font-semibold uppercase tracking-[0.14em] sm:tracking-[0.16em] text-[#0A0A0A]/80 hover:text-[#2547FF] transition-all bg-white/95 hover:bg-white border border-black/10 px-3 py-2 sm:px-4 sm:py-2.5 rounded-full shadow-xs hover:shadow-md hover:border-[#2547FF]/30 active:scale-95 group backdrop-blur-md cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:-translate-x-1 text-[#2547FF]" />
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Hero Header Section - Refined, clean spacing with safe clearance on mobile */}
      <section className="relative z-20 text-center max-w-4xl mx-auto px-4 sm:px-6 pt-24 sm:pt-28 lg:pt-20 pb-6 sm:pb-8">
        <span className="text-[11px] sm:text-xs font-mono font-semibold uppercase tracking-[0.2em] sm:tracking-[0.24em] text-[#2547FF] mb-2 block">
          INNOVATION CATALOG
        </span>
<<<<<<< HEAD
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#0A0A0A] mb-3 sm:mb-4">
=======
        <h1 className="text-2xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#0A0A0A] mb-3 sm:mb-4">
>>>>>>> 1b801bd94473a8e512166fe75ce7bef6184a8b01
          Our <span className="text-[#2547FF]">Projects</span>
        </h1>
        <p className="text-sm lg:text-base text-[#0A0A0A]/65 max-w-xl mx-auto leading-relaxed font-sans px-2">
          The complete portfolio of student-led ventures, breakthrough prototypes, and engineering solutions built at PSG College of Technology.
        </p>

        {/* Laptop View Scroll Indicator */}
        <div className="hidden lg:inline-flex mt-6 items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#0A0A0A]/50 bg-white/80 border border-black/[0.06] px-4 py-2 rounded-full shadow-xs">
          <span>SCROLL TO EXPLORE STACK</span>
          <ArrowDown className="w-3.5 h-3.5 text-[#2547FF] animate-bounce" />
        </div>
      </section>

      {/* LAPTOP / DESKTOP VIEW ONLY (lg:grid) */}
      <section className="hidden lg:block relative z-20 max-w-7xl mx-auto px-8 pb-32">
        <div className="grid grid-cols-[220px_minmax(0,1fr)] gap-12 items-start">
          {/* Left Sticky Magnetic Sidebar */}
          <aside className="sticky top-[130px] self-start z-30 pt-2">
            <div className="mb-4 pb-2 border-b border-black/[0.06]">
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#0A0A0A]/45">
                INDEX ({String(allProjects.length).padStart(2, "0")})
              </span>
            </div>
            <LineSidebar
              items={projectTitles}
              activeIndex={activeIndex}
              onItemClick={handleSidebarClick}
              accentColor="#2547FF"
              textColor="#5A5A63"
              markerColor="#D0D5E5"
              showIndex
              showMarker
              markerLength={34}
              maxShift={14}
              itemGap={14}
              fontSize={0.92}
              proximityRadius={95}
            />
          </aside>

          {/* Right Column: Stacking Scroll Cards */}
          <div ref={stackRef} className="w-full min-w-0">
            <ScrollStack
              useWindowScroll
              smoothScroll={false}
              snap={false}
              stackPosition={130}
              itemDistance={80}
              itemStackDistance={20}
              itemScale={isReducedMotion ? 0 : 0.04}
              baseScale={isReducedMotion ? 1 : 0.86}
              dimAmount={isReducedMotion ? 0 : 0.07}
              blurAmount={0}
              tiltAmount={0}
              rotationAmount={0}
              holdDistance={180}
            >
              {allProjects.map((project, index) => (
                <ScrollStackItem
                  key={project.slug}
                  itemClassName="!bg-white !rounded-[24px] border border-black/[0.08] !h-[390px] !p-8 shadow-[0_24px_50px_-20px_rgba(37,71,255,0.18)] hover:shadow-[0_28px_60px_-18px_rgba(37,71,255,0.24)] transition-shadow"
                >
                  <div className="flex flex-row items-stretch justify-between h-full w-full gap-8">
                    {/* Left details */}
                    <div className="flex flex-col justify-between flex-1 min-w-0 pr-2">
                      <div>
                        {/* Header metadata row */}
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-sm font-bold text-[#2547FF] tracking-wider">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          {project.domain && (
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium tracking-wide bg-[#2547FF]/10 text-[#2547FF] border border-[#2547FF]/20">
                              {project.domain}
                            </span>
                          )}
                          {project.featured && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-amber-500/10 text-amber-600 border border-amber-500/20">
                              Featured
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <h2 className="mt-3 text-3xl font-bold text-[#0A0A0A] tracking-tight hover:text-[#2547FF] transition-colors">
                          <Link to={`/projects/${project.slug}`}>
                            {project.title}
                          </Link>
                        </h2>

                        {/* Tagline */}
                        {project.tagline && (
                          <p className="mt-1 text-sm font-medium text-[#2547FF]/85 tracking-tight font-sans">
                            {project.tagline}
                          </p>
                        )}

                        {/* Description */}
                        <p className="mt-3 text-sm text-[#0A0A0A]/70 line-clamp-2 leading-relaxed">
                          {project.description}
                        </p>

                        {/* Tech tags */}
                        {project.technologies && project.technologies.length > 0 && (
                          <div className="mt-4 flex flex-wrap gap-1.5">
                            {project.technologies.slice(0, 4).map((tech) => (
                              <span
                                key={tech}
                                className="px-2 py-0.5 rounded-md text-[11px] font-mono text-[#0A0A0A]/60 bg-black/[0.04] border border-black/[0.04]"
                              >
                                {tech}
                              </span>
                            ))}
                            {project.technologies.length > 4 && (
                              <span className="px-2 py-0.5 rounded-md text-[11px] font-mono text-[#0A0A0A]/40 bg-black/[0.02]">
                                +{project.technologies.length - 4} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Footer Actions */}
                      <div className="pt-4 border-t border-black/[0.06] flex items-center justify-between">
                        <Link
                          to={`/projects/${project.slug}`}
                          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2547FF] group/link hover:underline"
                        >
                          <span>Explore Project</span>
                          <span className="transition-transform group-hover/link:translate-x-1">
                            &rarr;
                          </span>
                        </Link>
                        <span className="text-xs font-mono text-[#0A0A0A]/40">
                          Lead: {project.teamLead}
                        </span>
                      </div>
                    </div>

                    {/* Right image preview */}
                    {project.coverImage && (
                      <div className="shrink-0 w-[240px] h-full rounded-2xl overflow-hidden border border-black/[0.08] bg-slate-100 shadow-xs relative group/img">
                        <img
                          src={project.coverImage}
                          alt={project.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity flex items-end p-3">
                          <span className="text-[11px] font-mono text-white flex items-center gap-1">
                            <span>Open Details</span>
                            <ExternalLink className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollStackItem>
              ))}
            </ScrollStack>
          </div>
        </div>
      </section>

      {/* MOBILE & TABLET VIEW ONLY (< lg) - Powered by Gallery02 architecture */}
<<<<<<< HEAD
      <section className="lg:hidden relative z-20 max-w-5xl mx-auto px-6 sm:px-10 pt-4 pb-24">
=======
      <section className="lg:hidden relative z-20 max-w-5xl mx-auto px-4 sm:px-8 pt-4 pb-24">
>>>>>>> 1b801bd94473a8e512166fe75ce7bef6184a8b01
        <MobileProjectsGallery projects={allProjects} />
      </section>

      {/* Minimal Footer */}
      <footer className="relative z-20 w-full px-6 lg:px-16 py-8 flex flex-col sm:flex-row items-center justify-between border-t border-black/[0.05] bg-white/40 text-xs font-mono text-[#0A0A0A]/50">
        <span>© 2026 E-Cell PSG Tech • Innovation Portfolio</span>
        <Link to="/" className="hover:text-[#2547FF] transition-colors mt-2 sm:mt-0 font-medium">
          Return to Overview →
        </Link>
      </footer>
    </main>
  );
}

import * as React from "react";
import { useNavigate, Link } from "react-router-dom";
import { WorksWheel } from "@/components/ui/works-wheel";
import { getWorksWheelItems } from "@/data/projects";
import TeamSection from "@/components/team/TeamSection";

export default function Projects() {
  const navigate = useNavigate();
  const items = React.useMemo(() => getWorksWheelItems(), []);
  const dragStartRef = React.useRef<{ x: number; y: number } | null>(null);
  const teamRef = React.useRef<HTMLDivElement | null>(null);

  const handleEndReached = React.useCallback(() => {
    teamRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    dragStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleClickCapture = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only intercept true clicks, ignore drags
    if (dragStartRef.current) {
      const dx = Math.abs(e.clientX - dragStartRef.current.x);
      const dy = Math.abs(e.clientY - dragStartRef.current.y);
      if (dx > 6 || dy > 6) {
        return;
      }
    }

    const target = e.target as HTMLElement;
    const anchor = target.closest("a");
    if (anchor && anchor.getAttribute("href")) {
      const href = anchor.getAttribute("href")!;
      if (href.startsWith("/")) {
        e.preventDefault();
        navigate(href);
      }
    }
  };

  return (
    <main className="relative w-full min-h-screen bg-[#FAFAFC] text-[#0A0A0A] flex flex-col">
      <h1 className="sr-only">PSG Tech E-Cell — Projects Portfolio Showcase</h1>

      {/* Projects Showcase Stage - Full Viewport */}
      <section className="relative w-full h-screen flex flex-col justify-between overflow-hidden">
        {/* Minimal Top Navigation */}
        <header className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-6 sm:px-10 pr-20 sm:pr-24 py-5 pointer-events-none">
          <Link
            to="/"
            className="pointer-events-auto flex items-center gap-2 text-xs font-mono uppercase tracking-[0.16em] text-[#0A0A0A]/70 hover:text-[#0A0A0A] transition-colors py-2"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Home
          </Link>
          <span className="text-[11px] font-mono tracking-[0.2em] uppercase text-[#0A0A0A]/40 hidden sm:inline-block">
            PSG TECH • E-CELL
          </span>
        </header>

        {/* WorksWheel Stage */}
        <div
          className="w-full h-full flex-1 relative"
          onPointerDown={handlePointerDown}
          onClickCapture={handleClickCapture}
        >
          <WorksWheel
            items={items}
            label="Projects '26"
            action="View"
            onEndReached={handleEndReached}
            className="w-full h-full"
          />
        </div>

        {/* Floating Navigation Hints */}
        <footer className="absolute bottom-5 left-6 sm:left-10 right-6 sm:right-10 z-20 flex items-center justify-between pointer-events-none">
          <span className="text-[11px] font-mono tracking-widest text-[#0A0A0A]/40 uppercase">
            Scroll / Drag to explore
          </span>
          <button
            type="button"
            onClick={() => teamRef.current?.scrollIntoView({ behavior: "smooth" })}
            className="pointer-events-auto text-[11px] font-mono tracking-widest text-[#0A0A0A]/60 hover:text-[#2547FF] uppercase flex items-center gap-1.5 transition-colors cursor-pointer group"
          >
            <span>Meet The Team</span>
            <span className="transition-transform group-hover:translate-y-0.5">↓</span>
          </button>
        </footer>
      </section>

      {/* Seamless continuation into the Team Section */}
      <section
        ref={teamRef}
        id="team-showcase"
        className="relative w-full min-h-screen flex flex-col justify-between border-t border-black/[0.04] bg-[#FAFAFC]"
      >
        <div className="flex-1 flex flex-col justify-center">
          <TeamSection
            catchphrase="The minds building the future at PSG Tech E-Cell"
            subtitle="CORE TEAM '26"
          />
        </div>

        {/* Bottom Footer Navigation */}
        <footer className="w-full px-6 sm:px-10 py-8 flex flex-col sm:flex-row items-center justify-between border-t border-black/[0.06] text-xs font-mono text-[#0A0A0A]/50 bg-[#FAFAFC]">
          <span>© 2026 E-Cell PSG Tech</span>
          <div className="flex items-center gap-6 mt-3 sm:mt-0">
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="hover:text-[#0A0A0A] transition-colors cursor-pointer flex items-center gap-1"
            >
              <span>↑</span> Back to Projects
            </button>
            <Link
              to="/collaboration"
              className="hover:text-[#0A0A0A] transition-colors"
            >
              Collaborate →
            </Link>
          </div>
        </footer>
      </section>
    </main>
  );
}

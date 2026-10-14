import * as React from "react";
import { Link } from "react-router-dom";
import { WorksWheel } from "@/components/ui/works-wheel";
import { getWorksWheelItems, getProjects } from "@/data/projects";
import PrismProjectShowcase from "./PrismProjectShowcase";

export default function ProjectPreview() {
  const items = React.useMemo(() => getWorksWheelItems(), []);
  const projects = React.useMemo(() => getProjects(), []);

  // Desktop drag & throttle refs
  const dragStartRef = React.useRef<{ x: number; y: number } | null>(null);
  const lastScrollTriggerRef = React.useRef<number>(0);

  const handleEndReached = React.useCallback(() => {
    const now = Date.now();
    // 1.2s throttle to avoid repeated smooth-scroll invocations
    if (now - lastScrollTriggerRef.current > 1200) {
      lastScrollTriggerRef.current = now;
      document.getElementById("team")?.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    dragStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleClickCapture = (e: React.MouseEvent<HTMLDivElement>) => {
    if (dragStartRef.current) {
      const dx = Math.abs(e.clientX - dragStartRef.current.x);
      const dy = Math.abs(e.clientY - dragStartRef.current.y);
      if (dx > 6 || dy > 6) {
        return;
      }
    }

    const target = e.target as HTMLElement;
    const anchor = target.closest("a");
    if (anchor) {
      // Keep user in single-page flow; do not navigate away
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <section
      id="projects"
      className="relative w-full min-h-0 lg:min-h-screen lg:h-screen bg-transparent text-[#0A0A0A] overflow-hidden flex flex-col justify-between scroll-mt-0"
      aria-label="Projects Showcase"
    >
      {/* =========================================================================
          DESKTOP / LAPTOP VIEW (lg+): Enhanced 6-card circular wheel
          ========================================================================= */}
      <div className="hidden lg:flex flex-col justify-between w-full h-full relative overflow-hidden flex-1">
        {/* Top Section Header: Clean branding and primary catalog action */}
        <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-8 lg:px-12 py-6 sm:py-7 pointer-events-none">
          <div className="flex flex-col gap-1 pointer-events-auto">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-[#2547FF]">
              Innovation Showcase
            </span>
            <h2 className="text-xl lg:text-2xl font-bold tracking-tight text-[#0A0A0A]">
              Featured Projects
            </h2>
          </div>

          {/* Primary Action Button: Elegantly positioned with generous spacing from the hamburger menu */}
          <div className="pointer-events-auto mr-16 sm:mr-20">
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 text-xs font-sans font-semibold uppercase tracking-wider text-white bg-[#2547FF] hover:bg-[#1b3ae5] px-5 py-2.5 rounded-full transition-all shadow-xs hover:shadow-md active:scale-95 group"
            >
              <span>View All Projects</span>
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>

        {/* WorksWheel Interactive Canvas */}
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

        {/* Bottom Bar: Intuitive explore hint and centered scroll prompt matching Image 3 */}
        <div className="absolute bottom-8 sm:bottom-9 left-8 lg:left-12 right-8 lg:right-12 z-20 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2547FF] animate-pulse" />
            <span className="text-xs font-mono font-medium tracking-widest text-[#0A0A0A]/50 uppercase">
              Scroll or Drag to explore
            </span>
          </div>

          {/* Centered Scroll Prompt to Next Section - Styled identically to Image 3 */}
          <div className="absolute left-1/2 -translate-x-1/2 pointer-events-auto">
            <button
              type="button"
              onClick={() =>
                document.getElementById("team")?.scrollIntoView({ behavior: "smooth" })
              }
              className="inline-flex items-center justify-center gap-2 text-xs sm:text-sm font-sans font-medium tracking-wider text-[#262626]/80 hover:text-[#2547FF] uppercase transition-all cursor-pointer group py-3 px-7 rounded-full border border-black/10 bg-white/90 hover:bg-white shadow-xs hover:shadow-md hover:border-[#2547FF]/30 active:scale-95 text-center backdrop-blur-xs"
            >
              <span>Meet The Team</span>
              <span className="text-[#2547FF] transition-transform group-hover:translate-y-0.5">↓</span>
            </button>
          </div>

          {/* Reserved spacer on right so FAB floats in dedicated clean space */}
          <div aria-hidden="true" className="w-14" />
        </div>
      </div>

      {/* =========================================================================
          MOBILE & TABLET VIEW (< lg): Prism Peek-Card Showcase from Guide
          ========================================================================= */}
      <div className="lg:hidden w-full flex flex-col justify-center relative z-20 overflow-hidden py-10 sm:py-16">
        <PrismProjectShowcase />
      </div>
    </section>
  );
}

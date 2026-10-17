import * as React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowDown } from "lucide-react";
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
      className="relative w-full min-h-[100dvh] lg:h-screen lg:min-h-screen bg-transparent text-[#0A0A0A] overflow-hidden flex flex-col justify-between scroll-mt-0"
      aria-label="Projects Showcase"
    >
      {/* =========================================================================
          DESKTOP / LAPTOP VIEW (lg+): Enhanced 6-card circular wheel
          ========================================================================= */}
      <div className="hidden lg:flex flex-col justify-between w-full h-full relative overflow-hidden flex-1">
        {/* Top Section Header: Clean branding */}
        <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-8 lg:px-12 py-6 sm:py-7 pointer-events-none">
          <div className="flex flex-col gap-1 pointer-events-auto">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-[#2547FF]">
              Innovation Showcase
            </span>
            <h2 className="text-xl lg:text-2xl font-bold tracking-tight text-[#0A0A0A]">
              Featured Projects
            </h2>
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

        {/* Bottom Bar: Explore hint on left, Centered action pair, and spacer on right */}
        <div className="absolute bottom-6 sm:bottom-8 left-8 lg:left-12 right-8 lg:right-12 z-20 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2547FF] animate-pulse" />
            <span className="text-xs font-mono font-medium tracking-widest text-[#0A0A0A]/50 uppercase">
              Scroll or Drag to explore
            </span>
          </div>

          {/* Centered Actions: Identical height, balanced padding & styling */}
          <div className="absolute left-1/2 -translate-x-1/2 pointer-events-auto flex items-center gap-3.5">
            <Link
              to="/projects"
              className="h-11 sm:h-12 px-6 sm:px-7 rounded-full inline-flex items-center justify-center gap-2.5 text-xs sm:text-sm font-sans font-semibold uppercase tracking-[0.06em] text-white bg-[#2547FF] hover:bg-[#1B3AE5] border border-[#2547FF] shadow-xs hover:shadow-lg hover:shadow-[#2547FF]/25 active:scale-95 transition-all group cursor-pointer"
            >
              <span>View All Projects</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <button
              type="button"
              onClick={() =>
                document.getElementById("team")?.scrollIntoView({ behavior: "smooth" })
              }
              className="h-11 sm:h-12 px-6 sm:px-7 rounded-full inline-flex items-center justify-center gap-2.5 text-xs sm:text-sm font-sans font-semibold uppercase tracking-[0.06em] text-[#0A0A0A] hover:text-[#2547FF] bg-white/95 hover:bg-white border border-black/10 hover:border-[#2547FF]/40 shadow-xs hover:shadow-md active:scale-95 transition-all group cursor-pointer backdrop-blur-md"
            >
              <span>Meet The Team</span>
              <ArrowDown className="w-4 h-4 text-[#2547FF] transition-transform group-hover:translate-y-0.5" />
            </button>
          </div>

          {/* Reserved spacer on right so FAB floats in dedicated clean space */}
          <div aria-hidden="true" className="w-14" />
        </div>
      </div>

      {/* =========================================================================
          MOBILE & TABLET VIEW (< lg): Prism Peek-Card Showcase from Guide
          ========================================================================= */}
      <div className="lg:hidden w-full h-full min-h-[100dvh] flex flex-col justify-center relative z-20 overflow-hidden">
        <PrismProjectShowcase />
      </div>
    </section>
  );
}

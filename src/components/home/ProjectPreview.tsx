import * as React from "react";
import { useNavigate, Link } from "react-router-dom";
import { WorksWheel } from "@/components/ui/works-wheel";
import { getWorksWheelItems } from "@/data/projects";

export default function ProjectPreview() {
  const navigate = useNavigate();
  const items = React.useMemo(() => getWorksWheelItems(), []);
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
      className="relative w-full h-screen bg-[#FAFAFC] text-[#0A0A0A] overflow-hidden flex flex-col justify-between"
      aria-label="Projects Showcase"
    >
      {/* Top Section Header */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 sm:px-10 pr-20 sm:pr-24 py-6 pointer-events-none">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-[#2547FF] animate-pulse" />
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#0A0A0A]/60">
            Selected Work
          </span>
        </div>
        <div className="font-mono text-xs uppercase tracking-widest text-[#262626]/60 py-1">
          Innovation Showcase
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

      {/* Bottom Hint & Smooth Scroll to Team button */}
      <div className="absolute bottom-6 left-6 sm:left-10 right-6 sm:right-10 z-20 flex items-center justify-between pointer-events-none">
        <span className="text-[11px] font-mono tracking-widest text-[#0A0A0A]/40 uppercase">
          Scroll / Drag to explore
        </span>
        <button
          type="button"
          onClick={() =>
            document.getElementById("team")?.scrollIntoView({ behavior: "smooth" })
          }
          className="pointer-events-auto text-[11px] font-mono tracking-widest text-[#0A0A0A]/60 hover:text-[#2547FF] uppercase flex items-center gap-1.5 transition-colors cursor-pointer group"
        >
          <span>Meet The Team</span>
          <span className="transition-transform group-hover:translate-y-0.5">↓</span>
        </button>
      </div>
    </section>
  );
}

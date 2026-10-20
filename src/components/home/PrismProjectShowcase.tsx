import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight, ArrowDown } from "lucide-react";
import { getProjects } from "@/data/projects";
import { Project } from "@/types/project";

interface PrismProjectShowcaseProps {
  limit?: number;
}

export default function PrismProjectShowcase({ limit = 6 }: PrismProjectShowcaseProps) {
  const navigate = useNavigate();
  const allProjects = React.useMemo(() => getProjects(), []);
  
  // Curate flagship projects for showcase
  const projects = React.useMemo(() => {
    const featured = allProjects.filter((p) => p.featured);
    const others = allProjects.filter((p) => !p.featured);
    return [...featured, ...others].slice(0, limit);
  }, [allProjects, limit]);

  const [currentIndex, setCurrentIndex] = React.useState(0);
  const touchStartXRef = React.useRef<number | null>(null);

  const handlePrev = React.useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : projects.length - 1));
  }, [projects.length]);

  const handleNext = React.useCallback(() => {
    setCurrentIndex((prev) => (prev < projects.length - 1 ? prev + 1 : 0));
  }, [projects.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
    touchStartXRef.current = null;
    if (deltaX > 45) {
      handlePrev();
    } else if (deltaX < -45) {
      handleNext();
    }
  };

  const activeProject = projects[currentIndex] || projects[0];

  return (
    <div className="w-full min-h-[100dvh] flex flex-col justify-center items-center py-3 sm:py-6 px-4 sm:px-8 max-w-lg mx-auto select-none gap-3 sm:gap-5">
      {/* 1. Section Heading: "Our Projects" */}
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-light tracking-[-0.02em] text-[#0A0A0A]">
          Our <span className="text-[#2547FF] font-normal">Projects</span>
        </h2>
      </div>

      {/* 2. 3D Peek-Card Carousel Container */}
      <div
        className="relative w-full h-[200px] sm:h-[260px] md:h-[290px] flex items-center justify-center overflow-hidden touch-pan-y"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {projects.map((project, idx) => {
          // Calculate circular relative distance from current index
          const count = projects.length;
          let diff = (idx - currentIndex) % count;
          if (diff < -Math.floor(count / 2)) diff += count;
          if (diff > Math.floor(count / 2)) diff -= count;

          // Only render active, left neighbor, and right neighbor
          const isCenter = diff === 0;
          const isLeft = diff === -1;
          const isRight = diff === 1;
          const isVisible = isCenter || isLeft || isRight;

          if (!isVisible) return null;

          // Position, scale & opacity based on peek layout
          let xOffset = "0%";
          let scale = 1;
          let opacity = 1;
          let zIndex = 20;

          if (isLeft) {
            xOffset = "-58%";
            scale = 0.72;
            opacity = 0.45;
            zIndex = 10;
          } else if (isRight) {
            xOffset = "58%";
            scale = 0.72;
            opacity = 0.45;
            zIndex = 10;
          }

          return (
            <motion.div
              key={project.slug}
              className="absolute w-[72%] sm:w-[60%] md:w-[54%] aspect-[1.5] max-w-[360px] rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer shadow-lg bg-[#0A0A0A] [isolation:isolate] [transform:translateZ(0)]"
              style={{
                WebkitMaskImage: "-webkit-radial-gradient(white, black)",
              }}
              animate={{
                x: xOffset,
                scale,
                opacity,
                zIndex,
              }}
              transition={{
                duration: 0.4,
                ease: [0.25, 1, 0.5, 1],
              }}
              onClick={() => {
                if (isCenter) {
                  navigate(`/projects/${project.slug}`);
                } else if (isLeft) {
                  handlePrev();
                } else if (isRight) {
                  handleNext();
                }
              }}
            >
              {/* Project Image */}
              <img
                src={project.coverImage}
                alt={project.title}
                className="w-full h-full object-cover select-none pointer-events-none rounded-[inherit]"
                loading="eager"
                draggable={false}
              />

              {/* Center Card "CLICK TO VIEW" Bottom Overlay */}
              {isCenter && (
                <div className="absolute inset-x-0 bottom-0 pt-10 pb-3 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex items-center justify-center pointer-events-none rounded-b-[inherit]">
                  <span className="text-[10px] sm:text-xs font-semibold tracking-wider text-white uppercase drop-shadow-sm">
                    Click to view
                  </span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* 3. Dynamic Captions: Title & 2-Line Description */}
      <div className="text-center px-4 min-h-[52px] sm:min-h-[60px] flex flex-col items-center justify-center max-w-sm">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeProject.slug}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            <h3 className="font-semibold text-base sm:text-lg text-[#0A0A0A] tracking-tight">
              {activeProject.title}
            </h3>
            <p className="text-xs sm:text-sm text-[#0A0A0A]/65 mt-1 line-clamp-2 leading-relaxed">
              {activeProject.description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 4. Navigation Controls: < [Counter] > */}
      <div className="flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={handlePrev}
          className="w-8 h-8 rounded-full bg-black/[0.06] hover:bg-black/[0.1] active:scale-90 flex items-center justify-center text-[#0A0A0A] transition-all cursor-pointer"
          aria-label="Previous project"
        >
          <ChevronLeft className="w-4 h-4 text-[#0A0A0A]" />
        </button>

        <span className="font-mono text-xs text-[#0A0A0A]/70 font-medium tracking-wider min-w-[50px] text-center">
          {String(currentIndex + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
        </span>

        <button
          type="button"
          onClick={handleNext}
          className="w-8 h-8 rounded-full bg-black/[0.06] hover:bg-black/[0.1] active:scale-90 flex items-center justify-center text-[#0A0A0A] transition-all cursor-pointer"
          aria-label="Next project"
        >
          <ChevronRight className="w-4 h-4 text-[#0A0A0A]" />
        </button>
      </div>

      {/* 5. Bottom Action Buttons: Sleek pair matching Team Section across all views */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-3.5 px-4 max-w-sm sm:max-w-none mx-auto">
        <Link
          to="/projects"
          className="w-auto h-11 sm:h-12 px-6 sm:px-7 rounded-full inline-flex items-center justify-center gap-2.5 text-xs sm:text-sm font-sans font-semibold uppercase tracking-[0.06em] text-white bg-[#2547FF] hover:bg-[#1B3AE5] border border-[#2547FF] shadow-xs hover:shadow-lg hover:shadow-[#2547FF]/25 active:scale-95 transition-all group cursor-pointer text-center"
        >
          <span>View All Projects</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>

        <button
          type="button"
          onClick={() => {
            document.getElementById("team")?.scrollIntoView({ behavior: "smooth" });
          }}
          className="w-auto h-11 sm:h-12 px-6 sm:px-7 rounded-full inline-flex items-center justify-center gap-2.5 text-xs sm:text-sm font-sans font-semibold uppercase tracking-[0.06em] text-[#0A0A0A] hover:text-[#2547FF] bg-white/95 hover:bg-white border border-black/10 hover:border-[#2547FF]/40 shadow-xs hover:shadow-md active:scale-95 transition-all group cursor-pointer backdrop-blur-md text-center"
        >
          <span>Meet The Team</span>
          <ArrowDown className="w-4 h-4 text-[#2547FF] transition-transform group-hover:translate-y-0.5" />
        </button>
      </div>
    </div>
  );
}

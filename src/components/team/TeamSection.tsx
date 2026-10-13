import React, { useRef, useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";

export interface TeamMember {
  name: string;
  role: string;
  image: string;
}

export const defaultTeamMembers: TeamMember[] = [
  {
    image:
      "https://cdn.21st.dev/assets/mirror/f4/f43137dada970ee6a29a0497d1f699d54b92e5381350eaa66dc827e3ffb11645.jpg",
    name: "Patrick Stewart",
    role: "President • E-Cell",
  },
  {
    image:
      "https://cdn.21st.dev/assets/mirror/d5/d549c11c16ad2335895c39339d1a4307b648b24a6baae68662246cf9bd37ac13.jpg",
    name: "Alena Rosser",
    role: "Vice President",
  },
  {
    image:
      "https://cdn.21st.dev/assets/mirror/e0/e058437411e954b747056a494f26349751828f12c2137a883e5aebbd1fcf5eef.jpg",
    name: "Fletch Skinner",
    role: "Head of Tech & Innovation",
  },
  {
    image:
      "https://cdn.21st.dev/assets/mirror/45/45ba21cbafae178989cd3652799f42123a80e0ac44065ac00cbb265ea948bc41.jpg",
    name: "Marc Spector",
    role: "Head of Operations",
  },
  {
    image:
      "https://cdn.21st.dev/assets/mirror/90/904d97602d25b1b5ef0f4058abad6d8185d8cebd0750771404a934a44dd537fb.jpg",
    name: "Natalia Skinner",
    role: "Head of Incubation",
  },
  {
    image:
      "https://cdn.21st.dev/assets/mirror/3b/3b6a929c98b85177bcc2eb4606a71b7487011128756dbf0adda24e803ca70ed7.jpg",
    name: "David Kim",
    role: "Lead Architect",
  },
];

interface TeamSectionProps {
  id?: string;
  catchphrase?: string;
  subtitle?: string;
  members?: TeamMember[];
  className?: string;
  showMeetTeamButton?: boolean;
}

export function TeamSection({
  id = "team",
  catchphrase = "The minds building the future at PSG Tech E-Cell",
  subtitle = "CORE TEAM '26",
  members = defaultTeamMembers,
  className = "",
  showMeetTeamButton = true,
}: TeamSectionProps) {
  const location = useLocation();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const isDownRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const scrollPosRef = useRef(0); // Subpixel accumulator for continuous smooth motion
  const velocityRef = useRef(0);
  const lastXRef = useRef(0);
  const lastTimeRef = useRef(0);
  const isHoveredRef = useRef(false);
  const isPausedRef = useRef(false);
  const autoScrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const momentumRafRef = useRef<number | null>(null);

  // Mobile-specific selection by member name (bulletproof against infinite wrap)
  const [selectedMemberName, setSelectedMemberName] = useState<string | null>(null);
  const selectedCardTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isHoldingRef = useRef(false);
  const wasAlreadySelectedRef = useRef(false);
  const touchStartPosRef = useRef<{ x: number; y: number } | null>(null);
  const touchMovedRef = useRef(false);

  const [isDragging, setIsDragging] = useState(false);

  // Triple items for seamless infinite continuous scroll
  const tripledMembers = React.useMemo(
    () => [...members, ...members, ...members],
    [members]
  );

  const clearSelection = useCallback(() => {
    if (selectedCardTimerRef.current) {
      clearTimeout(selectedCardTimerRef.current);
      selectedCardTimerRef.current = null;
    }
    isHoldingRef.current = false;
    setSelectedMemberName(null);
  }, []);

  const scheduleAutoScrollResume = useCallback((delay = 1800) => {
    isPausedRef.current = true;
    if (autoScrollTimerRef.current) clearTimeout(autoScrollTimerRef.current);
    autoScrollTimerRef.current = setTimeout(() => {
      isPausedRef.current = false;
      if (containerRef.current) {
        scrollPosRef.current = containerRef.current.scrollLeft;
      }
    }, delay);
  }, []);

  // 5-second auto-deselect timer: exactly 5.0 seconds with immediate resumption
  const startDeselectTimer = useCallback(() => {
    if (selectedCardTimerRef.current) {
      clearTimeout(selectedCardTimerRef.current);
    }
    selectedCardTimerRef.current = setTimeout(() => {
      setSelectedMemberName(null);
      selectedCardTimerRef.current = null;
      isPausedRef.current = false; // Starts moving immediately at the 5-second mark!
      if (containerRef.current) {
        scrollPosRef.current = containerRef.current.scrollLeft;
      }
    }, 5000);
  }, []);

  // Interaction 6: Route Change: Route navigation immediately clears selection and timers
  useEffect(() => {
    clearSelection();
    isPausedRef.current = false;
  }, [location.pathname, clearSelection]);

  // Interaction 4: Tap Outside: Tapping outside the cards immediately deselects and resumes movement
  useEffect(() => {
    if (!selectedMemberName) return;

    const handleOutsideTouch = (e: TouchEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      // If tap is inside a team card, let card handler process it
      if (target.closest(".team-member-card")) {
        return;
      }
      // Tap is outside any card -> deselect immediately and resume moving!
      clearSelection();
      isPausedRef.current = false;
      if (containerRef.current) {
        scrollPosRef.current = containerRef.current.scrollLeft;
      }
    };

    window.addEventListener("touchstart", handleOutsideTouch, { passive: true });
    return () => {
      window.removeEventListener("touchstart", handleOutsideTouch);
    };
  }, [selectedMemberName, clearSelection]);

  // Initial scroll positioning to center the middle set
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const setInitialScroll = () => {
      const oneThird = container.scrollWidth / 3;
      if (oneThird > 0 && container.scrollLeft === 0) {
        container.scrollLeft = oneThird;
        scrollLeftRef.current = oneThird;
        scrollPosRef.current = oneThird;
      } else if (container.scrollLeft > 0) {
        scrollPosRef.current = container.scrollLeft;
      }
    };

    const raf = requestAnimationFrame(setInitialScroll);
    const timer = setTimeout(setInitialScroll, 120);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, [tripledMembers]);

  // Infinite wrapping handler
  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    scrollPosRef.current = container.scrollLeft;

    const oneThird = container.scrollWidth / 3;
    if (oneThird <= 0) return;

    if (container.scrollLeft >= oneThird * 2) {
      container.scrollLeft -= oneThird;
      scrollLeftRef.current -= oneThird;
      scrollPosRef.current -= oneThird;
    } else if (container.scrollLeft <= 5) {
      container.scrollLeft += oneThird;
      scrollLeftRef.current += oneThird;
      scrollPosRef.current += oneThird;
    }
  }, []);

  // Ambient auto-drift loop:
  // - Laptop: 0.55px per frame (untouched)
  // - Mobile: 0.35px per frame (gentle & readable)
  // - Completely frozen when a card is selected on mobile
  useEffect(() => {
    let rafId: number;

    const drift = () => {
      const container = containerRef.current;
      if (
        container &&
        !isDownRef.current &&
        !isHoveredRef.current &&
        !isPausedRef.current &&
        selectedMemberName === null // Frozen when a card is selected on mobile
      ) {
        const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
        const speed = isMobile ? 0.28 : 0.55; // Reduced by 20% on mobile for gentle pace; laptop untouched

        scrollPosRef.current += speed;
        container.scrollLeft = scrollPosRef.current;
      }
      rafId = requestAnimationFrame(drift);
    };

    rafId = requestAnimationFrame(drift);

    return () => {
      cancelAnimationFrame(rafId);
      if (momentumRafRef.current) cancelAnimationFrame(momentumRafRef.current);
      if (autoScrollTimerRef.current) clearTimeout(autoScrollTimerRef.current);
      if (selectedCardTimerRef.current) clearTimeout(selectedCardTimerRef.current);
    };
  }, [selectedMemberName]);

  // Window mouse drag listeners (Laptop & Desktop view only)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDownRef.current) return;
      const container = containerRef.current;
      if (!container) return;

      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walk = x - startXRef.current;

      container.scrollLeft = scrollLeftRef.current - walk;
      scrollPosRef.current = container.scrollLeft;

      const now = performance.now();
      const dt = now - lastTimeRef.current;
      if (dt > 0) {
        velocityRef.current = (e.pageX - lastXRef.current) / dt;
      }
      lastXRef.current = e.pageX;
      lastTimeRef.current = now;
    };

    const handleMouseUp = () => {
      if (!isDownRef.current) return;
      isDownRef.current = false;
      setIsDragging(false);

      const container = containerRef.current;
      if (!container) return;

      let vel = velocityRef.current * 14;
      const friction = 0.94;

      const momentumStep = () => {
        if (Math.abs(vel) < 0.2 || isDownRef.current || isHoveredRef.current) {
          scheduleAutoScrollResume(2000);
          return;
        }
        if (container) {
          container.scrollLeft -= vel;
          scrollPosRef.current = container.scrollLeft;
        }
        vel *= friction;
        momentumRafRef.current = requestAnimationFrame(momentumStep);
      };

      if (Math.abs(vel) > 0.4) {
        momentumRafRef.current = requestAnimationFrame(momentumStep);
      } else {
        scheduleAutoScrollResume(2000);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [scheduleAutoScrollResume]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    const container = containerRef.current;
    if (!container) return;

    if (momentumRafRef.current) {
      cancelAnimationFrame(momentumRafRef.current);
      momentumRafRef.current = null;
    }
    if (autoScrollTimerRef.current) {
      clearTimeout(autoScrollTimerRef.current);
    }

    isDownRef.current = true;
    startXRef.current = e.pageX - container.offsetLeft;
    scrollLeftRef.current = container.scrollLeft;
    scrollPosRef.current = container.scrollLeft;
    lastXRef.current = e.pageX;
    lastTimeRef.current = performance.now();
    velocityRef.current = 0;
    setIsDragging(true);
  };

  const handleContainerTouchStart = () => {
    isPausedRef.current = true;
    if (momentumRafRef.current) {
      cancelAnimationFrame(momentumRafRef.current);
      momentumRafRef.current = null;
    }
  };

  const handleContainerTouchEnd = () => {
    // Only schedule resume if no card is actively selected or held
    if (!selectedMemberName && !isHoldingRef.current) {
      scheduleAutoScrollResume(1800);
    }
  };

  // Interaction 1: Touch & Hold: While holding finger on a card, it stays selected and frozen
  const handleCardTouchStart = (memberName: string, e: React.TouchEvent) => {
    if (typeof window !== "undefined" && window.innerWidth >= 768) return; // Keep laptop untouched
    const touch = e.touches[0];
    touchStartPosRef.current = { x: touch.clientX, y: touch.clientY };
    touchMovedRef.current = false;
    isHoldingRef.current = true;

    // Pause drift immediately
    isPausedRef.current = true;
    if (selectedCardTimerRef.current) {
      clearTimeout(selectedCardTimerRef.current);
      selectedCardTimerRef.current = null;
    }

    wasAlreadySelectedRef.current = selectedMemberName === memberName;
    setSelectedMemberName(memberName);
  };

  // Interaction 5: Swipe Detection: Swiping horizontally cancels selection immediately
  const handleCardTouchMove = (e: React.TouchEvent) => {
    if (typeof window !== "undefined" && window.innerWidth >= 768) return;
    if (!touchStartPosRef.current) return;
    const touch = e.touches[0];
    const dx = Math.abs(touch.clientX - touchStartPosRef.current.x);
    const dy = Math.abs(touch.clientY - touchStartPosRef.current.y);

    // If movement exceeds 10px, this is a swipe/scroll gesture, NOT a card tap or hold
    if (dx > 10 || dy > 10) {
      touchMovedRef.current = true;
      isHoldingRef.current = false;
      // Immediately cancel card selection so scrolling is uninterrupted
      clearSelection();
    }
  };

  // Interaction 2: Hold Release (5s timer) & Interaction 3: Tap Toggle (toggle off on re-tap)
  const handleCardTouchEnd = (memberName: string) => {
    if (typeof window !== "undefined" && window.innerWidth >= 768) return;
    isHoldingRef.current = false;

    // If user was swiping to scroll, do not select card
    if (touchMovedRef.current) {
      clearSelection();
      scheduleAutoScrollResume(1500);
      return;
    }

    // Interaction 3: Tap Toggle: If the card was ALREADY selected before this tap, deselect immediately!
    if (wasAlreadySelectedRef.current) {
      clearSelection();
      isPausedRef.current = false;
      if (containerRef.current) {
        scrollPosRef.current = containerRef.current.scrollLeft;
      }
    } else {
      // Interaction 2: Hold Release: Fresh tap or hold released -> start the 5-second countdown timer!
      setSelectedMemberName(memberName);
      startDeselectTimer();
    }
  };

  const scrollByNudge = (direction: "left" | "right") => {
    const container = containerRef.current;
    if (!container) return;
    scheduleAutoScrollResume(2000);
    const distance = direction === "left" ? -280 : 280;
    container.scrollBy({ left: distance, behavior: "smooth" });
  };

  return (
    <section
      id={id}
      className={`relative w-full min-h-[100dvh] flex flex-col justify-center overflow-hidden bg-transparent py-8 sm:py-12 text-[#0A0A0A] snap-start scroll-mt-0 ${className}`}
      aria-labelledby="team-heading"
    >
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 w-full">
        {/* Realigned Balanced Catchphrase Header */}
        <div className="mx-auto mb-6 sm:mb-8 text-center max-w-3xl">
          <p className="font-mono text-[11px] sm:text-xs font-medium tracking-[0.2em] text-[#2547FF] uppercase mb-2">
            {subtitle}
          </p>
          <h2
            id="team-heading"
            className="font-display font-bold text-3xl sm:text-4xl md:text-[42px] lg:text-[44px] text-[#0A0A0A] tracking-[-0.025em] leading-[1.3] sm:leading-[1.35] text-balance mx-auto"
          >
            {catchphrase === "The minds building the future at PSG Tech E-Cell" ? (
              <>
                The minds building the future <br className="hidden sm:inline" />
                at PSG Tech <span className="text-[#2547FF]">E-Cell</span>.
              </>
            ) : (
              <>
                {catchphrase}
                <span className="text-[#2547FF]">.</span>
              </>
            )}
          </h2>
          <p className="font-sans text-xs sm:text-sm text-[#262626]/60 mt-2 sm:mt-2.5 max-w-md mx-auto hidden sm:block">
            Drag or swipe horizontally to discover the team
          </p>
        </div>

        {/* Interactive Draggable & Swipeable Carousel with Edge Fading Masks */}
        <div
          className="group/carousel relative w-full"
          onMouseEnter={() => {
            // Guard: only activate hover pause on desktop/laptop
            if (typeof window !== "undefined" && window.innerWidth >= 768) {
              isHoveredRef.current = true;
            }
          }}
          onMouseLeave={() => {
            if (typeof window !== "undefined" && window.innerWidth >= 768) {
              isHoveredRef.current = false;
            }
          }}
        >
          {/* Left Gradient Fade Mask: subtle on mobile, elegant on laptop */}
          <div className="pointer-events-none absolute top-0 left-0 z-20 h-full w-8 sm:w-28 md:w-36 bg-gradient-to-r from-[#FAFAFC] via-[#FAFAFC]/80 to-transparent" />
          {/* Right Gradient Fade Mask */}
          <div className="pointer-events-none absolute top-0 right-0 z-20 h-full w-8 sm:w-28 md:w-36 bg-gradient-to-l from-[#FAFAFC] via-[#FAFAFC]/80 to-transparent" />

          {/* Desktop Left Nudge Arrow (Laptop untouched) */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              scrollByNudge("left");
            }}
            className="hidden md:flex absolute left-3 lg:left-5 top-1/2 -translate-y-1/2 z-30 w-10 h-10 lg:w-11 lg:h-11 items-center justify-center rounded-full bg-white/90 hover:bg-white text-[#0A0A0A] shadow-md border border-black/5 opacity-0 group-hover/carousel:opacity-100 transition-all hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-xs"
            aria-label="Scroll team left"
          >
            <svg
              className="w-5 h-5 text-[#0A0A0A]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {/* Desktop Right Nudge Arrow (Laptop untouched) */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              scrollByNudge("right");
            }}
            className="hidden md:flex absolute right-3 lg:right-5 top-1/2 -translate-y-1/2 z-30 w-10 h-10 lg:w-11 lg:h-11 items-center justify-center rounded-full bg-white/90 hover:bg-white text-[#0A0A0A] shadow-md border border-black/5 opacity-0 group-hover/carousel:opacity-100 transition-all hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-xs"
            aria-label="Scroll team right"
          >
            <svg
              className="w-5 h-5 text-[#0A0A0A]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          {/* Draggable Track Container: Native mobile touch-pan-y, mouse grab on desktop */}
          <div
            ref={containerRef}
            onScroll={handleScroll}
            onMouseDown={handleMouseDown}
            onTouchStart={handleContainerTouchStart}
            onTouchEnd={handleContainerTouchEnd}
            className={`w-full overflow-x-auto overflow-y-hidden py-3 select-none touch-pan-y flex items-center scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${isDragging ? "cursor-grabbing" : "cursor-grab"
              }`}
          >
            <div className="flex shrink-0 items-center">
              {tripledMembers.map((member, index) => {
                const isSelectedOnMobile = selectedMemberName === member.name;

                return (
                  <div
                    key={`${member.name}-${index}`}
                    onTouchStart={(e) => handleCardTouchStart(member.name, e)}
                    onTouchMove={handleCardTouchMove}
                    onTouchEnd={() => handleCardTouchEnd(member.name)}
                    className={`team-member-card group/card relative flex w-52 sm:w-60 shrink-0 flex-col select-none transition-all duration-300 mx-2.5 sm:mx-3.5 cursor-pointer ${isSelectedOnMobile
                        ? "-translate-y-2.5 shadow-xl scale-[1.02]"
                        : "md:hover:-translate-y-2"
                      }`}
                  >
                    <div
                      className={`relative h-72 sm:h-80 md:h-84 w-full overflow-hidden rounded-2xl bg-neutral-200/60 shadow-sm border transition-all duration-300 ${isSelectedOnMobile
                          ? "border-[#2547FF]/60 shadow-xl ring-2 ring-[#2547FF]/25"
                          : "border-black/[0.06] md:group-hover/card:shadow-xl"
                        }`}
                    >
                      {/* Portrait Image: Grayscale to Color Transition */}
                      <img
                        src={member.image}
                        alt={member.name}
                        loading="lazy"
                        draggable={false}
                        className={`h-full w-full object-cover transition-all duration-500 ease-out md:group-hover/card:grayscale-0 md:group-hover/card:scale-105 select-none pointer-events-none ${isSelectedOnMobile ? "grayscale-0 scale-105" : "grayscale"
                          }`}
                      />

                      {/* Frosted Identity Badge at Bottom */}
                      <div
                        className={`absolute bottom-2.5 left-2.5 right-2.5 rounded-xl backdrop-blur-md p-2.5 border border-black/5 shadow-sm transition-all duration-300 select-none md:group-hover/card:bg-white/95 ${isSelectedOnMobile ? "bg-white/95 shadow-md border-[#2547FF]/30" : "bg-white/85"
                          }`}
                      >
                        <h3
                          className={`font-sans font-medium text-[15px] sm:text-base tracking-tight transition-colors ${isSelectedOnMobile ? "text-[#2547FF]" : "text-[#0A0A0A]"
                            }`}
                        >
                          {member.name}
                        </h3>
                        <p className="font-mono text-xs font-normal text-[#262626]/75 mt-0.5 tracking-tight truncate">
                          {member.role}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Action Buttons: "Meet the Team" and "Partner With E-Cell" */}
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4">
          {showMeetTeamButton && (
            <Link
              to="/teams"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-xs sm:text-sm font-sans font-semibold tracking-wider text-white uppercase transition-all cursor-pointer group py-3 px-7 rounded-full bg-[#2547FF] hover:bg-[#1B3AE5] shadow-sm hover:shadow-md hover:shadow-[#2547FF]/25 active:scale-95 text-center"
            >
              <span>Meet the Team</span>
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          )}

          <button
            type="button"
            onClick={() => {
              document.getElementById("collaboration")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-xs sm:text-sm font-sans font-medium tracking-wider text-[#262626]/80 hover:text-[#2547FF] uppercase transition-all cursor-pointer group py-3 px-7 rounded-full border border-black/10 bg-white/90 hover:bg-white shadow-xs hover:shadow-md hover:border-[#2547FF]/30 active:scale-95 text-center"
          >
            <span>Partner With E-Cell</span>
            <span className="text-[#2547FF] transition-transform group-hover:translate-y-0.5">↓</span>
          </button>
        </div>
      </div>
    </section>
  );
}

export default TeamSection;

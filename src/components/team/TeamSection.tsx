import React, { useRef, useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { useLandingTeamMembers } from "@/hooks/useLandingTeamMembers";

export interface TeamMember {
  name: string;
  role: string;
  image?: string;
}

export const defaultTeamMembers: TeamMember[] = [
  {
    image: "https://res.cloudinary.com/snc8rhlo/image/upload/v1789280975/IMG-20260820-WA0019.jpg",
    name: "Sanjay J",
    role: "Director",
  },
  {
    image: "https://res.cloudinary.com/drxmhgudx/image/upload/v1789281961/23n243_Sai_Karthi_-_23N243_-_SAI_KARTHI_BALAJI_G_hsmiyb.jpg",
    name: "Sai Karthi Balaji G",
    role: "Deputy Director",
  },
  {
    image: "https://res.cloudinary.com/drxmhgudx/image/upload/v1789281958/24Z209_Arrvindh_PK_-_24Z209_-_ARRVINDH_PERIYAR_KHAVIYAA_gozubk.jpg",
    name: "Arrvindh P K",
    role: "Program Manager",
  },
  {
    image: "https://res.cloudinary.com/drxmhgudx/image/upload/v1789281953/Pravin_Ramanaa_24Z255_-_24Z255_-_PRAVIN_RAMANAA_S_mmodta.png",
    name: "Pravin Ramanaa S",
    role: "Associate Program Manager",
  },
  {
    image: "https://res.cloudinary.com/drxmhgudx/image/upload/v1789281961/23N237_pravith_-_23N237_-_PRAVITH_N_fzwqqo.jpg",
    name: "Pravith N",
    role: "Head (Technical)",
  },
  {
    image: "https://res.cloudinary.com/drxmhgudx/image/upload/v1789281956/24Z218_Dharaneeshsl_-_24Z218_-_DHARANEESH_S_L_aqixwd.jpg",
    name: "Dharaneesh S L",
    role: "Associate Head (Technical)",
  },
  {
    image: "https://res.cloudinary.com/drxmhgudx/image/upload/v1789281960/24N211_HarikesavaVB_-_24N211_-_HARIKESAVA_V_B_tmxubi.jpg",
    name: "Hari Keshav",
    role: "Associate Head (Technical)",
  },
  {
    image: "https://res.cloudinary.com/drxmhgudx/image/upload/v1789281982/22N248_Santhosh_-_22N248_-_SANTHOSH_M_xksxy4.jpg",
    name: "Santhosh M",
    role: "Head (Industry and Community Outreach)",
  },
  {
    image: "https://res.cloudinary.com/drxmhgudx/image/upload/v1789281954/24z261_Rithan_pranaov_R_-_24Z261_-_RITHAN_PRANAOV_R_fuum2b.jpg",
    name: "Rithan Pranaov R",
    role: "Associate Head (Industry and Community Outreach)",
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
  members: propMembers,
  className = "",
  showMeetTeamButton = true,
}: TeamSectionProps) {
  const { members: dynamicMembers } = useLandingTeamMembers();
  const members = propMembers || dynamicMembers;
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
  // - Mobile: 0.336px per frame (increased by 20%)
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
        const speed = isMobile ? 0.4 : 0.55; // Increased by 20% on mobile (0.28 -> 0.336); laptop untouched

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
      className={`relative w-full min-h-[100dvh] flex flex-col justify-center overflow-hidden bg-transparent py-8 sm:py-12 text-[#0A0A0A] scroll-mt-0 ${className}`}
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
            className={`w-full overflow-x-auto overflow-y-hidden pt-7 pb-6 sm:py-5 select-none touch-pan-y flex items-center scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${isDragging ? "cursor-grabbing" : "cursor-grab"
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
                      ? "-translate-y-2 shadow-xl scale-[1.02]"
                      : "md:hover:-translate-y-2"
                      }`}
                  >
                    <div
                      className={`relative h-72 sm:h-80 md:h-84 w-full overflow-hidden rounded-2xl bg-neutral-200/60 shadow-sm border transition-all duration-300 ${isSelectedOnMobile
                        ? "border-[#2547FF]/60 shadow-xl ring-2 ring-[#2547FF]/25"
                        : "border-black/[0.06] md:group-hover/card:shadow-xl"
                        }`}
                    >
                      {/* Portrait Image or Elegant Placeholder */}
                      {member.image ? (
                        <img
                          src={member.image}
                          alt={member.name}
                          loading="lazy"
                          draggable={false}
                          className={`h-full w-full object-cover transition-all duration-500 ease-out md:group-hover/card:grayscale-0 md:group-hover/card:scale-105 select-none pointer-events-none ${isSelectedOnMobile ? "grayscale-0 scale-105" : "grayscale"
                            }`}
                        />
                      ) : (
                        <div className="h-full w-full flex flex-col items-center justify-center pb-14 bg-gradient-to-b from-[#F0F2FF] via-[#F8F9FE] to-[#E9EDFD] relative select-none">
                          {/* Geometric subtle animated accent rings */}
                          <div
                            aria-hidden="true"
                            className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40 overflow-hidden"
                          >
                            <div className="w-56 h-56 rounded-full border border-[#2547FF]/15 animate-[spin_80s_linear_infinite]" />
                            <div className="w-40 h-40 rounded-full border border-dashed border-[#2547FF]/20 absolute" />
                          </div>

                          {/* Member Initials Badge */}
                          <div className="relative z-10 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white shadow-md shadow-[#2547FF]/10 border border-[#2547FF]/25 flex items-center justify-center text-[#2547FF] transition-all duration-300 md:group-hover/card:scale-105 md:group-hover/card:border-[#2547FF]/50 md:group-hover/card:shadow-lg">
                            <span className="font-mono font-bold text-xl sm:text-2xl tracking-tight">
                              {member.name
                                .split(" ")
                                .map((p) => p[0])
                                .filter(Boolean)
                                .slice(0, 2)
                                .join("")}
                            </span>
                          </div>

                          {/* Placeholder hint */}
                          <span className="relative z-10 mt-3 text-[10px] sm:text-[11px] font-mono tracking-widest text-[#262626]/40 uppercase">
                            Photo Placeholder
                          </span>
                        </div>
                      )}

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

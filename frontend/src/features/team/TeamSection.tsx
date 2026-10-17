import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Marquee } from "@/components/ui/marquee";

export interface TeamMember {
  name: string;
  role: string;
  image: string;
}

// eslint-disable-next-line react-refresh/only-export-components
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
}

function TeamMemberCard({ member }: { member: TeamMember }) {
  const [isActive, setIsActive] = useState(false);

  return (
    <div
      data-active={isActive ? "true" : undefined}
      onPointerDown={(e) => {
        if (e.pointerType === "touch") {
          setIsActive(true);
        }
      }}
      onPointerUp={(e) => {
        if (e.pointerType === "touch") {
          setIsActive(false);
        }
      }}
      onPointerCancel={(e) => {
        if (e.pointerType === "touch") {
          setIsActive(false);
        }
      }}
      onPointerLeave={(e) => {
        if (e.pointerType === "touch") {
          setIsActive(false);
        }
      }}
      style={{ WebkitTapHighlightColor: "transparent" }}
      className={cn(
        "group/card relative flex shrink-0 flex-col cursor-pointer select-none",
        "w-[clamp(160px,58vw,240px)] sm:w-56 lg:w-60",
        "mx-[6px] sm:mx-3 md:mx-4",
        "transition-transform duration-300 will-change-transform",
        "[@media(hover:hover)_and_(pointer:fine)]:hover:-translate-y-2",
        "data-[active=true]:-translate-y-2",
        isActive && "-translate-y-2",
        "[-webkit-tap-highlight-color:transparent]"
      )}
    >
      <div
        className={cn(
          "relative w-full overflow-hidden rounded-2xl bg-neutral-200/60 border border-black/[0.06]",
          "aspect-[5/7] sm:aspect-auto sm:h-80 md:h-84 lg:h-84",
          "shadow-sm transition-shadow duration-300",
          "[@media(hover:hover)_and_(pointer:fine)]:group-hover/card:shadow-xl",
          "group-data-[active=true]/card:shadow-xl",
          isActive && "shadow-xl"
        )}
      >
        {/* Portrait Image: Isolated Grayscale to Color Transition */}
        <img
          src={member.image}
          alt={member.name}
          width={320}
          height={448}
          loading="lazy"
          className={cn(
            "h-full w-full object-cover transition-all duration-500 ease-out",
            "will-change-transform will-change-[filter]",
            "[@media(hover:hover)_and_(pointer:fine)]:group-hover/card:grayscale-0",
            "[@media(hover:hover)_and_(pointer:fine)]:group-hover/card:scale-105",
            "group-data-[active=true]/card:grayscale-0",
            "group-data-[active=true]/card:scale-105",
            isActive && "grayscale-0 scale-105"
          )}
        />

        {/* Frosted Identity Badge at Bottom */}
        <div
          className={cn(
            "absolute bottom-2 left-2 right-2 sm:bottom-2.5 sm:left-2.5 sm:right-2.5",
            "rounded-xl bg-white/85 backdrop-blur-md p-2 sm:p-2.5 border border-black/5 shadow-sm",
            "transition-all duration-300",
            "[@media(hover:hover)_and_(pointer:fine)]:group-hover/card:bg-white/95",
            "group-data-[active=true]/card:bg-white/95",
            isActive && "bg-white/95"
          )}
        >
          <h3 className="font-display font-semibold text-[13px] sm:text-[14px] md:text-[15px] text-[#0A0A0A] tracking-tight truncate">
            {member.name}
          </h3>
          <p className="font-mono text-[10px] sm:text-[11px] text-[#262626]/75 mt-0.5 tracking-tight truncate">
            {member.role}
          </p>
        </div>
      </div>
    </div>
  );
}

export function TeamSection({
  id,
  catchphrase = "The minds building the future at PSG Tech E-Cell",
  subtitle = "CORE TEAM '26",
  members = defaultTeamMembers,
  className = "",
}: TeamSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [headingInView, setHeadingInView] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };
    mql.addEventListener("change", handleChange);
    return () => {
      mql.removeEventListener("change", handleChange);
    };
  }, []);

  useEffect(() => {
    const target = document.getElementById("team-heading") || sectionRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHeadingInView(true);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(target);
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={sectionRef}
      id={id}
      className={cn(
        "relative w-full h-auto min-h-0 flex flex-col justify-center bg-transparent py-0 md:py-2 text-[#0A0A0A]",
        className
      )}
    >
      <style>{`
        #team {
          padding-top: clamp(4rem, 8vw, 7rem) !important;
          padding-bottom: clamp(4rem, 8vw, 7rem) !important;
          scroll-margin-top: 5.5rem;
        }
        #team-heading {
          font-size: clamp(2rem, 6vw, 3.25rem) !important;
          scroll-margin-top: 5.5rem;
        }
      `}</style>
      <div className="relative z-10 mx-auto w-full max-w-7xl px-0 sm:px-6">
        {/* Realigned Balanced Catchphrase Header */}
        <div className="mx-auto mb-4 sm:mb-6 md:mb-8 text-center w-full max-w-3xl px-4 sm:px-0">
          {subtitle && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EDEFFC] text-[#2547FF] border border-[#2547FF]/20 text-xs font-mono font-semibold uppercase tracking-wider mb-2 sm:mb-3">
              <span className="size-1.5 rounded-full bg-[#2547FF] animate-pulse" />
              <span>{subtitle}</span>
            </div>
          )}
          <p className="mx-auto max-w-[36ch] text-center [text-wrap:balance] font-display font-medium text-base sm:text-lg md:text-xl text-[#0A0A0A]/85 tracking-[-0.01em] leading-snug">
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
          </p>
        </div>

        {/* Infinite Scrolling Marquee Cards - Positioned Lower with Edge Fading Masks */}
        <div className="relative w-full overflow-hidden h-auto">
          {/* Left Gradient Fade Mask */}
          <div className="pointer-events-none absolute top-0 left-0 z-20 h-full w-8 sm:w-28 md:w-44 bg-gradient-to-r from-[#FAFAFC] via-[#FAFAFC]/90 to-transparent" />
          {/* Right Gradient Fade Mask */}
          <div className="pointer-events-none absolute top-0 right-0 z-20 h-full w-8 sm:w-28 md:w-44 bg-gradient-to-l from-[#FAFAFC] via-[#FAFAFC]/90 to-transparent" />

          <Marquee
            duration={35}
            pauseOnHover
            speed={!headingInView || reducedMotion ? 0 : undefined}
          >
            {members.map((member, index) => (
              <TeamMemberCard
                key={`${member.name}-${index}`}
                member={member}
              />
            ))}
          </Marquee>
        </div>

        {/* Bottom smooth scroll link to Collaboration */}
        <div className="mt-4 sm:mt-6 md:mt-8 flex justify-center px-4 sm:px-0">
          {/*<button
            type="button"
            onClick={() =>
              document.getElementById("collaboration")?.scrollIntoView({ behavior: "smooth" })
            }
            className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-[#262626]/75 hover:text-[#2547FF] uppercase transition-all cursor-pointer group py-2 px-5 rounded-full border border-black/10 bg-white/90 hover:bg-white shadow-xs hover:shadow-md hover:border-[#2547FF]/30 hover:scale-102"
          >
            <span>Partner With E-Cell</span>
            <span className="text-[#2547FF] transition-transform group-hover:translate-y-0.5">↓</span>
          </button>*/}
        </div>
      </div>
    </div>
  );
}

export default TeamSection;

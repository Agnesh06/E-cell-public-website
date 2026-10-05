import React from "react";
import { Marquee } from "@/components/ui/marquee";

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
}

export function TeamSection({
  id = "team",
  catchphrase = "The minds building the future at PSG Tech E-Cell",
  subtitle = "CORE TEAM '26",
  members = defaultTeamMembers,
  className = "",
}: TeamSectionProps) {
  return (
    <section
      id={id}
      className={`relative w-full h-screen min-h-screen flex flex-col justify-center overflow-hidden bg-transparent py-4 sm:py-6 text-[#0A0A0A] snap-start scroll-mt-0 ${className}`}
      aria-labelledby="team-heading"
    >

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        {/* Realigned Balanced Catchphrase Header */}
        <div className="mx-auto mb-6 sm:mb-8 text-center max-w-3xl">
          {subtitle && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EDEFFC] text-[#2547FF] border border-[#2547FF]/20 text-xs font-mono font-semibold uppercase tracking-wider mb-3">
              <span className="size-1.5 rounded-full bg-[#2547FF] animate-pulse" />
              <span>{subtitle}</span>
            </div>
          )}
          <h2
            id="team-heading"
            className="font-display font-bold text-3xl sm:text-4xl md:text-[42px] lg:text-[46px] text-[#0A0A0A] tracking-[-0.03em] leading-[1.18] text-balance mx-auto"
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
        </div>

        {/* Infinite Scrolling Marquee Cards - Positioned Lower with Edge Fading Masks */}
        <div className="relative w-full">
          {/* Left Gradient Fade Mask */}
          <div className="pointer-events-none absolute top-0 left-0 z-20 h-full w-20 sm:w-36 md:w-44 bg-gradient-to-r from-[#FAFAFC] via-[#FAFAFC]/90 to-transparent" />
          {/* Right Gradient Fade Mask */}
          <div className="pointer-events-none absolute top-0 right-0 z-20 h-full w-20 sm:w-36 md:w-44 bg-gradient-to-l from-[#FAFAFC] via-[#FAFAFC]/90 to-transparent" />

          <Marquee duration={35} pauseOnHover>
            {members.map((member, index) => (
              <div
                key={`${member.name}-${index}`}
                className="group/card relative flex w-56 sm:w-60 shrink-0 flex-col cursor-pointer transition-transform duration-300 hover:-translate-y-2 mx-3 sm:mx-4"
              >
                <div className="relative h-72 sm:h-80 md:h-84 w-full overflow-hidden rounded-2xl bg-neutral-200/60 shadow-sm border border-black/[0.06] transition-shadow duration-300 group-hover/card:shadow-xl">
                  {/* Portrait Image: Isolated Grayscale to Color Transition */}
                  <img
                    src={member.image}
                    alt={member.name}
                    loading="lazy"
                    className="h-full w-full object-cover grayscale transition-all duration-500 ease-out group-hover/card:grayscale-0 group-hover/card:scale-105"
                  />

                  {/* Frosted Identity Badge at Bottom */}
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 rounded-xl bg-white/85 backdrop-blur-md p-2.5 border border-black/5 shadow-sm transition-all duration-300 group-hover/card:bg-white/95">
                    <h3 className="font-display font-semibold text-[14px] sm:text-[15px] text-[#0A0A0A] tracking-tight">
                      {member.name}
                    </h3>
                    <p className="font-mono text-[11px] text-[#262626]/75 mt-0.5 tracking-tight truncate">
                      {member.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </Marquee>
        </div>

        {/* Bottom smooth scroll link to Collaboration */}
        <div className="mt-6 sm:mt-8 flex justify-center">
          <button
            type="button"
            onClick={() =>
              document.getElementById("collaboration")?.scrollIntoView({ behavior: "smooth" })
            }
            className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-[#262626]/75 hover:text-[#2547FF] uppercase transition-all cursor-pointer group py-2 px-5 rounded-full border border-black/10 bg-white/90 hover:bg-white shadow-xs hover:shadow-md hover:border-[#2547FF]/30 hover:scale-102"
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

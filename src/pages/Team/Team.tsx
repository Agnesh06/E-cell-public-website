import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Topography from "@/components/ui/Topography";
import TeamDirectory from "@/components/team/TeamDirectory";

export default function Team() {
  const navigate = useNavigate();

  return (
    <main className="relative min-h-screen bg-[#FAFAFC] text-[#0A0A0A] flex flex-col justify-between selection:bg-[#2547FF] selection:text-white">
      {/* Pinned Stationary Background */}
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

      {/* Floating Back to Home Button - Redirects directly to the team section on the landing page */}
      <div className="fixed top-4 left-4 sm:top-5 sm:left-6 lg:left-12 z-40 pointer-events-auto">
        <Link
          to="/#team"
          onClick={(e) => {
            e.preventDefault();
            navigate("/#team");
            setTimeout(() => {
              document.getElementById("team")?.scrollIntoView({ behavior: "smooth" });
            }, 100);
          }}
          className="inline-flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-mono font-semibold uppercase tracking-[0.14em] sm:tracking-[0.16em] text-[#0A0A0A]/80 hover:text-[#2547FF] transition-all bg-white/95 hover:bg-white border border-black/10 px-3 py-2 sm:px-4 sm:py-2.5 rounded-full shadow-xs hover:shadow-md hover:border-[#2547FF]/30 active:scale-95 group backdrop-blur-md cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:-translate-x-1 text-[#2547FF]" />
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 pt-24 pb-16 sm:pt-28 sm:pb-20 flex flex-col items-center">
        {/* Main Heading */}
<<<<<<< HEAD
        <h1 className="font-display font-bold text-3xl sm:text-5xl md:text-6xl text-[#0A0A0A] tracking-tight leading-[1.15] text-center">
=======
        <h1 className="font-display font-bold text-2xl sm:text-5xl md:text-6xl text-[#0A0A0A] tracking-tight leading-[1.15] text-center">
>>>>>>> 1b801bd94473a8e512166fe75ce7bef6184a8b01
          Meet the <span className="text-[#2547FF]">Team</span>.
        </h1>

        <p className="font-sans text-sm sm:text-base md:text-lg text-[#262626]/70 max-w-2xl mt-3 mb-8 sm:mb-12 leading-relaxed text-center">
          The minds, innovators, and creators powering entrepreneurship, incubation, and student startups at PSG College of Technology.
        </p>

        {/* Team Directory Component */}
        <TeamDirectory />
      </div>

      {/* Minimal Footer */}
      <footer className="relative z-10 w-full px-6 sm:px-12 py-6 flex flex-col sm:flex-row items-center justify-between border-t border-black/[0.05] text-xs font-mono text-[#0A0A0A]/50 bg-white/40">
        <span>© 2026 E-Cell PSG Tech</span>
        <Link to="/" className="hover:text-[#2547FF] transition-colors mt-2 sm:mt-0 font-medium">
          Return to Overview →
        </Link>
      </footer>
    </main>
  );
}

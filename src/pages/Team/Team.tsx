import React from "react";
import { Link } from "react-router-dom";
import { Users, ArrowLeft, Sparkles } from "lucide-react";

export default function Team() {
  return (
    <main className="min-h-screen bg-[#FAFAFC] text-[#0A0A0A] flex flex-col justify-between">
      {/* Top Header Bar */}
      <header className="w-full flex items-center justify-between px-6 sm:px-10 py-6 border-b border-black/[0.04] bg-white/50 backdrop-blur-md sticky top-0 z-30">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-mono font-medium uppercase tracking-[0.16em] text-[#0A0A0A]/70 hover:text-[#2547FF] transition-colors py-2 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Home</span>
        </Link>
        <span className="text-xs font-mono font-normal tracking-[0.2em] uppercase text-[#0A0A0A]/40 hidden sm:inline-block pr-16 sm:pr-20">
          PSG TECH • E-CELL
        </span>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 max-w-5xl mx-auto px-6 py-12 sm:py-20 flex flex-col justify-center items-center text-center">
        {/* Subtle Pill Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2547FF]/10 text-[#2547FF] text-xs font-mono uppercase tracking-widest mb-6 border border-[#2547FF]/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Core Committee & Leadership</span>
        </div>

        {/* Main Heading */}
        <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl text-[#0A0A0A] tracking-tight leading-[1.15]">
          Meet the <span className="text-[#2547FF]">Team</span>.
        </h1>

        <p className="font-sans text-base sm:text-lg text-[#262626]/70 max-w-2xl mt-4 leading-relaxed">
          The minds, innovators, and creators powering entrepreneurship, incubation, and student startups at PSG College of Technology.
        </p>

        {/* Clean Modern Placeholder Canvas */}
        <div className="mt-10 sm:mt-12 w-full max-w-2xl rounded-3xl border border-dashed border-black/15 bg-white/60 backdrop-blur-xs p-8 sm:p-12 flex flex-col items-center justify-center text-center shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-[#2547FF]/10 flex items-center justify-center text-[#2547FF] mb-4 shadow-inner">
            <Users className="w-7 h-7" />
          </div>
          <h2 className="font-sans font-semibold text-lg sm:text-xl text-[#0A0A0A] tracking-tight">
            Team Directory & Profiles Coming Soon
          </h2>
          <p className="font-sans text-xs sm:text-sm text-[#262626]/60 max-w-md mt-2 leading-relaxed">
            We are curating the full executive council, domain leaders, and coordinator directory for the 2026 tenure. Stay tuned!
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs font-sans font-medium uppercase tracking-wider text-[#0A0A0A] bg-white border border-black/10 hover:border-black/25 py-2.5 px-5 rounded-full transition-all shadow-2xs hover:shadow-xs active:scale-95"
            >
              <span>Back to Home</span>
            </Link>
            <Link
              to="/collaboration"
              className="inline-flex items-center gap-2 text-xs font-sans font-medium uppercase tracking-wider text-white bg-[#2547FF] hover:bg-[#1B3AE5] py-2.5 px-5 rounded-full transition-all shadow-xs hover:shadow-md hover:shadow-[#2547FF]/20 active:scale-95"
            >
              <span>Partner With Us</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Footer Hint */}
      <footer className="w-full px-6 sm:px-10 py-8 flex flex-col sm:flex-row items-center justify-between border-t border-black/[0.06] text-xs font-mono font-normal text-[#0A0A0A]/50 bg-white/40">
        <span>© 2026 E-Cell PSG Tech</span>
        <div className="flex items-center gap-6 mt-3 sm:mt-0 font-sans text-sm font-medium">
          <Link to="/projects" className="hover:text-[#0A0A0A] transition-colors">
            Projects →
          </Link>
          <Link to="/collaboration" className="hover:text-[#0A0A0A] transition-colors">
            Collaborate →
          </Link>
        </div>
      </footer>
    </main>
  );
}

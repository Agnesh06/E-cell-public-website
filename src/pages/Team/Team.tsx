import { Link } from "react-router-dom";
import TeamSection from "@/components/team/TeamSection";

export default function Team() {
  return (
    <main className="min-h-screen bg-[#FAFAFC] text-[#0A0A0A] flex flex-col justify-between">
      {/* Top Header Bar */}
      <header className="w-full flex items-center justify-between px-6 sm:px-10 py-6">
        <Link
          to="/"
          className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.16em] text-[#0A0A0A]/70 hover:text-[#0A0A0A] transition-colors py-2"
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Home
        </Link>
        <span className="text-[11px] font-mono tracking-[0.2em] uppercase text-[#0A0A0A]/40 hidden sm:inline-block pr-16 sm:pr-20">
          PSG TECH • E-CELL
        </span>
      </header>

      {/* Main Team Showcase */}
      <div className="flex-1 flex flex-col justify-center">
        <TeamSection
          catchphrase="The minds building the future at PSG Tech E-Cell"
          subtitle="EXECUTIVE & CORE TEAM"
        />
      </div>

      {/* Bottom Footer Hint */}
      <footer className="w-full px-6 sm:px-10 py-8 flex flex-col sm:flex-row items-center justify-between border-t border-black/[0.06] text-xs font-mono text-[#0A0A0A]/50">
        <span>© 2026 E-Cell PSG Tech</span>
        <div className="flex items-center gap-6 mt-3 sm:mt-0">
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

import React from "react";
import { Link } from "react-router-dom";
import { Linkedin, Github, Instagram, Twitter, ArrowUp } from "lucide-react";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full bg-[#FAFAFC] border-t border-black/[0.06] text-[#0A0A0A] py-12 px-6 sm:px-10 lg:px-16">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Brand / Copyright */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <div className="flex items-center gap-2 font-display font-bold text-lg tracking-tight">
            <span>E-CELL</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#2547FF]" />
            <span className="font-mono text-xs font-normal text-[#0A0A0A]/60 uppercase tracking-widest">
              PSG TECH
            </span>
          </div>
          <p className="mt-1 font-mono text-xs text-[#0A0A0A]/50">
            © 2026 Entrepreneurship Cell • All rights reserved.
          </p>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 font-mono text-xs tracking-wider uppercase text-[#0A0A0A]/70">
          <Link to="/" className="hover:text-[#2547FF] transition-colors">
            Home
          </Link>
          <Link to="/projects" className="hover:text-[#2547FF] transition-colors">
            Projects
          </Link>
          <Link to="/team" className="hover:text-[#2547FF] transition-colors">
            Team
          </Link>
          <Link to="/collaboration" className="hover:text-[#2547FF] transition-colors">
            Collaboration
          </Link>
        </nav>

        {/* Social Icons & Back to Top */}
        <div className="flex items-center gap-5">
          <a
            href="https://linkedin.com/company/ecell-psgtech"
            target="_blank"
            rel="noopener noreferrer"
            className="text-black/60 hover:text-[#2547FF] hover:scale-110 transition-all"
            aria-label="LinkedIn"
          >
            <Linkedin size={18} />
          </a>
          <a
            href="https://github.com/Agnesh06"
            target="_blank"
            rel="noopener noreferrer"
            className="text-black/60 hover:text-[#2547FF] hover:scale-110 transition-all"
            aria-label="GitHub"
          >
            <Github size={18} />
          </a>
          <a
            href="https://instagram.com/ecell_psgtech"
            target="_blank"
            rel="noopener noreferrer"
            className="text-black/60 hover:text-[#2547FF] hover:scale-110 transition-all"
            aria-label="Instagram"
          >
            <Instagram size={18} />
          </a>
          <a
            href="https://twitter.com/ecell_psgtech"
            target="_blank"
            rel="noopener noreferrer"
            className="text-black/60 hover:text-[#2547FF] hover:scale-110 transition-all"
            aria-label="Twitter"
          >
            <Twitter size={18} />
          </a>
          <button
            type="button"
            onClick={scrollToTop}
            aria-label="Scroll to top"
            className="ml-2 w-9 h-9 rounded-full border border-black/10 flex items-center justify-center text-black/60 hover:text-black hover:border-black/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <ArrowUp size={15} />
          </button>
        </div>
      </div>
    </footer>
  );
}

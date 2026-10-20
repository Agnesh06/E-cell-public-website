import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowUp,
  ArrowUpRight,
  Linkedin,
  Instagram,
  Github,
  Mail,
} from "lucide-react";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavClick = (id: string) => {
    if (id === "about" || id === "about-us") {
      const aboutEl =
        document.getElementById("about") || document.getElementById("about-us");
      const homeEl = document.getElementById("home");
      if (aboutEl) {
        aboutEl.scrollIntoView({ behavior: "smooth" });
      } else if (homeEl) {
        const travel = (window.innerHeight || 800) * 2.2;
        window.scrollTo({
          top: homeEl.offsetTop + travel * 0.88,
          behavior: "smooth",
        });
      }
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer
      id="site-footer"
      className="relative z-20 bg-[#FAFAFC] text-[#0A0A0A] pt-12 pb-10 sm:pt-16 sm:pb-12 px-5 sm:px-8 lg:px-12 border-t border-black/[0.07] overflow-hidden select-text font-sans"
      style={{ fontFamily: "var(--font-sans)" }}
    >
      <div className="w-full max-w-7xl mx-auto">
        {/* Adaptive Layout:
            - Mobile (<640px): Brand on top, followed by 2-column Navigation & Campus Hub
            - Tablet (640px - 1023px): Brand full width top, Navigation & Campus Hub side-by-side below
            - Desktop (1024px+): 3 columns in a balanced 6-3-3 grid
        */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-16">
          {/* Column 1: Brand, Catchphrase & Standalone Social Icons */}
          <div className="sm:col-span-2 lg:col-span-6 flex flex-col items-start text-left">
            <Link
              to="/"
              onClick={() => handleNavClick("home")}
              className="inline-flex items-center gap-3 group"
              aria-label="PSG Tech E-Cell Home"
            >
              <img
                src="/images/ecell-logo.png"
                alt="PSG Tech E-Cell Logo"
                className="h-11 sm:h-12 w-auto object-contain rounded-xl border border-black/[0.08] bg-white p-1 shadow-2xs"
              />
              <div className="flex flex-col">
                <span className="font-display text-xl sm:text-2xl tracking-tight text-[#0A0A0A] flex items-center gap-1 leading-tight">
                  E-CELL<span className="text-[#2547FF]">.</span>
                </span>
                <span className="font-mono text-[9.5px] sm:text-[10px] tracking-[0.22em] text-[#262626]/55 uppercase">
                  PSG College of Technology
                </span>
              </div>
            </Link>

            {/* Catchphrase */}
            <p className="mt-5 text-[15.5px] sm:text-[17px] lg:text-[18px] font-medium text-[#0A0A0A] tracking-tight leading-snug sm:leading-relaxed max-w-lg">
              “Where curiosity meets capital and code meets commerce.”
            </p>

            {/* Brief description */}
            <p className="mt-2 text-[13px] sm:text-[13.5px] lg:text-[14px] text-[#262626]/65 max-w-md leading-relaxed">
              The Entrepreneurship Cell of PSG College of Technology fosters
              student innovation, nurtures high-impact startup ventures, and
              connects creative minds with real-world industry leaders.
            </p>

            {/* Standalone Logo Icons Alone (No duplicate text links) */}
            <div className="mt-5 sm:mt-6 flex items-center gap-2.5 sm:gap-3">
              <a
                href="https://www.linkedin.com/company/cse-association-psg-tech/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg border border-black/10 bg-white text-[#0A0A0A] hover:text-[#2547FF] hover:border-[#2547FF]/30 hover:bg-[#2547FF]/[0.03] active:scale-95 transition-all"
                aria-label="LinkedIn"
                title="LinkedIn"
              >
                <Linkedin size={16} />
              </a>
              <a
                href="https://instagram.com/cseapsgtech?psln=MTVjcW5lanBlcGducQ%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg border border-black/10 bg-white text-[#0A0A0A] hover:text-[#2547FF] hover:border-[#2547FF]/30 hover:bg-[#2547FF]/[0.03] active:scale-95 transition-all"
                aria-label="Instagram"
                title="Instagram"
              >
                <Instagram size={16} />
              </a>
              <a
                href="https://github.com/CSEA-PSGTech"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg border border-black/10 bg-white text-[#0A0A0A] hover:text-[#2547FF] hover:border-[#2547FF]/30 hover:bg-[#2547FF]/[0.03] active:scale-95 transition-all"
                aria-label="GitHub"
                title="GitHub"
              >
                <Github size={16} />
              </a>
              <a
                href="mailto:ecell@psgtech.ac.in"
                className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg border border-black/10 bg-white text-[#0A0A0A] hover:text-[#2547FF] hover:border-[#2547FF]/30 hover:bg-[#2547FF]/[0.03] active:scale-95 transition-all"
                aria-label="Official Email"
                title="Official Email"
              >
                <Mail size={16} />
              </a>
            </div>
          </div>

          {/* Column 2: Navigation Links (2 columns on mobile, single clean column on tablet & desktop) */}
          <div className="sm:col-span-1 lg:col-span-3 flex flex-col items-start text-left">
            <span className="font-mono text-[10.5px] sm:text-[11px] font-semibold text-[#0A0A0A]/80 tracking-[0.14em] uppercase">
              Navigation
            </span>
            <ul className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1 sm:flex sm:flex-col sm:space-y-1.5 text-[13.5px] sm:text-[14px] w-full">
              <li>
                <a
                  href="#home"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick("home");
                  }}
                  className="text-[#262626]/70 hover:text-[#2547FF] transition-colors inline-block"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick("about");
                  }}
                  className="text-[#262626]/70 hover:text-[#2547FF] transition-colors inline-block"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#projects"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick("projects");
                  }}
                  className="text-[#262626]/70 hover:text-[#2547FF] transition-colors inline-block"
                >
                  Projects
                </a>
              </li>
              <li>
                <a
                  href="#team"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick("team");
                  }}
                  className="text-[#262626]/70 hover:text-[#2547FF] transition-colors inline-block"
                >
                  Team
                </a>
              </li>
              <li>
                <a
                  href="#collaboration"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick("collaboration");
                  }}
                  className="text-[#262626]/70 hover:text-[#2547FF] transition-colors inline-block"
                >
                  Collaborate
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick("contact");
                  }}
                  className="text-[#262626]/70 hover:text-[#2547FF] transition-colors inline-block"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Campus Hub & Contact */}
          <div className="sm:col-span-1 lg:col-span-3 flex flex-col items-start text-left">
            <span className="font-mono text-[10.5px] sm:text-[11px] font-semibold text-[#0A0A0A]/80 tracking-[0.14em] uppercase">
              Campus Hub
            </span>
            <div className="mt-4 space-y-3 text-[13.5px] sm:text-[14px] text-[#262626]/70 w-full">
              <p className="leading-relaxed">
                PSG College of Technology
                <br />
                Peelamedu, Coimbatore – 641004
              </p>
              <div className="space-y-1">
                <a
                  href="mailto:ecell@psgtech.ac.in"
                  className="hover:text-[#2547FF] transition-colors block break-words"
                >
                  ecell@psgtech.ac.in
                </a>
                <a
                  href="tel:+914222572177"
                  className="hover:text-[#2547FF] transition-colors block"
                >
                  +91 422 257 2177
                </a>
              </div>
              <div className="pt-1">
                <a
                  href="https://csea.psgtech.ac.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[13px] text-[#262626]/60 hover:text-[#2547FF] transition-colors"
                >
                  <span>CSEA Tech Portal</span>
                  <ArrowUpRight size={13} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Minimal Divider */}
        <div className="w-full h-px mt-10 sm:mt-12 mb-6 sm:mb-8 bg-black/[0.07]" />

        {/* Responsive Minimal Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[12px] sm:text-[13px] text-[#262626]/55 text-center sm:text-left">
          <p className="order-2 sm:order-1 leading-normal">
            © 2026 PSG Tech Entrepreneurship Cell. All rights reserved.
          </p>

          <div className="order-1 sm:order-2 flex flex-wrap items-center justify-center sm:justify-end gap-x-5 gap-y-2">
            <span className="hover:text-[#0A0A0A] transition-colors cursor-pointer py-1">
              Privacy Policy
            </span>
            <span className="hover:text-[#0A0A0A] transition-colors cursor-pointer py-1">
              Code of Conduct
            </span>
            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 hover:text-[#0A0A0A] transition-colors uppercase tracking-[0.08em] text-[11px] sm:text-[12px] font-medium py-1 cursor-pointer"
              aria-label="Back to top"
            >
              <span>Back to top</span>
              <ArrowUp size={13} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}




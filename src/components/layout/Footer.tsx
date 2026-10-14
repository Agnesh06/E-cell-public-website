import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUp, CheckCircle2 } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
      setEmail("");
      setTimeout(() => setIsSubscribed(false), 5000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavClick = (id: string) => {
    if (id === "about" || id === "about-us") {
      const aboutEl = document.getElementById("about") || document.getElementById("about-us");
      const homeEl = document.getElementById("home");
      if (aboutEl) {
        aboutEl.scrollIntoView({ behavior: "smooth" });
      } else if (homeEl) {
        const travel = (window.innerHeight || 800) * 2.2;
        window.scrollTo({ top: homeEl.offsetTop + travel * 0.88, behavior: "smooth" });
      }
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <style>{`
        #site-footer input:-webkit-autofill,
        #site-footer input:-webkit-autofill:hover, 
        #site-footer input:-webkit-autofill:focus,
        #site-footer input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 30px white inset !important;
          -webkit-text-fill-color: #0A0A0A !important;
          border-radius: 9999px;
        }
      `}</style>

      <footer
        id="site-footer"
        className="relative z-20 bg-[#FAFAFC] text-[#0A0A0A] py-14 px-4 sm:px-6 lg:px-8 border-t border-black/[0.08] overflow-hidden select-text font-sans"
        style={{ fontFamily: 'var(--font-sans)' }}
      >
        <div className="w-full max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-between gap-y-12 lg:gap-x-8">
            {/* Column 1: Brand & Logo */}
            <div className="w-full md:w-[45%] lg:w-[35%] flex flex-col items-center md:items-start text-center md:text-left">
              <Link
                to="/"
                onClick={() => handleNavClick("home")}
                className="flex items-center gap-3.5 group transition-transform hover:scale-[1.02]"
                aria-label="PSG Tech E-Cell Home"
              >
                <img
                  src="/images/ecell-logo.png"
                  alt="PSG Tech E-Cell Logo"
                  className="h-14 sm:h-16 w-auto object-contain rounded-xl shadow-xs border border-black/[0.08] bg-white p-1"
                />
                <div className="flex flex-col text-left">
                  <span className="font-display font-normal text-2xl tracking-tight text-[#0A0A0A] flex items-center gap-1.5">
                    E-CELL<span className="text-[#2547FF]">.</span>
                  </span>
                  <span className="font-mono text-[10px] tracking-[0.25em] text-[#262626]/60 uppercase">
                    PSG College of Tech
                  </span>
                </div>
              </Link>

              <div className="w-full max-w-52 h-px mt-6 bg-gradient-to-r from-transparent via-black/15 to-transparent md:mr-auto" />

              <p className="font-sans font-normal text-[14px] text-[#262626]/75 mt-5 max-w-sm leading-[1.6]">
                The Entrepreneurship Cell of PSG College of Technology fosters student innovation, nurtures high-impact startup ventures, and connects creative minds with real-world industry leaders.
              </p>
            </div>

            {/* Column 2: Important Links */}
            <div className="w-full md:w-[45%] lg:w-[15%] flex flex-col items-center md:items-start text-center md:text-left">
              <h3 className="font-sans font-bold text-[13px] text-[#0A0A0A] tracking-[0.06em] uppercase">
                Important Links
              </h3>
              <div className="flex flex-col gap-3 mt-4 font-sans text-[14px] font-normal leading-[1.6]">
                <a
                  href="#home"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick("home");
                  }}
                  className="text-[#262626]/75 hover:text-[#0A0A0A] sm:hover:text-[#2547FF] transition-colors"
                >
                  Home
                </a>
                <a
                  href="#about"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick("about");
                  }}
                  className="text-[#262626]/75 hover:text-[#0A0A0A] sm:hover:text-[#2547FF] transition-colors"
                >
                  About Us
                </a>
                <a
                  href="#projects"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick("projects");
                  }}
                  className="text-[#262626]/75 hover:text-[#0A0A0A] sm:hover:text-[#2547FF] transition-colors"
                >
                  Projects
                </a>
                <a
                  href="#team"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick("team");
                  }}
                  className="text-[#262626]/75 hover:text-[#0A0A0A] sm:hover:text-[#2547FF] transition-colors"
                >
                  Team
                </a>
                <a
                  href="#collaboration"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick("collaboration");
                  }}
                  className="text-[#262626]/75 hover:text-[#0A0A0A] sm:hover:text-[#2547FF] transition-colors"
                >
                  Collaborate
                </a>
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick("contact");
                  }}
                  className="text-[#262626]/75 hover:text-[#0A0A0A] sm:hover:text-[#2547FF] transition-colors"
                >
                  Contact Us
                </a>
                <a
                  href="https://csea.psgtech.ac.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#262626]/75 hover:text-[#0A0A0A] sm:hover:text-[#2547FF] transition-colors"
                >
                  CSEA Official Portal
                </a>
              </div>
            </div>

            {/* Column 3: Social Links */}
            <div className="w-full md:w-[45%] lg:w-[15%] flex flex-col items-center md:items-start text-center md:text-left">
              <h3 className="font-sans font-bold text-[13px] text-[#0A0A0A] tracking-[0.06em] uppercase">
                Connect
              </h3>
              <div className="flex flex-col gap-3 mt-4 font-sans text-[14px] font-normal leading-[1.6]">
                <a
                  href="https://www.linkedin.com/company/cse-association-psg-tech/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#262626]/75 hover:text-[#0A0A0A] sm:hover:text-[#2547FF] transition-colors"
                >
                  LinkedIn
                </a>
                <a
                  href="https://www.instagram.com/cseapsgtech"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#262626]/75 hover:text-[#0A0A0A] sm:hover:text-[#2547FF] transition-colors"
                >
                  Instagram
                </a>
                <a
                  href="https://github.com/CSEA-PSGTech"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#262626]/75 hover:text-[#0A0A0A] sm:hover:text-[#2547FF] transition-colors"
                >
                  GitHub
                </a>
                <a
                  href="mailto:csea.cse@psgtech.ac.in"
                  className="text-[#262626]/75 hover:text-[#0A0A0A] sm:hover:text-[#2547FF] transition-colors"
                >
                  Official Email
                </a>
              </div>

              {/* Social icons row */}
              <div className="mt-5 pt-1">
                <span className="font-sans font-bold text-[12px] tracking-[0.06em] uppercase text-[#0A0A0A] block mb-2.5">
                  Social
                </span>
                <div className="flex items-center gap-2">
                  <a
                    href="https://www.linkedin.com/company/cse-association-psg-tech/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-7 h-7 flex items-center justify-center rounded border border-black/30 text-[#0A0A0A] hover:border-black hover:bg-black/5 transition-all text-xs font-bold leading-none"
                    aria-label="LinkedIn"
                  >
                    in
                  </a>
                  <a
                    href="https://instagram.com/cseapsgtech?psln=MTVjcW5lanBlcGducQ%3D%3D"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-7 h-7 flex items-center justify-center rounded border border-black/30 text-[#0A0A0A] hover:border-black hover:bg-black/5 transition-all text-xs"
                    aria-label="Instagram"
                  >
                    <svg className="w-3.5 h-3.5 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2">
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                    </svg>
                  </a>
                  <a
                    href="https://github.com/CSEA-PSGTech"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-7 h-7 flex items-center justify-center rounded border border-black/30 text-[#0A0A0A] hover:border-black hover:bg-black/5 transition-all text-xs"
                    aria-label="GitHub"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                    </svg>
                  </a>
                  <a
                    href="mailto:csea.cse@psgtech.ac.in"
                    className="w-7 h-7 flex items-center justify-center rounded border border-black/30 text-[#0A0A0A] hover:border-black hover:bg-black/5 transition-all text-xs"
                    aria-label="Email"
                  >
                    <svg className="w-3.5 h-3.5 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2">
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Column 4: Newsletter Subscription */}
            <div className="w-full md:w-[45%] lg:w-[27%] flex flex-col items-center md:items-start text-center md:text-left">
              <h3 className="font-sans font-bold text-[13px] text-[#0A0A0A] tracking-[0.06em] uppercase">
                Subscribe for updates
              </h3>
              <p className="font-sans font-normal text-[14px] text-[#262626]/75 mt-3 max-w-xs leading-[1.6]">
                Stay ahead with announcements on flagship hackathons, startup grants, and incubation calls.
              </p>

              {isSubscribed ? (
                <div className="flex items-center gap-2 mt-4 px-4 py-2.5 rounded-full bg-[#2547FF]/10 border border-[#2547FF]/30 text-[#2547FF] text-xs font-sans font-medium">
                  <CheckCircle2 size={16} />
                  <span>Subscribed! Welcome to E-Cell community.</span>
                </div>
              ) : (
                <form
                  onSubmit={handleSubscribe}
                  className="flex items-center border border-black/15 bg-white shadow-xs h-12 max-w-sm w-full rounded-full overflow-hidden mt-4 focus-within:border-[#2547FF] focus-within:ring-2 focus-within:ring-[#2547FF]/15 transition-all p-1"
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address…"
                    className="w-full h-full pl-4 pr-2 outline-none text-[13px] sm:text-[14px] bg-transparent text-[#0A0A0A] placeholder-[#262626]/40 font-sans rounded-full"
                    required
                  />
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-[#2547FF] to-[#1532D6] hover:from-[#1B3AE5] hover:to-[#0D24AB] active:scale-95 transition-all px-4 sm:px-5 h-9 shrink-0 rounded-full text-[13px] font-semibold text-white cursor-pointer shadow-xs font-sans"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Separator Line */}
          <div className="w-full h-px mt-14 mb-6 bg-gradient-to-r from-transparent via-black/10 to-transparent" />

          {/* Bottom Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 font-sans text-[13px] text-[#262626]/65 leading-[1.6]">
            <p className="text-center md:text-left font-normal">
              © 2026 PSG Tech Entrepreneurship Cell • Built with passion by E-Cell Tech Team.
            </p>

            <div className="flex items-center gap-4 sm:gap-6">
              <span className="hover:text-[#2547FF] transition-colors cursor-pointer">
                Privacy Policy
              </span>
              <div className="w-px h-3 bg-black/15" />
              <span className="hover:text-[#2547FF] transition-colors cursor-pointer">
                Code of Conduct
              </span>
              <div className="w-px h-3 bg-black/15" />
              <button
                type="button"
                onClick={scrollToTop}
                className="flex items-center gap-1.5 hover:text-[#2547FF] transition-colors cursor-pointer uppercase tracking-[0.08em] text-[12px] font-medium"
                aria-label="Scroll to top"
              >
                <span>Back to Top</span>
                <ArrowUp size={13} />
              </button>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

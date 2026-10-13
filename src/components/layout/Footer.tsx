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
                  href="#projects"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick("projects");
                  }}
                  className="text-[#262626]/75 hover:text-[#0A0A0A] sm:hover:text-[#2547FF] transition-colors"
                >
                  Selected Work
                </a>
                <a
                  href="#team"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick("team");
                  }}
                  className="text-[#262626]/75 hover:text-[#0A0A0A] sm:hover:text-[#2547FF] transition-colors"
                >
                  Core Team &apos;26
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
                  href="https://psgtech.edu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#262626]/75 hover:text-[#0A0A0A] sm:hover:text-[#2547FF] transition-colors"
                >
                  PSG Tech Portal
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
                  href="https://linkedin.com/company/ecell-psgtech"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#262626]/75 hover:text-[#0A0A0A] sm:hover:text-[#2547FF] transition-colors"
                >
                  LinkedIn
                </a>
                <a
                  href="https://instagram.com/ecell_psgtech"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#262626]/75 hover:text-[#0A0A0A] sm:hover:text-[#2547FF] transition-colors"
                >
                  Instagram
                </a>
                <a
                  href="https://github.com/Agnesh06"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#262626]/75 hover:text-[#0A0A0A] sm:hover:text-[#2547FF] transition-colors"
                >
                  DevLabs / GitHub
                </a>
                <a
                  href="https://twitter.com/ecell_psgtech"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#262626]/75 hover:text-[#0A0A0A] sm:hover:text-[#2547FF] transition-colors"
                >
                  Twitter / X
                </a>
                <a
                  href="mailto:ecell@psgtech.ac.in"
                  className="text-[#262626]/75 hover:text-[#0A0A0A] sm:hover:text-[#2547FF] transition-colors"
                >
                  Official Email
                </a>
              </div>

              {/* Social icons row matching Griffin reference style */}
              <div className="mt-5 pt-1">
                <span className="font-sans font-bold text-[12px] tracking-[0.06em] uppercase text-[#0A0A0A] block mb-2.5">
                  Social
                </span>
                <div className="flex items-center gap-2">
                  <a
                    href="https://linkedin.com/company/ecell-psgtech"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-7 h-7 flex items-center justify-center rounded border border-black/30 text-[#0A0A0A] hover:border-black hover:bg-black/5 transition-all text-xs font-bold leading-none"
                    aria-label="LinkedIn"
                  >
                    in
                  </a>
                  <a
                    href="https://youtube.com/@ecell_psgtech"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-7 h-7 flex items-center justify-center rounded border border-black/30 text-[#0A0A0A] hover:border-black hover:bg-black/5 transition-all"
                    aria-label="YouTube"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  </a>
                  <a
                    href="https://twitter.com/ecell_psgtech"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-7 h-7 flex items-center justify-center rounded border border-black/30 text-[#0A0A0A] hover:border-black hover:bg-black/5 transition-all"
                    aria-label="Twitter / X"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
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

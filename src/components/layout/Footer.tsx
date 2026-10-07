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
        className="relative z-20 bg-[#FAFAFC] text-[#0A0A0A] py-14 px-4 sm:px-6 lg:px-8 border-t border-black/[0.08] overflow-hidden select-text"
        style={{ fontFamily: '"Plus Jakarta Sans", "Poppins", sans-serif' }}
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
                  <span className="font-display font-black text-xl tracking-tight text-[#0A0A0A] flex items-center gap-1.5">
                    E-CELL<span className="text-[#2547FF]">.</span>
                  </span>
                  <span className="font-mono text-[10px] tracking-[0.25em] text-[#262626]/60 uppercase">
                    PSG College of Tech
                  </span>
                </div>
              </Link>

              <div className="w-full max-w-52 h-px mt-6 bg-gradient-to-r from-transparent via-black/15 to-transparent md:mr-auto" />

              <p className="text-sm text-[#262626]/75 mt-5 max-w-sm leading-relaxed">
                The Entrepreneurship Cell of PSG College of Technology fosters student innovation, nurtures high-impact startup ventures, and connects creative minds with real-world industry leaders.
              </p>
            </div>

            {/* Column 2: Important Links */}
            <div className="w-full md:w-[45%] lg:w-[15%] flex flex-col items-center md:items-start text-center md:text-left">
              <h3 className="text-sm text-[#0A0A0A] font-semibold tracking-wider uppercase">
                Important Links
              </h3>
              <div className="flex flex-col gap-2.5 mt-5 font-mono text-xs uppercase tracking-wider">
                <a
                  href="#home"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick("home");
                  }}
                  className="text-[#262626]/70 hover:text-[#2547FF] transition-colors"
                >
                  Home
                </a>
                <a
                  href="#projects"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick("projects");
                  }}
                  className="text-[#262626]/70 hover:text-[#2547FF] transition-colors"
                >
                  Selected Work
                </a>
                <a
                  href="#team"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick("team");
                  }}
                  className="text-[#262626]/70 hover:text-[#2547FF] transition-colors"
                >
                  Core Team &apos;26
                </a>
                <a
                  href="#collaboration"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick("collaboration");
                  }}
                  className="text-[#262626]/70 hover:text-[#2547FF] transition-colors"
                >
                  Collaborate
                </a>
                <a
                  href="https://psgtech.edu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#262626]/70 hover:text-[#2547FF] transition-colors"
                >
                  PSG Tech Portal
                </a>
              </div>
            </div>

            {/* Column 3: Social Links */}
            <div className="w-full md:w-[45%] lg:w-[15%] flex flex-col items-center md:items-start text-center md:text-left">
              <h3 className="text-sm text-[#0A0A0A] font-semibold tracking-wider uppercase">
                Connect
              </h3>
              <div className="flex flex-col gap-2.5 mt-5 font-mono text-xs uppercase tracking-wider">
                <a
                  href="https://linkedin.com/company/ecell-psgtech"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#262626]/70 hover:text-[#2547FF] transition-colors"
                >
                  LinkedIn
                </a>
                <a
                  href="https://instagram.com/ecell_psgtech"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#262626]/70 hover:text-[#2547FF] transition-colors"
                >
                  Instagram
                </a>
                <a
                  href="https://github.com/Agnesh06"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#262626]/70 hover:text-[#2547FF] transition-colors"
                >
                  DevLabs / GitHub
                </a>
                <a
                  href="https://twitter.com/ecell_psgtech"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#262626]/70 hover:text-[#2547FF] transition-colors"
                >
                  Twitter / X
                </a>
                <a
                  href="mailto:ecell@psgtech.ac.in"
                  className="text-[#262626]/70 hover:text-[#2547FF] transition-colors"
                >
                  Official Email
                </a>
              </div>
            </div>

            {/* Column 4: Newsletter Subscription */}
            <div className="w-full md:w-[45%] lg:w-[27%] flex flex-col items-center md:items-start text-center md:text-left">
              <h3 className="text-sm text-[#0A0A0A] font-semibold tracking-wider uppercase">
                Subscribe for updates
              </h3>
              <p className="text-xs text-[#262626]/65 mt-2 max-w-xs leading-relaxed">
                Stay ahead with announcements on flagship hackathons, startup grants, and incubation calls.
              </p>

              {isSubscribed ? (
                <div className="flex items-center gap-2 mt-4 px-4 py-2.5 rounded-full bg-[#2547FF]/10 border border-[#2547FF]/30 text-[#2547FF] text-xs font-mono">
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
                    className="w-full h-full pl-4 pr-2 outline-none text-xs sm:text-sm bg-transparent text-[#0A0A0A] placeholder-[#262626]/40 font-mono rounded-full"
                    required
                  />
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-[#2547FF] to-[#1532D6] hover:from-[#1B3AE5] hover:to-[#0D24AB] active:scale-95 transition-all px-4 sm:px-5 h-9 shrink-0 rounded-full text-xs font-semibold text-white cursor-pointer shadow-xs"
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
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-xs text-[#262626]/60">
            <p className="text-center md:text-left">
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
                className="flex items-center gap-1.5 hover:text-[#2547FF] transition-colors cursor-pointer uppercase tracking-wider"
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

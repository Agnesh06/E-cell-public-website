import React, { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, AnimatePresence } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Linkedin, Github, Instagram, Twitter, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface iNavItem {
  heading: string;
  href: string;
  subheading?: string;
  imgSrc?: string;
}

interface iNavLinkProps extends iNavItem {
  setIsActive: (isActive: boolean) => void;
  index: number;
}

interface iCurvedNavbarProps {
  setIsActive: (isActive: boolean) => void;
  navItems: iNavItem[];
}

export interface iHeaderProps {
  navItems?: iNavItem[];
  footer?: React.ReactNode;
}

const MENU_SLIDE_ANIMATION = {
  initial: { x: "calc(100% + 100px)" },
  enter: {
    x: "0",
    transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
  },
  exit: {
    x: "calc(100% + 100px)",
    transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
  },
};

export const defaultNavItems: iNavItem[] = [
  {
    heading: "Home",
    href: "#home",
    subheading: "Welcome to E-Cell PSG Tech",
  },
  {
    heading: "Projects",
    href: "#projects",
    subheading: "Explore student innovations & startups",
  },
  {
    heading: "Team",
    href: "#team",
    subheading: "Meet the student core and mentors",
  },
  {
    heading: "Collaboration",
    href: "#collaboration",
    subheading: "Partner and connect with E-Cell",
  },
];

const CustomFooter: React.FC = () => {
  return (
    <div className="flex w-full items-center justify-between px-8 sm:px-12 md:px-16 py-6 border-t border-[#2547FF]/15 bg-white/80 backdrop-blur-xs">
      <div className="flex flex-col">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#262626]/50">
          Student Ecosystem
        </span>
        <span className="text-xs font-semibold text-[#0A0A0A] font-display">
          PSG Tech Entrepreneurship Cell
        </span>
      </div>
      <div className="flex items-center gap-2">
        <a
          href="https://linkedin.com/company/ecell-psgtech"
          target="_blank"
          rel="noopener noreferrer"
          className="size-8 rounded-lg border border-black/10 bg-white flex items-center justify-center text-[#262626]/70 hover:text-[#2547FF] hover:border-[#2547FF]/40 hover:bg-[#EDEFFC] hover:scale-105 transition-all shadow-2xs"
          aria-label="LinkedIn"
        >
          <Linkedin size={15} />
        </a>
        <a
          href="https://github.com/Agnesh06"
          target="_blank"
          rel="noopener noreferrer"
          className="size-8 rounded-lg border border-black/10 bg-white flex items-center justify-center text-[#262626]/70 hover:text-[#2547FF] hover:border-[#2547FF]/40 hover:bg-[#EDEFFC] hover:scale-105 transition-all shadow-2xs"
          aria-label="GitHub"
        >
          <Github size={15} />
        </a>
        <a
          href="https://instagram.com/ecell_psgtech"
          target="_blank"
          rel="noopener noreferrer"
          className="size-8 rounded-lg border border-black/10 bg-white flex items-center justify-center text-[#262626]/70 hover:text-[#2547FF] hover:border-[#2547FF]/40 hover:bg-[#EDEFFC] hover:scale-105 transition-all shadow-2xs"
          aria-label="Instagram"
        >
          <Instagram size={15} />
        </a>
        <a
          href="https://twitter.com/ecell_psgtech"
          target="_blank"
          rel="noopener noreferrer"
          className="size-8 rounded-lg border border-black/10 bg-white flex items-center justify-center text-[#262626]/70 hover:text-[#2547FF] hover:border-[#2547FF]/40 hover:bg-[#EDEFFC] hover:scale-105 transition-all shadow-2xs"
          aria-label="Twitter"
        >
          <Twitter size={15} />
        </a>
      </div>
    </div>
  );
};

const NavLink: React.FC<iNavLinkProps> = ({
  heading,
  href,
  subheading,
  setIsActive,
  index,
}) => {
  const ref = useRef<HTMLAnchorElement | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const location = useLocation();
  const navigate = useNavigate();

  const handleMouseMove = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / rect.width - 0.5);
    y.set(mouseY / rect.height - 0.5);
  };

  const handleClick = (e: React.MouseEvent) => {
    setIsActive(false);

    if (href.startsWith("#")) {
      e.preventDefault();
      const targetId = href.replace("#", "");

      if (location.pathname !== "/") {
        navigate(`/${href}`);
        setTimeout(() => {
          if (targetId === "home") {
            window.scrollTo({ top: 0, behavior: "smooth" });
          } else {
            document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" });
          }
        }, 150);
      } else {
        if (targetId === "home") {
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
  };

  const isExternal = href.startsWith("http");
  const linkProps = isExternal
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <motion.div
      onClick={handleClick}
      initial="initial"
      whileHover="whileHover"
      className="group relative flex flex-col border-b border-black/10 py-4 sm:py-5 px-3 -mx-3 rounded-2xl transition-all duration-300 hover:bg-[#EDEFFC]/50"
    >
      <Link
        ref={ref}
        onMouseMove={handleMouseMove}
        to={href}
        className="w-full flex items-center justify-between"
        {...linkProps}
      >
        <div className="relative flex items-center gap-3.5">
          {/* Brand Index Counter Pill */}
          <span className="font-mono text-xs font-bold text-[#2547FF] bg-[#EDEFFC] border border-[#2547FF]/20 px-2.5 py-0.5 rounded-md tracking-wider transition-colors duration-200 group-hover:bg-[#2547FF] group-hover:text-white group-hover:border-[#2547FF] shrink-0">
            0{index}
          </span>

          <div className="flex flex-col">
            <div className="flex flex-row overflow-hidden">
              <motion.span
                variants={{
                  initial: { x: 0 },
                  whileHover: { x: -6 },
                }}
                transition={{
                  type: "spring",
                  staggerChildren: 0.04,
                  delayChildren: 0.08,
                }}
                className="relative z-10 flex text-2xl sm:text-3xl font-display font-medium text-[#0A0A0A] tracking-tight group-hover:text-[#2547FF] transition-colors"
              >
                {heading.split("").map((letter, i) => (
                  <motion.span
                    key={i}
                    variants={{
                      initial: { x: 0 },
                      whileHover: { x: 6 },
                    }}
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    className="inline-block"
                  >
                    {letter === " " ? "\u00A0" : letter}
                  </motion.span>
                ))}
              </motion.span>
            </div>
            {subheading && (
              <span className="font-mono text-[11px] sm:text-xs text-[#262626]/55 group-hover:text-[#2547FF]/80 transition-colors mt-0.5 tracking-tight truncate">
                {subheading}
              </span>
            )}
          </div>
        </div>

        {/* Clean Circle Action Arrow */}
        <div className="size-9 rounded-full border border-black/10 bg-white flex items-center justify-center text-[#262626]/40 group-hover:text-white group-hover:bg-[#2547FF] group-hover:border-[#2547FF] transition-all duration-300 shadow-xs group-hover:scale-105 shrink-0 ml-2">
          <ArrowUpRight className="size-4 stroke-[2.2]" />
        </div>
      </Link>
    </motion.div>
  );
};

const Curve: React.FC = () => {
  const [windowHeight, setWindowHeight] = useState(
    typeof window !== "undefined" ? window.innerHeight : 800
  );

  useEffect(() => {
    const handleResize = () => setWindowHeight(window.innerHeight);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const initialPath = `M100 0 L200 0 L200 ${windowHeight} L100 ${windowHeight} Q-100 ${windowHeight / 2} 100 0`;
  const targetPath = `M100 0 L200 0 L200 ${windowHeight} L100 ${windowHeight} Q100 ${windowHeight / 2} 100 0`;

  const curve = {
    initial: { d: initialPath },
    enter: {
      d: targetPath,
      transition: { duration: 1, ease: [0.76, 0, 0.24, 1] },
    },
    exit: {
      d: initialPath,
      transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
    },
  };

  return (
    <svg
      className="absolute top-0 -left-[99px] w-[100px] stroke-none h-full pointer-events-none"
      style={{ fill: "#FAFAFC" }}
    >
      <motion.path
        variants={curve}
        initial="initial"
        animate="enter"
        exit="exit"
      />
    </svg>
  );
};

const CurvedNavbar: React.FC<
  iCurvedNavbarProps & { footer?: React.ReactNode }
> = ({ setIsActive, navItems, footer }) => {
  return (
    <motion.div
      variants={MENU_SLIDE_ANIMATION}
      initial="initial"
      animate="enter"
      exit="exit"
      className="h-[100dvh] w-screen max-w-screen-sm fixed right-0 top-0 z-40 bg-[#FAFAFC] text-black shadow-2xl flex flex-col justify-between border-l border-[#2547FF]/10 overflow-hidden"
    >
      {/* Decorative top ambient background blur */}
      <div className="pointer-events-none absolute -top-20 -right-20 size-60 rounded-full bg-[#2547FF]/10 blur-3xl" />

      <div className="h-full pt-16 sm:pt-20 pb-4 flex flex-col justify-between relative z-10">
        <div className="flex flex-col text-5xl gap-2 mt-0 px-8 sm:px-12 md:px-16 overflow-y-auto">
          {/* Branded Header Badge */}
          <div className="flex items-center justify-between border-b border-[#2547FF]/15 pb-4 mb-2">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-[#2547FF] animate-pulse" />
              <span className="text-xs font-mono font-bold tracking-[0.18em] text-[#0A0A0A] uppercase">
                PSG Tech <span className="text-[#2547FF]">E-Cell</span>
              </span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-[#EDEFFC] text-[#2547FF] border border-[#2547FF]/20 text-[10px] font-mono font-semibold tracking-wider uppercase">
              Navigation
            </span>
          </div>

          <nav className="bg-transparent mt-0">
            <div className="mx-auto w-full">
              {navItems.map((item, index) => (
                <NavLink
                  key={item.href}
                  {...item}
                  setIsActive={setIsActive}
                  index={index + 1}
                />
              ))}
            </div>
          </nav>
        </div>
        {footer}
      </div>
      <Curve />
    </motion.div>
  );
};

export const Header: React.FC<iHeaderProps> = ({
  navItems = defaultNavItems,
  footer = <CustomFooter />,
}) => {
  const [isActive, setIsActive] = useState(false);
  const openAudioRef = useRef<HTMLAudioElement | null>(null);
  const closeAudioRef = useRef<HTMLAudioElement | null>(null);

  // Close menu on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsActive(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Lock body scroll when navigation drawer is open
  useEffect(() => {
    if (isActive) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isActive]);

  const handleClick = () => {
    if (isActive) {
      closeAudioRef.current?.play()?.catch(() => {});
    } else {
      openAudioRef.current?.play()?.catch(() => {});
    }
    setIsActive(!isActive);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <div className="fixed top-5 right-5 sm:top-6 sm:right-8 z-50">
        <button
          type="button"
          onClick={handleClick}
          aria-label={isActive ? "Close menu" : "Open menu"}
          className={cn(
            "relative size-12 sm:size-13 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 group shadow-md hover:shadow-xl",
            isActive
              ? "bg-[#2547FF] text-white border border-[#2547FF] shadow-[0_4px_20px_rgba(37,71,255,0.35)] scale-105"
              : "bg-white text-black border border-black/10 hover:border-[#2547FF]/40 hover:shadow-[0_4px_24px_rgba(37,71,255,0.15)] hover:scale-105 active:scale-95"
          )}
        >
          {/* Subtle Ambient Pulse dot when closed */}
          {!isActive && (
            <span className="absolute top-1.5 right-1.5 flex size-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2547FF] opacity-75" />
              <span className="relative inline-flex rounded-full size-2 bg-[#2547FF]" />
            </span>
          )}

          <div className="relative w-5 h-4 flex flex-col justify-between items-center pointer-events-none">
            <span
              className={cn(
                "block h-0.5 w-5 transition-all duration-300 origin-center rounded-full",
                isActive
                  ? "bg-white rotate-45 translate-y-[7px]"
                  : "bg-black group-hover:bg-[#2547FF]"
              )}
            />
            <span
              className={cn(
                "block h-0.5 w-5 transition-all duration-200 rounded-full",
                isActive ? "opacity-0" : "bg-black group-hover:bg-[#2547FF]"
              )}
            />
            <span
              className={cn(
                "block h-0.5 w-5 transition-all duration-300 origin-center rounded-full",
                isActive
                  ? "bg-white -rotate-45 -translate-y-[7px]"
                  : "bg-black group-hover:bg-[#2547FF]"
              )}
            />
          </div>
        </button>
      </div>

      {/* Off-canvas Navigation Drawer and Dimming Backdrop */}
      <AnimatePresence mode="wait">
        {isActive && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsActive(false)}
              className="fixed inset-0 bg-[#0A0A0A]/40 backdrop-blur-xs z-30"
              aria-hidden="true"
            />
            <CurvedNavbar
              setIsActive={setIsActive}
              navItems={navItems}
              footer={footer}
            />
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;

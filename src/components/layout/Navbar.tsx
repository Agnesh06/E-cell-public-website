"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, AnimatePresence } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Linkedin, Github, Instagram, Mail } from "lucide-react";

export interface iNavItem {
  heading: string;
  href: string;
  subheading?: string;
  imgSrc?: string;
}

export interface iNavLinkProps extends iNavItem {
  setIsActive: (isActive: boolean) => void;
  index: number;
}

export interface iCurvedNavbarProps {
  setIsActive: (isActive: boolean) => void;
  navItems: iNavItem[];
  footer?: React.ReactNode;
}

export interface iHeaderProps {
  navItems?: iNavItem[];
  footer?: React.ReactNode;
}

const MENU_SLIDE_ANIMATION = {
  initial: { x: "calc(100% + 100px)" },
  enter: { x: "0", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } },
  exit: {
    x: "calc(100% + 100px)",
    transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
  },
};

export const defaultNavItems: iNavItem[] = [
  {
    heading: "Home",
    href: "#home",
  },
  {
    heading: "About Us",
    href: "#about",
  },
  {
    heading: "Projects",
    href: "#projects",
  },
  {
    heading: "Team",
    href: "#team",
  },
  {
    heading: "Collaboration",
    href: "#collaboration",
  },
  {
    heading: "Contact",
    href: "#contact",
  },
];

export const CustomFooter: React.FC = () => {
  return (
    <div className="flex w-full text-sm justify-between text-black px-8 sm:px-12 md:px-20 py-4 sm:py-5">
      <a
        href="https://www.linkedin.com/company/cse-association-psg-tech/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-black/80 hover:text-black hover:scale-110 transition-transform"
        aria-label="LinkedIn"
      >
        <Linkedin size={22} />
      </a>
      <a
        href="https://github.com/CSEA-PSGTech"
        target="_blank"
        rel="noopener noreferrer"
        className="text-black/80 hover:text-black hover:scale-110 transition-transform"
        aria-label="GitHub"
      >
        <Github size={22} />
      </a>
      <a
        href="https://instagram.com/cseapsgtech?psln=MTVjcW5lanBlcGducQ%3D%3D"
        target="_blank"
        rel="noopener noreferrer"
        className="text-black/80 hover:text-black hover:scale-110 transition-transform"
        aria-label="Instagram"
      >
        <Instagram size={22} />
      </a>
      <a
        href="mailto:csea.cse@psgtech.ac.in"
        className="text-black/80 hover:text-black hover:scale-110 transition-transform"
        aria-label="Official Email"
      >
        <Mail size={22} />
      </a>
    </div>
  );
};

export const NavLink: React.FC<iNavLinkProps> = ({
  heading,
  href,
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

      const scrollToTarget = () => {
        if (targetId === "home") {
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else if (targetId === "about" || targetId === "about-us") {
          const aboutEl = document.getElementById("about") || document.getElementById("about-us");
          const homeEl = document.getElementById("home");
          if (aboutEl) {
            aboutEl.scrollIntoView({ behavior: "smooth" });
          } else if (homeEl) {
            const travel = (window.innerHeight || 800) * 2.2;
            window.scrollTo({ top: homeEl.offsetTop + travel * 0.88, behavior: "smooth" });
          }
        } else {
          document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" });
        }
      };

      if (location.pathname !== "/") {
        navigate(`/${href}`);
        setTimeout(scrollToTarget, 150);
      } else {
        scrollToTarget();
      }
    }
  };

  const isExternalLink = href.startsWith("http");
  const linkProps = isExternalLink
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <motion.div
      onClick={handleClick}
      initial="initial"
      whileHover="whileHover"
      className="group relative flex items-center justify-between border-b border-black/20 py-2 sm:py-2.5 md:py-3 transition-colors duration-300 uppercase cursor-pointer"
      {...linkProps}
    >
      <Link ref={ref} onMouseMove={handleMouseMove} to={href} className="w-full">
        <div className="relative flex items-start">
          <div className="flex flex-row gap-2">
            <motion.span
              variants={{
                initial: { x: 0 },
                whileHover: { x: -16 },
              }}
              transition={{
                type: "spring",
                staggerChildren: 0.075,
                delayChildren: 0.25,
              }}
              className="relative z-10 block text-[clamp(22px,4vw,30px)] font-normal text-black transition-colors duration-300 font-['Neuton',Georgia,serif] leading-[1.2] tracking-[0.01em]"
              style={{
                fontFamily: '"Neuton", Georgia, serif',
                fontSize: 'clamp(22px, 4vw, 30px)',
                fontWeight: 400,
                lineHeight: 1.2,
                letterSpacing: '0.01em',
              }}
            >
              {heading.split("").map((letter, i) => {
                return (
                  <motion.span
                    key={i}
                    variants={{
                      initial: { x: 0 },
                      whileHover: { x: 16 },
                    }}
                    transition={{ type: "spring" }}
                    className="inline-block"
                  >
                    {letter === " " ? "\u00A0" : letter}
                  </motion.span>
                );
              })}
            </motion.span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export const Curve: React.FC = () => {
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
      style={{ fill: "#ffffff" }}
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

export const CurvedNavbar: React.FC<
  iCurvedNavbarProps & { footer?: React.ReactNode }
> = ({ setIsActive, navItems, footer }) => {
  return (
    <motion.div
      variants={MENU_SLIDE_ANIMATION}
      initial="initial"
      animate="enter"
      exit="exit"
      className="h-[100dvh] w-screen max-w-screen-sm fixed right-0 top-0 z-40 bg-white"
    >
      <div
        className="h-full pt-8 sm:pt-10 flex flex-col justify-between"
        style={{ fontFamily: '"Neuton", Georgia, serif' }}
      >
        <div className="flex flex-col text-5xl gap-2 mt-0 px-8 sm:px-12 md:px-20">
          <div
            className="text-black border-b border-black/20 uppercase text-xs sm:text-sm tracking-wider pb-1.5 mb-0.5"
            style={{
              fontFamily: '"Neuton", Georgia, serif',
              fontWeight: 400,
              letterSpacing: '0.08em',
            }}
          >
            <p>Navigation</p>
          </div>
          <section className="bg-transparent mt-0">
            <div className="mx-auto max-w-7xl">
              {navItems.map((item, index) => {
                return (
                  <NavLink
                    key={item.href}
                    {...item}
                    setIsActive={setIsActive}
                    index={index + 1}
                  />
                );
              })}
            </div>
          </section>
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

  const handleClick = () => {
    if (isActive) {
      closeAudioRef.current?.play()?.catch(() => { });
    } else {
      openAudioRef.current?.play()?.catch(() => { });
    }
    setIsActive(!isActive);
  };

  return (
    <>
      <div className="relative">
        <div
          onClick={handleClick}
          className="fixed -right-1 top-0 md:-right-1 m-5 z-50 w-12 h-12 rounded-none flex items-center justify-center cursor-pointer bg-white shadow-xs"
        >
          <div className="relative w-8 h-6 flex flex-col justify-between items-center pointer-events-none">
            <span
              className={`block h-1 w-7 bg-black transition-transform duration-300 ${isActive ? "rotate-45 translate-y-2" : ""
                }`}
            ></span>
            <span
              className={`block h-1 w-7 bg-black transition-opacity duration-300 ${isActive ? "opacity-0" : ""
                }`}
            ></span>
            <span
              className={`block h-1 w-7 bg-black transition-transform duration-300 ${isActive ? "-rotate-45 -translate-y-3" : ""
                }`}
            ></span>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {isActive && (
          <>
            {/* Backdrop Dimmer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              onClick={() => setIsActive(false)}
              className="fixed inset-0 bg-black/60 z-30"
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

"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, AnimatePresence } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Linkedin, Github, Instagram, Twitter } from "lucide-react";

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
];

export const CustomFooter: React.FC = () => {
  return (
    <div className="flex w-full text-sm justify-between text-black px-10 md:px-24 py-6">
      <a
        href="https://linkedin.com/company/ecell-psgtech"
        target="_blank"
        rel="noopener noreferrer"
        className="text-black/80 hover:text-black hover:scale-110 transition-transform"
        aria-label="LinkedIn"
      >
        <Linkedin size={24} />
      </a>
      <a
        href="https://github.com/Agnesh06"
        target="_blank"
        rel="noopener noreferrer"
        className="text-black/80 hover:text-black hover:scale-110 transition-transform"
        aria-label="GitHub"
      >
        <Github size={24} />
      </a>
      <a
        href="https://instagram.com/ecell_psgtech"
        target="_blank"
        rel="noopener noreferrer"
        className="text-black/80 hover:text-black hover:scale-110 transition-transform"
        aria-label="Instagram"
      >
        <Instagram size={24} />
      </a>
      <a
        href="https://twitter.com/ecell_psgtech"
        target="_blank"
        rel="noopener noreferrer"
        className="text-black/80 hover:text-black hover:scale-110 transition-transform"
        aria-label="Twitter"
      >
        <Twitter size={24} />
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

  const isExternalLink = href.startsWith("http");
  const linkProps = isExternalLink
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <motion.div
      onClick={handleClick}
      initial="initial"
      whileHover="whileHover"
      className="group relative flex items-center justify-between border-b border-black/30 py-4 transition-colors duration-500 md:py-8 uppercase cursor-pointer"
      {...linkProps}
    >
      <Link ref={ref} onMouseMove={handleMouseMove} to={href}>
        <div className="relative flex items-start">
          <span className="text-black transition-colors duration-500 text-4xl font-thin mr-2">
            {index}.
          </span>
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
              className="relative z-10 block text-4xl font-extralight text-black transition-colors duration-500 md:text-4xl"
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
      <div className="h-full pt-11 flex flex-col justify-between">
        <div className="flex flex-col text-5xl gap-3 mt-0 px-10 md:px-24">
          <div className="text-black border-b border-black/30 uppercase text-sm mb-0">
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

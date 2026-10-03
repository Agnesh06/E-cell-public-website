import React, { useRef, useState } from 'react';
import { motion, useReducedMotion, useMotionValueEvent, useScroll } from 'framer-motion';
import { Link } from 'react-router-dom';
import { NavItem } from '@/lib/constants';

const MotionLink = motion.create(Link);

export interface JellyNavProps {
  items: readonly NavItem[];
  activeKey: string;
  compact?: boolean;
  onItemClick: (item: NavItem, event: React.MouseEvent<HTMLAnchorElement>) => void;
}

export const JellyNav: React.FC<JellyNavProps> = ({
  items,
  activeKey,
  compact = false,
  onItemClick,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const navRef = useRef<HTMLElement | null>(null);
  const [mounted, setMounted] = useState(false);
  const [compactMode, setCompactMode] = useState(false);

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, 'change', (latest) => {
    if (prefersReducedMotion) return;
    if (latest > 72 && !compactMode) {
      setCompactMode(true);
    }
    if (latest <= 64 && compactMode) {
      setCompactMode(false);
    }
  });

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const animReady = mounted && !prefersReducedMotion;

  return (
    <nav
      ref={navRef}
      aria-label="Primary"
      className={`relative ml-auto flex items-center justify-center ${compactMode || compact ? 'h-11' : 'h-14'} w-full max-w-[min(100%,44rem)] overflow-hidden`}
      style={{
        willChange: 'transform',
      }}
    >
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, y: -12 }}
        animate={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
        transition={{ duration: 0.32, ease: 'easeOut' }}
        className="relative flex w-full items-center justify-center rounded-full border border-white/70 bg-[var(--glass-bg)] shadow-[0_12px_30px_var(--glass-shadow)] backdrop-blur-[var(--glass-blur)] supports-[backdrop-filter]:bg-white/40"
        style={{
          background: 'var(--glass-bg)',
          borderColor: 'var(--glass-border)',
          boxShadow: '0 14px 32px var(--glass-shadow), inset 0 1px 0 rgba(255,255,255,0.8)',
          WebkitBackdropFilter: 'blur(var(--glass-blur)) saturate(1.4)',
          backdropFilter: 'blur(var(--glass-blur)) saturate(1.4)',
        }}
      >
        <ul className="relative flex w-full items-center justify-center gap-1 px-1 py-1 sm:gap-1.5 md:gap-2">
          {items.map((item) => {
            const itemKey = item.label === 'Home' ? 'home' : item.label === 'About' ? 'about' : item.label === 'Projects' ? 'projects' : 'contact';
            const isActive = itemKey === activeKey;

            return (
              <li key={item.href} className="relative list-none">
                {isActive && animReady ? (
                  <motion.div
                    layoutId="nav-jelly-indicator"
                    transition={{ type: 'spring', stiffness: 580, damping: 30, mass: 0.8 }}
                    className="absolute inset-0 z-0 rounded-full bg-[var(--theme-accent)] shadow-[0_8px_20px_rgba(59,130,246,0.2)]"
                    style={{
                      background: 'var(--theme-accent)',
                    }}
                  />
                ) : null}

                <MotionLink
                  to={item.href}
                  onClick={(event) => onItemClick(item, event)}
                  aria-current={isActive ? 'page' : undefined}
                  className={[
                    'relative z-10 inline-flex items-center justify-center rounded-full px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-white/40',
                    compact ? 'min-h-[36px] px-2.5 text-[11px]' : 'min-h-[40px] px-3 text-xs sm:text-[13px] md:text-sm',
                    isActive ? 'text-white' : 'text-slate-700 hover:text-slate-900',
                  ].join(' ')}
                  style={{
                    color: isActive ? 'var(--theme-accent-foreground)' : 'hsl(var(--theme-text))',
                    textShadow: isActive ? '0 1px 0 rgba(0,0,0,0.1)' : 'none',
                  }}
                  initial={false}
                  animate={
                    animReady
                      ? {
                          scale: isActive ? 1.02 : 1,
                          x: isActive ? 0 : 0,
                          y: 0,
                        }
                      : { scale: 1 }
                  }
                  whileHover={prefersReducedMotion ? undefined : { scale: isActive ? 1.04 : 1.03, y: -1 }}
                  whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
                  transition={{
                    type: 'spring',
                    stiffness: 480,
                    damping: 22,
                    mass: 0.8,
                  }}
                >
                  {item.label}
                </MotionLink>
              </li>
            );
          })}
        </ul>
      </motion.div>
    </nav>
  );
};

export default JellyNav;

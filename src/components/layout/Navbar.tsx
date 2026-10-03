import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useReducedMotion } from 'framer-motion';
import { NAV_ITEMS, NavItem, getActiveNavKey } from '@/lib/constants';
import { JellyNav } from '@/components/ui/JellyNav';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();

  const activeKey = getActiveNavKey(location.pathname, location.hash);

  useEffect(() => {
    if (location.pathname === '/' && location.hash === '#about') {
      const el = document.getElementById('about');
      if (el) {
        el.scrollIntoView({
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
          block: 'start',
        });
      }
    }
  }, [location, prefersReducedMotion]);

  const handleNavClick = (item: NavItem, e?: React.MouseEvent<HTMLAnchorElement>) => {
    if (e) e.preventDefault();

    if (item.href === '/') {
      if (location.pathname === '/') {
        window.scrollTo({
          top: 0,
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
        });
        if (location.hash) {
          navigate('/', { replace: true });
        }
      } else {
        navigate('/');
      }
      return;
    }

    if (item.isHash) {
      if (location.pathname === '/') {
        const el = document.getElementById('about');
        if (el) {
          el.scrollIntoView({
            behavior: prefersReducedMotion ? 'auto' : 'smooth',
            block: 'start',
          });
        }
      } else {
        navigate('/#about');
      }
      return;
    }

    navigate(item.href);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 sm:px-5 md:px-6">
      <div className="w-full max-w-7xl">
        <div className="flex items-center justify-between gap-3 rounded-full border border-[var(--glass-border)] bg-[var(--glass-bg)] px-2 py-2 shadow-[0_12px_32px_var(--glass-shadow)] backdrop-blur-[var(--glass-blur)] supports-[backdrop-filter]:bg-white/40 sm:px-3 md:mx-auto md:max-w-[72rem] md:px-4" style={{
          background: 'var(--glass-bg)',
          borderColor: 'var(--glass-border)',
          boxShadow: '0 14px 32px var(--glass-shadow), inset 0 1px 0 rgba(255,255,255,0.82)',
          WebkitBackdropFilter: 'blur(var(--glass-blur)) saturate(1.4)',
          backdropFilter: 'blur(var(--glass-blur)) saturate(1.4)',
        }}>
          <Link
            to="/"
            onClick={(e) => handleNavClick({ label: 'Home', href: '/' }, e)}
            className="flex min-w-0 shrink-0 items-center gap-2 rounded-full px-2 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-white/60 md:gap-3"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[color:var(--theme-accent)]/40 bg-[color:var(--theme-accent)]/10 text-sm font-black text-[var(--theme-accent)] md:h-9 md:w-9">
              E
            </div>
            <div className="flex min-w-0 flex-col leading-none">
              <span className="truncate text-[0.7rem] font-bold tracking-tight text-slate-900 sm:text-xs md:text-sm">
                CSEA E-Cell
              </span>
              <span className="truncate text-[0.55rem] uppercase tracking-[0.18em] text-slate-500 md:text-[0.62rem]">
                PSG Tech
              </span>
            </div>
          </Link>

          <div className="min-w-0 flex-1">
            <JellyNav
              items={NAV_ITEMS}
              activeKey={activeKey}
              compact={false}
              onItemClick={handleNavClick}
            />
          </div>
        </div>
      </div>
    </header>
  );
};


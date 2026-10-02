import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { NAV_ITEMS, NavItem } from '@/lib/constants';
import { MobileMenu } from './MobileMenu';
import { useReducedMotion } from 'framer-motion';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();

  // Scroll to #about or top if hash is present on mount or route change
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

  const handleNavClick = (item: NavItem, e?: React.MouseEvent) => {
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
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/40 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo / Brand */}
          <Link
            to="/"
            onClick={(e) => handleNavClick({ label: 'Home', href: '/' }, e)}
            className="flex items-center space-x-3 group"
          >
            <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/50 flex items-center justify-center text-primary font-black text-sm group-hover:scale-105 transition-transform">
              E
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-tight text-foreground leading-tight">
                CSEA E-Cell
              </span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                PSG Tech
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {NAV_ITEMS.map((item) => {
              const isActive =
                (item.href === '/' &&
                  location.pathname === '/' &&
                  !location.hash) ||
                (item.isHash &&
                  location.pathname === '/' &&
                  location.hash === '#about') ||
                (!item.isHash &&
                  item.href !== '/' &&
                  location.pathname === item.href);

              return (
                <button
                  key={item.href}
                  onClick={(e) => handleNavClick(item, e)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Mobile hamburger toggle */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        onItemClick={(item) => handleNavClick(item)}
      />
    </>
  );
};


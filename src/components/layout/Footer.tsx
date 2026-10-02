import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/lib/constants';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-slate-950 border-t border-slate-800 text-slate-400 py-12 px-6 md:px-12 relative z-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left space-y-1">
          <p className="text-base font-semibold text-slate-100 tracking-tight">
            CSEA E-Cell | PSG College of Technology, Coimbatore
          </p>
          <p className="text-sm font-medium text-primary tracking-wide">
            Ideate. Collaborate. Build.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
          <Link to={ROUTES.HOME} className="hover:text-slate-100 transition-colors">
            Home
          </Link>
          <Link to={ROUTES.ABOUT} className="hover:text-slate-100 transition-colors">
            About
          </Link>
          <Link to={ROUTES.PROJECTS} className="hover:text-slate-100 transition-colors">
            Projects
          </Link>
          <Link to={ROUTES.COLLABORATION} className="hover:text-slate-100 transition-colors">
            Contact Us
          </Link>
          <Link to={ROUTES.TEAM} className="hover:text-slate-100 transition-colors">
            Team
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-slate-900 text-center text-xs text-slate-500">
        &copy; {new Date().getFullYear()} CSEA E-Cell, PSG College of Technology. All rights reserved.
      </div>
    </footer>
  );
};


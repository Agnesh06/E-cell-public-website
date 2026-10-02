import React from 'react';
import { useLocation } from 'react-router-dom';
import { NAV_ITEMS, NavItem } from '@/lib/constants';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onItemClick: (item: NavItem) => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  onItemClick,
}) => {
  const location = useLocation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-between bg-background/95 backdrop-blur-xl border-b border-border p-6 pt-24 animate-in fade-in slide-in-from-top-4 duration-200">
      <nav className="flex flex-col space-y-6 text-center">
        {NAV_ITEMS.map((item) => {
          const isActive =
            location.pathname === item.href ||
            (item.isHash && location.pathname === '/' && location.hash === '#about');

          return (
            <button
              key={item.href}
              onClick={() => {
                onItemClick(item);
                onClose();
              }}
              className={`text-2xl font-semibold tracking-tight transition-colors py-2 ${
                isActive
                  ? 'text-primary'
                  : 'text-foreground hover:text-primary'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="text-center text-xs text-muted-foreground pb-6 border-t border-border/40 pt-6">
        <p>CSEA E-Cell</p>
        <p className="mt-1">PSG College of Technology</p>
      </div>
    </div>
  );
};


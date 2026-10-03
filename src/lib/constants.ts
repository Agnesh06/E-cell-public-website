export const ROUTES = {
  HOME: '/',
  ABOUT: '/#about',
  PROJECTS: '/projects',
  COLLABORATION: '/collaboration',
  TEAM: '/team',
} as const;

export interface NavItem {
  label: string;
  href: string;
  isHash?: boolean;
}

export const NAV_ITEMS: readonly NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/#about', isHash: true },
  { label: 'Projects', href: '/projects' },
  { label: 'Contact Us', href: '/collaboration' },
] as const;

export const NAV_KEY_BY_ROUTE = {
  home: 'home',
  about: 'about',
  projects: 'projects',
  contact: 'contact',
} as const;

export function getActiveNavKey(
  path: string,
  hash: string
): (typeof NAV_KEY_BY_ROUTE)[keyof typeof NAV_KEY_BY_ROUTE] {
  if (path === '/' && (!hash || hash === '#home')) return NAV_KEY_BY_ROUTE.home;
  if (path === '/' && hash === '#about') return NAV_KEY_BY_ROUTE.about;
  if (path.startsWith('/projects')) return NAV_KEY_BY_ROUTE.projects;
  if (path === '/collaboration') return NAV_KEY_BY_ROUTE.contact;
  return NAV_KEY_BY_ROUTE.home;
}

// TODO: Point to dedicated application page once created
export const GET_INVOLVED_PATH = '/collaboration';

export const COLOR_TOKENS = {
  theme: {
    background: '0 0% 100%',
    backgroundEnd: '212.3 100% 97.45%',
    text: '218 72% 15%',
    mutedText: '215 39% 30%',
    accent: '214 81% 42%',
    accentForeground: '0 0% 100%',
    secondary: '210 82% 96%',
    muted: '210 82% 96%',
    card: '0 0% 100%',
    cardBorder: '211 67% 84%',
    cardShadow: '0 14px 34px rgba(35, 82, 136, 0.14)',
    destructive: '214 81% 42%',
  },
  lineWaves: {
    bgTop: '#FFFFFF',
    bgBottom: '#F2F8FF',
    lineBlue1: '#2F7BF5',
    lineBlue2: '#5AA2FF',
    lineBlue3: '#1E5FD8',
    wash: 'rgba(255, 255, 255, 0.92)',
  },
} as const;

export const SCENE_CONFIG = {
  DESKTOP_HEIGHT: '700vh',
  MOBILE_HEIGHT: '500vh',
  PERSPECTIVE: '1200px',
} as const;

export interface BeatConfig {
  id: string;
  name: string;
  start: number;
  end: number;
  hasExit: boolean;
  totalCards: number;
}

export const BEATS: readonly BeatConfig[] = [
  {
    id: 'hero',
    name: 'Hero',
    start: 0.0,
    end: 0.10,
    hasExit: true,
    totalCards: 0,
  },
  {
    id: 'about',
    name: 'About E-Cell',
    start: 0.10,
    end: 0.24,
    hasExit: true,
    totalCards: 3,
  },
  {
    id: 'approach',
    name: 'Our Approach',
    start: 0.24,
    end: 0.38,
    hasExit: true,
    totalCards: 3,
  },
  {
    id: 'ecosystem',
    name: 'Building an Entrepreneurial Ecosystem',
    start: 0.38,
    end: 0.52,
    hasExit: true,
    totalCards: 3,
  },
  {
    id: 'journey',
    name: 'Student Journey',
    start: 0.52,
    end: 0.68,
    hasExit: true,
    totalCards: 4,
  },
  {
    id: 'who-is-it-for',
    name: 'Who Is E-Cell For?',
    start: 0.68,
    end: 0.84,
    hasExit: true,
    totalCards: 4,
  },
  {
    id: 'final-cta',
    name: 'Final CTA',
    start: 0.84,
    end: 1.0,
    hasExit: false, // The FINAL beat has no exit and stays fully visible at progress 1
    totalCards: 0,
  },
] as const;


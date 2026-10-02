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

// TODO: Point to dedicated application page once created
export const GET_INVOLVED_PATH = '/collaboration';

export const SCENE_CONFIG = {
  DESKTOP_HEIGHT: '700vh',
  MOBILE_HEIGHT: '500vh',
  PERSPECTIVE: '1200px',
  BULB_FADE_IN_START: 0.03,
  BULB_FADE_IN_END: 0.12,
  STAGE_BG_START: 'rgb(3, 7, 18)',      // Deep navy #030712
  STAGE_BG_END: 'rgb(240, 246, 255)',   // Bright white-blue
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


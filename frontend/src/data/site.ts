import { env } from '@/lib/env'
import type { NavItem } from '@/types'
import logo1 from '@/assets/logos/logo-1.svg'
import logo2 from '@/assets/logos/logo-2.svg'
import logo3 from '@/assets/logos/logo-3.svg'
import logo4 from '@/assets/logos/logo-4.svg'

export interface SiteLogo {
  src: string
  alt: string
  href?: string
}

export interface SiteSocial {
  label: string
  href: string
}

export const site = {
  name: 'CSEA E-Cell',
  tagline: 'Ideate. Collaborate. Build.',
  footerLine: 'CSEA E-Cell | PSG College of Technology, Coimbatore',
  cseaUrl: env.VITE_CSEA_URL || 'https://csea.psgtech.ac.in',
  navItems: [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/#about' },
    { label: 'Projects', href: '/projects' },
    { label: 'Team', href: '/team' },
    { label: 'Contact Us', href: '/contact' },
  ] satisfies NavItem[],
  ctaHref: '/contact',
  logos: [
    { src: logo1, alt: 'Logo 1 (placeholder)' },
    { src: logo2, alt: 'Logo 2 (placeholder)' },
    { src: logo3, alt: 'Logo 3 (placeholder)' },
    { src: logo4, alt: 'Logo 4 (placeholder)' },
  ] as SiteLogo[],
  socials: [
    /* TODO: replace placeholder '#' with real social URLs */
    { label: 'LinkedIn', href: '#' },
    { label: 'Instagram', href: '#' },
    { label: 'GitHub', href: '#' },
  ] satisfies SiteSocial[],
}

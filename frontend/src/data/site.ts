import { env } from '@/lib/env'
import type { NavItem } from '@/types'
import logo1 from '@/assets/logos/logo-1.png'
import logo2 from '@/assets/logos/logo-2.png'
import logo3 from '@/assets/logos/logo-3.png'
import logo4 from '@/assets/logos/logo-4.png'
import logo5 from '@/assets/logos/logo-5.png'

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
    { src: logo3, alt: 'Logo 3 (placeholder)', href: '/' },
    { src: logo4, alt: 'Logo 4 (placeholder)', href: 'https://csea.psgtech.ac.in'},
    { src: logo5, alt: 'Logo 5 (placeholder)', href: 'https://psgtech.edu' },
  ] as SiteLogo[],
  socials: [
    {
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/company/cse-association-psg-tech/',
    },
    { label: 'Instagram', href: 'https://www.instagram.com/ecell.cseapsgtech/' },
    { label: 'GitHub', href: 'https://github.com/CSEA-PSGTech' },
    { label: 'CSEA', href: 'https://csea.psgtech.ac.in' },
  ] satisfies SiteSocial[],
}

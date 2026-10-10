import type { Project } from '@/types'

export const projects: Project[] = [
  {
    slug: 'placeholder-project-one',
    title: 'Campus Innovation Platform',
    summary: 'Empowering student entrepreneurs to build real-world products.',
    description: 'A comprehensive campus-wide initiative connecting innovators across departments.',
    tags: ['Innovation', 'Platform'],
    lead: 'CSEA E-Cell',
    links: [],
    featured: true,
    order: 1,
  },
  {
    slug: 'placeholder-project-two',
    title: 'Alumni Venture Network',
    summary: 'Bridging current founders with experienced PSG Tech alumni.',
    description: 'Mentorship and investment network connecting students with industry leaders.',
    tags: ['Network', 'Mentorship'],
    lead: 'CSEA E-Cell',
    links: [],
    featured: true,
    order: 2,
  },
  {
    slug: 'placeholder-project-three',
    title: 'Interdisciplinary Hackathon',
    summary: 'Solving real-world industry problems through tech collaboration.',
    description: 'Annual flagship hackathon bringing together engineering and management talents.',
    tags: ['Hackathon', 'Community'],
    lead: 'CSEA E-Cell',
    links: [],
    featured: true,
    order: 3,
  },
]

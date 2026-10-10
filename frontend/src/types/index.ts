export type ProjectLink = {
  label: string
  href: string
}

export type Project = {
  slug: string
  title: string
  summary: string
  description: string
  tags: string[]
  lead: string
  links: ProjectLink[]
  image?: string
  featured: boolean
  order: number
}

export type Wing = {
  id: string
  name: string
}

export type TeamMember = {
  id: string
  name: string
  role: string
  department: string
  photo?: string | null
  leadership?: 'director' | 'co-director'
  wing: Wing
  socials: {
    linkedin: string
    github: string
    email: string
  }
}

export type IdeaCard = {
  index?: string
  title?: string
  text: string
}

export type IdeaStep = {
  id: string
  eyebrow: string
  headlineTop: string
  headlineAccent: string
  body: string
  pills: string[]
  layout: 'quote' | 'trio' | 'quad' | 'grid2x2'
  cards: IdeaCard[]
  microLabels: string[]
  sideLabel?: string
}

export type NavItem = {
  label: string
  href: string
}

export type ProjectLink = {
  label: string
  href: string
}

export type ProjectFeasibility = {
  status: string
  technicalRequirements: string
  resourceRequirements: string
  timeline: string
  potentialConstraints: string
  summaryAssessment: string
}

export type ProjectImpact = {
  status: 'Proposed' | 'Ongoing' | 'Completed'
  changeStatement: string
  impactType: 'expected' | 'verified'
  outcomes: string[]
}

export type ProjectTechStackOrApproachItem = {
  name: string
  category?: string
  description?: string
}

export type ProjectTechOrApproach = {
  type: 'tech-stack' | 'approach'
  title: string
  summary: string
  items: ProjectTechStackOrApproachItem[]
}

export type Project = {
  slug: string
  title: string
  summary: string
  description: string
  tags?: string[]
  lead?: string
  links?: ProjectLink[]
  image?: string
  featured: boolean
  order: number
  status?: 'Proposed' | 'Ongoing' | 'Completed' | string
  kind?: 'technical' | 'non-technical'
  stack?: string[]
  change?: string
  feasibility?: string | ProjectFeasibility
  impact?: ProjectImpact
  techOrApproach?: ProjectTechOrApproach
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
    linkedin?: string
    github?: string
    email?: string
  }
  order?: number
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

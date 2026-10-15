import type { Project, TeamMember, ProjectLink, ProjectImpact, ProjectTechOrApproach } from '@/types'
import type { TeamProfile, TeamGroup, ProfileSocialLinks } from '@/types/teamDirectory'
import { placeholderImage, initialsImage } from './placeholder'
import { createTeamResult, type TeamDataResult } from './useSheetData'

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function normalizeHeader(str: string): string {
  return String(str || '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
}

function cleanLink(val?: string | null): string | undefined {
  if (!val) return undefined
  const trimmed = val.trim()
  const lower = trimmed.toLowerCase()
  if (['na', 'n/a', 'none', 'nil', '-', ''].includes(lower)) {
    return undefined
  }
  if (!/^https?:\/\//i.test(trimmed)) {
    return `https://${trimmed}`
  }
  return trimmed
}

function cleanEmail(val?: string | null): string | undefined {
  if (!val) return undefined
  const trimmed = val.trim()
  const lower = trimmed.toLowerCase()
  if (['na', 'n/a', 'none', 'nil', '-', ''].includes(lower)) {
    return undefined
  }
  if (!lower.startsWith('mailto:')) {
    return `mailto:${trimmed}`
  }
  return trimmed
}

function formatDisplayRole(rawRole: string): string {
  const formatted = rawRole
    .replace(/\s*-\s*/g, ' – ')
    .replace(/\s+and\s+/gi, ' & ')
    .trim()

  return formatted
    .split(' ')
    .map((word) => {
      if (word === '–' || word === '&') return word
      return word.charAt(0).toUpperCase() + word.slice(1)
    })
    .join(' ')
}

const LEAD_SENIORITY_RANKS: Record<string, { rank: number; leadership?: 'director' | 'co-director' }> = {
  director: { rank: 0, leadership: 'director' },
  deputydirector: { rank: 1, leadership: 'co-director' },
  headtechnical: { rank: 2 },
  headindustryandcommunityoutreach: { rank: 3 },
  associateheadtechnical: { rank: 4 },
  associateheadindustryandcommunityoutreach: { rank: 5 },
  programmanager: { rank: 6 },
  associateprogrammanager: { rank: 7 },
}

async function fetchWithTimeout(url: string, timeoutMs = 4000): Promise<Response> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    })
    return res
  } finally {
    clearTimeout(timer)
  }
}

type RawApiProject = {
  title?: string
  slug?: string
  summary?: string
  description?: string
  kind?: string
  projectType?: string
  image?: string
  coverImage?: string
  photo?: string
  stack?: string[]
  techstack?: string
  order?: number | string
  change?: string
  whatchange?: string
  feasibility?: string
  feasib?: string
  impact?: ProjectImpact
  techOrApproach?: ProjectTechOrApproach
  tags?: string[]
  lead?: string
  links?: ProjectLink[]
  featured?: boolean
  status?: string
  [key: string]: unknown
}

/**
 * Fetches Projects data from Express backend GET /api/projects.
 */
export async function fetchProjectsFromApi(baseUrl: string): Promise<Project[]> {
  const cleanBase = baseUrl.replace(/\/+$/, '')
  const res = await fetchWithTimeout(`${cleanBase}/api/projects`)
  if (!res.ok) {
    throw new Error(`Failed to fetch projects: ${res.status} ${res.statusText}`)
  }

  const json = await res.json()
  const rawList = Array.isArray(json) ? json : json?.projects
  if (!Array.isArray(rawList)) {
    throw new Error('Invalid projects response shape from API')
  }

  const projects: Project[] = rawList.map((item: RawApiProject, index: number) => {
    const title = item.title ? String(item.title).trim() : `Project ${index + 1}`
    const slug = item.slug ? String(item.slug).trim() : slugify(title)
    const summary = item.summary ? String(item.summary).trim() : ''
    const description = item.description ? String(item.description).trim() : summary
    const kind: 'technical' | 'non-technical' =
      item.kind === 'non-technical' || (typeof item.projectType === 'string' && item.projectType.toLowerCase().startsWith('non'))
        ? 'non-technical'
        : 'technical'

    const rawImage = (item.image || item.coverImage || item.photo || '').toString().trim()
    const image = rawImage && /^https?:\/\//i.test(rawImage) ? rawImage : placeholderImage(index + 1)

    const stack = Array.isArray(item.stack)
      ? item.stack.map(String).map((s: string) => s.trim()).filter(Boolean)
      : typeof item.techstack === 'string'
      ? item.techstack.split(',').map((s: string) => s.trim()).filter(Boolean)
      : []

    const rawOrder = item.order
    const parsedOrder = typeof rawOrder === 'number' ? rawOrder : parseInt(String(rawOrder), 10)
    const order = !Number.isNaN(parsedOrder) ? parsedOrder : index + 1

    const change = item.change || item.whatchange || ''
    const feasibility = item.feasibility || item.feasib || 'Feasibility assessment underway.'

    const impact = item.impact && typeof item.impact === 'object'
      ? item.impact
      : {
          status: 'Ongoing' as const,
          changeStatement: change,
          impactType: 'expected' as const,
          outcomes: change ? [change] : [],
        }

    const techOrApproach = item.techOrApproach && typeof item.techOrApproach === 'object'
      ? item.techOrApproach
      : {
          type: kind === 'technical' ? ('tech-stack' as const) : ('approach' as const),
          title: kind === 'technical' ? 'Technology Stack' : 'Methodology & Approach',
          summary: summary || title,
          items: stack.map((name: string) => ({ name })),
        }

    return {
      slug,
      title,
      summary,
      description,
      tags: Array.isArray(item.tags) && item.tags.length > 0 ? item.tags : [kind === 'technical' ? 'Technical' : 'Non-Technical'],
      lead: item.lead || 'CSEA E-Cell',
      links: Array.isArray(item.links) ? item.links : [],
      image,
      featured: typeof item.featured === 'boolean' ? item.featured : false,
      order,
      status: item.status || 'Ongoing',
      kind,
      stack,
      change,
      feasibility,
      impact,
      techOrApproach,
    }
  })

  // Sort by order ascending
  const sorted = projects.sort((a, b) => a.order - b.order)
  return sorted.map((p, index) => ({
    ...p,
    featured: typeof p.featured === 'boolean' && p.featured ? true : index < 3,
  }))
}

type RawApiMember = {
  name?: string
  fullname?: string
  role?: string
  position?: string
  department?: string
  vertical?: string
  photo?: string
  image?: string
  photolink?: string
  order?: number | string
  socials?: {
    linkedin?: string
    github?: string
    email?: string
  }
  linkedin?: string
  github?: string
  email?: string
  wing?: { id?: string; name?: string }
  rank?: number
  leadership?: 'director' | 'co-director'
  id?: string
  [key: string]: unknown
}

/**
 * Fetches Team data from Express backend GET /api/members.
 * Adapts items to TeamDataResult with leads, technical, and industryAndCommunityOutreach profiles.
 */
export async function fetchTeamFromApi(baseUrl: string): Promise<TeamDataResult> {
  const cleanBase = baseUrl.replace(/\/+$/, '')
  const res = await fetchWithTimeout(`${cleanBase}/api/members`)
  if (!res.ok) {
    throw new Error(`Failed to fetch team: ${res.status} ${res.statusText}`)
  }

  const json = await res.json()
  const rawList = Array.isArray(json) ? json : json?.members || json?.team
  if (!Array.isArray(rawList)) {
    throw new Error('Invalid team response shape from API')
  }

  type IntermediateItem = {
    member: TeamMember
    profile: TeamProfile
    rank: number
    order: number
    index: number
  }

  const leadsList: IntermediateItem[] = []
  const techList: IntermediateItem[] = []
  const outreachList: IntermediateItem[] = []

  rawList.forEach((m: RawApiMember, index: number) => {
    const name = (m.name || m.fullname || '').toString().trim()
    if (!name) return

    const rawRole = (m.role || m.position || 'Member').toString().trim()
    const normRole = normalizeHeader(rawRole)
    const displayRole = normRole in LEAD_SENIORITY_RANKS ? formatDisplayRole(rawRole) : rawRole
    const department = (m.department || m.vertical || '').toString().trim()

    const rawPhoto = (m.photo || m.image || m.photolink || '').toString().trim()
    const photo = rawPhoto && /^https?:\/\//i.test(rawPhoto) ? rawPhoto : initialsImage(name)

    const rawOrder = m.order
    const parsedOrder = typeof rawOrder === 'number' ? rawOrder : parseInt(String(rawOrder), 10)
    const order = !Number.isNaN(parsedOrder) ? parsedOrder : index + 1

    const linkedin = cleanLink(m.socials?.linkedin || m.linkedin)
    const github = cleanLink(m.socials?.github || m.github)
    const email = cleanEmail(m.socials?.email || m.email)

    const socialLinks: ProfileSocialLinks = {
      linkedin,
      github,
      email,
    }

    const wingId = (m.wing?.id || '').toString().toLowerCase()

    let group: TeamGroup
    let rank = 99
    let leadership: 'director' | 'co-director' | undefined = undefined

    if (wingId === 'leads' || normRole in LEAD_SENIORITY_RANKS || m.leadership) {
      group = 'leads'
      if (normRole in LEAD_SENIORITY_RANKS) {
        rank = LEAD_SENIORITY_RANKS[normRole].rank
        leadership = LEAD_SENIORITY_RANKS[normRole].leadership
      } else if (typeof m.rank === 'number') {
        rank = m.rank
      }
      if (!leadership && (m.leadership === 'director' || m.leadership === 'co-director')) {
        leadership = m.leadership
      }
    } else if (
      wingId === 'technical' ||
      normRole === 'membertechnical' ||
      normalizeHeader(department).includes('tech')
    ) {
      group = 'technical'
    } else if (
      wingId === 'outreach' ||
      wingId === 'industryandcommunityoutreach' ||
      normRole === 'memberindustryandcommunityoutreach' ||
      normalizeHeader(department).includes('outreach')
    ) {
      group = 'industryAndCommunityOutreach'
    } else if (normRole.includes('tech')) {
      group = 'technical'
    } else if (normRole.includes('outreach') || normRole.includes('communit')) {
      group = 'industryAndCommunityOutreach'
    } else {
      // General members fallback
      group = 'leads'
    }

    const memberId = m.id ? String(m.id) : slugify(`${name}-${displayRole}-${index}`)
    const subtitle =
      department ||
      (group === 'leads'
        ? 'Leadership'
        : group === 'technical'
        ? 'Technical Wing'
        : 'Industry & Community Outreach Wing')

    const member: TeamMember = {
      id: memberId,
      name,
      role: displayRole,
      department: subtitle,
      photo,
      leadership,
      wing: {
        id: group === 'industryAndCommunityOutreach' ? 'outreach' : group,
        name: group === 'leads' ? 'Leads' : group === 'technical' ? 'Technical' : 'Industry and Community Outreach',
      },
      socials: {
        linkedin,
        github,
        email,
      },
      order,
    }

    const profile: TeamProfile = {
      id: memberId,
      name,
      role: displayRole,
      team: group,
      isPlaceholder: false,
      image: photo,
      subtitle,
      socialLinks,
    }

    const item: IntermediateItem = {
      member,
      profile,
      rank,
      order,
      index,
    }

    if (group === 'leads') {
      leadsList.push(item)
    } else if (group === 'technical') {
      techList.push(item)
    } else {
      outreachList.push(item)
    }
  })

  // Sort Leads: by rank, then order, then index
  leadsList.sort((a, b) => {
    if (a.rank !== b.rank) return a.rank - b.rank
    return a.order - b.order || a.index - b.index
  })

  // Sort technical and outreach by order, then index
  techList.sort((a, b) => a.order - b.order || a.index - b.index)
  outreachList.sort((a, b) => a.order - b.order || a.index - b.index)

  const sortedMembers: TeamMember[] = [
    ...leadsList.map((l) => l.member),
    ...techList.map((t) => t.member),
    ...outreachList.map((o) => o.member),
  ]

  const profiles = {
    leads: leadsList.map((l) => l.profile),
    technical: techList.map((t) => t.profile),
    industryAndCommunityOutreach: outreachList.map((o) => o.profile),
  }

  return createTeamResult(sortedMembers, profiles)
}

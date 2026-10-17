import type { Project, TeamMember } from '@/types'
import type { TeamProfile } from '@/types/teamDirectory'
import { placeholderImage, initialsImage } from './placeholder'

export function csvUrl(id: string, tab: string = 'Form responses 1'): string {
  return `https://docs.google.com/spreadsheets/d/${id}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(tab)}`
}

/**
 * Quote-aware CSV parser supporting quotes (""), commas, and newlines.
 * Returns rows as objects keyed by trimmed header, with trimmed string values.
 */
export function parseCsv(text: string): Record<string, string>[] {
  const rows: string[][] = []
  let currentRow: string[] = []
  let currentField = ''
  let inQuotes = false

  let i = 0
  while (i < text.length) {
    const char = text[i]

    if (inQuotes) {
      if (char === '"') {
        if (i + 1 < text.length && text[i + 1] === '"') {
          currentField += '"'
          i += 2
          continue
        } else {
          inQuotes = false
          i++
          continue
        }
      } else {
        currentField += char
        i++
        continue
      }
    } else {
      if (char === '"') {
        inQuotes = true
        i++
        continue
      } else if (char === ',') {
        currentRow.push(currentField)
        currentField = ''
        i++
        continue
      } else if (char === '\r') {
        if (i + 1 < text.length && text[i + 1] === '\n') {
          i++
        }
        currentRow.push(currentField)
        currentField = ''
        rows.push(currentRow)
        currentRow = []
        i++
        continue
      } else if (char === '\n') {
        currentRow.push(currentField)
        currentField = ''
        rows.push(currentRow)
        currentRow = []
        i++
        continue
      } else {
        currentField += char
        i++
        continue
      }
    }
  }

  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField)
    rows.push(currentRow)
  }

  if (rows.length < 2) return []

  const headers = rows[0].map((h) => h.trim())
  const result: Record<string, string>[] = []

  for (let r = 1; r < rows.length; r++) {
    const row = rows[r]
    if (row.length === 1 && row[0].trim() === '') continue
    const obj: Record<string, string> = {}
    for (let c = 0; c < headers.length; c++) {
      const header = headers[c]
      if (header) {
        obj[header] = (row[c] ?? '').trim()
      }
    }
    result.push(obj)
  }

  return result
}

const SHEET_TIMEOUT_MS = 10_000
const SHEET_RETRY_DELAY_MS = 1_000

// Module-level in-flight promise cache so concurrent callers share the same request
const sheetPromiseCache = new Map<string, Promise<Record<string, string>[] | null>>()

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function fetchSheetOnce(
  url: string,
): Promise<{ ok: true; rows: Record<string, string>[] } | { ok: false; retryable: boolean }> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), SHEET_TIMEOUT_MS)

  try {
    const res = await fetch(url, { signal: controller.signal })
    clearTimeout(timeoutId)
    if (!res.ok) {
      const retryable = res.status >= 500 && res.status < 600
      return { ok: false, retryable }
    }
    const text = await res.text()
    return { ok: true, rows: parseCsv(text) }
  } catch {
    clearTimeout(timeoutId)
    return { ok: false, retryable: true }
  }
}

/**
 * Fetches CSV data from Google Sheets or direct CSV URL with a 10-second timeout.
 * Retries once after 1 second if the request fails with a network error or a 5xx status.
 * Returns parsed rows or null on failure.
 */
export function fetchSheet(idOrUrl: string, tab: string = 'Form responses 1'): Promise<Record<string, string>[] | null> {
  if (!idOrUrl) return Promise.resolve(null)

  const url = idOrUrl.startsWith('http://') || idOrUrl.startsWith('https://')
    ? idOrUrl
    : csvUrl(idOrUrl, tab)

  const existing = sheetPromiseCache.get(url)
  if (existing) return existing

  const fetchPromise = (async () => {
    try {
      const first = await fetchSheetOnce(url)
      if (first.ok) return first.rows

      if (first.retryable) {
        await delay(SHEET_RETRY_DELAY_MS)
        const second = await fetchSheetOnce(url)
        if (second.ok) return second.rows
      }

      return null
    } finally {
      sheetPromiseCache.delete(url)
    }
  })()

  sheetPromiseCache.set(url, fetchPromise)
  return fetchPromise
}

export function normalizeHeader(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '')
}

export function getField(row: Record<string, string>, prefix: string): string {
  const normPrefix = normalizeHeader(prefix)
  for (const [key, value] of Object.entries(row)) {
    const normKey = normalizeHeader(key)
    if (normKey.startsWith(normPrefix)) {
      return (value ?? '').trim()
    }
  }
  return ''
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function convertDriveImage(url: string): string | null {
  if (!url) return null
  const fileDMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)
  if (fileDMatch && fileDMatch[1]) {
    return `https://drive.google.com/thumbnail?id=${fileDMatch[1]}&sz=w1000`
  }
  const idParamMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/)
  if (idParamMatch && idParamMatch[1]) {
    return `https://drive.google.com/thumbnail?id=${idParamMatch[1]}&sz=w1000`
  }
  return null
}

function cleanLink(val: string): string | undefined {
  if (!val) return undefined
  const trimmed = val.trim()
  const lower = trimmed.toLowerCase()
  if (['na', 'n/a', 'none', 'nil', '-', ''].includes(lower)) {
    return undefined
  }
  return trimmed
}

function formatSocialUrl(val: string): string | undefined {
  const cleaned = cleanLink(val)
  if (!cleaned) return undefined
  if (!/^https?:\/\//i.test(cleaned)) {
    return `https://${cleaned}`
  }
  return cleaned
}

function formatEmail(val: string): string | undefined {
  const cleaned = cleanLink(val)
  if (!cleaned) return undefined
  if (!cleaned.toLowerCase().startsWith('mailto:')) {
    return `mailto:${cleaned}`
  }
  return cleaned
}

export function formatDisplayRole(rawRole: string): string {
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

/**
 * Maps raw sheet rows to Project objects according to <projects-mapping> rules.
 */
export function parseProjectsSheet(rows: Record<string, string>[]): Project[] {
  const projectsMap = new Map<string, Project>()

  rows.forEach((row, rowIndex) => {
    const showOnSite = getField(row, 'showonsite').toLowerCase()
    if (showOnSite !== 'yes') return

    const title = getField(row, 'projecttitle') || getField(row, 'title')
    if (!title) return

    const slug = slugify(title)
    if (!slug) return

    const summary = getField(row, 'onelinesummary') || getField(row, 'summary')
    const description = getField(row, 'description')
    const rawImage = getField(row, 'coverimage') || getField(row, 'photo') || getField(row, 'image')
    const feasibility = getField(row, 'feasib')
    const change = getField(row, 'whatchange') || getField(row, 'change')
    const rawType = getField(row, 'projecttype').toLowerCase()
    const kind: 'technical' | 'non-technical' = rawType.startsWith('non') ? 'non-technical' : 'technical'
    const rawStack = getField(row, 'techstack')
    const stack = rawStack
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)

    const rawOrder = getField(row, 'order')
    const parsedOrder = rawOrder ? parseInt(rawOrder, 10) : NaN
    const order = !isNaN(parsedOrder) ? parsedOrder : rowIndex + 1

    const driveConverted = rawImage ? convertDriveImage(rawImage) : null
    const image = driveConverted || (rawImage && /^https?:\/\//i.test(rawImage) ? rawImage : undefined)

    const project: Project = {
      slug,
      title,
      summary,
      description,
      tags: [kind === 'technical' ? 'Technical' : 'Non-Technical'],
      lead: 'CSEA E-Cell',
      links: [],
      image,
      featured: false,
      order,
      status: 'Ongoing',
      kind,
      stack,
      change,
      feasibility: feasibility || 'Feasibility assessment underway.',
      impact: {
        status: 'Ongoing',
        changeStatement: change,
        impactType: 'expected',
        outcomes: change ? [change] : [],
      },
      techOrApproach: {
        type: kind === 'technical' ? 'tech-stack' : 'approach',
        title: kind === 'technical' ? 'Technology Stack' : 'Methodology & Approach',
        summary: summary || title,
        items: stack.map((name) => ({ name })),
      },
    }

    // On duplicate slug, later row overwrites earlier row
    projectsMap.set(slug, project)
  })

  const sorted = Array.from(projectsMap.values()).sort((a, b) => a.order - b.order)

  return sorted.map((p, index) => ({
    ...p,
    image: p.image || placeholderImage(index + 1),
    featured: index < 3,
  }))
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

export type ParsedTeamData = {
  members: TeamMember[]
  profiles: {
    leads: TeamProfile[]
    technical: TeamProfile[]
    industryAndCommunityOutreach: TeamProfile[]
  }
}

/**
 * Maps raw sheet rows to TeamMember and TeamProfile structures according to <team-mapping> rules.
 */
export function parseTeamSheet(rows: Record<string, string>[]): ParsedTeamData {
  type IntermediateLead = {
    member: TeamMember
    profile: TeamProfile
    rank: number
    order: number
    sheetIndex: number
  }

  type IntermediateMember = {
    member: TeamMember
    profile: TeamProfile
    order: number
    sheetIndex: number
  }

  const leadsList: IntermediateLead[] = []
  const techList: IntermediateMember[] = []
  const outreachList: IntermediateMember[] = []

  rows.forEach((row, rowIndex) => {
    const showOnSite = getField(row, 'showonsite').toLowerCase()
    if (showOnSite !== 'yes') return

    const name = getField(row, 'fullname') || getField(row, 'name')
    if (!name) return

    const rawRole = getField(row, 'role')
    if (!rawRole) return

    const department = getField(row, 'department')
    const rawPhoto = getField(row, 'photolink') || getField(row, 'photo')
    const rawLinkedIn = getField(row, 'linkedin')
    const rawGitHub = getField(row, 'github')
    const rawEmail = getField(row, 'email')
    const rawOrder = getField(row, 'order')
    const parsedOrder = rawOrder ? parseInt(rawOrder, 10) : NaN
    const orderNum = !isNaN(parsedOrder) ? parsedOrder : rowIndex + 1

    const drivePhoto = rawPhoto ? convertDriveImage(rawPhoto) : null
    const photo = drivePhoto || (cleanLink(rawPhoto) && /^https?:\/\//i.test(rawPhoto) ? rawPhoto : initialsImage(name))

    const linkedin = formatSocialUrl(rawLinkedIn)
    const github = formatSocialUrl(rawGitHub)
    const email = formatEmail(rawEmail)

    const normRole = normalizeHeader(rawRole)

    if (normRole in LEAD_SENIORITY_RANKS) {
      const { rank, leadership } = LEAD_SENIORITY_RANKS[normRole]
      const displayRole = formatDisplayRole(rawRole)

      const member: TeamMember = {
        id: slugify(`${name}-${displayRole}-${rowIndex}`),
        name,
        role: displayRole,
        department,
        photo,
        leadership,
        wing: { id: 'leads', name: 'Leads' },
        socials: { linkedin, github, email },
        order: orderNum,
      }

      const profile: TeamProfile = {
        id: member.id,
        name,
        role: displayRole,
        team: 'leads',
        isPlaceholder: false,
        image: photo,
        subtitle: department,
        socialLinks: {
          linkedin,
          github,
          email,
        },
      }

      leadsList.push({
        member,
        profile,
        rank,
        order: orderNum,
        sheetIndex: rowIndex,
      })
    } else if (normRole === 'membertechnical') {
      const member: TeamMember = {
        id: slugify(`${name}-tech-${rowIndex}`),
        name,
        role: 'Member',
        department: department || 'Technical Wing',
        photo,
        wing: { id: 'technical', name: 'Technical' },
        socials: { linkedin, github, email },
        order: orderNum,
      }

      const profile: TeamProfile = {
        id: member.id,
        name,
        role: 'Member',
        team: 'technical',
        isPlaceholder: false,
        image: photo,
        subtitle: department || 'Technical Wing',
        socialLinks: {
          linkedin,
          github,
          email,
        },
      }

      techList.push({
        member,
        profile,
        order: orderNum,
        sheetIndex: rowIndex,
      })
    } else if (normRole === 'memberindustryandcommunityoutreach') {
      const member: TeamMember = {
        id: slugify(`${name}-outreach-${rowIndex}`),
        name,
        role: 'Member',
        department: department || 'Industry & Community Outreach Wing',
        photo,
        wing: { id: 'outreach', name: 'Industry and Community Outreach' },
        socials: { linkedin, github, email },
        order: orderNum,
      }

      const profile: TeamProfile = {
        id: member.id,
        name,
        role: 'Member',
        team: 'industryAndCommunityOutreach',
        isPlaceholder: false,
        image: photo,
        subtitle: department || 'Industry & Community Outreach Wing',
        socialLinks: {
          linkedin,
          github,
          email,
        },
      }

      outreachList.push({
        member,
        profile,
        order: orderNum,
        sheetIndex: rowIndex,
      })
    } else {
      // Unknown role: skip and console.warn in dev only
      if (import.meta.env.DEV) {
        console.warn(`[sheets] Unknown team member role "${rawRole}" for ${name}. Skipping row.`)
      }
    }
  })

  // Sort Leads: by seniority order, then sheet row order (or orderNum)
  leadsList.sort((a, b) => {
    if (a.rank !== b.rank) return a.rank - b.rank
    return a.order - b.order || a.sheetIndex - b.sheetIndex
  })

  // Sort Members: by order column if present, else row order
  techList.sort((a, b) => a.order - b.order || a.sheetIndex - b.sheetIndex)
  outreachList.sort((a, b) => a.order - b.order || a.sheetIndex - b.sheetIndex)

  const sortedMembers: TeamMember[] = [
    ...leadsList.map((l) => l.member),
    ...techList.map((t) => t.member),
    ...outreachList.map((o) => o.member),
  ]

  return {
    members: sortedMembers,
    profiles: {
      leads: leadsList.map((l) => l.profile),
      technical: techList.map((t) => t.profile),
      industryAndCommunityOutreach: outreachList.map((o) => o.profile),
    },
  }
}


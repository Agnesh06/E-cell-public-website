import { useEffect, useState } from 'react'
import type { Project, TeamMember } from '@/types'
import type { TeamProfile } from '@/types/teamDirectory'
import { projects as staticProjects } from '@/data/projects'
import { team as staticTeamMembers } from '@/data/team'
import { teamProfiles as staticTeamProfiles } from '@/data/teamDirectoryData'
import { env } from '@/lib/env'
import { fetchSheet, parseProjectsSheet, parseTeamSheet, csvUrl } from './sheets'
import { fetchProjectsFromApi, fetchTeamFromApi } from './api'

export type SheetDataStatus = 'loading' | 'ready' | 'fallback'

export type TeamDataResult = TeamMember[] & {
  members: TeamMember[]
  profiles: {
    leads: TeamProfile[]
    technical: TeamProfile[]
    industryAndCommunityOutreach: TeamProfile[]
  }
  leads: TeamProfile[]
  technical: TeamProfile[]
  industryAndCommunityOutreach: TeamProfile[]
}

export function createTeamResult(
  members: TeamMember[],
  profiles: {
    leads: TeamProfile[]
    technical: TeamProfile[]
    industryAndCommunityOutreach: TeamProfile[]
  },
): TeamDataResult {
  const arr = [...members] as TeamDataResult
  arr.members = members
  arr.profiles = profiles
  arr.leads = profiles.leads
  arr.technical = profiles.technical
  arr.industryAndCommunityOutreach = profiles.industryAndCommunityOutreach
  return arr
}

const staticTeamResult: TeamDataResult = createTeamResult(
  staticTeamMembers,
  staticTeamProfiles,
)

const emptyProjects: Project[] = []
const emptyTeamResult: TeamDataResult = createTeamResult([], {
  leads: [],
  technical: [],
  industryAndCommunityOutreach: [],
})

const SESSION_PROJECTS_KEY = '__ecell_last_good_projects__'
const SESSION_TEAM_KEY = '__ecell_last_good_team__'

function readSessionProjects(): Project[] | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.sessionStorage.getItem(SESSION_PROJECTS_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as Project[]) : null
  } catch {
    return null
  }
}

function writeSessionProjects(data: Project[]) {
  if (typeof window === 'undefined') return
  try {
    window.sessionStorage.setItem(SESSION_PROJECTS_KEY, JSON.stringify(data))
  } catch {
    // ignore storage errors
  }
}

function readSessionTeam(): TeamDataResult | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.sessionStorage.getItem(SESSION_TEAM_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as {
      members?: TeamMember[]
      profiles?: {
        leads: TeamProfile[]
        technical: TeamProfile[]
        industryAndCommunityOutreach: TeamProfile[]
      }
    }
    if (parsed && Array.isArray(parsed.members) && parsed.profiles) {
      return createTeamResult(parsed.members, parsed.profiles)
    }
    return null
  } catch {
    return null
  }
}

function writeSessionTeam(data: TeamDataResult) {
  if (typeof window === 'undefined') return
  try {
    window.sessionStorage.setItem(
      SESSION_TEAM_KEY,
      JSON.stringify({ members: data.members, profiles: data.profiles }),
    )
  } catch {
    // ignore storage errors
  }
}

// Session-level caches
let cachedProjects: { data: Project[]; status: 'ready' | 'fallback' } | null = null
let cachedTeam: { data: TeamDataResult; status: 'ready' | 'fallback' } | null = null

let lastGoodProjects: Project[] | null = readSessionProjects()
let lastGoodTeam: TeamDataResult | null = readSessionTeam()

let projectsPromise: Promise<{ data: Project[]; status: 'ready' | 'fallback' }> | null = null
let teamPromise: Promise<{ data: TeamDataResult; status: 'ready' | 'fallback' }> | null = null

function saveLastGoodProjects(data: Project[]) {
  lastGoodProjects = data
  writeSessionProjects(data)
}

function saveLastGoodTeam(data: TeamDataResult) {
  lastGoodTeam = data
  writeSessionTeam(data)
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function isRetryableError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err)
  return msg.includes('Failed to reach') || /:\s*5\d\d\b/.test(msg)
}

function getProjectsUrl(): string | null {
  if (env.VITE_PROJECTS_CSV_URL) return env.VITE_PROJECTS_CSV_URL
  const sheetId =
    env.VITE_PROJECTS_SHEET_ID ||
    (typeof window !== 'undefined'
      ? (window as unknown as Record<string, string>).__E2E_PROJECTS_SHEET_ID__
      : undefined)
  if (sheetId) return csvUrl(sheetId, env.VITE_PROJECTS_SHEET_TAB)
  return null
}

function getTeamUrl(): string | null {
  if (env.VITE_TEAM_CSV_URL) return env.VITE_TEAM_CSV_URL
  const sheetId =
    env.VITE_TEAM_SHEET_ID ||
    (typeof window !== 'undefined'
      ? (window as unknown as Record<string, string>).__E2E_TEAM_SHEET_ID__
      : undefined)
  if (sheetId) return csvUrl(sheetId, env.VITE_TEAM_SHEET_TAB)
  return null
}

export type DataSourceStatus = 'live' | 'fallback'

function setDevDataSource(kind: 'projects' | 'team', status: DataSourceStatus) {
  if (typeof window !== 'undefined' && import.meta.env.DEV) {
    const win = window as unknown as {
      __DATA_SOURCE__?: { projects?: DataSourceStatus; team?: DataSourceStatus }
    }
    win.__DATA_SOURCE__ = {
      ...(win.__DATA_SOURCE__ || {}),
      [kind]: status,
    }
    document.documentElement.setAttribute(`data-source-${kind}`, status)
  }
}

function resolveProjectsFailure(): { data: Project[]; status: 'ready' | 'fallback' } {
  if (lastGoodProjects !== null) {
    cachedProjects = { data: lastGoodProjects, status: 'ready' }
    setDevDataSource('projects', 'live')
    return cachedProjects
  }
  cachedProjects = { data: staticProjects, status: 'fallback' }
  setDevDataSource('projects', 'fallback')
  return cachedProjects
}

function resolveTeamFailure(): { data: TeamDataResult; status: 'ready' | 'fallback' } {
  if (lastGoodTeam !== null) {
    cachedTeam = { data: lastGoodTeam, status: 'ready' }
    setDevDataSource('team', 'live')
    return cachedTeam
  }
  cachedTeam = { data: staticTeamResult, status: 'fallback' }
  setDevDataSource('team', 'fallback')
  return cachedTeam
}

function loadProjects(
  revalidate = false,
): Promise<{ data: Project[]; status: 'ready' | 'fallback' }> {
  if (cachedProjects && !revalidate) return Promise.resolve(cachedProjects)
  if (projectsPromise) return projectsPromise

  projectsPromise = (async () => {
    try {
      // 1. Explicit mock mode overrides network
      if (env.VITE_USE_MOCK_API) {
        return resolveProjectsFailure()
      }

      // 2. Playwright E2E test override support
      const e2eOverride =
        typeof window !== 'undefined' &&
        (window as unknown as Record<string, string>).__E2E_PROJECTS_SHEET_ID__
      if (e2eOverride) {
        const csvEndpoint = csvUrl(e2eOverride, env.VITE_PROJECTS_SHEET_TAB)
        const rows = await fetchSheet(csvEndpoint)
        if (rows !== null) {
          const parsed = parseProjectsSheet(rows)
          saveLastGoodProjects(parsed)
          cachedProjects = { data: parsed, status: 'ready' }
          setDevDataSource('projects', 'live')
          return cachedProjects
        }
        return resolveProjectsFailure()
      }

      // 3. Direct Google Sheets CSV when configured via env
      const csvUrlCandidate = getProjectsUrl()
      if (csvUrlCandidate) {
        const rows = await fetchSheet(csvUrlCandidate)
        if (rows !== null) {
          const parsed = parseProjectsSheet(rows)
          saveLastGoodProjects(parsed)
          cachedProjects = { data: parsed, status: 'ready' }
          setDevDataSource('projects', 'live')
          return cachedProjects
        }
        if (!env.VITE_API_BASE_URL) {
          return resolveProjectsFailure()
        }
      }

      // 4. Express backend endpoint when configured
      if (env.VITE_API_BASE_URL) {
        const endpoint = `${env.VITE_API_BASE_URL.replace(/\/+$/, '')}/api/projects`
        try {
          let projects: Project[]
          try {
            projects = await fetchProjectsFromApi(env.VITE_API_BASE_URL)
          } catch (firstErr) {
            if (isRetryableError(firstErr)) {
              await delay(1000)
              projects = await fetchProjectsFromApi(env.VITE_API_BASE_URL)
            } else {
              throw firstErr
            }
          }
          saveLastGoodProjects(projects)
          cachedProjects = { data: projects, status: 'ready' }
          setDevDataSource('projects', 'live')
          return cachedProjects
        } catch (err) {
          if (lastGoodProjects === null) {
            const reason = err instanceof Error ? err.message : String(err)
            console.warn(
              `[useSheetData] API request failed for endpoint "${endpoint}": ${reason}. Using static fallback data under "frontend/src/data/projects.ts".`,
            )
          }
          return resolveProjectsFailure()
        }
      }

      // 5. Final fallback when nothing is configured
      if (!env.VITE_API_BASE_URL && !csvUrlCandidate && lastGoodProjects === null && import.meta.env.DEV) {
        console.warn(
          '[useSheetData] Neither VITE_API_BASE_URL nor Google Sheets CSV URL is configured. Using static fallback data under "frontend/src/data/projects.ts".',
        )
      }
      return resolveProjectsFailure()
    } finally {
      projectsPromise = null
    }
  })()

  return projectsPromise
}

function loadTeam(
  revalidate = false,
): Promise<{ data: TeamDataResult; status: 'ready' | 'fallback' }> {
  if (cachedTeam && !revalidate) return Promise.resolve(cachedTeam)
  if (teamPromise) return teamPromise

  teamPromise = (async () => {
    try {
      // 1. Explicit mock mode overrides network
      if (env.VITE_USE_MOCK_API) {
        return resolveTeamFailure()
      }

      // 2. Playwright E2E test override support
      const e2eOverride =
        typeof window !== 'undefined' &&
        (window as unknown as Record<string, string>).__E2E_TEAM_SHEET_ID__
      if (e2eOverride) {
        const csvEndpoint = csvUrl(e2eOverride, env.VITE_TEAM_SHEET_TAB)
        const rows = await fetchSheet(csvEndpoint)
        if (rows !== null) {
          const parsed = parseTeamSheet(rows)
          const result = createTeamResult(parsed.members, parsed.profiles)
          saveLastGoodTeam(result)
          cachedTeam = { data: result, status: 'ready' }
          setDevDataSource('team', 'live')
          return cachedTeam
        }
        return resolveTeamFailure()
      }

      // 3. Direct Google Sheets CSV when configured via env
      const csvUrlCandidate = getTeamUrl()
      if (csvUrlCandidate) {
        const rows = await fetchSheet(csvUrlCandidate)
        if (rows !== null) {
          const parsed = parseTeamSheet(rows)
          const result = createTeamResult(parsed.members, parsed.profiles)
          saveLastGoodTeam(result)
          cachedTeam = { data: result, status: 'ready' }
          setDevDataSource('team', 'live')
          return cachedTeam
        }
        if (!env.VITE_API_BASE_URL) {
          return resolveTeamFailure()
        }
      }

      // 4. Express backend endpoint when configured
      if (env.VITE_API_BASE_URL) {
        const endpoint = `${env.VITE_API_BASE_URL.replace(/\/+$/, '')}/api/members`
        try {
          let teamResult: TeamDataResult
          try {
            teamResult = await fetchTeamFromApi(env.VITE_API_BASE_URL)
          } catch (firstErr) {
            if (isRetryableError(firstErr)) {
              await delay(1000)
              teamResult = await fetchTeamFromApi(env.VITE_API_BASE_URL)
            } else {
              throw firstErr
            }
          }
          saveLastGoodTeam(teamResult)
          cachedTeam = { data: teamResult, status: 'ready' }
          setDevDataSource('team', 'live')
          return cachedTeam
        } catch (err) {
          if (lastGoodTeam === null) {
            const reason = err instanceof Error ? err.message : String(err)
            console.warn(
              `[useSheetData] API request failed for endpoint "${endpoint}": ${reason}. Using static fallback data under "frontend/src/data/team.ts".`,
            )
          }
          return resolveTeamFailure()
        }
      }

      // 5. Final fallback when nothing is configured
      if (!env.VITE_API_BASE_URL && !csvUrlCandidate && lastGoodTeam === null && import.meta.env.DEV) {
        console.warn(
          '[useSheetData] Neither VITE_API_BASE_URL nor Google Sheets CSV URL is configured. Using static fallback data under "frontend/src/data/team.ts".',
        )
      }
      return resolveTeamFailure()
    } finally {
      teamPromise = null
    }
  })()

  return teamPromise
}

export function prefetchProjects() {
  return loadProjects()
}

export function prefetchTeam() {
  return loadTeam()
}

export function useSheetData(kind: 'projects'): { data: Project[]; status: SheetDataStatus }
export function useSheetData(kind: 'team'): { data: TeamDataResult; status: SheetDataStatus }
export function useSheetData(kind: 'projects' | 'team'): {
  data: Project[] | TeamDataResult
  status: SheetDataStatus
} {
  const isProjects = kind === 'projects'
  const cached = isProjects ? cachedProjects : cachedTeam

  const [state, setState] = useState<{
    data: Project[] | TeamDataResult
    status: SheetDataStatus
  }>(() => {
    if (cached) {
      return { data: cached.data, status: cached.status }
    }
    return {
      data: isProjects ? emptyProjects : emptyTeamResult,
      status: 'loading',
    }
  })

  useEffect(() => {
    if (cached) return

    let isMounted = true

    if (isProjects) {
      loadProjects().then((res) => {
        if (isMounted) setState({ data: res.data, status: res.status })
      })
    } else {
      loadTeam().then((res) => {
        if (isMounted) setState({ data: res.data, status: res.status })
      })
    }

    return () => {
      isMounted = false
    }
  }, [isProjects, cached])

  return state
}

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

// Session-level caches
let cachedProjects: { data: Project[]; status: 'ready' | 'fallback' } | null = null
let cachedTeam: { data: TeamDataResult; status: 'ready' | 'fallback' } | null = null

let projectsPromise: Promise<{ data: Project[]; status: 'ready' | 'fallback' }> | null = null
let teamPromise: Promise<{ data: TeamDataResult; status: 'ready' | 'fallback' }> | null = null

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

function loadProjects(): Promise<{ data: Project[]; status: 'ready' | 'fallback' }> {
  if (cachedProjects) return Promise.resolve(cachedProjects)
  if (projectsPromise) return projectsPromise

  projectsPromise = (async () => {
    // 1. Explicit mock mode overrides network
    if (env.VITE_USE_MOCK_API) {
      cachedProjects = { data: staticProjects, status: 'fallback' }
      setDevDataSource('projects', 'fallback')
      return cachedProjects
    }

    // 2. Playwright E2E test override support
    const e2eOverride =
      typeof window !== 'undefined' &&
      (window as unknown as Record<string, string>).__E2E_PROJECTS_SHEET_ID__
    if (e2eOverride) {
      const csvEndpoint = csvUrl(e2eOverride, env.VITE_PROJECTS_SHEET_TAB)
      try {
        const rows = await fetchSheet(csvEndpoint)
        const parsed = rows && rows.length > 0 ? parseProjectsSheet(rows) : null
        if (parsed && parsed.length > 0) {
          cachedProjects = { data: parsed, status: 'ready' }
          setDevDataSource('projects', 'live')
          return cachedProjects
        }
      } catch {
        // fall through to other strategies
      }
    }

    // 3. Express backend endpoint when configured
    if (env.VITE_API_BASE_URL) {
      const endpoint = `${env.VITE_API_BASE_URL.replace(/\/+$/, '')}/api/projects`
      try {
        const projects = await fetchProjectsFromApi(env.VITE_API_BASE_URL)
        if (projects && projects.length > 0) {
          cachedProjects = { data: projects, status: 'ready' }
          setDevDataSource('projects', 'live')
          return cachedProjects
        }
      } catch (err) {
        const reason = err instanceof Error ? err.message : String(err)
        console.warn(
          `[useSheetData] API request failed for endpoint "${endpoint}": ${reason}. Using static fallback data under "frontend/src/data/projects.ts".`,
        )
        cachedProjects = { data: staticProjects, status: 'fallback' }
        setDevDataSource('projects', 'fallback')
        return cachedProjects
      }
    }

    // 4. Secondary fallback: Direct Google Sheets CSV when backend is not configured
    const csvUrlCandidate = getProjectsUrl()
    if (csvUrlCandidate) {
      try {
        const rows = await fetchSheet(csvUrlCandidate)
        const parsed = rows && rows.length > 0 ? parseProjectsSheet(rows) : null
        if (parsed && parsed.length > 0) {
          cachedProjects = { data: parsed, status: 'ready' }
          setDevDataSource('projects', 'live')
          return cachedProjects
        }
      } catch {
        // fall through
      }
    }

    // 5. Final fallback to static projects
    if (!env.VITE_API_BASE_URL && !csvUrlCandidate && import.meta.env.DEV) {
      console.warn(
        '[useSheetData] Neither VITE_API_BASE_URL nor Google Sheets CSV URL is configured. Using static fallback data under "frontend/src/data/projects.ts".',
      )
    }
    cachedProjects = { data: staticProjects, status: 'fallback' }
    setDevDataSource('projects', 'fallback')
    return cachedProjects
  })()

  return projectsPromise
}

function loadTeam(): Promise<{ data: TeamDataResult; status: 'ready' | 'fallback' }> {
  if (cachedTeam) return Promise.resolve(cachedTeam)
  if (teamPromise) return teamPromise

  teamPromise = (async () => {
    // 1. Explicit mock mode overrides network
    if (env.VITE_USE_MOCK_API) {
      cachedTeam = { data: staticTeamResult, status: 'fallback' }
      setDevDataSource('team', 'fallback')
      return cachedTeam
    }

    // 2. Playwright E2E test override support
    const e2eOverride =
      typeof window !== 'undefined' &&
      (window as unknown as Record<string, string>).__E2E_TEAM_SHEET_ID__
    if (e2eOverride) {
      const csvEndpoint = csvUrl(e2eOverride, env.VITE_TEAM_SHEET_TAB)
      try {
        const rows = await fetchSheet(csvEndpoint)
        if (rows && rows.length > 0) {
          const parsed = parseTeamSheet(rows)
          const totalProfiles =
            parsed.profiles.leads.length +
            parsed.profiles.technical.length +
            parsed.profiles.industryAndCommunityOutreach.length
          if (parsed.members.length > 0 || totalProfiles > 0) {
            const result = createTeamResult(parsed.members, parsed.profiles)
            cachedTeam = { data: result, status: 'ready' }
            setDevDataSource('team', 'live')
            return cachedTeam
          }
        }
      } catch {
        // fall through to other strategies
      }
    }

    // 3. Express backend endpoint when configured
    if (env.VITE_API_BASE_URL) {
      const endpoint = `${env.VITE_API_BASE_URL.replace(/\/+$/, '')}/api/members`
      try {
        const teamResult = await fetchTeamFromApi(env.VITE_API_BASE_URL)
        const totalProfiles =
          teamResult.profiles.leads.length +
          teamResult.profiles.technical.length +
          teamResult.profiles.industryAndCommunityOutreach.length
        if (teamResult.members.length > 0 || totalProfiles > 0) {
          cachedTeam = { data: teamResult, status: 'ready' }
          setDevDataSource('team', 'live')
          return cachedTeam
        }
      } catch (err) {
        const reason = err instanceof Error ? err.message : String(err)
        console.warn(
          `[useSheetData] API request failed for endpoint "${endpoint}": ${reason}. Using static fallback data under "frontend/src/data/team.ts".`,
        )
        cachedTeam = { data: staticTeamResult, status: 'fallback' }
        setDevDataSource('team', 'fallback')
        return cachedTeam
      }
    }

    // 4. Secondary fallback: Direct Google Sheets CSV when backend is not configured
    const csvUrlCandidate = getTeamUrl()
    if (csvUrlCandidate) {
      try {
        const rows = await fetchSheet(csvUrlCandidate)
        if (rows && rows.length > 0) {
          const parsed = parseTeamSheet(rows)
          const totalProfiles =
            parsed.profiles.leads.length +
            parsed.profiles.technical.length +
            parsed.profiles.industryAndCommunityOutreach.length
          if (parsed.members.length > 0 || totalProfiles > 0) {
            const result = createTeamResult(parsed.members, parsed.profiles)
            cachedTeam = { data: result, status: 'ready' }
            setDevDataSource('team', 'live')
            return cachedTeam
          }
        }
      } catch {
        // fall through
      }
    }

    // 5. Final fallback to static team
    if (!env.VITE_API_BASE_URL && !csvUrlCandidate && import.meta.env.DEV) {
      console.warn(
        '[useSheetData] Neither VITE_API_BASE_URL nor Google Sheets CSV URL is configured. Using static fallback data under "frontend/src/data/team.ts".',
      )
    }
    cachedTeam = { data: staticTeamResult, status: 'fallback' }
    setDevDataSource('team', 'fallback')
    return cachedTeam
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
    if (env.VITE_USE_MOCK_API) {
      return {
        data: isProjects ? staticProjects : staticTeamResult,
        status: 'fallback',
      }
    }
    const hasBackend = Boolean(env.VITE_API_BASE_URL)
    const hasCsv = isProjects ? Boolean(getProjectsUrl()) : Boolean(getTeamUrl())
    if (!hasBackend && !hasCsv) {
      return {
        data: isProjects ? staticProjects : staticTeamResult,
        status: 'fallback',
      }
    }
    return {
      data: isProjects ? staticProjects : staticTeamResult,
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

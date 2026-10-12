import { useEffect, useState } from 'react'
import type { Project, TeamMember } from '@/types'
import type { TeamProfile } from '@/types/teamDirectory'
import { projects as staticProjects } from '@/data/projects'
import { team as staticTeamMembers } from '@/data/team'
import { teamProfiles as staticTeamProfiles } from '@/data/teamDirectoryData'
import { env } from '@/lib/env'
import { fetchSheet, parseProjectsSheet, parseTeamSheet, csvUrl } from './sheets'

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

function createTeamResult(
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

function loadProjects(): Promise<{ data: Project[]; status: 'ready' | 'fallback' }> {
  if (cachedProjects) return Promise.resolve(cachedProjects)
  if (projectsPromise) return projectsPromise

  projectsPromise = (async () => {
    const url = getProjectsUrl()
    if (!url) {
      cachedProjects = { data: staticProjects, status: 'fallback' }
      return cachedProjects
    }

    try {
      const rows = await fetchSheet(url)
      if (!rows || rows.length === 0) {
        cachedProjects = { data: staticProjects, status: 'fallback' }
        return cachedProjects
      }

      const parsed = parseProjectsSheet(rows)
      if (!parsed || parsed.length === 0) {
        cachedProjects = { data: staticProjects, status: 'fallback' }
        return cachedProjects
      }

      cachedProjects = { data: parsed, status: 'ready' }
      return cachedProjects
    } catch {
      cachedProjects = { data: staticProjects, status: 'fallback' }
      return cachedProjects
    }
  })()

  return projectsPromise
}

function loadTeam(): Promise<{ data: TeamDataResult; status: 'ready' | 'fallback' }> {
  if (cachedTeam) return Promise.resolve(cachedTeam)
  if (teamPromise) return teamPromise

  teamPromise = (async () => {
    const url = getTeamUrl()
    if (!url) {
      cachedTeam = { data: staticTeamResult, status: 'fallback' }
      return cachedTeam
    }

    try {
      const rows = await fetchSheet(url)
      if (!rows || rows.length === 0) {
        cachedTeam = { data: staticTeamResult, status: 'fallback' }
        return cachedTeam
      }

      const parsed = parseTeamSheet(rows)
      const totalProfiles =
        parsed.profiles.leads.length +
        parsed.profiles.technical.length +
        parsed.profiles.industryAndCommunityOutreach.length

      if (parsed.members.length === 0 && totalProfiles === 0) {
        cachedTeam = { data: staticTeamResult, status: 'fallback' }
        return cachedTeam
      }

      const result = createTeamResult(parsed.members, parsed.profiles)
      cachedTeam = { data: result, status: 'ready' }
      return cachedTeam
    } catch {
      cachedTeam = { data: staticTeamResult, status: 'fallback' }
      return cachedTeam
    }
  })()

  return teamPromise
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
    const hasConfig = isProjects ? Boolean(getProjectsUrl()) : Boolean(getTeamUrl())
    if (!hasConfig) {
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

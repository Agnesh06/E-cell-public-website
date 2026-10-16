import { describe, expect, it, vi, afterEach } from 'vitest'
import { fetchProjectsFromApi, fetchTeamFromApi } from './api'

describe('API Client Error Handling and Diagnostics', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('includes endpoint, status, and error json message on HTTP 500 failure for projects', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ error: 'Missing GSHEET_PROJECTS_ID in .env' }), {
        status: 500,
        statusText: 'Internal Server Error',
        headers: { 'Content-Type': 'application/json' },
      }),
    )

    await expect(fetchProjectsFromApi('http://localhost:4000')).rejects.toThrow(
      'Failed to fetch projects from http://localhost:4000/api/projects: 500 (Missing GSHEET_PROJECTS_ID in .env)',
    )
  })

  it('includes endpoint, status, and error json message on HTTP 500 failure for team', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ error: 'Missing GSHEET_TEAM_ID in .env' }), {
        status: 500,
        statusText: 'Internal Server Error',
        headers: { 'Content-Type': 'application/json' },
      }),
    )

    await expect(fetchTeamFromApi('http://localhost:4000')).rejects.toThrow(
      'Failed to fetch team from http://localhost:4000/api/members: 500 (Missing GSHEET_TEAM_ID in .env)',
    )
  })

  it('preserves cause when network request fails', async () => {
    const netErr = new TypeError('Failed to fetch')
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(netErr)

    try {
      await fetchProjectsFromApi('http://localhost:4000')
      expect.fail('Should have thrown an error')
    } catch (err: unknown) {
      expect(err).toBeInstanceOf(Error)
      const e = err as Error
      expect(e.message).toContain('Failed to reach http://localhost:4000/api/projects')
      expect(e.cause).toBe(netErr)
    }
  })
})


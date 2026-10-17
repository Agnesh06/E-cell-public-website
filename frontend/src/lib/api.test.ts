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

  it('maps project cover images, converts Google Drive URLs, and falls back to placeholder when missing', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({
          projects: [
            {
              title: 'Health Care Chatbot',
              slug: 'health-care-chatbot',
              summary: 'AI chatbot for healthcare',
              image:
                'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPyxorU5Pnou7bFp5mXXLS6F9HDQOyP-fBNdGsmIhBNw&s=10',
              featured: true,
              order: 1,
            },
            {
              title: 'Drive Image Project',
              slug: 'drive-image-project',
              summary: 'Uses Drive share link',
              coverImage: 'https://drive.google.com/file/d/1AbCdEfGhIjKlMnOpQrStUvWxYz/view?usp=sharing',
              featured: true,
              order: 2,
            },
            {
              title: 'No Image Project',
              slug: 'no-image-project',
              summary: 'Missing cover image',
              image: '',
              featured: true,
              order: 3,
            },
          ],
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        },
      ),
    )

    const result = await fetchProjectsFromApi('http://localhost:4000')
    expect(result).toHaveLength(3)
    expect(result[0].image).toBe(
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPyxorU5Pnou7bFp5mXXLS6F9HDQOyP-fBNdGsmIhBNw&s=10',
    )
    expect(result[1].image).toBe('https://drive.google.com/thumbnail?id=1AbCdEfGhIjKlMnOpQrStUvWxYz&sz=w1000')
    expect(result[2].image).toMatch(/^data:image\/svg\+xml;utf8,/)
  })
})


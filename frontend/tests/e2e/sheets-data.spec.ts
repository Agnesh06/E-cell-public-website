import { expect, test } from '@playwright/test'

const mockProjectsCsv = `Timestamp,Project title,One-line summary,Description(3-4 lines),Cover image link,Feasiblity,What Changes,Project type,Tech stack or approach(write in commas),Cost,Show on site,Order
2026-01-01 10:00:00,Alpha Connect,A smart student hub,A comprehensive platform for campus connectivity with multidisciplinary access.,https://example.com/alpha.jpg,Feasible using open-source tools,Accelerates cross-department student collaborations,Technical,"React, Node.js, PostgreSQL",₹75000,yes,1
2026-01-02 11:00:00,Beta Venture,Student innovation accelerator,Structured guidance for student initiatives and campus startup teams.,https://drive.google.com/file/d/beta-drive-id/view,High Feasibility with alumni network,Transforms student concepts into viable commercial initiatives,Non-Technical(other),"Design Thinking, Mentorship, Workshops",₹30000,yes,2
2026-01-03 12:00:00,Secret Project,Hidden from public,This hidden project must never be shown on the website.,,Feasible,None,Technical,Python,₹99999,no,3
`

const mockTeamCsv = `Timestamp,Full name,Role,Department,Photo link,LinkedIn URL,GitHub URL,Email,Show on site,Order
2026-01-01 10:00:00,Dr. Alice Smith,Director,Department of Computer Science and Engineering,https://drive.google.com/file/d/alice-id/view,https://linkedin.com/in/alice,https://github.com/alice,alice@psgtech.ac.in,yes,1
2026-01-02 11:00:00,Dr. Bob Jones,Deputy director,Department of Computer Science and Engineering,https://example.com/bob.jpg,https://linkedin.com/in/bob,https://github.com/bob,bob@psgtech.ac.in,yes,2
2026-01-03 12:00:00,Carol White,Program Manager,Department of Computer Science and Engineering,,https://linkedin.com/in/carol,https://github.com/carol,carol@psgtech.ac.in,yes,3
2026-01-04 13:00:00,Dave Brown,Head-Technical,Department of Computer Science and Engineering,,https://linkedin.com/in/dave,https://github.com/dave,dave@psgtech.ac.in,yes,4
2026-01-05 14:00:00,Eve Black,Member-Technical,Technical Wing,,NA,https://github.com/eve,eve@psgtech.ac.in,yes,5
2026-01-06 15:00:00,Frank Green,External Advisor,Department of Computer Science and Engineering,,https://linkedin.com/in/frank,https://github.com/frank,frank@psgtech.ac.in,yes,6
2026-01-07 16:00:00,Grace Hidden,Member-Technical,Technical Wing,,,https://github.com/grace,,no,7
`

test.describe('Google Sheets Data Integration E2E Tests', () => {
  test.setTimeout(60000)

  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      ;(window as unknown as Record<string, string>).__E2E_PROJECTS_SHEET_ID__ = 'test-projects-sheet'
      ;(window as unknown as Record<string, string>).__E2E_TEAM_SHEET_ID__ = 'test-team-sheet'
    })

    // Intercept external dummy image URLs used in fixtures so page load never hangs on external hosts
    await page.route(/https:\/\/(example\.com|drive\.google\.com\/thumbnail)/, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'image/svg+xml',
        body: '<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"/>',
      })
    })

    // Intercept Google Sheet CSV export endpoints
    await page.route('**/gviz/tq*', async (route) => {
      const url = route.request().url()
      if (url.includes('projects') || url.includes('test-projects-sheet') || url.includes('default-projects-sheet')) {
        await route.fulfill({
          status: 200,
          contentType: 'text/csv; charset=utf-8',
          body: mockProjectsCsv,
        })
      } else if (url.includes('team') || url.includes('test-team-sheet') || url.includes('default-team-sheet')) {
        await route.fulfill({
          status: 200,
          contentType: 'text/csv; charset=utf-8',
          body: mockTeamCsv,
        })
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'text/csv; charset=utf-8',
          body: mockProjectsCsv,
        })
      }
    })
  })

  test('hidden rows not shown on projects page, and project details correctly read Description and Feasiblity headers with no cost', async ({
    page,
  }) => {
    await page.goto('/projects')

    // 1. Wait for sheet data to finish loading, then assert hidden rows not shown
    await expect(page.getByRole('link', { name: 'Alpha Connect' })).toBeVisible({ timeout: 20000 })
    await expect(page.getByRole('link', { name: 'Beta Venture' })).toBeVisible()
    await expect(page.getByText('Secret Project')).toHaveCount(0)

    // Navigate to technical project details
    await page.goto('/projects/alpha-connect')
    await expect(page.getByRole('heading', { level: 1, name: 'Alpha Connect' })).toBeVisible({
      timeout: 20000,
    })

    // 2. Cost value never appears and no Cost card exists on project page
    await expect(page.getByText('₹75000')).toHaveCount(0)
    await expect(page.locator('section[aria-labelledby="detail-heading-cost"]')).toHaveCount(0)
    await expect(page.getByText('Cost & Budget')).toHaveCount(0)

    // 3. "Description(3-4 lines)" and "Feasiblity" headers are read
    await expect(
      page.getByText('A comprehensive platform for campus connectivity with multidisciplinary access.'),
    ).toBeVisible()
    await expect(page.getByText('Feasible using open-source tools')).toBeVisible()

    // Facts grid shows "Tech Stack" for technical project
    const factsSection = page.locator('section[aria-labelledby="detail-heading-facts"]')
    await expect(factsSection.getByRole('heading', { name: 'Tech Stack' })).toBeVisible()
  })

  test('Non-Technical(other) row shows as non-technical with Tools & Resources card and no cost', async ({
    page,
  }) => {
    await page.goto('/projects/beta-venture')
    await expect(page.getByRole('heading', { level: 1, name: 'Beta Venture' })).toBeVisible({
      timeout: 20000,
    })

    // 4. "Non-Technical(other)" row shows as non-technical ("Tools & Resources" card)
    const factsSection = page.locator('section[aria-labelledby="detail-heading-facts"]')
    await expect(factsSection.getByRole('heading', { name: 'Tools & Resources' })).toBeVisible()
    await expect(factsSection.getByText('Design Thinking')).toBeVisible()

    // Ensure stale cost value never appears
    await expect(page.getByText('₹30000')).toHaveCount(0)
    await expect(page.locator('section[aria-labelledby="detail-heading-cost"]')).toHaveCount(0)
  })

  test('Director and Deputy director show as landing cards with their role text', async ({ page }) => {
    await page.goto('/')
    const teamSection = page.locator('section#team')
    await teamSection.waitFor()

    // 5. Director and Deputy director show as the landing cards with their role text
    await expect(teamSection.getByRole('heading', { name: 'Dr. Alice Smith' }).first()).toBeVisible({
      timeout: 20000,
    })
    await expect(teamSection.getByText('Director', { exact: true }).first()).toBeVisible()

    await expect(teamSection.getByRole('heading', { name: 'Dr. Bob Jones' }).first()).toBeVisible()
    await expect(teamSection.getByText('Deputy Director', { exact: true }).first()).toBeVisible()
  })

  test('team directory seniority order, Member role, NA links, and folder counts match fixture', async ({
    page,
  }) => {
    await page.goto('/team')

    // 11. Wait for loaded directory folders first, then check counts (Leads: 4, Technical: 1)
    const leadsFolder = page.getByRole('button', { name: /Open Leads folder/i })
    await expect(leadsFolder).toBeVisible({ timeout: 20000 })
    // Leads folder badge should show 4 items
    await expect(leadsFolder.getByText('4')).toBeVisible()

    // 9. Role not in list (Frank Green - External Advisor) is skipped
    await expect(page.getByText('Frank Green')).toHaveCount(0)
    // Hidden row (Grace Hidden) is skipped
    await expect(page.getByText('Grace Hidden')).toHaveCount(0)

    // Open Leads directory
    await leadsFolder.click()

    // 6. Head-Technical (Dave Brown, rank 2) appears in Leads BEFORE Program Manager (Carol White, rank 6)
    await expect(page.getByText('Dave Brown')).toBeVisible()
    await expect(page.getByText('Head – Technical')).toBeVisible()
    await expect(page.getByText('Carol White')).toBeVisible()
    await expect(page.getByText('Program Manager')).toBeVisible()

    const daveIndex = await page.evaluate(() => {
      const allText = document.body.innerText
      return allText.indexOf('Dave Brown')
    })
    const carolIndex = await page.evaluate(() => {
      const allText = document.body.innerText
      return allText.indexOf('Carol White')
    })
    expect(daveIndex).toBeLessThan(carolIndex)

    // Navigate to Members -> Technical
    await page.getByRole('button', { name: 'Team Directory' }).click()
    await page.getByRole('button', { name: /Open Members folder/i }).click()
    const techFolder = page.getByRole('button', { name: /Open Technical folder/i })
    await expect(techFolder.getByText('1')).toBeVisible()
    await techFolder.click()

    // 7. Member-Technical appears under Technical with role "Member"
    await expect(page.getByText('Eve Black')).toBeVisible()
    await expect(page.getByText('Member', { exact: true })).toBeVisible()

    // 8. "NA" LinkedIn shows no LinkedIn icon
    const eveCard = page.getByLabel('Eve Black, Member')
    await expect(eveCard).toBeVisible()
    // LinkedIn profile link should not exist for Eve
    await expect(eveCard.locator('a[aria-label*="LinkedIn profile"]')).toHaveCount(0)
    // GitHub profile link should exist
    await expect(eveCard.locator('a[aria-label*="GitHub profile"]')).toHaveCount(1)
  })
})

test.describe('Google Sheets Loading, Retry, Caching, and Fallback E2E Tests', () => {
  test.setTimeout(60000)

  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      ;(window as unknown as Record<string, string>).__E2E_PROJECTS_SHEET_ID__ = 'test-projects-sheet'
      ;(window as unknown as Record<string, string>).__E2E_TEAM_SHEET_ID__ = 'test-team-sheet'
    })

    await page.route(/https:\/\/(example\.com|drive\.google\.com\/thumbnail)/, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'image/svg+xml',
        body: '<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"/>',
      })
    })
  })

  test('with a delayed response of 3 seconds, no placeholder title appears before the data arrives', async ({
    page,
  }) => {
    const consoleErrors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error' && !msg.text().includes('Failed to load resource')) {
        consoleErrors.push(msg.text())
      }
    })

    await page.route('**/gviz/tq*', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 3000))
      const url = route.request().url()
      const isTeam = url.includes('team')
      await route.fulfill({
        status: 200,
        contentType: 'text/csv; charset=utf-8',
        body: isTeam ? mockTeamCsv : mockProjectsCsv,
      })
    })

    await page.goto('/projects')

    // Check during the 3-second loading window that no static placeholder title ever appears
    for (const waitMs of [200, 900, 1800]) {
      await page.waitForTimeout(waitMs === 200 ? 200 : 700)
      await expect(page.getByText('Campus Connect')).toHaveCount(0)
      await expect(page.getByText('GreenLoop')).toHaveCount(0)
      await expect(page.getByText('SkillForge')).toHaveCount(0)
    }

    // Once the delayed response arrives, the real sheet titles appear
    await expect(page.getByRole('link', { name: 'Alpha Connect' })).toBeVisible({ timeout: 20000 })
    await expect(page.getByRole('link', { name: 'Beta Venture' })).toBeVisible()
    await expect(page.getByText('Campus Connect')).toHaveCount(0)
    expect(consoleErrors).toEqual([])
  })

  test('with a 500 followed by a 200 on retry, the real data shows', async ({ page }) => {
    const consoleErrors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error' && !msg.text().includes('Failed to load resource')) {
        consoleErrors.push(msg.text())
      }
    })

    let projectAttempts = 0
    await page.route('**/gviz/tq*', async (route) => {
      const url = route.request().url()
      if (url.includes('projects')) {
        projectAttempts += 1
        if (projectAttempts === 1) {
          await route.fulfill({
            status: 500,
            contentType: 'text/plain',
            body: 'Internal Server Error',
          })
          return
        }
        await route.fulfill({
          status: 200,
          contentType: 'text/csv; charset=utf-8',
          body: mockProjectsCsv,
        })
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'text/csv; charset=utf-8',
          body: mockTeamCsv,
        })
      }
    })

    await page.goto('/projects')

    await expect(page.getByRole('link', { name: 'Alpha Connect' })).toBeVisible({ timeout: 20000 })
    await expect(page.getByRole('link', { name: 'Beta Venture' })).toBeVisible()
    await expect(page.getByText('Campus Connect')).toHaveCount(0)
    expect(projectAttempts).toBe(2)
    expect(consoleErrors).toEqual([])
  })

  test('with a 500 twice, the fallback shows and there are no console errors', async ({ page }) => {
    const consoleErrors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error' && !msg.text().includes('Failed to load resource')) {
        consoleErrors.push(msg.text())
      }
    })

    let projectAttempts = 0
    let teamAttempts = 0

    await page.route('**/gviz/tq*', async (route) => {
      const url = route.request().url()
      if (url.includes('projects')) projectAttempts += 1
      if (url.includes('team')) teamAttempts += 1
      await route.fulfill({
        status: 500,
        contentType: 'text/plain',
        body: 'Internal Server Error',
      })
    })

    await page.goto('/projects')

    // Static fallback projects render only after initial attempt + retry both fail
    await expect(page.getByRole('link', { name: 'Campus Connect' })).toBeVisible({ timeout: 20000 })
    await expect(page.getByRole('link', { name: 'GreenLoop' })).toBeVisible()
    expect(projectAttempts).toBe(2)

    teamAttempts = 0
    await page.goto('/team')
    await expect(page.getByText('Team Directory')).toBeVisible({ timeout: 20000 })
    expect(teamAttempts).toBe(2)

    expect(consoleErrors).toEqual([])
  })

  test('after real data loads, a later failure keeps the real data', async ({ page }) => {
    const consoleErrors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error' && !msg.text().includes('Failed to load resource')) {
        consoleErrors.push(msg.text())
      }
    })

    let shouldFail = false
    let failedAttempts = 0

    await page.route('**/gviz/tq*', async (route) => {
      if (shouldFail) {
        failedAttempts += 1
        await route.fulfill({
          status: 500,
          contentType: 'text/plain',
          body: 'Internal Server Error',
        })
        return
      }
      const url = route.request().url()
      const isTeam = url.includes('team')
      await route.fulfill({
        status: 200,
        contentType: 'text/csv; charset=utf-8',
        body: isTeam ? mockTeamCsv : mockProjectsCsv,
      })
    })

    await page.goto('/projects')
    await expect(page.getByRole('link', { name: 'Alpha Connect' })).toBeVisible({ timeout: 20000 })
    await expect(page.getByRole('link', { name: 'Beta Venture' })).toBeVisible()

    // Navigate to detail page (renders immediately from module-level cache without new request)
    await page.getByRole('link', { name: 'Alpha Connect' }).first().click()
    await expect(page.getByRole('heading', { level: 1, name: 'Alpha Connect' })).toBeVisible({
      timeout: 20000,
    })

    // Return to /projects via SPA link (still instant from module-level cache)
    await page.getByRole('link', { name: /Back to Projects/i }).click()
    await expect(page.getByRole('link', { name: 'Alpha Connect' })).toBeVisible({ timeout: 20000 })

    // Now force subsequent sheet requests in the same session to fail with 500
    shouldFail = true

    // Reloading /projects in the same session triggers a new sheet request that fails twice with 500,
    // and useSheetData keeps the last good data instead of switching back to fallback
    await page.reload()
    await expect(page.getByRole('link', { name: 'Alpha Connect' })).toBeVisible({ timeout: 20000 })
    await expect(page.getByRole('link', { name: 'Beta Venture' })).toBeVisible()
    await expect(page.getByText('Campus Connect')).toHaveCount(0)
    expect(failedAttempts).toBe(2)

    expect(consoleErrors).toEqual([])
  })

  test('empty sheet (zero visible rows) shows the empty state, not the fallback', async ({ page }) => {
    const consoleErrors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error' && !msg.text().includes('Failed to load resource')) {
        consoleErrors.push(msg.text())
      }
    })

    const emptyProjectsCsv = `Timestamp,Project title,One-line summary,Description(3-4 lines),Cover image link,Feasiblity,What Changes,Project type,Tech stack or approach(write in commas),Cost,Show on site,Order
2026-01-03 12:00:00,Secret Project,Hidden from public,This hidden project must never be shown on the website.,,Feasible,None,Technical,Python,₹99999,no,1
`
    const emptyTeamCsv = `Timestamp,Full name,Role,Department,Photo link,LinkedIn URL,GitHub URL,Email,Show on site,Order
2026-01-07 16:00:00,Grace Hidden,Member-Technical,Technical Wing,,,https://github.com/grace,,no,1
`

    await page.route('**/gviz/tq*', async (route) => {
      const url = route.request().url()
      const isTeam = url.includes('team')
      await route.fulfill({
        status: 200,
        contentType: 'text/csv; charset=utf-8',
        body: isTeam ? emptyTeamCsv : emptyProjectsCsv,
      })
    })

    await page.goto('/projects')
    await expect(page.getByTestId('projects-empty-state')).toBeVisible({ timeout: 20000 })
    await expect(page.getByText('Campus Connect')).toHaveCount(0)

    await page.goto('/team')
    await expect(page.getByTestId('team-empty-state')).toBeVisible({ timeout: 20000 })
    expect(consoleErrors).toEqual([])
  })
})


import { expect, test } from '@playwright/test'

test.describe('Scroll restoration and initial scroll position', () => {
  test.setTimeout(60000)

  test.beforeEach(async ({ page }) => {
    await page.route('**/api/projects', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ projects: [] }),
      })
    })
    await page.route('**/api/members', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ members: [] }),
      })
    })
  })

  test('scroll starts at 0, survives reload from 3000px, lands on #about, and resets on navigation', async ({
    page,
  }) => {
    const consoleErrors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const text = msg.text()
        if (!text.includes('favicon.ico')) {
          consoleErrors.push(text)
        }
      }
    })

    // 1. After full page load on /, window.scrollY is 0 at 500 ms and at 2 seconds
    await page.goto('/')
    await page.waitForTimeout(500)
    const scrollAt500 = await page.evaluate(() => window.scrollY)
    expect(scrollAt500).toBe(0)

    await page.waitForTimeout(1500)
    const scrollAt2000 = await page.evaluate(() => window.scrollY)
    expect(scrollAt2000).toBe(0)

    // 2. After scrolling to 3000 px and reloading, scrollY is still 0
    await page.evaluate(() => window.scrollTo(0, 3000))
    await page.waitForTimeout(200)
    await page.reload()
    await page.waitForTimeout(500)
    const scrollAfterReload = await page.evaluate(() => window.scrollY)
    expect(scrollAfterReload).toBe(0)

    // 3. /#about lands on the about section
    await page.goto('/#about')
    await page.waitForTimeout(1200)
    const scrollAtAbout = await page.evaluate(() => window.scrollY)
    expect(scrollAtAbout).toBeGreaterThan(0)
    const aboutBox = await page.locator('#about').boundingBox()
    expect(aboutBox).not.toBeNull()
    if (aboutBox) {
      const vpHeight = page.viewportSize()?.height ?? 720
      expect(aboutBox.y).toBeLessThanOrEqual(vpHeight)
    }

    // 4. Navigating from /projects to / starts at the top
    await page.goto('/projects')
    await page.waitForTimeout(500)
    await page.evaluate(() => window.scrollTo(0, 1500))
    await page.waitForTimeout(200)

    const menuToggle = page.locator('.sm-toggle')
    if (await menuToggle.isVisible()) {
      await menuToggle.click()
      await page.waitForTimeout(400)
      const homeLink = page.locator('.sm-panel-item[href="/"]').first()
      if (await homeLink.isVisible()) {
        await homeLink.click()
      } else {
        await page.goto('/')
      }
    } else {
      await page.goto('/')
    }

    await page.waitForTimeout(500)
    const scrollAtHome = await page.evaluate(() => window.scrollY)
    expect(scrollAtHome).toBe(0)

    // 5. No console errors
    expect(consoleErrors).toEqual([])
  })
})

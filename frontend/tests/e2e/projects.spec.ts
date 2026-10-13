import { expect, test } from '@playwright/test'
import * as path from 'path'
import * as fs from 'fs'

test.describe('Our Projects Section - Prism Carousel', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.getByRole('heading', { level: 1 }).waitFor()
    await page.locator('section#projects:not([aria-busy="true"])').waitFor({ timeout: 10000 })
  })

  test('h2 "Our Projects" exists', async ({ page }) => {
    const heading = page.locator('h2#projects-heading')
    await expect(heading).toBeVisible()
    await expect(heading).toHaveText(/Our\s+Projects/)
  })

  test('3 sr-only links to /projects/:slug exist', async ({ page }) => {
    const links = page.locator('section#projects ul.sr-only a')
    await expect(links).toHaveCount(3)
    for (let i = 0; i < 3; i++) {
      const href = await links.nth(i).getAttribute('href')
      expect(href).toMatch(/\/projects\/.+/)
    }
  })

  test('landing page shows the Prism carousel with "Click to view" text on visible slide', async ({ page }) => {
    const section = page.locator('section#projects')
    await section.scrollIntoViewIfNeeded()

    const prismCarousel = section.locator('[role="region"][aria-roledescription="carousel"]')
    await expect(prismCarousel).toBeVisible()
    await expect(prismCarousel.locator('canvas')).toBeVisible()

    const clickToView = section.getByText('Click to view')
    await expect(clickToView).toBeVisible()
  })

  test('clicking "Click to view" goes to /projects/:slug without a full reload', async ({ page }) => {
    const section = page.locator('section#projects')
    await section.scrollIntoViewIfNeeded()

    // Mark window to detect full reload
    await page.evaluate(() => {
      ;(window as unknown as { __clientNavMarker: boolean }).__clientNavMarker = true
    })

    const slideLink = section.locator('a[aria-label]').filter({ hasText: 'Click to view' })
    await expect(slideLink).toBeVisible()

    const targetHref = await slideLink.getAttribute('href')
    expect(targetHref).toMatch(/\/projects\/.+/)

    await slideLink.click()
    await page.waitForURL(/\/projects\/.+/, { timeout: 5000 })

    const stillMarked = await page.evaluate(
      () => (window as unknown as { __clientNavMarker: boolean }).__clientNavMarker === true,
    )
    expect(stillMarked).toBe(true)
    expect(page.url()).toContain(targetHref)
  })

  test('dragging does not navigate', async ({ page }) => {
    const section = page.locator('section#projects')
    await section.scrollIntoViewIfNeeded()

    const slideLink = section.locator('a[aria-label]').filter({ hasText: 'Click to view' })
    await expect(slideLink).toBeVisible()
    const box = await slideLink.boundingBox()
    expect(box).toBeTruthy()

    if (box) {
      const startX = box.x + box.width / 2
      const startY = box.y + box.height / 2

      // Perform a drag gesture across the slide
      await page.mouse.move(startX, startY)
      await page.mouse.down()
      await page.mouse.move(startX - 80, startY, { steps: 8 })
      await page.mouse.up()

      // Short wait to ensure no delayed navigation occurred
      await page.waitForTimeout(600)
      expect(page.url()).not.toMatch(/\/projects\/.+/)
    }
  })

  test('keyboard can reach the link and Enter opens it', async ({ page }) => {
    const section = page.locator('section#projects')
    await section.scrollIntoViewIfNeeded()

    // Mark window to check client-side navigation
    await page.evaluate(() => {
      ;(window as unknown as { __clientNavMarker: boolean }).__clientNavMarker = true
    })

    const slideLink = section.locator('a[aria-label]').filter({ hasText: 'Click to view' })
    await expect(slideLink).toBeVisible()
    const targetHref = await slideLink.getAttribute('href')

    await slideLink.focus()
    await expect(slideLink).toBeFocused()

    await page.keyboard.press('Enter')
    await page.waitForURL(/\/projects\/.+/, { timeout: 5000 })

    const stillMarked = await page.evaluate(
      () => (window as unknown as { __clientNavMarker: boolean }).__clientNavMarker === true,
    )
    expect(stillMarked).toBe(true)
    expect(page.url()).toContain(targetHref)
  })

  test('"View All Projects" goes to /projects', async ({ page }) => {
    const button = page.locator('section#projects').getByRole('link', { name: 'View All Projects' })
    await expect(button).toBeVisible()
    await button.click()
    await page.waitForURL(/\/projects$/, { timeout: 5000 })
    expect(page.url()).toMatch(/\/projects$/)
  })

  const viewports = [
    { width: 375, height: 667, name: '375x667' },
    { width: 1280, height: 720, name: '1280x720' },
  ]

  for (const vp of viewports) {
    test(`no horizontal overflow at ${vp.width}px`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height })
      await page.emulateMedia({ reducedMotion: 'reduce' })
      await page.goto('/')
      await page.getByRole('heading', { level: 1 }).waitFor()
      await page.locator('section#projects:not([aria-busy="true"])').waitFor({ timeout: 10000 })

      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth)
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1)
    })
  }

  test('no console errors on page load', async ({ page }) => {
    const errors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text())
    })
    await page.goto('/')
    await page.getByRole('heading', { level: 1 }).waitFor()
    await page.waitForTimeout(500)
    expect(errors).toEqual([])
  })
})

test.describe('Projects Screenshots', () => {
  const screenshotViewports = [
    { name: '1280x720', width: 1280, height: 720 },
    { name: '375x667', width: 375, height: 667 },
  ]

  for (const vp of screenshotViewports) {
    test(`projects screenshot at ${vp.name}`, async ({ page }, testInfo) => {
      const targetProject = vp.width >= 1024 ? 'desktop' : 'mobile'
      if (testInfo.project.name !== targetProject) {
        test.skip()
        return
      }

      await page.setViewportSize({ width: vp.width, height: vp.height })
      await page.emulateMedia({ reducedMotion: 'reduce' })
      await page.goto('/')
      await page.getByRole('heading', { level: 1 }).waitFor()

      const section = page.locator('section#projects')
      await section.scrollIntoViewIfNeeded()
      await page.waitForTimeout(600)

      const screenshotsDir = path.resolve('tests/screenshots')
      if (!fs.existsSync(screenshotsDir)) {
        fs.mkdirSync(screenshotsDir, { recursive: true })
      }

      await section.screenshot({
        path: path.join(screenshotsDir, `projects-${vp.name}.png`),
      })
    })
  }
})

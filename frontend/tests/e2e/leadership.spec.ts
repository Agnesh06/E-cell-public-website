import { expect, test } from '@playwright/test'
import * as path from 'path'
import * as fs from 'fs'

test.describe('Leadership Section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.getByRole('heading', { level: 1 }).waitFor()
  })

  test('h2 "Meet Our Team" exists', async ({ page }) => {
    const heading = page.locator('h2#team-heading')
    await expect(heading).toBeVisible()
    await expect(heading).toHaveText(/Meet Our\s+Team/)
  })

  test('exactly two cards with h3 names present', async ({ page }) => {
    const section = page.locator('section#team')
    await section.scrollIntoViewIfNeeded()

    const names = section.locator('h3')
    await expect(names).toHaveCount(2)
    for (let i = 0; i < 2; i++) {
      await expect(names.nth(i)).toBeVisible()
    }
  })

  test('"View Full Team" link has href /team', async ({ page }) => {
    const link = page.locator('section#team').getByRole('link', { name: 'View Full Team' })
    await expect(link).toBeVisible()
    await expect(link).toHaveAttribute('href', '/team')
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

test.describe('Leadership Screenshots', () => {
  test('leadership screenshot at 1280x720', async ({ page }, testInfo) => {
    if (testInfo.project.name !== 'desktop') {
      test.skip()
      return
    }

    await page.setViewportSize({ width: 1280, height: 720 })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    await page.getByRole('heading', { level: 1 }).waitFor()

    const section = page.locator('section#team')
    await section.scrollIntoViewIfNeeded()
    await page.waitForTimeout(600)

    const screenshotsDir = path.resolve('tests/screenshots')
    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir, { recursive: true })
    }

    await section.screenshot({
      path: path.join(screenshotsDir, 'leadership-1280x720.png'),
    })
  })
})


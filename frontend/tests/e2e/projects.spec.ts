import { expect, test } from '@playwright/test'
import * as path from 'path'
import * as fs from 'fs'

test.describe('Our Projects Section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.getByRole('heading', { level: 1 }).waitFor()
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

  test('clicking the carousel centre (front card) navigates to a /projects/ URL', async ({ page }) => {
    const section = page.locator('section#projects')
    await section.scrollIntoViewIfNeeded()
    await page.waitForTimeout(500)

    // Find the carousel region / stage bounding box and click centre
    const carousel = section.locator('[role="region"][aria-label="Image carousel"]')
    await expect(carousel).toBeVisible()
    const box = await carousel.boundingBox()
    expect(box).toBeTruthy()

    if (box) {
      // Click at the centre of the carousel box where the front card resides
      await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2)
      await page.waitForURL(/\/projects\/.+/, { timeout: 5000 })
      expect(page.url()).toMatch(/\/projects\/.+/)
    }
  })

  test('"View All Projects" button goes to /projects', async ({ page }) => {
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
  test('carousel rotates continuously with drift', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('heading', { level: 1 }).waitFor()

    const section = page.locator('section#projects')
    await section.scrollIntoViewIfNeeded()
    await page.waitForTimeout(1000)

    await page.mouse.move(0, 0)

    const ring = page.locator('section#projects .h-0.w-0.relative > .h-0.w-0.absolute').first()
    
    // Fallback to get style directly
    const getTransform = () => ring.evaluate(el => el.style.transform)

    const transform0 = await getTransform()
    await page.waitForTimeout(3000)
    const transform3 = await getTransform()
    await page.waitForTimeout(3000)
    const transform6 = await getTransform()

    expect(transform0).not.toBe(transform3)
    expect(transform3).not.toBe(transform6)
  })

  test('carousel stays still with reducedMotion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    await page.getByRole('heading', { level: 1 }).waitFor()

    const section = page.locator('section#projects')
    await section.scrollIntoViewIfNeeded()
    await page.waitForTimeout(1000)

    const ring = page.locator('section#projects .h-0.w-0.relative > .h-0.w-0.absolute').first()
    const getTransform = () => ring.evaluate(el => el.style.transform)
    
    const transform0 = await getTransform()
    await page.waitForTimeout(3000)
    const transform3 = await getTransform()

    expect(transform0).toBe(transform3)
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

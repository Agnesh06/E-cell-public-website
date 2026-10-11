import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import * as path from 'path'
import * as fs from 'fs'

const brainDir = 'C:/Users/USER/.gemini/antigravity/brain/2ffd419f-78e2-4334-8aba-ee45d3872e3a'
const screenshotsDir = path.resolve('tests/screenshots')

function saveScreenshot(filename: string, buffer: Buffer) {
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true })
  }
  fs.writeFileSync(path.join(screenshotsDir, filename), buffer)

  if (fs.existsSync(brainDir)) {
    fs.writeFileSync(path.join(brainDir, filename), buffer)
  }
}

test.describe('Projects Page E2E Tests', () => {
  test('h1 "Our Projects" exists and is visible', async ({ page }) => {
    await page.goto('/projects')
    const h1 = page.getByRole('heading', { level: 1 })
    await h1.waitFor()
    await expect(h1).toBeVisible()
    await expect(h1).toHaveText(/Our\s+Projects/)
  })

  test('the scroll hint text is visible', async ({ page }) => {
    await page.goto('/projects')
    await page.getByRole('heading', { level: 1 }).waitFor()
    const hint = page.getByText('SCROLL TO VIEW PROJECTS')
    await expect(hint).toBeVisible()
  })

  test('at 1280x720 the sidebar lists all 8 titles and the stack has 8 cards', async ({ page }, testInfo) => {
    if (testInfo.project.name !== 'desktop') {
      test.skip()
      return
    }

    await page.setViewportSize({ width: 1280, height: 720 })
    await page.goto('/projects')
    await page.getByRole('heading', { level: 1 }).waitFor()

    const sidebar = page.locator('nav[aria-label="Project index"]')
    await expect(sidebar).toBeVisible()

    const sidebarButtons = sidebar.locator('button')
    await expect(sidebarButtons).toHaveCount(8)

    const cards = page.locator('[data-stack-slot]')
    await expect(cards).toHaveCount(8)
  })

  test('scrolling to pin_3 pins card 4, earlier cards have a non-empty transform, and sidebar item has aria-current', async ({
    page,
  }, testInfo) => {
    if (testInfo.project.name !== 'desktop') {
      test.skip()
      return
    }

    await page.setViewportSize({ width: 1280, height: 720 })
    await page.goto('/projects')
    await page.getByRole('heading', { level: 1 }).waitFor()
    await page.waitForTimeout(600)

    const pin3 = await page.evaluate(() => {
      const slots = Array.from(document.querySelectorAll<HTMLElement>('[data-stack-slot]'))
      const slot3 = slots[3]
      if (!slot3) return 0
      const inner = slot3.parentElement!
      const innerDocTop = inner.getBoundingClientRect().top + window.scrollY
      const naturalTop3 = innerDocTop + slot3.offsetTop
      return naturalTop3 - (140 + 3 * 20)
    })

    await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), pin3)
    await page.waitForTimeout(600)

    // Card 4 (index 3) is pinned at 140 + 3 * 20 = 200px within 6px
    const slot3 = page.locator('[data-stack-slot]').nth(3)
    const rect3Top = await slot3.evaluate((el) => el.getBoundingClientRect().top)
    expect(Math.abs(rect3Top - 200)).toBeLessThanOrEqual(6)

    // Earlier cards have a non-empty transform
    for (let i = 0; i < 3; i++) {
      const card = page.locator('[data-stack-slot]').nth(i).locator('> div')
      const transform = await card.evaluate((el) => el.style.transform)
      expect(transform).toBeTruthy()
      expect(transform.length).toBeGreaterThan(0)
    }

    // Sidebar item for the active card has aria-current
    const activeSidebarBtn = page.locator('nav[aria-label="Project index"] button').nth(3)
    await expect(activeSidebarBtn).toHaveAttribute('aria-current', 'true')
  })

  test('clicking item 6 pins card 6 within 6px and updates aria-current', async ({ page }, testInfo) => {
    if (testInfo.project.name !== 'desktop') {
      test.skip()
      return
    }

    await page.setViewportSize({ width: 1280, height: 720 })
    await page.goto('/projects')
    await page.getByRole('heading', { level: 1 }).waitFor()
    await page.waitForTimeout(600)

    // Click item 6 (0-indexed 5)
    const item6 = page.locator('nav[aria-label="Project index"] button').nth(5)
    await item6.click()
    await page.waitForTimeout(1600)

    // Card 6 is pinned at 140 + 5 * 20 = 240px within 6px
    const expectedTop6 = 140 + 5 * 20
    const slot5 = page.locator('[data-stack-slot]').nth(5)
    const rect5Top = await slot5.evaluate((el) => el.getBoundingClientRect().top)
    expect(Math.abs(rect5Top - expectedTop6)).toBeLessThanOrEqual(6)

    await expect(item6).toHaveAttribute('aria-current', 'true')
  })

  test('Tab reaches the sidebar buttons and Enter scrolls', async ({ page }, testInfo) => {
    if (testInfo.project.name !== 'desktop') {
      test.skip()
      return
    }

    await page.setViewportSize({ width: 1280, height: 720 })
    await page.goto('/projects')
    await page.getByRole('heading', { level: 1 }).waitFor()
    await page.evaluate(() => window.scrollTo(0, 0))
    await page.waitForTimeout(400)

    const firstBtn = page.locator('nav[aria-label="Project index"] button').first()
    await firstBtn.focus()
    await expect(firstBtn).toBeFocused()

    await page.keyboard.press('Tab')
    const secondBtn = page.locator('nav[aria-label="Project index"] button').nth(1)
    await expect(secondBtn).toBeFocused()

    const scrollBefore = await page.evaluate(() => window.scrollY)
    await page.keyboard.press('Enter')
    await page.waitForTimeout(1600)

    const scrollAfter = await page.evaluate(() => window.scrollY)
    expect(scrollAfter).toBeGreaterThan(scrollBefore)
  })

  test('clicking a card title goes to /projects/:slug', async ({ page }) => {
    await page.goto('/projects')
    await page.getByRole('heading', { level: 1 }).waitFor()

    const firstCardTitle = page.locator('[data-stack-slot]').first().locator('h2 a')
    await expect(firstCardTitle).toBeVisible()
    await firstCardTitle.click()

    await page.waitForURL(/\/projects\/[a-z0-9-]+/)
    expect(page.url()).toMatch(/\/projects\/[a-z0-9-]+/)
  })

  test('"Contact Us" goes to /contact', async ({ page }) => {
    await page.goto('/projects')
    await page.getByRole('heading', { level: 1 }).waitFor()

    const contactButton = page.locator('section').filter({ hasText: 'Have a project in mind?' }).getByRole('link', { name: 'Contact Us' })
    await expect(contactButton).toBeVisible()
    await contactButton.click()

    await page.waitForURL(/\/contact/)
    expect(page.url()).toMatch(/\/contact/)
  })

  test('landing "View All Projects" lands on /projects', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('heading', { level: 1 }).waitFor()

    const viewAllBtn = page.getByRole('link', { name: 'View All Projects' })
    await viewAllBtn.scrollIntoViewIfNeeded()
    await viewAllBtn.click()
    await page.waitForURL(/\/projects$/, { timeout: 10000 })
    expect(page.url()).toMatch(/\/projects$/)
  })

  test('Menu > Projects lands on /projects', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('heading', { level: 1 }).waitFor()

    const menuToggle = page.locator('button.sm-toggle')
    await menuToggle.click()
    await page.waitForTimeout(1000)

    const projectsMenuLink = page.locator('.staggered-menu-panel a').filter({ hasText: 'Projects' })
    await projectsMenuLink.click()
    await page.waitForURL(/\/projects$/, { timeout: 10000 })
    expect(page.url()).toMatch(/\/projects$/)
  })

  for (const width of [375, 768]) {
    test(`at ${width}px the sidebar is hidden and cards still stack`, async ({ page }) => {
      await page.setViewportSize({ width, height: 667 })
      await page.goto('/projects')
      await page.getByRole('heading', { level: 1 }).waitFor()

      const sidebar = page.locator('nav[aria-label="Project index"]')
      await expect(sidebar).toBeHidden()

      const slots = page.locator('[data-stack-slot]')
      await expect(slots).toHaveCount(8)
      for (let i = 0; i < 8; i++) {
        await expect(slots.nth(i)).toHaveClass(/sticky/)
      }
    })
  }

  const overflowWidths = [320, 375, 768, 1024, 1280, 1920]
  for (const width of overflowWidths) {
    test(`no horizontal overflow at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 })
      await page.goto('/projects')
      await page.getByRole('heading', { level: 1 }).waitFor()
      await page.waitForTimeout(300)

      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth)
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1)
    })
  }

  test('reducedMotion: cards have no scale transform', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/projects')
    await page.getByRole('heading', { level: 1 }).waitFor()

    await page.evaluate(() => window.scrollTo(0, 1800))
    await page.waitForTimeout(400)

    const slots = page.locator('[data-stack-slot]')
    const count = await slots.count()
    for (let i = 0; i < count; i++) {
      const card = slots.nth(i).locator('> div')
      const transform = await card.evaluate((el) => el.style.transform)
      if (transform) {
        expect(transform).not.toMatch(/scale\((?!1(?:\.0+)?\))/)
      }
    }
  })

  test('axe passes on /projects', async ({ page }) => {
    await page.goto('/projects')
    await page.getByRole('heading', { level: 1 }).waitFor()
    const results = await new AxeBuilder({ page }).analyze()
    expect(results.violations).toEqual([])
  })

  test('no console errors on /projects', async ({ page }) => {
    const errors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text())
    })
    page.on('pageerror', (err) => {
      errors.push(err.message)
    })

    await page.goto('/projects')
    await page.getByRole('heading', { level: 1 }).waitFor()
    await page.waitForTimeout(500)
    expect(errors).toEqual([])
  })
})

test.describe('Projects Page Screenshots', () => {
  test('capture 4 cropped screenshots', async ({ page }, testInfo) => {
    if (testInfo.project.name !== 'desktop') {
      test.skip()
      return
    }

    // 1. Page top with hint at 1280x720
    await page.setViewportSize({ width: 1280, height: 720 })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/projects')
    await page.getByRole('heading', { level: 1 }).waitFor()
    await page.evaluate(() => window.scrollTo(0, 0))
    await page.waitForTimeout(400)

    const headerBlock = page.locator('.projects-page-header')
    const headerBox = await headerBlock.boundingBox()
    if (headerBox) {
      const topBuffer = await page.screenshot({
        clip: {
          x: 0,
          y: 0,
          width: 1280,
          height: Math.min(Math.round(headerBox.y + headerBox.height + 40), 720),
        },
      })
      saveScreenshot('projects-top-hint-1280x720.png', topBuffer)
    }

    // 2. Mid-stack with sidebar active item at 1280x720
    // Scroll to item 4 (index 3)
    const pin3 = await page.evaluate(() => {
      const slots = Array.from(document.querySelectorAll<HTMLElement>('[data-stack-slot]'))
      const slot3 = slots[3]
      if (!slot3) return 0
      const inner = slot3.parentElement!
      const innerDocTop = inner.getBoundingClientRect().top + window.scrollY
      const naturalTop3 = innerDocTop + slot3.offsetTop
      return naturalTop3 - (140 + 3 * 20)
    })
    await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), pin3)
    await page.waitForTimeout(500)
    const midDesktopBuffer = await page.screenshot()
    saveScreenshot('projects-midstack-sidebar-1280x720.png', midDesktopBuffer)

    // 3. Closing block with the button at 1280x720
    const closingSection = page.locator('section').filter({ hasText: 'Have a project in mind?' })
    await closingSection.scrollIntoViewIfNeeded()
    await page.waitForTimeout(400)
    const closingBox = await closingSection.boundingBox()
    if (closingBox) {
      const closingBuffer = await page.screenshot({
        clip: {
          x: 0,
          y: Math.max(0, Math.round(closingBox.y - 20)),
          width: 1280,
          height: Math.min(Math.round(closingBox.height + 40), 720 - Math.max(0, Math.round(closingBox.y - 20))),
        },
      })
      saveScreenshot('projects-closing-block-1280x720.png', closingBuffer)
    }

    // 4. Mid-stack at 375x667
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/projects')
    await page.getByRole('heading', { level: 1 }).waitFor()
    const pin3Mobile = await page.evaluate(() => {
      const slots = Array.from(document.querySelectorAll<HTMLElement>('[data-stack-slot]'))
      const slot3 = slots[3]
      if (!slot3) return 0
      const inner = slot3.parentElement!
      const innerDocTop = inner.getBoundingClientRect().top + window.scrollY
      const naturalTop3 = innerDocTop + slot3.offsetTop
      return naturalTop3 - (104 + 3 * 20)
    })
    await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), pin3Mobile)
    await page.waitForTimeout(500)
    const mobileBuffer = await page.screenshot()
    saveScreenshot('projects-midstack-375x667.png', mobileBuffer)
  })
})


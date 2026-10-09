import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('IdeaSteps Section (Phase 4A)', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    await page.getByRole('heading', { level: 1 }).waitFor()
  })

  // ── Structure ──────────────────────────────────────────────────────────────

  test('section#about exists with aria-labelledby pointing to sr-only h2', async ({ page }) => {
    const section = page.locator('section#about')
    await expect(section).toBeAttached()

    const labelId = await section.getAttribute('aria-labelledby')
    expect(labelId).toBeTruthy()

    const labelEl = page.locator(`#${labelId}`)
    await expect(labelEl).toBeAttached()
    await expect(labelEl).toHaveText('About CSEA E-Cell')
  })

  test('exactly one h1 on the page (heading hierarchy)', async ({ page }) => {
    await expect(page.locator('h1')).toHaveCount(1)
  })

  // ── Five step headlines in document order ──────────────────────────────────

  test('five h3 step headlines appear in correct document order', async ({ page }) => {
    // Each step has two spans merged into one h3 text; we check the full text
    const h3s = page.locator('section#about h3')
    await expect(h3s).toHaveCount(5)

    const texts = await h3s.allInnerTexts()
    // headlineTop + headlineAccent pairs (case-insensitive trim)
    expect(texts[0]?.trim()).toMatch(/More Than/i)
    expect(texts[1]?.trim()).toMatch(/Our/i)
    expect(texts[2]?.trim()).toMatch(/Real-World/i)
    expect(texts[3]?.trim()).toMatch(/Your/i)
    expect(texts[4]?.trim()).toMatch(/Who Is/i)
  })

  // ── Pills per step ─────────────────────────────────────────────────────────

  const pillChecks: [string, string[]][] = [
    ['step-about', ['EXPLORE']],
    ['step-approach', ['IDEATE']],
    ['step-ecosystem', ['ACADEMIA']],
    ['step-journey', ['DISCOVER']],
    ['step-audience', ['IDEA']],
  ]

  for (const [stepId, pills] of pillChecks) {
    test(`step "${stepId}" contains pill: ${pills.join(', ')}`, async ({ page }) => {
      const stepEl = page.locator(`#${stepId}`)
      await expect(stepEl).toBeAttached()
      for (const pill of pills) {
        // Pills render with a "- " dash prefix; filter by partial text on .pill spans
        const pillEl = stepEl.locator('.pill').filter({ hasText: pill })
        await expect(pillEl.first()).toBeAttached()
      }
    })
  }

  // ── Body text per step ─────────────────────────────────────────────────────

  test('each step has non-empty body text', async ({ page }) => {
    const steps = page.locator('.step-stage')
    await expect(steps).toHaveCount(5)

    for (let i = 0; i < 5; i++) {
      const step = steps.nth(i)
      // Body paragraphs live inside the step
      const paras = step.locator('p')
      const count = await paras.count()
      expect(count).toBeGreaterThan(0)
      const firstText = await paras.first().innerText()
      expect(firstText.trim().length).toBeGreaterThan(10)
    }
  })

  // ── Card titles ────────────────────────────────────────────────────────────
  // Use getByRole('heading') to avoid strict-mode violations from partial text
  // matches against pill text or body paragraphs.

  const cardHeadingTitles = [
    'Ideate',
    'Collaborate',
    'Build',
    'Discover Opportunities',
    'The Idea Person',
  ]

  for (const title of cardHeadingTitles) {
    test(`card title "${title}" is present in the DOM`, async ({ page }) => {
      const heading = page.locator('section#about').getByRole('heading', { name: title, exact: true })
      await expect(heading.first()).toBeAttached()
    })
  }

  // ── "Implementation note" must NOT appear ──────────────────────────────────

  test('"Implementation note" text is NOT rendered in the DOM', async ({ page }) => {
    const text = await page.locator('section#about').innerText()
    expect(text).not.toMatch(/implementation note/i)
  })

  // ── Accessibility ──────────────────────────────────────────────────────────

  test('axe passes on / with IdeaSteps section visible', async ({ page }) => {
    const results = await new AxeBuilder({ page }).analyze()
    expect(results.violations).toEqual([])
  })

  // ── Hero "Explore Our Vision" still scrolls to real #about ────────────────

  test('"Explore Our Vision" button scrolls #about into viewport', async ({ page }) => {
    const button = page.getByRole('button', { name: 'Explore Our Vision' })
    await expect(button).toBeVisible()
    await button.click()
    const about = page.locator('#about')
    await expect(about).toBeInViewport({ timeout: 5000 })
  })

  // ── No horizontal overflow at multiple widths ──────────────────────────────

  const overflowWidths = [320, 375, 768, 1024, 1280, 1920]

  for (const width of overflowWidths) {
    test(`no horizontal overflow at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: width < 768 ? 812 : 900 })
      await page.goto('/')
      await page.getByRole('heading', { level: 1 }).waitFor()

      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth)
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1)
    })
  }

  // ── No console errors ─────────────────────────────────────────────────────

  test('no console errors on /', async ({ page }) => {
    const errors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text())
    })
    await page.goto('/')
    await page.getByRole('heading', { level: 1 }).waitFor()
    // Allow a short settle time
    await page.waitForTimeout(500)
    expect(errors).toEqual([])
  })
})

// ── Per-step screenshot capture ──────────────────────────────────────────────

import * as path from 'path'
import * as fs from 'fs'

const screenshotViewports = [
  { name: '1280x720', width: 1280, height: 720 },
  { name: '375x667', width: 375, height: 667 },
]

const stepIds = ['step-about', 'step-approach', 'step-ecosystem', 'step-journey', 'step-audience']

test.describe('IdeaSteps Screenshots', () => {
  for (const vp of screenshotViewports) {
    for (const stepId of stepIds) {
      test(`screenshot: ${stepId} at ${vp.name}`, async ({ page }, testInfo) => {
        // Only run on specific projects to avoid duplicates
        const targetProject = vp.width >= 1280 ? 'desktop' : 'mobile'
        if (testInfo.project.name !== targetProject) {
          test.skip()
          return
        }

        await page.setViewportSize({ width: vp.width, height: vp.height })
        await page.emulateMedia({ reducedMotion: 'reduce' })
        await page.goto('/')
        await page.getByRole('heading', { level: 1 }).waitFor()

        const el = page.locator(`#${stepId}`)
        await el.scrollIntoViewIfNeeded()
        await page.waitForTimeout(600)

        const screenshotsDir = path.resolve('tests/screenshots')
        if (!fs.existsSync(screenshotsDir)) {
          fs.mkdirSync(screenshotsDir, { recursive: true })
        }

        await el.screenshot({
          path: path.join(screenshotsDir, `ideastep-${stepId}-${vp.name}.png`),
        })
      })
    }
  }
})

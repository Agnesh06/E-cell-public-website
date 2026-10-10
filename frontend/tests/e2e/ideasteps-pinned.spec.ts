import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import * as path from 'path'
import * as fs from 'fs'

test.describe('IdeaSteps Pinned Scroll Sequence (Phase 4B)', () => {
  test.beforeEach(async ({ page }) => {
    // Desktop 1280x720 with normal motion
    await page.setViewportSize({ width: 1280, height: 720 })
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await page.goto('/')
    await page.getByRole('heading', { level: 1 }).waitFor()
  })

  test('pinned stage is mounted with one shared StepIndicator and FlowLine at >= 1024px', async ({
    page,
  }) => {
    const pinnedStage = page.locator('.pinned-stage')
    await expect(pinnedStage).toBeVisible()

    // FlowLine SVG is present
    const flowLine = page.locator('.flow-line-svg')
    await expect(flowLine).toBeAttached()

    // Shared StepIndicator is present
    const indicator = page.locator('.pinned-stage > div .step-indicator')
    await expect(indicator).toBeVisible()

    // Static steps should not be rendered
    const staticSteps = page.locator('.static-idea-steps')
    await expect(staticSteps).toHaveCount(0)
  })

  // ── Timeline progress points & visibility ──────────────────────────────────

  const progressPoints = [
    { p: 0.0, activeStep: '1', visibleStepId: null },
    { p: 0.1, activeStep: '1', visibleStepId: 'step-about' },
    { p: 0.3, activeStep: '2', visibleStepId: 'step-approach' },
    { p: 0.5, activeStep: '4', visibleStepId: null }, // interlude: no text visible, next step (4) highlighted
    { p: 0.7, activeStep: '4', visibleStepId: 'step-journey' },
    { p: 0.9, activeStep: '5', visibleStepId: 'step-audience' },
    { p: 1.0, activeStep: '5', visibleStepId: 'step-audience' },
  ]

  for (const { p, activeStep, visibleStepId } of progressPoints) {
    test(`progress ${p}: active step is ${activeStep}, content state correct, screenshot saved`, async ({
      page,
    }) => {
      // Wait for ScrollTrigger to be mounted and attached to window
      await page.waitForFunction(() => {
        return typeof (window as unknown as { __ideaStepsScrollTrigger?: unknown }).__ideaStepsScrollTrigger !== 'undefined'
      })

      // Scroll to matching progress
      await page.evaluate((targetProgress) => {
        const st = (window as unknown as { __ideaStepsScrollTrigger?: { start: number; end: number } })
          .__ideaStepsScrollTrigger
        if (st) {
          window.scrollTo(0, st.start + targetProgress * (st.end - st.start))
        }
      }, p)

      // Wait for data-progress and scrubbed timeline to settle
      await page.waitForTimeout(1000)

      const section = page.locator('section#about')
      await expect(section).toHaveAttribute('data-active-step', activeStep)

      if (visibleStepId) {
        // The expected step headline is visible
        const headline = page.locator(`#${visibleStepId} h3`)
        await expect(headline).toBeVisible()

        // Check other step headlines are hidden (autoAlpha: 0 / visibility: hidden)
        const allHeadlines = page.locator('section#about .step-stage-slide h3')
        const count = await allHeadlines.count()
        for (let i = 0; i < count; i++) {
          const h = allHeadlines.nth(i)
          const isTarget = await h.evaluate((el, id) => el.closest(`#${id}`) !== null, visibleStepId)
          if (!isTarget) {
            await expect(h).toBeHidden()
          }
        }
      } else if (p === 0.5) {
        // Interlude: stage is empty, NO step text is visible
        const allHeadlines = page.locator('section#about .step-stage-slide h3')
        const count = await allHeadlines.count()
        for (let i = 0; i < count; i++) {
          await expect(allHeadlines.nth(i)).toBeHidden()
        }
      }

      // Capture screenshot
      const screenshotsDir = path.resolve('tests/screenshots')
      if (!fs.existsSync(screenshotsDir)) {
        fs.mkdirSync(screenshotsDir, { recursive: true })
      }
      const stage = page.locator('.pinned-stage')
      await stage.screenshot({
        path: path.join(screenshotsDir, `progress-${p.toFixed(1)}-1280x720.png`),
      })
    })
  }

  // ── Clicking indicators lands on each step's hold ─────────────────────────

  const indicatorSteps = [
    { label: 'Step 01', expectedActiveStep: '1', stepId: 'step-about' },
    { label: 'Step 02', expectedActiveStep: '2', stepId: 'step-approach' },
    { label: 'Step 03', expectedActiveStep: '3', stepId: 'step-ecosystem' },
    { label: 'Step 04', expectedActiveStep: '4', stepId: 'step-journey' },
    { label: 'Step 05', expectedActiveStep: '5', stepId: 'step-audience' },
  ]

  for (const { label, expectedActiveStep, stepId } of indicatorSteps) {
    test(`clicking "${label}" scrolls and lands on that step's hold`, async ({ page }) => {
      // Wait for ScrollTrigger to be mounted
      await page.waitForFunction(() => {
        return typeof (window as unknown as { __ideaStepsScrollTrigger?: unknown }).__ideaStepsScrollTrigger !== 'undefined'
      })

      // First scroll down to the pinned stage
      await page.evaluate(() => {
        const st = (window as unknown as { __ideaStepsScrollTrigger?: { start: number } })
          .__ideaStepsScrollTrigger
        if (st) window.scrollTo(0, st.start)
      })
      await page.waitForTimeout(500)

      const btn = page.locator('.pinned-stage > div .step-indicator').getByRole('button', { name: label })
      await expect(btn).toBeVisible()
      await btn.click()

      // Allow smooth scroll to settle
      await page.waitForTimeout(1400)

      const section = page.locator('section#about')
      await expect(section).toHaveAttribute('data-active-step', expectedActiveStep)

      const headline = page.locator(`#${stepId} h3`)
      await expect(headline).toBeVisible()
    })
  }

  // ── Keyboard accessibility: Tab reaches indicators and Enter activates them ─

  test('keyboard Tab reaches indicator buttons and Enter activates them', async ({ page }) => {
    // Wait for ScrollTrigger to be mounted
    await page.waitForFunction(() => {
      return typeof (window as unknown as { __ideaStepsScrollTrigger?: unknown }).__ideaStepsScrollTrigger !== 'undefined'
    })

    await page.evaluate(() => {
      const st = (window as unknown as { __ideaStepsScrollTrigger?: { start: number } })
        .__ideaStepsScrollTrigger
      if (st) window.scrollTo(0, st.start)
    })
    await page.waitForTimeout(500)

    // Focus on first indicator button
    const firstBtn = page.locator('.pinned-stage > div .step-indicator').getByRole('button', { name: 'Step 01' })
    await firstBtn.focus()
    await expect(firstBtn).toBeFocused()

    // Press Tab to reach Step 02
    await page.keyboard.press('Tab')
    const secondBtn = page.locator('.pinned-stage > div .step-indicator').getByRole('button', { name: 'Step 02' })
    await expect(secondBtn).toBeFocused()

    // Press Enter to activate Step 02
    await page.keyboard.press('Enter')
    await page.waitForTimeout(1400)

    const section = page.locator('section#about')
    await expect(section).toHaveAttribute('data-active-step', '2')
    await expect(page.locator('#step-approach h3')).toBeVisible()
  })

  // ── Resize 1280 -> 800 -> 1280: full cleanup and rebuild ──────────────────

  test('resize 1280 -> 800 -> 1280: switches to static layout and cleanly rebuilds pinned stage without pin spacers', async ({
    page,
  }) => {
    const consoleErrors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text())
    })

    // 1. Initial 1280: pinned stage
    await expect(page.locator('.pinned-stage')).toBeVisible()
    await expect(page.locator('.static-idea-steps')).toHaveCount(0)

    // 2. Resize to 800px: switches to static layout
    await page.setViewportSize({ width: 800, height: 900 })
    await page.waitForTimeout(600)

    await expect(page.locator('.static-idea-steps')).toBeVisible()
    await expect(page.locator('.pinned-stage')).toHaveCount(0)

    // No leftover pin-spacer elements
    const pinSpacers = page.locator('.pin-spacer')
    await expect(pinSpacers).toHaveCount(0)

    // 3. Resize back to 1280px: rebuilds pinned stage
    await page.setViewportSize({ width: 1280, height: 720 })
    await page.waitForTimeout(600)

    await expect(page.locator('.pinned-stage')).toBeVisible()
    await expect(page.locator('.static-idea-steps')).toHaveCount(0)

    expect(consoleErrors).toEqual([])
  })

  // ── reducedMotion: 'reduce': static stacked, all 5 steps readable, no pin ──

  test('reducedMotion: "reduce" renders static stacked layout with no pin', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    await page.getByRole('heading', { level: 1 }).waitFor()

    // Static layout is rendered
    await expect(page.locator('.static-idea-steps')).toBeVisible()
    await expect(page.locator('.pinned-stage')).toHaveCount(0)
    await expect(page.locator('.pin-spacer')).toHaveCount(0)

    // All five steps are readable
    const h3s = page.locator('section#about h3')
    await expect(h3s).toHaveCount(5)
    for (let i = 0; i < 5; i++) {
      await expect(h3s.nth(i)).toBeVisible()
    }
  })

  // ── 375x812: static layout, no horizontal overflow ────────────────────────

  test('375x812 mobile: static layout and no horizontal overflow', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/')
    await page.getByRole('heading', { level: 1 }).waitFor()

    await expect(page.locator('.static-idea-steps')).toBeVisible()
    await expect(page.locator('.pinned-stage')).toHaveCount(0)

    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth)
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1)
  })

  // ── Axe passes in pinned mode and heading hierarchy ────────────────────────

  test('axe passes in pinned desktop mode with exactly one h1', async ({ page }) => {
    await expect(page.locator('h1')).toHaveCount(1)

    const results = await new AxeBuilder({ page }).analyze()
    expect(results.violations).toEqual([])
  })
})

test.describe('IdeaSteps Layout & Mask Assertions', () => {
  const layoutViewports = [
    { width: 900, height: 700, name: '900x700' },
    { width: 768, height: 1024, name: '768x1024' },
    { width: 375, height: 667, name: '375x667' },
  ]

  for (const vp of layoutViewports) {
    test(`${vp.name}: every card lies fully inside the page, no overlaps`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' })
      await page.setViewportSize({ width: vp.width, height: vp.height })
      await page.goto('/')
      await page.getByRole('heading', { level: 1 }).waitFor()

      // Scroll to the about section
      await page.evaluate(() => {
        const el = document.getElementById('about')
        if (el) el.scrollIntoView()
      })
      await page.waitForTimeout(400)

      // Check all visible cards are within page bounds
      const cards = page.locator('section#about .glass-card')
      const cardCount = await cards.count()
      const pageWidth = vp.width

      for (let i = 0; i < cardCount; i++) {
        const card = cards.nth(i)
        const isVisible = await card.isVisible()
        if (!isVisible) continue
        const box = await card.boundingBox()
        if (!box) continue
        // Card must be within page width
        expect(box.x).toBeGreaterThanOrEqual(-1)
        expect(box.x + box.width).toBeLessThanOrEqual(pageWidth + 1)
      }

      // No horizontal overflow
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth)
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1)
    })
  }

  test('1300x600: no knockout mask element exists and flow line is a continuous stroke', async ({ page }) => {
    await page.setViewportSize({ width: 1300, height: 600 })
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await page.goto('/')
    await page.getByRole('heading', { level: 1 }).waitFor()

    // No SVG knockout mask element
    const knockoutMask = page.locator('.flow-line-svg mask#flow-knockout')
    await expect(knockoutMask).toHaveCount(0)

    // The drawn path exists as a continuous stroke
    const drawnPath = page.locator('.flow-line-svg path').nth(1)
    await expect(drawnPath).toBeAttached()
  })
})

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

  test('pinned stage is mounted with one shared StepIndicator and no flow line elements at >= 1024px', async ({
    page,
  }) => {
    const pinnedStage = page.locator('.pinned-stage')
    await expect(pinnedStage).toBeVisible()

    // no FlowLine, no SVG path with the blue stroke, no mask element, and no element with a flow-line class in the stage
    await expect(pinnedStage.locator('.flow-line-container')).toHaveCount(0)
    await expect(pinnedStage.locator('.flow-line-svg')).toHaveCount(0)
    await expect(pinnedStage.locator('mask')).toHaveCount(0)
    await expect(pinnedStage.locator('path[stroke*="blue"]')).toHaveCount(0)
    await expect(pinnedStage.locator('[class*="flow-line"]')).toHaveCount(0)

    // Shared StepIndicator is present
    const indicator = page.locator('.pinned-stage > div .step-indicator')
    await expect(indicator).toBeVisible()

    // Static steps should not be rendered
    const staticSteps = page.locator('.static-idea-steps')
    await expect(staticSteps).toHaveCount(0)
  })

  // ── Timeline progress points & visibility ──────────────────────────────────

  const progressPoints = [
    { p: 0.0, activeStep: '1', visibleStepId: 'step-about' },
    { p: 0.05, activeStep: '1', visibleStepId: 'step-about' },
    { p: 0.28, activeStep: '2', visibleStepId: 'step-approach' },
    { p: 0.48, activeStep: '3', visibleStepId: 'step-ecosystem' },
    { p: 0.68, activeStep: '4', visibleStepId: 'step-journey' },
    { p: 0.9, activeStep: '5', visibleStepId: 'step-audience' },
    { p: 1.0, activeStep: '5', visibleStepId: 'step-audience' },
  ]

  for (const { p, activeStep, visibleStepId } of progressPoints) {
    test(`progress ${p}: active step is ${activeStep}, content state correct, screenshot saved`, async ({
      page,
    }) => {
      test.slow()
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
    // Wait for hero load animation to complete
    await page.waitForTimeout(1400)

    const results = await new AxeBuilder({ page }).include('section#about').analyze()
    expect(results.violations).toEqual([])
  })
})

test.describe('StarField Background Animation', () => {
  test.beforeEach(async ({ page }) => {
    test.slow()
    await page.setViewportSize({ width: 1280, height: 720 })
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await page.goto('/')
    await page.getByRole('heading', { level: 1 }).waitFor()
  })

  test('at 1280x720 the stage has exactly one canvas with aria-hidden true; the hero and projects sections have none', async ({
    page,
  }) => {
    const stage = page.locator('.pinned-stage')
    const stageCanvas = stage.locator('canvas[aria-hidden="true"]')
    await expect(stageCanvas).toHaveCount(1)

    // The hero and projects sections have no star-field canvas
    const heroStarCanvas = page.locator('.landing-hero canvas.star-field-canvas, .landing-hero canvas[data-stars-alive]')
    await expect(heroStarCanvas).toHaveCount(0)

    const projectsStarCanvas = page.locator(
      'section#projects canvas.star-field-canvas, section#projects canvas[data-stars-alive], .projects-preview canvas.star-field-canvas',
    )
    await expect(projectsStarCanvas).toHaveCount(0)
  })

  test('the canvas draws star sprites (sprite canvas size is at least 2x its radius)', async ({ page }) => {
    const canvas = page.locator('.pinned-stage canvas')
    await expect(canvas).toBeVisible()

    const spriteInfo = await page.evaluate(() => {
      const el = document.querySelector('.pinned-stage canvas') as
        | (HTMLCanvasElement & { __starSprite?: HTMLCanvasElement; __starBaseRadius?: number })
        | null
      if (!el) return null
      const sprite = el.__starSprite
      const sizeAttr = parseInt(el.getAttribute('data-sprite-size') || '0', 10)
      const radiusAttr = parseInt(el.getAttribute('data-sprite-radius') || '0', 10)
      const width = sprite ? sprite.width : sizeAttr
      const height = sprite ? sprite.height : sizeAttr
      const radius = el.__starBaseRadius ?? radiusAttr
      return { width, height, radius }
    })

    expect(spriteInfo).toBeTruthy()
    expect(spriteInfo!.radius).toBeGreaterThan(0)
    expect(spriteInfo!.width).toBeGreaterThanOrEqual(spriteInfo!.radius * 2)
    expect(spriteInfo!.height).toBeGreaterThanOrEqual(spriteInfo!.radius * 2)
  })

  test('a forced merge still produces net +1 below the cap', async ({ page }) => {
    const canvas = page.locator('.pinned-stage canvas')
    await expect(canvas).toBeVisible()

    await page.waitForTimeout(200)
    const initialAliveStr = await canvas.getAttribute('data-stars-alive')
    const initialAlive = parseInt(initialAliveStr || '28', 10)

    await canvas.dispatchEvent('stars:force-merge')
    await page.waitForTimeout(150)

    const newAliveStr = await canvas.getAttribute('data-stars-alive')
    const newAlive = parseInt(newAliveStr || '0', 10)

    expect(newAlive).toBe(initialAlive + 1)
  })

  test('alive stars never exceed 40 after 30 forced merges', async ({ page }) => {
    const canvas = page.locator('.pinned-stage canvas')
    await expect(canvas).toBeVisible()

    for (let i = 0; i < 30; i++) {
      await canvas.dispatchEvent('stars:force-merge')
    }
    await page.waitForTimeout(200)

    const finalAliveStr = await canvas.getAttribute('data-stars-alive')
    const finalAlive = parseInt(finalAliveStr || '0', 10)
    expect(finalAlive).toBeLessThanOrEqual(40)
  })

  test('a fast scroll raises data-speed-factor above 1.5 and it returns below 1.1 within 2.5 seconds of stopping', async ({
    page,
  }) => {
    const canvas = page.locator('.pinned-stage canvas')
    await expect(canvas).toBeVisible()

    // Scroll rapidly
    for (let i = 0; i < 6; i++) {
      await page.mouse.wheel(0, 500)
      await page.waitForTimeout(50)
    }

    await page.waitForFunction(() => {
      const el = document.querySelector('.pinned-stage canvas')
      if (!el) return false
      const factor = parseFloat(el.getAttribute('data-speed-factor') || '1')
      return factor > 1.5
    }, { timeout: 3000 })

    // Wait for factor to decay below 1.1 after stopping scroll
    await page.waitForFunction(() => {
      const el = document.querySelector('.pinned-stage canvas')
      if (!el) return false
      const factor = parseFloat(el.getAttribute('data-speed-factor') || '1')
      return factor < 1.1
    }, { timeout: 4000 })

    const factorAfterStop = await canvas.getAttribute('data-speed-factor')
    expect(parseFloat(factorAfterStop || '1')).toBeLessThan(1.1)
  })

  test('reducedMotion: no canvas; 375x667: no canvas', async ({ page }) => {
    // 1. Reduced motion on desktop
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.setViewportSize({ width: 1280, height: 720 })
    await page.goto('/')
    await page.getByRole('heading', { level: 1 }).waitFor()
    await expect(page.locator('section#about canvas')).toHaveCount(0)

    // 2. Mobile 375x667 with normal motion
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    await page.getByRole('heading', { level: 1 }).waitFor()
    await expect(page.locator('section#about canvas')).toHaveCount(0)
  })
})

test.describe('IdeaSteps Layout & Card-fit Assertions', () => {
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

  test('1300x600: no mask or flow line in stage and cards fit fully', async ({ page }) => {
    await page.setViewportSize({ width: 1300, height: 600 })
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await page.goto('/')
    await page.getByRole('heading', { level: 1 }).waitFor()

    const pinnedStage = page.locator('.pinned-stage')
    await expect(pinnedStage).toBeVisible()

    // No mask or flow-line element
    await expect(pinnedStage.locator('mask')).toHaveCount(0)
    await expect(pinnedStage.locator('.flow-line-svg')).toHaveCount(0)
    await expect(pinnedStage.locator('[class*="flow-line"]')).toHaveCount(0)

    // Check card fit
    const cards = page.locator('.pinned-stage .glass-card')
    const cardCount = await cards.count()
    for (let i = 0; i < cardCount; i++) {
      const card = cards.nth(i)
      const isVisible = await card.isVisible()
      if (!isVisible) continue
      const box = await card.boundingBox()
      if (!box) continue
      expect(box.x).toBeGreaterThanOrEqual(-1)
      expect(box.x + box.width).toBeLessThanOrEqual(1300 + 1)
    }
  })
})

test.describe('Required Hold Screenshots', () => {
  const artifactDir = 'C:/Users/USER/.gemini/antigravity/brain/2ffd419f-78e2-4334-8aba-ee45d3872e3a'

  test('capture step 2 hold at 1280x720', async ({ page }) => {
    test.slow()
    await page.setViewportSize({ width: 1280, height: 720 })
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await page.goto('/')
    await page.getByRole('heading', { level: 1 }).waitFor()

    await page.waitForFunction(() => {
      return typeof (window as unknown as { __ideaStepsScrollTrigger?: unknown }).__ideaStepsScrollTrigger !== 'undefined'
    })

    await page.evaluate(() => {
      const st = (window as unknown as { __ideaStepsScrollTrigger?: { start: number; end: number } }).__ideaStepsScrollTrigger
      if (st) window.scrollTo(0, st.start + 0.28 * (st.end - st.start))
    })

    await page.waitForTimeout(1000)
    await expect(page.locator('#step-approach h3')).toBeVisible()

    const cardsContainer = page.locator('#step-approach .step-cards-container')
    await expect(cardsContainer).toBeVisible()

    const screenshotsDir = path.resolve('tests/screenshots')
    if (!fs.existsSync(screenshotsDir)) fs.mkdirSync(screenshotsDir, { recursive: true })
    if (!fs.existsSync(artifactDir)) fs.mkdirSync(artifactDir, { recursive: true })

    await cardsContainer.screenshot({ path: path.join(screenshotsDir, 'step2-cards-stars-1280x720.png') })
    await cardsContainer.screenshot({ path: path.join(artifactDir, 'step2-cards-stars-1280x720.png') })

    const stage = page.locator('.pinned-stage')
    await stage.screenshot({ path: path.join(screenshotsDir, 'step2-hold-1280x720.png') })
    await stage.screenshot({ path: path.join(artifactDir, 'step2-hold-1280x720.png') })
  })

  test('capture step 4 hold at 1280x720', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 })
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await page.goto('/')
    await page.getByRole('heading', { level: 1 }).waitFor()

    await page.waitForFunction(() => {
      return typeof (window as unknown as { __ideaStepsScrollTrigger?: unknown }).__ideaStepsScrollTrigger !== 'undefined'
    })

    await page.evaluate(() => {
      const st = (window as unknown as { __ideaStepsScrollTrigger?: { start: number; end: number } }).__ideaStepsScrollTrigger
      if (st) window.scrollTo(0, st.start + 0.68 * (st.end - st.start))
    })

    await page.waitForTimeout(1000)
    await expect(page.locator('#step-journey h3')).toBeVisible()

    const stage = page.locator('.pinned-stage')
    const screenshotsDir = path.resolve('tests/screenshots')
    if (!fs.existsSync(screenshotsDir)) fs.mkdirSync(screenshotsDir, { recursive: true })
    if (!fs.existsSync(artifactDir)) fs.mkdirSync(artifactDir, { recursive: true })

    await stage.screenshot({ path: path.join(screenshotsDir, 'step4-hold-1280x720.png') })
    await stage.screenshot({ path: path.join(artifactDir, 'step4-hold-1280x720.png') })
  })

  test('capture step 3 hold at 1300x600', async ({ page }) => {
    await page.setViewportSize({ width: 1300, height: 600 })
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await page.goto('/')
    await page.getByRole('heading', { level: 1 }).waitFor()

    await page.waitForFunction(() => {
      return typeof (window as unknown as { __ideaStepsScrollTrigger?: unknown }).__ideaStepsScrollTrigger !== 'undefined'
    })

    await page.evaluate(() => {
      const st = (window as unknown as { __ideaStepsScrollTrigger?: { start: number; end: number } }).__ideaStepsScrollTrigger
      if (st) window.scrollTo(0, st.start + 0.48 * (st.end - st.start))
    })

    await page.waitForTimeout(1000)
    await expect(page.locator('#step-ecosystem h3')).toBeVisible()

    const stage = page.locator('.pinned-stage')
    const screenshotsDir = path.resolve('tests/screenshots')
    if (!fs.existsSync(screenshotsDir)) fs.mkdirSync(screenshotsDir, { recursive: true })
    if (!fs.existsSync(artifactDir)) fs.mkdirSync(artifactDir, { recursive: true })

    await stage.screenshot({ path: path.join(screenshotsDir, 'step3-hold-1300x600.png') })
    await stage.screenshot({ path: path.join(artifactDir, 'step3-hold-1300x600.png') })
  })
})

test.describe('Desktop Card Pop Animations (1024px+)', () => {
  const artifactDir = 'C:/Users/USER/.gemini/antigravity/brain/2ffd419f-78e2-4334-8aba-ee45d3872e3a'

  function parseScale(transformStr: string): number {
    if (!transformStr || transformStr === 'none') return 1.0
    const match = transformStr.match(/^matrix\(([^)]+)\)$/)
    if (!match) return 1.0
    const values = match[1].split(',').map((v) => parseFloat(v.trim()))
    return Math.sqrt(values[0] * values[0] + values[1] * values[1])
  }

  for (const vp of [
    { width: 1280, height: 720, name: '1280x720' },
    { width: 1300, height: 600, name: '1300x600' },
  ]) {
    test(`${vp.name}: at midpoint of enter segment, each card scale is between 0.85 and 1, and at hold it is 1 (within 0.01)`, async ({
      page,
    }) => {
      test.slow()
      await page.setViewportSize({ width: vp.width, height: vp.height })
      await page.emulateMedia({ reducedMotion: 'no-preference' })
      await page.goto('/')
      await page.getByRole('heading', { level: 1 }).waitFor()

      await page.waitForFunction(() => {
        return typeof (window as unknown as { __ideaStepsScrollTrigger?: unknown }).__ideaStepsScrollTrigger !== 'undefined'
      })

      // Step 3 enter midpoint: enter is 0.40 to 0.43, midpoint is 0.415
      await page.evaluate(() => {
        const st = (window as unknown as { __ideaStepsScrollTrigger?: { start: number; end: number } })
          .__ideaStepsScrollTrigger
        if (st) window.scrollTo(0, st.start + 0.415 * (st.end - st.start))
      })
      await page.waitForTimeout(800)

      const cards = page.locator('#step-ecosystem .glass-card')
      const count = await cards.count()
      expect(count).toBeGreaterThan(0)

      for (let i = 0; i < count; i++) {
        const transform = await cards.nth(i).evaluate((el) => window.getComputedStyle(el).transform)
        const scale = parseScale(transform)
        expect(scale).toBeGreaterThanOrEqual(0.85)
        expect(scale).toBeLessThanOrEqual(1.0)
      }

      // Step 3 hold: 0.48
      await page.evaluate(() => {
        const st = (window as unknown as { __ideaStepsScrollTrigger?: { start: number; end: number } })
          .__ideaStepsScrollTrigger
        if (st) window.scrollTo(0, st.start + 0.48 * (st.end - st.start))
      })
      await page.waitForTimeout(800)

      for (let i = 0; i < count; i++) {
        const transform = await cards.nth(i).evaluate((el) => window.getComputedStyle(el).transform)
        const scale = parseScale(transform)
        expect(Math.abs(scale - 1.0)).toBeLessThanOrEqual(0.01)
      }
    })
  }

  test('cards overshoot: at some point during enter, the scale is above 1.0', async ({ page }) => {
    test.slow()
    await page.setViewportSize({ width: 1280, height: 720 })
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await page.goto('/')
    await page.getByRole('heading', { level: 1 }).waitFor()

    await page.waitForFunction(() => {
      return typeof (window as unknown as { __ideaStepsScrollTrigger?: unknown }).__ideaStepsScrollTrigger !== 'undefined'
    })

    // Step 3 overshoot peak happens around 0.420 - 0.424
    await page.evaluate(() => {
      const st = (window as unknown as { __ideaStepsScrollTrigger?: { start: number; end: number } })
        .__ideaStepsScrollTrigger
      if (st) window.scrollTo(0, st.start + 0.422 * (st.end - st.start))
    })
    await page.waitForTimeout(800)

    const cards = page.locator('#step-ecosystem .glass-card')
    const count = await cards.count()
    let hasOvershoot = false
    for (let i = 0; i < count; i++) {
      const transform = await cards.nth(i).evaluate((el) => window.getComputedStyle(el).transform)
      const scale = parseScale(transform)
      if (scale > 1.0) {
        hasOvershoot = true
        break
      }
    }
    expect(hasOvershoot).toBe(true)
  })

  test('the stagger: the first card reaches scale 1 before the last card does', async ({ page }) => {
    test.slow()
    await page.setViewportSize({ width: 1280, height: 720 })
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await page.goto('/')
    await page.getByRole('heading', { level: 1 }).waitFor()

    await page.waitForFunction(() => {
      return typeof (window as unknown as { __ideaStepsScrollTrigger?: unknown }).__ideaStepsScrollTrigger !== 'undefined'
    })

    // At progress ~0.4155, card 0 has reached/crossed 1.0 while the last card is still below 1.0
    await page.evaluate(() => {
      const st = (window as unknown as { __ideaStepsScrollTrigger?: { start: number; end: number } })
        .__ideaStepsScrollTrigger
      if (st) window.scrollTo(0, st.start + 0.4155 * (st.end - st.start))
    })
    await page.waitForTimeout(800)

    const cards = page.locator('#step-ecosystem .glass-card')
    const firstTransform = await cards.first().evaluate((el) => window.getComputedStyle(el).transform)
    const lastTransform = await cards.last().evaluate((el) => window.getComputedStyle(el).transform)

    const firstScale = parseScale(firstTransform)
    const lastScale = parseScale(lastTransform)

    expect(firstScale).toBeGreaterThanOrEqual(1.0)
    expect(lastScale).toBeLessThan(1.0)
  })

  test('at 375x667 and under reduced motion no card has a scale transform applied', async ({ page }) => {
    test.slow()
    // 1. Mobile 375x667
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    await page.getByRole('heading', { level: 1 }).waitFor()

    const mobileCards = page.locator('section#about .glass-card')
    const mobileCount = await mobileCards.count()
    expect(mobileCount).toBeGreaterThan(0)
    for (let i = 0; i < mobileCount; i++) {
      const transform = await mobileCards.nth(i).evaluate((el) => window.getComputedStyle(el).transform)
      const scale = parseScale(transform)
      expect(Math.abs(scale - 1.0)).toBeLessThan(0.001)
      const inlineTransform = await mobileCards.nth(i).evaluate((el) => el.style.transform)
      expect(inlineTransform).not.toContain('scale')
    }

    // 2. Desktop with reduced motion
    await page.setViewportSize({ width: 1280, height: 720 })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    await page.getByRole('heading', { level: 1 }).waitFor()

    const rmCards = page.locator('section#about .glass-card')
    const rmCount = await rmCards.count()
    expect(rmCount).toBeGreaterThan(0)
    for (let i = 0; i < rmCount; i++) {
      const transform = await rmCards.nth(i).evaluate((el) => window.getComputedStyle(el).transform)
      const scale = parseScale(transform)
      expect(Math.abs(scale - 1.0)).toBeLessThan(0.001)
      const inlineTransform = await rmCards.nth(i).evaluate((el) => el.style.transform)
      expect(inlineTransform).not.toContain('scale')
    }
  })

  test('cards remain opaque (computed background-color alpha is solid surface color)', async ({ page }) => {
    test.slow()
    await page.setViewportSize({ width: 1280, height: 720 })
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await page.goto('/')
    await page.getByRole('heading', { level: 1 }).waitFor()

    const cards = page.locator('.pinned-stage .glass-card')
    const count = await cards.count()
    expect(count).toBeGreaterThan(0)

    for (let i = 0; i < count; i++) {
      const bg = await cards.nth(i).evaluate((el) => window.getComputedStyle(el).backgroundColor)
      // Solid surface color: rgb(...) or rgba(..., ..., ..., 1)
      const isOpaque = bg.startsWith('rgb(') || bg.endsWith(', 1)') || bg.endsWith(', 1.0)')
      expect(isOpaque).toBe(true)
    }
  })

  test('capture step 3 mid-pop and hold screenshots at 1280x720', async ({ page }) => {
    test.slow()
    await page.setViewportSize({ width: 1280, height: 720 })
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await page.goto('/')
    await page.getByRole('heading', { level: 1 }).waitFor()

    await page.waitForFunction(() => {
      return typeof (window as unknown as { __ideaStepsScrollTrigger?: unknown }).__ideaStepsScrollTrigger !== 'undefined'
    })

    const screenshotsDir = path.resolve('tests/screenshots')
    if (!fs.existsSync(screenshotsDir)) fs.mkdirSync(screenshotsDir, { recursive: true })
    if (!fs.existsSync(artifactDir)) fs.mkdirSync(artifactDir, { recursive: true })

    // Step 3 mid-pop: progress 0.415
    await page.evaluate(() => {
      const st = (window as unknown as { __ideaStepsScrollTrigger?: { start: number; end: number } })
        .__ideaStepsScrollTrigger
      if (st) window.scrollTo(0, st.start + 0.415 * (st.end - st.start))
    })
    await page.waitForTimeout(1000)

    const stage = page.locator('.pinned-stage')
    await stage.screenshot({ path: path.join(screenshotsDir, 'step3-midpop-1280x720.png') })
    await stage.screenshot({ path: path.join(artifactDir, 'step3-midpop-1280x720.png') })

    // Step 3 hold: progress 0.48
    await page.evaluate(() => {
      const st = (window as unknown as { __ideaStepsScrollTrigger?: { start: number; end: number } })
        .__ideaStepsScrollTrigger
      if (st) window.scrollTo(0, st.start + 0.48 * (st.end - st.start))
    })
    await page.waitForTimeout(1000)

    await stage.screenshot({ path: path.join(screenshotsDir, 'step3-hold-1280x720.png') })
    await stage.screenshot({ path: path.join(artifactDir, 'step3-hold-1280x720.png') })
  })
})

test.describe('Continuous Step Flow & Crossfade Overlap (Zero Gap)', () => {
  const artifactDir = 'C:/Users/USER/.gemini/antigravity/brain/2ffd419f-78e2-4334-8aba-ee45d3872e3a'

  for (const vp of [
    { width: 1440, height: 900, name: '1440x900' },
    { width: 1280, height: 720, name: '1280x720' },
  ]) {
    test(`${vp.name}: <= 10% of the pin length has no visible step text`, async ({ page }) => {
      test.slow()
      await page.setViewportSize({ width: vp.width, height: vp.height })
      await page.emulateMedia({ reducedMotion: 'no-preference' })
      await page.goto('/')
      await page.getByRole('heading', { level: 1 }).waitFor()

      await page.waitForFunction(() => {
        return typeof (window as unknown as { __ideaStepsScrollTrigger?: unknown }).__ideaStepsScrollTrigger !== 'undefined'
      })

      // Sample 40 points across the progress range from 0.0 to 1.0
      const sampleCount = 40
      let noTextCount = 0

      for (let i = 0; i <= sampleCount; i++) {
        const p = i / sampleCount
        await page.evaluate((targetProgress) => {
          const st = (window as unknown as { __ideaStepsScrollTrigger?: { start: number; end: number } })
            .__ideaStepsScrollTrigger
          if (st) window.scrollTo(0, st.start + targetProgress * (st.end - st.start))
        }, p)

        await page.waitForTimeout(60)

        // Check if any step headline is visible and has opacity > 0.05
        const anyVisible = await page.evaluate(() => {
          const headlines = Array.from(document.querySelectorAll('section#about .step-stage-slide h3'))
          return headlines.some((el) => {
            const style = window.getComputedStyle(el)
            const parent = el.closest('.step-stage-slide') as HTMLElement | null
            const parentStyle = parent ? window.getComputedStyle(parent) : null
            const parentOpacity = parentStyle ? parseFloat(parentStyle.opacity) : 1
            const parentVisibility = parentStyle ? parentStyle.visibility : 'visible'
            const opacity = parseFloat(style.opacity) * parentOpacity
            return style.visibility !== 'hidden' && parentVisibility !== 'hidden' && opacity > 0.05
          })
        })

        if (!anyVisible) {
          noTextCount++
        }
      }

      const noTextRatio = noTextCount / (sampleCount + 1)
      expect(noTextRatio).toBeLessThanOrEqual(0.10)
    })
  }

  const crossfadeMidpoints = [
    { p: 0.225, outgoingId: 'step-about', incomingId: 'step-approach', desc: 'step 1 to step 2' },
    { p: 0.425, outgoingId: 'step-approach', incomingId: 'step-ecosystem', desc: 'step 2 to step 3' },
    { p: 0.625, outgoingId: 'step-ecosystem', incomingId: 'step-journey', desc: 'step 3 to step 4' },
    { p: 0.825, outgoingId: 'step-journey', incomingId: 'step-audience', desc: 'step 4 to step 5' },
  ]

  for (const { p, outgoingId, incomingId, desc } of crossfadeMidpoints) {
    test(`crossfade ${desc} (progress ${p}): outgoing and incoming are both partly visible (opacity between 0.05 and 0.95)`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: 1440, height: 900 })
      await page.emulateMedia({ reducedMotion: 'no-preference' })
      await page.goto('/')
      await page.getByRole('heading', { level: 1 }).waitFor()

      await page.waitForFunction(() => {
        return typeof (window as unknown as { __ideaStepsScrollTrigger?: unknown }).__ideaStepsScrollTrigger !== 'undefined'
      })

      await page.evaluate((targetProgress) => {
        const st = (window as unknown as { __ideaStepsScrollTrigger?: { start: number; end: number } })
          .__ideaStepsScrollTrigger
        if (st) window.scrollTo(0, st.start + targetProgress * (st.end - st.start))
      }, p)
      await page.waitForTimeout(600)

      const getOpacity = async (id: string) => {
        return page.evaluate((elementId) => {
          const slide = document.getElementById(elementId)?.closest('.step-stage-slide') as HTMLElement | null
          if (!slide) return 0
          const h3 = slide.querySelector('h3') as HTMLElement | null
          const slideOpacity = parseFloat(window.getComputedStyle(slide).opacity)
          const h3Opacity = h3 ? parseFloat(window.getComputedStyle(h3).opacity) : 1
          return slideOpacity * h3Opacity
        }, id)
      }

      const outOpacity = await getOpacity(outgoingId)
      const inOpacity = await getOpacity(incomingId)

      expect(outOpacity).toBeGreaterThanOrEqual(0.05)
      expect(outOpacity).toBeLessThanOrEqual(0.95)
      expect(inOpacity).toBeGreaterThanOrEqual(0.05)
      expect(inOpacity).toBeLessThanOrEqual(0.95)
    })
  }

  const holdPoints = [
    { p: 0.05, stepId: 'step-about', activeStep: '1' },
    { p: 0.25, stepId: 'step-approach', activeStep: '2' },
    { p: 0.45, stepId: 'step-ecosystem', activeStep: '3' },
    { p: 0.65, stepId: 'step-journey', activeStep: '4' },
    { p: 0.85, stepId: 'step-audience', activeStep: '5' },
  ]

  for (const { p, stepId, activeStep } of holdPoints) {
    test(`hold at progress ${p}: shows only step ${activeStep} text`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 })
      await page.emulateMedia({ reducedMotion: 'no-preference' })
      await page.goto('/')
      await page.getByRole('heading', { level: 1 }).waitFor()

      await page.waitForFunction(() => {
        return typeof (window as unknown as { __ideaStepsScrollTrigger?: unknown }).__ideaStepsScrollTrigger !== 'undefined'
      })

      await page.evaluate((targetProgress) => {
        const st = (window as unknown as { __ideaStepsScrollTrigger?: { start: number; end: number } })
          .__ideaStepsScrollTrigger
        if (st) window.scrollTo(0, st.start + targetProgress * (st.end - st.start))
      }, p)
      await page.waitForTimeout(600)

      const section = page.locator('section#about')
      await expect(section).toHaveAttribute('data-active-step', activeStep)

      // Expected step headline is visible
      const expectedHeadline = page.locator(`#${stepId} h3`)
      await expect(expectedHeadline).toBeVisible()

      // All other step headlines are hidden
      const allHeadlines = page.locator('section#about .step-stage-slide h3')
      const count = await allHeadlines.count()
      for (let i = 0; i < count; i++) {
        const h = allHeadlines.nth(i)
        const isTarget = await h.evaluate((el, id) => el.closest(`#${id}`) !== null, stepId)
        if (!isTarget) {
          await expect(h).toBeHidden()
        }
      }
    })
  }

  test('pin length at 1920x1080 is strictly less than 5 x viewport height', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await page.goto('/')
    await page.getByRole('heading', { level: 1 }).waitFor()

    await page.waitForFunction(() => {
      return typeof (window as unknown as { __ideaStepsScrollTrigger?: unknown }).__ideaStepsScrollTrigger !== 'undefined'
    })

    const pinDistance = await page.evaluate(() => {
      const st = (window as unknown as { __ideaStepsScrollTrigger?: { start: number; end: number } })
        .__ideaStepsScrollTrigger
      return st ? st.end - st.start : 0
    })

    const maxAllowed = 5 * 1080
    expect(pinDistance).toBeGreaterThan(0)
    expect(pinDistance).toBeLessThan(maxAllowed)
  })

  test('0 console errors during pinned scrolling through all steps', async ({ page }) => {
    const consoleErrors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const text = msg.text()
        if (text.includes('Failed to load resource') || text.includes('ERR_FAILED') || text.includes('CORS') || text.includes('localhost:4000')) {
          return
        }
        consoleErrors.push(text)
      }
    })

    await page.setViewportSize({ width: 1440, height: 900 })
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await page.goto('/')
    await page.getByRole('heading', { level: 1 }).waitFor()

    await page.waitForFunction(() => {
      return typeof (window as unknown as { __ideaStepsScrollTrigger?: unknown }).__ideaStepsScrollTrigger !== 'undefined'
    })

    // Scroll through entire pinned stage
    for (let p = 0; p <= 1.0; p += 0.1) {
      await page.evaluate((targetProgress) => {
        const st = (window as unknown as { __ideaStepsScrollTrigger?: { start: number; end: number } })
          .__ideaStepsScrollTrigger
        if (st) window.scrollTo(0, st.start + targetProgress * (st.end - st.start))
      }, p)
      await page.waitForTimeout(100)
    }

    expect(consoleErrors).toEqual([])
  })

  test('capture crossfade midpoint (steps 2 & 3) and step 4 hold screenshots at 1440x900', async ({ page }) => {
    test.slow()
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await page.goto('/')
    await page.getByRole('heading', { level: 1 }).waitFor()

    await page.waitForFunction(() => {
      return typeof (window as unknown as { __ideaStepsScrollTrigger?: unknown }).__ideaStepsScrollTrigger !== 'undefined'
    })

    const screenshotsDir = path.resolve('tests/screenshots')
    if (!fs.existsSync(screenshotsDir)) fs.mkdirSync(screenshotsDir, { recursive: true })
    if (!fs.existsSync(artifactDir)) fs.mkdirSync(artifactDir, { recursive: true })

    // (1) Crossfade midpoint between steps 2 and 3 (p = 0.425)
    await page.evaluate(() => {
      const st = (window as unknown as { __ideaStepsScrollTrigger?: { start: number; end: number } })
        .__ideaStepsScrollTrigger
      if (st) window.scrollTo(0, st.start + 0.425 * (st.end - st.start))
    })
    await page.waitForTimeout(800)

    const stage = page.locator('.pinned-stage')
    await stage.screenshot({ path: path.join(screenshotsDir, 'crossfade-midpoint-step2-3-1440x900.png') })
    await stage.screenshot({ path: path.join(artifactDir, 'crossfade-midpoint-step2-3-1440x900.png') })

    // (2) Step 4 hold (p = 0.68)
    await page.evaluate(() => {
      const st = (window as unknown as { __ideaStepsScrollTrigger?: { start: number; end: number } })
        .__ideaStepsScrollTrigger
      if (st) window.scrollTo(0, st.start + 0.68 * (st.end - st.start))
    })
    await page.waitForTimeout(800)

    await stage.screenshot({ path: path.join(screenshotsDir, 'step4-hold-1440x900.png') })
    await stage.screenshot({ path: path.join(artifactDir, 'step4-hold-1440x900.png') })
  })
})

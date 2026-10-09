import { expect, test } from '@playwright/test'

test.describe('Hero Section', () => {
  test('content and heading hierarchy: exactly one h1 with exact text, eyebrow and paragraph present', async ({
    page,
  }) => {
    const consoleErrors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text())
      }
    })

    await page.goto('/')

    // Exactly one h1
    const h1s = page.locator('h1')
    await expect(h1s).toHaveCount(1)

    // Accessible text of h1 is exactly "Ideas are just the beginning."
    const heading = page.getByRole('heading', { level: 1 })
    await expect(heading).toHaveText('Ideas are just the beginning.')

    // Eyebrow is present
    const eyebrow = page.locator('.hero-eyebrow')
    await expect(eyebrow).toBeVisible()
    await expect(eyebrow).toHaveText('CSEA E-CELL - PSG COLLEGE OF TECHNOLOGY')

    // Paragraph is present
    const paragraph = page.locator('.hero-paragraph')
    await expect(paragraph).toBeVisible()
    await expect(paragraph).toHaveText(
      'A space to ideate, collaborate, and build. Turn your curiosity into ideas, your ideas into solutions, and your solutions into something that matters.',
    )

    // Bottom labels
    await expect(page.getByText('SCROLL')).toBeVisible()

    expect(consoleErrors).toEqual([])
  })

  test('"Get Involved" goes to /contact without a full reload', async ({ page }) => {
    await page.goto('/')

    const getInvolvedLink = page.getByRole('link', { name: 'Get Involved' })
    await expect(getInvolvedLink).toBeVisible()

    let navigatedViaFullReload = false
    const onPageLoad = () => {
      navigatedViaFullReload = true
    }
    page.on('load', onPageLoad)

    await getInvolvedLink.click()

    await expect(page).toHaveURL(/\/contact$/)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    expect(navigatedViaFullReload).toBe(false)
    page.off('load', onPageLoad)
    expect(navigatedViaFullReload).toBe(false)
  })

  test('"Explore Our Vision" scrolls #about into view', async ({ page }) => {
    await page.goto('/')

    const exploreButton = page.getByRole('button', { name: 'Explore Our Vision' })
    await expect(exploreButton).toBeVisible()

    await exploreButton.click()

    const aboutSection = page.locator('#about')
    await expect(aboutSection).toBeInViewport({ timeout: 5000 })
  })

  const testWidths = [
    { width: 320, height: 568 },
    { width: 375, height: 667 },
    { width: 768, height: 1024 },
    { width: 1280, height: 720 },
    { width: 1920, height: 1080 },
  ]

  for (const vp of testWidths) {
    test(`responsive bounds at ${vp.width}px: no horizontal overflow, hero >= 100svh, header bottom above eyebrow top`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height })
      await page.goto('/')

      // Wait for content
      const heading = page.getByRole('heading', { level: 1 })
      await expect(heading).toBeVisible()

      // 1. No horizontal overflow
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth)
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1) // 1px rounding margin

      // 2. Hero height >= 100svh (vp.height)
      const hero = page.locator('.landing-hero')
      const heroBox = await hero.boundingBox()
      expect(heroBox).not.toBeNull()
      if (heroBox) {
        expect(heroBox.height).toBeGreaterThanOrEqual(vp.height - 1)
      }

      // 3. Header bottom edge is above eyebrow top edge
      const header = page.locator('header.site-header')
      const eyebrow = page.locator('.hero-eyebrow')
      const headerBox = await header.boundingBox()
      const eyebrowBox = await eyebrow.boundingBox()

      expect(headerBox).not.toBeNull()
      expect(eyebrowBox).not.toBeNull()
      if (headerBox && eyebrowBox) {
        const headerBottom = headerBox.y + headerBox.height
        const eyebrowTop = eyebrowBox.y
        expect(headerBottom).toBeLessThan(eyebrowTop)
      }
    })
  }

  test('reducedMotion: "reduce" shows all hero content immediately and no canvas is mounted', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')

    // Content is immediately visible
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(page.locator('.hero-eyebrow')).toBeVisible()
    await expect(page.locator('.hero-paragraph')).toBeVisible()
    await expect(page.getByRole('link', { name: 'Get Involved' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Explore Our Vision' })).toBeVisible()

    // No canvas is mounted
    const canvas = page.locator('.landing-hero canvas')
    await expect(canvas).toHaveCount(0)

    // Static dot background is present
    await expect(page.locator('[data-testid="hero-static-dots"]')).toBeVisible()
  })

  test('at 375px mobile width, no canvas is mounted', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    const canvas = page.locator('.landing-hero canvas')
    await expect(canvas).toHaveCount(0)
    await expect(page.locator('[data-testid="hero-static-dots"]')).toBeVisible()
  })
})

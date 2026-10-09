import { expect, test } from '@playwright/test'

test.describe('DotGrid background', () => {
  test('landing hero renders its decorative interactive dot grid on desktop', async ({ page }) => {
    const width = page.viewportSize()?.width ?? 1280
    if (width < 768) {
      test.skip()
      return
    }

    await page.goto('/')

    await expect(
      page.getByRole('heading', { name: 'Ideas are just the beginning.' }),
    ).toBeVisible()
    await expect(page.getByRole('link', { name: 'Get Involved' })).toHaveAttribute(
      'href',
      '/contact',
    )

    const canvas = page.locator('.landing-hero canvas')
    await expect(canvas).toBeAttached()
    const readCanvasState = () =>
      canvas.evaluate((element) => {
        const canvasElement = element as HTMLCanvasElement
        const { width, height } = canvasElement
        const context = canvasElement.getContext('2d')
        const pixels = context?.getImageData(0, 0, width, height).data
        return {
          width,
          height,
          hasPaintedDots: pixels?.some((value, index) => index % 4 === 3 && value > 0),
        }
      })
    await expect.poll(async () => (await readCanvasState()).hasPaintedDots).toBe(true)
    const canvasState = await readCanvasState()
    expect(canvasState.width).toBeGreaterThan(0)
    expect(canvasState.height).toBeGreaterThan(0)
    expect(canvasState.hasPaintedDots).toBe(true)
  })

  test('dot colors follow the pointer and reset after it leaves the grid', async ({
    page,
  }) => {
    const width = page.viewportSize()?.width ?? 1280
    if (width < 768) {
      test.skip()
      return
    }

    await page.goto('/')
    const canvas = page.locator('.landing-hero canvas')
    await expect(canvas).toBeAttached()
    const bounds = await canvas.boundingBox()
    if (!bounds) throw new Error('DotGrid canvas has no layout bounds')

    const countHighlightedDots = () =>
      canvas.evaluate((element) => {
        const canvasElement = element as HTMLCanvasElement
        const context = canvasElement.getContext('2d')
        if (!context) return 0

        const { data } = context.getImageData(
          0,
          0,
          canvasElement.width,
          canvasElement.height,
        )
        let highlightedPixels = 0
        for (let index = 0; index < data.length; index += 4) {
          if (data[index + 3] > 0 && data[index + 1] < 120) {
            highlightedPixels++
          }
        }
        return highlightedPixels
      })

    const movePointerAway = () =>
      page.evaluate(() => {
        window.dispatchEvent(
          new MouseEvent('mousemove', { clientX: -1000, clientY: -1000 }),
        )
      })
    await page.mouse.move(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2)
    await expect.poll(countHighlightedDots).toBeGreaterThan(0)

    await page.waitForTimeout(60)
    await movePointerAway()
    await expect.poll(countHighlightedDots).toBe(0)
  })

  test('no canvas is mounted when reduced motion is requested', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')

    const canvas = page.locator('.landing-hero canvas')
    await expect(canvas).toHaveCount(0)
    await expect(page.locator('[data-testid="hero-static-dots"]')).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Ideas are just the beginning.' })).toBeVisible()
  })

  test('no canvas is mounted at 375px mobile width', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    const canvas = page.locator('.landing-hero canvas')
    await expect(canvas).toHaveCount(0)
    await expect(page.locator('[data-testid="hero-static-dots"]')).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Ideas are just the beginning.' })).toBeVisible()
  })
})

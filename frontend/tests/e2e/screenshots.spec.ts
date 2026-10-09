import { expect, test } from '@playwright/test'
import * as path from 'path'
import * as fs from 'fs'

const viewports = [
  { name: 'mobile-320', width: 320, height: 568 },
  { name: 'mobile', width: 375, height: 667 },
  { name: 'mobile-414', width: 414, height: 896 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'laptop', width: 1024, height: 768 },
  { name: 'desktop-short', width: 1280, height: 500 },
  { name: 'desktop', width: 1280, height: 720 },
  { name: 'wide-hd', width: 1600, height: 900 },
  { name: 'wide', width: 1920, height: 1080 },
]

test.describe('Visual Screenshots', () => {
  for (const vp of viewports) {
    test(`captures baseline screenshots at ${vp.width}x${vp.height} (${vp.name})`, async ({ page }, testInfo) => {
      // Run only on the matching Playwright project to avoid duplicate captures
      if (testInfo.project.name !== vp.name) {
        test.skip()
        return
      }

      await page.setViewportSize({ width: vp.width, height: vp.height })
      await page.emulateMedia({ reducedMotion: 'reduce' }) // animations disabled

      const screenshotsDir = path.resolve('tests/screenshots')
      if (!fs.existsSync(screenshotsDir)) {
        fs.mkdirSync(screenshotsDir, { recursive: true })
      }

      // 1. Hero settled
      await page.goto('/')
      await page.getByRole('heading', { level: 1 }).waitFor()
      await page.waitForTimeout(2000)
      const hero = page.locator('.landing-hero')
      await hero.screenshot({
        path: path.join(screenshotsDir, `hero-${vp.name}.png`),
      })

      // 2. Header closed
      await page.screenshot({
        path: path.join(screenshotsDir, `header-closed-${vp.name}.png`),
        fullPage: false,
      })

      // 2. Menu open
      const toggle = page.getByRole('button', { name: 'Menu' })
      await toggle.click()
      await expect(page.getByRole('button', { name: 'Close' })).toHaveAttribute(
        'aria-expanded',
        'true',
      )
      await page.waitForTimeout(2100)
      await page.screenshot({
        path: path.join(screenshotsDir, `menu-open-${vp.name}.png`),
        fullPage: false,
      })

      // Close menu: press Escape (more reliable than clicking the busy toggle again)
      await page.keyboard.press('Escape')
      await expect(page.getByRole('button', { name: 'Menu' })).toHaveAttribute(
        'aria-expanded',
        'false',
      )

      // 3. Footer
      const footer = page.locator('footer')
      await footer.scrollIntoViewIfNeeded()
      await page.waitForTimeout(200)
      await footer.screenshot({
        path: path.join(screenshotsDir, `footer-${vp.name}.png`),
      })
    })
  }
})

import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import * as path from 'path'
import * as fs from 'fs'

const ARTIFACT_DIR = '/Users/ashwath/.gemini/antigravity/brain/e5f93a03-591b-4d1a-b508-637fc6d68527'
const SCREENSHOTS_DIR = path.resolve('tests/screenshots')

function saveScreenshot(sourcePath: string, fileName: string) {
  if (!fs.existsSync(SCREENSHOTS_DIR)) {
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true })
  }
  if (!fs.existsSync(ARTIFACT_DIR)) {
    fs.mkdirSync(ARTIFACT_DIR, { recursive: true })
  }
  fs.copyFileSync(sourcePath, path.join(SCREENSHOTS_DIR, fileName))
  fs.copyFileSync(sourcePath, path.join(ARTIFACT_DIR, fileName))
}

test.describe('Floating Contact Us button and popup', () => {
  test('header contact button visibility, scrolling and positioning', async ({ page }, testInfo) => {
    if (testInfo.project.name !== 'desktop') { test.skip(); return }

    const consoleErrors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text())
    })

    // Test on /
    await page.setViewportSize({ width: 1280, height: 720 })
    await page.goto('/')
    await page.getByRole('heading', { level: 1 }).waitFor()

    const contactButton = page.getByRole('button', { name: 'Contact Us' })
    const menuToggle = page.locator('button.sm-toggle')
    const logoGroup = page.getByLabel('Brand and partner logos')

    await expect(contactButton).toBeVisible()
    await expect(menuToggle).toBeVisible()
    await expect(logoGroup).toBeVisible()

    // Assert it sits between logo group and Menu toggle (its x is between them)
    const cRect = await contactButton.boundingBox()
    const tRect = await menuToggle.boundingBox()
    const lRect = await logoGroup.boundingBox()

    expect(cRect).not.toBeNull()
    expect(tRect).not.toBeNull()
    expect(lRect).not.toBeNull()

    if (cRect && tRect && lRect) {
      expect(cRect.x).toBeGreaterThan(lRect.x + lRect.width)
      expect(cRect.x + cRect.width).toBeLessThanOrEqual(tRect.x)
      expect(tRect.x - (cRect.x + cRect.width)).toBeCloseTo(12, 1)
    }

    // Scroll 1500px and check still visible
    await page.evaluate(() => {
      document.documentElement.style.minHeight = '3000px'
      document.body.style.minHeight = '3000px'
      window.scrollTo(0, 1500)
    })
    await page.waitForTimeout(500)
    await expect(contactButton).toBeVisible()

    // Capture screenshot 1: header at 1280x720 with the button visible after scrolling
    const shot1Path = path.join(SCREENSHOTS_DIR, 'header-scrolled-1280x720.png')
    await page.screenshot({ path: shot1Path, fullPage: false })
    saveScreenshot(shot1Path, 'header-scrolled-1280x720.png')

    // Test on /projects as well
    await page.goto('/projects')
    await page.getByRole('heading', { level: 1 }).waitFor()
    const contactProjects = page.getByRole('button', { name: 'Contact Us' })
    await expect(contactProjects).toBeVisible()
    await page.evaluate(() => {
      document.documentElement.style.minHeight = '3000px'
      document.body.style.minHeight = '3000px'
      window.scrollTo(0, 1500)
    })
    await page.waitForTimeout(500)
    await expect(contactProjects).toBeVisible()

    expect(consoleErrors).toEqual([])
  })

  test('no overlap with logos or Menu at 320x568, 375x667, and 1280x720, and no horizontal overflow', async ({ page }, testInfo) => {
    if (testInfo.project.name !== 'desktop') { test.skip(); return }

    const consoleErrors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text())
    })

    const viewports = [
      { width: 320, height: 568 },
      { width: 375, height: 667 },
      { width: 1280, height: 720 },
    ]

    for (const vp of viewports) {
      await page.setViewportSize(vp)
      await page.goto('/')
      await page.getByRole('heading', { level: 1 }).waitFor()

      const contactBtn = page.getByRole('button', { name: 'Contact Us' })
      const toggle = page.locator('button.sm-toggle')
      const logos = page.getByLabel('Brand and partner logos')

      await expect(contactBtn).toBeVisible()
      await expect(toggle).toBeVisible()
      await expect(logos).toBeVisible()

      const cRect = await contactBtn.boundingBox()
      const tRect = await toggle.boundingBox()
      const lRect = await logos.boundingBox()

      expect(cRect).not.toBeNull()
      expect(tRect).not.toBeNull()
      expect(lRect).not.toBeNull()

      if (cRect && tRect && lRect) {
        // No overlap: logos right <= contact left, and contact right <= toggle left
        expect(lRect.x + lRect.width, `Logo overlaps button at ${vp.width}px`).toBeLessThanOrEqual(cRect.x + 0.5)
        expect(cRect.x + cRect.width, `Button overlaps toggle at ${vp.width}px`).toBeLessThanOrEqual(tRect.x + 0.5)
      }

      // Check horizontal overflow at 320 and 1280
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth
      })
      expect(hasHorizontalScroll, `Horizontal overflow detected at ${vp.width}px`).toBe(false)
    }

    expect(consoleErrors).toEqual([])
  })

  test('Contact button hides while the Menu is open', async ({ page }, testInfo) => {
    if (testInfo.project.name !== 'desktop') { test.skip(); return }

    const consoleErrors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text())
    })

    await page.setViewportSize({ width: 1280, height: 720 })
    await page.goto('/')
    await page.getByRole('heading', { level: 1 }).waitFor()

    const contactBtn = page.locator('.contact-button')
    const menuToggle = page.locator('button.sm-toggle')

    await expect(contactBtn).toBeVisible()
    await expect(contactBtn).toHaveCSS('opacity', '1')

    await menuToggle.click()
    await expect(menuToggle).toHaveAttribute('aria-expanded', 'true')
    await page.waitForTimeout(200)

    // Button should be hidden (opacity 0, pointer-events none, aria-hidden)
    await expect(contactBtn).toHaveCSS('opacity', '0')
    await expect(contactBtn).toHaveCSS('pointer-events', 'none')
    await expect(contactBtn).toHaveAttribute('aria-hidden', 'true')

    // Close menu
    await page.keyboard.press('Escape')
    await expect(menuToggle).toHaveAttribute('aria-expanded', 'false')
    await page.waitForTimeout(200)
    await expect(contactBtn).toHaveCSS('opacity', '1')
    await expect(contactBtn).toHaveCSS('pointer-events', 'auto')

    expect(consoleErrors).toEqual([])
  })

  test('dialog interaction, validation, toast, Escape close, and axe accessibility', async ({ page }, testInfo) => {
    if (testInfo.project.name !== 'desktop') { test.skip(); return }

    const consoleErrors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text())
    })

    await page.setViewportSize({ width: 1280, height: 720 })
    await page.goto('/')
    await page.getByRole('heading', { level: 1 }).waitFor()

    const contactBtn = page.getByRole('button', { name: 'Contact Us' })
    await contactBtn.click()

    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    await page.waitForTimeout(300)

    // Assert focus is inside dialog
    const isFocusInside = await dialog.evaluate((el) => el.contains(document.activeElement))
    expect(isFocusInside, 'Focus should be inside dialog upon opening').toBe(true)

    // Check centered card on desktop 1280x720
    const dRect = await dialog.boundingBox()
    expect(dRect).not.toBeNull()
    if (dRect) {
      expect(dRect.width).toBeLessThanOrEqual(440)
      const centerX = dRect.x + dRect.width / 2
      expect(Math.abs(centerX - 640)).toBeLessThanOrEqual(10)
    }

    // Capture screenshot 2: dialog open at 1280x720
    const shot2Path = path.join(SCREENSHOTS_DIR, 'dialog-open-1280x720.png')
    await page.screenshot({ path: shot2Path, fullPage: false })
    saveScreenshot(shot2Path, 'dialog-open-1280x720.png')

    // Axe accessibility analysis with dialog open
    const axeResults = await new AxeBuilder({ page }).analyze()
    expect(axeResults.violations).toEqual([])

    // Submit empty shows three errors
    const submitBtn = dialog.getByRole('button', { name: 'Submit' })
    await submitBtn.click()

    const nameError = page.locator('#contact-name-error')
    const phoneError = page.locator('#contact-phone-error')
    const emailError = page.locator('#contact-email-error')

    await expect(nameError).toBeVisible()
    await expect(nameError).toHaveText('Enter your full name')
    await expect(phoneError).toBeVisible()
    await expect(phoneError).toHaveText('Enter a valid phone number')
    await expect(emailError).toBeVisible()
    await expect(emailError).toHaveText('Enter a valid email address')

    // First invalid field is focused
    await expect(page.locator('#contact-name')).toBeFocused()

    // Invalid email test
    await page.locator('#contact-name').fill('John Doe')
    await page.locator('#contact-phone').fill('+1 (555) 123-4567')
    await page.locator('#contact-email').fill('notanemail')
    await submitBtn.click()

    await expect(emailError).toBeVisible()
    await expect(emailError).toHaveText('Enter a valid email address')
    await expect(page.locator('#contact-email')).toBeFocused()

    // Escape closes dialog and returns focus to Contact Us button
    await page.keyboard.press('Escape')
    await expect(dialog).not.toBeVisible()
    await page.waitForTimeout(200)
    await expect(contactBtn).toBeFocused()

    // Reopen dialog and perform valid submit
    await contactBtn.click()
    await expect(dialog).toBeVisible()
    await page.waitForTimeout(300)

    await page.locator('#contact-name').fill('John Doe')
    await page.locator('#contact-phone').fill('+1 (555) 123-4567')
    await page.locator('#contact-email').fill('john@example.com')
    await submitBtn.click()

    // Dialog closes and toast appears
    await expect(dialog).not.toBeVisible()
    const toast = page.getByRole('status')
    await expect(toast).toBeVisible()
    await expect(toast).toHaveText('We will reach you')

    // Toast disappears within about 3 seconds
    await page.waitForTimeout(3000)
    await expect(toast).not.toBeVisible()

    expect(consoleErrors).toEqual([])
  })

  test('mobile 375x667 bottom sheet layout and submit visibility', async ({ page }, testInfo) => {
    if (testInfo.project.name !== 'desktop') { test.skip(); return }

    const consoleErrors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text())
    })

    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    await page.getByRole('heading', { level: 1 }).waitFor()

    const contactBtn = page.getByRole('button', { name: 'Contact Us' })
    await contactBtn.click()

    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    await page.waitForTimeout(350) // Wait for slide up transition

    const submitBtn = dialog.getByRole('button', { name: 'Submit' })
    await expect(submitBtn).toBeVisible()

    // Assert bottom sheet layout: attached to bottom, full width
    const dRect = await dialog.boundingBox()
    const sRect = await submitBtn.boundingBox()
    expect(dRect).not.toBeNull()
    expect(sRect).not.toBeNull()

    if (dRect && sRect) {
      expect(dRect.width).toBeCloseTo(375, 1)
      expect(dRect.y + dRect.height).toBeCloseTo(667, 1)
      // Submit button is inside viewport
      expect(sRect.y + sRect.height).toBeLessThanOrEqual(667)
    }

    // Capture screenshot 3: dialog open at 375x667
    const shot3Path = path.join(SCREENSHOTS_DIR, 'dialog-open-375x667.png')
    await page.screenshot({ path: shot3Path, fullPage: false })
    saveScreenshot(shot3Path, 'dialog-open-375x667.png')

    expect(consoleErrors).toEqual([])
  })
})

import { expect, test, type Page } from '@playwright/test'

async function makePageScrollable(page: Page) {
  await page.evaluate(async () => {
    document.documentElement.style.minHeight = '200vh'
    document.body.style.minHeight = '200vh'
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))
  })
}

test.describe('Header and LogoGroup', () => {
  test('4 logo images are present in the header on /', async ({ page }) => {
    await page.goto('/')
    const logos = page.locator('header img[alt*="Logo"]')
    await expect(logos).toHaveCount(4)
    for (let i = 0; i < 4; i++) {
      await expect(logos.nth(i)).toBeVisible()
    }
  })

  test('Logos hide after scrolling down 900px and return after scrolling up', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('heading', { level: 1 }).waitFor()
    await makePageScrollable(page)
    const logoContainer = page.locator('header [aria-label="Brand and partner logos"]').locator('..')
    await expect(logoContainer).toBeVisible()

    // Scroll down past 70 % of viewport height (threshold). window.scrollTo fires a
    // native 'scroll' event synchronously, which Header's listener picks up.
    await page.evaluate(() => window.scrollTo(0, 900))
    // Wait for GSAP animation to complete (0.3 s duration + margin)
    await page.waitForTimeout(500)
    await expect(logoContainer).toHaveCSS('opacity', '0')

    // Scroll back up to top
    await page.evaluate(() => window.scrollTo(0, 0))
    await page.waitForTimeout(500)
    await expect(logoContainer).toHaveCSS('opacity', '1')
  })

  test('Reduced motion: page works, logos toggle without errors', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    await page.getByRole('heading', { level: 1 }).waitFor()
    await makePageScrollable(page)

    const logoContainer = page.locator('header [aria-label="Brand and partner logos"]').locator('..')
    await expect(logoContainer).toBeVisible()

    await page.evaluate(() => window.scrollTo(0, 900))
    await page.waitForTimeout(300)
    await expect(logoContainer).toHaveCSS('opacity', '0')

    await page.evaluate(() => window.scrollTo(0, 0))
    await page.waitForTimeout(300)
    await expect(logoContainer).toHaveCSS('opacity', '1')
  })
})

test.describe('StaggeredMenu', () => {
  test('Menu toggle opens menu, all 5 items visible, and Escape closes returning focus', async ({ page }) => {
    await page.goto('/')
    const toggle = page.locator('button.sm-toggle')
    await expect(toggle).toBeVisible()
    await expect(toggle).toHaveAttribute('aria-expanded', 'false')

    // Open menu
    await toggle.click()
    await expect(toggle).toHaveAttribute('aria-expanded', 'true')

    const menuItems = page.locator('#staggered-menu-panel .sm-panel-item')
    await expect(menuItems).toHaveCount(5)
    await expect(menuItems.nth(0)).toHaveText('Home')
    await expect(menuItems.nth(1)).toHaveText('About')
    await expect(menuItems.nth(2)).toHaveText('Projects')
    await expect(menuItems.nth(3)).toHaveText('Team')
    await expect(menuItems.nth(4)).toHaveText('Contact Us')

    // Press Escape to close and check focus
    await page.keyboard.press('Escape')
    await expect(toggle).toHaveAttribute('aria-expanded', 'false')
    await expect(toggle).toBeFocused()
  })

  test('Clicking Projects navigates to /projects WITHOUT full reload, menu closes after navigation', async ({ page }) => {
    await page.goto('/')

    // Set marker on window to detect full page reload
    await page.evaluate(() => {
      (window as unknown as { __marker: boolean }).__marker = true
    })

    const toggle = page.locator('button.sm-toggle')
    await toggle.click()

    const projectsLink = page.locator('#staggered-menu-panel a', { hasText: 'Projects' })
    await projectsLink.click()

    // Assert URL navigated to /projects
    await page.waitForURL('**/projects')
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Projects')

    // Assert marker still exists (SPA client-side navigation without reload)
    const markerExists = await page.evaluate(() => {
      return (window as unknown as { __marker?: boolean }).__marker === true
    })
    expect(markerExists).toBe(true)

    // Assert menu closed
    await expect(toggle).toHaveAttribute('aria-expanded', 'false')
  })
})

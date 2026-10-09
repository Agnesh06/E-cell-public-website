import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

const routes = [
  '/',
  '/projects',
  '/team',
  '/contact',
]

for (const route of routes) {
  test(`has no accessibility violations at ${route} with menu closed`, async ({ page }) => {
    await page.goto(route)
    await page.getByRole('heading', { level: 1 }).waitFor()
    const results = await new AxeBuilder({ page }).analyze()
    expect(results.violations).toEqual([])
  })
}

test('has no accessibility violations on / with menu open', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('heading', { level: 1 }).waitFor()
  const toggle = page.locator('button.sm-toggle')
  await toggle.click()
  // Wait for menu open GSAP timeline to fully complete entrance and clear opacity
  await page.waitForTimeout(1200)
  const results = await new AxeBuilder({ page }).analyze()
  expect(results.violations).toEqual([])
})

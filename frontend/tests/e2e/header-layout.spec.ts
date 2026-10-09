/**
 * header-layout.spec.ts
 *
 * Asserts:
 *  - Toggle right edge is within 48px of the viewport right edge (closed and open)
 *  - Toggle vertical centre is within 4px of the logo row's vertical centre
 *  - "Contact Us" panel item height < 1.5× its font-size at 1280 and 1600
 *
 * Runs at 1280×720 (desktop), 1600×900 (wide-hd), and 375×812 (mobile).
 * Uses per-test `test.skip()` (no-arg form) inside the test body to skip on
 * non-matching projects, which avoids Playwright's destructuring requirement.
 */
import { expect, test } from '@playwright/test'

// Helper: get a bounding rect via evaluate
async function getRect(
  page: import('@playwright/test').Page,
  locator: import('@playwright/test').Locator,
) {
  const handle = await locator.elementHandle()
  if (!handle) throw new Error('Element not found')
  return page.evaluate((el) => {
    const r = el.getBoundingClientRect()
    return { top: r.top, bottom: r.bottom, left: r.left, right: r.right, width: r.width, height: r.height }
  }, handle)
}

// ── Toggle right-edge position ───────────────────────────────────────────────

test.describe('Header alignment', () => {
  test('toggle right edge is within 48px of viewport right (closed) [desktop]', async ({ page }, testInfo) => {
    if (testInfo.project.name !== 'desktop') { test.skip(); return }
    await page.goto('/')
    await page.getByRole('heading', { level: 1 }).waitFor()
    const toggle = page.locator('button.sm-toggle')
    const vw = page.viewportSize()!.width
    const rect = await getRect(page, toggle)
    expect(vw - rect.right, `right distance should be ≤ 48px, got ${vw - rect.right}px`).toBeLessThanOrEqual(48)
  })

  test('toggle right edge is within 48px of viewport right (open) [desktop]', async ({ page }, testInfo) => {
    if (testInfo.project.name !== 'desktop') { test.skip(); return }
    await page.goto('/')
    await page.getByRole('heading', { level: 1 }).waitFor()
    const toggle = page.locator('button.sm-toggle')
    await toggle.click()
    await expect(toggle).toHaveAttribute('aria-expanded', 'true')
    await page.waitForTimeout(200)
    const vw = page.viewportSize()!.width
    const rect = await getRect(page, toggle)
    expect(vw - rect.right, `right distance (open) should be ≤ 48px, got ${vw - rect.right}px`).toBeLessThanOrEqual(48)
    await page.keyboard.press('Escape')
  })

  test('toggle right edge is within 48px of viewport right (closed) [wide-hd]', async ({ page }, testInfo) => {
    if (testInfo.project.name !== 'wide-hd') { test.skip(); return }
    await page.goto('/')
    await page.getByRole('heading', { level: 1 }).waitFor()
    const toggle = page.locator('button.sm-toggle')
    const vw = page.viewportSize()!.width
    const rect = await getRect(page, toggle)
    expect(vw - rect.right, `right distance should be ≤ 48px, got ${vw - rect.right}px`).toBeLessThanOrEqual(48)
  })

  test('toggle right edge is within 48px of viewport right (open) [wide-hd]', async ({ page }, testInfo) => {
    if (testInfo.project.name !== 'wide-hd') { test.skip(); return }
    await page.goto('/')
    await page.getByRole('heading', { level: 1 }).waitFor()
    const toggle = page.locator('button.sm-toggle')
    await toggle.click()
    await expect(toggle).toHaveAttribute('aria-expanded', 'true')
    await page.waitForTimeout(200)
    const vw = page.viewportSize()!.width
    const rect = await getRect(page, toggle)
    expect(vw - rect.right, `right distance (open) should be ≤ 48px, got ${vw - rect.right}px`).toBeLessThanOrEqual(48)
    await page.keyboard.press('Escape')
  })

  test('toggle right edge is within 48px of viewport right (closed) [mobile]', async ({ page }, testInfo) => {
    if (testInfo.project.name !== 'mobile') { test.skip(); return }
    await page.goto('/')
    await page.getByRole('heading', { level: 1 }).waitFor()
    const toggle = page.locator('button.sm-toggle')
    const vw = page.viewportSize()!.width
    const rect = await getRect(page, toggle)
    expect(vw - rect.right, `right distance should be ≤ 48px, got ${vw - rect.right}px`).toBeLessThanOrEqual(48)
  })

  test('toggle right edge is within 48px of viewport right (open) [mobile]', async ({ page }, testInfo) => {
    if (testInfo.project.name !== 'mobile') { test.skip(); return }
    await page.goto('/')
    await page.getByRole('heading', { level: 1 }).waitFor()
    const toggle = page.locator('button.sm-toggle')
    await toggle.click()
    await expect(toggle).toHaveAttribute('aria-expanded', 'true')
    await page.waitForTimeout(200)
    const vw = page.viewportSize()!.width
    const rect = await getRect(page, toggle)
    expect(vw - rect.right, `right distance (open) should be ≤ 48px, got ${vw - rect.right}px`).toBeLessThanOrEqual(48)
    await page.keyboard.press('Escape')
  })

  // ── Vertical alignment ───────────────────────────────────────────────────

  test('toggle vertical centre matches logo row within 4px [desktop]', async ({ page }, testInfo) => {
    if (testInfo.project.name !== 'desktop') { test.skip(); return }
    await page.goto('/')
    await page.getByRole('heading', { level: 1 }).waitFor()
    const toggle = page.locator('button.sm-toggle')
    const logoGroup = page.locator('header [aria-label="Brand and partner logos"]')
    const tr = await getRect(page, toggle)
    const lr = await getRect(page, logoGroup)
    const diff = Math.abs((tr.top + tr.bottom) / 2 - (lr.top + lr.bottom) / 2)
    expect(diff, `vertical centre diff should be ≤ 4px, got ${diff.toFixed(1)}px`).toBeLessThanOrEqual(4)
  })

  test('toggle vertical centre matches logo row within 4px [wide-hd]', async ({ page }, testInfo) => {
    if (testInfo.project.name !== 'wide-hd') { test.skip(); return }
    await page.goto('/')
    await page.getByRole('heading', { level: 1 }).waitFor()
    const toggle = page.locator('button.sm-toggle')
    const logoGroup = page.locator('header [aria-label="Brand and partner logos"]')
    const tr = await getRect(page, toggle)
    const lr = await getRect(page, logoGroup)
    const diff = Math.abs((tr.top + tr.bottom) / 2 - (lr.top + lr.bottom) / 2)
    expect(diff, `vertical centre diff should be ≤ 4px, got ${diff.toFixed(1)}px`).toBeLessThanOrEqual(4)
  })

  test('toggle vertical centre matches logo row within 4px [mobile]', async ({ page }, testInfo) => {
    if (testInfo.project.name !== 'mobile') { test.skip(); return }
    await page.goto('/')
    await page.getByRole('heading', { level: 1 }).waitFor()
    const toggle = page.locator('button.sm-toggle')
    const logoGroup = page.locator('header [aria-label="Brand and partner logos"]')
    const tr = await getRect(page, toggle)
    const lr = await getRect(page, logoGroup)
    const diff = Math.abs((tr.top + tr.bottom) / 2 - (lr.top + lr.bottom) / 2)
    expect(diff, `vertical centre diff should be ≤ 4px, got ${diff.toFixed(1)}px`).toBeLessThanOrEqual(4)
  })
})

// ── Contact Us single-line check ─────────────────────────────────────────────

test.describe('"Contact Us" single-line', () => {
  test('"Contact Us" height < 1.5× font-size (no wrap) [desktop]', async ({ page }, testInfo) => {
    if (testInfo.project.name !== 'desktop') { test.skip(); return }
    await page.goto('/')
    await page.getByRole('heading', { level: 1 }).waitFor()
    const toggle = page.locator('button.sm-toggle')
    await toggle.click()
    await expect(toggle).toHaveAttribute('aria-expanded', 'true')
    await page.waitForTimeout(300)
    const { itemHeight, fontSize } = await page.evaluate(() => {
      const el = document.querySelector('#staggered-menu-panel .sm-panel-item:last-child') as HTMLElement
      if (!el) return { itemHeight: 0, fontSize: 16 }
      return { itemHeight: el.getBoundingClientRect().height, fontSize: parseFloat(window.getComputedStyle(el).fontSize) }
    })
    expect(itemHeight, `"Contact Us" height (${itemHeight.toFixed(1)}px) should be < 1.5× font-size (${fontSize.toFixed(1)}px)`).toBeLessThan(fontSize * 1.5)
    await page.keyboard.press('Escape')
  })

  test('"Contact Us" height < 1.5× font-size (no wrap) [wide-hd]', async ({ page }, testInfo) => {
    if (testInfo.project.name !== 'wide-hd') { test.skip(); return }
    await page.goto('/')
    await page.getByRole('heading', { level: 1 }).waitFor()
    const toggle = page.locator('button.sm-toggle')
    await toggle.click()
    await expect(toggle).toHaveAttribute('aria-expanded', 'true')
    await page.waitForTimeout(300)
    const { itemHeight, fontSize } = await page.evaluate(() => {
      const el = document.querySelector('#staggered-menu-panel .sm-panel-item:last-child') as HTMLElement
      if (!el) return { itemHeight: 0, fontSize: 16 }
      return { itemHeight: el.getBoundingClientRect().height, fontSize: parseFloat(window.getComputedStyle(el).fontSize) }
    })
    expect(itemHeight, `"Contact Us" height (${itemHeight.toFixed(1)}px) should be < 1.5× font-size (${fontSize.toFixed(1)}px)`).toBeLessThan(fontSize * 1.5)
    await page.keyboard.press('Escape')
  })
})


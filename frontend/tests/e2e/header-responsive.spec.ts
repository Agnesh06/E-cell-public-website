import { expect, test, type Locator, type Page } from '@playwright/test'

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

async function rect(locator: Locator) {
  return locator.evaluate((element) => {
    const { top, right, bottom, left, width, height } = element.getBoundingClientRect()
    return { top, right, bottom, left, width, height }
  })
}

async function waitForViewportWidth(page: Page) {
  await page.waitForFunction(() => {
    const header = document.querySelector('.site-header')
    return (
      header?.getAttribute('style')?.includes(
        `${document.documentElement.clientWidth}px`,
      ) ?? false
    )
  })
}

async function assertHeaderGeometry(page: Page, width: number) {
  const toggle = page.getByRole('button', { name: /menu|close/i })
  const logoGroup = page.getByLabel('Brand and partner logos')
  const toggleRect = await rect(toggle)
  const logoRect = await rect(logoGroup)
  const clientWidth = await page.evaluate(() => document.documentElement.clientWidth)
  const gutter = width < 640 ? 24 : 40
  const centerDifference = Math.abs(
    (logoRect.left + logoRect.right) / 2 - clientWidth / 2,
  )

  expect(centerDifference, `logo center error at ${width}px`).toBeLessThanOrEqual(
    width < 360 ? 4 : 2,
  )
  expect(
    toggleRect.left - logoRect.right,
    `logo/toggle gap at ${width}px`,
  ).toBeGreaterThanOrEqual(8)
  expect(logoRect.left, `left gutter at ${width}px`).toBeGreaterThanOrEqual(
    gutter + 8,
  )
  expect(clientWidth - toggleRect.right, `toggle right edge at ${width}px`)
    .toBeLessThanOrEqual(48)
  expect(
    Math.abs(
      (toggleRect.top + toggleRect.bottom) / 2 -
        (logoRect.top + logoRect.bottom) / 2,
    ),
    `vertical center difference at ${width}px`,
  ).toBeLessThanOrEqual(4)
}

async function assertOpenMenuLayout(page: Page, width: number) {
  const toggle = page.getByRole('button', { name: 'Close' })
  const logoGroup = page.getByLabel('Brand and partner logos')
  const panel = page.getByRole('complementary')
  const socialRow = page.getByLabel('Social links')
  const itemLinks = page.getByRole('link', { name: /^Navigate to / })

  await expect(toggle).toHaveAttribute('aria-expanded', 'true')
  await expect(logoGroup).toHaveCSS('opacity', '0')
  await assertHeaderGeometry(page, width)

  const panelRect = await rect(panel)
  const clientWidth = await page.evaluate(() => document.documentElement.clientWidth)
  const expectedPanelWidth =
    width < 640 ? clientWidth : Math.min(520, Math.max(360, width * 0.32))
  expect(panelRect.right).toBeCloseTo(clientWidth, 0)
  expect(panelRect.width).toBeCloseTo(expectedPanelWidth, 0)

  const toggleRect = await rect(toggle)
  const socialRect = await rect(socialRow)
  const itemRects = await Promise.all(
    (await itemLinks.all()).map((item) => rect(item)),
  )

  for (let index = 0; index < itemRects.length; index++) {
    const item = itemRects[index]
    expect(item.right).toBeLessThanOrEqual(
      clientWidth,
    )
    expect(
      item.bottom <= socialRect.top || item.top >= socialRect.bottom,
      `menu item ${index + 1} intersects Socials at ${width}px`,
    ).toBe(true)
    expect(
      item.bottom <= toggleRect.top || item.top >= toggleRect.bottom,
      `menu item ${index + 1} intersects the toggle at ${width}px`,
    ).toBe(true)

    if (index > 0) {
      const previous = itemRects[index - 1]
      expect(
        item.bottom <= previous.top || item.top >= previous.bottom,
        `menu items ${index} and ${index + 1} intersect at ${width}px`,
      ).toBe(true)
    }
  }

  const overflow = await page.evaluate(() => {
    const menuPanel = document.querySelector('#staggered-menu-panel')
    return {
      document: document.documentElement.scrollWidth <= document.documentElement.clientWidth,
      panel:
        menuPanel instanceof HTMLElement &&
        menuPanel.scrollWidth <= menuPanel.clientWidth,
    }
  })
  expect(overflow.document, `document has horizontal overflow at ${width}px`).toBe(true)
  expect(overflow.panel, `menu panel has horizontal overflow at ${width}px`).toBe(true)
  await expect(panel).toBeVisible()
}

for (const viewport of viewports) {
  test(`header and menu fit at ${viewport.width}x${viewport.height}`, async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== viewport.name)
    await page.setViewportSize({ width: viewport.width, height: viewport.height })
    await page.goto('/')
    await page.getByRole('heading', { level: 1 }).waitFor()
    await waitForViewportWidth(page)

    const images = page.getByRole('img', { name: /Logo [1-4]/ })
    await expect(images).toHaveCount(4)
    for (let index = 0; index < 4; index++) {
      await expect(images.nth(index)).toBeVisible()
    }

    const closedToggle = page.getByRole('button', { name: 'Menu' })
    await expect(closedToggle).toBeVisible()
    await assertHeaderGeometry(page, viewport.width)

    if (viewport.width < 480) {
      await expect(closedToggle.locator('.sm-toggle-textWrap')).toHaveCSS(
        'display',
        'none',
      )
      const touchTarget = await rect(closedToggle)
      expect(touchTarget.width).toBe(44)
      expect(touchTarget.height).toBe(44)
    }

    await closedToggle.click()
    await expect(page.getByRole('button', { name: 'Close' })).toHaveAttribute(
      'aria-expanded',
      'true',
    )
    await page.waitForTimeout(2100)
    await assertOpenMenuLayout(page, viewport.width)

    if (viewport.width >= 1024) {
      const contact = page.getByRole('link', { name: 'Navigate to Contact Us' })
      const contactSize = await contact.evaluate((element) => ({
        height: element.getBoundingClientRect().height,
        fontSize: parseFloat(getComputedStyle(element).fontSize),
      }))
      expect(contactSize.height).toBeLessThan(contactSize.fontSize * 1.5)
    }
  })
}

test('open menu remains clear when resized between desktop and short/mobile viewports', async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop')
  await page.setViewportSize({ width: 1280, height: 720 })
  await page.goto('/')
  const toggle = page.getByRole('button', { name: 'Menu' })
  await toggle.click()
  await expect(page.getByRole('button', { name: 'Close' })).toHaveAttribute(
    'aria-expanded',
    'true',
  )
  await page.waitForTimeout(2100)

  for (const viewport of [
    { width: 1280, height: 720 },
    { width: 375, height: 667 },
    { width: 1280, height: 500 },
  ]) {
    await page.setViewportSize(viewport)
    await waitForViewportWidth(page)
    await assertOpenMenuLayout(page, viewport.width)
  }
})

test('open menu fits minimum-height mobile viewports', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop')
  await page.setViewportSize({ width: 1280, height: 720 })
  await page.goto('/')
  await page.getByRole('button', { name: 'Menu' }).click()
  await expect(page.getByRole('button', { name: 'Close' })).toHaveAttribute(
    'aria-expanded',
    'true',
  )
  await page.waitForTimeout(2100)

  for (const viewport of [
    { width: 320, height: 480 },
    { width: 375, height: 568 },
  ]) {
    await page.setViewportSize(viewport)
    await waitForViewportWidth(page)
    await assertOpenMenuLayout(page, viewport.width)
  }
})

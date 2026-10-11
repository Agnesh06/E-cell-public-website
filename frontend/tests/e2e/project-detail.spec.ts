import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Project Details Page E2E Tests', () => {
  const testSlug = 'campus-connect'

  test('renders project details page with title and metadata', async ({ page }) => {
    await page.goto(`/projects/${testSlug}`)
    const heading = page.getByRole('heading', { level: 1 })
    await expect(heading).toBeVisible()
    await expect(heading).toHaveText('Campus Connect')

    // Document title
    await expect(page).toHaveTitle(/Campus Connect \| PSG Tech E-Cell/)
  })

  test('all 7 required details appear in the exact specified order', async ({ page }) => {
    await page.goto(`/projects/${testSlug}`)
    await page.getByRole('heading', { level: 1 }).waitFor()

    const sections = page.locator('section[data-detail-item]')
    await expect(sections).toHaveCount(7)

    const expectedLabels = [
      'detail-heading-image',
      'detail-heading-description',
      'detail-heading-cost',
      'detail-heading-feasibility',
      'detail-heading-impact',
      'detail-heading-tech-approach',
      'detail-heading-contact',
    ]

    for (let i = 0; i < expectedLabels.length; i++) {
      const section = sections.nth(i)
      const labelledBy = await section.getAttribute('aria-labelledby')
      expect(labelledBy).toBe(expectedLabels[i])
      expect(await section.getAttribute('data-detail-item')).toBe(String(i + 1))

      // Ensure the section is visible
      await expect(section).toBeVisible()
    }
  })

  test('Contact Us button is visible in section 7 and navigates to /contact', async ({ page }) => {
    await page.goto(`/projects/${testSlug}`)
    const contactSection = page.locator('section[aria-labelledby="detail-heading-contact"]')
    await expect(contactSection).toBeVisible()

    const contactButton = contactSection.getByRole('link', { name: 'Contact Us' })
    await expect(contactButton).toBeVisible()
    expect(await contactButton.getAttribute('href')).toBe('/contact')

    await contactButton.click()
    await page.waitForURL(/\/contact$/, { timeout: 5000 })
    expect(page.url()).toMatch(/\/contact$/)
  })

  test('displays image placeholder gracefully when project image is not set', async ({ page }) => {
    await page.goto(`/projects/${testSlug}`)
    const imageSection = page.locator('section[aria-labelledby="detail-heading-image"]')
    const img = imageSection.locator('img')
    await expect(img).toBeVisible()

    const src = await img.getAttribute('src')
    expect(src).toBeTruthy()
    expect(src).toContain('data:image/svg+xml')

    const placeholderBadge = imageSection.getByText('Image Placeholder')
    await expect(placeholderBadge).toBeVisible()
  })

  test('displays "To be estimated" when cost information is pending (e.g. MediTrack)', async ({ page }) => {
    await page.goto('/projects/meditrack')
    const costSection = page.locator('section[aria-labelledby="detail-heading-cost"]')
    await expect(costSection).toBeVisible()

    await expect(costSection.getByText('To be estimated', { exact: true })).toBeVisible()
  })

  test('displays Technology Stack for technical projects and Approach for non-technical projects', async ({
    page,
  }) => {
    // Technical: Campus Connect
    await page.goto('/projects/campus-connect')
    const techSection = page.locator('section[aria-labelledby="detail-heading-tech-approach"]')
    await expect(techSection).toContainText('Technology Stack')

    // Non-Technical: Alumni Venture Network
    await page.goto('/projects/placeholder-project-two')
    const approachSection = page.locator('section[aria-labelledby="detail-heading-tech-approach"]')
    await expect(approachSection).toContainText('Methodology & Approach')
  })

  test('renders friendly not-found page for invalid project slugs', async ({ page }) => {
    await page.goto('/projects/unknown-invalid-slug')
    const h1 = page.getByRole('heading', { level: 1 })
    await expect(h1).toHaveText('Project Details')
    await expect(page.getByText('Project Not Found')).toBeVisible()

    const backButton = page.getByRole('link', { name: 'Back to All Projects' })
    await expect(backButton).toBeVisible()
    await backButton.click()
    await page.waitForURL(/\/projects$/, { timeout: 5000 })
  })

  test('adjacent project navigation links work', async ({ page }) => {
    await page.goto('/projects/placeholder-project-two')
    const pagination = page.locator('nav[aria-label="Project pagination"]')
    await expect(pagination).toBeVisible()

    const prevLink = pagination.getByRole('link', { name: /Previous:/ })
    await expect(prevLink).toBeVisible()
    expect(await prevLink.getAttribute('href')).toBe('/projects/placeholder-project-one')

    const nextLink = pagination.getByRole('link', { name: /Next:/ })
    await expect(nextLink).toBeVisible()
    expect(await nextLink.getAttribute('href')).toBe('/projects/placeholder-project-three')
  })

  const viewports = [
    { width: 320, height: 568, name: 'mobile (320px)' },
    { width: 375, height: 667, name: 'mobile (375px)' },
    { width: 768, height: 1024, name: 'tablet (768px)' },
    { width: 1280, height: 720, name: 'desktop (1280px)' },
  ]

  for (const vp of viewports) {
    test(`no horizontal overflow at ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height })
      await page.goto(`/projects/${testSlug}`)
      await page.getByRole('heading', { level: 1 }).waitFor()

      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth)
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1)
    })
  }

  test('axe accessibility check passes on project details page', async ({ page }) => {
    await page.goto(`/projects/${testSlug}`)
    await page.getByRole('heading', { level: 1 }).waitFor()

    const results = await new AxeBuilder({ page })
      .disableRules(['color-contrast'])
      .analyze()

    expect(results.violations).toEqual([])
  })

  test('no console errors on project details page', async ({ page }) => {
    const errors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })

    await page.goto(`/projects/${testSlug}`)
    await page.getByRole('heading', { level: 1 }).waitFor()
    await page.waitForTimeout(500)

    expect(errors).toEqual([])
  })

  test('captures screenshots of project details page across viewports', async ({ page }) => {
    const shotConfigs = [
      { name: 'project-detail-desktop-1280.png', width: 1280, height: 800 },
      { name: 'project-detail-tablet-768.png', width: 768, height: 1024 },
      { name: 'project-detail-mobile-375.png', width: 375, height: 812 },
    ]

    for (const conf of shotConfigs) {
      await page.setViewportSize({ width: conf.width, height: conf.height })
      await page.goto(`/projects/${testSlug}`)
      await page.getByRole('heading', { level: 1 }).waitFor()
      await page.waitForTimeout(300)

      await page.screenshot({
        path: `tests/screenshots/${conf.name}`,
        fullPage: true,
      })
    }
  })
})

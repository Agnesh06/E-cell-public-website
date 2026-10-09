import { expect, test } from '@playwright/test'

test.describe('Footer', () => {
  test('renders tagline, copyright line, CSEA link href and target="_blank"', async ({ page }) => {
    await page.goto('/')

    const footer = page.locator('footer')
    await expect(footer).toBeVisible()

    // Tagline
    await expect(footer).toContainText('Ideate. Collaborate. Build.')

    // Copyright line
    const currentYear = new Date().getFullYear()
    await expect(footer).toContainText(`© ${currentYear} CSEA E-Cell, PSG College of Technology, Coimbatore`)

    // CSEA link
    const cseaLink = footer.locator('a[aria-label="CSEA Official Website (opens in new tab)"]')
    await expect(cseaLink).toBeVisible()
    await expect(cseaLink).toHaveAttribute('href', /https:\/\/csea\.psgtech\.ac\.in/)
    await expect(cseaLink).toHaveAttribute('target', '_blank')
    await expect(cseaLink).toHaveAttribute('rel', 'noopener noreferrer')
  })
})

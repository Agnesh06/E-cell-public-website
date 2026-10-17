import { expect, test } from '@playwright/test'

test.describe('Footer', () => {
  test('renders GitHub, LinkedIn, and CSEA social links and no Twitter link', async ({ page }) => {
    await page.goto('/')

    const footer = page.locator('footer')
    await expect(footer).toBeVisible()

    // GitHub link
    const githubLink = footer.locator('a[aria-label="CSEA on GitHub"]')
    await expect(githubLink).toBeVisible()
    await expect(githubLink).toHaveAttribute('href', 'https://github.com/CSEA-PSGTech')
    await expect(githubLink).toHaveAttribute('target', '_blank')
    await expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer')

    // LinkedIn link (without tracking parameters)
    const linkedinLink = footer.locator('a[aria-label="CSEA on LinkedIn"]')
    await expect(linkedinLink).toBeVisible()
    await expect(linkedinLink).toHaveAttribute(
      'href',
      'https://www.linkedin.com/company/cse-association-psg-tech/'
    )
    await expect(linkedinLink).toHaveAttribute('target', '_blank')
    await expect(linkedinLink).toHaveAttribute('rel', 'noopener noreferrer')

    // CSEA link
    const cseaLink = footer.locator('a[aria-label="CSEA website"]')
    await expect(cseaLink).toBeVisible()
    await expect(cseaLink).toHaveAttribute('href', 'https://csea.psgtech.ac.in')
    await expect(cseaLink).toHaveAttribute('target', '_blank')
    await expect(cseaLink).toHaveAttribute('rel', 'noopener noreferrer')

    // No Twitter or X link remains
    await expect(footer.locator('a', { hasText: /twitter/i })).toHaveCount(0)
    await expect(footer.locator('a[href*="twitter.com"], a[href*="x.com"]')).toHaveCount(0)
  })
})


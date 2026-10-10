import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('macOS Finder Team Directory', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/team')
    await page.waitForLoadState('networkidle')
  })

  test('Root screen displays heading, description, and exactly Leads and Members folders', async ({ page }) => {
    // Check main title
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Our People')

    // Check breadcrumb root
    await expect(page.getByRole('navigation', { name: 'Finder Directory Breadcrumbs' })).toBeVisible()

    // Check folder cards
    const folderCards = page.getByRole('button', { name: /folder containing/i })
    await expect(folderCards).toHaveCount(2)

    await expect(page.getByRole('button', { name: /open leads folder containing 7 items/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /open members folder containing 2 items/i })).toBeVisible()
  })

  test('Navigating Root -> Leads displays exactly 7 lead profiles with social links without changing URL', async ({ page }) => {
    // Click Leads folder
    await page.getByRole('button', { name: /open leads folder/i }).click()
    await expect(page).toHaveURL(/\/team$/)

    // Exactly 7 cards
    const cards = page.locator('.profile-card-item')
    await expect(cards).toHaveCount(7)

    // Check first card name & social links
    await expect(cards.first().locator('h3')).toBeVisible()
    await expect(cards.first().locator('a[aria-label*="LinkedIn profile"]')).toBeVisible()
  })

  test('Navigating Root -> Members displays exactly TWO folders: Technical and Industry and Community Outreach without changing URL', async ({ page }) => {
    // Click Members folder
    await page.getByRole('button', { name: /open members folder/i }).click()
    await expect(page).toHaveURL(/\/team$/)

    // Exactly 2 subfolders
    const memberFolders = page.getByRole('button', { name: /folder containing/i })
    await expect(memberFolders).toHaveCount(2)

    await expect(page.getByRole('button', { name: /open technical folder containing 15 items/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /open industry and community outreach folder containing 15 items/i })).toBeVisible()
  })

  test('Navigating Members -> Technical displays exactly 15 member profiles on the same page', async ({ page }) => {
    await page.getByRole('button', { name: /open members folder/i }).click()
    await page.getByRole('button', { name: /open technical folder/i }).click()
    await expect(page).toHaveURL(/\/team$/)

    const cards = page.locator('.profile-card-item')
    await expect(cards).toHaveCount(15)
  })

  test('Navigating Members -> Industry and Community Outreach displays exactly 15 member profiles on the same page', async ({ page }) => {
    await page.getByRole('button', { name: /open members folder/i }).click()
    await page.getByRole('button', { name: /open industry and community outreach folder/i }).click()
    await expect(page).toHaveURL(/\/team$/)

    const cards = page.locator('.profile-card-item')
    await expect(cards).toHaveCount(15)
  })

  test('Breadcrumb and Back button navigation work seamlessly on the same page', async ({ page }) => {
    await page.getByRole('button', { name: /open members folder/i }).click()
    await page.getByRole('button', { name: /open technical folder/i }).click()
    await expect(page.locator('.profile-card-item')).toHaveCount(15)

    // Click back button in toolbar
    const backBtn = page.getByRole('button', { name: 'Go back to parent directory' })
    await expect(backBtn).toBeEnabled()
    await backBtn.click()

    await expect(page).toHaveURL(/\/team$/)
    await expect(page.getByRole('button', { name: /open technical folder/i })).toBeVisible()

    // Click breadcrumb to jump back to root
    await page.getByRole('navigation', { name: 'Finder Directory Breadcrumbs' }).getByRole('button', { name: 'Team Directory' }).click()
    await expect(page).toHaveURL(/\/team$/)
    await expect(page.getByRole('button', { name: /open leads folder/i })).toBeVisible()
  })

  test('Filter and search work within current active directory level', async ({ page }) => {
    await page.getByRole('button', { name: /open leads folder/i }).click()
    const filterInput = page.getByRole('textbox', { name: 'Filter current directory' })
    await filterInput.fill('Technical Lead')

    const cards = page.locator('.profile-card-item')
    await expect(cards).toHaveCount(1)
    await expect(cards.first().locator('h3')).toContainText('Placeholder Lead 2')
  })

  test('Directory page meets axe accessibility standards', async ({ page }) => {
    await page.goto('/team')
    await page.getByRole('heading', { level: 1 }).waitFor()
    const accessibilityScanResults = await new AxeBuilder({ page })
      .disableRules(['color-contrast']) // Some dynamic backdrop blur elements are tested separately
      .analyze()
    expect(accessibilityScanResults.violations).toEqual([])
  })
})


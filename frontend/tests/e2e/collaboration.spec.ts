import { test, expect } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';

const ARTIFACT_DIR = '/Users/ashwath/.gemini/antigravity/brain/372fb4fe-34c9-4c53-a55e-aae5ec603d69';
const SCREENSHOTS_DIR = path.resolve('tests/screenshots');

function saveScreenshot(sourcePath: string, fileName: string) {
  if (!fs.existsSync(SCREENSHOTS_DIR)) {
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
  }
  if (!fs.existsSync(ARTIFACT_DIR)) {
    fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
  }
  fs.copyFileSync(sourcePath, path.join(SCREENSHOTS_DIR, fileName));
  fs.copyFileSync(sourcePath, path.join(ARTIFACT_DIR, fileName));
}

function getAlphaFromColor(colorStr: string): number {
  if (colorStr.startsWith('rgba')) {
    const match = colorStr.match(/rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*([\d.]+)\s*\)/);
    return match ? parseFloat(match[1]) : 1;
  }
  if (colorStr.startsWith('rgb')) {
    return 1;
  }
  return 0;
}

test.describe('Corporate & Industry Collaboration Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  test('company website empty submits without a website error', async ({ page }) => {
    await page.goto('/contact');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    // Fill Step 1 required fields, leave companyWebsite empty
    await page.locator('#companyName').fill('Acme Innovations Corp');
    await page.locator('#companyLocation').fill('Coimbatore, Tamil Nadu, India');
    await page.getByRole('button', { name: 'Technology' }).click();

    // Confirm company website is empty
    await expect(page.locator('#companyWebsite')).toHaveValue('');

    // Advance to next step
    await page.getByRole('button', { name: 'Continue' }).click();

    // Verify step 2 is reached without website error
    await expect(page.getByRole('heading', { name: 'Point of Contact', level: 3 })).toBeVisible();
    await expect(page.locator('#companyWebsite-error')).not.toBeVisible();
    await expect(page.getByText('Company website is required.')).not.toBeVisible();
  });

  test('phone empty shows the required error and a short number shows "Enter a valid phone number"', async ({ page }) => {
    await page.goto('/contact');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    // Fill Step 1 and proceed to Step 2
    await page.locator('#companyName').fill('Acme Corp');
    await page.locator('#companyLocation').fill('Bengaluru, India');
    await page.getByRole('button', { name: 'Technology' }).click();
    await page.getByRole('button', { name: 'Continue' }).click();

    await expect(page.getByRole('heading', { name: 'Point of Contact', level: 3 })).toBeVisible();

    // Fill other required fields, leave phone empty
    await page.locator('#contactPersonName').fill('Sarah Jenkins');
    await page.locator('#designationRole').fill('Head of Innovation');
    await page.locator('#officialEmail').fill('sarah@acme.com');
    await page.locator('#phoneWhatsApp').fill('');

    // Try submitting with empty phone
    await page.getByRole('button', { name: 'Continue' }).click();

    // Check required error is shown
    const phoneRequiredError = page.locator('text=Phone / WhatsApp number is required.');
    await expect(phoneRequiredError).toBeVisible();

    // Fill short number
    await page.locator('#phoneWhatsApp').fill('12345');
    await page.getByRole('button', { name: 'Continue' }).click();

    // Check "Enter a valid phone number" error is shown
    const phoneValidError = page.locator('text=Enter a valid phone number');
    await expect(phoneValidError).toBeVisible();

    // Fill valid phone with >= 10 digits and formatting
    await page.locator('#phoneWhatsApp').fill('+91 98765 43210');
    await page.getByRole('button', { name: 'Continue' }).click();

    // Successfully moves to Step 3
    await expect(page.getByRole('heading', { name: 'Collaboration Details', level: 3 })).toBeVisible();
  });

  test('opening every dropdown at 1280x720 shows an opaque list with nothing behind it visible through it', async ({ page }) => {
    await page.goto('/contact');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    // Step 1: Company Size dropdown
    const companySizeTrigger = page.locator('#companySize');
    await expect(companySizeTrigger).toBeVisible();
    await companySizeTrigger.click();

    const companySizeContent = page.locator('[data-slot="select-content"]');
    await expect(companySizeContent).toBeVisible();

    const styles1 = await companySizeContent.evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return {
        backgroundColor: cs.backgroundColor,
        opacity: cs.opacity,
        zIndex: cs.zIndex,
        colorScheme: cs.colorScheme,
      };
    });

    expect(getAlphaFromColor(styles1.backgroundColor)).toBe(1);
    expect(parseFloat(styles1.opacity)).toBe(1);
    expect(parseInt(styles1.zIndex, 10)).toBeGreaterThanOrEqual(50);
    expect(styles1.colorScheme).toBe('light');

    // Take Screenshot 1: open dropdown at 1280x720
    const shot1Path = path.join(SCREENSHOTS_DIR, 'dropdown-open-1280x720.png');
    await page.screenshot({ path: shot1Path, fullPage: false });
    saveScreenshot(shot1Path, 'dropdown-open-1280x720.png');

    // Close by picking option
    await page.getByRole('option', { name: 'Startup / Early Stage' }).click();
    await expect(companySizeContent).not.toBeVisible();

    // Proceed to Step 3 to test remaining dropdowns (Team Size, Duration)
    await page.locator('#companyName').fill('Acme Corp');
    await page.locator('#companyLocation').fill('Coimbatore, India');
    await page.getByRole('button', { name: 'Technology' }).click();
    await page.getByRole('button', { name: 'Continue' }).click();

    // Step 2
    await page.locator('#contactPersonName').fill('Sarah Jenkins');
    await page.locator('#designationRole').fill('Director');
    await page.locator('#officialEmail').fill('sarah@acme.com');
    await page.locator('#phoneWhatsApp').fill('+91 98765 43210');
    await page.getByRole('button', { name: 'Continue' }).click();

    // Step 3: Preferred Team Size dropdown
    await expect(page.getByRole('heading', { name: 'Collaboration Details', level: 3 })).toBeVisible();

    const teamSizeTrigger = page.locator('#preferredTeamSize');
    await teamSizeTrigger.click();
    const teamSizeContent = page.locator('[data-slot="select-content"]');
    await expect(teamSizeContent).toBeVisible();

    const styles2 = await teamSizeContent.evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return {
        backgroundColor: cs.backgroundColor,
        opacity: cs.opacity,
        zIndex: cs.zIndex,
      };
    });
    expect(getAlphaFromColor(styles2.backgroundColor)).toBe(1);
    expect(parseFloat(styles2.opacity)).toBe(1);
    expect(parseInt(styles2.zIndex, 10)).toBeGreaterThanOrEqual(50);

    await page.getByRole('option', { name: '4–5 Members' }).click();
    await expect(teamSizeContent).not.toBeVisible();

    // Step 3: Expected Project Duration dropdown
    const durationTrigger = page.locator('#expectedDuration');
    await durationTrigger.click();
    const durationContent = page.locator('[data-slot="select-content"]');
    await expect(durationContent).toBeVisible();

    const styles3 = await durationContent.evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return {
        backgroundColor: cs.backgroundColor,
        opacity: cs.opacity,
        zIndex: cs.zIndex,
      };
    });
    expect(getAlphaFromColor(styles3.backgroundColor)).toBe(1);
    expect(parseFloat(styles3.opacity)).toBe(1);
    expect(parseInt(styles3.zIndex, 10)).toBeGreaterThanOrEqual(50);

    await page.getByRole('option', { name: '3–6 months' }).click();
    await expect(durationContent).not.toBeVisible();
  });

  test('completion min equals the start date; a completion date earlier than start shows the error', async ({ page }) => {
    await page.goto('/contact');

    // Fill Step 1
    await page.locator('#companyName').fill('Acme Corp');
    await page.locator('#companyLocation').fill('Coimbatore, India');
    await page.getByRole('button', { name: 'Technology' }).click();
    await page.getByRole('button', { name: 'Continue' }).click();

    // Fill Step 2
    await page.locator('#contactPersonName').fill('Sarah Jenkins');
    await page.locator('#designationRole').fill('Director');
    await page.locator('#officialEmail').fill('sarah@acme.com');
    await page.locator('#phoneWhatsApp').fill('+91 98765 43210');
    await page.getByRole('button', { name: 'Continue' }).click();

    // Fill Step 3
    await page.getByRole('button', { name: 'Industry Project' }).click();
    await page.locator('#projectTitle').fill('AI Autonomous Navigation');
    await page.locator('#briefDescription').fill('Developing autonomous mobile navigation for industrial warehouse mapping.');
    await page.locator('#problemStatement').fill('Automate material transfer across factory floors with collision detection.');
    await page.getByRole('button', { name: 'Continue' }).click();

    // Step 4: Commercial & Timeline
    await expect(page.getByRole('heading', { name: 'Commercial & Timeline', level: 3 })).toBeVisible();

    const startDateInput = page.locator('#startDate');
    const endDateInput = page.locator('#endDate');

    // Choose Preferred Start Date
    await startDateInput.fill('2026-11-01');

    // Check completion date min attribute equals start date
    await expect(endDateInput).toHaveAttribute('min', '2026-11-01');

    // Pick an earlier completion date
    await endDateInput.fill('2026-10-15');

    // Check error message is shown
    const dateError = page.locator('text=Completion date must be on or after the start date');
    await expect(dateError).toBeVisible();

    // Also test: user sets valid dates then changes start date to later than completion date
    await endDateInput.fill('2026-11-15');
    await expect(dateError).not.toBeVisible();

    // Now change start date to 2026-11-20 (later than completion date 2026-11-15)
    await startDateInput.fill('2026-11-20');

    // Verify completion date is cleared and error is shown
    await expect(endDateInput).toHaveValue('');
    await expect(dateError).toBeVisible();
    await expect(endDateInput).toHaveAttribute('min', '2026-11-20');

    // Take Screenshot 2: date fields with error at 1280x720
    const shot2Path = path.join(SCREENSHOTS_DIR, 'date-error-1280x720.png');
    await page.screenshot({ path: shot2Path, fullPage: false });
    saveScreenshot(shot2Path, 'date-error-1280x720.png');
  });
});


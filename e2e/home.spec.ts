import { test, expect, Page } from '@playwright/test';

// Helper to retrieve computed opacity of a heading or its motion wrapper
async function getHeadingOpacity(page: Page, headingText: string): Promise<number> {
  const heading = page.getByRole('heading', { name: headingText, exact: true });
  await heading.waitFor({ state: 'attached' });
  return await heading.evaluate((el) => {
    let current: Element | null = el;
    while (current && current !== document.body) {
      const op = window.getComputedStyle(current).opacity;
      if (op !== '1') {
        return parseFloat(op);
      }
      current = current.parentElement;
    }
    return 1;
  });
}

// Helper to scroll to a specific progress ratio (0 to 1) within the scene
async function scrollToSceneProgress(page: Page, progressRatio: number) {
  await page.evaluate((ratio) => {
    const scene = document.getElementById('about');
    if (!scene) return;
    const maxScroll = scene.scrollHeight - window.innerHeight;
    const targetY = scene.offsetTop + maxScroll * ratio;
    window.scrollTo({ top: targetY, behavior: 'instant' });
  }, progressRatio);

  // Wait for spring animation smoothing to settle
  await page.waitForTimeout(400);
}

test.describe('Home Page - Scroll Beats and Story Checkpoints', () => {
  test('scroll checkpoints assert expected headings are visible/hidden via computed opacity', async ({
    page,
  }) => {
    await page.goto('/');

    // Checkpoint 0: Hero beat (progress ~0.02)
    await scrollToSceneProgress(page, 0.02);
    const heroOpacity = await getHeadingOpacity(
      page,
      'Ideas are just the beginning.'
    );
    expect(heroOpacity).toBeGreaterThan(0.7);

    const aboutOpacityAtZero = await getHeadingOpacity(
      page,
      'More than an idea. A place to begin.'
    );
    expect(aboutOpacityAtZero).toBeLessThan(0.3);

    // Checkpoint 1: About beat (progress ~0.17)
    await scrollToSceneProgress(page, 0.17);
    const aboutOpacity = await getHeadingOpacity(
      page,
      'More than an idea. A place to begin.'
    );
    expect(aboutOpacity).toBeGreaterThan(0.7);

    // Checkpoint 2: Our Approach beat (progress ~0.31)
    await scrollToSceneProgress(page, 0.31);
    const approachOpacity = await getHeadingOpacity(page, 'Our Approach');
    expect(approachOpacity).toBeGreaterThan(0.7);

    // Checkpoint 3: Ecosystem beat (progress ~0.45)
    await scrollToSceneProgress(page, 0.45);
    const ecosystemOpacity = await getHeadingOpacity(
      page,
      'Building an Entrepreneurial Ecosystem'
    );
    expect(ecosystemOpacity).toBeGreaterThan(0.7);

    // Checkpoint 4: Student Journey beat (progress ~0.60)
    await scrollToSceneProgress(page, 0.60);
    const journeyOpacity = await getHeadingOpacity(page, 'Student Journey');
    expect(journeyOpacity).toBeGreaterThan(0.7);

    // Checkpoint 5: Who Is E-Cell For beat (progress ~0.76)
    await scrollToSceneProgress(page, 0.76);
    const whoIsForOpacity = await getHeadingOpacity(page, 'Who Is E-Cell For?');
    expect(whoIsForOpacity).toBeGreaterThan(0.7);

    // Checkpoint 6: Final CTA beat (progress 1.0)
    await scrollToSceneProgress(page, 1.0);
    const finalCTAOpacity = await getHeadingOpacity(
      page,
      'Your idea deserves a first step.'
    );
    expect(finalCTAOpacity).toBeGreaterThan(0.7);

    // Assert final CTA button is visible and active at the bottom
    const finalCtaButton = page.getByRole('link', { name: 'Get Involved' }).last();
    await expect(finalCtaButton).toBeVisible();
    await expect(finalCtaButton).toHaveAttribute('href', '/collaboration');
  });

  test('navigation links route correctly', async ({ page }) => {
    await page.goto('/');

    // Projects link
    const projectsLink = page.getByRole('button', { name: 'Projects' });
    await projectsLink.click();
    await expect(page).toHaveURL(/\/projects$/);
    await expect(page.getByRole('heading', { name: 'Projects' })).toBeVisible();

    // Contact Us link
    const contactLink = page.getByRole('button', { name: 'Contact Us' });
    await contactLink.click();
    await expect(page).toHaveURL(/\/collaboration$/);
    await expect(
      page.getByRole('heading', { name: 'Collaboration & Partnerships' })
    ).toBeVisible();

    // About link navigates back to Home with #about
    const aboutLink = page.getByRole('button', { name: 'About' });
    await aboutLink.click();
    await expect(page).toHaveURL(/\/#about$/);

    // Home link navigates back to /
    const homeLink = page.getByRole('button', { name: 'Home' });
    await homeLink.click();
    await expect(page).toHaveURL(/\/$/);
  });

  test('renders static layout when reducedMotion is emulated', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');

    // Verify all major headings are rendered simultaneously in document flow
    await expect(
      page.getByRole('heading', { name: 'Ideas are just the beginning.' })
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'More than an idea. A place to begin.' })
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Our Approach' })
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Building an Entrepreneurial Ecosystem' })
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Student Journey' })
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Who Is E-Cell For?' })
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Your idea deserves a first step.' })
    ).toBeVisible();
  });
});


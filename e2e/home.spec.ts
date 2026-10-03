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
  const targetY = await page.evaluate((ratio) => {
    const scene = document.getElementById('about');
    if (!scene) return window.scrollY;
    const sceneTop = scene.getBoundingClientRect().top + window.scrollY;
    const maxScroll = scene.offsetHeight - window.innerHeight;
    const targetY = sceneTop + maxScroll * ratio;
    document.documentElement.style.scrollBehavior = 'auto';
    window.scrollTo({ top: targetY, behavior: 'instant' });
    return targetY;
  }, progressRatio);

  await expect
    .poll(() => page.evaluate(() => window.scrollY))
    .toBeGreaterThanOrEqual(targetY - 1);
  await expect
    .poll(() => page.evaluate(() => window.scrollY))
    .toBeLessThanOrEqual(targetY + 1);
}

test.describe('Home Page - Scroll Beats and Story Checkpoints', () => {
  test('scroll checkpoints assert expected headings are visible/hidden via computed opacity', async ({
    page,
  }) => {
    await page.goto('/');

    // Checkpoint 0: Hero beat (progress ~0.02)
    await scrollToSceneProgress(page, 0.02);
    await expect
      .poll(() => getHeadingOpacity(page, 'Ideas are just the beginning.'))
      .toBeGreaterThan(0.7);

    await expect
      .poll(() => getHeadingOpacity(page, 'More than an idea. A place to begin.'))
      .toBeLessThan(0.3);

    // Checkpoint 1: About beat (progress ~0.17)
    await scrollToSceneProgress(page, 0.17);
    await expect
      .poll(() => getHeadingOpacity(page, 'More than an idea. A place to begin.'))
      .toBeGreaterThan(0.7);

    // Checkpoint 2: Our Approach beat (progress ~0.31)
    await scrollToSceneProgress(page, 0.31);
    await expect
      .poll(() => getHeadingOpacity(page, 'Our Approach'))
      .toBeGreaterThan(0.7);

    // Checkpoint 3: Ecosystem beat (progress ~0.45)
    await scrollToSceneProgress(page, 0.45);
    await expect
      .poll(() =>
        getHeadingOpacity(page, 'Building an Entrepreneurial Ecosystem')
      )
      .toBeGreaterThan(0.7);

    // Checkpoint 4: Student Journey beat (progress ~0.60)
    await scrollToSceneProgress(page, 0.60);
    await expect
      .poll(() => getHeadingOpacity(page, 'Student Journey'))
      .toBeGreaterThan(0.7);

    // Checkpoint 5: Who Is E-Cell For beat (progress ~0.76)
    await scrollToSceneProgress(page, 0.76);
    await expect
      .poll(() => getHeadingOpacity(page, 'Who Is E-Cell For?'))
      .toBeGreaterThan(0.7);

    // Checkpoint 6: Final CTA beat (progress 1.0)
    await scrollToSceneProgress(page, 1.0);
    await expect
      .poll(() => getHeadingOpacity(page, 'Your idea deserves a first step.'))
      .toBeGreaterThan(0.7);

    // Assert final CTA button is visible and active at the bottom
    const finalCtaButton = page.getByRole('link', { name: 'Get Involved' }).last();
    await expect(finalCtaButton).toBeVisible();
    await expect(finalCtaButton).toHaveAttribute('href', '/collaboration');
  });

  test('hero text entrance animation replays when returning to the hero beat', async ({
    page,
  }) => {
    await page.goto('/');
    const firstEcho = page
      .getByRole('heading', { name: 'Ideas are just the beginning.' })
      .locator('[data-echo-index="1"]');
    await firstEcho.evaluate((element) => {
      (window as Window & { initialEcho?: Element }).initialEcho = element;
    });

    await scrollToSceneProgress(page, 0.17);
    await expect
      .poll(() => getHeadingOpacity(page, 'More than an idea. A place to begin.'))
      .toBeGreaterThan(0.7);
    await scrollToSceneProgress(page, 0.02);
    await expect
      .poll(() =>
        firstEcho.evaluate(
          (element) =>
            element !== (window as Window & { initialEcho?: Element }).initialEcho
        )
      )
      .toBe(true);
    await expect
      .poll(() => firstEcho.evaluate((element) => Number(element.style.opacity)))
      .toBeGreaterThan(0.05);
  });

  test('navigation links route correctly', async ({ page }) => {
    await page.goto('/');

    // Projects link
    const projectsLink = page
      .getByRole('navigation', { name: 'Primary' })
      .getByRole('link', { name: 'Projects' });
    await projectsLink.click();
    await expect(page).toHaveURL(/\/projects$/);
    await expect(page.getByRole('heading', { name: 'Projects' })).toBeVisible();

    // Contact Us link
    const contactLink = page
      .getByRole('navigation', { name: 'Primary' })
      .getByRole('link', { name: 'Contact Us' });
    await contactLink.click();
    await expect(page).toHaveURL(/\/collaboration$/);
    await expect(
      page.getByRole('heading', { name: 'Collaboration & Partnerships' })
    ).toBeVisible();

    // About link navigates back to Home with #about
    const aboutLink = page
      .getByRole('navigation', { name: 'Primary' })
      .getByRole('link', { name: 'About' });
    await aboutLink.click();
    await expect(page).toHaveURL(/\/#about$/);

    // Home link navigates back to /
    const homeLink = page
      .getByRole('navigation', { name: 'Primary' })
      .getByRole('link', { name: 'Home' });
    await homeLink.click();
    await expect(page).toHaveURL(/\/$/);
  });

  test('renders static layout when reducedMotion is emulated', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await expect(page.locator('canvas')).toHaveCount(0);

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


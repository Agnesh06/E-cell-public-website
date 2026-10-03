import { test, expect, Page } from '@playwright/test';
import { cubicBezier } from 'framer-motion';

const cardEnterEase = cubicBezier(0.22, 1, 0.36, 1);

// Helper to retrieve computed opacity of a heading or its motion wrapper
async function getHeadingOpacity(page: Page, headingText: string): Promise<number> {
  const heading = page.locator('h1, h2').filter({ hasText: headingText }).first();
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

async function waitForStableMotion(page: Page, selector: string) {
  await page.evaluate(async (targetSelector) => {
    const element = document.querySelector<HTMLElement>(targetSelector);
    if (!element) throw new Error(`Missing motion element: ${targetSelector}`);

    let previous = '';
    let stableFrames = 0;
    while (stableFrames < 2) {
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
      const style = getComputedStyle(element);
      const current = `${style.opacity}|${style.transform}|${style.visibility}`;
      stableFrames = current === previous ? stableFrames + 1 : 0;
      previous = current;
    }
  }, selector);
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

  test('card opacity progresses smoothly through its eased enter phase', async ({
    page,
  }) => {
    await page.addInitScript(() => {
      HTMLCanvasElement.prototype.getContext = function () {
        return null;
      };
    });
    await page.goto('/');
    const selector = '[data-testid="idea-card-about-0"]';
    const beatStart = 0.10;
    const beatLength = 0.14;
    const enterStart = beatStart + beatLength * 0.12;
    const opacityEnd = beatStart + beatLength * (0.12 + 0.18 * 0.6);
    const card = page.locator(selector);
    await expect(card).toBeAttached();

    let previousOpacity = 0;
    let largestStep = 0;
    let largestStepIndex = 0;
    for (let step = 0; step <= 20; step += 1) {
      const progress = enterStart + (opacityEnd - enterStart) * step / 20;
      await scrollToSceneProgress(page, progress);
      const normalized = Math.max(0, Math.min(1, (progress - enterStart) / (opacityEnd - enterStart)));
      const expectedOpacity = cardEnterEase(normalized);
      await expect
        .poll(() => card.evaluate((element) => Number(getComputedStyle(element).opacity)))
        .toBeCloseTo(expectedOpacity, 1);
      await waitForStableMotion(page, selector);
      const opacity = Number(await card.evaluate((element) => getComputedStyle(element).opacity));
      const opacityStep = opacity - previousOpacity;
      expect(opacityStep).toBeGreaterThanOrEqual(-0.01);
      if (opacityStep > largestStep) {
        largestStep = opacityStep;
        largestStepIndex = step;
      }
      previousOpacity = opacity;
    }

    expect(
      largestStep,
      `largest opacity step was ${largestStep} at step ${largestStepIndex}`
    ).toBeLessThanOrEqual(0.35);
  });

  test('cards are settled and non-overlapping at 3-card and 4-card hold midpoints', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    const holdCases = [
      { beatId: 'about', progress: 0.10 + 0.14 * 0.61, count: 3 },
      { beatId: 'journey', progress: 0.52 + 0.16 * 0.64, count: 4 },
    ];

    for (const holdCase of holdCases) {
      await scrollToSceneProgress(page, holdCase.progress);
      const selector = `[data-beat-id="${holdCase.beatId}"][data-card-index="0"]`;
      await waitForStableMotion(page, selector);
      const cards = page.locator(`[data-beat-id="${holdCase.beatId}"][data-card-index]`);
      await expect(cards).toHaveCount(holdCase.count);
      const rects = await cards.evaluateAll((elements) => elements.map((element) => {
        const rect = element.getBoundingClientRect();
        return {
          left: rect.left,
          right: rect.right,
          top: rect.top,
          bottom: rect.bottom,
          opacity: Number(getComputedStyle(element).opacity),
          visibility: getComputedStyle(element).visibility,
        };
      }));

      expect(rects.every((rect) => rect.opacity > 0.99 && rect.visibility === 'visible')).toBe(true);
      for (let first = 0; first < rects.length; first += 1) {
        for (let second = first + 1; second < rects.length; second += 1) {
          const overlaps =
            rects[first].left < rects[second].right &&
            rects[first].right > rects[second].left &&
            rects[first].top < rects[second].bottom &&
            rects[first].bottom > rects[second].top;
          expect(overlaps).toBe(false);
        }
      }
    }
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

  test('renders LineWaves in animated mode when WebGL is available', async ({
    page,
  }) => {
    await page.goto('/');
    const webglAvailable = await page.evaluate(() => {
      const canvas = document.createElement('canvas');
      return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'));
    });
    test.skip(!webglAvailable, 'WebGL is unavailable in this browser environment');

    await expect(page.getByTestId('home-background')).toHaveAttribute(
      'data-mode',
      'animated'
    );
  });

  test('uses the CSS background fallback when WebGL is unavailable', async ({
    page,
  }) => {
    await page.addInitScript(() => {
      HTMLCanvasElement.prototype.getContext = function () {
        return null;
      };
    });
    await page.goto('/');

    const background = page.getByTestId('home-background');
    await expect(background).toHaveAttribute('data-mode', 'fallback');
    await expect
      .poll(() => background.evaluate((element) => getComputedStyle(element).backgroundImage))
      .toContain('linear-gradient');

    await scrollToSceneProgress(page, 0.17);
    await expect
      .poll(() => getHeadingOpacity(page, 'More than an idea. A place to begin.'))
      .toBeGreaterThan(0.7);
    const ideaCardText = page.getByText('Every meaningful venture starts with an idea.', {
      exact: false,
    });
    await expect
      .poll(() => ideaCardText.evaluate((element) => {
        let current: Element | null = element;
        while (current && current !== document.body) {
          const opacity = Number(getComputedStyle(current).opacity);
          if (opacity < 1) return opacity;
          current = current.parentElement;
        }
        return 1;
      }))
      .toBeGreaterThan(0.7);
  });

  test('renders static layout when reducedMotion is emulated', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await expect(page.getByTestId('home-background')).toHaveAttribute(
      'data-mode',
      'static'
    );

        await expect(page.getByTestId('home-background')).toHaveAttribute(
          'data-mode',
          'static'
        );
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


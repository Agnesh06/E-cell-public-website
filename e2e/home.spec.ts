import { test, expect, Page } from '@playwright/test';
import { cubicBezier } from 'framer-motion';

const cardEnterEase = cubicBezier(0.22, 1, 0.36, 1);
const layoutViewports = [
  { width: 360, height: 740 },
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 800, height: 600 },
  { width: 990, height: 600 },
  { width: 1024, height: 768 },
  { width: 1280, height: 720 },
  { width: 1366, height: 768 },
  { width: 1440, height: 900 },
  { width: 1536, height: 864 },
  { width: 1920, height: 1080 },
  { width: 2560, height: 1440 },
  { width: 1280, height: 640 },
];
const cardBeats = [
  { id: 'about', start: 0.10, end: 0.24, count: 3 },
  { id: 'approach', start: 0.24, end: 0.38, count: 3 },
  { id: 'ecosystem', start: 0.38, end: 0.52, count: 3 },
  { id: 'journey', start: 0.52, end: 0.68, count: 4 },
  { id: 'who-is-it-for', start: 0.68, end: 0.84, count: 4 },
];

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

  test('cards fit and align through every beat at enter and hold midpoints across viewport sizes', async ({
    page,
  }) => {
    test.setTimeout(120_000);
    await page.addInitScript(() => {
      HTMLCanvasElement.prototype.getContext = function () {
        return null;
      };
    });
    await page.setViewportSize(layoutViewports[0]);
    await page.goto('/');

    for (const viewport of layoutViewports) {
      await page.setViewportSize(viewport);
      const singleSlot = viewport.width < 640;

      for (const beat of cardBeats) {
        const beatLocator = page.getByTestId(`beat-${beat.id}`);
        await expect(beatLocator).toHaveAttribute(
          'data-layout-mode',
          singleSlot ? 'single-slot' : 'grid'
        );

        const span = beat.end - beat.start;
        const segment = 0.68 / beat.count;
        const firstEnterStart = beat.start + span * (singleSlot ? 0.12 : 0.12);
        const firstOpacityEnd = singleSlot
          ? firstEnterStart + span * segment * 0.12
          : firstEnterStart + span * 0.18 * 0.6;
        const holdStart = singleSlot
          ? beat.start + span * (0.12 + segment * (beat.count - 1) + segment * 0.2)
          : beat.start + span * (0.12 + (beat.count - 1) * 0.06 + 0.18);
        const holdEnd = singleSlot ? beat.end : beat.start + span * 0.80;
        const phases = [
          {
            name: 'enter',
            progress: (firstEnterStart + firstOpacityEnd) / 2,
            visibleCardIndex: 0,
            minOpacity: 0.35,
          },
          {
            name: 'hold',
            progress: (holdStart + holdEnd) / 2,
            visibleCardIndex: singleSlot ? beat.count - 1 : 0,
            minOpacity: 0.99,
          },
        ];

        for (const phase of phases) {
          await scrollToSceneProgress(page, phase.progress);
          const animatedCard = page.getByTestId(
            `idea-card-motion-${beat.id}-${phase.visibleCardIndex}`
          );
          await expect
            .poll(() => animatedCard.evaluate((element) => Number(getComputedStyle(element).opacity)))
            .toBeGreaterThan(phase.minOpacity);
          await waitForStableMotion(page, `[data-testid="idea-card-motion-${beat.id}-${phase.visibleCardIndex}"]`);

          const layout = await page.getByTestId(`beat-${beat.id}`).evaluate((beatElement) => {
            const title = beatElement.querySelector<HTMLElement>('[data-testid^="beat-title-"]');
            const nav = document.querySelector<HTMLElement>('header');
            if (!title || !nav) throw new Error('Missing beat title or navbar');
            const box = (element: Element) => {
              const { left, right, top, bottom, width, height } = element.getBoundingClientRect();
              return { left, right, top, bottom, width, height };
            };
            const cards = [...beatElement.querySelectorAll<HTMLElement>('[data-card-index]')].map((wrapper) => {
              const motion = wrapper.querySelector<HTMLElement>('[data-testid^="idea-card-motion-"]');
              const surface = wrapper.querySelector<HTMLElement>('.card-spotlight');
              if (!motion || !surface) throw new Error('Missing card motion or surface');
              const textElements = [...surface.querySelectorAll<HTMLElement>('h4, p')];
              return {
                wrapper: box(wrapper),
                visual: box(motion),
                opacity: Number(getComputedStyle(motion).opacity),
                textAlign: getComputedStyle(surface).textAlign,
                textFits: textElements.every((element) => element.scrollHeight <= element.clientHeight + 1),
                textHeights: textElements.map((element) => `${element.scrollHeight}/${element.clientHeight}`),
              };
            });
            return {
              title: box(title),
              navbar: box(nav),
              viewport: { width: innerWidth, height: innerHeight },
              cards,
            };
          });

          const rowWidths = layout.cards.map((card) => card.wrapper.width);
          const rowHeights = layout.cards.map((card) => card.wrapper.height);
          expect(
            Math.max(...rowWidths) - Math.min(...rowWidths),
            `${beat.id} ${phase.name} widths differ at ${viewport.width}x${viewport.height}: ${rowWidths.join(', ')}`
          ).toBeLessThanOrEqual(2);
          expect(
            Math.max(...rowHeights) - Math.min(...rowHeights),
            `${beat.id} ${phase.name} heights differ at ${viewport.width}x${viewport.height}: ${rowHeights.join(', ')}`
          ).toBeLessThanOrEqual(2);
          expect(new Set(layout.cards.map((card) => card.textAlign))).toEqual(new Set(['left']));
          expect(
            layout.cards.every((card) => card.textFits),
            `${beat.id} ${phase.name} text clipped at ${viewport.width}x${viewport.height}: ${layout.cards.map((card) => card.textHeights.join('+')).join(', ')}`
          ).toBe(true);
          expect(layout.cards.every((card) =>
            card.wrapper.left >= -1 &&
            card.wrapper.right <= layout.viewport.width + 1 &&
            card.wrapper.top >= layout.navbar.bottom - 1 &&
            card.wrapper.bottom <= layout.viewport.height + 1
          )).toBe(true);

          const visibleCards = layout.cards.filter((card) => card.opacity > 0.35);
          for (const card of visibleCards) {
            const titleOverlap = card.visual.left < layout.title.right &&
              card.visual.right > layout.title.left &&
              card.visual.top < layout.title.bottom &&
              card.visual.bottom > layout.title.top;
            const navOverlap = card.visual.left < layout.navbar.right &&
              card.visual.right > layout.navbar.left &&
              card.visual.top < layout.navbar.bottom &&
              card.visual.bottom > layout.navbar.top;
            expect(titleOverlap, `${beat.id} ${phase.name} intersects title at ${viewport.width}x${viewport.height}`).toBe(false);
            expect(navOverlap, `${beat.id} ${phase.name} intersects navbar at ${viewport.width}x${viewport.height}`).toBe(false);
          }

          for (let first = 0; first < visibleCards.length; first += 1) {
            for (let second = first + 1; second < visibleCards.length; second += 1) {
              const a = visibleCards[first].visual;
              const b = visibleCards[second].visual;
              const intersects = a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
              expect(intersects, `${beat.id} ${phase.name} cards intersect at ${viewport.width}x${viewport.height}`).toBe(false);
            }
          }
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


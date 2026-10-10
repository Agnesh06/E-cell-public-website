import { chromium } from 'playwright'
import fs from 'fs'
import path from 'path'

const viewports = [
  { width: 1300, height: 600 },
  { width: 1366, height: 768 },
  { width: 1280, height: 600 },
  { width: 1024, height: 600 },
  { width: 1536, height: 730 },
  { width: 1440, height: 900 },
  { width: 1920, height: 1080 },
]

const holdProgressMap = [
  { step: 1, p: 0.10, id: 'step-about' },
  { step: 2, p: 0.30, id: 'step-approach' },
  { step: 3, p: 0.44, id: 'step-ecosystem' },
  { step: 4, p: 0.70, id: 'step-journey' },
  { step: 5, p: 0.90, id: 'step-audience' },
]

async function run() {
  const outDir = path.resolve('tests/diagnose_screenshots')
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true })
  }

  const browser = await chromium.launch({ headless: true })
  const report: Record<string, unknown> = { viewports: {}, heroLeak: {}, measurements1300x600: {} }

  for (const vp of viewports) {
    const vpKey = `${vp.width}x${vp.height}`
    console.log(`Processing viewport ${vpKey}...`)
    const context = await browser.newContext({ viewport: vp })
    const page = await context.newPage()
    await page.goto('http://127.0.0.1:4173')
    await page.waitForSelector('h1')
    await page.waitForTimeout(1000)

    // 1. Screenshot at scroll 0
    await page.screenshot({ path: path.join(outDir, `scroll0_${vpKey}.png`) })

    // Check Hero Line Leak evidence at scroll 0
    if (vpKey === '1300x600') {
      const heroLineInfo = await page.evaluate(`(() => {
        function getInfo(el) {
          if (!el) return null;
          var r = el.getBoundingClientRect();
          var cs = window.getComputedStyle(el);
          return {
            tag: el.tagName,
            classes: el.className,
            rect: { top: r.top, left: r.left, width: r.width, height: r.height, bottom: r.bottom, right: r.right },
            display: cs.display,
            visibility: cs.visibility,
            opacity: cs.opacity,
            overflow: cs.overflow,
            position: cs.position,
            zIndex: cs.zIndex,
            stroke: el.getAttribute ? el.getAttribute('stroke') : cs.stroke,
          };
        }

        return {
          heroSection: getInfo(document.querySelector('.landing-hero')),
          heroLineContainer: getInfo(document.querySelector('.hero-line-container')),
          heroLineSvg: getInfo(document.querySelector('.hero-line-svg')),
          heroLineDrawn: getInfo(document.querySelector('.hero-line-drawn')),
          pinnedStage: getInfo(document.querySelector('.pinned-stage')),
          flowLineContainer: getInfo(document.querySelector('.flow-line-container')),
          flowLineSvg: getInfo(document.querySelector('.flow-line-svg')),
          drawnPath: getInfo(document.querySelector('.flow-line-svg path[stroke="var(--color-blue)"]')),
        };
      })()`)
      report.heroLeak = heroLineInfo
    }

    // Wait for ScrollTrigger
    await page.waitForFunction(() => {
      return typeof (window as unknown as { __ideaStepsScrollTrigger?: unknown }).__ideaStepsScrollTrigger !== 'undefined'
    })

    // Hold screenshots for each step
    for (const h of holdProgressMap) {
      await page.evaluate(`((p) => {
        var st = window.__ideaStepsScrollTrigger;
        if (st) {
          window.scrollTo(0, st.start + p * (st.end - st.start));
        }
      })(${h.p})`)

      await page.waitForTimeout(600)
      const stage = page.locator('.pinned-stage')
      if (await stage.count() > 0) {
        await stage.screenshot({ path: path.join(outDir, `stage_step${h.step}_${vpKey}.png`) })
      } else {
        await page.screenshot({ path: path.join(outDir, `page_step${h.step}_${vpKey}.png`) })
      }

      // If 1300x600, measure heights
      if (vpKey === '1300x600') {
        const measurements = await page.evaluate(`((stepId) => {
          var header = document.querySelector('.site-header');
          var headerRect = header ? header.getBoundingClientRect() : { bottom: 0 };
          var stage = document.querySelector('.pinned-stage');
          var slide = document.querySelector('#' + stepId);
          var textBlock = slide ? slide.querySelector('.step-text') : null;
          var cardsBlock = slide ? slide.querySelector('.step-cards') : null;
          var bottomBar = document.querySelector('.pinned-stage > div.container-site.absolute.bottom-16') || (document.querySelector('.pinned-stage .step-indicator') ? document.querySelector('.pinned-stage .step-indicator').closest('.container-site') : null);
          var bottomBarRect = bottomBar ? bottomBar.getBoundingClientRect() : { top: 600, height: 40 };

          var availableHeight = 600 - (headerRect.bottom || 84) - (600 - (bottomBarRect.top || 540));

          return {
            viewportHeight: window.innerHeight,
            headerBottom: headerRect.bottom,
            bottomBarTop: bottomBarRect.top,
            bottomBarHeight: bottomBar ? (600 - bottomBarRect.top) : 60,
            availableHeight: availableHeight,
            textBlockHeight: textBlock ? textBlock.getBoundingClientRect().height : null,
            cardsBlockHeight: cardsBlock ? cardsBlock.getBoundingClientRect().height : null,
            textBlockRect: textBlock ? textBlock.getBoundingClientRect() : null,
            cardsBlockRect: cardsBlock ? cardsBlock.getBoundingClientRect() : null,
            cardsBottomExceeds: cardsBlock ? cardsBlock.getBoundingClientRect().bottom - 600 : null,
          };
        })('${h.id}')`)
        report.measurements1300x600[`step${h.step}`] = measurements
      }
    }

    await context.close()
  }

  await browser.close()
  fs.writeFileSync('tests/diagnose_report.json', JSON.stringify(report, null, 2))
  console.log('Diagnosis complete! Report written to tests/diagnose_report.json')
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})


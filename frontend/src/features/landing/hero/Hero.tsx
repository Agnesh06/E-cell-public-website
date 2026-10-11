import { useRef } from 'react'
import { gsap, useGSAP } from '@/lib/gsap'
import { useLenis } from '@/app/smoothScroll'
import { Button } from '@/components/common/Button'
import { Eyebrow } from '@/components/common/Eyebrow'
import { HeroBackground } from './HeroBackground'
import { HeroLine } from './HeroLine'

export function Hero() {
  const heroRef = useRef<HTMLElement>(null)
  const lenis = useLenis()

  const handleExploreVision = () => {
    const target = document.getElementById('about')
    if (!target) return
    if (lenis) {
      try {
        lenis.scrollTo(target)
      } catch {
        // fallback
      }
      target.scrollIntoView({ behavior: 'smooth' })
    } else {
      const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      target.scrollIntoView({ behavior: isReduced ? 'auto' : 'smooth' })
    }
  }

  useGSAP(
    () => {
      const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      const drawnPath = heroRef.current?.querySelector<SVGPathElement>('.hero-line-drawn')
      const ghostPath = heroRef.current?.querySelector<SVGPathElement>('.hero-line-ghost')
      const totalLength = drawnPath?.getTotalLength ? drawnPath.getTotalLength() : 2000
      const drawnSegment = totalLength * 0.15

      if (drawnPath) {
        drawnPath.style.strokeDasharray = `${drawnSegment} ${totalLength}`
      }

      // Safe fallback to guarantee content is always visible and never stuck at opacity 0
      const ensureVisible = () => {
        gsap.set(['.hero-eyebrow', '.hero-paragraph', '.hero-buttons'], {
          opacity: 1,
          y: 0,
          clearProps: 'opacity,transform',
        })
        gsap.set('.hero-title-line', {
          y: '0%',
          opacity: 1,
          clearProps: 'opacity,transform',
        })
        if (ghostPath) gsap.set(ghostPath, { opacity: 0.2 })
        if (drawnPath) gsap.set(drawnPath, { strokeDashoffset: 0 })
      }

      if (isReducedMotion) {
        ensureVisible()
        return
      }

      // Fallback timer so content can never get stuck at opacity 0 if animation fails or stalls
      const fallbackTimer = setTimeout(ensureVisible, 700)

      try {
        // Short intro animation on load (~0.6s total, never gated by scroll)
        const tl = gsap.timeline({
          defaults: { ease: 'power2.out' },
          onComplete: () => {
            clearTimeout(fallbackTimer)
            ensureVisible()
          },
        })

        if (ghostPath) {
          tl.fromTo(
            ghostPath,
            { opacity: 0 },
            { opacity: 0.2, duration: 0.6, ease: 'power2.out' },
            0
          )
        }

        if (drawnPath) {
          tl.fromTo(
            drawnPath,
            { strokeDashoffset: drawnSegment },
            { strokeDashoffset: 0, duration: 0.6, ease: 'power2.inOut' },
            0
          )
        }

        // Subtle fade/slide-in (~0.6s total, ends fully visible, never gated by scroll)
        tl.fromTo(
          '.hero-eyebrow',
          { opacity: 0.5, y: 8 },
          { opacity: 1, y: 0, duration: 0.4 },
          0
        )

        // H1 lines gentle rise
        tl.fromTo(
          '.hero-title-line',
          { opacity: 0.6, y: 10 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.05 },
          0.05
        )

        // Paragraph and buttons gentle rise
        tl.fromTo(
          ['.hero-paragraph', '.hero-buttons'],
          { opacity: 0.5, y: 12 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.06 },
          0.1
        )
      } catch {
        clearTimeout(fallbackTimer)
        ensureVisible()
      }

      return () => {
        clearTimeout(fallbackTimer)
      }
    },
    { scope: heroRef }
  )

  return (
    <section
      ref={heroRef}
      className="landing-hero relative min-h-[100svh] w-full flex flex-col justify-between overflow-hidden bg-[var(--color-bg)] pt-28 pb-4 md:pt-36 md:pb-6"
      aria-labelledby="landing-hero-title"
    >
      <HeroBackground />
      <HeroLine />

      <div className="container-site relative z-10 my-auto flex flex-col justify-center w-full">
        <div className="w-full lg:max-w-[62%]">
          <Eyebrow className="hero-eyebrow block text-xs md:text-sm font-mono tracking-[0.22em] text-[var(--color-blue)] uppercase mb-4 md:mb-6">
            CSEA E-CELL - PSG COLLEGE OF TECHNOLOGY
          </Eyebrow>

          <h1
            id="landing-hero-title"
            className="font-medium tracking-[-0.03em] leading-[0.95] text-[clamp(3rem,7vw,6.5rem)] text-[var(--color-ink)] mb-6 md:mb-8"
          >
            <span className="overflow-hidden block pb-2 -mb-2">
              <span className="hero-title-line block">Ideas are just</span>
            </span>{' '}
            <span className="overflow-hidden block pb-4 -mb-4">
              <span className="hero-title-line block text-[var(--color-blue)]">
                the beginning.
              </span>
            </span>
          </h1>

          <p className="hero-paragraph text-base md:text-lg font-semibold text-[var(--color-ink-muted)] max-w-[52ch] leading-relaxed mb-8 md:mb-10">
            A space to ideate, collaborate, and build. Turn your curiosity into ideas,
            your ideas into solutions, and your solutions into something that matters.
          </p>

          <div className="hero-buttons flex flex-col min-[480px]:flex-row gap-4 items-stretch min-[480px]:items-center">
            <Button to="/contact" variant="primary" withArrow>
              Get Involved
            </Button>
            <Button variant="secondary" onClick={handleExploreVision}>
              Explore Our Vision
            </Button>
          </div>
        </div>
      </div>

      <div className="container-site relative z-10 w-full pt-4 flex flex-wrap items-end justify-between gap-4 text-[10px] sm:text-xs font-mono tracking-[0.2em] text-[var(--color-ink-faint)] select-none pointer-events-none">
        <div className="flex items-center gap-3">
          <span>SCROLL</span>
          <span
            className="scroll-indicator-line inline-block w-[1px] h-6 bg-[var(--color-ink-faint)]"
            aria-hidden="true"
          />
        </div>
        <div>
          <span>IDEATE · COLLABORATE · BUILD</span>
        </div>
      </div>
    </section>
  )
}

export default Hero

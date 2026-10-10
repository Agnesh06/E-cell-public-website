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

      if (isReducedMotion) {
        gsap.set(['.hero-eyebrow', '.hero-paragraph', '.hero-buttons'], {
          opacity: 1,
          y: 0,
        })
        gsap.set('.hero-title-line', { y: '0%' })
        if (ghostPath) gsap.set(ghostPath, { opacity: 0.2 })
        if (drawnPath) gsap.set(drawnPath, { strokeDashoffset: 0 })
        return
      }

      // One load timeline (about 1.4s total, power3.out)
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      // Drawn segment of HeroLine draws once over 1.6s (power2.inOut) while ghost fades in
      if (ghostPath) {
        tl.fromTo(
          ghostPath,
          { opacity: 0 },
          { opacity: 0.2, duration: 1.6, ease: 'power2.out' },
          0
        )
      }

      if (drawnPath) {
        tl.fromTo(
          drawnPath,
          { strokeDashoffset: drawnSegment },
          { strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut' },
          0
        )
      }

      // Eyebrow fades and rises 16px
      tl.fromTo(
        '.hero-eyebrow',
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.6 },
        0.1
      )

      // The two h1 lines reveal through masks (each line in overflow-hidden wrapper, y 100% -> 0, 80ms stagger)
      tl.fromTo(
        '.hero-title-line',
        { y: '100%' },
        { y: '0%', duration: 0.8, stagger: 0.08 },
        0.25
      )

      // Paragraph then buttons fade and rise 24px with 80ms stagger
      tl.fromTo(
        ['.hero-paragraph', '.hero-buttons'],
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.08 },
        0.45
      )
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

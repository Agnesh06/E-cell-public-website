import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router'
import { ArrowDown } from 'lucide-react'
import { useLenis } from '@/app/smoothScroll'
import { Button } from '@/components/common/Button'
import { Eyebrow } from '@/components/common/Eyebrow'
import { GridBackdrop } from '@/components/common/GridBackdrop'
import ScrollStack, { ScrollStackItem } from '@/components/reactbits/ScrollStack'
import { LineSidebar } from './LineSidebar'
import { useSheetData } from '@/lib/useSheetData'
import { placeholderImage } from '@/lib/placeholder'
import { ProjectsSkeleton } from '@/components/skeletons/ProjectsSkeleton'

export default function ProjectsPage() {
  const stackRef = useRef<HTMLDivElement>(null)
  const pinPointsRef = useRef<number[]>([])
  const [activeIndex, setActiveIndex] = useState(0)
  const lenis = useLenis()
  const { data: projectsData, status } = useSheetData('projects')

  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 1024 : true
  )
  const [isReducedMotion, setIsReducedMotion] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  )

  const sortedProjects = useMemo(
    () => [...projectsData].sort((a, b) => a.order - b.order),
    [projectsData]
  )

  const projectTitles = useMemo(
    () => sortedProjects.map((p) => p.title),
    [sortedProjects]
  )

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handler = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= 1024)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const updatePinPoints = useCallback(() => {
    const stackEl = stackRef.current
    if (!stackEl) return

    const slots = stackEl.querySelectorAll<HTMLElement>('[data-stack-slot]')
    if (!slots.length) return

    const desktop = window.innerWidth >= 1024
    const stackPosition = desktop ? 140 : 104
    const itemStackDistance = 20

    const stackDocTop = stackEl.getBoundingClientRect().top + window.scrollY

    const pins: number[] = []
    slots.forEach((slot, i) => {
      const naturalTop =
        window.scrollY === 0
          ? slot.getBoundingClientRect().top
          : stackDocTop + slot.offsetTop
      const pin = naturalTop - (stackPosition + i * itemStackDistance)
      pins.push(pin)
    })

    pinPointsRef.current = pins
  }, [])

  useEffect(() => {
    updatePinPoints()

    const frameId = requestAnimationFrame(() => {
      updatePinPoints()
    })

    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        updatePinPoints()
      })
    }

    const onResize = () => {
      updatePinPoints()
    }

    window.addEventListener('resize', onResize)
    window.addEventListener('load', onResize)

    let ro: ResizeObserver | null = null
    if (stackRef.current && typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => {
        updatePinPoints()
      })
      ro.observe(stackRef.current)
    }

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('load', onResize)
      ro?.disconnect()
    }
  }, [updatePinPoints])

  useEffect(() => {
    let rafId: number | null = null

    const handleScroll = () => {
      if (rafId !== null) return
      rafId = requestAnimationFrame(() => {
        rafId = null
        const currentY = window.scrollY
        const pins = pinPointsRef.current
        if (!pins.length) return

        let nextIndex = 0
        for (let i = 0; i < pins.length; i++) {
          if (currentY >= pins[i] - 8) {
            nextIndex = i
          }
        }

        setActiveIndex((prev) => (prev !== nextIndex ? nextIndex : prev))
      })
    }

    if (lenis) {
      lenis.on('scroll', handleScroll)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId)
      if (lenis) {
        lenis.off('scroll', handleScroll)
      }
      window.removeEventListener('scroll', handleScroll)
    }
  }, [lenis])

  const handleSidebarClick = useCallback(
    (index: number) => {
      const pins = pinPointsRef.current
      const targetPin = pins[index]
      if (targetPin === undefined) return

      const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      if (lenis && !isReduced) {
        lenis.scrollTo(targetPin, {
          duration: 1.2,
        })
      } else {
        window.scrollTo({
          top: targetPin,
          behavior: isReduced ? 'instant' : 'smooth',
        })
      }
    },
    [lenis]
  )

  if (status === 'loading') {
    return <ProjectsSkeleton />
  }

  return (
    <div className="projects-page min-h-screen bg-[var(--color-bg)]">
      {/* 1. Header block */}
      <header className="projects-page-header relative pt-32 pb-12 md:pt-40 md:pb-16 text-center">
        <GridBackdrop className="opacity-40" />
        <div className="container-site relative z-10 flex flex-col items-center">
          <Eyebrow className="mb-4">OUR WORK</Eyebrow>
          <h1 className="font-display font-medium text-[clamp(3rem,7vw,6.5rem)] leading-[0.95] tracking-[-0.03em] text-[var(--color-ink)] mb-6">
            Our <span className="text-[var(--color-blue)]">Projects</span>
          </h1>
          <p className="max-w-xl text-base md:text-lg text-[var(--color-ink-muted)] leading-relaxed">
            Ideas our students are building, from first sketch to working solution.
          </p>

          {/* 2. Scroll hint */}
          <div className="mt-10 inline-flex items-center gap-2.5 font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-ink-muted)] select-none">
            <span>SCROLL TO VIEW PROJECTS</span>
            <ArrowDown
              className="w-3.5 h-3.5 text-[var(--color-blue)] animate-bounce motion-reduce:animate-none"
              aria-hidden="true"
            />
          </div>
        </div>
      </header>

      {/* 3. Row: Sidebar + Stack */}
      <div className="container-site mt-8 md:mt-12">
        {sortedProjects.length === 0 ? (
          <div
            data-testid="projects-empty-state"
            className="mx-auto max-w-xl rounded-3xl border border-[var(--color-hairline)] bg-white p-12 text-center shadow-sm"
          >
            <h2 className="text-xl font-medium text-[var(--color-ink)] mb-2">
              No projects available
            </h2>
            <p className="text-sm text-[var(--color-ink-muted)]">
              There are currently no published projects to display.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(180px,240px)_minmax(0,1fr)] lg:gap-12 items-start">
            <aside className="hidden lg:block sticky top-[140px] self-start z-20">
              <LineSidebar
                items={projectTitles}
                activeIndex={activeIndex}
                onItemClick={handleSidebarClick}
                accentColor="#2340FF"
                textColor="#5A5A63"
                markerColor="#C9CEE0"
                showIndex
                showMarker
                markerLength={36}
                maxShift={14}
                itemGap={14}
                fontSize={1}
                proximityRadius={90}
              />
            </aside>

            <div ref={stackRef} className="w-full min-w-0">
              <ScrollStack
                useWindowScroll
                smoothScroll={false}
                snap={false}
                stackPosition={isDesktop ? 140 : 104}
                itemDistance={80}
                itemStackDistance={20}
                itemScale={isReducedMotion ? 0 : 0.04}
                baseScale={isReducedMotion ? 1 : 0.85}
                dimAmount={isReducedMotion ? 0 : 0.06}
                blurAmount={0}
                tiltAmount={0}
                rotationAmount={0}
                holdDistance={160}
              >
                {sortedProjects.map((project) => (
                  <ScrollStackItem
                    key={project.slug}
                    itemClassName="!bg-white !rounded-[24px] border border-[var(--color-hairline)] !h-[min(60vh,420px)] lg:!h-[min(56vh,380px)] !p-[clamp(20px,3vw,40px)] !text-[var(--color-ink)] shadow-[0_24px_60px_-28px_rgba(35,64,255,0.35)]"
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '24px',
                      boxShadow: '0 24px 60px -28px rgba(35, 64, 255, 0.35)',
                    }}
                  >
                    <div className="flex flex-row items-stretch justify-between h-full w-full gap-4 sm:gap-6 md:gap-8">
                      <div className="flex flex-col justify-between flex-1 min-w-0">
                        <div>
                          <span className="font-mono text-sm md:text-base font-medium text-[var(--color-blue)] tracking-wider">
                            {String(project.order).padStart(2, '0')}
                          </span>
                          <h2 className="mt-2 md:mt-3 text-[clamp(1.5rem,3vw,2.4rem)] font-normal text-[var(--color-ink)] leading-tight tracking-tight">
                            <Link
                              to={`/projects/${project.slug}`}
                              className="after:absolute after:inset-0 after:z-10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-blue)] rounded-lg transition-colors hover:text-[var(--color-blue)]"
                            >
                              {project.title}
                            </Link>
                          </h2>
                          <p className="mt-2 md:mt-3 text-sm md:text-base text-[var(--color-ink-muted)] line-clamp-2 md:line-clamp-1 leading-relaxed">
                            {project.summary}
                          </p>
                        </div>

                        <div className="pt-4 mt-auto">
                          <Link
                            to={`/projects/${project.slug}`}
                            className="relative z-20 inline-flex items-center gap-1.5 text-sm md:text-base font-medium text-[var(--color-blue)] transition-colors hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-blue)] rounded"
                          >
                            View Project &rarr;
                          </Link>
                        </div>
                      </div>

                      <div className="hidden sm:block shrink-0 w-[180px] sm:w-[220px] md:w-[260px] lg:w-[280px] h-full rounded-2xl overflow-hidden border border-[var(--color-hairline)] bg-slate-100">
                        <img
                          src={project.image || placeholderImage(project.order)}
                          alt={project.title}
                          width={280}
                          height={380}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    </div>
                  </ScrollStackItem>
                ))}
              </ScrollStack>
            </div>
          </div>
        )}
      </div>

      {/* 4. Closing block */}
      <section className="container-site my-32 md:my-48 text-center flex flex-col items-center">
        <h2 className="text-[clamp(2rem,4vw,3.25rem)] font-display font-medium text-[var(--color-ink)] leading-tight tracking-tight mb-4">
          Have a project in mind?
        </h2>
        <p className="max-w-xl text-base md:text-lg text-[var(--color-ink-muted)] leading-relaxed mb-8">
          Share your idea or challenge with the E-Cell team and let's explore how to build it together.
        </p>
        <Button to="/contact" variant="primary">
          Contact Us
        </Button>
      </section>
    </div>
  )
}

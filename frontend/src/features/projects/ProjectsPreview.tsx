import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { PrismCarousel } from '@/components/reactbits/PrismCarousel'
import { Button } from '@/components/common/Button'
import { placeholderImage } from '@/lib/placeholder'
import { useSheetData } from '@/lib/useSheetData'

function useCardBounds(containerRef: React.RefObject<HTMLDivElement | null>) {
  const [bounds, setBounds] = useState({ top: 0, left: 0, width: 0, height: 0 })

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const update = () => {
      const rect = el.getBoundingClientRect()
      const W = rect.width
      const S = rect.height
      if (!W || !S) return

      const aspect = 1.5
      const size = 0.62
      const captions = true
      const controls = true

      const bottomSpace = 46 * (captions ? 1 : 0) + 46 * (controls ? 1 : 0)
      const availH = Math.max(S - bottomSpace, 0.5 * S)
      const t = Math.min(Math.max((900 - W) / 500, 0), 1)
      const smooth = t * t * (3 - 2 * t)
      const widthFactor = 0.62 + 0.22 * smooth
      const activeH = Math.min(availH * Math.min(Math.max(size, 0.2), 0.98), (W * widthFactor) / aspect)
      const activeW = activeH * aspect
      const lift = (S - availH) / 2

      const top = S / 2 - lift - activeH / 2
      const left = W / 2 - activeW / 2

      setBounds({
        top: Math.round(top),
        left: Math.round(left),
        width: Math.round(activeW),
        height: Math.round(activeH),
      })
    }

    update()
    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => observer.disconnect()
  }, [containerRef])

  return bounds
}

export default function ProjectsPreview() {
  const navigate = useNavigate()
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const cardBounds = useCardBounds(containerRef)
  const { data: projects, status } = useSheetData('projects')

  const dragRef = useRef<{
    startX: number
    startY: number
    moved: boolean
  } | null>(null)

  const featured = useMemo(
    () =>
      projects
        .filter((p) => p.featured)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        .slice(0, 3),
    [projects],
  )

  const items = useMemo(
    () =>
      featured.map((p, i) => ({
        src: p.image || placeholderImage(p.order ?? i + 1),
        alt: p.title,
        title: p.title,
        subtitle: p.summary,
      })),
    [featured],
  )

  const activeProject = featured[activeIndex] ?? featured[0]

  const handlePointerDown = (e: React.PointerEvent) => {
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      moved: false,
    }
    const container = containerRef.current
    const canvasTarget = container?.querySelector('div[style*="pan-y"]') as HTMLElement | null
    if (canvasTarget) {
      canvasTarget.dispatchEvent(new PointerEvent('pointerdown', e.nativeEvent))
    }
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (dragRef.current) {
      if (Math.hypot(e.clientX - dragRef.current.startX, e.clientY - dragRef.current.startY) > 6) {
        dragRef.current.moved = true
      }
      const container = containerRef.current
      const canvasTarget = container?.querySelector('div[style*="pan-y"]') as HTMLElement | null
      if (canvasTarget) {
        canvasTarget.dispatchEvent(new PointerEvent('pointermove', e.nativeEvent))
      }
    }
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    if (dragRef.current) {
      const container = containerRef.current
      const canvasTarget = container?.querySelector('div[style*="pan-y"]') as HTMLElement | null
      if (canvasTarget) {
        canvasTarget.dispatchEvent(new PointerEvent('pointerup', e.nativeEvent))
      }
      setTimeout(() => {
        dragRef.current = null
      }, 50)
    }
  }

  const handleClick = (e: React.MouseEvent) => {
    if (dragRef.current?.moved) {
      e.preventDefault()
      e.stopPropagation()
      return
    }
    e.preventDefault()
    if (activeProject) {
      navigate(`/projects/${activeProject.slug}`)
    }
  }

  if (status === 'loading') {
    return (
      <section
        id="projects"
        aria-labelledby="projects-heading"
        className="relative py-[clamp(5rem,10vw,9rem)] min-h-[600px] sm:min-h-[700px] lg:min-h-[800px]"
        aria-busy="true"
      />
    )
  }

  if (!items.length) return null

  return (
    <section id="projects" aria-labelledby="projects-heading" className="relative py-[clamp(5rem,10vw,9rem)]">
      <div className="container-site flex flex-col items-center text-center">
        <h2
          id="projects-heading"
          className="text-[clamp(2rem,4vw,3.25rem)] font-light leading-tight tracking-[-0.02em]"
        >
          Our <span className="text-[var(--color-blue)]">Projects</span>
        </h2>

        <div ref={containerRef} className="relative mt-10 h-[460px] w-full max-w-6xl sm:h-[520px] lg:h-[580px]">
          <PrismCarousel
            items={items}
            aspect={1.5}
            size={0.62}
            neighborScale={0.66}
            gap={14}
            radius={18}
            sweep={1}
            sweepDuration={1.1}
            dispersion={1}
            autoplay={true}
            interval={4.5}
            loop={true}
            captions={true}
            controls={true}
            draggable={true}
            wheel={false}
            pauseOnHover={true}
            onIndexChange={(i) => {
              setActiveIndex(i)
            }}
            onSelect={(_, i) => {
              if (featured[i]) {
                navigate(`/projects/${featured[i].slug}`)
              }
            }}
          />

          {/* Active slide clickable overlay */}
          {activeProject && cardBounds.width > 0 && (
            <Link
              to={`/projects/${activeProject.slug}`}
              style={{
                position: 'absolute',
                top: cardBounds.top,
                left: cardBounds.left,
                width: cardBounds.width,
                height: cardBounds.height,
                borderRadius: 18,
              }}
              aria-label={activeProject.title}
              className="group pointer-events-auto flex flex-col justify-end overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-blue)]"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onClick={handleClick}
            >
              <div className="w-full bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-8 pb-3 px-4 text-center transition-opacity duration-200">
                <span className="text-xs font-medium tracking-wide text-white uppercase drop-shadow-md">
                  Click to view
                </span>
              </div>
            </Link>
          )}
        </div>

        {/* real links for screen readers and crawlers */}
        <ul className="sr-only">
          {featured.map((p) => (
            <li key={p.slug}>
              <Link to={`/projects/${p.slug}`}>
                {p.title}: {p.summary}
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-10">
          <Button to="/projects" variant="secondary" className="bg-[var(--color-blue)] text-white hover:bg-[var(--color-blue)]/90">
            View All Projects
          </Button>
        </div>
      </div>
    </section>
  )
}

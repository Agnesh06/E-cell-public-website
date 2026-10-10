import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import CircularCarousel from './CircularCarousel'
import { Button } from '@/components/common/Button'
import { projects } from '@/data/projects'
import { placeholderImage } from '@/lib/placeholder'

function useCardWidth() {
  const [w, setW] = useState(360)
  useEffect(() => {
    const update = () => setW(window.innerWidth < 640 ? 250 : window.innerWidth < 1024 ? 310 : 360)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])
  return w
}

export default function ProjectsPreview() {
  const navigate = useNavigate()
  const activeRef = useRef(0)
  const cardWidth = useCardWidth()

  const featured = useMemo(
    () =>
      projects
        .filter((p) => p.featured)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        .slice(0, 3),
    [],
  )

  const items = useMemo(
    () =>
      featured.map((p, i) => ({
        src: p.image ?? placeholderImage(i + 1),
        alt: p.title,
        title: p.title,
        subtitle: p.summary,
      })),
    [featured],
  )

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

        <div className="mt-10 h-[460px] w-full max-w-6xl sm:h-[520px] lg:h-[580px]">
          <CircularCarousel
            items={items}
            preset="orbit"
            intro="rise"
            cardWidth={cardWidth}
            aspectRatio={4 / 3}
            autoplay="drift"
            speed={12} direction="left"
            captions
            cardLabel="Click to view"
            fadeColor="#FAFAFD"
            cornerRadius={16}
            onChange={(i) => {
              activeRef.current = i
            }}
            onItemClick={(_, i) => {
              // front card opens the project; side cards just rotate to the front
              if (i === activeRef.current) navigate(`/projects/${featured[i].slug}`)
            }}
          />
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
          <Button to="/projects" variant="secondary">
            View All Projects
          </Button>
        </div>
      </div>
    </section>
  )
}

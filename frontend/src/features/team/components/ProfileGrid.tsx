import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { TeamProfileCard } from './TeamProfileCard'
import type { TeamProfile } from '@/types/teamDirectory'

interface ProfileGridProps {
  profiles: TeamProfile[]
  title?: string
}

export function ProfileGrid({ profiles, title }: ProfileGridProps) {
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = gridRef.current
    if (!el) return undefined

    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (isReduced) return undefined

    const cards = el.querySelectorAll('.profile-card-item')
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cards,
        {
          opacity: 0,
          y: 24,
          scale: 0.98,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.45,
          stagger: 0.04,
          ease: 'power2.out',
        },
      )
    }, el)

    return () => ctx.revert()
  }, [profiles])

  return (
    <div className="w-full">
      {title && (
        <div className="mb-6 flex items-center justify-between border-b border-[var(--color-hairline)] pb-3">
          <span className="font-mono text-xs font-medium tracking-wider text-[var(--color-ink-faint)] uppercase">
            {title}
          </span>
          <span className="rounded-full bg-[var(--color-blue-ghost)] px-2.5 py-0.5 font-mono text-xs font-semibold text-[var(--color-blue)]">
            {profiles.length} items
          </span>
        </div>
      )}
      <div
        ref={gridRef}
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4"
        data-testid="profile-grid"
      >
        {profiles.map((profile) => (
          <div key={profile.id} className="profile-card-item flex justify-center">
            <TeamProfileCard
              profile={profile}
              className="w-full max-w-[340px]"
            />
          </div>
        ))}
      </div>
    </div>
  )
}


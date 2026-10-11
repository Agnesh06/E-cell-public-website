import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { TeamProfileCard } from './TeamProfileCard'
import type { TeamProfile } from '@/types/teamDirectory'

interface ProfileGridProps {
  profiles: TeamProfile[]
  title?: string
  viewMode?: 'grid' | 'compact'
}

export function ProfileGrid({ profiles, title, viewMode = 'grid' }: ProfileGridProps) {
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
          y: 12,
          scale: 0.98,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.3,
          stagger: 0.03,
          ease: 'power2.out',
        },
      )
    }, el)

    return () => ctx.revert()
  }, [profiles, viewMode])

  if (profiles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-sm font-medium text-[var(--color-ink-muted)]">No matching members found</p>
        <p className="mt-1 text-xs text-[var(--color-ink-faint)]">Try adjusting your filter search query</p>
      </div>
    )
  }

  if (viewMode === 'compact') {
    return (
      <div className="w-full">
        {title && (
          <div className="mb-4 flex items-center justify-between border-b border-[var(--color-hairline)] pb-3 px-2">
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
          className="flex flex-col w-full divide-y divide-[var(--color-hairline)]"
          data-testid="profile-grid"
        >
          {profiles.map((profile) => (
            <div key={profile.id} className="profile-card-item w-full">
              <TeamProfileCard profile={profile} viewMode="compact" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      {title && (
        <div className="mb-4 flex items-center justify-between border-b border-[var(--color-hairline)] pb-3 px-2">
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
        className="grid w-full grid-cols-[repeat(auto-fill,minmax(110px,1fr))] gap-6 p-6 content-start justify-items-center"
        data-testid="profile-grid"
      >
        {profiles.map((profile) => (
          <div key={profile.id} className="profile-card-item flex justify-center w-full">
            <TeamProfileCard profile={profile} viewMode="grid" />
          </div>
        ))}
      </div>
    </div>
  )
}

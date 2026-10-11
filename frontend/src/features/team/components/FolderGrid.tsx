import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { FolderCard } from './FolderCard'

export interface FolderItemConfig {
  id: string
  label: string
  count: number
  description?: string
  color?: string
  onClick: () => void
}

interface FolderGridProps {
  folders: FolderItemConfig[]
  viewMode?: 'grid' | 'compact'
}

export function FolderGrid({ folders, viewMode = 'grid' }: FolderGridProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return undefined

    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (isReduced) return undefined

    const cards = el.querySelectorAll('.folder-card-wrapper')
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
          stagger: 0.04,
          ease: 'power2.out',
        },
      )
    }, el)

    return () => ctx.revert()
  }, [folders, viewMode])

  if (viewMode === 'compact') {
    return (
      <div
        ref={containerRef}
        className="flex flex-col w-full divide-y divide-[var(--color-hairline)]"
        data-testid="folder-grid"
      >
        {folders.map((folder) => (
          <div key={folder.id} className="folder-card-wrapper w-full">
            <FolderCard
              label={folder.label}
              count={folder.count}
              description={folder.description}
              color={folder.color}
              onClick={folder.onClick}
              viewMode="compact"
            />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="grid w-full grid-cols-[repeat(auto-fill,minmax(110px,1fr))] gap-6 p-6 content-start justify-items-center"
      data-testid="folder-grid"
    >
      {folders.map((folder) => (
        <div key={folder.id} className="folder-card-wrapper flex justify-center w-full">
          <FolderCard
            label={folder.label}
            count={folder.count}
            description={folder.description}
            color={folder.color}
            onClick={folder.onClick}
            viewMode="grid"
          />
        </div>
      ))}
    </div>
  )
}

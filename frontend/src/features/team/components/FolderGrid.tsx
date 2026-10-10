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
}

export function FolderGrid({ folders }: FolderGridProps) {
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
          y: 20,
          scale: 0.97,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.4,
          stagger: 0.08,
          ease: 'power2.out',
        },
      )
    }, el)

    return () => ctx.revert()
  }, [folders])

  return (
    <div
      ref={containerRef}
      className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 max-w-2xl mx-auto"
      data-testid="folder-grid"
    >
      {folders.map((folder) => (
        <div key={folder.id} className="folder-card-wrapper flex justify-center">
          <FolderCard
            label={folder.label}
            count={folder.count}
            description={folder.description}
            color={folder.color}
            onClick={folder.onClick}
          />
        </div>
      ))}
    </div>
  )
}


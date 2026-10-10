import { ChevronRight, Home, Folder as FolderIcon } from 'lucide-react'

export interface BreadcrumbSegment {
  id: string
  label: string
  onClick?: () => void
  isCurrent?: boolean
}

interface FinderBreadcrumbsProps {
  items: BreadcrumbSegment[]
}

export function FinderBreadcrumbs({ items }: FinderBreadcrumbsProps) {
  return (
    <nav aria-label="Finder Directory Breadcrumbs" className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm overflow-x-auto py-1 scrollbar-none">
      {items.map((item, index) => {
        const isFirst = index === 0

        return (
          <div key={item.id} className="flex items-center space-x-1 sm:space-x-2 shrink-0">
            {index > 0 && (
              <ChevronRight className="h-3.5 w-3.5 text-[var(--color-ink-faint)]" aria-hidden="true" />
            )}
            {item.isCurrent || !item.onClick ? (
              <span
                className="flex items-center gap-1.5 font-medium text-[var(--color-ink)] px-2 py-1 rounded-md bg-[var(--color-blue-ghost)]/60 font-sans"
                aria-current={item.isCurrent ? 'page' : undefined}
              >
                {isFirst ? (
                  <Home className="h-3.5 w-3.5 text-[var(--color-blue)]" aria-hidden="true" />
                ) : (
                  <FolderIcon className="h-3.5 w-3.5 text-[var(--color-blue)]" aria-hidden="true" />
                )}
                <span>{item.label}</span>
              </span>
            ) : (
              <button
                type="button"
                onClick={item.onClick}
                className="flex items-center gap-1.5 text-[var(--color-ink-muted)] hover:text-[var(--color-blue)] px-2 py-1 rounded-md hover:bg-white/80 transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--color-blue)]"
              >
                {isFirst ? (
                  <Home className="h-3.5 w-3.5" aria-hidden="true" />
                ) : (
                  <FolderIcon className="h-3.5 w-3.5" aria-hidden="true" />
                )}
                <span>{item.label}</span>
              </button>
            )}
          </div>
        )
      })}
    </nav>
  )
}

import { MacFolderIcon } from './MacFolderIcon'

export interface FolderCardProps {
  label: string
  count: number
  description?: string
  onClick: () => void
  color?: string
  viewMode?: 'grid' | 'compact'
}

export function FolderCard({
  label,
  count,
  description,
  onClick,
  viewMode = 'grid',
}: FolderCardProps) {
  if (viewMode === 'compact') {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={`Open ${label} folder containing ${count} items`}
        className="group flex w-full items-center justify-between rounded-xl px-4 py-3 text-left transition-all duration-150 hover:bg-[var(--color-blue-ghost)]/80 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--color-blue)] cursor-pointer border border-transparent hover:border-[var(--color-blue)]/20"
      >
        <div className="flex items-center gap-3 min-w-0">
          <MacFolderIcon className="w-8 h-6.5 shrink-0" />
          <div className="min-w-0">
            <span className="text-sm font-medium text-[var(--color-ink)] group-hover:text-[var(--color-blue)] transition-colors truncate block">
              {label}
            </span>
            {description && (
              <span className="text-xs text-[var(--color-ink-muted)] truncate block">
                {description}
              </span>
            )}
          </div>
        </div>
        <span className="shrink-0 rounded-full bg-[var(--color-blue-ghost)] px-2.5 py-0.5 font-mono text-xs font-semibold text-[var(--color-blue)]">
          {count} {count === 1 ? 'item' : 'items'}
        </span>
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Open ${label} folder containing ${count} items`}
      title={description || `${label} (${count} items)`}
      className="group relative flex w-[110px] flex-col items-center justify-start rounded-xl p-2.5 transition-all duration-150 hover:bg-[var(--color-blue-ghost)]/70 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--color-blue)] cursor-pointer select-none text-center"
    >
      <div className="relative flex items-center justify-center pt-1 pb-1">
        <MacFolderIcon className="w-20 h-16 transition-transform duration-200 group-hover:scale-105" />
      </div>
      <span className="mt-2 text-center text-xs font-medium text-[var(--color-ink)] leading-snug line-clamp-2 w-full break-words group-hover:text-[var(--color-blue)] transition-colors">
        {label}
      </span>
      <span className="mt-0.5 text-center text-[10px] font-mono text-[var(--color-ink-faint)]">
        {count} {count === 1 ? 'item' : 'items'}
      </span>
    </button>
  )
}

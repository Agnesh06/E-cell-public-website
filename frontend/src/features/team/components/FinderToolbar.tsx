import { ArrowLeft, LayoutGrid, List, Search, SlidersHorizontal } from 'lucide-react'
import { FinderBreadcrumbs, type BreadcrumbSegment } from './FinderBreadcrumbs'

interface FinderToolbarProps {
  breadcrumbs: BreadcrumbSegment[]
  onBack?: () => void
  canGoBack: boolean
  searchQuery: string
  onSearchChange: (query: string) => void
  currentCount?: number
  viewMode: 'grid' | 'compact'
  onViewModeChange: (mode: 'grid' | 'compact') => void
}

export function FinderToolbar({
  breadcrumbs,
  onBack,
  canGoBack,
  searchQuery,
  onSearchChange,
  currentCount,
  viewMode,
  onViewModeChange,
}: FinderToolbarProps) {
  return (
    <div className="w-full border-b border-[var(--color-hairline)] bg-zinc-100/80 px-4 py-3 backdrop-blur-xl select-none">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {/* Left side: macOS Traffic Lights + Back button + Breadcrumbs */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap sm:flex-nowrap">
          {/* macOS Window Controls (Traffic Lights) */}
          <div className="flex items-center gap-2 pl-0.5 pr-2 shrink-0" aria-hidden="true">
            <span className="h-3 w-3 rounded-full bg-[#FF5F56] border border-[#E0443E]/60 inline-block shadow-2xs" />
            <span className="h-3 w-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]/60 inline-block shadow-2xs" />
            <span className="h-3 w-3 rounded-full bg-[#27C93F] border border-[#1AAB29]/60 inline-block shadow-2xs" />
          </div>

          <div className="h-4 w-px bg-[var(--color-hairline)] mx-0.5 hidden sm:block" aria-hidden="true" />

          {/* macOS Finder-style Back button */}
          <button
            type="button"
            onClick={onBack}
            disabled={!canGoBack}
            aria-label="Go back to parent directory"
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[var(--color-border)] transition-all ${
              canGoBack
                ? 'bg-white text-[var(--color-ink)] hover:border-[var(--color-blue)] hover:bg-[var(--color-blue-ghost)] hover:text-[var(--color-blue)] shadow-2xs cursor-pointer'
                : 'bg-zinc-100/60 text-zinc-300 border-zinc-200/50 cursor-not-allowed'
            } focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--color-blue)]`}
          >
            <ArrowLeft className="h-3.5 w-3.5" />
          </button>

          {/* Breadcrumb path */}
          <div className="min-w-0 flex-1">
            <FinderBreadcrumbs items={breadcrumbs} />
          </div>
        </div>

        {/* Right side: Search, View Mode, and Count */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Quick filter input */}
          <div className="relative flex-1 sm:w-52">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--color-ink-faint)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Filter names or roles..."
              aria-label="Filter current directory"
              className="h-8 w-full rounded-lg border border-[var(--color-border)] bg-white/90 pl-8 pr-3 text-xs text-[var(--color-ink)] placeholder-[var(--color-ink-faint)] shadow-2xs transition-colors focus:border-[var(--color-blue)] focus:outline-hidden focus:ring-2 focus:ring-[var(--color-blue)]/20"
            />
          </div>

          {/* View toggle */}
          <div className="flex h-8 items-center rounded-lg border border-[var(--color-border)] bg-zinc-200/60 p-0.5">
            <button
              type="button"
              onClick={() => onViewModeChange('grid')}
              aria-label="Grid view"
              className={`flex h-6.5 w-6.5 items-center justify-center rounded-md transition-all ${
                viewMode === 'grid'
                  ? 'bg-white text-[var(--color-blue)] shadow-2xs font-semibold'
                  : 'text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]'
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('compact')}
              aria-label="Compact view"
              className={`flex h-6.5 w-6.5 items-center justify-center rounded-md transition-all ${
                viewMode === 'compact'
                  ? 'bg-white text-[var(--color-blue)] shadow-2xs font-semibold'
                  : 'text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]'
              }`}
            >
              <List className="h-3.5 w-3.5" />
            </button>
          </div>

          {currentCount !== undefined && (
            <div className="hidden sm:flex items-center gap-1.5 rounded-lg border border-[var(--color-hairline)] bg-white/80 px-2.5 py-1 font-mono text-xs text-[var(--color-ink-muted)] shadow-2xs">
              <SlidersHorizontal className="h-3 w-3 text-[var(--color-blue)]" />
              <span>{currentCount}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

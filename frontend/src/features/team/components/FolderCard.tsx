import Folder from '@/components/reactbits/Folder'
import { ArrowRight, Users, Sparkles } from 'lucide-react'

interface FolderCardProps {
  label: string
  count: number
  description?: string
  onClick: () => void
  color?: string
}

export function FolderCard({
  label,
  count,
  description,
  onClick,
  color = '#2547FF',
}: FolderCardProps) {
  // Folder preview miniature items inside the React Bits folder
  const folderPreviewItems = [
    {
      title: `${label} 1`,
      content: (
        <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-white to-[var(--color-blue-ghost)] p-2 text-center">
          <Sparkles className="h-4 w-4 text-[var(--color-blue)] mb-1" />
          <span className="text-[10px] font-semibold text-[var(--color-ink)] truncate max-w-full">
            {label}
          </span>
          <span className="text-[8px] font-mono text-[var(--color-ink-faint)]">E-Cell</span>
        </div>
      ),
    },
    {
      title: `${label} 2`,
      content: (
        <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[var(--color-blue-ghost)] to-white p-2 text-center">
          <Users className="h-4 w-4 text-[var(--color-blue)] mb-1" />
          <span className="text-[10px] font-semibold text-[var(--color-ink)] truncate max-w-full">
            {count} members
          </span>
          <span className="text-[8px] font-mono text-[var(--color-blue)]">Verified</span>
        </div>
      ),
    },
  ]

  return (
    <div
      onClick={onClick}
      className="group relative flex w-full max-w-sm flex-col items-center justify-between rounded-2xl border border-[var(--color-hairline)] bg-white/85 p-4 sm:p-5 backdrop-blur-md shadow-xs transition-all duration-300 hover:border-[var(--color-blue)]/50 hover:bg-white hover:shadow-[0_16px_36px_-12px_rgba(37,71,255,0.18)] cursor-pointer text-left"
    >
      {/* Top badges / count */}
      <div className="flex w-full items-center justify-between">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-hairline)] bg-[var(--color-blue-ghost)] px-2.5 py-0.5 font-mono text-[11px] font-semibold text-[var(--color-blue)]">
          <Users className="h-3 w-3" />
          {count} {count === 1 ? 'item' : 'items'}
        </span>
        <span className="text-[10px] font-mono tracking-wider text-[var(--color-ink-faint)] uppercase">
          Directory
        </span>
      </div>

      {/* Official React Bits Folder Component */}
      <div className="my-3 flex items-center justify-center py-1 transition-transform duration-300 group-hover:scale-105">
        <Folder
          label={label}
          color={color}
          size={130}
          mode="flap"
          variant="matte"
          paperColor="#FFFFFF"
          items={folderPreviewItems}
          theme="light"
        />
      </div>

      {/* Title, description, and action footer */}
      <div className="w-full border-t border-[var(--color-hairline)]/80 pt-3">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-base font-semibold tracking-tight text-[var(--color-ink)] group-hover:text-[var(--color-blue)] transition-colors truncate">
              {label}
            </h2>
            {description && (
              <p className="mt-0.5 text-xs text-[var(--color-ink-muted)] line-clamp-1">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onClick()
            }}
            aria-label={`Open ${label} folder containing ${count} items`}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-blue-ghost)] text-[var(--color-blue)] transition-transform duration-300 group-hover:translate-x-1 group-hover:bg-[var(--color-blue)] group-hover:text-white focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--color-blue)] cursor-pointer"
          >
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}

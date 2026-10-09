import React from 'react'

export interface GridBackdropProps {
  className?: string
}

export const GridBackdrop: React.FC<GridBackdropProps> = ({ className = '' }) => {
  return (
    <div
      className={`absolute inset-0 pointer-events-none select-none z-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {/* 3-column hairline grid (container-site width) */}
      <div className="container-site h-full relative">
        <div className="grid grid-cols-3 h-full border-x border-[var(--color-hairline)] opacity-40">
          <div className="border-r border-[var(--color-hairline)] relative">
            {/* Top crosshair */}
            <div className="absolute top-[25%] -right-[5px] w-[11px] h-[11px] flex items-center justify-center text-[var(--color-ink-faint)]">
              <span className="absolute w-[11px] h-[1px] bg-current opacity-60" />
              <span className="absolute w-[1px] h-[11px] bg-current opacity-60" />
            </div>
            {/* Bottom crosshair */}
            <div className="absolute top-[75%] -right-[5px] w-[11px] h-[11px] flex items-center justify-center text-[var(--color-ink-faint)]">
              <span className="absolute w-[11px] h-[1px] bg-current opacity-60" />
              <span className="absolute w-[1px] h-[11px] bg-current opacity-60" />
            </div>
          </div>
          <div className="border-r border-[var(--color-hairline)] relative">
            {/* Top crosshair */}
            <div className="absolute top-[25%] -right-[5px] w-[11px] h-[11px] flex items-center justify-center text-[var(--color-ink-faint)]">
              <span className="absolute w-[11px] h-[1px] bg-current opacity-60" />
              <span className="absolute w-[1px] h-[11px] bg-current opacity-60" />
            </div>
            {/* Bottom crosshair */}
            <div className="absolute top-[75%] -right-[5px] w-[11px] h-[11px] flex items-center justify-center text-[var(--color-ink-faint)]">
              <span className="absolute w-[11px] h-[1px] bg-current opacity-60" />
              <span className="absolute w-[1px] h-[11px] bg-current opacity-60" />
            </div>
          </div>
          <div className="relative" />
        </div>

        {/* Faint horizontal lines */}
        <div className="absolute top-[25%] left-0 right-0 h-[1px] bg-[var(--color-hairline)] opacity-25" />
        <div className="absolute top-[75%] left-0 right-0 h-[1px] bg-[var(--color-hairline)] opacity-25" />
      </div>
    </div>
  )
}

export default GridBackdrop


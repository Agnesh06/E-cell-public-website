import React from 'react'
import { Eyebrow } from '@/components/common/Eyebrow'
import { Pill } from '@/components/common/Pill'

export interface StepTextProps {
  eyebrow: string
  headlineTop: string
  headlineAccent: string
  body: string
  pills: string[]
  className?: string
}

export const StepText: React.FC<StepTextProps> = ({
  eyebrow,
  headlineTop,
  headlineAccent,
  body,
  pills,
  className = '',
}) => {
  return (
    <div className={`step-text flex flex-col items-start ${className}`}>
      {/* Eyebrow */}
      <Eyebrow className="mb-4 text-xs md:text-sm font-mono tracking-[0.22em] text-[var(--color-blue)] uppercase">
        {eyebrow}
      </Eyebrow>

      {/* Two-line headline */}
      <h3 className="text-[clamp(2.5rem,5vw,4.5rem)] font-light tracking-[-0.03em] leading-[0.98] text-[var(--color-ink)] mb-6">
        <span className="block">{headlineTop}</span>
        <span className="block text-[var(--color-blue)]">{headlineAccent}</span>
      </h3>

      {/* Body */}
      <p className="text-base md:text-lg text-[var(--color-ink-muted)] max-w-[46ch] leading-relaxed mb-6 md:mb-8 font-normal">
        {body}
      </p>

      {/* Pill tags */}
      {pills.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {pills.map((pill, i) => (
            <Pill
              key={i}
              className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.16em] bg-white/50 border-[var(--color-hairline)] text-[var(--color-ink-muted)]"
            >
              <span className="opacity-40 mr-1">-</span>
              {pill}
            </Pill>
          ))}
        </div>
      )}
    </div>
  )
}

export default StepText


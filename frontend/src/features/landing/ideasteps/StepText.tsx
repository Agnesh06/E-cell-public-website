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

const haloStyle: React.CSSProperties = {
  textShadow:
    '0 0 8px var(--color-bg), 0 0 8px var(--color-bg), 0 0 14px var(--color-bg), 0 0 20px var(--color-bg)',
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
      <Eyebrow
        className="mb-4 text-[clamp(0.7rem,1.5vh,0.875rem)] font-mono tracking-[0.22em] text-[var(--color-blue)] uppercase"
        style={haloStyle}
      >
        {eyebrow}
      </Eyebrow>

      {/* Two-line headline — weight 400 */}
      <h3
        className="text-[clamp(2.25rem,min(5.5vw,9vh),5rem)] tracking-[-0.03em] leading-[0.98] text-[var(--color-ink)] mb-6"
        style={{ fontWeight: 400, ...haloStyle }}
      >
        <span className="block">{headlineTop}</span>
        <span className="block text-[var(--color-blue)]">{headlineAccent}</span>
      </h3>

      {/* Body — weight 500, full ink, +10% size */}
      <p
        className="text-[clamp(0.99rem,2.4vh,1.24rem)] text-[var(--color-ink)] max-w-[46ch] leading-relaxed mb-6 md:mb-8"
        style={{ fontWeight: 500, ...haloStyle }}
      >
        {body}
      </p>

      {/* Pill tags */}
      {pills.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {pills.map((pill, i) => (
            <Pill
              key={i}
              className="text-[clamp(0.6rem,1.2vh,0.75rem)] font-mono uppercase tracking-[0.16em] bg-white/50 border-[var(--color-hairline)] text-[var(--color-ink-muted)]"
              style={haloStyle}
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

import React from 'react'
import type { IdeaCard } from '@/types'

export interface StepCardsProps {
  layout: 'quote' | 'trio' | 'quad' | 'grid2x2'
  cards: IdeaCard[]
  tilt?: number
  className?: string
}

export const StepCards: React.FC<StepCardsProps> = ({
  layout,
  cards,
  tilt = 0,
  className = '',
}) => {
  const tiltStyle: React.CSSProperties = tilt ? { transform: `rotate(${tilt}deg)` } : {}

  if (layout === 'quote') {
    const card = cards[0]
    if (!card) return null

    return (
      <div className={`step-cards w-full max-w-full xl:max-w-[560px] ${className}`} style={tiltStyle}>
        <div className="glass-card relative p-[clamp(12px,2.2vh,20px)] overflow-hidden border border-[var(--color-hairline)] rounded-[var(--radius-card)] bg-[var(--color-surface)] shadow-[var(--shadow-glass)]">
          {/* Large blue-ghost opening quote mark */}
          <span
            className="absolute -top-4 -left-2 text-[8rem] md:text-[10rem] font-serif leading-none text-[var(--color-blue-ghost)] select-none pointer-events-none opacity-80"
            aria-hidden="true"
          >
            “
          </span>

          <p className="relative z-10 text-[clamp(0.95rem,2.4vh,1.25rem)] font-light text-[var(--color-ink)] leading-relaxed italic">
            "{card.text}"
          </p>
        </div>
      </div>
    )
  }

  if (layout === 'trio') {
    const horizontalOffsets = ['xl:translate-x-0', 'xl:translate-x-10', 'xl:translate-x-4']

    return (
      <div
        className={`step-cards w-full max-w-full xl:max-w-[540px] flex flex-col gap-[clamp(8px,1.6vh,16px)] ${className}`}
        style={tiltStyle}
      >
        {cards.map((card, i) => (
          <div
            key={i}
            className={`glass-card p-[clamp(12px,2.2vh,20px)] border border-[var(--color-hairline)] rounded-[var(--radius-card)] bg-[var(--color-surface)] shadow-[var(--shadow-glass)] transition-transform duration-200 ${
              horizontalOffsets[i % horizontalOffsets.length]
            }`}
          >
            <div className="flex items-baseline gap-3 mb-2">
              {card.index && (
                <span className="font-mono text-sm font-semibold text-[var(--color-blue)]">
                  {card.index}
                </span>
              )}
              {card.title && (
                <h4 className="text-[clamp(0.95rem,2.4vh,1.25rem)] font-medium text-[var(--color-ink)]">
                  {card.title}
                </h4>
              )}
            </div>
            <p className="text-[clamp(0.78rem,1.9vh,0.95rem)] text-[var(--color-ink-muted)] leading-relaxed">
              {card.text}
            </p>
          </div>
        ))}
      </div>
    )
  }

  if (layout === 'quad') {
    return (
      <div className={`step-cards w-full max-w-full xl:max-w-[540px] ${className}`} style={tiltStyle}>
        <div className="relative pl-6 md:pl-8 flex flex-col gap-[clamp(8px,1.6vh,16px)]">
          {/* Vertical timeline rail */}
          <div
            className="absolute left-[11px] md:left-[15px] top-4 bottom-4 w-[1px] bg-[var(--color-hairline)]"
            aria-hidden="true"
          />

          {cards.map((card, i) => (
            <div key={i} className="relative flex items-start">
              {/* Numbered blue node */}
              <div
                className="absolute -left-6 md:-left-8 top-[clamp(12px,2.2vh,20px)] w-6 h-6 rounded-full bg-white border-2 border-[var(--color-blue)] flex items-center justify-center text-[10px] font-mono font-bold text-[var(--color-blue)] shadow-sm z-10"
                aria-hidden="true"
              >
                {card.index ?? i + 1}
              </div>

              {/* Compact glass card */}
              <div className="glass-card w-full p-[clamp(12px,2.2vh,20px)] border border-[var(--color-hairline)] rounded-[var(--radius-card)] bg-[var(--color-surface)] shadow-[var(--shadow-glass)]">
                {card.title && (
                  <h4 className="text-[clamp(0.95rem,2.4vh,1.25rem)] font-medium text-[var(--color-ink)] mb-1">
                    {card.title}
                  </h4>
                )}
                <p className="text-[clamp(0.78rem,1.9vh,0.95rem)] text-[var(--color-ink-muted)] leading-relaxed">
                  {card.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (layout === 'grid2x2') {
    return (
      <div
        className={`step-cards w-full max-w-full xl:max-w-[560px] grid grid-cols-1 sm:grid-cols-2 gap-[clamp(8px,1.6vh,16px)] ${className}`}
        style={tiltStyle}
      >
        {cards.map((card, i) => (
          <div
            key={i}
            className="glass-card p-[clamp(12px,2.2vh,20px)] border border-[var(--color-hairline)] rounded-[var(--radius-card)] bg-[var(--color-surface)] shadow-[var(--shadow-glass)] flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                {card.index && (
                  <span className="font-mono text-xs font-semibold text-[var(--color-blue)]">
                    {card.index}
                  </span>
                )}
              </div>
              {card.title && (
                <h4 className="text-[clamp(0.95rem,2.4vh,1.25rem)] font-medium text-[var(--color-ink)] mb-2">
                  {card.title}
                </h4>
              )}
            </div>
            <p className="text-[clamp(0.78rem,1.9vh,0.95rem)] text-[var(--color-ink-muted)] leading-relaxed">
              {card.text}
            </p>
          </div>
        ))}
      </div>
    )
  }

  return null
}

export default StepCards


import React from 'react'

export interface StepIndicatorProps {
  count?: number
  activeIndex: number
  onSelect?: (index: number) => void
  className?: string
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  count = 5,
  activeIndex,
  onSelect,
  className = '',
}) => {
  const steps = Array.from({ length: count }, (_, i) => i)

  return (
    <div
      role="group"
      aria-label="Steps"
      className={`step-indicator flex items-center gap-3 font-mono text-xs select-none ${className}`}
    >
      {steps.map((index) => {
        const isActive = index === activeIndex
        const label = String(index + 1).padStart(2, '0')

        return (
          <button
            key={index}
            type="button"
            onClick={() => onSelect?.(index)}
            aria-current={isActive ? 'step' : undefined}
            aria-label={`Step ${label}`}
            className={`relative py-1 px-1 transition-colors duration-150 cursor-pointer ${
              isActive
                ? 'text-[var(--color-blue)] font-semibold'
                : 'text-[#6E6E70] hover:text-[var(--color-ink)]'
            }`}
          >
            <span>{label}</span>
            {isActive && (
              <span
                className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[var(--color-blue)]"
                aria-hidden="true"
              />
            )}
          </button>
        )
      })}
    </div>
  )
}

export default StepIndicator


import React from 'react'
import type { IdeaStep } from '@/types'
import { StepText } from './StepText'
import { StepCards } from './StepCards'
import { StepIndicator } from './StepIndicator'

export interface StepProps {
  step: IdeaStep
  stepIndex: number
  totalSteps?: number
  onSelectStep?: (index: number) => void
  className?: string
  hideIndicator?: boolean
}

export const Step: React.FC<StepProps> = React.memo(({
  step,
  stepIndex,
  totalSteps = 5,
  onSelectStep,
  className = '',
  hideIndicator = false,
}) => {
  return (
    <div
      id={`step-${step.id}`}
      data-step-index={stepIndex}
      className={`step-stage relative w-full h-auto lg:h-[100svh] flex flex-col lg:grid lg:grid-rows-[104px_minmax(0,1fr)_auto] scroll-mt-20 py-8 sm:py-10 md:py-12 lg:py-0 ${className}`}
    >
      {/* Row 1: Header-safe top padding (desktop pinned stage only) */}
      <div className="hidden lg:block pointer-events-none" aria-hidden="true" />

      {/* Row 2: Content (1fr, min-height 0, centred on desktop) */}
      <div className="container-site relative z-10 w-full min-h-0 lg:h-full lg:flex lg:flex-col lg:justify-center">
        <div className="step-content-block grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center w-full lg:h-full">
          {/* Columns 1-5: Text block */}
          <div className="step-text-container lg:col-span-5 flex flex-col justify-center lg:h-full">
            <StepText
              eyebrow={step.eyebrow}
              headlineTop={step.headlineTop}
              headlineAccent={step.headlineAccent}
              body={step.body}
              pills={step.pills}
            />
          </div>

          {/* Column 6: Spacer gap */}
          <div className="hidden lg:block lg:col-span-1" aria-hidden="true" />

          {/* Columns 7-12: Cards */}
          <div className="step-cards-container lg:col-span-6 flex justify-center lg:justify-end items-center lg:h-full">
            <StepCards layout={step.layout} cards={step.cards} />
          </div>
        </div>
      </div>

      {/* Row 3: Bottom bar */}
      <div className="step-bottom-bar container-site relative z-10 w-full pt-4 pb-2 lg:pb-8 lg:pt-4 flex items-end justify-between text-xs font-mono select-none">
        {/* Bottom-left: indicator & sideLabel */}
        <div className="hidden lg:flex items-center gap-6">
          {!hideIndicator ? (
            <StepIndicator
              count={totalSteps}
              activeIndex={stepIndex}
              onSelect={onSelectStep}
            />
          ) : (
            <div className="w-[140px] invisible" aria-hidden="true" />
          )}
          {step.sideLabel && (
            <span
              className="text-[var(--color-ink-muted)] tracking-wider"
              style={{ fontWeight: 500 }}
            >
              {step.sideLabel}
            </span>
          )}
        </div>

        {/* Bottom-right: first micro-label in mono, subtle grey */}
        {step.microLabels[0] && (
          <div
            className="ml-auto text-[#6E6E70] tracking-[0.2em] uppercase"
            style={{ fontWeight: 500 }}
          >
            {step.microLabels[0]}
          </div>
        )}
      </div>
    </div>
  )
})

export default Step

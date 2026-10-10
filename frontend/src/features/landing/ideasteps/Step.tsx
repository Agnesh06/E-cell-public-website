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

const haloStyle: React.CSSProperties = {
  textShadow:
    '0 0 8px var(--color-bg), 0 0 8px var(--color-bg), 0 0 14px var(--color-bg)',
}

export const Step: React.FC<StepProps> = ({
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
      className={`step-stage relative h-[100svh] w-full grid grid-rows-[104px_minmax(0,1fr)_auto] ${className}`}
    >
      {/* Row 1: Header-safe top padding */}
      <div className="pointer-events-none" aria-hidden="true" />

      {/* Row 2: Content (1fr, min-height 0, centred) */}
      <div className="container-site relative z-10 w-full h-full flex flex-col justify-center min-h-0">
        <div className="step-content-block grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center h-full w-full">
          {/* Columns 1-5: Text block */}
          <div className="step-text-container lg:col-span-5 flex flex-col justify-center h-full">
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
          <div className="step-cards-container lg:col-span-6 flex justify-center lg:justify-end items-center h-full">
            <StepCards layout={step.layout} cards={step.cards} />
          </div>
        </div>
      </div>

      {/* Row 3: Bottom bar */}
      <div className="step-bottom-bar container-site relative z-10 w-full pb-8 pt-4 flex items-end justify-between text-xs font-mono select-none">
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
              style={{ fontWeight: 500, ...haloStyle }}
            >
              {step.sideLabel}
            </span>
          )}
        </div>

        {/* Bottom-right: first micro-label in mono, subtle grey */}
        {step.microLabels[0] && (
          <div
            className="ml-auto text-[#6E6E70] tracking-[0.2em] uppercase"
            style={{ fontWeight: 500, ...haloStyle }}
          >
            {step.microLabels[0]}
          </div>
        )}
      </div>
    </div>
  )
}

export default Step

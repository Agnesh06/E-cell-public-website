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
      className={`step-stage relative min-h-[100svh] w-full flex flex-col justify-between py-16 md:py-20 lg:py-24 ${className}`}
    >
      {/* Main 12-column grid layout for desktop */}
      <div className="container-site relative z-10 my-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Columns 1-5: Text block */}
          <div className="lg:col-span-5 flex flex-col justify-center">
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
          <div className="lg:col-span-6 flex justify-center lg:justify-end items-center">
            <StepCards layout={step.layout} cards={step.cards} />
          </div>
        </div>
      </div>

      {/* Bottom bar: indicator on left, sideLabel, first microLabel on right */}
      <div className="container-site relative z-10 w-full pt-8 flex items-end justify-between text-xs font-mono select-none">
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
            <span className="text-[var(--color-ink-muted)] tracking-wider">
              {step.sideLabel}
            </span>
          )}
        </div>

        {/* Bottom-right: first micro-label in mono, subtle grey — decorative only */}
        {step.microLabels[0] && (
          <div className="ml-auto text-[#6E6E70] tracking-[0.2em] uppercase">
            {step.microLabels[0]}
          </div>
        )}
      </div>
    </div>
  )
}

export default Step


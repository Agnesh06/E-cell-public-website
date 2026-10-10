import React, { useRef } from 'react'
import { ideas } from '@/data/ideas'
import { GridBackdrop } from '@/components/common/GridBackdrop'
import { GlowBlob } from '@/components/common/GlowBlob'
import { Step } from './Step'
import { FlowLine } from './FlowLine'
import { StepIndicator } from './StepIndicator'
import { useIdeaStepsTimeline } from './useIdeaStepsTimeline'

export const PinnedIdeaSteps: React.FC = () => {
  const stageRef = useRef<HTMLDivElement>(null)
  const drawnPathRef = useRef<SVGPathElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const stepRefs = useRef<(HTMLDivElement | null)[]>([])

  const { activeIndex, goToStep } = useIdeaStepsTimeline({
    scopeRef: stageRef,
    drawnPathRef,
    glowRef,
    stepRefs,
    totalSteps: ideas.length,
  })

  return (
    <div
      ref={stageRef}
      className="pinned-stage relative w-full h-[100svh] overflow-hidden bg-[var(--color-bg)]"
      data-active-step={activeIndex + 1}
      data-active-index={activeIndex}
      data-progress="0.00"
    >
      {/* Background grid */}
      <GridBackdrop className="opacity-70" />

      {/* Animated glow blob */}
      <GlowBlob ref={glowRef} corner="bottom-left" />

      {/* Decorative flow line — z-0, renders below step content */}
      <FlowLine drawnPathRef={drawnPathRef} />

      {/* The five Step components stacked absolutely (inset 0) */}
      {ideas.map((step, index) => {
        const isActive = activeIndex === index
        return (
          <div
            key={step.id}
            ref={(el) => {
              stepRefs.current[index] = el
            }}
            className="step-stage-slide absolute inset-0 w-full h-full will-change-[transform,opacity]"
            aria-hidden={!isActive}
            inert={!isActive ? true : undefined}
          >
            <Step
              step={step}
              stepIndex={index}
              totalSteps={ideas.length}
              hideIndicator={true}
              className="h-full"
            />
          </div>
        )
      })}

      {/* Shared bottom-left StepIndicator at the pinned stage level */}
      <div className="container-site absolute bottom-8 left-0 right-0 z-30 pointer-events-none select-none">
        <div className="hidden lg:flex items-center gap-6 pointer-events-auto">
          <StepIndicator
            count={ideas.length}
            activeIndex={activeIndex}
            onSelect={goToStep}
          />
        </div>
      </div>
    </div>
  )
}

export default PinnedIdeaSteps

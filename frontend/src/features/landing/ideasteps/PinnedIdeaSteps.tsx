import React, { Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { ideas } from '@/data/ideas'
import { GridBackdrop } from '@/components/common/GridBackdrop'
import { GlowBlob } from '@/components/common/GlowBlob'
import { Step } from './Step'
import { FlowLine } from './FlowLine'
import { StepIndicator } from './StepIndicator'
import { useIdeaStepsTimeline } from './useIdeaStepsTimeline'

const FlowArrow3D = React.lazy(() => import('./FlowArrow3D'))

const PinnedStepIndicator: React.FC<{
  count: number
  onSelect: (index: number) => void
  onRegisterIndexListener: (cb: (idx: number) => void) => () => void
}> = React.memo(({ count, onSelect, onRegisterIndexListener }) => {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    return onRegisterIndexListener(setActiveIndex)
  }, [onRegisterIndexListener])

  return (
    <StepIndicator
      count={count}
      activeIndex={activeIndex}
      onSelect={onSelect}
    />
  )
})

export const PinnedIdeaSteps: React.FC = () => {
  const stageRef = useRef<HTMLDivElement>(null)
  const drawnPathRef = useRef<SVGPathElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const stepRefs = useRef<(HTMLDivElement | null)[]>([])
  const renderArrowRef = useRef<((p?: number) => void) | null>(null)
  const indexListenerRef = useRef<((idx: number) => void) | null>(null)

  const handleActiveIndexChange = useCallback((idx: number) => {
    indexListenerRef.current?.(idx)
  }, [])

  const registerIndexListener = useCallback((cb: (idx: number) => void) => {
    indexListenerRef.current = cb
    return () => {
      indexListenerRef.current = null
    }
  }, [])

  const { goToStep, progressRef } = useIdeaStepsTimeline({
    scopeRef: stageRef,
    drawnPathRef,
    glowRef,
    stepRefs,
    totalSteps: ideas.length,
    onTimelineUpdate: (p) => renderArrowRef.current?.(p),
    onActiveIndexChange: handleActiveIndexChange,
  })

  return (
    <div
      ref={stageRef}
      className="pinned-stage relative w-full h-[100svh] overflow-hidden bg-[var(--color-bg)]"
      data-active-step="1"
      data-active-index="0"
      data-progress="0.00"
    >
      {/* Background grid */}
      <GridBackdrop className="opacity-70" />

      {/* Animated glow blob */}
      <GlowBlob ref={glowRef} corner="bottom-left" />

      {/* Decorative flow line — z-0, renders below step content */}
      <FlowLine drawnPathRef={drawnPathRef} />

      {/* 3D Paper-Plane Arrow riding the scroll line */}
      <Suspense fallback={null}>
        <FlowArrow3D
          drawnPathRef={drawnPathRef}
          stageRef={stageRef}
          progressRef={progressRef}
          renderRef={renderArrowRef}
        />
      </Suspense>

      {/* The five Step components stacked absolutely (inset 0) on layer z-10 above canvas */}
      {ideas.map((step, index) => {
        const isActive = index === 0
        return (
          <div
            key={step.id}
            ref={(el) => {
              stepRefs.current[index] = el
            }}
            className="step-stage-slide absolute inset-0 w-full h-full z-10"
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
          <PinnedStepIndicator
            count={ideas.length}
            onSelect={goToStep}
            onRegisterIndexListener={registerIndexListener}
          />
        </div>
      </div>
    </div>
  )
}

export default PinnedIdeaSteps

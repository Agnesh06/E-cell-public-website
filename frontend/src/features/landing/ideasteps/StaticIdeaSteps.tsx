import React from 'react'
import { ideas } from '@/data/ideas'
import { GridBackdrop } from '@/components/common/GridBackdrop'
import { GlowBlob, type GlowBlobCorner } from '@/components/common/GlowBlob'
import { useLenis } from '@/app/smoothScroll'
import { Step } from './Step'

const glowCorners: GlowBlobCorner[] = [
  'bottom-left',
  'top-right',
  'bottom-left',
  'bottom-right',
  'bottom-right',
]

export const StaticIdeaSteps: React.FC = () => {
  const lenis = useLenis()

  const handleSelectStep = (index: number) => {
    const step = ideas[index]
    if (!step) return
    const el = document.getElementById(`step-${step.id}`)
    if (!el) return

    if (lenis) {
      try {
        lenis.scrollTo(el)
      } catch {
        el.scrollIntoView({ behavior: 'smooth' })
      }
      el.scrollIntoView({ behavior: 'smooth' })
    } else {
      const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      el.scrollIntoView({ behavior: isReduced ? 'auto' : 'smooth' })
    }
  }

  return (
    <div className="static-idea-steps relative w-full overflow-hidden">
      {/* GridBackdrop behind the whole group */}
      <GridBackdrop className="opacity-70" />

      {/* Render the five steps stacked */}
      {ideas.map((step, index) => (
        <div key={step.id} className="relative w-full border-b border-[var(--color-hairline)]/30 last:border-b-0">
          {/* Faint GlowBlob per step with assigned corner preset */}
          <GlowBlob corner={glowCorners[index % glowCorners.length]} />

          <Step
            step={step}
            stepIndex={index}
            totalSteps={ideas.length}
            onSelectStep={handleSelectStep}
          />
        </div>
      ))}
    </div>
  )
}

export default StaticIdeaSteps


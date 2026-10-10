import React, { useRef } from 'react'
import { ideas } from '@/data/ideas'
import { GridBackdrop } from '@/components/common/GridBackdrop'
import { GlowBlob, type GlowBlobCorner } from '@/components/common/GlowBlob'
import { useLenis } from '@/app/smoothScroll'
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap'
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
  const containerRef = useRef<HTMLDivElement>(null)

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

  // Pop-in: ScrollTrigger.batch on entering viewport, once, 80ms stagger
  useGSAP(
    () => {
      const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (isReduced) return

      const targets = gsap.utils.toArray<HTMLElement>(
        '.static-idea-steps .step-anim-block',
      )

      gsap.set(targets, { autoAlpha: 0, y: 24, scale: 0.96, transformOrigin: 'center top' })

      ScrollTrigger.batch(targets, {
        onEnter: (batch) => {
          gsap.to(batch, {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.55,
            stagger: 0.08,
            ease: 'power2.out',
            overwrite: true,
          })
        },
        once: true,
        start: 'top 92%',
      })
    },
    { scope: containerRef },
  )

  return (
    <div ref={containerRef} className="static-idea-steps relative w-full">
      {/* GridBackdrop behind the whole group */}
      <GridBackdrop className="opacity-70" />

      {/* Render the five steps stacked */}
      {ideas.map((step, index) => (
        <div
          key={step.id}
          className="static-step-section relative w-full border-b border-[var(--color-hairline)]/30 last:border-b-0"
        >
          {/* Faint GlowBlob per step with assigned corner preset */}
          <GlowBlob corner={glowCorners[index % glowCorners.length]} />

          <div className="step-anim-block">
            <Step
              step={step}
              stepIndex={index}
              totalSteps={ideas.length}
              onSelectStep={handleSelectStep}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

export default StaticIdeaSteps

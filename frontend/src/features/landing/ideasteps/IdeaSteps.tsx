import React, { useEffect, useState } from 'react'
import { gsap } from '@/lib/gsap'
import { StaticIdeaSteps } from './StaticIdeaSteps'
import { PinnedIdeaSteps } from './PinnedIdeaSteps'

export const IdeaSteps: React.FC = () => {
  const [isPinnedMode, setIsPinnedMode] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    const mqWidth = window.matchMedia('(min-width: 1024px)')
    const mqHeight = window.matchMedia('(min-height: 540px)')
    const mqMotion = window.matchMedia('(prefers-reduced-motion: no-preference)')
    return mqWidth.matches && mqHeight.matches && mqMotion.matches
  })

  useEffect(() => {
    const mm = gsap.matchMedia()

    mm.add('(min-width: 1024px) and (min-height: 540px) and (prefers-reduced-motion: no-preference)', () => {
      setIsPinnedMode(true)
      return () => {
        setIsPinnedMode(false)
      }
    })

    return () => {
      mm.revert()
    }
  }, [])

  return (
    <section
      id="about"
      aria-labelledby="about-section-heading"
      className="ideasteps-section relative w-full bg-[var(--color-bg)]"
    >
      <h2 id="about-section-heading" className="sr-only">
        About CSEA E-Cell
      </h2>

      {/* Exactly one mode in the DOM at a time */}
      {isPinnedMode ? <PinnedIdeaSteps /> : <StaticIdeaSteps />}
    </section>
  )
}

export default IdeaSteps

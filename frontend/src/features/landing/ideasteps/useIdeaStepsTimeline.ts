import React, { useRef, useState } from 'react'
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap'
import { useLenis } from '@/app/smoothScroll'

export interface UseIdeaStepsTimelineProps {
  scopeRef: React.RefObject<HTMLDivElement | null>
  drawnPathRef: React.RefObject<SVGPathElement | null>
  glowRef: React.RefObject<HTMLDivElement | null>
  stepRefs: React.MutableRefObject<(HTMLDivElement | null)[]>
  totalSteps: number
}

export interface UseIdeaStepsTimelineReturn {
  activeIndex: number
  goToStep: (index: number) => void
}

// Start of hold segment for each step in master progress (0 to 1)
const HOLD_PROGRESS_MAP = [0.05, 0.23, 0.43, 0.63, 0.83]

/**
 * Calculates the active step index (0-4) from master timeline progress (0-1).
 * Per COMPONENT.md 3.1 & prompt specs:
 * - Enter-to-exit span highlights the current step.
 * - During an interlude, the NEXT step is already highlighted.
 */
export function calculateActiveIndex(progress: number): number {
  if (progress < 0.165) return 0 // Step 1 hold & enter
  if (progress < 0.345) return 1 // Interlude 1 & Step 2
  if (progress < 0.48) return 2 // Interlude 2 & Step 3
  if (progress < 0.745) return 3 // Interlude 3 (including 0.50) & Step 4
  return 4 // Interlude 4 & Step 5
}

export function useIdeaStepsTimeline({
  scopeRef,
  drawnPathRef,
  glowRef,
  stepRefs,
  totalSteps,
}: UseIdeaStepsTimelineProps): UseIdeaStepsTimelineReturn {
  const [activeIndex, setActiveIndex] = useState(0)
  const activeIndexRef = useRef(0)
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null)
  const lenis = useLenis()

  useGSAP(
    () => {
      const stageEl = scopeRef.current
      if (!stageEl) return

      // Measure SVG path length
      let pathLength = 3000
      if (drawnPathRef.current) {
        pathLength = drawnPathRef.current.getTotalLength() || 3000
        drawnPathRef.current.style.strokeDasharray = `${pathLength}`
        drawnPathRef.current.style.strokeDashoffset = `${pathLength}`
      }

      // Master timeline (duration = 100 relative units)
      const tl = gsap.timeline({
        paused: true,
      })

      // Linear flow-line drawing: draws from progress ~0.02 (t=2) to ~0.97 (t=97)
      if (drawnPathRef.current) {
        tl.fromTo(
          drawnPathRef.current,
          { strokeDashoffset: pathLength },
          { strokeDashoffset: 0, ease: 'none', duration: 95 },
          2,
        )
      }

      // Initial state: hide all step stage slides
      stepRefs.current.forEach((el) => {
        if (el) {
          gsap.set(el, { autoAlpha: 0 })
        }
      })

      // GlowBlob animation between corner positions during interludes
      if (glowRef.current) {
        gsap.set(glowRef.current, { xPercent: 0, yPercent: 0, opacity: 0.7 })

        // Interlude 1 (t=16.5 to 20): moves toward top-right
        tl.to(
          glowRef.current,
          { xPercent: 110, yPercent: -80, opacity: 0.85, ease: 'power2.inOut', duration: 3.5 },
          16.5,
        )
        // Interlude 2 (t=34.5 to 40): moves toward bottom-left
        tl.to(
          glowRef.current,
          { xPercent: 10, yPercent: 10, opacity: 0.7, ease: 'power2.inOut', duration: 4.5 },
          34.5,
        )
        // Interlude 3 (t=48 to 58): moves toward bottom-right
        tl.to(
          glowRef.current,
          { xPercent: 110, yPercent: 10, opacity: 0.85, ease: 'power2.inOut', duration: 7 },
          48,
        )
        // Interlude 4 (t=74.5 to 80): subtle drift
        tl.to(
          glowRef.current,
          { xPercent: 110, yPercent: -30, opacity: 0.8, ease: 'power2.inOut', duration: 4.5 },
          74.5,
        )
      }

      // Build each step's enter, hold, exit, interlude
      // Step timings in master units (0..100):
      // Step 1 (0): Enter 2..5, Hold 5..14 (0.10 in hold), Exit 14..16.5, Interlude 16.5..20
      // Step 2 (1): Enter 20..23, Hold 23..32 (0.30 in hold), Exit 32..34.5, Interlude 34.5..40
      // Step 3 (2): Enter 40..42.5, Hold 42.5..45.5, Exit 45.5..48, Interlude 48..60 (0.50 in interlude)
      // Step 4 (3): Enter 60..63, Hold 63..72 (0.70 in hold), Exit 72..74.5, Interlude 74.5..80
      // Step 5 (4): Enter 80..83, Hold 83..100 (0.90 in hold, pin releases at 100)
      const stepTimings = [
        { enter: 2, enterDur: 3, exit: 14, exitDur: 2.5 },
        { enter: 20, enterDur: 3, exit: 32, exitDur: 2.5 },
        { enter: 40, enterDur: 2.5, exit: 45.5, exitDur: 2.5 },
        { enter: 60, enterDur: 3, exit: 72, exitDur: 2.5 },
        { enter: 80, enterDur: 3, exit: null, exitDur: null },
      ]

      stepTimings.forEach((timing, index) => {
        const stepEl = stepRefs.current[index]
        if (!stepEl) return

        const textElements = stepEl.querySelectorAll('.step-text > *, .step-bottom-bar')
        const cardElements = stepEl.querySelectorAll('.step-cards .glass-card, .step-cards')

        // Enter segment
        tl.set(stepEl, { autoAlpha: 1 }, timing.enter)

        if (textElements.length > 0) {
          tl.fromTo(
            textElements,
            { y: 24, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 2.2, stagger: 0.18, ease: 'power2.out' },
            timing.enter,
          )
        }

        if (cardElements.length > 0) {
          tl.fromTo(
            cardElements,
            { y: 24, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 2.2, stagger: 0.2, ease: 'power2.out' },
            timing.enter + 0.3,
          )
        }

        // Exit segment (all except the last step)
        if (timing.exit !== null && timing.exitDur !== null) {
          const exitElements = stepEl.querySelectorAll('.step-text > *, .step-cards, .step-bottom-bar')
          if (exitElements.length > 0) {
            tl.to(
              exitElements,
              { y: -12, autoAlpha: 0, duration: timing.exitDur, ease: 'power2.in' },
              timing.exit,
            )
          }
          tl.to(
            stepEl,
            { autoAlpha: 0, duration: timing.exitDur, ease: 'power2.in' },
            timing.exit,
          )
        }
      })

      const aboutSection = document.getElementById('about')
      if (aboutSection) {
        aboutSection.setAttribute('data-progress', '0.00')
        aboutSection.setAttribute('data-active-step', '1')
        aboutSection.setAttribute('data-active-index', '0')
      }

      // Single ScrollTrigger to pin the stage
      const st = ScrollTrigger.create({
        trigger: stageEl,
        start: 'top top',
        end: () => `+=${window.innerHeight * 5}`,
        pin: true,
        scrub: 0.6,
        invalidateOnRefresh: true,
        animation: tl,
        onUpdate: (self) => {
          // Throttled / direct DOM update for data-progress attribute
          const progress = self.progress
          const roundedProgress = progress.toFixed(2)
          stageEl.setAttribute('data-progress', roundedProgress)
          if (aboutSection) {
            aboutSection.setAttribute('data-progress', roundedProgress)
          }

          // Active index calculation and state update strictly on change
          const newIdx = calculateActiveIndex(progress)
          if (newIdx !== activeIndexRef.current) {
            activeIndexRef.current = newIdx
            setActiveIndex(newIdx)
            stageEl.setAttribute('data-active-step', String(newIdx + 1))
            stageEl.setAttribute('data-active-index', String(newIdx))
            if (aboutSection) {
              aboutSection.setAttribute('data-active-step', String(newIdx + 1))
              aboutSection.setAttribute('data-active-index', String(newIdx))
            }
          }
        },
      })

      scrollTriggerRef.current = st
      if (typeof window !== 'undefined') {
        ;(window as unknown as { __ideaStepsScrollTrigger: ScrollTrigger }).__ideaStepsScrollTrigger = st
      }

      // Re-measure path length on resize and fonts loaded
      const handleResizeOrFonts = () => {
        if (drawnPathRef.current) {
          const len = drawnPathRef.current.getTotalLength() || 3000
          drawnPathRef.current.style.strokeDasharray = `${len}`
        }
        ScrollTrigger.refresh()
      }

      window.addEventListener('resize', handleResizeOrFonts)
      if (document.fonts?.ready) {
        document.fonts.ready.then(handleResizeOrFonts)
      }

      return () => {
        window.removeEventListener('resize', handleResizeOrFonts)
        if (typeof window !== 'undefined') {
          delete (window as unknown as { __ideaStepsScrollTrigger?: ScrollTrigger }).__ideaStepsScrollTrigger
        }
        if (st) st.kill()
        tl.kill()
      }
    },
    { scope: scopeRef, dependencies: [totalSteps] },
  )

  const goToStep = (index: number) => {
    const st = scrollTriggerRef.current
    if (!st) return
    const targetProgress = HOLD_PROGRESS_MAP[index] ?? 0
    const targetScroll = st.start + targetProgress * (st.end - st.start)
    if (lenis) {
      try {
        lenis.scrollTo(targetScroll, { duration: 1.2 })
      } catch {
        window.scrollTo({ top: targetScroll, behavior: 'smooth' })
      }
    } else {
      window.scrollTo({ top: targetScroll, behavior: 'smooth' })
    }
  }

  return {
    activeIndex,
    goToStep,
  }
}

export default useIdeaStepsTimeline

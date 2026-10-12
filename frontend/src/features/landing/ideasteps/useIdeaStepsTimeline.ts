import React, { useRef, useEffect } from 'react'
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap'
import { useLenis } from '@/app/smoothScroll'

export interface UseIdeaStepsTimelineProps {
  scopeRef: React.RefObject<HTMLDivElement | null>
  drawnPathRef: React.RefObject<SVGPathElement | null>
  glowRef: React.RefObject<HTMLDivElement | null>
  stepRefs: React.MutableRefObject<(HTMLDivElement | null)[]>
  totalSteps: number
  onTimelineUpdate?: (progress: number) => void
  onActiveIndexChange?: (index: number) => void
}

export interface UseIdeaStepsTimelineReturn {
  goToStep: (index: number) => void
  progressRef: React.RefObject<number>
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
  onTimelineUpdate,
  onActiveIndexChange,
}: UseIdeaStepsTimelineProps): UseIdeaStepsTimelineReturn {
  const activeIndexRef = useRef(0)
  const progressRef = useRef<number>(0)
  const onTimelineUpdateRef = useRef(onTimelineUpdate)
  const onActiveIndexChangeRef = useRef(onActiveIndexChange)

  useEffect(() => {
    onTimelineUpdateRef.current = onTimelineUpdate
    onActiveIndexChangeRef.current = onActiveIndexChange
  })
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null)
  const lenis = useLenis()

  useGSAP(
    () => {
      const stageEl = scopeRef.current
      if (!stageEl) return

      // Measure SVG path length
      let pathLength = 3600
      if (drawnPathRef.current) {
        pathLength = drawnPathRef.current.getTotalLength() || 3600
        drawnPathRef.current.style.strokeDasharray = `${pathLength} ${pathLength * 2 + 1000}`
        drawnPathRef.current.style.strokeDashoffset = `${pathLength}`
      }

      // Master timeline (duration = 100 relative units)
      const tl = gsap.timeline({
        paused: true,
      })

      // Linear flow-line drawing: draws smoothly from progress 0.0 (t=0) to 1.0 (t=100)
      if (drawnPathRef.current) {
        tl.fromTo(
          drawnPathRef.current,
          { strokeDashoffset: pathLength },
          { strokeDashoffset: 0, ease: 'none', duration: 100 },
          0,
        )
      }

      // Initial state: Step 1 is rendered and fully visible at scroll progress 0 on load; later steps start hidden
      stepRefs.current.forEach((el, index) => {
        if (el) {
          if (index === 0) {
            el.setAttribute('aria-hidden', 'false')
            el.removeAttribute('inert')
            gsap.set(el, { autoAlpha: 1 })
            const textElements = el.querySelectorAll('.step-text > *, .step-bottom-bar')
            const cardElements = el.querySelectorAll('.step-cards .glass-card, .step-cards')
            gsap.set(textElements, { y: 0, autoAlpha: 1 })
            gsap.set(cardElements, { y: 0, autoAlpha: 1 })
          } else {
            el.setAttribute('aria-hidden', 'true')
            el.setAttribute('inert', '')
            gsap.set(el, { autoAlpha: 0 })
          }
        }
      })

      // Gentle intro animation for Step 1 on initial load (does not depend on user scrolling)
      const firstStepEl = stepRefs.current[0]
      if (firstStepEl && typeof window !== 'undefined' && window.scrollY < 10) {
        const textElements = firstStepEl.querySelectorAll('.step-text > *, .step-bottom-bar')
        const cardElements = firstStepEl.querySelectorAll('.step-cards .glass-card, .step-cards')
        if (textElements.length > 0) {
          gsap.from(textElements, {
            y: 20,
            autoAlpha: 0,
            duration: 0.8,
            stagger: 0.08,
            ease: 'power2.out',
          })
        }
        if (cardElements.length > 0) {
          gsap.from(cardElements, {
            y: 20,
            autoAlpha: 0,
            duration: 0.8,
            stagger: 0.1,
            delay: 0.15,
            ease: 'power2.out',
          })
        }
      }

      // Sync progressRef on scrubbed timeline updates
      tl.eventCallback('onUpdate', () => {
        const p = tl.progress()
        progressRef.current = p
        onTimelineUpdateRef.current?.(p)
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
      // Step 1 (0): Holds from 0..14 (0.10 in hold), Exit 14..16.5, Interlude 16.5..20
      // Step 2 (1): Enter 20..23, Hold 23..32 (0.30 in hold), Exit 32..34.5, Interlude 34.5..40
      // Step 3 (2): Enter 40..42.5, Hold 42.5..45.5, Exit 45.5..48, Interlude 48..60 (0.50 in interlude)
      // Step 4 (3): Enter 60..63, Hold 63..72 (0.70 in hold), Exit 72..74.5, Interlude 74.5..80
      // Step 5 (4): Enter 80..83, Hold 83..100 (0.90 in hold, pin releases at 100)
      const stepTimings = [
        { enter: 0, enterDur: 0, exit: 14, exitDur: 2.5 },
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

        // Step 1 is rendered and visible at load (t=0)
        if (index === 0) {
          tl.set(stepEl, { autoAlpha: 1 }, 0)
        } else {
          // Later steps animate in as the user scrolls
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
        scrub: true,
        invalidateOnRefresh: true,
        animation: tl,
        onUpdate: (self) => {
          const progress = Math.max(0, Math.min(1, self.progress))
          progressRef.current = progress
          onTimelineUpdateRef.current?.(progress)
          // Throttled / direct DOM update for data-progress attribute
          const roundedProgress = progress.toFixed(2)
          stageEl.setAttribute('data-progress', roundedProgress)
          if (aboutSection) {
            aboutSection.setAttribute('data-progress', roundedProgress)
          }

          // Active index calculation and DOM updates strictly on change
          const newIdx = calculateActiveIndex(progress)
          if (newIdx !== activeIndexRef.current) {
            activeIndexRef.current = newIdx
            stageEl.setAttribute('data-active-step', String(newIdx + 1))
            stageEl.setAttribute('data-active-index', String(newIdx))
            if (aboutSection) {
              aboutSection.setAttribute('data-active-step', String(newIdx + 1))
              aboutSection.setAttribute('data-active-index', String(newIdx))
            }
            stepRefs.current.forEach((el, idx) => {
              if (!el) return
              const isActive = idx === newIdx
              el.setAttribute('aria-hidden', String(!isActive))
              if (isActive) {
                el.removeAttribute('inert')
              } else {
                el.setAttribute('inert', '')
              }
            })
            onActiveIndexChangeRef.current?.(newIdx)
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
          const len = drawnPathRef.current.getTotalLength() || 3600
          drawnPathRef.current.style.strokeDasharray = `${len} ${len * 2 + 1000}`
        }

        // Safety net: measure blocks against available height and scale if needed
        stepRefs.current.forEach((stepEl) => {
          if (!stepEl) return
          const container = stepEl.querySelector('.step-content-block') as HTMLElement
          const textContainer = stepEl.querySelector('.step-text-container') as HTMLElement
          const cardsContainer = stepEl.querySelector('.step-cards-container') as HTMLElement
          if (!container) return
          
          const availableHeight = container.clientHeight
          
          const resetAndMeasure = (el: HTMLElement) => {
            el.style.transform = 'none'
            return el.scrollHeight
          }

          if (textContainer) {
            const h = resetAndMeasure(textContainer)
            if (h > availableHeight && availableHeight > 0) {
              const scale = Math.max(0.75, availableHeight / h)
              textContainer.style.transform = `scale(${scale})`
              textContainer.style.transformOrigin = 'left center'
            }
          }
          
          if (cardsContainer) {
            const h = resetAndMeasure(cardsContainer)
            if (h > availableHeight && availableHeight > 0) {
              const scale = Math.max(0.75, availableHeight / h)
              cardsContainer.style.transform = `scale(${scale})`
              cardsContainer.style.transformOrigin = 'center center'
            }
          }
        })

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
      lenis.scrollTo(targetScroll, { duration: 1.2 })
    } else {
      const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      window.scrollTo({ top: targetScroll, behavior: isReduced ? 'auto' : 'smooth' })
    }
  }

  return {
    goToStep,
    progressRef,
  }
}

export default useIdeaStepsTimeline

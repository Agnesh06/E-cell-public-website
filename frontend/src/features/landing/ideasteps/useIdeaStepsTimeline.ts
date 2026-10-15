import React, { useRef, useEffect } from 'react'
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap'
import { useLenis } from '@/app/smoothScroll'

export interface UseIdeaStepsTimelineProps {
  scopeRef: React.RefObject<HTMLDivElement | null>
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
const HOLD_PROGRESS_MAP = [0.05, 0.25, 0.45, 0.65, 0.85]

/**
 * Calculates the active step index (0-4) from master timeline progress (0-1).
 * Steps crossfade with overlap at midpoints:
 * - Step 1: 0.000 - 0.225
 * - Step 2: 0.225 - 0.425
 * - Step 3: 0.425 - 0.625
 * - Step 4: 0.625 - 0.825
 * - Step 5: 0.825 - 1.000
 */
export function calculateActiveIndex(progress: number): number {
  if (progress < 0.225) return 0
  if (progress < 0.425) return 1
  if (progress < 0.625) return 2
  if (progress < 0.825) return 3
  return 4
}

export function useIdeaStepsTimeline({
  scopeRef,
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

      // Master timeline (duration = 100 relative units)
      const tl = gsap.timeline({
        paused: true,
      })

      // Initial state: Step 1 is rendered and fully visible at scroll progress 0 on load; later steps start hidden
      stepRefs.current.forEach((el, index) => {
        if (el) {
          if (index === 0) {
            el.setAttribute('aria-hidden', 'false')
            el.removeAttribute('inert')
            gsap.set(el, { autoAlpha: 1 })
            const textElements = el.querySelectorAll('.step-text > *, .step-bottom-bar')
            const cards = el.querySelectorAll('.glass-card')
            gsap.set(textElements, { y: 0, autoAlpha: 1 })
            gsap.set(cards, { scale: 1, opacity: 1, transformOrigin: 'center center' })
          } else {
            el.setAttribute('aria-hidden', 'true')
            el.setAttribute('inert', '')
            gsap.set(el, { autoAlpha: 0 })
            const cards = el.querySelectorAll('.glass-card')
            gsap.set(cards, { scale: 0.85, opacity: 0, transformOrigin: 'center center' })
          }
        }
      })

      // Gentle intro animation for Step 1 on initial load (does not depend on user scrolling)
      const firstStepEl = stepRefs.current[0]
      if (firstStepEl && typeof window !== 'undefined' && window.scrollY < 10) {
        const textElements = firstStepEl.querySelectorAll('.step-text > *, .step-bottom-bar')
        const cards = firstStepEl.querySelectorAll('.glass-card')
        if (textElements.length > 0) {
          gsap.from(textElements, {
            y: 20,
            autoAlpha: 0,
            duration: 0.8,
            stagger: 0.08,
            ease: 'power2.out',
          })
        }
        if (cards.length > 0) {
          gsap.from(cards, {
            scale: 0.85,
            opacity: 0,
            duration: 0.8,
            stagger: 0.09,
            delay: 0.15,
            ease: 'back.out(1.2)',
            transformOrigin: 'center center',
          })
        }
      }

      // Sync progressRef on scrubbed timeline updates
      tl.eventCallback('onUpdate', () => {
        const p = tl.progress()
        progressRef.current = p
        onTimelineUpdateRef.current?.(p)
      })

      // GlowBlob animation between corner positions during crossfade windows
      if (glowRef.current) {
        gsap.set(glowRef.current, { xPercent: 0, yPercent: 0, opacity: 0.7 })

        // Crossfade 1 (t=20 to 25): moves toward top-right
        tl.to(
          glowRef.current,
          { xPercent: 110, yPercent: -80, opacity: 0.85, ease: 'power2.inOut', duration: 5 },
          20,
        )
        // Crossfade 2 (t=40 to 45): moves toward bottom-left
        tl.to(
          glowRef.current,
          { xPercent: 10, yPercent: 10, opacity: 0.7, ease: 'power2.inOut', duration: 5 },
          40,
        )
        // Crossfade 3 (t=60 to 65): moves toward bottom-right
        tl.to(
          glowRef.current,
          { xPercent: 110, yPercent: 10, opacity: 0.85, ease: 'power2.inOut', duration: 5 },
          60,
        )
        // Crossfade 4 (t=80 to 85): subtle drift
        tl.to(
          glowRef.current,
          { xPercent: 110, yPercent: -30, opacity: 0.8, ease: 'power2.inOut', duration: 5 },
          80,
        )
      }

      // Build each step's enter, hold, exit with crossfade overlap (interludes = 0)
      // Master units (0..100): Enter 0.20 (5 units), Hold 0.60 (15 units), Exit 0.20 (5 units)
      // Step 1: Hold 0..20, Exit 20..25 (crossfades with Step 2 enter)
      // Step 2: Enter 20..25, Hold 25..40, Exit 40..45 (crossfades with Step 3 enter)
      // Step 3: Enter 40..45, Hold 45..60, Exit 60..65 (crossfades with Step 4 enter)
      // Step 4: Enter 60..65, Hold 65..80, Exit 80..85 (crossfades with Step 5 enter)
      // Step 5: Enter 80..85, Hold 85..100 (releases pin at 100, no exit)
      const stepTimings = [
        { enter: 0, enterDur: 0, exit: 20, exitDur: 5 },
        { enter: 20, enterDur: 5, exit: 40, exitDur: 5 },
        { enter: 40, enterDur: 5, exit: 60, exitDur: 5 },
        { enter: 60, enterDur: 5, exit: 80, exitDur: 5 },
        { enter: 80, enterDur: 5, exit: null, exitDur: null },
      ]

      stepTimings.forEach((timing, index) => {
        const stepEl = stepRefs.current[index]
        if (!stepEl) return

        const textElements = stepEl.querySelectorAll('.step-text > *, .step-bottom-bar')
        const cards = stepEl.querySelectorAll('.glass-card')

        // Step 1 is rendered and visible at load (t=0)
        if (index === 0) {
          tl.set(stepEl, { autoAlpha: 1 }, 0)
        } else {
          // Later steps crossfade in
          tl.fromTo(
            stepEl,
            { autoAlpha: 0 },
            { autoAlpha: 1, duration: timing.enterDur, ease: 'linear' },
            timing.enter,
          )

          if (textElements.length > 0) {
            tl.fromTo(
              textElements,
              { y: 24, autoAlpha: 0 },
              { y: 0, autoAlpha: 1, duration: 4.0, stagger: 0.12, ease: 'power1.inOut' },
              timing.enter,
            )
          }

          if (cards.length > 0) {
            tl.fromTo(
              cards,
              { scale: 0.85, opacity: 0, transformOrigin: 'center center' },
              {
                scale: 1,
                opacity: 1,
                duration: 2.0,
                stagger: 0.09,
                ease: 'back.out(1.2)',
                transformOrigin: 'center center',
              },
              timing.enter + 0.62,
            )
          }
        }

        // Exit segment (all except the last step)
        if (timing.exit !== null && timing.exitDur !== null) {
          if (textElements.length > 0) {
            tl.to(
              textElements,
              { y: -12, autoAlpha: 0, duration: 4.0, stagger: { each: 0.12, from: 'end' }, ease: 'power1.inOut' },
              timing.exit,
            )
          }
          if (cards.length > 0) {
            tl.to(
              cards,
              {
                scale: 0.92,
                opacity: 0,
                duration: 3.0,
                ease: 'power1.in',
                stagger: { each: 0.09, from: 'end' },
                transformOrigin: 'center center',
              },
              timing.exit,
            )
          }
          tl.to(
            stepEl,
            { autoAlpha: 0, duration: timing.exitDur, ease: 'linear' },
            timing.exit,
          )
        }
      })

      // Anchor master timeline duration at 100 relative units
      tl.set({}, {}, 100)

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
        end: () => `+=${Math.round(totalSteps * (0.9 * window.innerHeight))}`,
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

      // Safety net: measure blocks against available height and scale if needed
      const handleResizeOrFonts = () => {
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

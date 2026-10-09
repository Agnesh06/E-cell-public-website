import React, { Suspense, useEffect, useRef, useState } from 'react'

const DotGrid = React.lazy(() => import('@/components/common/DotGrid'))

function getInitialColors() {
  if (typeof window === 'undefined') return { dot: '#CBD5FF', blue: '#2340FF' }
  const rootStyle = getComputedStyle(document.documentElement)
  const dotToken = rootStyle.getPropertyValue('--color-dot').trim() || '#CBD5FF'
  const blueToken = rootStyle.getPropertyValue('--color-blue').trim() || '#2340FF'
  return { dot: dotToken, blue: blueToken }
}

function getCanMountCanvas() {
  if (typeof window === 'undefined') return false
  const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const isTouch = window.matchMedia('(pointer: coarse)').matches
  const isNarrow = window.innerWidth < 768
  return !isReduced && !isTouch && !isNarrow
}

export function HeroBackground() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [shouldMountCanvas, setShouldMountCanvas] = useState(getCanMountCanvas)
  const [isPaused, setIsPaused] = useState(false)
  const [colors] = useState(getInitialColors)

  useEffect(() => {
    const evaluateMount = () => {
      setShouldMountCanvas(getCanMountCanvas())
    }

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const pointerQuery = window.matchMedia('(pointer: coarse)')

    motionQuery.addEventListener('change', evaluateMount)
    pointerQuery.addEventListener('change', evaluateMount)
    window.addEventListener('resize', evaluateMount)

    return () => {
      motionQuery.removeEventListener('change', evaluateMount)
      pointerQuery.removeEventListener('change', evaluateMount)
      window.removeEventListener('resize', evaluateMount)
    }
  }, [])

  // Pause animation when hero is off-screen via IntersectionObserver
  useEffect(() => {
    if (!containerRef.current || !shouldMountCanvas) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsPaused(!entry.isIntersecting)
      },
      { threshold: 0 }
    )

    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [shouldMountCanvas])

  return (
    <div
      ref={containerRef}
      className="hero-background absolute inset-0 z-0 overflow-hidden pointer-events-none"
      style={{
        maskImage: 'linear-gradient(to bottom, black 55%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, black 55%, transparent 100%)',
      }}
      aria-hidden="true"
    >
      {shouldMountCanvas ? (
        <Suspense fallback={null}>
          <DotGrid
            dotSize={3}
            gap={28}
            baseColor={colors.dot}
            activeColor={colors.blue}
            proximity={140}
            paused={isPaused}
            className="w-full h-full"
          />
        </Suspense>
      ) : (
        <div
          data-testid="hero-static-dots"
          className="hero-static-dots absolute inset-0 w-full h-full pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(${colors.dot} 1.5px, transparent 1.5px)`,
            backgroundSize: '28px 28px',
            backgroundPosition: 'center',
          }}
          aria-hidden="true"
        />
      )}
    </div>
  )
}

export default HeroBackground


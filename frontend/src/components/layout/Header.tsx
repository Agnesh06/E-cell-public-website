import { useEffect, useRef, useState } from 'react'
import { LogoGroup } from './LogoGroup'
import { MenuWrapper } from './MenuWrapper'
import { gsap } from '@/lib/gsap'

export function Header() {
  const logoRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLElement>(null)
  const isHiddenRef = useRef(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const syncViewportWidth = () => {
      headerRef.current?.style.setProperty(
        '--header-viewport-width',
        `${document.documentElement.clientWidth}px`,
      )
    }

    syncViewportWidth()
    window.addEventListener('resize', syncViewportWidth)

    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let lastScrollY = window.scrollY
    let isScrolledState = window.scrollY > 8

    if (headerRef.current) {
      headerRef.current.setAttribute('data-scrolled', isScrolledState ? 'true' : 'false')
    }

    const updateScrolled = (currentY: number) => {
      const isScrolled = currentY > 8
      if (isScrolled !== isScrolledState) {
        isScrolledState = isScrolled
        headerRef.current?.setAttribute('data-scrolled', isScrolled ? 'true' : 'false')
      }
    }

    const handleVisibility = (currentScrollY: number) => {
      const threshold = window.innerHeight * 0.7
      const isScrollingDown = currentScrollY > lastScrollY
      const isScrollingUp = currentScrollY < lastScrollY
      lastScrollY = currentScrollY

      let shouldHide = isHiddenRef.current
      if (isScrollingDown && currentScrollY > threshold) {
        shouldHide = true
      } else if (isScrollingUp || currentScrollY <= threshold) {
        shouldHide = false
      }

      if (shouldHide !== isHiddenRef.current) {
        isHiddenRef.current = shouldHide

        if (logoRef.current) {
          logoRef.current.setAttribute('aria-hidden', shouldHide ? 'true' : 'false')
          if (isReducedMotion) {
            logoRef.current.style.opacity = shouldHide ? '0' : '1'
            logoRef.current.style.pointerEvents = shouldHide ? 'none' : 'auto'
            logoRef.current.style.transform = 'none'
          } else {
            if (shouldHide) {
              gsap.to(logoRef.current, {
                opacity: 0,
                y: -12,
                duration: 0.3,
                ease: 'power2.out',
                onComplete: () => {
                  if (logoRef.current) {
                    logoRef.current.style.pointerEvents = 'none'
                  }
                },
              })
            } else {
              logoRef.current.style.pointerEvents = 'auto'
              gsap.to(logoRef.current, {
                opacity: 1,
                y: 0,
                duration: 0.3,
                ease: 'power2.out',
              })
            }
          }
        }
      }
    }

    const onScroll = () => {
      const y = window.scrollY
      handleVisibility(y)
      updateScrolled(y)
    }

    // Initial sync
    handleVisibility(window.scrollY)

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('resize', syncViewportWidth)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <header
      ref={headerRef}
      className="site-header fixed top-0 left-0 w-full z-40 bg-transparent pointer-events-none"
      data-menu-open={isMenuOpen || undefined}
    >
      <div className="site-header__row">
        <div
          ref={logoRef}
          className="site-header__logo-scroll pointer-events-auto"
        >
          <LogoGroup />
        </div>
        <div className="site-header__menu pointer-events-auto">
          <MenuWrapper
            onMenuOpen={() => setIsMenuOpen(true)}
            onMenuClose={() => setIsMenuOpen(false)}
          />
        </div>
      </div>
    </header>
  )
}

export default Header

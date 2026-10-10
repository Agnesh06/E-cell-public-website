import { useEffect, useRef, useState } from 'react'
import { LogoGroup } from './LogoGroup'
import { MenuWrapper } from './MenuWrapper'
import { gsap } from '@/lib/gsap'

export function Header() {
  const logoRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLElement>(null)
  const isHiddenRef = useRef(false)
  const [isHidden, setIsHidden] = useState(false)
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

    const updateScrolled = () => {
      if (headerRef.current) {
        headerRef.current.setAttribute(
          'data-scrolled',
          window.scrollY > 8 ? 'true' : 'false',
        )
      }
    }
    updateScrolled()

    const handleVisibility = (currentScrollY: number) => {
      const threshold = window.innerHeight * 0.7
      const isScrollingDown = currentScrollY > lastScrollY
      const isScrollingUp = currentScrollY < lastScrollY
      lastScrollY = currentScrollY

      let shouldHide = isHiddenRef.current
      if (isScrollingDown && currentScrollY > threshold) {
        shouldHide = true
      } else if (isScrollingUp) {
        shouldHide = false
      }

      if (shouldHide !== isHiddenRef.current) {
        isHiddenRef.current = shouldHide
        setIsHidden(shouldHide)

        if (logoRef.current) {
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

    // Use native window scroll — fires on window.scrollTo() in all envs,
    // including headless test runners where GSAP ticker / Lenis RAF may not run.
    const onScroll = () => {
      handleVisibility(window.scrollY)
      updateScrolled()
    }

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
          aria-hidden={isHidden ? 'true' : undefined}
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

import { useEffect, useLayoutEffect } from 'react'
import { Outlet, useLocation } from 'react-router'
import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'
import { ContactProvider, ContactPopup } from '@/components/common/FloatingContact'
import { useLenis } from '@/app/smoothScroll'
import { ScrollTrigger } from '@/lib/gsap'

function RootLayout() {
  const location = useLocation()
  const lenis = useLenis()

  // 1. Immediately before paint on mount and on every route change without a hash
  useLayoutEffect(() => {
    if (!location.hash) {
      window.scrollTo(0, 0)
      if (lenis) {
        lenis.scrollTo(0, { immediate: true, force: true })
      }
    }
  }, [location.pathname, location.hash, lenis])

  // 2. Ensure manual scroll restoration, measure pinned sections at scroll 0, and settle hash targets
  useEffect(() => {
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }

    let isMounted = true

    const settleAndRefresh = async () => {
      if (document.fonts) {
        await document.fonts.ready
      }
      if (!isMounted) return

      if (!location.hash) {
        window.scrollTo(0, 0)
        lenis?.scrollTo(0, { immediate: true, force: true })
        ScrollTrigger.refresh()
      } else {
        // First ensure ScrollTrigger measures triggers correctly
        ScrollTrigger.refresh()

        const targetId = location.hash.replace(/^#/, '')
        // Never scroll to footer element via hash
        if (targetId && targetId !== 'footer' && !targetId.includes('footer')) {
          requestAnimationFrame(() => {
            if (!isMounted) return
            requestAnimationFrame(() => {
              if (!isMounted) return
              const targetElement = document.getElementById(targetId)
              if (targetElement) {
                if (lenis) {
                  lenis.scrollTo(targetElement)
                } else {
                  targetElement.scrollIntoView({ behavior: 'smooth' })
                }
              }
            })
          })
        }
      }
    }

    settleAndRefresh()

    const handleLoad = () => {
      if (!location.hash) {
        window.scrollTo(0, 0)
        lenis?.scrollTo(0, { immediate: true, force: true })
      }
      ScrollTrigger.refresh()
    }

    if (document.readyState === 'complete') {
      handleLoad()
    } else {
      window.addEventListener('load', handleLoad)
    }

    return () => {
      isMounted = false
      window.removeEventListener('load', handleLoad)
    }
  }, [location.pathname, location.hash, lenis])

  return (
    <ContactProvider>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[var(--color-surface)] focus:text-[var(--color-blue)] focus:rounded-md focus:shadow-md focus:outline-none focus-visible:outline-none"
      >
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
      <ContactPopup />
    </ContactProvider>
  )
}

export default RootLayout

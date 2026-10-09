import { useEffect } from 'react'
import { Outlet, ScrollRestoration, useLocation } from 'react-router'
import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'
import { useLenis } from '@/app/smoothScroll'

function RootLayout() {
  const location = useLocation()
  const lenis = useLenis()

  // Scroll to top on route change, and support hash links
  useEffect(() => {
    const hash = location.hash
    if (hash) {
      const targetId = hash.replace(/^#/, '')
      requestAnimationFrame(() => {
        const targetElement = document.getElementById(targetId)
        if (targetElement) {
          if (lenis) {
            lenis.scrollTo(targetElement)
          } else {
            targetElement.scrollIntoView()
          }
        }
      })
    } else {
      if (lenis) {
        lenis.scrollTo(0, { immediate: true })
      } else {
        window.scrollTo(0, 0)
      }
    }
  }, [location.pathname, location.hash, lenis])

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[var(--color-surface)] focus:text-[var(--color-blue)] focus:rounded-md focus:shadow-md"
      >
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
      <ScrollRestoration />
    </>
  )
}

export default RootLayout

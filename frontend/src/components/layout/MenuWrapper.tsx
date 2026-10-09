import { useRef, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { StaggeredMenu } from '@/components/reactbits/StaggeredMenu'
import { site } from '@/data/site'
import { useLenis } from '@/app/smoothScroll'

interface MenuWrapperProps {
  onMenuOpen?: () => void
  onMenuClose?: () => void
}

export function MenuWrapper({ onMenuOpen, onMenuClose }: MenuWrapperProps) {
  const navigate = useNavigate()
  const lenis = useLenis()
  const wrapperRef = useRef<HTMLDivElement>(null)

  const menuItems = site.navItems.map((item) => ({
    label: item.label,
    ariaLabel: `Navigate to ${item.label}`,
    link: item.href,
  }))

  const socialItems = site.socials.map((item) => ({
    label: item.label,
    link: item.href,
  }))

  useEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return

    const getToggleBtn = () =>
      wrapper.querySelector<HTMLButtonElement>('.sm-toggle')

    const toggle = getToggleBtn()
    const panel = wrapper.querySelector<HTMLElement>('.staggered-menu-panel')
    const syncToggleName = () => {
      if (toggle) {
        toggle.setAttribute(
          'aria-label',
          toggle.getAttribute('aria-expanded') === 'true' ? 'Close' : 'Menu',
        )
      }
    }

    syncToggleName()
    const toggleObserver = toggle
      ? new MutationObserver(syncToggleName)
      : undefined
    if (toggle) {
      toggleObserver?.observe(toggle, {
        attributes: true,
        attributeFilter: ['aria-expanded'],
      })
    }

    const syncPanelInert = () => {
      panel?.toggleAttribute(
        'inert',
        panel.getAttribute('aria-hidden') === 'true',
      )
    }
    syncPanelInert()
    const panelObserver = panel
      ? new MutationObserver(syncPanelInert)
      : undefined
    if (panel) {
      panelObserver?.observe(panel, {
        attributes: true,
        attributeFilter: ['aria-hidden'],
      })
    }

    // Mark nested header as role="none" to avoid duplicate banner landmark
    const nestedHeader = wrapper.querySelector('header.staggered-menu-header')
    if (nestedHeader) {
      nestedHeader.setAttribute('role', 'none')
      nestedHeader.removeAttribute('aria-label')
    }

    // Make the vendored logo invisible (visibility:hidden keeps it in layout so
    // justify-content:space-between still pushes the toggle to the right edge).
    // Do NOT use display:none or .remove() — that collapses the flex row.
    const vendoredLogo = wrapper.querySelector<HTMLElement>('.sm-logo')
    if (vendoredLogo) {
      vendoredLogo.setAttribute('aria-hidden', 'true')
      vendoredLogo.style.visibility = 'hidden'
      // Also make its img inert so it never shows in accessibility tree / image counts
      const logoImg = vendoredLogo.querySelector('img')
      if (logoImg) logoImg.alt = ''
    }

    // Handle Escape key to close menu and return focus to toggle
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        const toggle = getToggleBtn()
        if (toggle && toggle.getAttribute('aria-expanded') === 'true') {
          toggle.click()
          toggle.focus()
        }
      }
    }

    // Intercept clicks on navigation links for client-side routing
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const link = target.closest('a')
      if (!link) return

      // Check if it's an internal menu link inside the panel
      const panel = wrapper.querySelector('.staggered-menu-panel')
      if (!panel || !panel.contains(link)) return

      const href = link.getAttribute('href')
      if (!href) return

      // Only handle internal routing links (starts with /)
      if (href.startsWith('/')) {
        e.preventDefault()

        // Close menu
        const toggle = getToggleBtn()
        if (toggle && toggle.getAttribute('aria-expanded') === 'true') {
          toggle.click()
        }

        // Navigate client-side
        if (href.includes('#')) {
          const [path, hash] = href.split('#')
          navigate(path || '/')
          // Handle scroll to hash
          requestAnimationFrame(() => {
            const targetEl = document.getElementById(hash)
            if (targetEl) {
              if (lenis) {
                lenis.scrollTo(targetEl)
              } else {
                targetEl.scrollIntoView()
              }
            }
          })
        } else {
          navigate(href)
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    wrapper.addEventListener('click', handleClick)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      wrapper.removeEventListener('click', handleClick)
      toggleObserver?.disconnect()
      panelObserver?.disconnect()
    }
  }, [navigate, lenis])

  return (
    <div ref={wrapperRef} className="menu-wrapper relative">
      <StaggeredMenu
        position="right"
        items={menuItems}
        socialItems={socialItems}
        displaySocials={true}
        displayItemNumbering={true}
        menuButtonColor="var(--color-blue)"
        openMenuButtonColor="var(--color-ink)"
        accentColor="var(--color-blue)"
        colors={['var(--color-blue-ghost)', 'var(--color-blue)']}
        isFixed={true}
        changeMenuColorOnOpen={true}
        closeOnClickAway={true}
        onMenuOpen={onMenuOpen}
        onMenuClose={onMenuClose}
      />
      <style>{`
        /* ── Toggle: size, weight and colour (blue closed → ink open) ── */
        .menu-wrapper .sm-scope .sm-toggle {
          box-sizing: border-box !important;
          width: var(--header-toggle-width) !important;
          min-width: var(--header-toggle-width) !important;
          font-size: 1rem !important;
          font-weight: 500 !important;
          justify-content: flex-end !important;
          /* Color is already driven by menuButtonColor / openMenuButtonColor props */
        }
        .menu-wrapper .sm-scope {
          width: 100% !important;
          height: 100dvh !important;
        }
        /* Focus ring uses our blue token */
        .menu-wrapper .sm-scope .sm-toggle:focus-visible {
          outline: 2px solid var(--color-blue) !important;
          outline-offset: 4px !important;
        }
        @media (max-width: 479px) {
          .menu-wrapper .sm-scope .sm-toggle {
            justify-content: center !important;
            width: 44px !important;
            min-width: 44px !important;
            height: 44px !important;
            padding: 0 !important;
          }
          .menu-wrapper .sm-scope .sm-toggle-textWrap {
            display: none !important;
          }
        }

        /* ── Toggle header shares the logo row's position and alignment. ── */
        .menu-wrapper .sm-scope .staggered-menu-header {
          box-sizing: border-box !important;
          height: 84px !important;
          padding: 24px var(--header-gutter) !important;
          align-items: center !important;
        }

        /* ── Vendored logo: invisible but still takes up space so the toggle
              stays at the right under justify-content:space-between ── */
        .menu-wrapper .sm-scope .sm-logo {
          visibility: hidden !important;
          pointer-events: none !important;
        }

        /* ── Panel surface: white per tokens ── */
        .menu-wrapper .sm-scope .staggered-menu-panel {
          background-color: var(--color-surface) !important;
          width: clamp(360px, 32vw, 520px) !important;
          height: 100dvh !important;
          min-height: 100dvh !important;
          box-sizing: border-box !important;
          padding: calc(84px + 16px) 24px 24px !important;
          overflow-x: hidden !important;
          overflow-y: auto !important;
        }
        .menu-wrapper .sm-scope .sm-prelayers {
          width: clamp(360px, 32vw, 520px) !important;
        }
        @media (min-width: 640px) {
          .menu-wrapper .sm-scope .staggered-menu-panel {
            left: auto !important;
            right: 0 !important;
          }
        }
        @media (max-width: 639px) {
          .menu-wrapper .sm-scope .staggered-menu-panel,
          .menu-wrapper .sm-scope .sm-prelayers {
            width: 100% !important;
            left: 0 !important;
            right: 0 !important;
          }
        }

        .menu-wrapper .sm-scope .sm-panel-inner {
          display: flex !important;
          flex: 1 0 auto !important;
          flex-direction: column !important;
          min-height: calc(100dvh - 124px) !important;
          gap: 1.25rem !important;
        }
        .menu-wrapper .sm-scope .sm-panel-list {
          display: flex !important;
          flex-direction: column !important;
          gap: clamp(8px, 1.2vh, 12px) !important;
        }
        .menu-wrapper .sm-scope .sm-panel-itemWrap {
          flex: 0 0 auto !important;
          line-height: 1.05 !important;
        }
        .menu-wrapper .sm-scope .sm-panel-item {
          box-sizing: border-box !important;
          max-width: 100% !important;
          font-size: clamp(2rem, min(3.6vw, 7.5vh), 3.75rem) !important;
          line-height: 1.05 !important;
          white-space: normal !important;
          padding-right: 1.8em !important;
        }
        .menu-wrapper .sm-scope .sm-panel-list[data-numbering] .sm-panel-item::after {
          right: 0.4em !important;
        }
        @media (min-width: 1024px) {
          .menu-wrapper .sm-scope .sm-panel-item {
            white-space: nowrap !important;
          }
        }

        .menu-wrapper .sm-scope .sm-socials {
          flex-shrink: 0 !important;
          margin-top: auto !important;
          padding-top: 32px !important;
        }
        .menu-wrapper .sm-scope .sm-socials-link {
          color: var(--color-ink) !important;
        }
      `}</style>
    </div>
  )
}

export default MenuWrapper

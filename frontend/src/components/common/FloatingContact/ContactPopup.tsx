import { useCallback, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'motion/react'
import { X } from 'lucide-react'
import { useContact } from './ContactContext'
import { cn } from '@/lib/utils'

const contactFormSchema = z.object({
  name: z.string().refine((val) => val.trim().length > 0, {
    message: 'Enter your full name',
  }),
  phone: z.string().refine(
    (val) => {
      const trimmed = val.trim()
      if (!trimmed) return false
      if (!/^[0-9+\-()\s]+$/.test(trimmed)) return false
      const digits = trimmed.match(/\d/g)
      return !!digits && digits.length >= 10
    },
    {
      message: 'Enter a valid phone number',
    }
  ),
  email: z.string().refine(
    (val) => {
      const trimmed = val.trim()
      return trimmed.length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)
    },
    {
      message: 'Enter a valid email address',
    }
  ),
})

type ContactFormValues = z.infer<typeof contactFormSchema>

export function ContactPopup() {
  const { isOpen, closeContact, buttonRef } = useContact()
  const dialogRef = useRef<HTMLDivElement>(null)
  const [showToast, setShowToast] = useState(false)
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  )
  const [isReducedMotion, setIsReducedMotion] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  )

  useEffect(() => {
    const checkMedia = () => {
      setIsMobile(window.innerWidth < 768)
      setIsReducedMotion(
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
      )
    }
    checkMedia()
    window.addEventListener('resize', checkMedia)
    return () => window.removeEventListener('resize', checkMedia)
  }, [])

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    shouldFocusError: true,
  })

  const handleClose = useCallback(() => {
    closeContact()
    requestAnimationFrame(() => {
      buttonRef.current?.focus()
    })
  }, [closeContact, buttonRef])

  // TODO: Wire up submission to external contact API configured via environment variables
  const onSubmit = useCallback(
    (values: ContactFormValues) => {
      void values
      reset()
      closeContact()
      requestAnimationFrame(() => {
        buttonRef.current?.focus()
      })

      setShowToast(true)
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current)
      }
      toastTimerRef.current = setTimeout(() => {
        setShowToast(false)
      }, 2000)
    },
    [reset, closeContact, buttonRef]
  )

  const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    void handleSubmit(onSubmit)(e)
  }

  // Cleanup toast timer on unmount
  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current)
      }
    }
  }, [])

  // Keyboard navigation: Escape closes, Tab traps focus
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        handleClose()
        return
      }

      if (e.key === 'Tab') {
        const dialog = dialogRef.current
        if (!dialog) return

        const focusables = Array.from(
          dialog.querySelectorAll<HTMLElement>(
            'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
          )
        ).filter((el) => el.offsetParent !== null)

        if (focusables.length === 0) return

        const first = focusables[0]
        const last = focusables[focusables.length - 1]

        if (e.shiftKey) {
          if (
            document.activeElement === first ||
            !dialog.contains(document.activeElement)
          ) {
            e.preventDefault()
            last.focus()
          }
        } else {
          if (
            document.activeElement === last ||
            !dialog.contains(document.activeElement)
          ) {
            e.preventDefault()
            first.focus()
          }
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, handleClose])

  // Initial focus on open + set inert on background content
  useEffect(() => {
    if (!isOpen) return

    const timer = setTimeout(() => {
      const dialog = dialogRef.current
      if (dialog) {
        const firstInput = dialog.querySelector<HTMLInputElement>('#contact-name')
        if (firstInput) {
          firstInput.focus()
        } else {
          const firstFocusable = dialog.querySelector<HTMLElement>('button, input')
          firstFocusable?.focus()
        }
      }
    }, 50)

    const main = document.getElementById('main')
    const footer = document.querySelector('footer')

    main?.setAttribute('inert', '')
    footer?.setAttribute('inert', '')

    return () => {
      clearTimeout(timer)
      main?.removeAttribute('inert')
      footer?.removeAttribute('inert')
    }
  }, [isOpen])

  const dialogMotionProps = isReducedMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      }
    : isMobile
    ? {
        initial: { opacity: 0, y: '100%' },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: '100%' },
      }
    : {
        initial: { opacity: 0, scale: 0.96 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.96 },
      }

  const toastMotionProps = isReducedMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      }
    : {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 12 },
      }

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <div className="contact-popup-portal fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4">
            {/* Backdrop overlay */}
            <motion.div
              className="contact-popup-backdrop fixed inset-0 bg-[#0B0B0F]/40 backdrop-blur-[2px] z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              onClick={handleClose}
              aria-hidden="true"
            />

            {/* Dialog Content */}
            <motion.div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="contact-popup-title"
              aria-describedby="contact-popup-desc"
              className={cn(
                'contact-popup-dialog relative z-50 w-full bg-white flex flex-col',
                // Mobile layout: bottom sheet sliding up, max 90dvh, internal scroll, safe area
                'max-md:rounded-t-[24px] max-md:max-h-[90dvh] max-md:overflow-y-auto max-md:p-6 max-md:pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))]',
                // Desktop layout: centred card, max-w 440px, radius 20px, soft blue shadow
                'md:max-w-[440px] md:rounded-[20px] md:shadow-[0_20px_50px_-20px_rgb(35_64_255_/_0.18)] md:p-8'
              )}
              {...dialogMotionProps}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              {/* Header with Title and Close button */}
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <h2
                    id="contact-popup-title"
                    className="text-2xl font-semibold text-[var(--color-ink)] tracking-tight"
                  >
                    Get in touch
                  </h2>
                  <p
                    id="contact-popup-desc"
                    className="text-sm text-[var(--color-ink-muted)] mt-1"
                  >
                    Share your details and we'll get back to you.
                  </p>
                </div>
                <button
                  type="button"
                  aria-label="Close"
                  onClick={handleClose}
                  className="rounded-full p-2 text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-blue-ghost)]/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2340FF] shrink-0 cursor-pointer"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>

              {/* Form */}
              <form
                onSubmit={onFormSubmit}
                noValidate
                className="flex flex-col gap-4 mt-4"
              >
                {/* 1. Full Name */}
                <div>
                  <label
                    htmlFor="contact-name"
                    className="block text-sm font-medium text-[var(--color-ink)] mb-1.5"
                  >
                    Full Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    autoComplete="name"
                    aria-invalid={errors.name ? 'true' : 'false'}
                    aria-describedby={errors.name ? 'contact-name-error' : undefined}
                    onFocus={(e) =>
                      e.target.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
                    }
                    className="h-12 w-full rounded-[10px] border border-[#E6E8F0] px-4 text-base text-[var(--color-ink)] placeholder:text-[var(--color-ink-faint)] focus:outline-none focus:ring-2 focus:ring-[#2340FF] focus:border-transparent transition-all"
                    {...register('name')}
                  />
                  {errors.name && (
                    <p
                      id="contact-name-error"
                      className="mt-1.5 text-xs text-[#C62828]"
                      role="alert"
                    >
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* 2. Phone number */}
                <div>
                  <label
                    htmlFor="contact-phone"
                    className="block text-sm font-medium text-[var(--color-ink)] mb-1.5"
                  >
                    Phone number
                  </label>
                  <input
                    id="contact-phone"
                    type="tel"
                    autoComplete="tel"
                    aria-invalid={errors.phone ? 'true' : 'false'}
                    aria-describedby={errors.phone ? 'contact-phone-error' : undefined}
                    onFocus={(e) =>
                      e.target.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
                    }
                    className="h-12 w-full rounded-[10px] border border-[#E6E8F0] px-4 text-base text-[var(--color-ink)] placeholder:text-[var(--color-ink-faint)] focus:outline-none focus:ring-2 focus:ring-[#2340FF] focus:border-transparent transition-all"
                    {...register('phone')}
                  />
                  {errors.phone && (
                    <p
                      id="contact-phone-error"
                      className="mt-1.5 text-xs text-[#C62828]"
                      role="alert"
                    >
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                {/* 3. Email */}
                <div>
                  <label
                    htmlFor="contact-email"
                    className="block text-sm font-medium text-[var(--color-ink)] mb-1.5"
                  >
                    Email
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    autoComplete="email"
                    aria-invalid={errors.email ? 'true' : 'false'}
                    aria-describedby={errors.email ? 'contact-email-error' : undefined}
                    onFocus={(e) =>
                      e.target.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
                    }
                    className="h-12 w-full rounded-[10px] border border-[#E6E8F0] px-4 text-base text-[var(--color-ink)] placeholder:text-[var(--color-ink-faint)] focus:outline-none focus:ring-2 focus:ring-[#2340FF] focus:border-transparent transition-all"
                    {...register('email')}
                  />
                  {errors.email && (
                    <p
                      id="contact-email-error"
                      className="mt-1.5 text-xs text-[#C62828]"
                      role="alert"
                    >
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Submit button */}
                <div className="mt-2">
                  <button
                    type="submit"
                    className="h-12 w-full bg-[#2340FF] hover:bg-[#2340FF]/90 text-white font-medium rounded-full text-base cursor-pointer select-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2340FF] focus-visible:ring-offset-2"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            role="status"
            aria-live="polite"
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#0B0B0F] text-white px-6 py-3 rounded-full text-sm font-medium shadow-xl pointer-events-none select-none text-center"
            {...toastMotionProps}
            transition={{ duration: 0.22 }}
          >
            We will reach you
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default ContactPopup

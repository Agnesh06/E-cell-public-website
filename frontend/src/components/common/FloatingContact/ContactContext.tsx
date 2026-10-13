import { createContext, useContext, useRef, useState, useMemo, type ReactNode } from 'react'

interface ContactContextValue {
  isOpen: boolean
  openContact: () => void
  closeContact: () => void
  buttonRef: React.RefObject<HTMLButtonElement | null>
}

const ContactContext = createContext<ContactContextValue | null>(null)

export function ContactProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement | null>(null)

  const openContact = () => setIsOpen(true)
  const closeContact = () => setIsOpen(false)

  const value = useMemo(
    () => ({
      isOpen,
      openContact,
      closeContact,
      buttonRef,
    }),
    [isOpen]
  )

  return <ContactContext.Provider value={value}>{children}</ContactContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useContact() {
  const context = useContext(ContactContext)
  if (!context) {
    throw new Error('useContact must be used within a ContactProvider')
  }
  return context
}

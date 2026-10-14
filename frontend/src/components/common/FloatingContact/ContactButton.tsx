import { useContact } from './ContactContext'
import { cn } from '@/lib/utils'
import {MailPen} from "lucide-react";

export interface ContactButtonProps {
  isMenuOpen?: boolean
  className?: string
}

export function ContactButton({ isMenuOpen = false, className }: ContactButtonProps) {
  const { isOpen, openContact, buttonRef } = useContact()
  const isHidden = isOpen || isMenuOpen

  return (
    <button
      ref={buttonRef}
      type="button"
      aria-label="Contact Us"
      aria-hidden={isHidden ? 'true' : undefined}
      tabIndex={isHidden ? -1 : 0}
      onClick={openContact}
      className={cn(
        'contact-button inline-flex items-center justify-center font-medium text-[14px] leading-none text-white select-none cursor-pointer',
        'h-10 rounded-full bg-[#2340FF] hover:bg-[#2340FF]/90 transition-opacity duration-150 motion-reduce:transition-none',
        'px-3 min-[480px]:px-[18px]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2340FF] focus-visible:ring-offset-2',
        isHidden ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto',
        className
      )}
    >
      <span><MailPen className="w-6 h-6" /></span>
    </button>
  )
}

export default ContactButton

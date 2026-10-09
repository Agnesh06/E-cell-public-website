import * as React from 'react'
import { Link } from 'react-router'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'
  to?: string
  withArrow?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  ({ className, variant = 'primary', to, withArrow = false, children, ...props }, ref) => {
    const baseClasses =
      'group inline-flex items-center justify-center font-medium select-none cursor-pointer transition-all duration-180 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50 text-base h-12 px-7 rounded-full'

    const variantClasses = {
      primary:
        'bg-[var(--color-blue)] text-white hover:bg-[var(--color-blue)]/90 focus-visible:outline-[var(--color-blue)] border-0',
      secondary:
        'bg-transparent text-[var(--color-ink)] border border-[var(--color-hairline)] hover:bg-[var(--color-blue-ghost)]/40 focus-visible:outline-[var(--color-blue)]',
    }[variant]

    const content = (
      <>
        <span>{children}</span>
        {withArrow && (
          <ArrowRight
            className="ml-2 h-4 w-4 shrink-0 transition-transform duration-180 ease-out group-hover:translate-x-1"
            aria-hidden="true"
          />
        )}
      </>
    )

    if (to) {
      return (
        <Link
          to={to}
          className={cn(baseClasses, variantClasses, className)}
          ref={ref as React.Ref<HTMLAnchorElement>}
        >
          {content}
        </Link>
      )
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        className={cn(baseClasses, variantClasses, className)}
        {...props}
      >
        {content}
      </button>
    )
  }
)

Button.displayName = 'Button'
export default Button


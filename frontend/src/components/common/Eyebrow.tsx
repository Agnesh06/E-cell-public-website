import * as React from 'react'
import { cn } from '@/lib/utils'

export interface EyebrowProps extends React.HTMLAttributes<HTMLParagraphElement> {
  as?: 'p' | 'span' | 'div'
}

export function Eyebrow({ as: Component = 'p', className, children, ...props }: EyebrowProps) {
  return (
    <Component className={cn('eyebrow', className)} {...props}>
      {children}
    </Component>
  )
}

export default Eyebrow


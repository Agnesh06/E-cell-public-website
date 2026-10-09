import * as React from 'react'
import { cn } from '@/lib/utils'

export interface PillProps extends React.HTMLAttributes<HTMLSpanElement> {
  as?: 'span' | 'div'
}

export function Pill({ as: Component = 'span', className, children, ...props }: PillProps) {
  return (
    <Component className={cn('pill', className)} {...props}>
      {children}
    </Component>
  )
}

export default Pill


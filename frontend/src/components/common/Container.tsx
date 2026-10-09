import * as React from 'react'
import { cn } from '@/lib/utils'

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType
}

export function Container({ as: Component = 'div', className, children, ...props }: ContainerProps) {
  return (
    <Component className={cn('container-site', className)} {...props}>
      {children}
    </Component>
  )
}

export default Container


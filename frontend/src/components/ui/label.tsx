"use client"

import * as React from "react"
import { cn } from "cn"
import { Label as LabelPrimitive } from "radix-ui"

function Label({
  className,
  required,
  children,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root> & { required?: boolean }) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1 mb-1.5 select-none",
        className
      )}
      {...props}
    >
      {children}
      {required && <span className="text-destructive font-bold">*</span>}
    </LabelPrimitive.Root>
  )
}

export { Label }

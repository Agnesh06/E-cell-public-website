import * as React from "react"
import { cn } from "cn"

function Input({ className, type, error, ...props }: React.ComponentProps<"input"> & { error?: string }) {
  return (
    <input
      type={type}
      data-slot="input"
      aria-invalid={error ? true : props["aria-invalid"]}
      className={cn(
        "flex h-11 w-full rounded-xl border bg-surface px-3.5 py-2 text-sm text-foreground transition-all duration-200 outline-none focus:outline-none focus-visible:outline-none",
        "placeholder:text-muted-foreground/60",
        "border-border focus:border-primary focus:ring-2 focus:ring-primary/15 shadow-xs",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted/40",
        error ? "border-destructive focus:border-primary focus:ring-2 focus:ring-primary/15" : "",
        className
      )}
      {...props}
    />
  )
}

export { Input }

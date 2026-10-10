import * as React from "react"
import { cn } from "cn"

function Textarea({ className, error, ...props }: React.ComponentProps<"textarea"> & { error?: string }) {
  return (
    <textarea
      data-slot="textarea"
      aria-invalid={error ? true : props["aria-invalid"]}
      className={cn(
        "flex min-h-[96px] w-full rounded-xl border bg-surface px-3.5 py-2.5 text-sm text-foreground transition-all duration-200 outline-none focus:outline-none focus-visible:outline-none resize-y",
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

export { Textarea }

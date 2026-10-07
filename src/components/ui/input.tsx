import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", error, ...props }, ref) => {
    return (
      <div className="w-full relative">
        <input
          type={type}
          className={cn(
            "flex h-11 w-full rounded-xl border bg-surface px-3.5 py-2 text-sm text-foreground transition-all duration-200",
            "placeholder:text-muted-foreground/60 focus:outline-none",
            "border-border focus:border-primary focus:ring-2 focus:ring-primary/15 shadow-sm",
            "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted/40",
            error && "border-destructive focus:border-destructive focus:ring-destructive/15 text-destructive",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="mt-1 text-xs text-destructive font-medium animate-fadeIn">
            {error}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };

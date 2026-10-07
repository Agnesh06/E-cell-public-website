import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
  options?: { value: string; label: string }[];
  placeholder?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, children, options, placeholder, ...props }, ref) => {
    return (
      <div className="w-full relative">
        <div className="relative">
          <select
            className={cn(
              "flex h-11 w-full appearance-none rounded-xl border bg-surface px-3.5 pr-10 py-2 text-sm text-foreground transition-all duration-200",
              "focus:outline-none border-border focus:border-primary focus:ring-2 focus:ring-primary/15 shadow-sm cursor-pointer",
              "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted/40",
              error && "border-destructive focus:border-destructive focus:ring-destructive/15",
              className
            )}
            ref={ref}
            {...props}
          >
            {placeholder && (
              <option value="" disabled className="text-muted-foreground">
                {placeholder}
              </option>
            )}
            {options
              ? options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))
              : children}
          </select>
          <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
            <ChevronDown className="size-4" />
          </div>
        </div>
        {error && (
          <p className="mt-1 text-xs text-destructive font-medium animate-fadeIn">
            {error}
          </p>
        )}
      </div>
    );
  }
);
Select.displayName = "Select";

export { Select };

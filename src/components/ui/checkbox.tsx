import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: React.ReactNode;
  error?: string;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, error, checked, id, ...props }, ref) => {
    const inputId = id || React.useId();
    return (
      <div className="flex flex-col gap-1">
        <label
          htmlFor={inputId}
          className="flex items-start gap-3 cursor-pointer group select-none text-sm leading-relaxed text-foreground"
        >
          <div className="relative mt-0.5 flex items-center justify-center">
            <input
              id={inputId}
              type="checkbox"
              ref={ref}
              checked={checked}
              className="peer sr-only"
              {...props}
            />
            <div
              className={cn(
                "size-5 rounded-md border border-border bg-surface transition-all duration-200 flex items-center justify-center shadow-xs",
                "peer-focus-visible:ring-2 peer-focus-visible:ring-primary/20 peer-focus-visible:border-primary",
                "peer-checked:bg-primary peer-checked:border-primary peer-checked:text-primary-foreground",
                "peer-hover:border-primary/60",
                error && "border-destructive",
                className
              )}
            >
              <Check className={cn("size-3.5 stroke-[3] transition-opacity", checked ? "opacity-100" : "opacity-0")} />
            </div>
          </div>
          {label && <span className="flex-1 text-sm text-[#262626]/90">{label}</span>}
        </label>
        {error && (
          <p className="text-xs text-destructive font-medium pl-8 animate-fadeIn">
            {error}
          </p>
        )}
      </div>
    );
  }
);
Checkbox.displayName = "Checkbox";

export { Checkbox };

"use client"

import * as React from "react"
import { cn } from "cn"
import { Checkbox as CheckboxPrimitive } from "radix-ui"
import { CheckIcon } from "lucide-react"

export interface CheckboxProps extends Omit<React.ComponentProps<typeof CheckboxPrimitive.Root>, "onChange"> {
  label?: React.ReactNode;
  error?: string;
  onChange?: (checked: boolean) => void;
}

function Checkbox({
  className,
  id,
  label,
  error,
  onChange,
  onCheckedChange,
  ...props
}: CheckboxProps) {
  const checkboxNode = (
    <CheckboxPrimitive.Root
      id={id}
      data-slot="checkbox"
      aria-invalid={error ? true : props["aria-invalid"]}
      onCheckedChange={(val) => {
        onChange?.(val === true);
        onCheckedChange?.(val);
      }}
      className={cn(
        "peer relative flex size-5 shrink-0 items-center justify-center rounded-md border border-border bg-surface transition-all duration-200 outline-none select-none cursor-pointer shadow-xs",
        "focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary",
        "data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=checked]:text-primary-foreground",
        "hover:border-primary/60",
        error && "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current transition-none [&>svg]:size-3.5"
      >
        <CheckIcon />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );

  if (label || error) {
    return (
      <div className="space-y-1">
        <div className="flex items-start gap-3">
          <div className="pt-0.5">{checkboxNode}</div>
          {label && (
            <label
              htmlFor={id}
              className="text-xs sm:text-sm text-foreground/90 font-normal leading-relaxed cursor-pointer select-none"
            >
              {label}
            </label>
          )}
        </div>
        {error && (
          <p className="text-xs text-destructive font-medium animate-fadeIn pl-7">
            {error}
          </p>
        )}
      </div>
    );
  }

  return checkboxNode;
}

export { Checkbox }

import * as React from "react";
import { cn } from "@/lib/utils";

export interface RadioOption {
  value: string;
  label: string;
}

export interface RadioGroupProps {
  name: string;
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  className?: string;
}

export function RadioGroup({
  name,
  options,
  value,
  onChange,
  error,
  className,
}: RadioGroupProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex flex-wrap gap-2.5">
        {options.map((option) => {
          const isSelected = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange?.(option.value)}
              className={cn(
                "px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 border cursor-pointer flex items-center gap-2",
                isSelected
                  ? "bg-[#2547FF]/10 text-primary border-primary ring-1 ring-primary font-semibold shadow-xs"
                  : "bg-surface text-foreground/80 border-border hover:border-primary/40 hover:bg-muted/30"
              )}
            >
              <div
                className={cn(
                  "size-3.5 rounded-full border flex items-center justify-center transition-colors",
                  isSelected
                    ? "border-primary bg-primary"
                    : "border-muted-foreground/40 bg-surface"
                )}
              >
                {isSelected && (
                  <div className="size-1.5 rounded-full bg-white" />
                )}
              </div>
              <span>{option.label}</span>
            </button>
          );
        })}
      </div>
      {error && (
        <p className="text-xs text-destructive font-medium animate-fadeIn">
          {error}
        </p>
      )}
    </div>
  );
}

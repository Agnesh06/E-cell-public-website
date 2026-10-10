import * as React from "react"
import { cn } from "cn"
import { RadioGroup as RadioGroupPrimitive } from "radix-ui"

export interface RadioOption {
  value: string;
  label: string;
}

export interface RadioGroupProps extends Omit<React.ComponentProps<typeof RadioGroupPrimitive.Root>, "onChange"> {
  options?: RadioOption[];
  error?: string;
  name?: string;
  onChange?: (value: string) => void;
}

function RadioGroup({
  className,
  options,
  error,
  name,
  onChange,
  value,
  onValueChange,
  ...props
}: RadioGroupProps) {
  if (options) {
    return (
      <div className={cn("space-y-1.5", className)}>
        <div className="flex flex-wrap gap-2.5">
          {options.map((option) => {
            const isSelected = value === option.value;
            const itemId = `${name || "rg"}-${option.value}`;
            return (
              <button
                key={itemId}
                id={itemId}
                type="button"
                onClick={() => {
                  onChange?.(option.value);
                  onValueChange?.(option.value);
                }}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 border cursor-pointer flex items-center gap-2 select-none",
                  isSelected
                    ? "bg-[#2547FF]/10 text-primary border-primary ring-1 ring-primary font-semibold shadow-xs"
                    : "bg-surface text-foreground/80 border-border hover:border-primary/40 hover:bg-muted/30",
                  error && !isSelected && "border-destructive/40"
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
          <p className="mt-1 text-xs text-destructive font-medium animate-fadeIn">
            {error}
          </p>
        )}
      </div>
    );
  }

  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn("grid w-full gap-2", className)}
      value={value}
      onValueChange={(val) => {
        onChange?.(val);
        onValueChange?.(val);
      }}
      {...props}
    />
  );
}

function RadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        "group/radio-group-item peer relative flex aspect-square size-4 shrink-0 rounded-full border border-input outline-none group-has-[:focus-visible]/field-label:ring-0 group-has-[:focus-visible]/field-label:not-data-checked:border-input after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 aria-invalid:aria-checked:border-primary dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground group-has-[:focus-visible]/field-label:data-checked:border-primary dark:data-checked:bg-primary",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="flex size-4 items-center justify-center"
      >
        <span className="absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-foreground" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
}

export { RadioGroup, RadioGroupItem }

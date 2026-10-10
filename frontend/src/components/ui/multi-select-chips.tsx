import * as React from "react";
import { Check, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface MultiSelectChipsProps {
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
  error?: string;
  allowCustom?: boolean;
  className?: string;
}

export function MultiSelectChips({
  options,
  value = [],
  onChange,
  error,
  allowCustom = true,
  className,
}: MultiSelectChipsProps) {
  const [customInput, setCustomInput] = React.useState("");
  const [showCustom, setShowCustom] = React.useState(false);

  const toggleOption = (opt: string) => {
    if (value.includes(opt)) {
      onChange(value.filter((v) => v !== opt));
    } else {
      onChange([...value, opt]);
    }
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = customInput.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
      setCustomInput("");
      setShowCustom(false);
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = value.includes(option);
          return (
            <button
              key={option}
              type="button"
              onClick={() => toggleOption(option)}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer border select-none",
                isSelected
                  ? "bg-primary text-primary-foreground border-primary shadow-xs font-semibold"
                  : "bg-surface text-foreground/80 border-border hover:border-primary/40 hover:bg-muted/40"
              )}
            >
              {isSelected ? (
                <Check className="size-3.5 stroke-[2.5]" />
              ) : (
                <Plus className="size-3.5 text-muted-foreground/70" />
              )}
              <span>{option}</span>
            </button>
          );
        })}

        {/* Any custom values added that are not in default options */}
        {value
          .filter((v) => !options.includes(v))
          .map((customVal) => (
            <button
              key={customVal}
              type="button"
              onClick={() => toggleOption(customVal)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary text-primary-foreground border border-primary shadow-xs cursor-pointer"
            >
              <Check className="size-3.5 stroke-[2.5]" />
              <span>{customVal}</span>
            </button>
          ))}

        {allowCustom && !showCustom && (
          <button
            type="button"
            onClick={() => setShowCustom(true)}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-primary border border-dashed border-primary/40 hover:border-primary hover:bg-[#2547FF]/5 cursor-pointer transition-colors"
          >
            <Plus className="size-3.5" />
            <span>Add other</span>
          </button>
        )}
      </div>

      {showCustom && (
        <div className="flex items-center gap-2 mt-2 pt-1 max-w-sm">
          <input
            type="text"
            placeholder="Type and press add..."
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddCustom(e)}
            className="h-8 px-2.5 text-xs rounded-lg border border-border bg-surface text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 flex-1"
            autoFocus
          />
          <button
            type="button"
            onClick={handleAddCustom}
            className="h-8 px-3 rounded-lg text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Add
          </button>
          <button
            type="button"
            onClick={() => {
              setShowCustom(false);
              setCustomInput("");
            }}
            className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
          >
            Cancel
          </button>
        </div>
      )}

      {error && (
        <p className="text-xs text-destructive font-medium animate-fadeIn">
          {error}
        </p>
      )}
    </div>
  );
}

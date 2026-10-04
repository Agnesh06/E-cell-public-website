import * as React from "react";
import { cn } from "@/lib/utils";

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, children, required, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        "text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1 mb-1.5 select-none",
        className
      )}
      {...props}
    >
      <span>{children}</span>
      {required && <span className="text-destructive font-bold ml-0.5">*</span>}
    </label>
  )
);
Label.displayName = "Label";

export { Label };

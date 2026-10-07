import React from "react";
import { cn } from "@/lib/utils";

export interface MarqueeProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  reverse?: boolean;
  pauseOnHover?: boolean;
  children?: React.ReactNode;
  duration?: number;
}

export function Marquee({
  className,
  reverse = false,
  pauseOnHover = true,
  children,
  duration = 32,
  ...props
}: MarqueeProps) {
  return (
    <div
      {...props}
      className={cn(
        "marquee-container relative w-full overflow-hidden select-none py-2",
        className
      )}
    >
      <div
        className={cn("marquee-content flex shrink-0 items-center", {
          "[animation-direction:reverse]": reverse,
          "[animation-play-state:paused]": false,
        })}
        style={{
          animationDuration: `${duration}s`,
        }}
      >
        {children}
        {children}
      </div>
      <div
        className={cn("marquee-content flex shrink-0 items-center", {
          "[animation-direction:reverse]": reverse,
          "[animation-play-state:paused]": false,
        })}
        style={{
          animationDuration: `${duration}s`,
        }}
        aria-hidden="true"
      >
        {children}
        {children}
      </div>
    </div>
  );
}

export default Marquee;

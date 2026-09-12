import * as React from "react";
import { cn } from "../../lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "gold" | "outline" | "success";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variantStyles = {
    default: "bg-[#F3EFE9] text-[#4A453F] border border-[#E5DFD6]",
    gold: "bg-[#FBF6EC] text-[#8C6428] border border-[#E9DAC1]",
    outline: "bg-transparent text-[#615B54] border border-[#E2DBD1]",
    success: "bg-[#ECF8F1] text-[#1D7446] border border-[#CAEAD6]",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium tracking-wide transition-colors",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}

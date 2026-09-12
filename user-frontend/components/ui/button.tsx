import * as React from "react";
import { cn } from "../../lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "gold";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, children, disabled, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none select-none rounded-xl active:scale-[0.98]";

    const variantStyles = {
      primary:
        "bg-[#1A1816] text-[#F9F7F2] hover:bg-[#2C2825] shadow-sm hover:shadow-md",
      secondary:
        "bg-[#F2ECE4] text-[#2C2723] hover:bg-[#EAE2D8]",
      outline:
        "border border-[#E0D8CE] bg-transparent text-[#2C2723] hover:bg-[#F9F6F0] hover:border-[#D1C6B8]",
      ghost:
        "bg-transparent text-[#4A453F] hover:bg-[#F4EFE8] hover:text-[#1A1816]",
      gold:
        "bg-gradient-to-r from-[#D8B77E] to-[#B38541] text-[#1A1715] font-semibold hover:brightness-105 shadow-sm",
    };

    const sizeStyles = {
      sm: "h-9 px-3.5 text-xs tracking-wide",
      md: "h-11 px-5 text-sm tracking-wide",
      lg: "h-13 px-7 text-base tracking-wide font-semibold",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {isLoading && (
          <svg
            className="mr-2 h-4 w-4 animate-spin text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

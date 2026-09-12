"use client";

import * as React from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "../../lib/utils";

export interface SelectOption<T extends string = string> {
  id: T;
  label?: string;
  name?: string;
  description?: string;
  icon?: React.ReactNode;
}

interface CustomSelectProps<T extends string = string> {
  value: T;
  onChange: (value: T) => void;
  options: readonly SelectOption<T>[] | SelectOption<T>[];
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function CustomSelect<T extends string = string>({
  value,
  onChange,
  options,
  label,
  placeholder = "Select an option",
  disabled = false,
  className,
}: CustomSelectProps<T>) {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Find active option
  const selectedOption = options.find((opt) => opt.id === value);

  // Close when clicked outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Handle keyboard events
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    if (e.key === "Escape") {
      setIsOpen(false);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setIsOpen((prev) => !prev);
    } else if (e.key === "ArrowDown" && isOpen) {
      e.preventDefault();
      const currentIndex = options.findIndex((opt) => opt.id === value);
      const nextOption = options[(currentIndex + 1) % options.length];
      if (nextOption) onChange(nextOption.id);
    } else if (e.key === "ArrowUp" && isOpen) {
      e.preventDefault();
      const currentIndex = options.findIndex((opt) => opt.id === value);
      const prevOption =
        options[(currentIndex - 1 + options.length) % options.length];
      if (prevOption) onChange(prevOption.id);
    }
  };

  const getDisplayName = (opt?: SelectOption<T>) => {
    if (!opt) return placeholder;
    return opt.label || opt.name || opt.id;
  };

  return (
    <div
      className={cn("relative w-full", isOpen ? "z-40" : "z-10", className)}
      ref={containerRef}
    >
      {label && (
        <label className="text-xs font-medium text-[#6B645D] block mb-1.5">
          {label}
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={cn(
          "w-full h-10 px-3.5 flex items-center justify-between text-left rounded-xl border bg-white transition-all duration-200 outline-none text-xs font-medium",
          disabled && "opacity-50 cursor-not-allowed",
          isOpen
            ? "border-[#B38541] ring-2 ring-[#B38541]/20 shadow-sm bg-[#FAF8F5]"
            : "border-[#E3DBD0] hover:border-[#C89E58] hover:bg-[#FDFCFB]"
        )}
      >
        <div className="flex items-center gap-2 truncate pr-2">
          {selectedOption?.icon && (
            <span className="text-[#8C6428] shrink-0">{selectedOption.icon}</span>
          )}
          <span className="text-[#1A1715] truncate">
            {getDisplayName(selectedOption)}
          </span>
        </div>

        <ChevronDown
          className={cn(
            "w-4 h-4 text-[#8C6428] shrink-0 transition-transform duration-200",
            isOpen && "transform rotate-180 text-[#B38541]"
          )}
        />
      </button>

      {/* Dropdown Menu Panel */}
      {isOpen && (
        <div
          role="listbox"
          className="absolute z-50 w-full mt-1.5 py-1.5 bg-[#FFFEFD] border border-[#E5DCD0] rounded-2xl shadow-xl shadow-stone-900/10 backdrop-blur-sm max-h-64 overflow-y-auto overflow-x-hidden animate-in fade-in-0 zoom-in-95 duration-150 ring-1 ring-black/5"
        >
          {options.map((opt) => {
            const isSelected = opt.id === value;
            const title = opt.name || opt.label || opt.id;
            const subtitle = opt.description;

            return (
              <div
                key={opt.id}
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(opt.id);
                  setIsOpen(false);
                }}
                className={cn(
                  "relative flex items-center justify-between px-3.5 py-2.5 mx-1 rounded-xl cursor-pointer text-xs transition-colors duration-150 select-none",
                  isSelected
                    ? "bg-[#FAF3E6] text-[#7A561E] font-semibold"
                    : "text-[#2D2824] hover:bg-[#F6EFE5] hover:text-[#1A1715]"
                )}
              >
                <div className="flex flex-col gap-0.5 truncate pr-3">
                  <div className="flex items-center gap-2">
                    {opt.icon && (
                      <span className="text-[#8C6428] shrink-0">{opt.icon}</span>
                    )}
                    <span className="truncate">{title}</span>
                  </div>
                  {subtitle && (
                    <span
                      className={cn(
                        "text-[11px] truncate leading-tight",
                        isSelected ? "text-[#8C6428]" : "text-[#8A837A]"
                      )}
                    >
                      {subtitle}
                    </span>
                  )}
                </div>

                {isSelected && (
                  <Check className="w-4 h-4 text-[#B38541] shrink-0 ml-2" />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

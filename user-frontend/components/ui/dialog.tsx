import * as React from "react";
import { X } from "lucide-react";
import { cn } from "../../lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "4xl";
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = "xl",
}: ModalProps) {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthStyles = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "4xl": "max-w-4xl",
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 !mt-0">
      {/* Clickable Backdrop */}
      <div
        className="fixed inset-0 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Centering Flex Container */}
      <div className="min-h-full flex items-center justify-center p-3 sm:p-6 pointer-events-none">
        <div
          className={cn(
            "relative w-full my-auto bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-[#E9E3DA] flex flex-col max-h-[calc(100vh-2.5rem)] sm:max-h-[86vh] z-10 pointer-events-auto animate-in zoom-in-95 duration-200",
            maxWidthStyles[maxWidth]
          )}
        >
          <div className="flex items-center justify-between px-5 sm:px-6 py-3 sm:py-3.5 border-b border-[#F0EBE3] shrink-0 bg-[#FCFAF7] rounded-t-2xl sm:rounded-t-3xl">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#1A1715]">{title}</h2>
              {description && (
                <p className="text-xs text-[#7A736B] mt-0.5 leading-relaxed">{description}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-xl text-[#7A736B] hover:text-[#1A1715] hover:bg-[#F0EBE3] transition-colors shrink-0 ml-2"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-3.5 sm:p-5 overflow-y-auto overscroll-contain">{children}</div>
        </div>
      </div>
    </div>
  );
}

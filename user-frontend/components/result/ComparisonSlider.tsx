import * as React from "react";
import { cn } from "../../lib/utils";

interface ComparisonSliderProps {
  originalUrl: string;
  generatedUrl: string;
  aspectRatio?: string;
  categoryName?: string;
}

export function ComparisonSlider({
  originalUrl,
  generatedUrl,
  categoryName,
}: ComparisonSliderProps) {
  const [sliderPosition, setSliderPosition] = React.useState(50);
  const [isDragging, setIsDragging] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const handleMove = React.useCallback(
    (clientX: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      let pos = (x / rect.width) * 100;
      if (pos < 0) pos = 0;
      if (pos > 100) pos = 100;
      setSliderPosition(pos);
    },
    []
  );

  const handleTouchMove = React.useCallback(
    (e: React.TouchEvent) => {
      if (!isDragging) return;
      handleMove(e.touches[0].clientX);
    },
    [isDragging, handleMove]
  );

  const handleMouseMove = React.useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return;
      handleMove(e.clientX);
    },
    [isDragging, handleMove]
  );

  React.useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchend", handleMouseUp);
    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, []);

  return (
    <div className="flex flex-col items-center w-full">
      {/* Interactive Split Slider Container */}
      <div
        ref={containerRef}
        onMouseDown={() => setIsDragging(true)}
        onTouchStart={() => setIsDragging(true)}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        className="relative w-full max-w-xl aspect-[4/5] rounded-2xl overflow-hidden select-none border border-[#E2DAD0] shadow-md bg-[#EDE6DC] cursor-ew-resize"
      >
        {/* Under layer: AI Generated Result */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={generatedUrl}
          alt="AI Virtual Try-On Result"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />

        {/* Top layer (Clipped): Original Model Reference */}
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={originalUrl}
            alt="Original Model Reference"
            className="absolute inset-0 w-full h-full object-cover max-w-none pointer-events-none"
          />
        </div>

        {/* Divider line & Handle */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_8px_rgba(0,0,0,0.4)] pointer-events-none"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white shadow-float border border-[#D8C7B4] flex items-center justify-center text-[#1A1715]">
            <svg
              className="w-4 h-4 text-[#7A6B5B]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M8 7l-5 5 5 5M16 7l5 5-5 5" />
            </svg>
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 pointer-events-none">
          <span className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white text-[11px] font-medium tracking-wide">
            Original Model
          </span>
        </div>

        <div className="absolute top-3 right-3 pointer-events-none">
          <span className="px-2.5 py-1 rounded-lg bg-[#D8B77E]/90 backdrop-blur-md text-[#1A1715] text-[11px] font-bold tracking-wide shadow-sm">
            AI Try-On ({categoryName || "Jewelry"})
          </span>
        </div>
      </div>

      <p className="text-xs text-[#8A8175] mt-2.5">
        Drag slider left/right to compare before and after try-on
      </p>
    </div>
  );
}

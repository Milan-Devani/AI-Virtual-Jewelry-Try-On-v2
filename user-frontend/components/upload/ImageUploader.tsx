import * as React from "react";
import { UploadCloud, Image as ImageIcon, Trash2, RefreshCw, AlertCircle, CheckCircle2 } from "lucide-react";
import { ImageFileState } from "../../types";
import { formatBytes, cn } from "../../lib/utils";
import { validateClientImage } from "../../validators/uploadValidator";

interface ImageUploaderProps {
  label: string;
  subtitle: string;
  state: ImageFileState;
  onChange: (state: ImageFileState) => void;
  accept?: string;
  id: string;
}

export function ImageUploader({
  label,
  subtitle,
  state,
  onChange,
  accept = "image/jpeg,image/png,image/webp",
  id,
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const [isValidating, setIsValidating] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleProcessFile = async (file: File) => {
    setIsValidating(true);
    const validation = await validateClientImage(file);
    setIsValidating(false);

    if (!validation.valid) {
      onChange({
        file: null,
        previewUrl: null,
        name: file.name,
        sizeBytes: file.size,
        isValid: false,
        error: validation.error,
      });
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    onChange({
      file,
      previewUrl,
      name: file.name,
      sizeBytes: file.size,
      width: validation.width,
      height: validation.height,
      isValid: true,
      error: undefined,
    });
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (state.previewUrl) {
      URL.revokeObjectURL(state.previewUrl);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onChange({
      file: null,
      previewUrl: null,
      name: "",
      sizeBytes: 0,
      isValid: false,
    });
  };

  const triggerSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-2">
        <div>
          <label htmlFor={id} className="text-sm font-semibold text-[#1A1715]">
            {label}
          </label>
          <p className="text-xs text-[#7A736B]">{subtitle}</p>
        </div>
        {state.isValid && state.file && (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#1E7748] bg-[#ECF7F0] px-2 py-0.5 rounded-md">
            <CheckCircle2 className="w-3 h-3" /> Ready
          </span>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        id={id}
        accept={accept}
        onChange={handleFileInputChange}
        className="hidden"
        tabIndex={-1}
      />

      <div
        role="button"
        tabIndex={0}
        onClick={triggerSelect}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            triggerSelect();
          }
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative flex-1 min-h-[240px] rounded-2xl border-2 border-dashed transition-all duration-200 flex flex-col items-center justify-center p-4 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-gold-500",
          isDragging
            ? "border-[#C89E58] bg-[#FAF5EC] scale-[1.01]"
            : "border-[#E5DDD2] bg-[#FCFAF7] hover:border-[#D4C8B8] hover:bg-[#F9F5EE]",
          state.error && "border-[#E5A8A8] bg-[#FFF8F8]"
        )}
      >
        {state.previewUrl ? (
          <div className="relative w-full h-full min-h-[220px] flex flex-col items-center justify-center group">
            {/* Image Preview */}
            <div className="relative w-full h-44 rounded-xl overflow-hidden bg-[#ECE6DD] flex items-center justify-center border border-[#E3DBD0]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={state.previewUrl}
                alt={state.name || label}
                className="w-full h-full object-contain"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[2px]">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    triggerSelect();
                  }}
                  className="p-2.5 rounded-full bg-white text-[#1A1715] hover:bg-[#F4EFEA] shadow-md transition-transform active:scale-95"
                  title="Replace image"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleRemove}
                  className="p-2.5 rounded-full bg-[#E5484D] text-white hover:bg-[#D43B40] shadow-md transition-transform active:scale-95"
                  title="Remove image"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Meta info */}
            <div className="w-full flex items-center justify-between mt-2.5 px-1 text-xs text-[#6B645D]">
              <span className="truncate max-w-[170px] font-medium text-[#2E2A25]">
                {state.name}
              </span>
              <span>
                {formatBytes(state.sizeBytes)}{" "}
                {state.width && state.height ? `• ${state.width}x${state.height}` : ""}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center p-4">
            <div
              className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center mb-3 transition-colors",
                isDragging
                  ? "bg-[#EFE6D5] text-[#9A7336]"
                  : "bg-[#F3ECE1] text-[#7A7165]"
              )}
            >
              {isValidating ? (
                <RefreshCw className="w-6 h-6 animate-spin text-[#9A7336]" />
              ) : (
                <UploadCloud className="w-6 h-6" />
              )}
            </div>

            <p className="text-sm font-semibold text-[#1A1715] mb-1">
              {isDragging ? "Drop image here" : "Click to upload or drag & drop"}
            </p>
            <p className="text-xs text-[#8A837A] mb-3">
              JPEG, PNG, or WebP up to 8 MB
            </p>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#F0EBE2] text-[11px] text-[#615B53] font-medium">
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Min. 512 × 512 recommended</span>
            </div>
          </div>
        )}
      </div>

      {state.error && (
        <div className="flex items-center gap-1.5 mt-2 text-xs text-[#C93B3B] bg-[#FDF2F2] p-2 rounded-lg border border-[#F5D5D5]">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{state.error}</span>
        </div>
      )}
    </div>
  );
}

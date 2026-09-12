import * as React from "react";
import { Modal } from "../ui/dialog";
import { GenerationRecord } from "../../types";
import { fetchHistoryApi, deleteHistoryApi } from "../../services/api";
import { JEWELRY_CATEGORIES } from "../../constants/categories";
import { generateDownloadFilename } from "../../lib/utils";
import { Trash2, Download, ExternalLink, RefreshCw, Sparkles, FolderOpen } from "lucide-react";
import { toast } from "sonner";

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRecord?: (record: GenerationRecord) => void;
}

export function HistoryModal({ isOpen, onClose, onSelectRecord }: HistoryModalProps) {
  const [history, setHistory] = React.useState<GenerationRecord[]>([]);
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");
  const [isLoading, setIsLoading] = React.useState(false);

  const loadHistory = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchHistoryApi("anonymous", selectedCategory);
      setHistory(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory]);

  React.useEffect(() => {
    if (isOpen) {
      loadHistory();
    }
  }, [isOpen, loadHistory]);

  const handleDelete = async (id: string) => {
    try {
      await deleteHistoryApi(id);
      setHistory((prev) => prev.filter((r) => r.id !== id));
      toast.success("Generation record deleted");
    } catch {
      toast.error("Failed to delete generation record");
    }
  };

  const handleDownload = async (record: GenerationRecord) => {
    if (!record.generatedImageUrl) return;
    try {
      const filename = generateDownloadFilename(record.category, record.createdAt);
      const res = await fetch(record.generatedImageUrl);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success("Downloaded successfully");
    } catch {
      window.open(record.generatedImageUrl, "_blank");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Generation History"
      description="View, download, and manage your previous AI virtual try-on renders"
      maxWidth="4xl"
    >
      <div className="space-y-4">
        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-[#F0EBE3] no-scrollbar">
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === "all"
                ? "bg-[#1A1715] text-white"
                : "bg-[#F3EEE7] text-[#6E675F] hover:bg-[#EAE2D8]"
            }`}
          >
            All Categories
          </button>

          {JEWELRY_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? "bg-[#1A1715] text-white"
                  : "bg-[#F3EEE7] text-[#6E675F] hover:bg-[#EAE2D8]"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Content list */}
        {isLoading ? (
          <div className="py-16 flex flex-col items-center justify-center text-center">
            <RefreshCw className="w-6 h-6 animate-spin text-[#B38541] mb-2" />
            <p className="text-xs text-[#8A8175]">Loading your history records...</p>
          </div>
        ) : history.length === 0 ? (
          <div className="py-16 flex flex-col items-center justify-center text-center border-2 border-dashed border-[#EAE3DA] rounded-2xl">
            <FolderOpen className="w-10 h-10 text-[#BDB5AB] mb-2" />
            <h4 className="text-sm font-semibold text-[#1A1715]">No try-ons yet</h4>
            <p className="text-xs text-[#8A8175] max-w-sm mt-1">
              Upload a model and jewelry reference to generate your first AI virtual try-on photograph.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {history.map((item) => {
              const catObj = JEWELRY_CATEGORIES.find((c) => c.id === item.category);
              const dateStr = new Date(item.createdAt).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <div
                  key={item.id}
                  className="flex items-center gap-3.5 p-3 rounded-2xl border border-[#ECE5DC] bg-[#FCFAF8] hover:border-[#DACDBF] hover:bg-white transition-all group"
                >
                  {/* Thumbnail */}
                  <div className="relative w-18 h-22 rounded-xl overflow-hidden bg-[#ECE6DD] shrink-0 border border-[#E0D7CB]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.generatedImageUrl || item.modelImageUrl}
                      alt={item.category}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-[#1A1715] truncate">
                        {catObj ? catObj.name : item.category}
                      </span>
                      <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-[#EFE4D2] text-[#8C6428] font-semibold">
                        {item.aspectRatio}
                      </span>
                    </div>

                    <p className="text-[11px] text-[#8A8175] mb-2">{dateStr}</p>

                    <div className="flex items-center gap-2">
                      {item.generatedImageUrl && (
                        <>
                          <button
                            type="button"
                            onClick={() => window.open(item.generatedImageUrl, "_blank")}
                            className="inline-flex items-center gap-1 text-[11px] font-medium text-[#1A1715] bg-[#EAE2D6] px-2 py-1 rounded-lg hover:bg-[#DFD4C5]"
                          >
                            <ExternalLink className="w-3 h-3" /> View
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDownload(item)}
                            className="inline-flex items-center gap-1 text-[11px] font-medium text-[#8C6428] bg-[#FBF3E4] px-2 py-1 rounded-lg hover:bg-[#F3E5C8]"
                          >
                            <Download className="w-3 h-3" /> Download
                          </button>
                        </>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                        className="p-1 rounded-lg text-[#9F978E] hover:text-[#D43B40] hover:bg-[#FEECEB] transition-colors ml-auto"
                        title="Delete record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Modal>
  );
}

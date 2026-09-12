"use client";

import * as React from "react";
import { Header } from "../components/layout/Header";
import { Hero } from "../components/layout/Hero";
import { ImageUploader } from "../components/upload/ImageUploader";
import { CategorySelector } from "../components/ai-tryon/CategorySelector";
import { GenerationSettings } from "../components/ai-tryon/GenerationSettings";
import { AiModelCustomizer } from "../components/ai-tryon/AiModelCustomizer";
import { LiveProgress } from "../components/ai-tryon/LiveProgress";
import { ResultSection } from "../components/result/ResultSection";
import { HistoryModal } from "../components/result/HistoryModal";
import { SettingsModal } from "../components/layout/SettingsModal";
import { MembershipUpgradeModal } from "../components/ai-tryon/MembershipUpgradeModal";
import { Modal } from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import {
  ImageFileState,
  BackgroundType,
  AspectRatio,
  ImageSizeQuality,
  TryOnGenerationResult,
  TryOnMode,
  AiModelConfig,
} from "../types";
import { generateTryOnApi, ApiErrorWithDetails } from "../services/api";
import { JEWELRY_CATEGORIES } from "../constants/categories";
import { Sparkles, AlertTriangle, ArrowRight, Camera, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "../lib/utils";

// Smart helper to extract suggested categories from details or message
function extractSuggestedCategories(
  detailsCategory?: string,
  message?: string
): string[] {
  const list: string[] = [];
  if (detailsCategory && JEWELRY_CATEGORIES.some((c) => c.id === detailsCategory)) {
    list.push(detailsCategory);
  }

  if (message) {
    const lower = message.toLowerCase();
    for (const cat of JEWELRY_CATEGORIES) {
      if (
        (lower.includes(`'${cat.id}'`) ||
          lower.includes(`"${cat.id}"`) ||
          lower.includes(cat.name.toLowerCase())) &&
        !list.includes(cat.id)
      ) {
        list.push(cat.id);
      }
    }
  }

  return list;
}

export default function TryOnWorkspacePage() {
  // Modal States
  const [isHistoryOpen, setIsHistoryOpen] = React.useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);

  // Workflow Mode State: Upload Human Model vs Generate AI Virtual Model
  const [tryOnMode, setTryOnMode] = React.useState<TryOnMode>("custom-model");

  // AI Virtual Model Persona Config
  const [aiModelConfig, setAiModelConfig] = React.useState<AiModelConfig>({
    gender: "female",
    ethnicityRegion: "gujarati",
    clothingStyle: "gujarati",
    skinTone: "wheatish",
    hairType: "wavy",
    hairColor: "natural-black",
    eyeColor: "deep-brown",
    expression: "serene, confident, and regal editorial expression",
  });

  // Category Mismatch Modal Popup State
  const [mismatchModalData, setMismatchModalData] = React.useState<{
    isOpen: boolean;
    message: string;
    suggestedCategories: string[];
  }>({
    isOpen: false,
    message: "",
    suggestedCategories: [],
  });

  // Membership Upgrade Modal State
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = React.useState(false);
  const [upgradeReason, setUpgradeReason] = React.useState("");

  // Model & Jewelry Upload States
  const [modelState, setModelState] = React.useState<ImageFileState>({
    file: null,
    previewUrl: null,
    name: "",
    sizeBytes: 0,
    isValid: false,
  });

  const [jewelryState, setJewelryState] = React.useState<ImageFileState>({
    file: null,
    previewUrl: null,
    name: "",
    sizeBytes: 0,
    isValid: false,
  });

  // Settings
  const [selectedCategory, setSelectedCategory] = React.useState<string>("earrings");
  const [customCategoryName, setCustomCategoryName] = React.useState<string>("Nath / Nose Ring");
  const [customPlacement, setCustomPlacement] = React.useState<string>("nose & nostril");

  const [background, setBackground] = React.useState<BackgroundType>("studio");
  const [aspectRatio, setAspectRatio] = React.useState<AspectRatio>("4:5");
  const [imageSize, setImageSize] = React.useState<ImageSizeQuality>("2K");

  // Generation status
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [generationError, setGenerationError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<TryOnGenerationResult | null>(null);

  // Scroll to result on success
  const resultRef = React.useRef<HTMLDivElement>(null);

  const isAiModelMode = tryOnMode === "ai-model";

  const canGenerate = isAiModelMode
    ? jewelryState.isValid && jewelryState.file && !isGenerating
    : modelState.isValid &&
      modelState.file &&
      jewelryState.isValid &&
      jewelryState.file &&
      !isGenerating;

  const handleGenerate = async () => {
    if (!isAiModelMode && !modelState.file) {
      toast.error("Please upload a human model image.");
      return;
    }

    if (!jewelryState.file) {
      toast.error("Please upload a jewelry product image.");
      return;
    }

    if (selectedCategory === "custom" && !customCategoryName.trim()) {
      toast.error("Please enter a custom jewelry category name.");
      return;
    }

    setIsGenerating(true);
    setGenerationError(null);

    try {
      const response = await generateTryOnApi({
        modelFile: isAiModelMode ? null : modelState.file,
        jewelryFile: jewelryState.file,
        category: selectedCategory,
        mode: tryOnMode,
        modelConfig: isAiModelMode ? aiModelConfig : undefined,
        customCategoryName: selectedCategory === "custom" ? customCategoryName : undefined,
        customPlacement: selectedCategory === "custom" ? customPlacement : undefined,
        background,
        aspectRatio,
        imageSize,
      });

      setResult(response);
      toast.success("AI virtual try-on generated successfully!");

      // Smooth scroll to result
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 200);
    } catch (err: unknown) {
      const apiErr = err as ApiErrorWithDetails;
      const errorMsg =
        apiErr?.message ||
        "We couldn't generate the try-on image this time. Your uploaded files are preserved.";

      setGenerationError(errorMsg);

      // Check membership, auth, or limit errors first
      if (
        apiErr?.code === "MEMBERSHIP_REQUIRED" ||
        apiErr?.code === "MEMBERSHIP_PENDING" ||
        apiErr?.code === "MEMBERSHIP_EXPIRED" ||
        apiErr?.code === "LIMIT_EXCEEDED" ||
        apiErr?.code === "AUTH_REQUIRED" ||
        errorMsg.toLowerCase().includes("membership") ||
        errorMsg.toLowerCase().includes("subscribe") ||
        errorMsg.toLowerCase().includes("limit reached")
      ) {
        setUpgradeReason(errorMsg);
        setIsUpgradeModalOpen(true);
      }
      // If category or anatomical mismatch occurred, show modal popup
      else if (
        apiErr?.code === "INVALID_CATEGORY" ||
        errorMsg.toLowerCase().includes("category") ||
        errorMsg.toLowerCase().includes("mismatch") ||
        errorMsg.toLowerCase().includes("body")
      ) {
        const suggested = extractSuggestedCategories(
          apiErr?.details?.suggestedCategory,
          errorMsg
        ).filter((catId) => catId !== selectedCategory);

        setMismatchModalData({
          isOpen: true,
          message: errorMsg,
          suggestedCategories: suggested,
        });
      } else {
        toast.error(errorMsg);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerate = () => {
    handleGenerate();
  };

  const handleSwitchCategory = (newCatId: string) => {
    setSelectedCategory(newCatId);
    setMismatchModalData({ isOpen: false, message: "", suggestedCategories: [] });
    setGenerationError(null);
    const catName = JEWELRY_CATEGORIES.find((c) => c.id === newCatId)?.name || newCatId;
    toast.success(`Category updated to '${catName}'`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F5]">
      {/* Navigation Header */}
      <Header
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Editorial Hero */}
        <Hero />

        {/* Main Workspace Card */}
        <Card className="w-full bg-white border border-[#E8E1D6] rounded-3xl shadow-card overflow-visible">
          <CardContent className="p-6 sm:p-8 space-y-6 overflow-visible">
            {/* Section Header & Mode Switcher */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F0EBE3]">
              <div>
                <h2 className="text-lg sm:text-xl font-serif font-bold text-[#1A1715]">
                  AI Try-On Studio Workspace
                </h2>
                <p className="text-xs text-[#7A736B] mt-0.5">
                  {isAiModelMode
                    ? "Upload jewelry product & customize the AI model persona"
                    : "Upload model & jewelry references • Choose category & render"}
                </p>
              </div>

              {/* Mode Switcher Tabs */}
              <div className="flex items-center p-1 rounded-2xl bg-[#F0EBE3] border border-[#E4DCD0] shrink-0">
                <button
                  type="button"
                  disabled={isGenerating}
                  onClick={() => setTryOnMode("custom-model")}
                  className={cn(
                    "px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 flex items-center gap-1.5",
                    !isAiModelMode
                      ? "bg-white text-[#1A1715] shadow-sm font-bold"
                      : "text-[#7A736B] hover:text-[#1A1715]"
                  )}
                >
                  <Camera className="w-3.5 h-3.5 text-[#B38541]" />
                  <span>Upload Model (2 Images)</span>
                </button>

                <button
                  type="button"
                  disabled={isGenerating}
                  onClick={() => setTryOnMode("ai-model")}
                  className={cn(
                    "px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 flex items-center gap-1.5",
                    isAiModelMode
                      ? "bg-white text-[#1A1715] shadow-sm font-bold"
                      : "text-[#7A736B] hover:text-[#1A1715]"
                  )}
                >
                  <Wand2 className="w-3.5 h-3.5 text-[#B38541]" />
                  <span>Generate AI Model (Product Only)</span>
                </button>
              </div>
            </div>

            {/* Studio Workspace Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Left Column: Human Model Reference OR AI Virtual Persona Badge Card */}
              {!isAiModelMode ? (
                <ImageUploader
                  id="model-image-input"
                  label="1. Human Model Reference"
                  subtitle="Model identity, skin tone, & pose reference"
                  state={modelState}
                  onChange={setModelState}
                />
              ) : (
                <div className="flex flex-col h-full rounded-2xl border-2 border-dashed border-[#B38541]/40 bg-[#FCFAF6] p-5 justify-between animate-in fade-in duration-200">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#8C6428] bg-[#FAF3E6] px-2.5 py-1 rounded-lg border border-[#E5D5BA] flex items-center gap-1.5">
                        <Wand2 className="w-3.5 h-3.5 text-[#B38541]" />
                        <span>AI Virtual Model Mode</span>
                      </span>
                      <span className="text-[11px] font-semibold text-[#1E7748] bg-[#ECF7F0] px-2 py-0.5 rounded-md">
                        Active
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-[#1A1715] capitalize mb-1">
                      {aiModelConfig.clothingStyle.replace(/-/g, " ")} Persona
                    </h3>
                    <p className="text-xs text-[#7A736B] leading-relaxed mb-4">
                      No model photo needed. The AI will generate a photorealistic{" "}
                      <span className="font-semibold text-[#1A1715]">
                        {aiModelConfig.gender === "male" ? "male" : "female"}
                      </span>{" "}
                      model tailored to your selected regional attire, skin tone, and styling below.
                    </p>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 rounded-xl bg-white border border-[#E8DFC9]">
                        <span className="text-[10px] text-[#8A8175] block uppercase font-bold">Skin Tone</span>
                        <span className="font-medium text-[#1A1715] capitalize">{aiModelConfig.skinTone}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white border border-[#E8DFC9]">
                        <span className="text-[10px] text-[#8A8175] block uppercase font-bold">Hairstyle</span>
                        <span className="font-medium text-[#1A1715] capitalize">{aiModelConfig.hairType.replace(/-/g, " ")}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-[#EBE1D2] flex items-center justify-between text-xs text-[#8C6428]">
                    <span>✨ Customize full persona below</span>
                    <span className="text-[11px] font-medium">9+ Indian Regional Styles</span>
                  </div>
                </div>
              )}

              {/* Right Column: Exact Jewelry Product (100% Persisted across both modes) */}
              <ImageUploader
                id="jewelry-image-input"
                label={isAiModelMode ? "Exact Jewelry Product Photo" : "2. Exact Jewelry Product"}
                subtitle="High-fidelity product photo to dress onto the model"
                state={jewelryState}
                onChange={setJewelryState}
              />
            </div>

            {/* AI Virtual Model Customizer Drawer (Visible when in AI Model Mode) */}
            {isAiModelMode && (
              <div className="pt-2 animate-in fade-in duration-200">
                <AiModelCustomizer
                  config={aiModelConfig}
                  onChange={setAiModelConfig}
                  disabled={isGenerating}
                />
              </div>
            )}

            {/* Category Selector with Custom Category Support */}
            <div className="pt-2 border-t border-[#F0EBE3]">
              <CategorySelector
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                customCategoryName={customCategoryName}
                onChangeCustomCategoryName={setCustomCategoryName}
                customPlacement={customPlacement}
                onChangeCustomPlacement={setCustomPlacement}
                disabled={isGenerating}
              />
            </div>

            {/* Environment & Output Settings */}
            <div className="pt-2 border-t border-[#F0EBE3]">
              <GenerationSettings
                background={background}
                onChangeBackground={setBackground}
                aspectRatio={aspectRatio}
                onChangeAspectRatio={setAspectRatio}
                imageSize={imageSize}
                onChangeImageSize={setImageSize}
                disabled={isGenerating}
              />
            </div>

            {/* Generation Progress Display */}
            {isGenerating && (
              <div className="pt-2">
                <LiveProgress />
              </div>
            )}

            {/* Error Display Card */}
            {generationError && !isGenerating && (
              <div className="p-4 rounded-2xl bg-[#FFF6F6] border border-[#F6D2D2] flex items-start gap-3 text-xs text-[#C93B3B] animate-in fade-in">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-[#C93B3B]" />
                <div className="flex-1">
                  <p className="font-semibold">Category or Anatomical Mismatch</p>
                  <p className="mt-0.5 text-[#A53030] leading-relaxed">{generationError}</p>
                  <p className="mt-1.5 text-[11px] text-[#7A736B]">
                    Please select the matching category for your uploaded images or upload an image showing the required body area.
                  </p>
                </div>
              </div>
            )}

            {/* Generate Action Button */}
            <div className="pt-4 border-t border-[#F0EBE3] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-[#7A736B]">
                {isAiModelMode ? (
                  !jewelryState.isValid ? (
                    <span>Upload a jewelry product image to generate your virtual model</span>
                  ) : (
                    <span className="text-[#1E7748] font-medium">
                      ✓ Product photo ready • AI Model persona configured
                    </span>
                  )
                ) : !modelState.isValid && !jewelryState.isValid ? (
                  <span>Upload both references to enable generation</span>
                ) : !modelState.isValid ? (
                  <span>Upload a valid human model image</span>
                ) : !jewelryState.isValid ? (
                  <span>Upload a valid jewelry product image</span>
                ) : (
                  <span className="text-[#1E7748] font-medium">
                    ✓ Both references validated &amp; ready
                  </span>
                )}
              </div>

              <Button
                variant="primary"
                size="lg"
                disabled={!canGenerate}
                isLoading={isGenerating}
                onClick={handleGenerate}
                className="w-full sm:w-auto px-8 h-12 bg-gradient-to-r from-[#1A1816] to-[#2B2621] text-white shadow-md hover:shadow-lg transition-all"
              >
                <Sparkles className="w-4 h-4 mr-2 text-[#D8B77E]" />
                <span>
                  {isAiModelMode
                    ? "Generate Virtual Model Try-On"
                    : "Generate Virtual Try-On"}
                </span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        <div ref={resultRef}>
          {result && (
            <ResultSection
              result={result}
              onRegenerate={handleRegenerate}
              isRegenerating={isGenerating}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-[#EBE5DC] bg-white/70 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#7A736B]">
          <p>© {new Date().getFullYear()} JEWELAI. Production AI Jewelry Virtual Try-On Platform.</p>
          <div className="flex items-center gap-4 text-[#7A736B]">
            <span>Model Identity Lock</span>
            <span>•</span>
            <span>AI Virtual Model Studio</span>
            <span>•</span>
            <span>Commercial E-commerce Export</span>
          </div>
        </div>
      </footer>

      {/* Category / Anatomical Mismatch Modal Popup */}
      <Modal
        isOpen={mismatchModalData.isOpen}
        onClose={() => setMismatchModalData({ isOpen: false, message: "", suggestedCategories: [] })}
        title="Category Selection Mismatch"
        description="Our AI Vision Analysis detected an anatomical placement conflict"
        maxWidth="md"
      >
        <div className="space-y-4 text-xs">
          <div className="p-4 rounded-2xl bg-[#FFF8F2] border border-[#F2D7BD] flex items-start gap-3 text-[#8A4A1C]">
            <AlertTriangle className="w-5 h-5 shrink-0 text-[#C96826] mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold text-sm text-[#1A1715]">Anatomical Conflict Detected</p>
              <p className="text-[#6D401C] leading-relaxed">{mismatchModalData.message}</p>
            </div>
          </div>

          <p className="text-[#7A736B] leading-relaxed">
            To generate a realistic virtual try-on, the visible body region in your model photo must match the jewelry item and selected category.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-end gap-2.5">
            {mismatchModalData.suggestedCategories.map((catId) => {
              const catName = JEWELRY_CATEGORIES.find((c) => c.id === catId)?.name || catId;
              return (
                <Button
                  key={catId}
                  variant="gold"
                  size="sm"
                  onClick={() => handleSwitchCategory(catId)}
                  className="flex items-center gap-1.5"
                >
                  <span>Switch to {catName}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              );
            })}

            <Button
              variant="outline"
              size="sm"
              onClick={() => setMismatchModalData({ isOpen: false, message: "", suggestedCategories: [] })}
            >
              Choose Manually
            </Button>
          </div>
        </div>
      </Modal>

      {/* History Modal */}
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* Membership Upgrade Modal */}
      <MembershipUpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        reason={upgradeReason}
      />
    </div>
  );
}

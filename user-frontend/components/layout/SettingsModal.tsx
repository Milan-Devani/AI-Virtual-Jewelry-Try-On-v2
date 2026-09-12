import * as React from "react";
import { Modal } from "../ui/dialog";
import { Sparkles, Shield, Server, CheckCircle2 } from "lucide-react";
import { Button } from "../ui/button";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Platform Settings & Architecture"
      description="Overview of configured neural model parameters, security safeguards, and storage"
      maxWidth="lg"
    >
      <div className="space-y-4 text-xs text-[#524B43]">
        {/* Model info */}
        <div className="p-4 rounded-2xl bg-[#FCFAF7] border border-[#EBE3D7] space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#1A1715]">
            <Sparkles className="w-4 h-4 text-[#B38541]" />
            <span>AI Neural Try-On Model</span>
          </div>
          <p className="text-[#7A7165]">
            Configured engine: <strong className="text-[#1A1715]">Gemini 2.5 Flash / Flash-Exp Multimodal</strong> with fallback to Imagen 3.
          </p>
          <div className="flex items-center gap-2 text-[#1E7748] font-medium pt-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Model Identity Lock &amp; Geometry Preservation Active</span>
          </div>
        </div>

        {/* Security info */}
        <div className="p-4 rounded-2xl bg-[#FCFAF7] border border-[#EBE3D7] space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#1A1715]">
            <Shield className="w-4 h-4 text-[#B38541]" />
            <span>Security &amp; Data Validation</span>
          </div>
          <ul className="space-y-1 list-disc list-inside text-[#7A7165]">
            <li>Magic Byte File Signature Inspection (JPEG, PNG, WebP)</li>
            <li>Zero frontend API key exposure (backend proxy architecture)</li>
            <li>Express Rate Limiting (100 req/15m general, 20 req/10m AI try-on)</li>
            <li>UUID sanitization for all temporary and permanent assets</li>
          </ul>
        </div>

        {/* Storage */}
        <div className="p-4 rounded-2xl bg-[#FCFAF7] border border-[#EBE3D7] space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#1A1715]">
            <Server className="w-4 h-4 text-[#B38541]" />
            <span>Storage &amp; Persistence</span>
          </div>
          <p className="text-[#7A7165]">
            Configured storage provider: <strong className="text-[#1A1715]">Local / Supabase / AWS S3</strong> compatible with automatic fallback.
          </p>
        </div>

        <div className="pt-2 flex justify-end">
          <Button variant="primary" size="sm" onClick={onClose}>
            Close Settings
          </Button>
        </div>
      </div>
    </Modal>
  );
}

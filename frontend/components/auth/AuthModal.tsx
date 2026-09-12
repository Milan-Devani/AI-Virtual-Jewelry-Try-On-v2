"use client";

import * as React from "react";
import { Modal } from "../ui/dialog";
import { Button } from "../ui/button";
import { loginApi, registerApi } from "../../services/api";
import { toast } from "sonner";
import { Sparkles, Mail, Lock, User, Loader2 } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: any) => void;
}

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [isRegister, setIsRegister] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [name, setName] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      setIsLoading(true);
      let data;
      if (isRegister) {
        data = await registerApi({ email, password, name });
        toast.success("Account created successfully!");
      } else {
        data = await loginApi({ email, password });
        toast.success("Welcome back to JEWELAI!");
      }
      onSuccess(data.user);
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Authentication failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isRegister ? "Create JEWELAI Account" : "Sign In to JEWELAI"}
      description={
        isRegister
          ? "Join luxury jewelry brands and stylists generating hyper-realistic virtual try-ons."
          : "Access your membership credits, try-on studio, and payment history."
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        {isRegister && (
          <div>
            <label className="block text-xs font-semibold text-[#5A534B] uppercase tracking-wider mb-1.5">
              Full Name / Studio Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#8C827A] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="e.g. Royal Jewels Studio"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-white border border-[#E2DBD1] text-sm text-[#2A2622] placeholder:text-[#A89F95] focus:outline-none focus:ring-2 focus:ring-[#D8B77E]"
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-[#5A534B] uppercase tracking-wider mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-[#8C827A] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              placeholder="you@jewelrybrand.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-white border border-[#E2DBD1] text-sm text-[#2A2622] placeholder:text-[#A89F95] focus:outline-none focus:ring-2 focus:ring-[#D8B77E]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#5A534B] uppercase tracking-wider mb-1.5">
            Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-[#8C827A] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-white border border-[#E2DBD1] text-sm text-[#2A2622] placeholder:text-[#A89F95] focus:outline-none focus:ring-2 focus:ring-[#D8B77E]"
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#1A1715] hover:bg-[#2A2622] text-[#FBF9F5] py-2.5 font-medium flex items-center justify-center gap-2 mt-4"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-[#D8B77E]" />
              <span>{isRegister ? "Create Free Account" : "Sign In"}</span>
            </>
          )}
        </Button>

        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            className="text-xs text-[#8C6428] hover:underline font-medium"
          >
            {isRegister
              ? "Already have an account? Sign in here"
              : "Don't have an account? Create one"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

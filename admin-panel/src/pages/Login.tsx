import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLoginApi } from "../services/api";
import { Sparkles, Lock, Mail, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@jewelai.com");
  const [password, setPassword] = useState("Admin@2026");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter your admin credentials.");
      return;
    }

    try {
      setLoading(true);
      await adminLoginApi(email, password);
      toast.success("Welcome, Administrator!");
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Failed to authenticate administrator.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#0F172A] border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6 relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-amber-600/10 rounded-full blur-3xl" />

        <div className="text-center space-y-2 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-bold mx-auto shadow-lg shadow-amber-500/20 mb-3">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="font-serif text-2xl font-bold tracking-wide text-slate-100">
            JEWELAI Administrator Portal
          </h1>
          <p className="text-xs text-slate-400">
            Secure administrative control & UPI payment verification
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 relative z-10 text-xs">
          <div>
            <label className="block font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Admin Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@jewelai.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Admin Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all mt-4 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Sign In as Admin</span>
              </>
            )}
          </button>
        </form>

        <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-[11px] text-slate-400 text-center relative z-10">
          Default seed credentials: <strong className="text-amber-400">admin@jewelai.com</strong> /{" "}
          <strong className="text-amber-400">Admin@2026</strong>
        </div>
      </div>
    </div>
  );
};

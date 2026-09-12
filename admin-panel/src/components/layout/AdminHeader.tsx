import React from "react";
import { ShieldCheck, Bell } from "lucide-react";

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ title, subtitle }) => {
  return (
    <header className="h-18 px-8 border-b border-slate-800/80 bg-[#0F172A]/80 backdrop-blur-md flex items-center justify-between sticky top-0 z-30">
      <div>
        <h1 className="font-serif text-xl font-bold text-slate-100">{title}</h1>
        {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/80 text-xs font-semibold text-amber-400">
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <span>Admin Workspace • Port 3001</span>
        </div>
      </div>
    </header>
  );
};

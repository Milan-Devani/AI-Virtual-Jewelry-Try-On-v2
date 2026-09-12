import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  CheckSquare,
  CreditCard,
  Layers,
  BarChart3,
  ShieldAlert,
  LogOut,
  Sparkles,
} from "lucide-react";
import { clearAdminToken, getPendingVerificationsApi } from "../../services/api";

export const AdminSidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [pendingCount, setPendingCount] = useState<number>(0);

  useEffect(() => {
    getPendingVerificationsApi()
      .then((data) => setPendingCount(data?.length || 0))
      .catch(() => {});
  }, [location.pathname]);

  const navItems = [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "Users & Plans", path: "/users", icon: Users },
    {
      label: "Payment Verifications",
      path: "/payments/verifications",
      icon: CheckSquare,
      badge: pendingCount > 0 ? pendingCount : null,
    },
    { label: "Payment History", path: "/payments", icon: CreditCard },
    { label: "Membership Plans", path: "/plans", icon: Layers },
    { label: "Usage Analytics", path: "/usage", icon: BarChart3 },
    { label: "Audit Logs", path: "/audit", icon: ShieldAlert },
  ];

  const handleLogout = () => {
    clearAdminToken();
    navigate("/login");
  };

  return (
    <aside className="w-64 bg-[#0F172A] border-r border-slate-800 flex flex-col justify-between shrink-0 h-screen sticky top-0">
      <div>
        {/* Brand Header */}
        <div className="p-6 flex items-center gap-3 border-b border-slate-800/80">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-amber-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="font-serif text-lg font-bold tracking-wider text-slate-100 flex items-center gap-1.5">
              JEWELAI
              <span className="text-[9px] font-sans font-extrabold uppercase px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-400 border border-amber-400/30">
                ADMIN
              </span>
            </span>
            <p className="text-[11px] text-slate-400">Virtual Try-On Management</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1.5">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                  isActive
                    ? "bg-amber-500/10 text-amber-400 border border-amber-500/30 font-bold"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? "text-amber-400" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge !== null && item.badge !== undefined && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500 text-slate-950">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Admin Footer & Logout */}
      <div className="p-4 border-t border-slate-800/80">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out Admin</span>
        </button>
      </div>
    </aside>
  );
};

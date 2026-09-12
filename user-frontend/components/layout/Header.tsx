"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, History, Settings, User, LogOut, CreditCard, LayoutDashboard, Wand2 } from "lucide-react";
import { Button } from "../ui/button";
import { AuthModal } from "../auth/AuthModal";
import { getMeApi, clearAuthToken, getAuthToken } from "../../services/api";

interface HeaderProps {
  onOpenHistory?: () => void;
  onOpenSettings?: () => void;
}

export function Header({ onOpenHistory, onOpenSettings }: HeaderProps) {
  const pathname = usePathname();
  const [isAuthOpen, setIsAuthOpen] = React.useState(false);
  const [user, setUser] = React.useState<any>(null);
  const [membership, setMembership] = React.useState<any>(null);

  const loadUser = React.useCallback(async () => {
    if (getAuthToken()) {
      try {
        const data = await getMeApi();
        if (data) {
          setUser(data.user);
          setMembership(data.membership);
        }
      } catch {
        setUser(null);
        setMembership(null);
      }
    } else {
      setUser(null);
      setMembership(null);
    }
  }, []);

  React.useEffect(() => {
    loadUser();
  }, [loadUser, pathname]);

  const handleLogout = () => {
    clearAuthToken();
    setUser(null);
    setMembership(null);
    window.location.reload();
  };

  const navLinks = [
    { label: "Studio", href: "/", icon: Wand2 },
    { label: "Pricing", href: "/pricing", icon: CreditCard },
    { label: "UPI Payments", href: "/payments", icon: CreditCard },
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-[#EBE5DC]/80 bg-[#FBF9F5]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Brand Logo & Nav */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2A2622] to-[#121110] flex items-center justify-center text-[#D8B77E] shadow-sm border border-[#3E3832] group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-serif text-xl tracking-wider font-bold text-[#1A1715]">
                    JEWELAI
                  </span>
                  <span className="text-[10px] uppercase tracking-widest font-semibold px-2 py-0.5 rounded-full bg-[#F4EFE7] text-[#8C6428] border border-[#E8DFC9]">
                    PRO
                  </span>
                </div>
                <p className="text-[11px] text-[#7A736B] tracking-tight hidden sm:block">
                  AI Virtual Jewelry Try-On
                </p>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 pl-4 border-l border-[#EBE5DC]">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-colors ${
                      isActive
                        ? "bg-[#1A1715] text-[#FBF9F5]"
                        : "text-[#6B645D] hover:text-[#1A1715] hover:bg-[#F4EFE7]"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* User Status & Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Membership Pill */}
            {membership?.isActive ? (
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-[#ECFDF5] border border-[#A7F3D0] rounded-full text-xs font-semibold text-[#065F46]">
                <Sparkles className="w-3.5 h-3.5 text-[#059669]" />
                <span>{membership.remainingCredits} Credits</span>
              </div>
            ) : (
              <Link href="/pricing" className="hidden sm:block">
                <div className="px-3 py-1 bg-[#FFFBEB] border border-[#FDE68A] rounded-full text-xs font-semibold text-[#92400E] hover:bg-[#FEF3C7] transition-colors">
                  Upgrade to Generate
                </div>
              </Link>
            )}

            {onOpenHistory && (
              <Button
                variant="outline"
                size="sm"
                onClick={onOpenHistory}
                className="flex items-center gap-2 border-[#E2DBD1] hover:bg-[#F4EFE7]"
              >
                <History className="w-4 h-4 text-[#7A736B]" />
                <span className="hidden sm:inline">History</span>
              </Button>
            )}

            {onOpenSettings && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onOpenSettings}
                className="p-2 sm:px-3 flex items-center gap-2 text-[#6B645D]"
                aria-label="Settings"
              >
                <Settings className="w-4 h-4" />
              </Button>
            )}

            {/* Auth Button */}
            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-[#EBE5DC]">
                <div className="flex flex-col text-right hidden lg:block">
                  <span className="text-xs font-bold text-[#1A1715] truncate max-w-[120px]">
                    {user.name || user.email}
                  </span>
                  <span className="text-[10px] text-[#7A736B] uppercase tracking-wider">
                    {membership?.plan?.name || "Free Explorer"}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="p-2 sm:px-2.5 text-[#DC2626] border-[#FCA5A5] hover:bg-[#FEF2F2]"
                  title="Log out"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Button
                size="sm"
                onClick={() => setIsAuthOpen(true)}
                className="bg-[#1A1715] hover:bg-[#2A2622] text-[#FBF9F5] text-xs font-semibold px-4"
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </header>

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={(u) => {
          setUser(u);
          loadUser();
        }}
      />
    </>
  );
}

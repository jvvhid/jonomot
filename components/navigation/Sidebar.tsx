"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { handleCitizenLogout } from "@/lib/supabase";
import {
  Home,
  Building2,
  MessageSquare,
  Trophy,
  FileText,
  Bell,
  User,
  Settings,
  HelpCircle,
  ShieldCheck,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Globe,
} from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

interface SidebarProps {
  isMinimized?: boolean;
  onToggleMinimize?: () => void;
}

export function Sidebar({
  isMinimized = false,
  onToggleMinimize,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { language, toggleLanguage, t } = useLanguage();

  const isCurrent = (path: string) => pathname === path;

  return (
    <aside
      className={`bg-gradient-to-b from-[#003527] via-[#064e3b] to-[#043d2e] text-white border-r border-emerald-800/80 h-full flex flex-col z-20 shadow-xl shrink-0 transition-all duration-300 ${
        isMinimized ? "w-20" : "w-64"
      }`}
    >
      {/* Logo & Minimize Toggle Header */}
      <div className="p-5 flex items-center justify-between border-b border-emerald-800/60">
        <div className="flex items-center gap-3 overflow-hidden">
          <img
            src="/images/mainlogo.png"
            alt="Jonomot Logo"
            className="w-10 h-10 object-contain shrink-0 drop-shadow-md"
          />
          {!isMinimized && (
            <div className="truncate">
              <h1 className="text-xl font-extrabold text-white leading-tight tracking-tight truncate">
                {t("জনমত", "jonomot")}
              </h1>
              <p className="text-[10px] text-emerald-200 font-semibold truncate">
                {t("জনতার মত জনতার জন্য", "Bangladesh Civic Platform")}
              </p>
            </div>
          )}
        </div>

        {onToggleMinimize && (
          <button
            onClick={onToggleMinimize}
            className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-white/10 transition-colors shrink-0"
            title={isMinimized ? "Expand Sidebar" : "Minimize Sidebar"}
          >
            {isMinimized ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </button>
        )}
      </div>

      {/* Language Switcher Bar */}
      <div className="px-4 pt-3 pb-1">
        <button
          onClick={toggleLanguage}
          className={`w-full py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-bold text-emerald-100 hover:text-white flex items-center ${
            isMinimized ? "justify-center" : "justify-between"
          } transition-all shadow-sm`}
          title="Toggle Language EN / BN"
        >
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-emerald-300 shrink-0" />
            {!isMinimized && <span>{t("ভাষা পরিবর্তন", "Language")}</span>}
          </div>
          {!isMinimized && (
            <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] font-extrabold">
              {language === "BN" ? "বাংলা (BN)" : "ENGLISH (EN)"}
            </span>
          )}
        </button>
      </div>

      {/* Navigation Links - Rich Green with White Texts */}
      <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
        <Link
          href="/"
          title={t("হোম", "Home")}
          className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold transition-all ${
            isCurrent("/")
              ? "bg-white/20 text-white shadow-sm border border-white/25"
              : "text-emerald-100 hover:bg-white/10 hover:text-white"
          }`}
        >
          <Home className="w-5 h-5 text-current shrink-0" />
          {!isMinimized && <span>{t("হোম", "Home")}</span>}
        </Link>

        <Link
          href="/#directory"
          title={t("প্রতিষ্ঠানসমূহ", "Institutions")}
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-emerald-100 hover:bg-white/10 hover:text-white transition-colors"
        >
          <Building2 className="w-5 h-5 text-emerald-300 shrink-0" />
          {!isMinimized && <span>{t("প্রতিষ্ঠানসমূহ", "Institutions")}</span>}
        </Link>

        <Link
          href="/feed"
          title={t("পাবলিক ফিড", "Public Feed")}
          className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold transition-all ${
            isCurrent("/feed")
              ? "bg-white/20 text-white shadow-sm border border-white/25"
              : "text-emerald-100 hover:bg-white/10 hover:text-white"
          }`}
        >
          <MessageSquare className="w-5 h-5 text-emerald-300 shrink-0" />
          {!isMinimized && <span>{t("পাবলিক ফিড", "Public Feed")}</span>}
        </Link>

        <Link
          href="/leaderboard"
          title={t("লিডারবোর্ড", "Leaderboard")}
          className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold transition-all ${
            isCurrent("/leaderboard")
              ? "bg-white/20 text-white shadow-sm border border-white/25"
              : "text-emerald-100 hover:bg-white/10 hover:text-white"
          }`}
        >
          <Trophy className="w-5 h-5 text-emerald-300 shrink-0" />
          {!isMinimized && <span>{t("লিডারবোর্ড", "Leaderboard")}</span>}
        </Link>

        {!isMinimized && (
          <div className="pt-5 pb-2">
            <p className="px-3.5 text-[10px] font-extrabold text-emerald-300/80 uppercase tracking-wider">
              {t("আমার কার্যক্রম", "MY ACTIVITY")}
            </p>
          </div>
        )}

        <Link
          href="/profile"
          title={t("আমার রিপোর্ট", "My Reports")}
          className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold transition-all ${
            isCurrent("/profile")
              ? "bg-white/20 text-white shadow-sm border border-white/25"
              : "text-emerald-100 hover:bg-white/10 hover:text-white"
          }`}
        >
          <FileText className="w-5 h-5 text-emerald-300 shrink-0" />
          {!isMinimized && <span>{t("আমার রিপোর্ট", "My Reports")}</span>}
        </Link>
      </nav>

      {/* Bottom Actions */}
      <div className="p-3 border-t border-emerald-800/60 space-y-1.5">
        <Link
          href="/profile"
          title={t("প্রোফাইল", "Profile")}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-emerald-100 hover:bg-white/10 hover:text-white transition-colors text-sm font-semibold"
        >
          <User className="w-4 h-4 text-emerald-300 shrink-0" />
          {!isMinimized && <span>{t("প্রোফাইল", "Profile")}</span>}
        </Link>

        <Link
          href="/profile"
          title={t("সেটিংস", "Settings")}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-emerald-100 hover:bg-white/10 hover:text-white transition-colors text-sm font-semibold"
        >
          <Settings className="w-4 h-4 text-emerald-300 shrink-0" />
          {!isMinimized && <span>{t("সেটিংস", "Settings")}</span>}
        </Link>

        <Link
          href="/help"
          title={t("সহায়তা ও সাপোর্ট", "Help & Support")}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-emerald-100 hover:bg-white/10 hover:text-white transition-colors text-sm font-semibold"
        >
          <HelpCircle className="w-4 h-4 text-emerald-300 shrink-0" />
          {!isMinimized && <span>{t("সহায়তা ও সাপোর্ট", "Help & Support")}</span>}
        </Link>

        {/* Report CTA */}
        <div className="pt-2">
          <Link href="/report/new" className="block w-full">
            <button
              title={t("অভিজ্ঞতা রিপোর্ট করুন", "Submit Report")}
              className={`w-full flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-[#003527] py-2.5 rounded-xl font-extrabold transition-all shadow-md active:scale-95 text-xs ${
                isMinimized ? "px-2" : "px-4"
              }`}
            >
              <ShieldAlert className="w-4 h-4 shrink-0" />
              {!isMinimized && <span>{t("রিপোর্ট করুন", "Report Experience")}</span>}
            </button>
          </Link>
        </div>

        {/* Logout Option */}
        <div className="pt-1">
          <button
            onClick={() => handleCitizenLogout(router)}
            title={t("লগআউট", "Logout")}
            className={`w-full flex items-center justify-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-200 hover:text-white py-2 rounded-xl font-bold transition-all border border-red-400/30 text-xs ${
              isMinimized ? "px-2" : "px-3"
            }`}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!isMinimized && <span>{t("লগআউট (Logout)", "Logout")}</span>}
          </button>
        </div>

        {/* Admin Portal Link */}
        <div className="pt-2 border-t border-emerald-800/50 flex items-center justify-center">
          <Link
            href="/admin"
            className="text-[10px] text-emerald-300 hover:text-white font-bold flex items-center gap-1 transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            {!isMinimized && <span>{t("অ্যাডমিন পোর্টাল", "Admin Portal")}</span>}
          </Link>
        </div>
      </div>
    </aside>
  );
}

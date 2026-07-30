"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { INITIAL_REPORTS, INSTITUTIONS } from "@/lib/mockData";
import { Button } from "@/components/common/Button";
import { Badge } from "@/components/common/Badge";
import {
  Shield,
  CheckCircle,
  XCircle,
  AlertOctagon,
  ArrowLeft,
  Users,
  FileCheck,
  Building,
  Lock,
  KeyRound,
  Check,
  Plus,
  Clock,
  LogOut,
  Search,
  Filter,
  BarChart3,
} from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

interface PendingInstItem {
  id: string;
  nameEn: string;
  nameBn: string;
  category: string;
  address: string;
  status: string;
  reportTitle?: string;
  reportDesc?: string;
  mapUrl?: string;
  createdAt?: string;
  userName?: string;
  userId?: string;
  submittedBy?: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminUser, setAdminUser] = useState("");
  const [adminPass, setAdminPass] = useState("");
  const [loginError, setLoginError] = useState(false);

  const [activeTab, setActiveTab] = useState<"REPORTS" | "INSTITUTIONS">("INSTITUTIONS");
  const [reports, setReports] = useState(INITIAL_REPORTS);
  const [filter, setFilter] = useState<"ALL" | "APPROVED" | "PENDING" | "REJECTED">("ALL");
  const [searchReportQuery, setSearchReportQuery] = useState("");
  const [toastMsg, setToastMsg] = useState("");

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3500);
  };

  const [pendingInstitutions, setPendingInstitutions] = useState<PendingInstItem[]>([
    {
      id: "pending-demo-1",
      nameEn: "Sub-Registrar Office, Mirpur",
      nameBn: "সাব-রেজিস্ট্রার অফিস, মিরপুর",
      category: "Municipal & City Services",
      address: "Mirpur-10, Dhaka",
      status: "PENDING",
      reportTitle: "দলিল রেজিস্ট্রেশনে দালাল ছাড়া সরাসরি কাজ সম্ভব হয়েছে",
      reportDesc: "সকাল ১০টায় গিয়ে সব প্রয়োজনীয় কাগজপত্র জমা দেওয়ার পর দুপুর ২টার মধ্যে কাজ সম্পন্ন হয়।",
      mapUrl: "Sub-Registrar Office Mirpur 10 Dhaka",
      createdAt: "Today",
    },
    {
      id: "pending-demo-2",
      nameEn: "BRTA Circle-4 (Ashulia)",
      nameBn: "বিআরটিএ সার্কেল-৪ (আশুলিয়া)",
      category: "Transportation & License",
      address: "Ashulia, Dhaka",
      status: "PENDING",
      reportTitle: "ফিটনেস শাখা বেশ পরিপাটি ও নিয়মতান্ত্রিক",
      reportDesc: "লম্বা লাইন ছিল তবে সিরিয়াল অনুযায়ী দ্রুত কাজ হয়েছে।",
      createdAt: "Yesterday",
    },
  ]);

  // Load any pending institutions submitted by user from localStorage
  useEffect(() => {
    fetch("/api/reports")
      .then((res) => res.json())
      .then((data) => {
        const list = data?.reports || data?.data;
        if (list && Array.isArray(list)) {
          setReports(list);
        }
      })
      .catch(() => {});

    const saved = localStorage.getItem("jonomot_pending_institutions");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setPendingInstitutions((prev) => {
            const ids = new Set(prev.map((i) => i.id));
            const newItems = parsed.filter((i) => !ids.has(i.id));
            return [...newItems, ...prev];
          });
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      (adminUser === "admin" || adminUser === "admin@jonomot.com" || adminUser === "admin@jonomot.gov.bd") &&
      (adminPass === "admin" || adminPass === "jonomot2026")
    ) {
      setIsAdminLoggedIn(true);
      setLoginError(false);
      showToast("✅ অ্যাডমিন হিসেবে সফলভাবে প্রবেশ করেছেন (Logged in as Admin)");
    } else {
      setLoginError(true);
    }
  };

  const handleVerifyToggle = async (id: string) => {
    const report = reports.find((r) => r.id === id);
    const nextVerified = !report?.verified;
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, verified: nextVerified } : r))
    );
    showToast(
      nextVerified
        ? "✅ রিপোর্ট ভিজিট যাচাইকৃত (Visit Verified) করা হয়েছে!"
        : "ℹ️ রিপোর্ট ভিজিট ভেরিফিকেশন সরানো হয়েছে।"
    );
    await fetch("/api/reports", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        action: "status",
        status: report?.status || "APPROVED",
        verified: nextVerified,
      }),
    }).catch(() => {});
  };

  const handleStatusChange = async (
    id: string,
    newStatus: "APPROVED" | "PENDING" | "REJECTED"
  ) => {
    const updated = reports.map((r) => (r.id === id ? { ...r, status: newStatus } : r));
    setReports(updated);
    showToast(`🔄 রিপোর্ট স্ট্যাটাস পরিবর্তন: ${newStatus}`);

    try {
      const existingStr = localStorage.getItem("jonomot_submitted_reports") || "[]";
      const existing: any[] = JSON.parse(existingStr);
      const targetReport = updated.find((r) => r.id === id);
      if (targetReport) {
        const remaining = existing.filter((r) => r.id !== id);
        if (newStatus === "APPROVED") {
          localStorage.setItem(
            "jonomot_submitted_reports",
            JSON.stringify([targetReport, ...remaining])
          );
        } else {
          localStorage.setItem(
            "jonomot_submitted_reports",
            JSON.stringify(remaining)
          );
        }
      }
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("jonomot_admin_approved"));
      }
    } catch {}

    await fetch("/api/reports", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        action: "status",
        status: newStatus,
      }),
    }).catch(() => {});
  };

  const handleDeleteReport = async (id: string) => {
    setReports((prev) => prev.filter((r) => r.id !== id));
    showToast("🗑️ রিপোর্টটি ডেটাবেজ থেকে মুছে ফেলা হয়েছে।");
    try {
      const existingStr = localStorage.getItem("jonomot_submitted_reports") || "[]";
      const existing: any[] = JSON.parse(existingStr);
      localStorage.setItem(
        "jonomot_submitted_reports",
        JSON.stringify(existing.filter((r) => r.id !== id))
      );
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("jonomot_admin_approved"));
      }
    } catch {}
    await fetch(`/api/reports?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    }).catch(() => {});
  };

  const handleApproveInstitution = async (item: PendingInstItem) => {
    // Remove from pending list
    setPendingInstitutions((prev) => prev.filter((i) => i.id !== item.id));

    // Also remove from localStorage pending list if present
    const saved = localStorage.getItem("jonomot_pending_institutions");
    if (saved) {
      const parsed = JSON.parse(saved);
      const remaining = parsed.filter((i: any) => i.id !== item.id);
      localStorage.setItem("jonomot_pending_institutions", JSON.stringify(remaining));
    }

    const approvedInst = {
      id: item.id,
      name: item.nameEn || "Verified Office",
      nameBn: item.nameBn || item.nameEn,
      address: item.address,
      category: item.category || "Municipal & City Services",
      division: "Dhaka",
      district: "Dhaka",
      trustScore: 4.0,
      jonomotRating: 75,
      hours: "Sun-Thu 9:00 AM-4:00 PM, Fri-Sat Closed",
      contact: "+880 1700-000000",
      imageUrl: "/prelilogin.png",
      reportCount: 0,
      featured: false,
      aiSummary: "নাগরিকদের দ্বারা নতুন যুক্ত ও যাচাইকৃত সরকারি প্রতিষ্ঠান।",
      busyHoursNote: "সাধারণত সকাল ১০টা থেকে দুপুর ১টা পর্যন্ত ভিড় থাকে।",
      verified: true,
    };

    // Save to permanent approved institutions storage so it appears on both Home Dashboard and Leaderboard
    try {
      const existingApproved = JSON.parse(
        localStorage.getItem("jonomot_approved_institutions") || "[]"
      );
      localStorage.setItem(
        "jonomot_approved_institutions",
        JSON.stringify([approvedInst, ...existingApproved.filter((i: any) => i.id !== item.id)])
      );
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("jonomot_institutions_updated"));
        window.dispatchEvent(new Event("jonomot_admin_approved"));
      }
    } catch {}

    // Call Supabase API to permanently verify and publish institution
    try {
      await fetch("/api/admin/verify-institution", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id, action: "approve" }),
      });
      await fetch("/api/institutions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: item.id,
          name: item.nameEn || "Verified Office",
          nameBn: item.nameBn || item.nameEn,
          category: item.category,
          address: item.address,
          googleMapUrl: item.mapUrl || "",
          isAdmin: true,
        }),
      });
    } catch (err) {
      console.warn("Supabase sync warning:", err);
    }

    showToast(
      t(
        `✅ "${item.nameBn}" প্রতিষ্ঠানটি যাচাইকৃত ও মোট প্রতিষ্ঠানের তালিকায় যুক্ত হয়েছে!`,
        `✅ Verified "${item.nameEn}" and added to all institutions & leaderboard!`
      )
    );
  };

  const handleRejectInstitution = async (id: string) => {
    setPendingInstitutions((prev) => prev.filter((i) => i.id !== id));
    try {
      await fetch("/api/admin/verify-institution", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action: "reject" }),
      });
    } catch (err) {
      console.warn("Supabase reject warning:", err);
    }
    showToast(t("❌ প্রতিষ্ঠানটির ভেরিফিকেশন বাতিল করা হয়েছে।", "❌ Institution rejected."));
  };

  const filteredReports = reports.filter((r) => {
    if (filter !== "ALL" && r.status !== filter) return false;
    if (!searchReportQuery.trim()) return true;
    const q = searchReportQuery.toLowerCase();
    return (
      (r.userName && r.userName.toLowerCase().includes(q)) ||
      (r.institutionName && r.institutionName.toLowerCase().includes(q)) ||
      (r.title && r.title.toLowerCase().includes(q)) ||
      (r.civicTag && r.civicTag.toLowerCase().includes(q))
    );
  });

  // SECURE ADMIN LOGIN SCREEN
  if (!isAdminLoggedIn) {
    return (
      <div className="w-full max-w-md mx-auto px-4 py-16">
        <div className="bg-white border-2 border-[#003527]/30 rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
          <img
            src="/images/mainlogo.png"
            alt="Jonomot Logo"
            className="w-16 h-16 object-contain mx-auto mb-4 drop-shadow-md"
          />

          <div className="text-center space-y-1 mb-6">
            <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
              {t("অ্যাডমিন ও মডারেটর লগইন", "Admin / Moderator Portal")}
            </h2>
            <p className="text-xs text-gray-500 font-medium">
              {t(
                "শুধুমাত্র অনুমোদিত সরকারি মডারেটরদের জন্য সংরক্ষিত",
                "Restricted access for verified jonomot administrators"
              )}
            </p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                {t("অ্যাডমিন ইউজারনেম / ইমেইল", "Admin Username / Email")}
              </label>
              <input
                type="text"
                required
                placeholder="e.g. admin or admin@jonomot.com"
                value={adminUser}
                onChange={(e) => {
                  setAdminUser(e.target.value);
                  setLoginError(false);
                }}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003527] text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                {t("পাসওয়ার্ড (Password)", "Password")}
              </label>
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={adminPass}
                onChange={(e) => {
                  setAdminPass(e.target.value);
                  setLoginError(false);
                }}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003527] text-sm"
              />
            </div>

            {loginError && (
              <p className="text-xs text-red-600 font-bold bg-red-50 p-2.5 rounded-lg border border-red-200">
                {t(
                  "ভুল ইউজারনেম বা পাসওয়ার্ড!",
                  "Invalid admin credentials!"
                )}
              </p>
            )}

            <Button
              type="submit"
              variant="primary"
              className="w-full py-3.5 font-extrabold bg-[#003527] hover:bg-[#064e3b]"
            >
              {t("প্রবেশ করুন (Secure Login)", "Secure Admin Login")}
            </Button>
          </form>

          <div className="pt-6 border-t border-gray-100 mt-6 text-center space-y-3">
            <Link
              href="/"
              className="text-xs text-gray-400 hover:text-gray-600 inline-block"
            >
              {t("← হোম ড্যাশবোর্ডে ফিরুন", "← Return to Citizen Dashboard")}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-brand-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t("হোম ড্যাশবোর্ডে ফিরুন", "Back to Home Dashboard")}</span>
        </Link>

        <button
          onClick={() => {
            setIsAdminLoggedIn(false);
            router.push("/");
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold border border-red-200 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>{t("অ্যাডমিন লগআউট", "Admin Logout")}</span>
        </button>
      </div>

      {/* Admin Header */}
      <div className="bg-gradient-to-r from-[#003527] to-[#064e3b] text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-xl bg-white/10 text-emerald-300">
              <Shield className="w-6 h-6" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {t("সিভিক মডারেশন ও ভেরিফিকেশন পোর্টাল", "Civic Moderation Portal")}
            </h1>
          </div>
          <p className="text-sm text-emerald-100">
            {t(
              "নাগরিকদের রিপোর্ট যাচাই করুন এবং নতুন প্রতিষ্ঠান ভেরিফাই করে মূল ডেটাবেজে যুক্ত করুন।",
              "Verify unlisted institutions and moderate citizen experience reports."
            )}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="primary" className="py-1 px-3 text-xs bg-white text-[#003527] font-bold">
            {t("অ্যাডমিন স্ট্যাটাস: সক্রিয়", "Admin Access: Active")}
          </Badge>
        </div>
      </div>

      {/* Floating Toast Notification */}
      {toastMsg && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-900/95 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-emerald-500 flex items-center gap-3 text-xs font-bold animate-bounce">
          <span>{toastMsg}</span>
        </div>
      )}

      {/* 4 Executive Metric Cards Banner (Always visible across tabs) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-brand-outline rounded-2xl p-5 flex items-center gap-4 shadow-xs">
          <span className="p-3 rounded-2xl bg-brand-primary/10 text-brand-primary shrink-0">
            <FileCheck className="w-6 h-6" />
          </span>
          <div>
            <p className="text-xs font-semibold text-brand-on-surface-variant">
              {t("মোট নাগরিক রিপোর্ট", "Total Submissions")}
            </p>
            <p className="text-2xl font-extrabold text-brand-on-surface">
              {reports.length}
            </p>
          </div>
        </div>

        <div className="bg-white border border-brand-outline rounded-2xl p-5 flex items-center gap-4 shadow-xs">
          <span className="p-3 rounded-2xl bg-emerald-50 text-emerald-600 shrink-0">
            <CheckCircle className="w-6 h-6" />
          </span>
          <div>
            <p className="text-xs font-semibold text-brand-on-surface-variant">
              {t("যাচাইকৃত রিপোর্ট", "Verified Visits")}
            </p>
            <p className="text-2xl font-extrabold text-brand-on-surface">
              {reports.filter((r) => r.verified).length}
            </p>
          </div>
        </div>

        <div className="bg-white border border-brand-outline rounded-2xl p-5 flex items-center gap-4 shadow-xs">
          <span className="p-3 rounded-2xl bg-amber-50 text-amber-600 shrink-0">
            <Clock className="w-6 h-6" />
          </span>
          <div>
            <p className="text-xs font-semibold text-brand-on-surface-variant">
              {t("অপেক্ষমাণ নতুন অফিস", "Pending Queue")}
            </p>
            <p className="text-2xl font-extrabold text-brand-on-surface">
              {pendingInstitutions.length}
            </p>
          </div>
        </div>

        <div className="bg-white border border-brand-outline rounded-2xl p-5 flex items-center gap-4 shadow-xs">
          <span className="p-3 rounded-2xl bg-blue-50 text-blue-600 shrink-0">
            <BarChart3 className="w-6 h-6" />
          </span>
          <div>
            <p className="text-xs font-semibold text-brand-on-surface-variant">
              {t("সিস্টেম ট্রাস্ট হার", "Verification Rate")}
            </p>
            <p className="text-2xl font-extrabold text-brand-on-surface">
              {reports.length > 0
                ? `${Math.round(
                    (reports.filter((r) => r.verified).length / reports.length) * 100
                  )}%`
                : "100%"}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-gray-200 pb-3">
        <button
          onClick={() => setActiveTab("INSTITUTIONS")}
          className={`px-5 py-2.5 rounded-xl font-extrabold text-sm transition-all flex items-center gap-2 ${
            activeTab === "INSTITUTIONS"
              ? "bg-[#003527] text-white shadow-sm"
              : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
          }`}
        >
          <Building className="w-4 h-4" />
          <span>
            {t("অপেক্ষমাণ নতুন অফিস ভেরিফিকেশন", "Pending Institutions Queue")}{" "}
            ({pendingInstitutions.length})
          </span>
        </button>

        <button
          onClick={() => setActiveTab("REPORTS")}
          className={`px-5 py-2.5 rounded-xl font-extrabold text-sm transition-all flex items-center gap-2 ${
            activeTab === "REPORTS"
              ? "bg-[#003527] text-white shadow-sm"
              : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
          }`}
        >
          <FileCheck className="w-4 h-4" />
          <span>
            {t("নাগরিক রিপোর্ট মডারেশন", "Citizen Reports Moderation")}{" "}
            ({reports.length})
          </span>
        </button>
      </div>

      {/* TAB 1: PENDING INSTITUTIONS QUEUE */}
      {activeTab === "INSTITUTIONS" && (
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between text-amber-900 text-xs font-bold">
            <span>
              {t(
                "নাগরিকদের যুক্ত করা নতুন প্রতিষ্ঠানগুলো নিচের তালিকায় রয়েছে। যাচাই করে অনুমোদন দিলে তা মূল ডেটাবেজে স্বয়ংক্রিয়ভাবে যুক্ত হবে।",
                "Unlisted institutions submitted by citizens appear here. Approving an institution automatically saves it to the permanent database."
              )}
            </span>
          </div>

          {pendingInstitutions.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center text-gray-500 font-medium">
              {t(
                "এই মুহূর্তে কোনো নতুন প্রতিষ্ঠান ভেরিফিকেশনের জন্য অপেক্ষমাণ নেই।",
                "No pending institutions awaiting verification."
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingInstitutions.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border-2 border-amber-300 rounded-2xl p-6 shadow-sm space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-extrabold uppercase mb-1">
                          <Clock className="w-3 h-3" />
                          {t("অপেক্ষমাণ ভেরিফিকেশন", "PENDING VERIFICATION")}
                        </span>
                        <h3 className="text-lg font-extrabold text-gray-900 leading-tight">
                          {item.nameEn}
                        </h3>
                        <p className="text-sm font-bold text-gray-700">
                          {item.nameBn}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1 text-xs text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100">
                      <p>
                        <strong>{t("ক্যাটাগরি:", "Category:")}</strong>{" "}
                        {item.category}
                      </p>
                      <p>
                        <strong>{t("ঠিকানা:", "Address:")}</strong>{" "}
                        {item.address}
                      </p>
                    </div>

                    {item.reportTitle && (
                      <div className="text-xs bg-emerald-50/70 p-3 rounded-xl border border-emerald-200/70 space-y-1">
                        <p className="font-bold text-[#003527]">
                          {t("সংযুক্ত নাগরিক রিপোর্ট:", "Attached Citizen Report:")}{" "}
                          &ldquo;{item.reportTitle}&rdquo;
                        </p>
                        <p className="text-gray-600 line-clamp-2">
                          {item.reportDesc}
                        </p>
                      </div>
                    )}

                    {item.mapUrl && (
                      <div className="rounded-xl overflow-hidden border border-[#003527]/20 bg-emerald-50/40 p-2 space-y-1.5">
                        <div className="flex items-center justify-between text-[11px] font-bold text-[#003527] px-1">
                          <span>📍 গুগল ম্যাপ লোকেশন (Attached Google Map):</span>
                          <span className="text-emerald-700 font-normal truncate max-w-[180px]">
                            {item.mapUrl}
                          </span>
                        </div>
                        <iframe
                          title="Admin Verified Map Preview"
                          src={`https://maps.google.com/maps?q=${encodeURIComponent(
                            item.mapUrl
                          )}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                          className="w-full h-36 rounded-lg border-0"
                          loading="lazy"
                        />
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRejectInstitution(item.id)}
                      className="text-red-600 hover:bg-red-50 border-red-200"
                    >
                      <XCircle className="w-4 h-4 mr-1.5" />
                      <span>{t("বাতিল (Reject)", "Reject")}</span>
                    </Button>

                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleApproveInstitution(item)}
                      className="bg-[#003527] hover:bg-[#064e3b] px-4 font-bold"
                    >
                      <Check className="w-4 h-4 mr-1.5" />
                      <span>
                        {t(
                          "যাচাই ও অনুমোদন করুন (Approve & Post)",
                          "Approve Institution & Post"
                        )}
                      </span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: CITIZEN REPORTS MODERATION */}
      {activeTab === "REPORTS" && (
        <div className="space-y-6">
          {/* Search & Filter Toolbar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white border border-brand-outline rounded-2xl p-4 shadow-xs">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchReportQuery}
                onChange={(e) => setSearchReportQuery(e.target.value)}
                placeholder={t(
                  "নাগরিক, অফিস বা শিরোনাম দিয়ে খুঁজুন...",
                  "Search by citizen, office or title..."
                )}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition-all"
              />
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-bold text-brand-on-surface-variant mr-1">
                <Filter className="w-3.5 h-3.5 inline mr-1" />
                {t("স্ট্যাটাস:", "Status:")}
              </span>
              {(["ALL", "APPROVED", "PENDING", "REJECTED"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    filter === s
                      ? "bg-[#003527] text-white shadow-xs"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Reports Table */}
          <div className="bg-white border border-brand-outline rounded-3xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-brand-outline bg-gray-50/80 text-xs font-bold text-brand-on-surface uppercase tracking-wider">
                    <th className="py-4 px-6">Citizen</th>
                    <th className="py-4 px-6">Institution</th>
                    <th className="py-4 px-6">Title &amp; Rating</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6">Verified</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-outline text-sm">
                  {filteredReports.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-gray-500 font-medium">
                        {t("কোনো রিপোর্ট পাওয়া যায়নি।", "No reports match your filter.")}
                      </td>
                    </tr>
                  ) : (
                    filteredReports.map((r) => (
                      <tr key={r.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-4 px-6 font-semibold text-brand-on-surface">
                          <div>{r.userName}</div>
                          <div className="text-xs font-normal text-brand-on-surface-variant">
                            {r.createdAt}
                          </div>
                        </td>

                        <td className="py-4 px-6 text-brand-primary font-bold text-xs">
                          {r.institutionName}
                        </td>

                        <td className="py-4 px-6 max-w-xs">
                          <div className="font-bold text-brand-on-surface truncate">
                            {r.title}
                          </div>
                          <div className="text-xs text-brand-on-surface-variant flex items-center gap-1 mt-0.5">
                            <span>★ {r.rating}/5</span>
                            <span>•</span>
                            <span>{r.civicTag}</span>
                          </div>
                        </td>

                        <td className="py-4 px-6">
                          <select
                            value={r.status}
                            onChange={(e) =>
                              handleStatusChange(
                                r.id,
                                e.target.value as "APPROVED" | "PENDING" | "REJECTED"
                              )
                            }
                            className={`px-2.5 py-1 rounded-full text-xs font-bold border outline-none cursor-pointer ${
                              r.status === "APPROVED"
                                ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                                : r.status === "PENDING"
                                ? "bg-amber-100 text-amber-800 border-amber-300"
                                : "bg-red-100 text-red-800 border-red-300"
                            }`}
                          >
                            <option value="APPROVED">APPROVED</option>
                            <option value="PENDING">PENDING</option>
                            <option value="REJECTED">REJECTED</option>
                          </select>
                        </td>

                      <td className="py-4 px-6">
                        <button
                          onClick={() => handleVerifyToggle(r.id)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors ${
                            r.verified
                              ? "bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100"
                              : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                          }`}
                          title="Click to toggle Visit Verification status"
                        >
                          {r.verified ? (
                            <>
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>Verified</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Unverified</span>
                            </>
                          )}
                        </button>
                      </td>

                      <td className="py-4 px-6 text-right space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleVerifyToggle(r.id)}
                        >
                          {r.verified ? "Unverify" : "Verify Visit"}
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteReport(r.id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

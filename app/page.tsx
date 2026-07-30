"use client";

import React, { useState } from "react";
import Link from "next/link";
import { INSTITUTIONS, INITIAL_REPORTS } from "@/lib/mockData";
import { supabase, syncSupabaseSessionToLocal, handleCitizenLogout, deduplicateInstitutions } from "@/lib/supabase";
import { ReportCard } from "@/components/reports/ReportCard";
import {
  Search,
  Bookmark,
  ArrowRight,
  ShieldCheck,
  Building2,
  Shield,
  FileText,
  CreditCard,
  Hospital,
  Car,
  ChevronRight,
  PlusCircle,
  Filter,
  TrendingUp,
  Award,
  Zap,
  Users,
  User,
  CheckCircle2,
  Mail,
  Lock,
} from "lucide-react";
import { calculateJanomotMetrics } from "@/lib/janomotMetrics";
import { searchInstitutions } from "@/lib/searchUtils";
import { getMergedClientReports } from "@/lib/supabase";

export default function HomePage() {
  const [institutionsList, setInstitutionsList] = useState(INSTITUTIONS);
  const [recentReports, setRecentReports] = useState(INITIAL_REPORTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(["brta-mirpur-1"]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState<{
    name?: string;
    email?: string;
    avatar_url?: string;
  }>({
    name: "Citizen Account",
    email: "citizen@gmail.com",
    avatar_url:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80",
  });
  const [rankingMode, setRankingMode] = useState<
    "LEADERBOARD" | "TRENDING" | "MOST_IMPROVED" | "MOST_ACTIVE" | "SATISFACTION"
  >("LEADERBOARD");

  React.useEffect(() => {
    const checkAuth = () => {
      try {
        const stored = localStorage.getItem("jonomot_user");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.isLoggedIn) {
            let savedAvatar = null;
            try {
              const emailKey = parsed.email || "default_citizen";
              const savedAvatars = JSON.parse(localStorage.getItem("jonomot_user_avatars") || "{}");
              savedAvatar = savedAvatars[emailKey] || localStorage.getItem("jonomot_last_avatar");
            } catch {}

            setIsLoggedIn(true);
            setUserProfile({
              name: parsed.name || "Citizen Account",
              email: parsed.email || "citizen@gmail.com",
              avatar_url:
                savedAvatar ||
                parsed.avatar_url ||
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80",
            });
          } else {
            setIsLoggedIn(false);
          }
        } else {
          setIsLoggedIn(false);
        }
      } catch (err) {
        console.warn("Could not check local auth session:", err);
      }
    };
    checkAuth();
    window.addEventListener("jonomot_auth_change", checkAuth);
    window.addEventListener("storage", checkAuth);

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const profile = syncSupabaseSessionToLocal(session);
        if (profile) {
          setIsLoggedIn(true);
          setUserProfile({
            name: profile.name,
            email: profile.email,
            avatar_url: profile.avatar_url,
          });
        }
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        const profile = syncSupabaseSessionToLocal(session);
        if (profile) {
          setIsLoggedIn(true);
          setUserProfile({
            name: profile.name,
            email: profile.email,
            avatar_url: profile.avatar_url,
          });
        }
      } else if (event === "SIGNED_OUT") {
        setIsLoggedIn(false);
      }
    });

    const mergeCitizenInstitutions = (list: any[]) => {
      try {
        const savedApproved = localStorage.getItem("jonomot_approved_institutions");
        const approvedList = savedApproved ? JSON.parse(savedApproved) : [];

        const savedPending = localStorage.getItem("jonomot_pending_institutions");
        const pendingList = savedPending ? JSON.parse(savedPending) : [];

        return deduplicateInstitutions([...approvedList, ...pendingList, ...list]);
      } catch {
        return deduplicateInstitutions(list);
      }
    };

    const reloadInstList = () => {
      setInstitutionsList((prev) => deduplicateInstitutions(mergeCitizenInstitutions(prev)));
    };

    reloadInstList();
    window.addEventListener("jonomot_institutions_updated", reloadInstList);

    fetch("/api/institutions")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setInstitutionsList(mergeCitizenInstitutions(data.data));
        }
      })
      .catch((err) => {
        console.warn("Using offline fallback institutions:", err);
      });

    const reloadReports = () => {
      fetch("/api/reports")
        .then((res) => res.json())
        .then((data) => {
          const list = (data.success && Array.isArray(data.data)) ? data.data : [];
          setRecentReports(getMergedClientReports(list));
        })
        .catch(() => {
          setRecentReports(getMergedClientReports(INITIAL_REPORTS));
        });
    };

    reloadReports();
    window.addEventListener("jonomot_report_submitted", reloadReports);

    return () => {
      window.removeEventListener("jonomot_auth_change", checkAuth);
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("jonomot_institutions_updated", reloadInstList);
      window.removeEventListener("jonomot_report_submitted", reloadReports);
      subscription.unsubscribe();
    };
  }, []);

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Fuzzy bilingual search matching English and Bangla with trigram similarity, synonyms, and spelling suggestions
  const searchResult = searchInstitutions(
    institutionsList,
    searchQuery,
    selectedCategory
  );
  const filteredInstitutions = searchResult.matches.sort((a, b) => {
    const metA = calculateJanomotMetrics(a, recentReports);
    const metB = calculateJanomotMetrics(b, recentReports);

    if (rankingMode === "TRENDING") {
      return metB.weeklyScoreChange - metA.weeklyScoreChange; // 4. Highest weekly increase
    } else if (rankingMode === "MOST_IMPROVED") {
      return metB.monthlyImprovement - metA.monthlyImprovement; // 6. Largest monthly increase
    } else if (rankingMode === "MOST_ACTIVE") {
      return metB.activityScore - metA.activityScore; // 7. Total Reports + Official Responses
    } else if (rankingMode === "SATISFACTION") {
      return metB.citizenSatisfaction - metA.citizenSatisfaction; // 11. Citizen Satisfaction %
    }
    // 3. Default: Leaderboard (ORDER BY janomot_score DESC)
    return metB.janomotScore - metA.janomotScore;
  });

  const categories = [
    { name: "ALL", labelBn: "সকল অফিস", icon: Building2 },
    { name: "Transportation & License", labelBn: "পরিবহন ও লাইসেন্স", icon: Car },
    { name: "Police & Public Safety", labelBn: "পুলিশ ও আইনশৃংখলা", icon: Shield },
    { name: "Identity & Passport", labelBn: "পাসপোর্ট", icon: FileText },
    { name: "Municipal & City Services", labelBn: "সিটি কর্পোরেশন ও পৌরসভা", icon: Building2 },
    { name: "Land & Revenue (AC Land)", labelBn: "ভূমি ও রেজিস্ট্রেশন", icon: FileText },
    { name: "Healthcare & Hospitals", labelBn: "সরকারি হাসপাতাল", icon: Hospital },
    { name: "Electricity & Gas Utilities", labelBn: "বিদ্যুৎ ও গ্যাস", icon: Building2 },
  ];

  // ==========================================
  // 1. FULL-SCREEN GATED CIVIC LANDING PAGE
  //    Redirects to /login and /register which have proper Supabase OTP
  // ==========================================
  if (!isLoggedIn) {
    return (
      <div className="relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden bg-gradient-to-br from-[#05291a] via-[#003527] to-[#011c14] text-white">
        {/* Animated High-Opacity Background Image that moves up and down */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              @keyframes imageUpDown {
                0%, 100% { transform: translateY(0px) scale(1.05); }
                50% { transform: translateY(-20px) scale(1.05); }
              }
              .animate-bg-up-down {
                animation: imageUpDown 4s ease-in-out infinite;
              }
            `,
          }}
        />
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 animate-bg-up-down pointer-events-none"
          style={{
            backgroundImage: `url('/images/imageforlandingpage.jpg')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#001f16] via-[#003527]/90 to-[#031c15]/95 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#002b1f]/90 via-transparent to-[#001f16]/90 pointer-events-none" />

        {/* Decorative Ambient Glow Orbs */}
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-emerald-400/15 blur-3xl pointer-events-none" />

        {/* Top Navbar Header - Only Logo & Security Badge */}
        <header className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/images/mainlogo.png"
              alt="Jonomot Logo"
              className="w-11 h-11 object-contain drop-shadow-lg shrink-0"
            />
            <div>
              <span className="text-2xl font-black tracking-tight text-white">
                jonomot
              </span>
              <span className="hidden sm:block text-[10px] text-emerald-300/80 font-bold tracking-wider uppercase">
                Bangladesh Civic Platform
              </span>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold text-emerald-200 shadow-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>১০০% স্বাধীন ও নিরাপদ নাগরিক প্ল্যাটফর্ম</span>
          </div>
        </header>

        {/* Facebook-Inspired 2-Column Minimalist Landing Layout */}
        <main className="relative z-10 w-full max-w-6xl mx-auto px-6 sm:px-10 py-12 my-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Bold Branding & Slogan */}
          <div className="lg:col-span-7 text-left space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-xs font-extrabold text-emerald-300">
              <span>বাংলাদেশের ১ নম্বর নাগরিক মতামত প্ল্যাটফর্ম</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
              সরকারি সেবায় আপনার অভিজ্ঞতা{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-emerald-400 to-teal-200">
                পরিবর্তন আনতে পারে
              </span>
            </h1>

            <p className="text-base sm:text-lg text-emerald-100/90 font-normal leading-relaxed max-w-xl">
              সরকারি প্রতিষ্ঠান সম্পর্কে জানুন, সঠিক রিভিউ ও রেটিং দেখুন, আর গড়ে তুলুন একটি জবাবদিহিমূলক বাংলাদেশ।
            </p>
          </div>

          {/* Right Column: Clean Card — Facebook-Style Auth Entry */}
          <div className="lg:col-span-5 w-full max-w-md mx-auto">
            <div className="rounded-3xl bg-white/10 backdrop-blur-2xl border border-white/20 p-8 shadow-2xl space-y-6 text-center">
              <div className="space-y-1.5">
                <h2 className="text-xl font-extrabold text-white">
                  নাগরিক ড্যাশবোর্ডে প্রবেশ করুন
                </h2>
                <p className="text-xs text-emerald-100/80">
                  অভিজ্ঞতা শেয়ার করতে এবং সেবা মূল্যায়ন করতে প্রবেশ করুন
                </p>
              </div>

              <div className="space-y-3">
                <Link
                  href="/login"
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-400 to-emerald-500 text-gray-950 font-black text-base shadow-xl hover:shadow-emerald-500/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2.5"
                >
                  <Mail className="w-5 h-5" />
                  <span>লগইন করুন (Login)</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>

                <div className="flex items-center gap-3 my-2">
                  <div className="h-px bg-white/20 flex-1"></div>
                  <span className="text-[10px] text-emerald-200/60 font-extrabold uppercase tracking-wider">
                    অথবা (OR)
                  </span>
                  <div className="h-px bg-white/20 flex-1"></div>
                </div>

                <Link
                  href="/register"
                  className="w-full py-4 rounded-2xl bg-white/15 border border-white/25 text-white font-bold text-base shadow-lg hover:bg-white/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2.5"
                >
                  <User className="w-5 h-5" />
                  <span>নতুন একাউন্ট তৈরি করুন (Register)</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>

              <div className="flex items-center gap-2 justify-center pt-2 border-t border-white/10">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-xs text-emerald-200/70 font-medium">
                  ১০০% স্বাধীন, নিরাপদ ও নাগরিক-বান্ধব প্ল্যাটফর্ম
                </span>
              </div>
            </div>
          </div>
        </main>

        {/* Minimal Footer */}
        <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 py-6 border-t border-white/10 flex items-center justify-center text-xs text-emerald-200/60 font-medium">
          <p>© 2026 Jonomot Bangladesh. Built for Civic Transparency & Accountability.</p>
        </footer>
      </div>
    );
  }

  // ==========================================
  // 2. LOGGED-IN CITIZEN DASHBOARD
  // ==========================================
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Static Low-Opacity Web Background Image for Home/Feed UI only */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-15 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/images/webbg.png')`,
        }}
      />
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 py-6 space-y-12 pb-20">
      {/* Top Bar Search & Profile - Exact Stitch HTML */}
      <header className="flex justify-between items-center gap-6">
        <div className="flex-1 max-w-2xl">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-emerald-100">
              <Search className="w-5 h-5 text-emerald-200" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-brand-primary text-white placeholder-emerald-200 rounded-full py-3.5 pl-12 pr-12 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:bg-[#0f5c42] transition-colors border-none shadow-sm text-sm font-medium"
              placeholder="প্রতিষ্ঠান, সেবা, অফিস খুঁজুন (e.g. BRTA, Passport, মিরপুর)..."
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-emerald-200 hover:text-white transition-colors text-xs font-bold"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-5">
          {/* Clickable Profile Photo Avatar linking to Profile Settings */}
          <Link
            href="/profile"
            className="flex items-center gap-2.5 cursor-pointer group"
            title="Profile Settings (প্রোফাইল সেটিংস)"
          >
            <div className="relative">
              <img
                src={userProfile.avatar_url}
                alt="Citizen Profile"
                className="w-10 h-10 rounded-full object-cover border-2 border-brand-primary group-hover:scale-105 transition-all shadow-sm"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white" />
            </div>
            <div className="hidden sm:flex flex-col items-start">
              <span className="text-xs font-extrabold text-gray-900 group-hover:text-brand-primary transition-colors">
                {userProfile.name}
              </span>
              <span className="text-[10px] text-gray-500 font-medium">
                {userProfile.email}
              </span>
            </div>
          </Link>

          {/* Official Logout Button */}
          <button
            onClick={() => {
              setIsLoggedIn(false);
              handleCitizenLogout();
            }}
            className="px-3.5 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-bold transition-all shadow-sm"
            title="লগআউট করুন (Logout)"
          >
            লগআউট (Logout)
          </button>
        </div>
      </header>

      {/* Hero Section - Exact Stitch Bangla Typography */}
      <section className="max-w-3xl">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-2 tracking-tight">
          আপনার অভিজ্ঞতা
        </h2>
        <h2 className="text-4xl sm:text-5xl font-extrabold text-brand-primary leading-tight mb-6 tracking-tight">
          পরিবর্তন আনতে পারে
        </h2>
        <div className="flex items-center gap-2 mb-6">
          <span className="h-1.5 w-10 bg-brand-primary rounded-full"></span>
          <span className="h-1.5 w-10 bg-red-500 rounded-full"></span>
        </div>
        <p className="text-base sm:text-lg text-gray-600 mb-10 max-w-xl leading-relaxed">
          সরকারি সেবা সম্পর্কে জানুন, অভিজ্ঞতা শেয়ার করুন,
          <br />
          আর গড়ে তুলুন একটি স্বচ্ছ ও জবাবদিহিমূলক বাংলাদেশ।
        </p>

        <div className="flex flex-wrap items-center gap-4">
          <a
            href="#directory"
            className="bg-brand-primary hover:bg-[#0f5c42] text-white px-6 py-3.5 rounded-xl font-bold flex items-center gap-2.5 transition-colors shadow-sm text-sm"
          >
            <Search className="w-4 h-4" />
            <span>প্রতিষ্ঠান খুঁজুন</span>
          </a>

          <Link
            href="/report/new"
            className="bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 px-6 py-3.5 rounded-xl font-bold flex items-center gap-2.5 transition-colors shadow-xs text-sm"
          >
            <PlusCircle className="w-4 h-4 text-brand-primary" />
            <span>অভিজ্ঞতা শেয়ার করুন</span>
          </Link>
        </div>
      </section>

      {/* Popular Categories - Exact Stitch Horizontal Cards */}
      <section>
        <h3 className="text-xl font-extrabold text-gray-900 mb-6">
          জনপ্রিয় বিভাগসমূহ
        </h3>
        <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.name;
            return (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(isSelected ? "ALL" : cat.name)}
                className={`shrink-0 p-4 rounded-xl border transition-all flex items-center gap-4 min-w-[190px] ${
                  isSelected
                    ? "bg-brand-primary text-white border-brand-primary shadow-md"
                    : "bg-white text-gray-700 border-gray-200 hover:shadow-md hover:border-brand-primary/40"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${
                    isSelected
                      ? "bg-white/20 text-white"
                      : "bg-emerald-50 text-brand-primary"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="font-bold text-sm">{cat.labelBn}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Popular Institutions - Janomot v3 Analytical Ranking Leaderboard & Directory */}
      <section id="directory" className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-xl font-extrabold text-gray-900">
              সরকারি প্রতিষ্ঠানসমূহ ({filteredInstitutions.length})
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              নাগরিকদের মতামত ও স্বচ্ছতার ভিত্তিতে তালিকাভুক্ত
            </p>
          </div>

          {/* 5 Analytical Ranking Mode Buttons (Janomot v3 specs) */}
          <div className="flex items-center gap-1.5 flex-wrap bg-gray-100 p-1 rounded-2xl border border-gray-200">
            <button
              onClick={() => setRankingMode("LEADERBOARD")}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1 ${
                rankingMode === "LEADERBOARD"
                  ? "bg-[#003527] text-white shadow-sm"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>লিডারবোর্ড</span>
            </button>

            <button
              onClick={() => setRankingMode("TRENDING")}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1 ${
                rankingMode === "TRENDING"
                  ? "bg-emerald-700 text-white shadow-sm"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
              title="Formula: Current Week Score - Previous Week Score"
            >
              <TrendingUp className="w-3.5 h-3.5 text-amber-300" />
              <span>ট্রেন্ডিং</span>
            </button>

            <button
              onClick={() => setRankingMode("MOST_IMPROVED")}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1 ${
                rankingMode === "MOST_IMPROVED"
                  ? "bg-emerald-700 text-white shadow-sm"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
              title="Formula: Current Month Score - Last Month Score"
            >
              <span>সর্বাধিক উন্নতি</span>
            </button>

            <button
              onClick={() => setRankingMode("MOST_ACTIVE")}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1 ${
                rankingMode === "MOST_ACTIVE"
                  ? "bg-emerald-700 text-white shadow-sm"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
              title="Formula: Total Reports + Official Responses"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>সক্রিয়</span>
            </button>

            <button
              onClick={() => setRankingMode("SATISFACTION")}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1 ${
                rankingMode === "SATISFACTION"
                  ? "bg-[#003527] text-white shadow-sm"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
              title="Formula: (4★ + 5★ ratings) / Total Ratings * 100"
            >
              <Users className="w-3.5 h-3.5 text-amber-300" />
              <span>সন্তুষ্টি %</span>
            </button>
          </div>
        </div>

        {/* Did You Mean X? spelling suggestion banner */}
        {searchResult.didYouMean && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between gap-3 text-sm text-amber-900 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="font-bold">আপনি কি বোঝাতে চেয়েছেন (Did you mean):</span>
              <button
                onClick={() => setSearchQuery(searchResult.didYouMean || "")}
                className="font-extrabold text-brand-primary underline hover:text-emerald-800 transition-colors"
              >
                {searchResult.didYouMean}
              </button>
              <span>?</span>
            </div>
            <button
              onClick={() => setSearchQuery(searchResult.didYouMean || "")}
              className="px-3 py-1 bg-brand-primary text-white rounded-lg text-xs font-bold hover:bg-emerald-800 transition-colors"
            >
              সংশোধন করুন
            </button>
          </div>
        )}

        {filteredInstitutions.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center space-y-3">
            <p className="text-sm text-gray-500">
              কোনো প্রতিষ্ঠান পাওয়া যায়নি (No offices match &quot;{searchQuery}&quot;)
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("ALL");
              }}
              className="px-4 py-2 rounded-xl bg-brand-primary text-white text-xs font-bold"
            >
              Reset Search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredInstitutions.map((inst) => {
              const isSaved = bookmarkedIds.includes(inst.id);
              const met = calculateJanomotMetrics(inst, recentReports);
              return (
                <Link
                  href={`/institutions/${inst.id}`}
                  key={inst.id}
                  className="group bg-white rounded-xl shadow-xs border border-gray-200 p-4 hover:shadow-md hover:border-brand-primary/40 transition-all relative flex flex-col justify-between"
                >
                  <button
                    onClick={(e) => toggleBookmark(inst.id, e)}
                    className={`absolute top-4 right-4 z-10 p-1.5 rounded-lg border transition-colors ${
                      isSaved
                        ? "bg-brand-primary text-white border-brand-primary"
                        : "bg-white text-gray-400 border-gray-200 hover:text-brand-primary"
                    }`}
                    title={isSaved ? "Saved" : "Bookmark"}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${isSaved ? "fill-current" : ""}`} />
                  </button>

                  <div className="flex gap-4 items-start">
                    <div className="h-16 w-16 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 font-extrabold text-brand-primary text-lg">
                      {inst.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="flex flex-col pr-6">
                      <h4 className="font-bold text-gray-900 text-sm group-hover:text-brand-primary transition-colors leading-tight">
                        {inst.name}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        {inst.nameBn || "বাংলাদেশ"}
                      </p>
                      <div className="flex flex-wrap items-center gap-1.5 text-xs mt-2.5">
                        <span className="font-extrabold text-[#003527] bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-md flex items-center gap-1">
                          <Award className="w-3.5 h-3.5 text-amber-500" />
                          <span>জনমত স্কোর: {met.janomotScore}/১০০</span>
                        </span>
                        <span className="text-gray-500 font-medium text-[11px]">
                          ({met.totalReports}টি রিপোর্টের ভিত্তিতে)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Footer Info */}
                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-700 text-white text-xs font-extrabold shadow-xs">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                      <span>স্কোর: {met.janomotScore}/১০০</span>
                    </div>
                    <span className="text-xs font-bold text-brand-primary group-hover:underline flex items-center gap-0.5">
                      <span>বিস্তারিত দেখুন</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* Recent Public Feed - Exact Stitch Bangla Titles */}
      <section id="experiences" className="pt-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl font-extrabold text-gray-900">
              সাম্প্রতিক নাগরিক অভিজ্ঞতা (Public Feed)
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Verified reports with civic tags — upvoted by citizens
            </p>
          </div>
          <Link
            href="/report/new"
            className="text-xs font-bold text-brand-primary hover:underline flex items-center gap-1"
          >
            <span>অভিজ্ঞতা লিখুন</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="space-y-4">
          {recentReports.slice(0, 3).map((report) => (
            <ReportCard key={report.id} report={report} />
          ))}
        </div>
      </section>
      </div>
    </div>
  );
}

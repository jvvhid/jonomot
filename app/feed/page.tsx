"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { INITIAL_REPORTS, ReportItem, INSTITUTIONS } from "@/lib/mockData";
import { getMergedClientReports } from "@/lib/supabase";
import { ReportCard } from "@/components/reports/ReportCard";
import { Button } from "@/components/common/Button";
import {
  MessageSquare,
  Search,
  Filter,
  TrendingUp,
  Clock,
  Plus,
  AlertTriangle,
  ShieldCheck,
} from "lucide-react";

const CIVIC_TAGS = [
  "সকল ট্যাগ (All)",
  "ঘুষ (Bribe)",
  "দালাল (Middleman/Agent)",
  "দুর্ব্যবহার (Rude Behavior)",
  "ভালো ব্যবহার (Helpful Staff)",
];

const DIVISIONS = [
  "সকল বিভাগ (All)",
  "Dhaka Division",
  "Chittagong Division",
  "Rajshahi Division",
  "Khulna Division",
  "Sylhet Division",
  "Barisal Division",
  "Rangpur Division",
  "Mymensingh Division",
];

export default function PublicFeedPage() {
  const [reports, setReports] = useState<ReportItem[]>(INITIAL_REPORTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("সকল ট্যাগ (All)");
  const [selectedDivision, setSelectedDivision] = useState("সকল বিভাগ (All)");
  const [sortBy, setSortBy] = useState<"NEWEST" | "UPVOTES">("NEWEST");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFeedReports = () => {
      fetch("/api/reports")
        .then((res) => res.json())
        .then((data) => {
          const list = data?.reports || data?.data || [];
          setReports(getMergedClientReports(list));
        })
        .catch(() => {
          setReports(getMergedClientReports(INITIAL_REPORTS));
        })
        .finally(() => setIsLoading(false));
    };

    loadFeedReports();
    window.addEventListener("jonomot_report_submitted", loadFeedReports);
    window.addEventListener("jonomot_admin_approved", loadFeedReports);
    return () => {
      window.removeEventListener("jonomot_report_submitted", loadFeedReports);
      window.removeEventListener("jonomot_admin_approved", loadFeedReports);
    };
  }, []);

  const filteredReports = useMemo(() => {
    return reports
      .filter((report) => {
        // Tag filter
        if (selectedTag !== "সকল ট্যাগ (All)") {
          if (!report.civicTag || !report.civicTag.includes(selectedTag.split(" ")[0])) {
            return false;
          }
        }
        // Division filter
        if (selectedDivision !== "সকল বিভাগ (All)") {
          const matchedInst = INSTITUTIONS.find(
            (i) => i.id === report.institutionId || i.name === report.institutionName
          );
          const divName = matchedInst?.division || "";
          if (!divName.includes(selectedDivision.split(" ")[0])) {
            return false;
          }
        }
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = report.title?.toLowerCase().includes(q);
          const matchDesc = report.description?.toLowerCase().includes(q);
          const matchInst = report.institutionName?.toLowerCase().includes(q);
          if (!matchTitle && !matchDesc && !matchInst) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "UPVOTES") {
          return b.upvotes - a.upvotes;
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [reports, selectedTag, selectedDivision, searchQuery, sortBy]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Hero Banner */}
      <div className="bg-gradient-to-r from-[#003527] via-emerald-800 to-[#003527] rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-bold border border-white/15">
              <MessageSquare className="w-4 h-4" />
              <span>রিয়েল-টাইম নাগরিক ফিড (Live Citizen Feed)</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
              পাবলিক অভিজ্ঞতা ফিড
            </h1>
            <p className="text-emerald-100 text-xs sm:text-sm max-w-xl">
              সারা দেশের সরকারি দপ্তরসমূহে নাগরিকদের বাস্তব অভিজ্ঞতা পড়ুন, জবাবদিহিতা নিশ্চিত করুন এবং নিজের অভিজ্ঞতা শেয়ার করুন।
            </p>
          </div>

          <Link href="/report/new">
            <Button
              variant="primary"
              className="bg-amber-400 hover:bg-amber-300 text-gray-950 font-extrabold shadow-lg px-5 py-3 gap-2 text-xs sm:text-sm"
            >
              <Plus className="w-4 h-4" />
              <span>অভিজ্ঞতা শেয়ার করুন</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white border border-gray-200/80 rounded-2xl p-4 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="দপ্তর, অভিজ্ঞতা বা কিউয়ার্ড দিয়ে খুঁজুন..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-primary text-sm font-medium"
            />
          </div>

          {/* Sort toggle */}
          <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl shrink-0">
            <button
              type="button"
              onClick={() => setSortBy("NEWEST")}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-extrabold transition-all ${
                sortBy === "NEWEST"
                  ? "bg-white text-[#003527] shadow-xs"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>সর্বশেষ (Newest)</span>
            </button>
            <button
              type="button"
              onClick={() => setSortBy("UPVOTES")}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-extrabold transition-all ${
                sortBy === "UPVOTES"
                  ? "bg-white text-[#003527] shadow-xs"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>সর্বাধিক ভোট (Top)</span>
            </button>
          </div>
        </div>

        {/* Civic Tag Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <span className="text-xs font-bold text-gray-500 shrink-0 flex items-center gap-1 pr-1">
            <Filter className="w-3.5 h-3.5" />
            <span>ট্যাগ:</span>
          </span>
          {CIVIC_TAGS.map((tag) => {
            const active = selectedTag === tag;
            return (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all ${
                  active
                    ? "bg-[#003527] text-white shadow-sm"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>

        {/* Division Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar pt-1 border-t border-gray-100">
          <span className="text-xs font-bold text-gray-500 shrink-0 pr-1">
            বিভাগ:
          </span>
          {DIVISIONS.map((div) => {
            const active = selectedDivision === div;
            return (
              <button
                key={div}
                onClick={() => setSelectedDivision(div)}
                className={`px-3 py-1 rounded-lg text-xs font-extrabold shrink-0 transition-all ${
                  active
                    ? "bg-emerald-100 text-[#003527] border border-emerald-300"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {div}
              </button>
            );
          })}
        </div>
      </div>

      {/* Reports Feed List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-16 text-gray-500 font-bold text-sm">
            অভিজ্ঞতা লোড হচ্ছে... (Loading experiences...)
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-gray-900 text-base">
                কোনো অভিজ্ঞতা পাওয়া যায়নি
              </h3>
              <p className="text-sm text-gray-500 max-w-sm mx-auto">
                অন্য কোনো ফিল্টার বা কিউয়ার্ড দিয়ে চেষ্টা করুন অথবা নতুন অভিজ্ঞতা জমা দিন।
              </p>
            </div>
          </div>
        ) : (
          filteredReports.map((report) => (
            <ReportCard key={report.id} report={report} />
          ))
        )}
      </div>
    </div>
  );
}

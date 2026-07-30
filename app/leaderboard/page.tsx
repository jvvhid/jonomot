"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { INSTITUTIONS, InstitutionItem, INITIAL_REPORTS } from "@/lib/mockData";
import { deduplicateInstitutions, getMergedClientReports } from "@/lib/supabase";
import { calculateJanomotMetrics, JanomotMetrics } from "@/lib/janomotMetrics";
import { Button } from "@/components/common/Button";
import {
  Trophy,
  Award,
  Users,
  CheckCircle2,
  ArrowUpRight,
  Filter,
  Building2,
  MapPin,
  TrendingUp,
} from "lucide-react";

export default function LeaderboardPage() {
  const [selectedDivision, setSelectedDivision] = useState("সকল বিভাগ (All)");
  const [selectedCategory, setSelectedCategory] = useState("সকল খাত (All)");
  const [sortBy, setSortBy] = useState<"SCORE" | "SATISFACTION" | "REPORTS">("SCORE");

  const [allInstitutions, setAllInstitutions] = useState<InstitutionItem[]>(INSTITUTIONS);
  const [allReports, setAllReports] = useState(INITIAL_REPORTS);

  useEffect(() => {
    const loadMerged = () => {
      let mergedInst = [...INSTITUTIONS];
      try {
        const savedApproved = localStorage.getItem("jonomot_approved_institutions");
        if (savedApproved) {
          const parsed = JSON.parse(savedApproved);
          mergedInst = deduplicateInstitutions([...parsed, ...mergedInst]);
        }

        const savedInst = localStorage.getItem("jonomot_pending_institutions");
        if (savedInst) {
          const parsed = JSON.parse(savedInst);
          mergedInst = deduplicateInstitutions([...parsed, ...mergedInst]);
        }
      } catch {}

      setAllInstitutions(deduplicateInstitutions(mergedInst));

      fetch("/api/institutions")
        .then((res) => res.json())
        .then((data) => {
          if (data.success && Array.isArray(data.data) && data.data.length > 0) {
            setAllInstitutions(deduplicateInstitutions([...data.data, ...mergedInst]));
          } else {
            setAllInstitutions(deduplicateInstitutions(mergedInst));
          }
        })
        .catch(() => setAllInstitutions(deduplicateInstitutions(mergedInst)));

      fetch("/api/reports")
        .then((res) => res.json())
        .then((data) => {
          const list = (data.success && Array.isArray(data.data)) ? data.data : [];
          setAllReports(getMergedClientReports(list));
        })
        .catch(() => {
          setAllReports(getMergedClientReports(INITIAL_REPORTS));
        });
    };

    loadMerged();
    window.addEventListener("jonomot_institutions_updated", loadMerged);
    window.addEventListener("jonomot_report_submitted", loadMerged);
    return () => {
      window.removeEventListener("jonomot_institutions_updated", loadMerged);
      window.removeEventListener("jonomot_report_submitted", loadMerged);
    };
  }, []);

  const divisions = [
    "সকল বিভাগ (All)",
    "Dhaka",
    "Chittagong",
    "Rajshahi",
    "Khulna",
    "Sylhet",
    "Barisal",
    "Rangpur",
    "Mymensingh",
  ];

  const categories = [
    "সকল খাত (All)",
    "পরিবহন (BRTA)",
    "পাসপোর্ট ও ইমিগ্রেশন",
    "ভূমি ও রেজিস্ট্রেশন",
    "স্বাস্থ্য ও হাসপাতাল",
    "জাতীয় পরিচয়পত্র (NID)",
    "আইনশৃঙ্খলা ও পুলিশ",
  ];

  const rankedInstitutions = useMemo(() => {
    return allInstitutions
      .filter((inst) => {
        if (selectedDivision !== "সকল বিভাগ (All)") {
          if (!inst.division?.includes(selectedDivision)) return false;
        }
        if (selectedCategory !== "সকল খাত (All)") {
          if (!inst.category?.includes(selectedCategory.split(" ")[0])) return false;
        }
        return true;
      })
      .map((inst) => ({
        institution: inst,
        metrics: calculateJanomotMetrics(inst, allReports),
      }))
      .sort((a, b) => {
        if (sortBy === "SATISFACTION") {
          return b.metrics.citizenSatisfaction - a.metrics.citizenSatisfaction;
        }
        if (sortBy === "REPORTS") {
          return b.metrics.totalReports - a.metrics.totalReports;
        }
        return b.metrics.janomotScore - a.metrics.janomotScore;
      });
  }, [allInstitutions, allReports, selectedDivision, selectedCategory, sortBy]);

  const getGradeStyle = (grade: JanomotMetrics["grade"]) => {
    switch (grade) {
      case "A+":
      case "A":
        return "bg-emerald-100 text-emerald-950 border-emerald-300";
      case "B":
        return "bg-blue-100 text-blue-950 border-blue-300";
      case "C":
        return "bg-amber-100 text-amber-950 border-amber-300";
      default:
        return "bg-red-100 text-red-950 border-red-300";
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero Header Banner */}
      <div className="bg-gradient-to-r from-[#003527] via-emerald-800 to-[#003527] rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-extrabold border border-amber-400/30">
              <Trophy className="w-4 h-4" />
              <span>জাতীয় সেবা জবাবদিহিতা ইনডেক্স (Civic Accountability Index)</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
              সরকারি দপ্তর লিডারবোর্ড
            </h1>
            <p className="text-emerald-100 text-xs sm:text-sm max-w-xl">
              নাগরিকদের রিভিউ ও বাস্তব অভিজ্ঞতার ভিত্তিতে সরকারি দপ্তরসমূহের র‌্যাঙ্কিং এবং জবাবদিহিতার গ্রেড কার্ড (A+ থেকে F)।
            </p>
          </div>
        </div>
      </div>

      {/* Filters and Sorting Bar */}
      <div className="bg-white border border-gray-200/80 rounded-2xl p-4 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Sorting */}
          <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => setSortBy("SCORE")}
              className={`px-3.5 py-2 rounded-lg text-xs font-extrabold transition-all ${
                sortBy === "SCORE"
                  ? "bg-white text-[#003527] shadow-xs"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              জনমত স্কোর (Score)
            </button>
            <button
              onClick={() => setSortBy("SATISFACTION")}
              className={`px-3.5 py-2 rounded-lg text-xs font-extrabold transition-all ${
                sortBy === "SATISFACTION"
                  ? "bg-white text-[#003527] shadow-xs"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              নাগরিক সন্তুষ্টি (Satisfaction)
            </button>
            <button
              onClick={() => setSortBy("REPORTS")}
              className={`px-3.5 py-2 rounded-lg text-xs font-extrabold transition-all ${
                sortBy === "REPORTS"
                  ? "bg-white text-[#003527] shadow-xs"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              রিপোর্ট সংখ্যা (Reports)
            </button>
          </div>

          <span className="text-xs font-bold text-gray-500">
            মোট দপ্তর: <strong className="text-gray-900">{rankedInstitutions.length}টি</strong>
          </span>
        </div>

        {/* Division Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar pt-2 border-t border-gray-100">
          <span className="text-xs font-bold text-gray-500 shrink-0 pr-1">
            বিভাগ:
          </span>
          {divisions.map((div) => {
            const active = selectedDivision === div;
            return (
              <button
                key={div}
                onClick={() => setSelectedDivision(div)}
                className={`px-3 py-1 rounded-lg text-xs font-extrabold shrink-0 transition-all ${
                  active
                    ? "bg-[#003527] text-white shadow-xs"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {div}
              </button>
            );
          })}
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar pt-1">
          <span className="text-xs font-bold text-gray-500 shrink-0 pr-1">
            খাত:
          </span>
          {categories.map((cat) => {
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-bold shrink-0 transition-all ${
                  active
                    ? "bg-emerald-100 text-[#003527] border border-emerald-300"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Leaderboard Table / Cards */}
      <div className="space-y-3">
        {rankedInstitutions.map(({ institution, metrics }, index) => {
          const rankNumber = index + 1;
          const isTop3 = rankNumber <= 3;

          return (
            <div
              key={institution.id}
              className={`bg-white border rounded-2xl p-4 sm:p-5 transition-all hover:shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                isTop3 ? "border-emerald-200 bg-emerald-50/20" : "border-gray-200"
              }`}
            >
              {/* Left Column: Rank + Info */}
              <div className="flex items-center gap-4 min-w-0">
                {/* Rank number badge */}
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${
                    rankNumber === 1
                      ? "bg-amber-400 text-gray-950 shadow-sm"
                      : rankNumber === 2
                      ? "bg-gray-200 text-gray-800"
                      : rankNumber === 3
                      ? "bg-amber-700/20 text-amber-900"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  #{rankNumber}
                </div>

                {/* Institution Details */}
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Link
                      href={`/institutions/${institution.id}`}
                      className="font-extrabold text-gray-900 hover:text-brand-primary text-base sm:text-lg truncate transition-colors"
                    >
                      {institution.name}
                    </Link>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 shrink-0">
                      {institution.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-brand-primary shrink-0" />
                      <span>{institution.division}</span>
                    </span>
                    <span>•</span>
                    <span>{metrics.totalReports}টি রিপোর্ট</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Grades and Score */}
              <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100">
                {/* Letter Grade */}
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">
                    গ্রেড
                  </span>
                  <div
                    className={`px-3 py-1 rounded-lg text-base font-black border ${getGradeStyle(
                      metrics.grade
                    )}`}
                  >
                    {metrics.grade}
                  </div>
                </div>

                {/* Citizen Satisfaction */}
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">
                    নাগরিক সন্তুষ্টি
                  </span>
                  <span className="text-sm font-extrabold text-gray-800">
                    {metrics.citizenSatisfaction}%
                  </span>
                </div>

                {/* Jonomot Score */}
                <div className="flex flex-col items-end min-w-[130px]">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">
                    জনমত স্কোর
                  </span>
                  <div className="flex items-center gap-1 font-black text-lg text-[#003527]">
                    <Award className="w-4 h-4 text-amber-500" />
                    <span>{metrics.janomotScore} / ১০০</span>
                  </div>
                  <span className="text-[11px] text-gray-500 font-medium mt-0.5">
                    ({metrics.totalReports}টি রিপোর্টের ভিত্তিতে)
                  </span>
                </div>

                {/* View Hub Arrow */}
                <Link
                  href={`/institutions/${institution.id}`}
                  className="p-2 rounded-xl bg-gray-100 hover:bg-emerald-100 text-gray-700 hover:text-[#003527] transition-colors shrink-0"
                  title="অফিস হাব দেখুন"
                >
                  <ArrowUpRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

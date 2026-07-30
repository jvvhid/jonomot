"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { INSTITUTIONS, INITIAL_REPORTS, DocumentChecklistItem, getGoogleMapUrl } from "@/lib/mockData";
import { getMergedClientReports } from "@/lib/supabase";
import { ReportCard } from "@/components/reports/ReportCard";
import {
  MapPin,
  Star,
  Clock,
  Phone,
  ShieldCheck,
  PlusCircle,
  FileText,
  Filter,
  ArrowRight,
  ChevronRight,
  ExternalLink,
  ThumbsUp,
  AlertTriangle,
  Calendar,
  HelpCircle,
  Award,
  Users,
  CheckCircle2,
} from "lucide-react";
import { calculateJanomotMetrics, getReportsForInstitution } from "@/lib/janomotMetrics";

function getCategoryChecklist(category: string = "general", instTitle: string = ""): DocumentChecklistItem[] {
  const cat = (category || "").toLowerCase();
  const title = (instTitle || "").toLowerCase();

  if (cat.includes("hospital") || title.includes("hospital") || title.includes("হাসপাতাল") || title.includes("মেডিকেল")) {
    return [
      {
        id: "h1",
        title: "National ID / Birth Certificate (Original & Copy)",
        titleBn: "জাতীয় পরিচয়পত্র বা জন্ম নিবন্ধনের কপি",
        taskLabel: "আউটডোর / ভর্তি সেবা",
        upvoteCount: 164,
      },
      {
        id: "h2",
        title: "Previous Medical Reports & Prescriptions",
        titleBn: "রোগীর পূর্ববর্তী চিকিৎসাপত্র ও টেস্ট রিপোর্ট",
        taskLabel: "ডাক্তার সাক্ষাৎ",
        upvoteCount: 142,
      },
      {
        id: "h3",
        title: "OPD Ticket or Referral Slip",
        titleBn: "হাসপাতালের আউটডোর টিকিট বা রেফারেন্স স্লিপ",
        taskLabel: "টিকিট কাউন্টার",
        upvoteCount: 118,
      },
      {
        id: "h4",
        title: "Emergency Guardian Contact Number",
        titleBn: "জরুরি যোগাযোগের জন্য অভিভাবকের ফোন নম্বর",
        taskLabel: "জরুরি বিভাগ",
        upvoteCount: 95,
      },
    ];
  }
  if (cat.includes("passport") || title.includes("passport") || title.includes("পাসপোর্ট")) {
    return [
      {
        id: "p1",
        title: "Online Application Print Copy (Signed)",
        titleBn: "অনলাইন পাসপোর্ট আবেদনের প্রিন্ট কপি",
        taskLabel: "ই-পাসপোর্ট আবেদন",
        upvoteCount: 210,
      },
      {
        id: "p2",
        title: "Bank Fee Payment Challan / Online Payment Receipt",
        titleBn: "ব্যাংকে পাসপোর্ট ফি জমা দেওয়ার চালান বা রশিদ",
        taskLabel: "ফি জমাদান",
        upvoteCount: 185,
      },
      {
        id: "p3",
        title: "National ID (NID) or Online Birth Registration Certificate",
        titleBn: "জাতীয় পরিচয়পত্র (NID) বা অনলাইন জন্ম নিবন্ধন",
        taskLabel: "পরিচয় যাচাই",
        upvoteCount: 172,
      },
      {
        id: "p4",
        title: "Utility Bill Copy (Electricity/Gas/Water bill of residence)",
        titleBn: "ইউটিলিটি বিলের কপি (বর্তমান ঠিকানার প্রমাণ)",
        taskLabel: "ঠিকানা যাচাই",
        upvoteCount: 140,
      },
      {
        id: "p5",
        title: "Previous Passport Original & Copy (for renewal)",
        titleBn: "পূর্ববর্তী পাসপোর্ট ও ফটোকপি (নবায়নের ক্ষেত্রে)",
        taskLabel: "পাসপোর্ট নবায়ন",
        upvoteCount: 125,
      },
    ];
  }
  if (cat.includes("brta") || title.includes("brta") || title.includes("বিআরটিএ") || title.includes("লাইসেন্স")) {
    return [
      {
        id: "b1",
        title: "National ID / Smart Card (Original & 2 Photocopies)",
        titleBn: "জাতীয় পরিচয়পত্রের কপি ও মূল কার্ড",
        taskLabel: "ড্রাইভিং লাইসেন্স ও নিবন্ধন",
        upvoteCount: 189,
      },
      {
        id: "b2",
        title: "Medical Fitness Certificate from registered MBBS Doctor",
        titleBn: "মেডিকেল সার্টিফিকেট (এমবিবিএস ডাক্তার দ্বারা)",
        taskLabel: "ড্রাইভিং লাইসেন্স",
        upvoteCount: 156,
      },
      {
        id: "b3",
        title: "Learner Driving License or Old License",
        titleBn: "লার্নার লাইসেন্স বা পূর্ববর্তী ড্রাইভিং লাইসেন্স",
        taskLabel: "লাইসেন্স পরীক্ষা",
        upvoteCount: 134,
      },
      {
        id: "b4",
        title: "Bank Fee Payment Challan / Receipt",
        titleBn: "ব্যাংকে সরকারি ফি জমাদানের রশিদ",
        taskLabel: "ফি পরিশোধ",
        upvoteCount: 120,
      },
    ];
  }
  if (cat.includes("police") || title.includes("police") || title.includes("থানা") || title.includes("পুলিশ")) {
    return [
      {
        id: "pl1",
        title: "National ID (NID) / Citizenship Certificate",
        titleBn: "জাতীয় পরিচয়পত্র বা নাগরিকত্ব সনদের কপি",
        taskLabel: "জিডি / অভিযোগ",
        upvoteCount: 145,
      },
      {
        id: "pl2",
        title: "Written Application with Date & Signature",
        titleBn: "ঘটনার বিস্তারিত বিবরণী সম্বলিত লিখিত অভিযোগ বা জিডি আবেদন",
        taskLabel: "লিখিত আবেদন",
        upvoteCount: 138,
      },
      {
        id: "pl3",
        title: "Supporting Photo/Video Evidence (if available)",
        titleBn: "প্রামাণিক ছবি, ভিডিও বা প্রয়োজনীয় ডকুমেন্ট",
        taskLabel: "প্রমাণাদি",
        upvoteCount: 112,
      },
      {
        id: "pl4",
        title: "Witness Details or Reference Info",
        titleBn: "প্রয়োজনীয় ক্ষেত্রে সাক্ষী বা প্রমাণের বিবরণ",
        taskLabel: "তদন্ত সহায়তা",
        upvoteCount: 89,
      },
    ];
  }
  if (cat.includes("land") || title.includes("land") || title.includes("ভূমি") || title.includes("রেজিস্ট্রি")) {
    return [
      {
        id: "l1",
        title: "Original Deed & Khatian / Parcha",
        titleBn: "মূল দলিল ও পরচা / খতিয়ানের কপি",
        taskLabel: "নামজারি / নিবন্ধন",
        upvoteCount: 168,
      },
      {
        id: "l2",
        title: "Updated Land Development Tax Receipt (Khajna)",
        titleBn: "হালনাগাদ ভূমি উন্নয়ন কর (খাজনা) পরিশোধের রশিদ",
        taskLabel: "কর পরিশোধ",
        upvoteCount: 145,
      },
      {
        id: "l3",
        title: "National ID & Passport Size Photographs",
        titleBn: "জাতীয় পরিচয়পত্র ও পাসপোর্ট সাইজ ছবি",
        taskLabel: "পরিচয় যাচাই",
        upvoteCount: 132,
      },
      {
        id: "l4",
        title: "Succession Certificate (if inherited property)",
        titleBn: "উত্তরাধিকার বা ওয়ারিশান সনদপত্র (প্রযোজ্য ক্ষেত্রে)",
        taskLabel: "ওয়ারিশান যাচাই",
        upvoteCount: 110,
      },
    ];
  }
  // Others / default
  return [
    {
      id: "o1",
      title: "National ID (NID / Smart Card Original & Copy)",
      titleBn: "জাতীয় পরিচয়পত্র (NID) বা স্মার্ট কার্ডের কপি",
      taskLabel: "নাগরিক যাচাই",
      upvoteCount: 135,
    },
    {
      id: "o2",
      title: "Completed Application Form / Prescribed Form",
      titleBn: "সংশ্লিষ্ট সেবার পূরণকৃত আবেদনপত্র",
      taskLabel: "সেবা আবেদন",
      upvoteCount: 120,
    },
    {
      id: "o3",
      title: "Official Bank Fee Challan or Receipt",
      titleBn: "সরকারি ফি জমাদানের রসিদ বা চালান",
      taskLabel: "ফি জমাদান",
      upvoteCount: 98,
    },
    {
      id: "o4",
      title: "2 Passport Size Photographs",
      titleBn: "২ কপি পাসপোর্ট সাইজ রঙিন ছবি",
      taskLabel: "ছবি ও স্বাক্ষর",
      upvoteCount: 85,
    },
  ];
}

export default function InstitutionDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const initialInst = INSTITUTIONS.find((inst) => inst.id === id) || INSTITUTIONS[0];
  const [institution, setInstitution] = useState(initialInst);
  const [reports, setReports] = useState(INITIAL_REPORTS);
  const [checklist, setChecklist] = useState<DocumentChecklistItem[]>(
    getCategoryChecklist(initialInst.category, initialInst.nameBn || initialInst.name)
  );

  useEffect(() => {
    fetch("/api/institutions")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          const found = data.data.find((i: any) => i.id === id);
          if (found) {
            setInstitution(found);
            setChecklist(getCategoryChecklist(found.category, found.nameBn || found.name));
          }
        }
      })
      .catch(() => {});

    const loadInstReports = () => {
      fetch("/api/reports")
        .then((res) => res.json())
        .then((data) => {
          const list = (data.success && Array.isArray(data.data)) ? data.data : [];
          setReports(getMergedClientReports(list));
        })
        .catch(() => {
          setReports(getMergedClientReports(INITIAL_REPORTS));
        });
    };

    loadInstReports();
    window.addEventListener("jonomot_report_submitted", loadInstReports);
    window.addEventListener("jonomot_admin_approved", loadInstReports);

    const loadInstTips = () => {
      let localTips: DocumentChecklistItem[] = [];
      try {
        const saved = JSON.parse(
          localStorage.getItem("jonomot_document_tips") || "[]"
        );
        localTips = saved
          .filter((t: any) => t.institutionId === id)
          .map((t: any) => ({
            id: t.id,
            title: t.title,
            titleBn: t.titleBn || t.title,
            taskLabel: t.taskLabel || "নাগরিক টিপস",
            upvoteCount: t.upvoteCount || 1,
          }));
      } catch {}

      fetch(`/api/document-tips?institutionId=${encodeURIComponent(id)}`)
        .then((res) => res.json())
        .then((data) => {
          let dbTips: DocumentChecklistItem[] = [];
          if (data.success && Array.isArray(data.tips) && data.tips.length > 0) {
            dbTips = data.tips.map((t: any) => ({
              id: t.id,
              title: t.title,
              titleBn: t.title,
              taskLabel: t.category || "সাধারণ সেবা",
              upvoteCount: t.upvotes || 1,
            }));
          }
          setChecklist((prev) => {
            const allNew = [...localTips, ...dbTips];
            const existingIds = new Set(prev.map((p) => p.id));
            const added = allNew.filter((dt) => !existingIds.has(dt.id));
            return [...added, ...prev];
          });
        })
        .catch(() => {
          if (localTips.length > 0) {
            setChecklist((prev) => {
              const existingIds = new Set(prev.map((p) => p.id));
              const added = localTips.filter((dt) => !existingIds.has(dt.id));
              return [...added, ...prev];
            });
          }
        });
    };

    loadInstTips();
    window.addEventListener("jonomot_tips_updated", loadInstTips);

    return () => {
      window.removeEventListener("jonomot_report_submitted", loadInstReports);
      window.removeEventListener("jonomot_admin_approved", loadInstReports);
      window.removeEventListener("jonomot_tips_updated", loadInstTips);
    };
  }, [id]);

  const metrics = calculateJanomotMetrics(institution, reports);

  const institutionReports = getReportsForInstitution(institution, reports);

  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const [upvotedIds, setUpvotedIds] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitleBn, setNewTitleBn] = useState("");
  const [newTaskLabel, setNewTaskLabel] = useState("সাধারণ সেবা");

  const handleUpvote = (itemId: string) => {
    if (upvotedIds.includes(itemId)) {
      setChecklist((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, upvoteCount: item.upvoteCount - 1 } : item
        )
      );
      setUpvotedIds((prev) => prev.filter((id) => id !== itemId));
    } else {
      const targetItem = checklist.find((item) => item.id === itemId);
      setChecklist((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, upvoteCount: item.upvoteCount + 1 } : item
        )
      );
      setUpvotedIds((prev) => [...prev, itemId]);

      if (targetItem && !itemId.startsWith("custom-") && !itemId.includes("-doc-")) {
        fetch("/api/document-tips", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: itemId, currentUpvotes: targetItem.upvoteCount }),
        }).catch(() => {});
      }
    }
  };

  const handleAddDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitleBn.trim()) return;

    const customId = `custom-${Date.now()}`;
    const newItem: DocumentChecklistItem = {
      id: customId,
      title: newTitleBn,
      titleBn: newTitleBn,
      taskLabel: newTaskLabel,
      upvoteCount: 1,
    };

    setChecklist((prev) => [newItem, ...prev]);
    setUpvotedIds((prev) => [...prev, newItem.id]);

    // Persist tip to DB
    fetch("/api/document-tips", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        institutionId: id,
        title: newTitleBn,
        category: newTaskLabel,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.id) {
          setChecklist((prev) =>
            prev.map((item) => (item.id === customId ? { ...item, id: data.id } : item))
          );
        }
      })
      .catch(() => {});

    setNewTitleBn("");
    setIsModalOpen(false);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 py-6 space-y-8 pb-20">
      {/* Breadcrumbs - Exact Stitch HTML */}
      <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
        <Link href="/" className="hover:text-brand-primary transition-colors">
          প্রতিষ্ঠানসমূহ (Directory)
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-gray-800">{institution.name}</span>
      </div>

      {/* Profile Header Card - Exact Stitch HTML */}
      <section className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xs relative overflow-hidden flex flex-col md:flex-row gap-8 items-start">
        {/* Thumbnail Image */}
        <div className="w-full md:w-60 h-44 md:h-52 rounded-xl overflow-hidden shrink-0 border border-gray-200 bg-gray-100 relative group">
          <img
            src={institution.imageUrl || "/prelilogin.png"}
            alt={institution.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.src =
                "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Government_Seal_of_Bangladesh.svg/800px-Government_Seal_of_Bangladesh.svg.png";
            }}
          />
        </div>

        <div className="flex-1 flex flex-col justify-between h-full w-full">
          <div>
            <div className="flex justify-between items-start gap-4 flex-wrap">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 leading-tight">
                  {institution.name}
                </h1>
                <p className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>{institution.nameBn || "মিরপুর, ঢাকা"}</span>
                  <span className="text-gray-300">•</span>
                  <span>{institution.address}</span>
                </p>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <a
                  href={getGoogleMapUrl(institution)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-100 hover:bg-emerald-200 text-[#003527] px-5 py-3.5 rounded-xl text-sm font-extrabold transition-colors shadow-2xs flex items-center gap-2 border border-emerald-300"
                >
                  <MapPin className="w-4 h-4 text-emerald-700" />
                  <span>Google Map এ দেখুন</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <Link href={`/report/new?institutionId=${institution.id}`}>
                  <button className="bg-brand-primary text-white px-6 py-3.5 rounded-xl text-sm font-extrabold hover:bg-[#0f5c42] transition-colors shadow-sm flex items-center gap-2">
                    <Star className="w-4 h-4 fill-current" />
                    <span>অভিজ্ঞতা শেয়ার করুন</span>
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* 3-Column Stats Grid: Institution Grade, Jonomot Rating/Score, and Overall Rating */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-gray-100 pt-5 w-full">
            {/* 1. Institution Grade (প্রতিষ্ঠান গ্রেড) */}
            <div className="flex flex-col">
              <span className="text-xs font-bold text-gray-500 mb-1 flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-amber-500" />
                <span>প্রতিষ্ঠান গ্রেড (Institution Grade)</span>
              </span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-extrabold text-[#003527]">
                  {metrics.grade}
                </span>
                <span className="text-[10px] uppercase font-bold bg-emerald-100 text-emerald-900 px-1.5 py-0.5 rounded">
                  {metrics.janomotScore >= 90 ? "90+ A+" : `${metrics.janomotScore}/100`}
                </span>
              </div>
            </div>

            {/* 2. Jonomot Rating/Score (জনমত স্কোর) */}
            <div className="flex flex-col sm:border-l sm:border-gray-200 sm:pl-6">
              <span className="text-xs font-bold text-gray-500 mb-1">
                জনমত স্কোর (Jonomot Rating)
              </span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-extrabold text-emerald-800">
                  {metrics.janomotScore}
                </span>
                <span className="text-emerald-700 text-[11px] font-extrabold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  / ১০০ ({metrics.totalReports}টি রিপোর্টের ভিত্তিতে)
                </span>
              </div>
            </div>

            {/* 3. Overall Rating (সার্বিক রেটিং) */}
            <div className="flex flex-col sm:border-l sm:border-gray-200 sm:pl-6">
              <span className="text-xs font-bold text-gray-500 mb-1">
                সার্বিক রেটিং (Overall Rating)
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-extrabold text-gray-900">
                  {metrics.overallRating}
                </span>
                <Star className="w-5 h-5 fill-amber-400 text-amber-500" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Bento Layout - 2 Columns Left (Reports), 1 Column Right (Checklist & Specs) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Recent Reports Feed */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-extrabold text-gray-900">
              সাম্প্রতিক রিপোর্ট (Verified Reports)
            </h2>
            <div className="flex gap-2">
              <button className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-bold hover:bg-gray-50 transition-colors flex items-center gap-1.5 text-gray-700">
                <Filter className="w-3.5 h-3.5" />
                <span>ফিল্টার</span>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {institutionReports.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-xl p-8 text-center text-gray-500 text-sm">
                এই প্রতিষ্ঠানের জন্য এখনও কোনো রিপোর্ট নেই।
              </div>
            ) : (
              institutionReports.map((report) => (
                <ReportCard key={report.id} report={report} />
              ))
            )}
          </div>
        </div>

        {/* Right Column: Context, Checklist & Problem Metrics - Exact Stitch Layout */}
        <div className="space-y-6">
          {/* Required Documents Card ("প্রয়োজনীয় কাগজপত্র") */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
            <h3 className="text-xs font-extrabold text-gray-500 mb-4 uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-brand-primary" />
              <span>প্রয়োজনীয় কাগজপত্র (Bring These)</span>
            </h3>

            <div className="space-y-3">
              {checklist.map((item) => {
                const isUpvoted = upvotedIds.includes(item.id);
                return (
                  <div
                    key={item.id}
                    className="p-3.5 bg-gray-50/80 rounded-xl border border-gray-100 flex items-start justify-between gap-3"
                  >
                    <div>
                      <p className="text-xs font-bold text-brand-primary mb-0.5">
                        {item.taskLabel}
                      </p>
                      <p className="text-xs font-medium text-gray-800 leading-snug">
                        {item.titleBn}
                      </p>
                    </div>

                    <button
                      onClick={() => handleUpvote(item.id)}
                      className={`shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-extrabold border transition-all ${
                        isUpvoted
                          ? "bg-brand-primary text-white border-brand-primary shadow-xs"
                          : "bg-white text-gray-600 border-gray-200 hover:border-brand-primary"
                      }`}
                    >
                      <ThumbsUp className={`w-3 h-3 ${isUpvoted ? "fill-current" : ""}`} />
                      <span>{item.upvoteCount}</span>
                    </button>
                  </div>
                );
              })}

              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full py-2.5 text-brand-primary text-xs font-extrabold hover:bg-emerald-50 rounded-xl transition-colors border border-dashed border-brand-primary/40 flex items-center justify-center gap-1.5 mt-2"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>+ তথ্য যোগ করুন (Propose Document)</span>
              </button>
            </div>
          </div>

          {/* Quick Actions ("দ্রুত পদক্ষেপ") - Exact Stitch HTML */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
            <h3 className="text-xs font-extrabold text-gray-500 mb-4 uppercase tracking-wider">
              দ্রুত পদক্ষেপ
            </h3>
            <div className="space-y-2.5">
              <a
                href="#"
                className="w-full text-left px-4 py-3 border border-gray-200 rounded-xl hover:border-brand-primary hover:bg-emerald-50/30 transition-all flex items-center justify-between text-xs font-bold text-gray-800 group"
              >
                <span className="flex items-center gap-2.5">
                  <Calendar className="w-4 h-4 text-brand-primary group-hover:scale-110 transition-transform" />
                  <span>অ্যাপয়েন্টমেন্ট বুক করুন</span>
                </span>
                <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
              </a>

              <a
                href="#"
                className="w-full text-left px-4 py-3 border border-gray-200 rounded-xl hover:border-brand-primary hover:bg-emerald-50/30 transition-all flex items-center justify-between text-xs font-bold text-gray-800 group"
              >
                <span className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-brand-primary group-hover:scale-110 transition-transform" />
                  <span>আবেদনের অবস্থা চেক করুন</span>
                </span>
                <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
              </a>

              <a
                href="#"
                className="w-full text-left px-4 py-3 border border-gray-200 rounded-xl hover:border-brand-primary hover:bg-emerald-50/30 transition-all flex items-center justify-between text-xs font-bold text-gray-800 group"
              >
                <span className="flex items-center gap-2.5">
                  <HelpCircle className="w-4 h-4 text-brand-primary group-hover:scale-110 transition-transform" />
                  <span>অফিসিয়াল নির্দেশিকা (Official Guide)</span>
                </span>
                <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
              </a>
            </div>
          </div>

          {/* Category Breakdown ("সমস্যার বিবরণ") - Exact Stitch Progress Bars */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
            <h3 className="text-xs font-extrabold text-gray-500 mb-4 uppercase tracking-wider">
              সমস্যার বিবরণ (Service Bottlenecks)
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-gray-800">দীর্ঘ অপেক্ষার সময়</span>
                  <span className="text-gray-500">৪২%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-red-500 h-2 rounded-full"
                    style={{ width: "42%" }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-gray-800">কর্মীদের আচরণ</span>
                  <span className="text-gray-500">২৮%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-amber-500 h-2 rounded-full"
                    style={{ width: "28%" }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-gray-800">সিস্টেম ডাউনটাইম</span>
                  <span className="text-gray-500">১৫%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-brand-primary h-2 rounded-full"
                    style={{ width: "15%" }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-gray-800">ঘুষ/দুর্নীতি</span>
                  <span className="text-gray-500">১৫%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-rose-600 h-2 rounded-full"
                    style={{ width: "15%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Google Map Embed Card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-brand-primary" />
                <span>অফিসের অবস্থান (Google Map View)</span>
              </h3>
              <a
                href={getGoogleMapUrl(institution)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-extrabold text-brand-primary hover:underline flex items-center gap-1"
              >
                <span>বড় ম্যাপে দেখুন</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="w-full h-56 rounded-xl overflow-hidden border border-gray-200 relative bg-gray-100">
              <iframe
                title={`Google Map - ${institution.name}`}
                src={`https://maps.google.com/maps?q=${encodeURIComponent(
                  institution.name + " " + institution.address
                )}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                className="w-full h-full border-0"
                allowFullScreen
                loading="lazy"
              ></iframe>
            </div>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              ঠিকানা: <strong className="text-gray-800">{institution.address}</strong>
            </p>
          </div>

          {/* Office Photos & Citizen Evidence Gallery */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                <span>📷 অফিস ও সেবাকেন্দ্রের ছবি (Photo Gallery)</span>
              </h3>
              <span className="text-[11px] text-gray-500 font-medium">
                {institution.photos?.length || 4} টি ছবি
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {(institution.photos || [
                institution.imageUrl,
                institution.imageUrl,
                institution.imageUrl,
                institution.imageUrl,
              ]).map((photoUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedPhoto(photoUrl)}
                  className="group relative h-28 rounded-xl overflow-hidden border border-gray-200 bg-gray-100 block text-left"
                >
                  <img
                    src={photoUrl}
                    alt={`${institution.name} photo ${idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Government_Seal_of_Bangladesh.svg/800px-Government_Seal_of_Bangladesh.svg.png";
                    }}
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-black/70 text-white text-[10px] font-bold px-2 py-1 rounded-md">
                      বড় করুন
                    </span>
                  </div>
                </button>
              ))}
            </div>
            <p className="text-[11px] text-gray-500">
              নাগরিকদের পাঠানো ছবি ও অফিসের বাহ্যিক পরিবেশ।
            </p>
          </div>
        </div>
      </div>

      {/* Photo Lightbox Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="relative max-w-3xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-3 border-b">
              <h3 className="text-sm font-bold text-gray-800 truncate">{institution.name}</h3>
              <button
                type="button"
                onClick={() => setSelectedPhoto(null)}
                className="text-gray-500 hover:text-gray-900 font-extrabold text-sm px-2 py-1 rounded-lg hover:bg-gray-100"
              >
                ✕ Close
              </button>
            </div>
            <div className="max-h-[75vh] flex items-center justify-center bg-black/5 p-2">
              <img
                src={selectedPhoto}
                alt={institution.name}
                className="max-h-[70vh] w-auto object-contain rounded-lg"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Government_Seal_of_Bangladesh.svg/800px-Government_Seal_of_Bangladesh.svg.png";
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Propose Document Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl space-y-4">
            <h3 className="text-lg font-extrabold text-gray-900">
              + তথ্য যোগ করুন (Propose Required Document)
            </h3>

            <form onSubmit={handleAddDocument} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  সেবা / কাজ (e.g. ড্রাইভিং লাইসেন্স নবায়ন)
                </label>
                <input
                  type="text"
                  value={newTaskLabel}
                  onChange={(e) => setNewTaskLabel(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl text-sm"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  প্রয়োজনীয় কাগজপত্র (Document Name in Bangla)
                </label>
                <input
                  type="text"
                  value={newTitleBn}
                  onChange={(e) => setNewTitleBn(e.target.value)}
                  placeholder="যেমন: মূল লাইসেন্স ও ফটোকপি"
                  className="w-full px-3 py-2 border rounded-xl text-sm"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-brand-primary text-white hover:bg-[#0f5c42]"
                >
                  যোগ করুন (Submit)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

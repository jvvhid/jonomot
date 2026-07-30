"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { INSTITUTIONS } from "@/lib/mockData";
import { supabase, deduplicateInstitutions } from "@/lib/supabase";
import { Button } from "@/components/common/Button";
import {
  Star,
  Upload,
  FileText,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  ShieldCheck,
  X,
  Video,
  MapPin,
  Building2,
  Check,
  ArrowRight,
  PlusCircle,
  Lock,
  Clock,
  ExternalLink,
} from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

type CivicTagType =
  | "ঘুষ (Bribe)"
  | "দালাল (Middleman/Agent)"
  | "লম্বা লাইন (Long Queue)"
  | "দুর্ব্যবহার (Rude Behavior)"
  | "ভালো ব্যবহার (Helpful Staff)";

export default function SubmitReportPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Default false: Cannot submit without logging in!
  const [step, setStep] = useState<1 | 2 | 3>(1);

  useEffect(() => {
    // Check local session or Supabase Auth session
    const localUser = localStorage.getItem("jonomot_user");
    if (localUser) {
      try {
        const parsed = JSON.parse(localUser);
        if (parsed?.isLoggedIn) {
          setIsLoggedIn(true);
          return;
        }
      } catch {}
    }

    supabase.auth.getSession().then(({ data }) => {
      if (data?.session?.user) {
        setIsLoggedIn(true);
      }
    }).catch(() => {});
  }, []);

  const [availableInstitutions, setAvailableInstitutions] = useState(INSTITUTIONS);

  useEffect(() => {
    const loadInsts = () => {
      let list = [...INSTITUTIONS];
      try {
        const approved = localStorage.getItem("jonomot_approved_institutions");
        if (approved) list = [...JSON.parse(approved), ...list];
        const pending = localStorage.getItem("jonomot_pending_institutions");
        if (pending) list = [...JSON.parse(pending), ...list];
      } catch {}
      setAvailableInstitutions(deduplicateInstitutions(list));

      fetch("/api/institutions")
        .then((res) => res.json())
        .then((data) => {
          if (data.success && Array.isArray(data.data) && data.data.length > 0) {
            setAvailableInstitutions(deduplicateInstitutions([...data.data, ...list]));
          }
        })
        .catch(() => {});
    };
    loadInsts();
    window.addEventListener("jonomot_institutions_updated", loadInsts);
  }, []);

  // Existing vs New Institution Selection
  const [isAddingNewInst, setIsAddingNewInst] = useState(false);
  const [selectedInstId, setSelectedInstId] = useState(INSTITUTIONS[0].id);

  // New Institution Form Fields + Google Maps Auto-detect
  const [googleMapUrl, setGoogleMapUrl] = useState("");
  const [detectedPlaceQuery, setDetectedPlaceQuery] = useState("");
  const [newInstNameEn, setNewInstNameEn] = useState("");
  const [newInstNameBn, setNewInstNameBn] = useState("");
  const [newInstCategory, setNewInstCategory] = useState("Transportation & License");
  const [newInstAddress, setNewInstAddress] = useState("");

  const [civicTag, setCivicTag] = useState<CivicTagType>("ভালো ব্যবহার (Helpful Staff)");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [documentTip, setDocumentTip] = useState("");
  const [visitDate, setVisitDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [photoFiles, setPhotoFiles] = useState<string[]>([]);
  const [videoFile, setVideoFile] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      let finalUrl = "";
      try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (res.ok) {
          const data = await res.json();
          if (data.url) finalUrl = data.url;
        }
      } catch (err) {
        console.warn("Server upload fallback for image:", err);
      }

      if (!finalUrl) {
        finalUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      }

      if (finalUrl && !photoFiles.includes(finalUrl)) {
        setPhotoFiles([...photoFiles, finalUrl]);
      }
    } catch (err) {
      console.error("Photo upload error:", err);
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      let finalUrl = "";
      try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (res.ok) {
          const data = await res.json();
          if (data.url) finalUrl = data.url;
        }
      } catch (err) {
        console.warn("Server upload fallback for video:", err);
      }

      if (!finalUrl) {
        finalUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      }

      if (finalUrl) {
        setVideoFile(finalUrl);
      }
    } catch (err) {
      console.error("Video upload error:", err);
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const tags: CivicTagType[] = [
    "ঘুষ (Bribe)",
    "দালাল (Middleman/Agent)",
    "লম্বা লাইন (Long Queue)",
    "দুর্ব্যবহার (Rude Behavior)",
    "ভালো ব্যবহার (Helpful Staff)",
  ];

  const handleGoogleMapUrlChange = (val: string) => {
    setGoogleMapUrl(val);
    if (!val.trim()) {
      setDetectedPlaceQuery("");
      return;
    }

    // Parse place name from google maps URL like ".../place/BRTA+Mirpur..."
    const placeMatch = val.match(/place\/([^/@?]+)/);
    if (placeMatch && placeMatch[1]) {
      const decoded = decodeURIComponent(placeMatch[1].replace(/\+/g, " "));
      setDetectedPlaceQuery(decoded);
      if (!newInstNameEn) setNewInstNameEn(decoded);
      if (!newInstAddress) setNewInstAddress("Dhaka, Bangladesh");
    } else {
      // Fallback clean query
      const clean = val.replace(/https?:\/\/[^\s]+/g, "Dhaka Bangladesh Office").trim() || val;
      setDetectedPlaceQuery(clean);
      if (!newInstNameEn) setNewInstNameEn(clean);
    }
  };

  const handleAddDemoPhoto = () => {
    const names = [
      "BRTA_Booth_4_Token.jpg",
      "Service_Fee_Challan_Copy.png",
      "Office_Queue_Timestamp.jpg",
    ];
    const nextName = names[photoFiles.length % names.length];
    if (!photoFiles.includes(nextName)) {
      setPhotoFiles([...photoFiles, nextName]);
    }
  };

  const handleRemovePhoto = (name: string) => {
    setPhotoFiles(photoFiles.filter((f) => f !== name));
  };

  const handleAddDemoVideo = () => {
    if (!videoFile) {
      setVideoFile("Evidence_Video_720p_Clip.mp4");
    }
  };

  const selectedInst = isAddingNewInst
    ? {
        id: "pending-new-inst",
        name: newInstNameEn || "New Unlisted Institution",
        nameBn: newInstNameBn || "নতুন অফিস",
        address: newInstAddress || "Dhaka, Bangladesh",
        category: newInstCategory,
        district: "Dhaka",
      }
    : availableInstitutions.find((i) => i.id === selectedInstId) || availableInstitutions[0] || INSTITUTIONS[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let currentUserId = "user-demo";
    let currentUserName = "নাগরিক (Citizen)";
    try {
      const savedUser = localStorage.getItem("jonomot_user");
      if (savedUser) {
        const p = JSON.parse(savedUser);
        currentUserId = p.email || p.id || "user-demo";
        currentUserName = p.name || "নাগরিক (Citizen)";
      }
    } catch {}

    const targetInstId = isAddingNewInst ? "inst-" + Date.now() : selectedInstId;
    const targetInstName = isAddingNewInst ? newInstNameEn : selectedInst.name;

    if (isAddingNewInst) {
      // Save pending institution to localStorage for Admin dashboard verification
      const pendingInst = {
        id: "pending-" + Date.now(),
        nameEn: newInstNameEn,
        nameBn: newInstNameBn,
        category: newInstCategory,
        address: newInstAddress,
        status: "PENDING",
        reportTitle: title,
        reportDesc: description,
        mapUrl: googleMapUrl || detectedPlaceQuery,
        userName: currentUserName,
        userId: currentUserId,
        createdAt: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
      };

      const existingPending = JSON.parse(
        localStorage.getItem("jonomot_pending_institutions") || "[]"
      );
      localStorage.setItem(
        "jonomot_pending_institutions",
        JSON.stringify([pendingInst, ...existingPending])
      );

      // Save to PostgreSQL via API
      await fetch("/api/institutions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: targetInstId,
          name: newInstNameEn || "New Institution",
          nameBn: newInstNameBn || newInstNameEn,
          address: newInstAddress || "Bangladesh",
          category: newInstCategory,
          googleMapUrl: googleMapUrl || undefined,
        }),
      }).catch(() => {});
    }

    // Save optional "Bring These" material tip to Institution's Document Checklist Feed
    if (documentTip.trim() && targetInstId) {
      const tipObj = {
        id: `tip-${Date.now()}`,
        institutionId: targetInstId,
        title: documentTip.trim(),
        titleBn: documentTip.trim(),
        taskLabel: civicTag || "নাগরিক টিপস",
        upvoteCount: 1,
      };
      try {
        const savedTips = JSON.parse(
          localStorage.getItem("jonomot_document_tips") || "[]"
        );
        localStorage.setItem(
          "jonomot_document_tips",
          JSON.stringify([tipObj, ...savedTips])
        );
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("jonomot_tips_updated"));
        }
      } catch {}

      fetch("/api/document-tips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          institutionId: targetInstId,
          title: documentTip.trim(),
          category: civicTag || "নাগরিক টিপস",
          userId: currentUserId,
        }),
      }).catch(() => {});
    }

    // Save report to PostgreSQL via API
    const reportId = `rep-${Date.now()}`;
    const newReportObj = {
      id: reportId,
      institutionId: targetInstId,
      institutionName: targetInstName,
      title: title || civicTag || "সেবা অভিজ্ঞতা রিপোর্ট",
      description: description || "সেবা ও আচরণ সম্পর্কিত মতামত",
      rating: Number(rating) || 5,
      upvotes: 1,
      civicTag: (civicTag as any) || "ভালো ব্যবহার (Helpful Staff)",
      visitDate: new Date().toISOString().split("T")[0],
      userId: currentUserId,
      userName: currentUserName,
      userRole: "CITIZEN" as const,
      createdAt: new Date().toISOString().split("T")[0],
      status: "APPROVED" as const,
      verified: false,
      hasVideoProof: Boolean(videoFile),
      photoUrls: photoFiles || [],
      videoUrl: videoFile || undefined,
    };

    try {
      const existingLocal = JSON.parse(
        localStorage.getItem("jonomot_submitted_reports") || "[]"
      );
      localStorage.setItem(
        "jonomot_submitted_reports",
        JSON.stringify([
          newReportObj,
          ...existingLocal.filter((r: any) => r.id !== reportId),
        ])
      );
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("jonomot_report_submitted"));
      }
    } catch {}

    await fetch("/api/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newReportObj),
    }).catch((err) => console.error("Report save error:", err));

    setStep(3);
  };

  // 1. AUTH CHECK: Cannot post/submit report without logging in!
  if (!isLoggedIn) {
    return (
      <div className="w-full max-w-2xl mx-auto px-4 py-16">
        <div className="bg-white border-2 border-emerald-500/30 rounded-3xl p-8 sm:p-10 text-center space-y-6 shadow-xl relative overflow-hidden">
          <div className="w-16 h-16 bg-emerald-100 text-[#003527] rounded-2xl flex items-center justify-center mx-auto shadow-sm">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              {t("রিপোর্ট জমা দিতে লগইন করুন", "Login Required to Submit Report")}
            </h2>
            <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
              {t(
                "সরকারি সেবা বা প্রতিষ্ঠানের ওপর আপনার অভিজ্ঞতা প্রকাশ করতে এবং জবাবদিহিতা নিশ্চিত করতে জনমত-এ লগইন বা অ্যাকাউন্ট থাকা আবশ্যক।",
                "To submit a verified citizen experience report and hold public offices accountable, you must be logged into Jonomot."
              )}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link href="/login" className="w-full sm:w-auto">
              <Button variant="primary" className="w-full px-8 py-3 font-bold">
                {t("লগইন করুন (Login)", "Login")}
              </Button>
            </Link>

            <Link href="/register" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full px-8 py-3 font-bold">
                {t("রেজিস্টার করুন (Register)", "Register")}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Top Breadcrumb & Progress */}
      <div className="flex items-center justify-between gap-4 border-b border-brand-outline pb-5">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-on-surface-variant hover:text-brand-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t("হোম ড্যাশবোর্ডে ফিরুন", "Back to Home Dashboard")}</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
            {t("নাগরিক অভিজ্ঞতা রিপোর্ট করুন", "Submit Civic Experience")}
          </h1>
        </div>

        {/* 3 Step Indicator */}
        <div className="flex items-center gap-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                step === s
                  ? "bg-brand-primary text-white"
                  : step > s
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              {step > s ? "✓" : s}
            </div>
          ))}
        </div>
      </div>

      {/* STEP 1: Select Institution OR Add New Unlisted Institution */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="bg-white border border-brand-outline rounded-2xl p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="text-xl font-extrabold text-gray-900">
                {t("ধাপ ১: সরকারি প্রতিষ্ঠান নির্বাচন করুন", "Step 1: Select Government Office")}
              </h2>
              <p className="text-xs text-gray-600">
                {t(
                  "আপনি কোন সরকারি অফিস বা প্রতিষ্ঠানে সেবা নিতে গিয়েছিলেন তা নির্বাচন করুন।",
                  "Choose the institution where you received public service."
                )}
              </p>
            </div>

            {/* Existing vs Add New Toggle */}
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
              <button
                type="button"
                onClick={() => setIsAddingNewInst(false)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                  !isAddingNewInst
                    ? "bg-[#003527] text-white shadow-sm"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {t("বিদ্যমান তালিকা থেকে বেছে নিন", "Select from Existing List (25)")}
              </button>

              <button
                type="button"
                onClick={() => setIsAddingNewInst(true)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                  isAddingNewInst
                    ? "bg-amber-400 text-[#003527] shadow-sm"
                    : "bg-amber-50 text-amber-900 hover:bg-amber-100"
                }`}
              >
                <PlusCircle className="w-4 h-4" />
                <span>{t("+ নতুন অফিস যোগ করুন", "+ Add Unlisted Institution")}</span>
              </button>
            </div>

            {!isAddingNewInst ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[420px] overflow-y-auto pr-1">
                {availableInstitutions.map((inst) => {
                  const isSelected = selectedInstId === inst.id;
                  return (
                    <button
                      key={inst.id}
                      type="button"
                      onClick={() => setSelectedInstId(inst.id)}
                      className={`text-left p-4 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                        isSelected
                          ? "bg-emerald-50 border-[#003527] ring-2 ring-[#003527]/20"
                          : "bg-white border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-gray-900 leading-tight">
                          {inst.name}
                        </p>
                        {inst.nameBn && (
                          <p className="text-xs text-gray-600 font-medium">
                            {inst.nameBn}
                          </p>
                        )}
                        <div className="flex items-center gap-1 text-[11px] text-gray-500 pt-1">
                          <MapPin className="w-3 h-3 text-brand-primary" />
                          <span>{inst.district} • {inst.category}</span>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="w-6 h-6 rounded-full bg-[#003527] text-white flex items-center justify-center shrink-0">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            ) : (
              /* Add New Unlisted Institution Form with Auto-Detect Google Maps */
              <div className="space-y-5 bg-amber-50/50 p-6 rounded-2xl border border-amber-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                    <PlusCircle className="w-5 h-5 text-amber-600" />
                    <span>{t("নতুন প্রতিষ্ঠানের তথ্য প্রদান করুন", "Enter New Institution Information")}</span>
                  </div>
                  <span className="text-[11px] bg-amber-200/80 text-amber-900 px-2.5 py-0.5 rounded-full font-extrabold">
                    {t("অ্যাডমিন যাচাইকরণ আবশ্যক", "Admin Verified")}
                  </span>
                </div>

                {/* Google Maps Auto-Detect URL */}
                <div className="space-y-2 pb-2 border-b border-amber-200/60">
                  <label className="block text-xs font-bold text-gray-700">
                    {t(
                      "গুগল ম্যাপ লোকেশন লিংক বা অফিসের নাম (Google Maps URL or Office Address)",
                      "Google Maps Location URL or Office Name"
                    )}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Paste Google Maps URL e.g. https://www.google.com/maps/place/BRTA+Mirpur or type office location"
                      value={googleMapUrl}
                      onChange={(e) => handleGoogleMapUrlChange(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003527] text-sm bg-white"
                    />
                  </div>

                  {/* Auto-detected interactive Map & Photo Preview */}
                  {detectedPlaceQuery && (
                    <div className="rounded-2xl overflow-hidden border-2 border-[#003527]/30 bg-white shadow-md mt-3">
                      <div className="p-2.5 bg-gradient-to-r from-[#003527] to-[#064e3b] text-white text-xs font-extrabold flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-amber-300" />
                          <span>
                            {t("স্বয়ংক্রিয় ম্যাপ প্রিভিউ:", "Auto-Detected Map View:")}{" "}
                            {detectedPlaceQuery}
                          </span>
                        </span>
                        <span className="bg-amber-400 text-[#003527] px-2 py-0.5 rounded text-[10px] font-extrabold flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          <span>AUTO-IMPORTED</span>
                        </span>
                      </div>
                      <div className="relative">
                        <iframe
                          title="Google Map Location Preview"
                          src={`https://maps.google.com/maps?q=${encodeURIComponent(
                            detectedPlaceQuery
                          )}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                          className="w-full h-52 border-0"
                          loading="lazy"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      {t("প্রতিষ্ঠানের নাম (ইংরেজি)", "Office Name (English)")} *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sub-Registrar Office, Mirpur"
                      value={newInstNameEn}
                      onChange={(e) => setNewInstNameEn(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003527] text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      {t("প্রতিষ্ঠানের নাম (বাংলা)", "Office Name (Bangla)")} *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. সাব-রেজিস্ট্রার অফিস, মিরপুর"
                      value={newInstNameBn}
                      onChange={(e) => setNewInstNameBn(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003527] text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      {t("সেবার খাত (Category)", "Category")} *
                    </label>
                    <select
                      value={newInstCategory}
                      onChange={(e) => setNewInstCategory(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003527] text-sm bg-white"
                    >
                      <option value="Transportation & License">পরিবহন ও লাইসেন্স (Transport & License)</option>
                      <option value="Police & Public Safety">পুলিশ ও আইনশৃংখলা (Police & Law Enforcement)</option>
                      <option value="Identity & Passport">পাসপোর্ট (Passport)</option>
                      <option value="Municipal & City Services">জাতীয় পরিচয়পত্র ও সিটি (NID & Municipal)</option>
                      <option value="Healthcare & Hospitals">হাসপাতাল (Hospital & Healthcare)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      {t("ঠিকানা ও জেলা", "Address & District")} *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mirpur-10, Dhaka"
                      value={newInstAddress}
                      onChange={(e) => setNewInstAddress(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003527] text-sm"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 flex justify-end">
            <Button
              variant="primary"
              disabled={isAddingNewInst && (!newInstNameEn || !newInstNameBn)}
              onClick={() => setStep(2)}
              className="gap-2 px-6 py-3"
            >
              <span>{t("পরবর্তী ধাপে যান", "Confirm & Proceed")}</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 2: Review Content */}
      {step === 2 && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white border border-brand-outline rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="border-b border-brand-outline pb-4 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-brand-primary uppercase tracking-wider">
                  {t("ধাপ ২: অভিজ্ঞতা বিবরণী", "Step 2: Experience Review")}
                </span>
                <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900">
                  {selectedInst.name} ({selectedInst.nameBn})
                </h1>
                <p className="text-xs text-gray-600">
                  {t(
                    "সেবার গুণগত মান রেটিং দিন এবং আপনার অভিজ্ঞতা বিস্তারিত লিখুন।",
                    "Rate the service quality and describe your encounter."
                  )}
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setStep(1)}
              >
                {t("অফিস পরিবর্তন", "Change Office")}
              </Button>
            </div>

            {/* Visit Date & Star Rating */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-700">
                  {t("ভিজিটের তারিখ (Date of Visit)", "Date of Visit")} *
                </label>
                <input
                  type="date"
                  required
                  value={visitDate}
                  onChange={(e) => setVisitDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-primary text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-700">
                  {t("সার্ভিস কোয়ালিটি রেটিং", "Service Quality Rating")} *
                </label>
                <div className="flex items-center gap-1.5 py-1">
                  {[1, 2, 3, 4, 5].map((idx) => (
                    <button
                      key={idx}
                      type="button"
                      onMouseEnter={() => setHoverRating(idx)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(idx)}
                      className="p-1 focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          idx <= (hoverRating || rating)
                            ? "fill-amber-400 text-amber-400"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-sm font-bold text-gray-700">
                    ({rating}/5)
                  </span>
                </div>
              </div>
            </div>

            {/* Civic Tag Selection */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700">
                {t("অভিজ্ঞতার মূল বিষয় (Select Civic Tag)", "Select Civic Tag")} *
              </label>
              <div className="flex flex-wrap gap-2 pt-1">
                {tags.map((tag) => {
                  const selected = civicTag === tag;
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setCivicTag(tag)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                        selected
                          ? "bg-[#003527] text-white border-[#003527] shadow-sm"
                          : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Title & Description */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700">
                  {t("রিপোর্টের শিরোনাম (Summary Title)", "Report Title")} *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., ড্রাইভিং লাইসেন্স বায়োমেট্রিক অভিজ্ঞতায় কোনো দালালের সাহায্য ছাড়াই কাজ শেষ"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-primary text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700">
                  {t("বিস্তারিত বিবরণ (Detailed Experience)", "Detailed Description")} *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="কতক্ষণ সময় লেগেছে, কোন বুথে গিয়েছেন, কোনো হয়রানি বা ঘুষের দাবি ছিল কি না বিস্তারিত লিখুন..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-primary text-sm"
                />
              </div>

              {/* Optional "Bring These" (Document Checklist) Input */}
              <div className="space-y-1.5 pt-2 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-gray-800">
                    {t(
                      "সাথে কী কী আনতে হবে? (Bring These - ঐচ্ছিক)",
                      "What documents/items should citizens bring? (Optional)"
                    )}
                  </label>
                  <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    {t("প্রতিষ্ঠানের ফিডে সরাসরি দেখাবে", "Shows in Institution Feed")}
                  </span>
                </div>
                <input
                  type="text"
                  placeholder="e.g. জাতীয় পরিচয়পত্র (NID) কপি, ২ কপি পাসপোর্ট ছবি, মূল আবেদনপত্র"
                  value={documentTip}
                  onChange={(e) => setDocumentTip(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-emerald-300/70 bg-emerald-50/20 focus:outline-none focus:ring-2 focus:ring-brand-primary text-sm placeholder-gray-400 text-gray-900 font-medium"
                />
                <p className="text-[11px] text-gray-500">
                  {t(
                    "আপনার দেওয়া এই তথ্য প্রতিষ্ঠানের 'সাথে কী কী আনতে হবে (Bring These)' চেকলিস্টে নাগরিক টিপস হিসেবে যুক্ত হবে।",
                    "This item will be automatically added as a crowdsourced citizen tip on this institution's 'Bring These' checklist."
                  )}
                </p>
              </div>
            </div>

            {/* Photo & Video Upload Section */}
            <div className="space-y-3 pt-2 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-gray-700">
                  {t("প্রমাণ ছবি ও ভিডিও যুক্ত করুন (Attach Evidence Photos/Videos)", "Attach Evidence Photos/Videos (Optional)")}
                </label>
                {!(civicTag === "ঘুষ (Bribe)" || civicTag === "দালাল (Middleman/Agent)" || civicTag === "দুর্ব্যবহার (Rude Behavior)") && (
                  <span className="text-[11px] text-gray-400 font-medium">
                    (ভিডিও আপলোড শুধুমাত্র ঘুষ, দালাল বা দুর্ব্যবহার ট্যাগে প্রযোজ্য)
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-bold cursor-pointer transition-colors">
                  <Upload className="w-4 h-4 text-brand-primary" />
                  <span>{isUploading ? t("আপলোড হচ্ছে...", "Uploading...") : t("ছবি আপলোড করুন (Upload Photo)", "Upload Photo")}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                    className="hidden"
                  />
                </label>

                {(civicTag === "ঘুষ (Bribe)" || civicTag === "দালাল (Middleman/Agent)" || civicTag === "দুর্ব্যবহার (Rude Behavior)") && (
                  <>
                    <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-emerald-300 bg-emerald-50/60 hover:bg-emerald-100 text-emerald-900 text-xs font-bold cursor-pointer transition-colors">
                      <Video className="w-4 h-4 text-emerald-600" />
                      <span>
                        {isUploading
                          ? t("আপলোড হচ্ছে...", "Uploading...")
                          : videoFile
                          ? t("ভিডিও যুক্ত করা হয়েছে (Video Attached)", "Video Attached")
                          : t("ভিডিও আপলোড করুন (Upload Video)", "Upload Video")}
                      </span>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={handleVideoUpload}
                        disabled={isUploading}
                        className="hidden"
                      />
                    </label>
                  </>
                )}

              </div>

              {photoFiles.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {photoFiles.map((photo, index) => (
                    <div
                      key={index}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold"
                    >
                      <FileText className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="max-w-[150px] truncate">{photo.replace(/^.*[\\\/]/, "")}</span>
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(photo)}
                        className="text-emerald-700 hover:text-red-600 focus:outline-none"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep(1)}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t("পূর্ববর্তী ধাপে ফিরুন", "Back")}</span>
            </Button>
            <Button type="submit" variant="primary" className="gap-2 px-8 py-3">
              <span>{t("রিপোর্ট জমা দিন (Submit Report)", "Submit Report")}</span>
              <Check className="w-4 h-4" />
            </Button>
          </div>
        </form>
      )}

      {/* STEP 3: Submission Confirmation */}
      {step === 3 && (
        <div className="bg-white border-2 border-emerald-500/30 rounded-3xl p-8 sm:p-10 text-center space-y-6 shadow-xl animate-in fade-in zoom-in duration-300">
          <div className="w-16 h-16 bg-emerald-100 text-[#003527] rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              {isAddingNewInst
                ? t(
                    "আপনার নতুন প্রতিষ্ঠান ও রিপোর্টটি অ্যাডমিন ভেরিফিকেশনের জন্য পাঠানো হয়েছে!",
                    "New Institution & Report Submitted for Admin Verification!"
                  )
                : t(
                    "আপনার অভিজ্ঞতা রিপোর্টটি সরাসরি প্রকাশ করা হয়েছে!",
                    "Report Successfully Published!"
                  )}
            </h2>
            <p className="text-sm text-gray-600 max-w-lg mx-auto leading-relaxed font-medium">
              {isAddingNewInst
                ? t(
                    "অ্যাডমিন প্যানেল থেকে প্রতিষ্ঠানটির অস্তিত্ব ও ঠিকানা যাচাই করার পরেই এটি স্বয়ংক্রিয়ভাবে প্ল্যাটফর্মে প্রকাশ পাবে। ধন্যবাদ!",
                    "Once verified by an Admin, the institution will be automatically added to the database and your post will be approved."
                  )
                : t(
                    "আপনার সততা ও নাগরিক সচেতনতার জন্য ধন্যবাদ। এই রিপোর্টটি পরবর্তী নাগরিকদের সরকারি সেবা গ্রহণে সহযোগিতা করবে।",
                    "Thank you for your civic contribution! Your review is now live in the Public Feed."
                  )}
            </p>

            {isAddingNewInst && (
              <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-bold mt-2">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>স্ট্যাটাস: অ্যাডমিন ভেরিফিকেশন অপেক্ষমাণ (Pending Verification)</span>
              </div>
            )}
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/">
              <Button variant="primary" className="px-8 py-3">
                {t("হোম ড্যাশবোর্ডে ফিরুন", "Return to Home Dashboard")}
              </Button>
            </Link>
            {isAddingNewInst && (
              <Link href="/admin">
                <Button variant="secondary" className="px-6 py-3 font-bold">
                  {t("অ্যাডমিন ড্যাশবোর্ডে যাচাই করুন", "Verify in Admin Dashboard")}
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

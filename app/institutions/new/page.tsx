"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { CATEGORIES } from "@/lib/mockData";
import { Button } from "@/components/common/Button";
import {
  Building2,
  MapPin,
  Clock,
  Phone,
  CheckCircle2,
  ArrowLeft,
  ShieldCheck,
  Sparkles,
  Globe,
  AlertCircle,
  FileText,
  Plus,
  Trash2,
} from "lucide-react";

const GENERIC_CHECKLIST_OPTIONS = [
  {
    id: "gen-nid",
    title: "National ID (NID / Smart Card Original & Copy)",
    titleBn: "জাতীয় পরিচয়পত্র (NID) বা স্মার্ট কার্ডের কপি",
    taskLabel: "নাগরিক যাচাই",
  },
  {
    id: "gen-photo",
    title: "Passport Size Photographs (2 Copies)",
    titleBn: "পাসপোর্ট সাইজ ছবি (২ কপি)",
    taskLabel: "পরিচয় যাচাই",
  },
  {
    id: "gen-form",
    title: "Completed Application / Service Form",
    titleBn: "সংশ্লিষ্ট সেবার পূরণকৃত আবেদনপত্র",
    taskLabel: "সেবা আবেদন",
  },
  {
    id: "gen-fee",
    title: "Bank Fee Payment Challan or Receipt",
    titleBn: "ব্যাংকে সরকারি ফি জমাদানের চালান বা রশিদ",
    taskLabel: "ফি পরিশোধ",
  },
  {
    id: "gen-bhumi",
    title: "Original Deed & Khatian / Parcha (For Land & Revenue)",
    titleBn: "মূল দলিল ও খতিয়ান / পরচা (ভূমি সেবার জন্য)",
    taskLabel: "ভূমি যাচাই",
  },
  {
    id: "gen-med",
    title: "Medical Fitness Certificate from MBBS Doctor",
    titleBn: "মেডিকেল ফিটনেস সার্টিফিকেট (এমবিবিএস ডাক্তার দ্বারা)",
    taskLabel: "ফিটনেস যাচাই",
  },
  {
    id: "gen-prev",
    title: "Previous Records / Old Passport / Prescription",
    titleBn: "পূর্ববর্তী রেকর্ড / পুরনো পাসপোর্ট / চিকিৎসাপত্র",
    taskLabel: "পূর্ববর্তী তথ্য",
  },
];

export default function AddInstitutionPage() {
  const [name, setName] = useState("");
  const [nameBn, setNameBn] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0].name);
  const [division, setDivision] = useState("Dhaka");
  const [district, setDistrict] = useState("Dhaka");
  const [address, setAddress] = useState("");
  const [hours, setHours] = useState("Sun–Thu: 9:00 AM – 5:00 PM");
  const [contact, setContact] = useState("");
  const [googleMapUrl, setGoogleMapUrl] = useState("");
  const [fetchedImageUrl, setFetchedImageUrl] = useState("");
  const [isFetchingImage, setIsFetchingImage] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Google Form style Bring These checklist selection
  const [selectedChecklistIds, setSelectedChecklistIds] = useState<string[]>([]);
  const [customTipTitle, setCustomTipTitle] = useState("");
  const [customTipsList, setCustomTipsList] = useState<
    Array<{ id: string; title: string; titleBn: string; taskLabel: string }>
  >([]);

  const toggleChecklistId = (id: string) => {
    setSelectedChecklistIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleAddCustomTip = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!customTipTitle.trim()) return;
    const newId = `custom-tip-${Date.now()}`;
    const newCustom = {
      id: newId,
      title: customTipTitle.trim(),
      titleBn: customTipTitle.trim(),
      taskLabel: "নাগরিক টিপস (Custom)",
    };
    setCustomTipsList((prev) => [...prev, newCustom]);
    setSelectedChecklistIds((prev) => [...prev, newId]);
    setCustomTipTitle("");
  };

  const handleRemoveCustomTip = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    setCustomTipsList((prev) => prev.filter((item) => item.id !== id));
    setSelectedChecklistIds((prev) => prev.filter((item) => item !== id));
  };

  const handleFetchGoogleMapImage = async () => {
    if (!googleMapUrl && !name) {
      setFetchError("Please enter a Google Maps Link or Institution Name first.");
      return;
    }
    setIsFetchingImage(true);
    setFetchError("");
    try {
      const res = await fetch(
        `/api/google-map-image?url=${encodeURIComponent(googleMapUrl)}&query=${encodeURIComponent(name || address)}&json=true`
      );
      const data = await res.json();
      if (data.success && data.imageUrl) {
        setFetchedImageUrl(data.imageUrl);
      } else {
        setFetchError("Could not gather image from link. Trying verified place listing...");
      }
    } catch (err) {
      setFetchError("Failed to fetch image from Google Maps.");
    } finally {
      setIsFetchingImage(false);
    }
  };

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

    const resolvedImg =
      fetchedImageUrl ||
      (googleMapUrl
        ? `/api/google-map-image?url=${encodeURIComponent(googleMapUrl)}&query=${encodeURIComponent(
            name || address
          )}`
        : "/prelilogin.png");

    if (!fetchedImageUrl && googleMapUrl) {
      setFetchedImageUrl(resolvedImg);
    }

    const newInst = {
      id: `pending-${Date.now()}`,
      nameEn: name,
      nameBn: nameBn || name,
      name,
      category,
      division,
      district,
      address,
      hours,
      contact,
      googleMapUrl,
      imageUrl: resolvedImg,
      status: "PENDING_VERIFICATION",
      userName: currentUserName,
      userId: currentUserId,
      createdAt: new Date().toISOString(),
    };

    // 1. Save to Supabase DB (unverified)
    try {
      await fetch("/api/institutions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newInst,
          isAdmin: false,
        }),
      });
    } catch (err) {
      console.warn("Could not save to Supabase:", err);
    }

    // 2. Save to localStorage so Admin Dashboard displays it instantly
    try {
      const saved = localStorage.getItem("jonomot_pending_institutions");
      const parsed = saved ? JSON.parse(saved) : [];
      localStorage.setItem(
        "jonomot_pending_institutions",
        JSON.stringify([newInst, ...parsed])
      );
    } catch (err) {
      console.error(err);
    }

    // 3. Save selected Google Form style checklist tips (if any selected)
    try {
      const allAvailableOptions = [
        ...GENERIC_CHECKLIST_OPTIONS,
        ...customTipsList,
      ];
      const finalSelectedTips = allAvailableOptions.filter((item) =>
        selectedChecklistIds.includes(item.id)
      );

      if (finalSelectedTips.length > 0) {
        const tipPayloads = finalSelectedTips.map((t, idx) => ({
          id: `tip-${newInst.id}-${idx}-${Date.now()}`,
          institutionId: newInst.id,
          title: t.title,
          titleBn: t.titleBn,
          taskLabel: t.taskLabel,
          upvoteCount: 1,
        }));
        const savedTipsStr =
          localStorage.getItem("jonomot_document_tips") || "[]";
        const savedTips = JSON.parse(savedTipsStr);
        localStorage.setItem(
          "jonomot_document_tips",
          JSON.stringify([...tipPayloads, ...savedTips])
        );

        tipPayloads.forEach((tip) => {
          fetch("/api/document-tips", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(tip),
          }).catch(() => {});
        });
      }
    } catch (err) {
      console.error("Error saving document tips:", err);
    }

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-brand-on-surface">
            Institution Submitted for Verification!
          </h2>
          <p className="text-sm text-brand-on-surface-variant max-w-md mx-auto">
            Thank you for helping expand Bangladesh&apos;s Civic Transparency Hub. <strong>{name}</strong> has been sent to our moderators for verification.
          </p>
        </div>
        <div className="pt-4 flex items-center justify-center gap-3">
          <Button
            variant="primary"
            onClick={() => {
              setSubmitted(false);
              setName("");
              setNameBn("");
              setAddress("");
            }}
          >
            Add Another Office
          </Button>
          <Link href="/">
            <Button variant="secondary">Return to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-on-surface-variant hover:text-brand-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home Dashboard</span>
        </Link>
      </div>

      <div className="bg-white border border-brand-outline rounded-3xl p-6 sm:p-10 shadow-sm space-y-8">
        <div className="border-b border-brand-outline pb-6 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Civic Directory Expansion</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-on-surface">
            Add Government Institution
          </h1>
          <p className="text-sm text-brand-on-surface-variant">
            Can&apos;t find an office in our hub? Submit the institution&apos;s details so citizens can start sharing verified experiences.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Names */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-brand-on-surface">
                Institution Name (English) *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., BRTA Uttara Circle-2"
                className="w-full bg-white border border-brand-outline rounded-xl px-4 py-2.5 text-sm font-medium text-brand-on-surface focus:outline-none focus:border-brand-primary"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-brand-on-surface">
                Institution Name (Bangla)
              </label>
              <input
                type="text"
                value={nameBn}
                onChange={(e) => setNameBn(e.target.value)}
                placeholder="e.g., বিআরটিএ উত্তরা সার্কেল-২"
                className="w-full bg-white border border-brand-outline rounded-xl px-4 py-2.5 text-sm font-medium text-brand-on-surface focus:outline-none focus:border-brand-primary"
              />
            </div>
          </div>

          {/* Category & Division */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-brand-on-surface">
                Service Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-white border border-brand-outline rounded-xl px-4 py-2.5 text-sm font-medium text-brand-on-surface focus:outline-none focus:border-brand-primary"
                required
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.nameBn} ({cat.name})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-brand-on-surface">
                Division *
              </label>
              <select
                value={division}
                onChange={(e) => setDivision(e.target.value)}
                className="w-full bg-white border border-brand-outline rounded-xl px-4 py-2.5 text-sm font-medium text-brand-on-surface focus:outline-none focus:border-brand-primary"
              >
                {["Dhaka", "Chattogram", "Rajshahi", "Khulna", "Sylhet", "Barishal", "Rangpur", "Mymensingh"].map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-brand-on-surface">
                District *
              </label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="e.g., Dhaka"
                className="w-full bg-white border border-brand-outline rounded-xl px-4 py-2.5 text-sm font-medium text-brand-on-surface focus:outline-none focus:border-brand-primary"
                required
              />
            </div>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-brand-on-surface">
              Street Address & Location *
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g., Sector 12, Uttara Model Town, Dhaka 1230"
              className="w-full bg-white border border-brand-outline rounded-xl px-4 py-2.5 text-sm font-medium text-brand-on-surface focus:outline-none focus:border-brand-primary"
              required
            />
          </div>

          {/* Google Maps Link & Photo Auto-Gatherer */}
          <div className="bg-brand-primary/5 border border-brand-primary/20 rounded-2xl p-4 sm:p-6 space-y-4">
            <div className="flex items-center gap-2 text-brand-primary font-bold text-sm">
              <Globe className="w-4 h-4" />
              <span>📍 Google Maps Link & Image Auto-Gatherer (গুগল ম্যাপ লিংক ও ছবি)</span>
            </div>
            <p className="text-xs text-brand-on-surface-variant">
              Paste the official Google Maps link for this institution. Our system will automatically gather the original listed photo directly from Google Maps.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="url"
                value={googleMapUrl}
                onChange={(e) => setGoogleMapUrl(e.target.value)}
                placeholder="https://maps.google.com/?q=... or https://goo.gl/maps/..."
                className="flex-1 bg-white border border-brand-outline rounded-xl px-4 py-2 text-sm text-brand-on-surface focus:outline-none focus:border-brand-primary"
              />
              <button
                type="button"
                onClick={handleFetchGoogleMapImage}
                disabled={isFetchingImage}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-brand-primary text-white font-bold text-xs hover:bg-brand-primary-dark transition-colors disabled:opacity-50 shadow-sm"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isFetchingImage ? "Gathering from Google..." : "✨ ছবি ও তথ্য আনুন"}</span>
              </button>
            </div>

            {fetchError && (
              <div className="flex items-center gap-2 text-xs text-rose-600 bg-rose-50 p-2.5 rounded-lg">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{fetchError}</span>
              </div>
            )}

            {fetchedImageUrl && (
              <div className="mt-3 p-3 bg-white border border-brand-outline rounded-xl flex items-center gap-4">
                <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-brand-outline shrink-0">
                  <Image
                    src={fetchedImageUrl}
                    alt="Gathered from Google Maps"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-xs font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Original Photo Gathered from Google Maps</span>
                  </div>
                  <p className="text-xs text-brand-on-surface-variant line-clamp-2">
                    {fetchedImageUrl}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Hours & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-brand-on-surface">
                Official Office Hours
              </label>
              <input
                type="text"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                placeholder="Sun–Thu: 9:00 AM – 5:00 PM"
                className="w-full bg-white border border-brand-outline rounded-xl px-4 py-2.5 text-sm font-medium text-brand-on-surface focus:outline-none focus:border-brand-primary"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-brand-on-surface">
                Contact Phone Number
              </label>
              <input
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="+880 2-XXXXXXX"
                className="w-full bg-white border border-brand-outline rounded-xl px-4 py-2.5 text-sm font-medium text-brand-on-surface focus:outline-none focus:border-brand-primary"
              />
            </div>
          </div>

          {/* "সাথে আনুন (Bring These)" Google Form Style Checkbox Selector */}
          <div className="bg-white rounded-2xl border border-brand-outline p-6 space-y-5 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-brand-primary" />
                <h3 className="text-base font-bold text-brand-on-surface">
                  সাথে আনুন (Bring These) — প্রয়োজনীয় কাগজপত্র ও ডকুমেন্ট চেকলিস্ট
                </h3>
              </div>
            </div>
            <p className="text-xs text-brand-on-surface-variant leading-relaxed">
              Select any required documents visitors should bring when visiting this institution. Only the items you check will appear on the institution page. If you leave all boxes unchecked, the document checklist will remain blank.
            </p>

            {/* Checkboxes List */}
            <div className="space-y-2.5">
              {GENERIC_CHECKLIST_OPTIONS.map((item) => {
                const isChecked = selectedChecklistIds.includes(item.id);
                return (
                  <label
                    key={item.id}
                    onClick={() => toggleChecklistId(item.id)}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isChecked
                        ? "bg-emerald-50/70 border-brand-primary/60 text-brand-on-surface shadow-xs"
                        : "bg-gray-50/60 border-gray-200 text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                      className="mt-0.5 h-4 w-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
                    />
                    <div className="flex-1">
                      <span className="block text-xs font-bold text-brand-primary">
                        {item.taskLabel}
                      </span>
                      <span className="block text-xs font-medium mt-0.5">
                        {item.titleBn} ({item.title})
                      </span>
                    </div>
                  </label>
                );
              })}

              {/* Custom options already added */}
              {customTipsList.map((item) => {
                const isChecked = selectedChecklistIds.includes(item.id);
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3.5 rounded-xl border bg-emerald-50/70 border-brand-primary/60"
                  >
                    <label
                      onClick={() => toggleChecklistId(item.id)}
                      className="flex items-start gap-3 cursor-pointer flex-1"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="mt-0.5 h-4 w-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
                      />
                      <div>
                        <span className="block text-xs font-bold text-brand-primary">
                          {item.taskLabel}
                        </span>
                        <span className="block text-xs font-medium mt-0.5">
                          {item.titleBn}
                        </span>
                      </div>
                    </label>
                    <button
                      type="button"
                      onClick={(e) => handleRemoveCustomTip(item.id, e)}
                      className="p-1.5 text-rose-600 hover:bg-rose-100 rounded-lg transition-colors"
                      title="Remove custom item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Add Manual Option */}
            <div className="pt-2 border-t border-gray-100 flex flex-col sm:flex-row gap-2.5">
              <input
                type="text"
                value={customTipTitle}
                onChange={(e) => setCustomTipTitle(e.target.value)}
                placeholder="অন্যান্য কাগজপত্র যোগ করুন (e.g. উত্তরাধিকার সনদপত্র...)"
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-xs font-medium text-gray-800 focus:outline-none focus:border-brand-primary focus:bg-white"
              />
              <button
                type="button"
                onClick={handleAddCustomTip}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-brand-primary/10 text-brand-primary hover:bg-brand-primary hover:text-white font-bold text-xs transition-colors shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Custom Option</span>
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-brand-outline">
            <Link href="/">
              <Button variant="secondary" type="button">
                Cancel
              </Button>
            </Link>
            <Button variant="primary" type="submit" className="px-8 font-bold">
              Submit for Verification
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

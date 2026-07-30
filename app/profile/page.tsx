"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase, handleCitizenLogout, getMergedClientReports } from "@/lib/supabase";
import { INITIAL_REPORTS } from "@/lib/mockData";
import { ReportCard } from "@/components/reports/ReportCard";
import { Button } from "@/components/common/Button";
import { Badge } from "@/components/common/Badge";
import {
  User,
  Mail,
  MapPin,
  ShieldCheck,
  FileText,
  LogOut,
  Plus,
  Camera,
  Loader2,
  CheckCircle2,
  Edit2,
  Check,
  X,
} from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [userProfile, setUserProfile] = useState<{
    name: string;
    email: string;
    avatar_url: string;
  }>({
    name: "Citizen Account (নাগরিক প্রোফাইল)",
    email: "citizen@gmail.com",
    avatar_url:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80",
  });

  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [photoSuccessMsg, setPhotoSuccessMsg] = useState("");
  const [userReports, setUserReports] = useState<any[]>(INITIAL_REPORTS.slice(0, 2));

  // Optional simple name editing
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState("");

  useEffect(() => {
    let currentUserId = "citizen@gmail.com";
    try {
      const stored = localStorage.getItem("jonomot_user");
      if (stored) {
        const parsed = JSON.parse(stored);
        currentUserId = parsed.email || parsed.id || "citizen@gmail.com";
        let savedAvatar = null;
        try {
          const emailKey = parsed.email || "default_citizen";
          const savedAvatars = JSON.parse(localStorage.getItem("jonomot_user_avatars") || "{}");
          savedAvatar = savedAvatars[emailKey] || localStorage.getItem("jonomot_last_avatar");
        } catch {}

        setUserProfile({
          name: parsed.name || "Citizen Account (নাগরিক প্রোফাইল)",
          email: parsed.email || "citizen@gmail.com",
          avatar_url:
            savedAvatar ||
            parsed.avatar_url ||
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80",
        });
        setTempName(parsed.name || "Citizen Account (নাগরিক প্রোফাইল)");
      } else {
        setTempName("Citizen Account (নাগরিক প্রোফাইল)");
      }
    } catch (err) {
      console.warn("Could not read local user profile:", err);
    }

    const loadUserReports = () => {
      fetch(`/api/reports?userId=${encodeURIComponent(currentUserId)}`)
        .then((res) => res.json())
        .then((data) => {
          const list = data?.reports || data?.data || [];
          const merged = getMergedClientReports(list);
          const userOnly = merged.filter(
            (r) =>
              r.userId === currentUserId ||
              r.userId === "user-demo" ||
              r.userId === "citizen@gmail.com" ||
              r.id.startsWith("rep-")
          );
          setUserReports(userOnly.length > 0 ? userOnly : merged);
        })
        .catch(() => {
          const merged = getMergedClientReports(INITIAL_REPORTS);
          setUserReports(merged);
        });
    };

    loadUserReports();
    window.addEventListener("jonomot_report_submitted", loadUserReports);
    window.addEventListener("jonomot_admin_approved", loadUserReports);

    return () => {
      window.removeEventListener("jonomot_report_submitted", loadUserReports);
      window.removeEventListener("jonomot_admin_approved", loadUserReports);
    };
  }, []);

  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingPhoto(true);
    setPhotoSuccessMsg("");

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
        console.warn("API upload fallback for profile photo:", err);
      }

      // 100% Reliable Base64 fallback if server API is unavailable
      if (!finalUrl) {
        finalUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      }

      if (finalUrl) {
        const updated = { ...userProfile, avatar_url: finalUrl };
        setUserProfile(updated);

        try {
          const stored = localStorage.getItem("jonomot_user");
          const parsed = stored ? JSON.parse(stored) : {};
          parsed.avatar_url = finalUrl;
          localStorage.setItem("jonomot_user", JSON.stringify(parsed));

          // Save to persistent avatar store so it is never lost after logout/login
          localStorage.setItem("jonomot_last_avatar", finalUrl);
          const emailKey = parsed.email || userProfile.email || "default_citizen";
          const savedAvatars = JSON.parse(localStorage.getItem("jonomot_user_avatars") || "{}");
          savedAvatars[emailKey] = finalUrl;
          localStorage.setItem("jonomot_user_avatars", JSON.stringify(savedAvatars));

          // Notify all components (like top header) of the auth/avatar change
          window.dispatchEvent(new Event("jonomot_auth_change"));
        } catch (err) {
          console.warn("Failed to update localStorage avatar store:", err);
        }

        // Also update Supabase Auth metadata in background
        supabase.auth.updateUser({ data: { avatar_url: finalUrl } }).catch(() => {});

        setPhotoSuccessMsg("ছবি সফলভাবে আপডেট হয়েছে! (Photo updated successfully)");
        setTimeout(() => setPhotoSuccessMsg(""), 4000);
      }
    } catch (err) {
      console.error("Avatar upload error:", err);
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleSaveName = () => {
    if (!tempName.trim()) return;
    const updated = { ...userProfile, name: tempName.trim() };
    setUserProfile(updated);
    setIsEditingName(false);

    try {
      const stored = localStorage.getItem("jonomot_user");
      const parsed = stored ? JSON.parse(stored) : {};
      parsed.name = tempName.trim();
      localStorage.setItem("jonomot_user", JSON.stringify(parsed));
    } catch (err) {
      console.warn("Failed to update name in localStorage:", err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Hidden file input for photo upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handlePhotoSelect}
        accept="image/*"
        className="hidden"
      />

      {/* Profile Banner Card */}
      <div className="relative overflow-hidden bg-white/95 backdrop-blur-md border border-gray-200/80 rounded-3xl p-6 sm:p-10 shadow-xl shadow-emerald-950/5">
        {/* Subtle decorative top border accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#003527] via-emerald-600 to-[#003527]" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Avatar with Camera Button Overlay */}
            <div className="relative group shrink-0">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-emerald-50 shadow-lg relative bg-gray-100">
                <img
                  src={userProfile.avatar_url}
                  alt="Citizen Profile"
                  className="w-full h-full object-cover"
                />
                {isUploadingPhoto && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                  </div>
                )}
              </div>

              {/* Clickable Camera Badge / Overlay */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingPhoto}
                title="ছবি পরিবর্তন করুন (Change Photo)"
                className="absolute bottom-1 right-1 sm:bottom-1 sm:right-1 bg-[#003527] hover:bg-emerald-700 text-white p-2.5 rounded-full shadow-md transition-all transform hover:scale-110 active:scale-95 border-2 border-white flex items-center justify-center"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>

            {/* Profile Meta */}
            <div className="space-y-2">
              <div className="flex items-center gap-3 flex-wrap">
                {!isEditingName ? (
                  <>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                      {userProfile.name}
                    </h1>
                    <button
                      onClick={() => setIsEditingName(true)}
                      className="text-gray-400 hover:text-emerald-700 transition-colors p-1 rounded-md hover:bg-gray-100"
                      title="নাম পরিবর্তন করুন (Edit Name)"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      className="border border-emerald-300 rounded-lg px-3 py-1.5 text-lg font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="আপনার নাম লিখুন..."
                    />
                    <button
                      onClick={handleSaveName}
                      className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                      title="সংরক্ষণ করুন (Save)"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setIsEditingName(false)}
                      className="p-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
                      title="বাতিল করুন (Cancel)"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
                <Badge variant="success">Verified via Gmail</Badge>
              </div>

              {/* Email, Location, Badge */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs sm:text-sm text-gray-600">
                <span className="flex items-center gap-1.5 font-medium text-gray-700">
                  <Mail className="w-4 h-4 text-emerald-600" />
                  <span>{userProfile.email}</span>
                </span>
                <span className="flex items-center gap-1.5 font-medium text-gray-700">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <span>Dhaka Division (ঢাকা বিভাগ)</span>
                </span>
                <span className="inline-flex items-center gap-1 text-emerald-800 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Jonomot Contributor</span>
                </span>
              </div>

              {/* Photo Upload Success Alert */}
              {photoSuccessMsg && (
                <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{photoSuccessMsg}</span>
                </div>
              )}
            </div>
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-end pt-4 md:pt-0 border-t md:border-t-0 border-gray-100">
            <Link href="/report/new">
              <Button variant="primary" className="gap-2 text-xs sm:text-sm font-bold shadow-md">
                <Plus className="w-4 h-4" />
                <span>অভিজ্ঞতা জমা দিন (Submit Experience)</span>
              </Button>
            </Link>
            <Button
              variant="outline"
              className="gap-2 text-xs sm:text-sm font-bold text-red-600 border-red-200 hover:bg-red-50"
              onClick={() => handleCitizenLogout(router)}
              title="লগআউট করুন (Logout)"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">লগআউট (Logout)</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Submitted Experiences Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-gray-200 pb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#003527]" />
            <h2 className="text-lg sm:text-xl font-extrabold text-gray-900">
              আমার সাবমিট করা অভিজ্ঞতা (My Submitted Experiences)
            </h2>
            <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-[#003527]">
              {userReports.length}
            </span>
          </div>
          <Link href="/feed" className="text-xs font-bold text-emerald-700 hover:underline">
            সকল অভিজ্ঞতা দেখুন →
          </Link>
        </div>

        {userReports.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
              <FileText className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-gray-900 text-base">
                এখনো কোনো অভিজ্ঞতা জমা দেওয়া হয়নি
              </h3>
              <p className="text-sm text-gray-500 max-w-sm mx-auto">
                সরকারি সেবা গ্রহণের অভিজ্ঞতা শেয়ার করুন এবং স্বচ্ছতা প্রতিষ্ঠায় ভূমিকা রাখুন।
              </p>
            </div>
            <Link href="/report/new" className="inline-block">
              <Button variant="primary" className="text-xs">
                + প্রথম অভিজ্ঞতা জমা দিন
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {userReports.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

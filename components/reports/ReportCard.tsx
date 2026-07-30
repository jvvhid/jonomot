"use client";

import React, { useState } from "react";
import { ReportItem } from "@/lib/mockData";
import {
  Star,
  ThumbsUp,
  ThumbsDown,
  CheckCircle,
  Calendar,
  ShieldCheck,
  Flag,
  Video,
  Tag,
} from "lucide-react";
import { Badge } from "@/components/common/Badge";

interface ReportCardProps {
  report: ReportItem;
  showInstitutionName?: boolean;
}

export function ReportCard({ report, showInstitutionName = true }: ReportCardProps) {
  const [upvotes, setUpvotes] = useState(report.upvotes);
  const [hasUpvoted, setHasUpvoted] = useState(false);

  const [downvotes, setDownvotes] = useState(Math.max(1, Math.floor(report.upvotes / 6)));
  const [hasDownvoted, setHasDownvoted] = useState(false);
  const [hasFlagged, setHasFlagged] = useState(false);

  const handleUpvote = (e: React.MouseEvent) => {
    e.preventDefault();
    if (hasUpvoted) {
      setUpvotes(upvotes - 1);
      setHasUpvoted(false);
    } else {
      setUpvotes(upvotes + 1);
      setHasUpvoted(true);
      if (hasDownvoted) {
        setDownvotes(downvotes - 1);
        setHasDownvoted(false);
      }
      fetch("/api/reports", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: report.id, action: "upvote", currentUpvotes: upvotes }),
      }).catch(() => {});
    }
  };

  const handleDownvote = (e: React.MouseEvent) => {
    e.preventDefault();
    if (hasDownvoted) {
      setDownvotes(downvotes - 1);
      setHasDownvoted(false);
    } else {
      setDownvotes(downvotes + 1);
      setHasDownvoted(true);
      if (hasUpvoted) {
        setUpvotes(upvotes - 1);
        setHasUpvoted(false);
      }
    }
  };

  const handleFlag = (e: React.MouseEvent) => {
    e.preventDefault();
    if (hasFlagged) return;
    setHasFlagged(true);
    fetch("/api/flags", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reportId: report.id,
        reason: "Community Moderator Flag",
      }),
    }).catch(() => {});
    alert("আপনার অভিযোগটি মডারেটর টিমের পর্যালোচনার জন্য জমা দেওয়া হয়েছে। ধন্যবাদ! (Report flagged for moderator review)");
  };

  const getTagColorClass = (tag?: string) => {
    if (!tag) return "bg-gray-100 text-gray-800 border-gray-300";
    if (tag.includes("ভালো ব্যবহার")) {
      return "bg-emerald-50 text-emerald-800 border-emerald-300";
    }
    if (tag.includes("ঘুষ") || tag.includes("দালাল") || tag.includes("দুর্ব্যবহার")) {
      return "bg-red-50 text-red-800 border-red-300";
    }
    return "bg-amber-50 text-amber-900 border-amber-300";
  };

  return (
    <div className="bg-white border border-brand-outline rounded-2xl p-5 hover:shadow-card transition-all space-y-3">
      {/* Header: Citizen & Verified Tag */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-brand-primary/10 text-brand-primary font-bold flex items-center justify-center text-xs">
            {report.userName.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold text-brand-on-surface">
                {report.userName}
              </span>
              {report.userRole !== "CITIZEN" && (
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-brand-primary text-white">
                  <ShieldCheck className="w-3 h-3" />
                  {report.userRole}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-brand-on-surface-variant">
              <span>{report.createdAt}</span>
              <span>•</span>
              <span className="inline-flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {report.visitDate}
              </span>
            </div>
          </div>
        </div>

        {report.verified && (
          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>যাচাইকৃত ভিজিট (Verified)</span>
          </div>
        )}
      </div>

      {/* Institution name tag if in main feed */}
      {showInstitutionName && (
        <div className="text-xs font-semibold text-brand-primary bg-brand-primary/5 px-2.5 py-1 rounded-lg inline-block">
          {report.institutionName}
        </div>
      )}

      {/* Title & Star Rating & Civic Tag */}
      <div className="space-y-1.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, idx) => (
              <Star
                key={idx}
                className={`w-4 h-4 ${
                  idx < report.rating
                    ? "fill-amber-400 text-amber-400"
                    : "text-gray-200"
                }`}
              />
            ))}
          </div>

          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-bold border ${getTagColorClass(
              report.civicTag
            )}`}
          >
            <Tag className="w-3 h-3" />
            {report.civicTag}
          </span>
        </div>

        <h4 className="text-base font-bold text-brand-on-surface flex items-center gap-2">
          <span>{report.title}</span>
          {report.hasVideoProof && (
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700 border border-red-200"
              title="ভিডিও প্রমাণ সংযুক্ত (Video Proof Attached)"
            >
              <Video className="w-3 h-3 text-red-600" />
              ভিডিও প্রমাণ
            </span>
          )}
        </h4>
      </div>

      {/* Description */}
      <p className="text-sm text-brand-on-surface-variant leading-relaxed">
        {report.description}
      </p>

      {/* Attached Photos / Proofs */}
      {report.photoUrls && report.photoUrls.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2">
          {report.photoUrls.map((photo, i) => (
            <div
              key={i}
              className="relative group rounded-lg overflow-hidden border border-gray-200 bg-gray-50 shadow-sm"
            >
              <img
                src={photo}
                alt={`প্রমাণ ছবি (Evidence ${i + 1})`}
                className="h-28 w-40 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded">
                ছবি #{i + 1}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Playable Video Proof Player or Video Evidence Badge */}
      {report.videoUrl ? (
        <div className="mt-2 rounded-xl overflow-hidden border border-gray-200 bg-black max-w-sm shadow-sm">
          <video
            src={report.videoUrl}
            controls
            className="w-full max-h-64 object-contain"
          />
        </div>
      ) : (
        report.hasVideoProof && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 mt-1 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
            <Video className="w-3.5 h-3.5 text-emerald-600" />
            <span>ভিডিও প্রমাণ সংযুক্ত (Video Evidence Verified)</span>
          </div>
        )
      )}

      {/* Footer: Upvote (Agree) & Downvote (Disagree) & Flag */}
      <div className="pt-3 border-t border-brand-outline flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {/* Upvote: Agree / True */}
          <button
            onClick={handleUpvote}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all active:scale-95 ${
              hasUpvoted
                ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                : "bg-emerald-50/50 text-emerald-800 border-emerald-200 hover:bg-emerald-100/70"
            }`}
            title="তথ্যটি সত্য ও একমত (Agree & Verify)"
          >
            <ThumbsUp className="w-3.5 h-3.5" />
            <span>সত্য ও একমত ({upvotes})</span>
          </button>

          {/* Downvote: Disagree / False */}
          <button
            onClick={handleDownvote}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all active:scale-95 ${
              hasDownvoted
                ? "bg-red-600 text-white border-red-600 shadow-sm"
                : "bg-red-50/50 text-red-800 border-red-200 hover:bg-red-100/70"
            }`}
            title="তথ্যটি সঠিক নয় (Disagree / Misleading)"
          >
            <ThumbsDown className="w-3.5 h-3.5" />
            <span>ভুল তথ্য / একমত নই ({downvotes})</span>
          </button>
        </div>

        <button
          onClick={handleFlag}
          disabled={hasFlagged}
          className={`text-xs font-semibold transition-colors inline-flex items-center gap-1 px-2.5 py-1 rounded-lg ${
            hasFlagged
              ? "bg-red-100 text-red-800 border border-red-200 cursor-not-allowed font-bold"
              : "text-brand-on-surface-variant hover:text-red-600 hover:bg-red-50"
          }`}
          title="Flag Report"
        >
          <Flag className={`w-3.5 h-3.5 ${hasFlagged ? "text-red-600 fill-red-600" : ""}`} />
          <span>{hasFlagged ? "ফ্ল্যাগ করা হয়েছে (Flagged)" : "রিপোর্ট করুন (Flag)"}</span>
        </button>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { InstitutionItem, getGoogleMapUrl } from "@/lib/mockData";
import {
  Star,
  MapPin,
  Bookmark,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
  TrendingUp,
  Award,
  Users,
  ExternalLink,
} from "lucide-react";
import { Badge } from "@/components/common/Badge";
import { calculateJanomotMetrics } from "@/lib/janomotMetrics";

interface InstitutionCardProps {
  institution: InstitutionItem;
  allReports?: any[];
  isBookmarked?: boolean;
  onToggleBookmark?: (id: string) => void;
}

export function InstitutionCard({
  institution,
  allReports,
  isBookmarked = false,
  onToggleBookmark,
}: InstitutionCardProps) {
  const [saved, setSaved] = useState(isBookmarked);
  const metrics = calculateJanomotMetrics(institution, allReports);

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSaved(!saved);
    if (onToggleBookmark) {
      onToggleBookmark(institution.id);
    }
  };

  // Grade color mapping
  const gradeColor =
    metrics.grade === "A+" || metrics.grade === "A"
      ? "bg-[#003527] text-white border-emerald-500 shadow-emerald-900/10"
      : metrics.grade === "B"
      ? "bg-emerald-700 text-white border-emerald-600"
      : metrics.grade === "C"
      ? "bg-amber-500 text-white border-amber-400"
      : "bg-red-600 text-white border-red-500";

  return (
    <div className="group relative flex flex-col bg-white border border-brand-outline rounded-2xl p-5 transition-all duration-200 hover:shadow-card-hover hover:border-brand-primary/30">
      {/* Institution Picture Banner */}
      <Link
        href={`/institutions/${institution.id}`}
        className="w-full h-36 rounded-xl overflow-hidden mb-4 bg-gray-100 relative block group-hover:opacity-95 transition-opacity"
      >
        <img
          src={institution.imageUrl}
          alt={institution.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src =
              "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Government_Seal_of_Bangladesh.svg/800px-Government_Seal_of_Bangladesh.svg.png";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-white text-xs font-bold">
          <span className="truncate drop-shadow-sm">{institution.division} Division</span>
          <span className="bg-black/50 backdrop-blur-xs px-2 py-0.5 rounded text-[10px]">
            {metrics.totalReports} Reports
          </span>
        </div>
      </Link>

      {/* Top section with Thumbnail, Grade Badge & Bookmark action */}
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-3">
          {/* Grade Badge: A+, A, B, C, D, F per specification */}
          <div
            className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center shrink-0 font-extrabold border-2 shadow-sm ${gradeColor}`}
            title={`Institution Grade: ${metrics.grade} (Janomot Score: ${metrics.janomotScore})`}
          >
            <span className="text-xl leading-none">{metrics.grade}</span>
            <span className="text-[9px] uppercase font-bold opacity-80 mt-0.5">
              Grade
            </span>
          </div>

          <div>
            <div className="flex items-center gap-1.5 flex-wrap mb-1">
              <Badge variant="primary">{institution.category}</Badge>
              {metrics.weeklyScoreChange > 0 && (
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                  <TrendingUp className="w-3 h-3" />+{metrics.weeklyScoreChange}{" "}
                  Trending
                </span>
              )}
            </div>
            <Link
              href={`/institutions/${institution.id}`}
              className="group-hover:text-brand-primary transition-colors block"
            >
              <h3 className="text-lg font-semibold text-brand-on-surface leading-tight">
                {institution.name}
              </h3>
              {institution.nameBn && (
                <p className="text-xs text-brand-on-surface-variant font-medium mt-0.5">
                  {institution.nameBn}
                </p>
              )}
            </Link>
          </div>
        </div>

      </div>

      {/* Address & Google Map Link */}
      <div className="space-y-2 text-xs text-brand-on-surface-variant mb-3">
        <div className="flex items-center justify-between gap-2 bg-gray-50 p-2 rounded-lg border border-gray-100">
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-brand-primary shrink-0" />
            <span className="truncate font-medium text-gray-700">{institution.address}</span>
          </div>
          <a
            href={getGoogleMapUrl(institution)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="shrink-0 inline-flex items-center gap-1 bg-emerald-100 hover:bg-emerald-200 text-[#003527] px-2.5 py-1 rounded-md text-[11px] font-extrabold transition-colors shadow-2xs"
          >
            <span>Google Map</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
        {institution.hours && (
          <div className="flex items-center gap-1.5 pl-1">
            <Clock className="w-3.5 h-3.5 text-brand-on-surface-variant shrink-0" />
            <span>{institution.hours}</span>
          </div>
        )}
      </div>

      {/* Analytical civic transparency metrics grid (Janomot v3 specs) */}
      <div className="grid grid-cols-3 gap-2 bg-gray-50/80 p-2.5 rounded-xl border border-gray-100 my-2 text-xs">
        {/* Citizen Satisfaction */}
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-500 font-medium">
            Satisfaction
          </span>
          <span className="font-extrabold text-[#003527] flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-emerald-600" />
            {metrics.citizenSatisfaction}%
          </span>
        </div>

        {/* Category Tag Health */}
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-500 font-medium">
            Civic Health
          </span>
          <span className="font-extrabold text-gray-800 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            {metrics.categoryTagHealth}%
          </span>
        </div>

        {/* Letter Grade */}
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-500 font-medium">
            Grade
          </span>
          <span className="font-extrabold text-emerald-900 text-sm">
            {metrics.grade}
          </span>
        </div>
      </div>

      {/* Footer with Janamot Score (Main Ranking Metric 0-100) and Overall Rating */}
      <div className="mt-auto pt-3 border-t border-brand-outline flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Janomot Score (Main Ranking Metric) */}
          <div
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#003527] text-white text-xs font-extrabold shadow-sm"
            title="Janomot Score = 50% Avg Rating + 25% Helpful Ratio + 15% Resolution Rate + 10% Recent Activity"
          >
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>{metrics.janomotScore} জনমত স্কোর</span>
          </div>

          {/* Overall Rating (Simple average Σ Ratings / Total) */}
          <div className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
            <span>{metrics.overallRating}</span>
          </div>

          <span className="text-xs text-brand-on-surface-variant font-medium">
            ({metrics.totalReports} reports)
          </span>
        </div>

        <Link
          href={`/institutions/${institution.id}`}
          className="inline-flex items-center gap-1 text-xs font-bold text-brand-primary hover:underline"
        >
          <span>View Hub</span>
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

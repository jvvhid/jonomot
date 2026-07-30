"use client";

import React, { useState } from "react";
import Link from "next/link";
import { INSTITUTIONS } from "@/lib/mockData";
import { InstitutionCard } from "@/components/institutions/InstitutionCard";
import { Button } from "@/components/common/Button";
import { Bookmark, ArrowLeft, Building2 } from "lucide-react";

export default function BookmarksPage() {
  const [institutions, setInstitutions] = useState<any[]>(INSTITUTIONS);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [userId, setUserId] = useState("citizen@gmail.com");

  React.useEffect(() => {
    let currentId = "citizen@gmail.com";
    try {
      const stored = localStorage.getItem("jonomot_user");
      if (stored) {
        const parsed = JSON.parse(stored);
        currentId = parsed.email || parsed.id || "citizen@gmail.com";
        setUserId(currentId);
      }
    } catch {}

    fetch("/api/institutions")
      .then((res) => res.json())
      .then((data) => {
        if (data?.data && Array.isArray(data.data)) {
          setInstitutions(data.data);
        }
      })
      .catch(() => {});

    fetch(`/api/bookmarks?userId=${encodeURIComponent(currentId)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.bookmarkedIds && Array.isArray(data.bookmarkedIds)) {
          if (data.bookmarkedIds.length > 0) {
            setBookmarkedIds(data.bookmarkedIds);
          } else {
            setBookmarkedIds(["brta-dhaka-metro-circle-1-mirpur", "dmch-dhaka"]);
          }
        }
      })
      .catch(() => {
        setBookmarkedIds(["brta-dhaka-metro-circle-1-mirpur", "dmch-dhaka"]);
      });
  }, []);

  const toggleBookmark = async (id: string) => {
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );

    await fetch("/api/bookmarks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, institutionId: id }),
    }).catch(() => {});
  };

  const bookmarkedInstitutions = institutions.filter((inst) =>
    bookmarkedIds.includes(inst.id)
  );

  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-on-surface-variant hover:text-brand-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home Dashboard</span>
        </Link>
      </div>

      <div className="flex items-center justify-between border-b border-brand-outline pb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-brand-primary/10 text-brand-primary">
              <Bookmark className="w-6 h-6 fill-current" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-on-surface">
              Saved Government Institutions
            </h1>
          </div>
          <p className="text-sm text-brand-on-surface-variant mt-1">
            Your personalized bookmarks for quick access to office hours and citizen experiences.
          </p>
        </div>

        {bookmarkedIds.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setBookmarkedIds([])}
          >
            Clear All Bookmarks
          </Button>
        )}
      </div>

      {bookmarkedInstitutions.length === 0 ? (
        <div className="bg-white border border-brand-outline rounded-2xl p-16 text-center max-w-xl mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-brand-background text-brand-primary flex items-center justify-center mx-auto">
            <Building2 className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-brand-on-surface">
              No Bookmarks Saved Yet
            </h3>
            <p className="text-sm text-brand-on-surface-variant mt-1">
              Browse government offices on the home dashboard and click the bookmark icon to save institutions for fast access.
            </p>
          </div>
          <Link href="/#institutions">
            <Button variant="primary">Explore Institutions Directory</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarkedInstitutions.map((inst) => (
            <InstitutionCard
              key={inst.id}
              institution={inst}
              isBookmarked={true}
              onToggleBookmark={toggleBookmark}
            />
          ))}
        </div>
      )}
    </div>
  );
}

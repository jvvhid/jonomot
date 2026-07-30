"use client";

import React, { useState } from "react";
import { Search, MapPin, Filter, X } from "lucide-react";
import { CATEGORIES } from "../../lib/mockData";

interface GlobalSearchBarProps {
  onSearch?: (query: string, category: string, division: string) => void;
  variant?: "hero" | "page";
  initialQuery?: string;
  initialCategory?: string;
  initialDivision?: string;
}

export function GlobalSearchBar({
  onSearch,
  variant = "hero",
  initialQuery = "",
  initialCategory = "ALL",
  initialDivision = "ALL",
}: GlobalSearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [division, setDivision] = useState(initialDivision);

  const divisions = ["ALL", "Dhaka", "Chattogram", "Rajshahi", "Khulna", "Sylhet", "Barishal", "Rangpur", "Mymensingh"];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query, category, division);
    }
  };

  const handleClear = () => {
    setQuery("");
    setCategory("ALL");
    setDivision("ALL");
    if (onSearch) {
      onSearch("", "ALL", "ALL");
    }
  };

  const isHero = variant === "hero";

  return (
    <form
      onSubmit={handleSearchSubmit}
      className={`w-full max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-2 p-2 rounded-2xl md:rounded-full transition-shadow ${
        isHero
          ? "bg-white border-2 border-brand-primary shadow-lg"
          : "bg-white border border-brand-outline shadow-sm hover:border-brand-primary"
      }`}
    >
      {/* Search Input */}
      <div className="relative flex-1 w-full flex items-center pl-4 pr-2">
        <Search className="w-5 h-5 text-brand-on-surface-variant shrink-0 mr-2" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (onSearch) onSearch(e.target.value, category, division);
          }}
          placeholder="Search government office, service or hospital (e.g., BRTA, DMCH, Passport)..."
          className="w-full bg-transparent text-sm font-medium text-brand-on-surface placeholder:text-brand-on-surface-variant focus:outline-none py-2"
        />
        {(query || category !== "ALL" || division !== "ALL") && (
          <button
            type="button"
            onClick={handleClear}
            className="p-1 rounded-full text-brand-on-surface-variant hover:bg-brand-background transition-colors"
            title="Clear Search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Division Selector */}
      <div className="w-full md:w-auto flex items-center border-t md:border-t-0 md:border-l border-brand-outline px-3 py-1">
        <MapPin className="w-4 h-4 text-brand-on-surface-variant shrink-0 mr-1.5" />
        <select
          value={division}
          onChange={(e) => {
            setDivision(e.target.value);
            if (onSearch) onSearch(query, category, e.target.value);
          }}
          className="bg-transparent text-xs font-semibold text-brand-on-surface focus:outline-none cursor-pointer py-1.5 pr-2"
          aria-label="Select Division"
        >
          <option value="ALL">All Bangladesh</option>
          {divisions
            .filter((d) => d !== "ALL")
            .map((div) => (
              <option key={div} value={div}>
                {div} Division
              </option>
            ))}
        </select>
      </div>

      {/* Category Selector */}
      <div className="w-full md:w-auto flex items-center border-t md:border-t-0 md:border-l border-brand-outline px-3 py-1">
        <Filter className="w-4 h-4 text-brand-on-surface-variant shrink-0 mr-1.5" />
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            if (onSearch) onSearch(query, e.target.value, division);
          }}
          className="bg-transparent text-xs font-semibold text-brand-on-surface focus:outline-none cursor-pointer py-1.5 pr-2"
          aria-label="Select Service Category"
        >
          <option value="ALL">All Categories</option>
          {CATEGORIES.map((cat) => (
            <option key={cat.id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Search Button */}
      <button
        type="submit"
        className="w-full md:w-auto px-6 py-2.5 rounded-xl md:rounded-full bg-brand-primary text-white text-sm font-semibold hover:bg-brand-primary-dark transition-colors shrink-0 shadow-sm"
      >
        Search Hub
      </button>
    </form>
  );
}

"use client";
import { useState } from "react";
import { Search, Flame, Video, Sparkles, Calendar, Eye, TrendingUp, Share2 } from "lucide-react";
import type { Locale, FactCheck, VerdictInfo } from "@/lib/types";
import { useTranslations } from "@/lib/i18n";
import FactCard from "./FactCard";

interface FeedFiltersProps {
  lang: Locale;
  factChecks: FactCheck[];
  verdicts: VerdictInfo[];
  featuredBadgeText?: string;
  featuredArticleSlug?: string;
  featuredTitleOverride?: string;
  featuredSummaryOverride?: string;
  featuredImageOverride?: string;
}

export default function FeedFilters({
  lang,
  factChecks,
  verdicts,
  featuredBadgeText,
  featuredArticleSlug,
  featuredTitleOverride,
  featuredSummaryOverride,
  featuredImageOverride,
}: FeedFiltersProps) {
  const t = useTranslations(lang);
  const [activeTab, setActiveTab] = useState<"all" | "trending" | "videos">("all");
  const [trendingFilter, setTrendingFilter] = useState<"all" | "thisWeek" | "mostRead" | "rising" | "mostShared">("all");
  const [query, setQuery] = useState("");
  const [verdict, setVerdict] = useState<string>("all");

  const featured =
    (featuredArticleSlug ? factChecks.find((fc) => fc.slug === featuredArticleSlug) : null) ||
    factChecks.find((fc) => fc.isFeatured) ||
    factChecks[0];

  // Helper for 7-day window
  const isWithinPast7Days = (dateStr: string) => {
    const time = new Date(dateStr).getTime();
    if (isNaN(time)) return false;
    const diffDays = Math.abs(Date.now() - time) / (1000 * 60 * 60 * 24);
    return diffDays <= 7;
  };

  // 1. Tab filtering & sorting
  let tabFiltered = [...factChecks];

  if (activeTab === "videos") {
    tabFiltered = tabFiltered.filter(
      (fc) => fc.categorySlug === "videos" || fc.contentType === "video" || Boolean(fc.videoUrl)
    );
  } else if (activeTab === "trending") {
    const baseTrending = tabFiltered.filter((fc) => fc.isTrending || (fc.viewsCount && fc.viewsCount > 5000));
    let pool = baseTrending.length > 0 ? baseTrending : tabFiltered;

    if (trendingFilter === "thisWeek") {
      const recent = pool.filter((fc) => isWithinPast7Days(fc.publishDate));
      pool = recent.length > 0 ? recent : [...pool].sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()).slice(0, 3);
    } else if (trendingFilter === "mostRead") {
      pool = [...pool].sort((a, b) => (b.viewsCount || 0) - (a.viewsCount || 0));
    } else if (trendingFilter === "mostShared") {
      pool = [...pool].sort((a, b) => (b.sharesCount || 0) - (a.sharesCount || 0));
    } else if (trendingFilter === "rising") {
      pool = [...pool].sort((a, b) => {
        if (Boolean(b.isTrending) !== Boolean(a.isTrending)) {
          return b.isTrending ? 1 : -1;
        }
        const scoreB = (b.viewsCount || 0) + (b.sharesCount || 0) * 3;
        const scoreA = (a.viewsCount || 0) + (a.sharesCount || 0) * 3;
        return scoreB - scoreA;
      });
    } else {
      // all trending
      pool = [...pool].sort((a, b) => {
        const scoreB = (b.viewsCount || 0) + (b.sharesCount || 0) * 2;
        const scoreA = (a.viewsCount || 0) + (a.sharesCount || 0) * 2;
        return scoreB - scoreA;
      });
    }
    tabFiltered = pool;
  }

  // 2. Verdict filtering & search query
  const filtered = tabFiltered.filter((fc) => {
    const matchVerdict = verdict === "all" || fc.verdictSlug === verdict;
    const q = query.toLowerCase();
    const matchSearch =
      !q ||
      fc.title?.toLowerCase().includes(q) ||
      fc.claim?.toLowerCase().includes(q) ||
      fc.verdictSummary?.toLowerCase().includes(q);
    return matchVerdict && matchSearch;
  });

  return (
    <div>
      {/* Primary Category Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-800 pb-3 mb-6 overflow-x-auto no-scrollbar">
        <button
          onClick={() => {
            setActiveTab("all");
          }}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
            activeTab === "all"
              ? "bg-red-600 text-white shadow-sm"
              : "bg-white dark:bg-[#161726] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-800 hover:border-gray-400"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>{t.feed.tabs?.all ?? "All Stories"}</span>
          <span
            className={`text-xs px-2 py-0.5 rounded-full ${
              activeTab === "all"
                ? "bg-red-700 text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
            }`}
          >
            {factChecks.length}
          </span>
        </button>

        <button
          onClick={() => {
            setActiveTab("trending");
          }}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
            activeTab === "trending"
              ? "bg-amber-600 text-white shadow-sm"
              : "bg-white dark:bg-[#161726] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-800 hover:border-amber-400"
          }`}
        >
          <Flame className="w-4 h-4 fill-current" />
          <span>{t.feed.tabs?.trending ?? "Trending"}</span>
          <span
            className={`text-xs px-2 py-0.5 rounded-full ${
              activeTab === "trending"
                ? "bg-amber-700 text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
            }`}
          >
            {factChecks.filter((fc) => fc.isTrending || (fc.viewsCount && fc.viewsCount > 5000)).length}
          </span>
        </button>

        <button
          onClick={() => {
            setActiveTab("videos");
          }}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
            activeTab === "videos"
              ? "bg-purple-600 text-white shadow-sm"
              : "bg-white dark:bg-[#161726] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-800 hover:border-purple-400"
          }`}
        >
          <Video className="w-4 h-4" />
          <span>{t.feed.tabs?.videos ?? "Videos"}</span>
          <span
            className={`text-xs px-2 py-0.5 rounded-full ${
              activeTab === "videos"
                ? "bg-purple-700 text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
            }`}
          >
            {factChecks.filter((fc) => Boolean(fc.videoUrl)).length}
          </span>
        </button>
      </div>

      {/* Sub-filters bar for Trending tab */}
      {activeTab === "trending" && (
        <div className="flex items-center gap-2 flex-wrap mb-6 p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40">
          <span className="text-xs font-bold text-amber-800 dark:text-amber-400 mr-1 flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 fill-current" /> {t.feed.tabs?.trending ?? "Trending"}:
          </span>
          {[
            { id: "all", label: t.feed.trendingFilters?.all ?? "All Trending", icon: Flame },
            { id: "thisWeek", label: t.feed.trendingFilters?.thisWeek ?? "This Week", icon: Calendar },
            { id: "mostRead", label: t.feed.trendingFilters?.mostRead ?? "Most Read", icon: Eye },
            { id: "rising", label: t.feed.trendingFilters?.rising ?? "Rising", icon: TrendingUp },
            { id: "mostShared", label: t.feed.trendingFilters?.mostShared ?? "Most Shared", icon: Share2 },
          ].map((sub) => {
            const active = trendingFilter === sub.id;
            const Icon = sub.icon;
            return (
              <button
                key={sub.id}
                onClick={() => setTrendingFilter(sub.id as any)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  active
                    ? "bg-amber-600 text-white shadow-sm"
                    : "bg-white dark:bg-[#161726] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-800 hover:border-amber-400"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {sub.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Hero featured article (shown only in All tab with default filters) */}
      {featured && !query && verdict === "all" && activeTab === "all" && (
        <div className="mb-8">
          <FactCard
            fc={featured}
            lang={lang}
            featured
            featuredBadgeText={featuredBadgeText}
            featuredTitleOverride={featuredTitleOverride}
            featuredSummaryOverride={featuredSummaryOverride}
            featuredImageOverride={featuredImageOverride}
          />
        </div>
      )}

      {/* Filters bar: Search & Verdict pills */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.feed.search}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-400 bg-white dark:bg-[#161726] text-brand-dark dark:text-white placeholder-gray-400"
          />
        </div>
        <div className="flex gap-2 flex-wrap sm:flex-nowrap overflow-x-auto">
          {["all", ...verdicts.map((v) => v.slug)].map((slug) => {
            const vInfo = verdicts.find((v) => v.slug === slug);
            const label = slug === "all" ? t.feed.all : vInfo?.name ?? slug;
            const active = verdict === slug;
            return (
              <button
                key={slug}
                onClick={() => setVerdict(slug)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all whitespace-nowrap ${
                  active
                    ? "text-white border-transparent shadow-sm"
                    : "bg-white dark:bg-[#161726] text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-800 hover:border-gray-400 dark:hover:border-gray-600"
                }`}
                style={
                  active && vInfo
                    ? { backgroundColor: vInfo.colorCode, borderColor: vInfo.colorCode }
                    : active
                    ? { backgroundColor: "#DC2626" }
                    : {}
                }
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">{t.feed.noResults}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((fc) => (
            <FactCard key={fc.slug} fc={fc} lang={lang} />
          ))}
        </div>
      )}
    </div>
  );
}


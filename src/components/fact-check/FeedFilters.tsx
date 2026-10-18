"use client";
import { useState, useTransition } from "react";
import { Search } from "lucide-react";
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
  const [query, setQuery] = useState("");
  const [verdict, setVerdict] = useState<string>("all");

  const featured =
    (featuredArticleSlug ? factChecks.find((fc) => fc.slug === featuredArticleSlug) : null) ||
    factChecks.find((fc) => fc.isFeatured) ||
    factChecks[0];

  const filtered = factChecks.filter((fc) => {
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
      {/* Hero featured article */}
      {featured && !query && verdict === "all" && (
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

      {/* Filters bar */}
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
        <div className="flex gap-2 flex-wrap sm:flex-nowrap">
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
                style={active && vInfo ? { backgroundColor: vInfo.colorCode, borderColor: vInfo.colorCode } : active ? { backgroundColor: "#DC2626" } : {}}
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

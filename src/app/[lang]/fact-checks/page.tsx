import type { Locale } from "@/lib/types";
import { getAllFactChecks, getMpoxHubPage } from "@/lib/api";
import { useTranslations } from "@/lib/i18n";
import FeedFilters from "@/components/fact-check/FeedFilters";

export const metadata = {
  title: "Fact Checks — Kenya Check",
  description: "Browse all verified fact checks, rumor investigations, and claim debunks by Kenya Check.",
};

export default async function FactChecksPage({ params }: { params: { lang: Locale } }) {
  const { lang } = params;
  const t = useTranslations(lang);
  const [factChecks, hub] = await Promise.all([
    getAllFactChecks(lang),
    getMpoxHubPage(lang),
  ]);

  // unique verdicts from fact checks
  const verdictMap = new Map<string, typeof factChecks[0]["verdict"]>();
  factChecks.forEach((fc) => {
    if (fc.verdict) verdictMap.set(fc.verdict.slug, fc.verdict);
  });
  const verdicts = Array.from(verdictMap.values()).filter(Boolean) as NonNullable<typeof factChecks[0]["verdict"]>[];

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-black text-brand-dark mb-2">
          {t.feed.allTitle}
        </h1>
        <p className="text-gray-600 text-sm md:text-base">
          {lang === "sw"
            ? "Vinjari ukaguzi wote wa taarifa, uchunguzi wa uvumi na ufafanuzi wa ukweli."
            : "Explore all investigations, claims verified, and debunks published by our verification desk."}
        </p>
      </div>

      <FeedFilters
        lang={lang}
        factChecks={factChecks}
        verdicts={verdicts}
        featuredBadgeText={hub.featuredBadgeText}
        featuredArticleSlug={hub.featuredArticleSlug}
        featuredTitleOverride={hub.featuredTitleOverride}
        featuredSummaryOverride={hub.featuredSummaryOverride}
        featuredImageOverride={hub.featuredImageOverride}
      />
    </div>
  );
}

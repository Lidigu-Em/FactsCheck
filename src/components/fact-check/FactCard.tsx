import Link from "next/link";
import Image from "next/image";
import { Calendar, User, ArrowRight } from "lucide-react";
import type { FactCheck, Locale } from "@/lib/types";
import { useTranslations } from "@/lib/i18n";
import VerdictBadge from "@/components/ui/VerdictBadge";

interface FactCardProps {
  fc: FactCheck;
  lang: Locale;
  variant?: "standard" | "large" | "horizontal";
  featured?: boolean;
  featuredBadgeText?: string;
  featuredTitleOverride?: string;
  featuredSummaryOverride?: string;
  featuredImageOverride?: string;
}

export default function FactCard({
  fc,
  lang,
  variant = "standard",
  featured = false,
  featuredBadgeText,
  featuredTitleOverride,
  featuredSummaryOverride,
  featuredImageOverride,
}: FactCardProps) {
  const t = useTranslations(lang);

  const displayTitle = (featured && featuredTitleOverride) || fc.title;
  const displaySummary = (featured && featuredSummaryOverride) || fc.verdictSummary;
  const displayImage = (featured && featuredImageOverride) || fc.image;
  const displayBadgeText = (featured && featuredBadgeText) || t.feed.featured;

  if (featured) {
    return (
      <Link href={`/${lang}/fact-check/${fc.slug}`} className="group block">
        <article className="relative rounded-2xl overflow-hidden shadow-xl bg-brand-dark text-white h-96">
          {displayImage && (
            <Image
              src={displayImage}
              alt={displayTitle}
              fill
              className="object-cover opacity-40 group-hover:opacity-50 transition-opacity"
              sizes="100vw"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs font-semibold bg-red-600 text-white px-2.5 py-1 rounded-full uppercase tracking-wide">
                {displayBadgeText}
              </span>
              {fc.verdict && <VerdictBadge verdict={fc.verdict} />}
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white leading-snug mb-2 group-hover:text-red-300 transition-colors">
              {displayTitle}
            </h2>
            <p className="text-gray-300 text-sm line-clamp-2 mb-3">{displaySummary}</p>
            <div className="flex items-center gap-4 text-xs text-gray-400">
              {fc.author && (
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3" /> {fc.author.name}
                </span>
              )}
              <span className="flex items-center gap-1" suppressHydrationWarning>
                <Calendar className="w-3 h-3" /> {new Date(fc.publishDate).toLocaleDateString()}
              </span>
            </div>
          </div>
        </article>
      </Link>
    );
  }

  // Large Featured variant (Top-left in NewScientist layout)
  if (variant === "large") {
    return (
      <Link href={`/${lang}/fact-check/${fc.slug}`} className="group block h-full">
        <article className="bg-white dark:bg-[#161726] rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col md:flex-row-reverse h-full">
          {fc.image && (
            <div className="md:w-1/2 relative min-h-[220px] md:min-h-full overflow-hidden shrink-0">
              <Image
                src={fc.image}
                alt={fc.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute top-3 left-3 md:top-4 md:left-4">
                {fc.verdict && <VerdictBadge verdict={fc.verdict} size="md" />}
              </div>
            </div>
          )}
          <div className="p-6 md:p-8 flex flex-col justify-between flex-1">
            <div>
              <div className="flex items-center gap-2 mb-2">
                {fc.category && (
                  <span className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">
                    {fc.category.name}
                  </span>
                )}
              </div>
              <h2 className="text-xl md:text-2xl font-black text-brand-dark dark:text-white leading-tight mb-3 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors line-clamp-3">
                {fc.title}
              </h2>
              {/* Claim box */}
              <div className="bg-gray-50 dark:bg-[#1E1F30] border-l-4 border-red-500 pl-4 py-3 mb-4 rounded-r-lg">
                <div className="text-[11px] font-bold text-red-600 dark:text-red-400 uppercase tracking-wider mb-1">
                  {t.factCard.claim}
                </div>
                <p className="text-xs md:text-sm text-gray-700 dark:text-gray-300 italic line-clamp-3 leading-relaxed">
                  &ldquo;{fc.claim}&rdquo;
                </p>
              </div>
              {fc.verdictSummary && (
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 leading-relaxed">
                  {fc.verdictSummary}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-400 pt-3 border-t border-gray-100 dark:border-gray-800/80">
              <span className="flex items-center gap-1.5 font-medium">
                <User className="w-3.5 h-3.5" /> {fc.author?.name ?? "Kenya Check"}
              </span>
              <span className="flex items-center gap-1 font-semibold text-red-600 dark:text-red-400 group-hover:underline">
                {t.factCard.readMore} <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </article>
      </Link>
    );
  }

  // Horizontal variant (Top-right stacked in NewScientist layout)
  if (variant === "horizontal") {
    return (
      <Link href={`/${lang}/fact-check/${fc.slug}`} className="group block h-full">
        <article className="bg-white dark:bg-[#161726] rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col sm:flex-row h-full">
          {fc.image && (
            <div className="sm:w-2/5 relative min-h-[140px] sm:min-h-full overflow-hidden shrink-0">
              <Image
                src={fc.image}
                alt={fc.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 640px) 100vw, 25vw"
              />
              <div className="absolute top-2.5 left-2.5">
                {fc.verdict && <VerdictBadge verdict={fc.verdict} size="sm" />}
              </div>
            </div>
          )}
          <div className="p-4 flex flex-col justify-between flex-1">
            <div>
              {fc.category && (
                <span className="text-[11px] font-bold text-red-600 dark:text-red-400 uppercase tracking-wide">
                  {fc.category.name}
                </span>
              )}
              <h3 className="font-bold text-brand-dark dark:text-white text-sm sm:text-base leading-snug mt-1 mb-2 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors line-clamp-2">
                {fc.title}
              </h3>
              {/* Claim mini box */}
              <div className="bg-gray-50 dark:bg-[#1E1F30] border-l-2 border-red-400 pl-2.5 py-1.5 mb-2.5 rounded-r">
                <div className="text-[9px] font-bold text-red-600 dark:text-red-400 uppercase tracking-wider mb-0.5">
                  {t.factCard.claim}
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300 italic line-clamp-1">
                  &ldquo;{fc.claim}&rdquo;
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between text-[11px] text-gray-400 dark:text-gray-400 pt-1.5 border-t border-gray-100 dark:border-gray-800/80">
              <span className="flex items-center gap-1 truncate max-w-[120px]">
                <User className="w-3 h-3 shrink-0" /> {fc.author?.name ?? "Kenya Check"}
              </span>
              <span className="flex items-center gap-1 font-medium text-red-600 dark:text-red-400 shrink-0 group-hover:underline">
                {t.factCard.readMore} <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        </article>
      </Link>
    );
  }

  // Standard vertical card variant
  return (
    <Link href={`/${lang}/fact-check/${fc.slug}`} className="group block h-full">
      <article className="bg-white dark:bg-[#161726] rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col h-full">
        {fc.image && (
          <div className="relative h-44 overflow-hidden shrink-0">
            <Image
              src={fc.image}
              alt={fc.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            <div className="absolute top-3 left-3">
              {fc.verdict && <VerdictBadge verdict={fc.verdict} size="sm" />}
            </div>
          </div>
        )}
        <div className="p-4 flex flex-col justify-between flex-1">
          <div>
            {fc.category && (
              <span className="text-xs font-semibold text-red-600 dark:text-red-400 uppercase tracking-wide">
                {fc.category.name}
              </span>
            )}
            <h3 className="font-bold text-brand-dark dark:text-white text-base leading-snug mt-1.5 mb-2 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors line-clamp-3">
              {fc.title}
            </h3>
            {/* Claim mini box */}
            <div className="bg-gray-50 dark:bg-[#1E1F30] border-l-2 border-red-400 pl-3 py-2 mb-3 rounded-r">
              <div className="text-[10px] font-bold text-red-600 dark:text-red-400 uppercase tracking-wide mb-0.5">{t.factCard.claim}</div>
              <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 italic">&ldquo;{fc.claim}&rdquo;</p>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-800/80">
            <span className="flex items-center gap-1">
              <User className="w-3 h-3" /> {fc.author?.name ?? "Kenya Check"}
            </span>
            <span className="flex items-center gap-1 font-medium text-red-600 dark:text-red-400 group-hover:underline">
              {t.factCard.readMore} <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

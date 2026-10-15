import Link from "next/link";
import Image from "next/image";
import { Calendar, User, ArrowRight } from "lucide-react";
import type { FactCheck, Locale } from "@/lib/types";
import { useTranslations } from "@/lib/i18n";
import VerdictBadge from "@/components/ui/VerdictBadge";

interface FactCardProps {
  fc: FactCheck;
  lang: Locale;
  featured?: boolean;
  featuredBadgeText?: string;
  featuredTitleOverride?: string;
  featuredSummaryOverride?: string;
  featuredImageOverride?: string;
}

export default function FactCard({
  fc,
  lang,
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

  return (
    <Link href={`/${lang}/fact-check/${fc.slug}`} className="group block">
      <article className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 overflow-hidden">
        {fc.image && (
          <div className="relative h-44 overflow-hidden">
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
        <div className="p-4">
          {fc.category && (
            <span className="text-xs font-semibold text-red-600 uppercase tracking-wide">
              {fc.category.name}
            </span>
          )}
          <h3 className="font-bold text-brand-dark text-base leading-snug mt-1.5 mb-2 group-hover:text-red-600 transition-colors line-clamp-3">
            {fc.title}
          </h3>
          {/* Claim mini box */}
          <div className="bg-gray-50 border-l-2 border-red-400 pl-3 py-2 mb-3 rounded-r">
            <div className="text-[10px] font-bold text-red-600 uppercase tracking-wide mb-0.5">{t.factCard.claim}</div>
            <p className="text-xs text-gray-600 line-clamp-2 italic">&ldquo;{fc.claim}&rdquo;</p>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <User className="w-3 h-3" /> {fc.author?.name ?? "Congo Check"}
            </span>
            <span className="flex items-center gap-1 font-medium text-red-600 group-hover:underline">
              {t.factCard.readMore} <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

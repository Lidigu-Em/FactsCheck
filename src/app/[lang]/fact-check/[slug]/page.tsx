import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Calendar, User, ExternalLink, Share2, MessageCircle, ChevronLeft, BookOpen } from "lucide-react";
import type { Locale } from "@/lib/types";
import { getAllFactChecks, getFactCheck } from "@/lib/api";
import { useTranslations } from "@/lib/i18n";
import VerdictBadge from "@/components/ui/VerdictBadge";

export async function generateStaticParams() {
  const locales: Locale[] = ["en", "sw"];
  const params: { lang: Locale; slug: string }[] = [];
  for (const lang of locales) {
    const fcs = await getAllFactChecks(lang);
    fcs.forEach((fc) => params.push({ lang, slug: fc.slug }));
  }
  return params;
}

export default async function FactCheckDetail({
  params,
}: {
  params: { lang: Locale; slug: string };
}) {
  const { lang, slug } = params;
  const t = useTranslations(lang);
  const fc = await getFactCheck(slug, lang);
  if (!fc) notFound();

  const allFcs = await getAllFactChecks(lang);
  const related = allFcs
    .filter((f) => f.slug !== slug && f.categorySlug === fc.categorySlug)
    .slice(0, 3);

  // Schema.org ClaimReview JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ClaimReview",
    url: `https://example.com/${lang}/fact-check/${slug}`,
    claimReviewed: fc.claim,
    author: {
      "@type": "Organization",
      name: "Kenya Check",
      url: "https://kenyacheck.org",
    },
    reviewRating: {
      "@type": "Rating",
      ratingValue: fc.verdictSlug === "true" ? "5" : fc.verdictSlug === "misleading" ? "3" : "1",
      bestRating: "5",
      worstRating: "1",
      alternateName: fc.verdict?.name ?? fc.verdictSlug,
    },
    itemReviewed: {
      "@type": "Claim",
      author: { "@type": "Person", name: fc.claimant },
      datePublished: fc.claimDate,
      name: fc.claim,
    },
    datePublished: fc.publishDate,
    languageCode: lang,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* Back link */}
        <Link
          href={`/${lang}`}
          className="inline-flex items-center gap-1.5 text-sm text-brand-muted hover:text-red-600 mb-6 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          {t.detail.backToFeed}
        </Link>

        {/* Category + Verdict */}
        <div className="flex items-center flex-wrap gap-2 mb-4">
          {fc.category && (
            <span className="text-xs font-semibold text-red-600 uppercase tracking-wide border border-red-200 px-2.5 py-1 rounded-full">
              {fc.category.name}
            </span>
          )}
          {fc.verdict && <VerdictBadge verdict={fc.verdict} size="lg" />}
        </div>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-black text-brand-dark leading-snug mb-4">
          {fc.title}
        </h1>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6 pb-6 border-b border-gray-100">
          {fc.author && (
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4" />
              <strong className="text-gray-700">{fc.author.name}</strong>
              <span className="text-xs text-gray-400">— {fc.author.role}</span>
            </span>
          )}
          <span className="flex items-center gap-1.5" suppressHydrationWarning>
            <Calendar className="w-4 h-4" />
            <span suppressHydrationWarning>
              {new Date(fc.publishDate).toLocaleDateString(lang === "sw" ? "sw-TZ" : "en-GB", {
                year: "numeric", month: "long", day: "numeric",
              })}
            </span>
          </span>
          {fc.verificationMethod && (
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" />
              <span className="text-xs bg-gray-100 px-2 py-0.5 rounded font-mono">
                {fc.verificationMethod.replace("_", " ")}
              </span>
            </span>
          )}
        </div>

        {/* Featured image */}
        {fc.image && (
          <figure className="mb-6 rounded-xl overflow-hidden shadow-md">
            <div className="relative h-64 md:h-80">
              <Image
                src={fc.image}
                alt={fc.imageCaption || fc.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 672px"
              />
              {fc.verdict && (
                <div className="absolute top-4 left-4">
                  <VerdictBadge verdict={fc.verdict} size="lg" />
                </div>
              )}
            </div>
            {fc.imageCaption && (
              <figcaption className="bg-gray-50 text-xs text-gray-500 px-4 py-2 italic">
                {fc.imageCaption}
              </figcaption>
            )}
          </figure>
        )}

        {/* Claim box */}
        <div className="claim-box mb-6">
          <div className="text-xs font-bold text-red-600 uppercase tracking-widest mb-2">
            {t.detail.claimBox}
          </div>
          <blockquote className="text-base italic text-brand-dark leading-relaxed mb-3">
            &ldquo;{fc.claim}&rdquo;
          </blockquote>
          <div className="flex flex-wrap gap-4 text-xs text-gray-500">
            {fc.claimant && (
              <span>
                <strong>{t.detail.claimedBy}:</strong> {fc.claimant}
              </span>
            )}
            {fc.claimDate && (
              <span>
                <strong>{t.detail.dateCirculated}:</strong>{" "}
                {new Date(fc.claimDate).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>

        {/* Verdict summary */}
        {fc.verdict && (
          <div
            className="rounded-xl p-4 mb-6 text-white font-medium text-sm leading-relaxed"
            style={{ backgroundColor: fc.verdict.colorCode }}
          >
            <div className="flex items-center gap-2 mb-2">
              <VerdictBadge verdict={fc.verdict} />
            </div>
            {fc.verdictSummary}
          </div>
        )}

        {/* Full explanation */}
        <div className="article-prose mb-10">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{fc.explanation}</ReactMarkdown>
        </div>

        {/* Sources */}
        {fc.sources?.length > 0 && (
          <section className="mb-8 bg-gray-50 rounded-xl p-5 border border-gray-100">
            <h3 className="text-sm font-bold text-brand-dark uppercase tracking-wide mb-3">
              {t.detail.sources}
            </h3>
            <ul className="space-y-2">
              {fc.sources.map((src, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <ExternalLink className="w-3.5 h-3.5 mt-0.5 shrink-0 text-gray-400" />
                  <a
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-red-600 hover:underline leading-snug"
                  >
                    {src.title}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Share */}
        <section className="flex flex-wrap gap-3 mb-12 pb-8 border-b border-gray-100">
          <div className="text-sm font-semibold text-gray-600 flex items-center gap-2">
            <Share2 className="w-4 h-4" /> {t.detail.share}:
          </div>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(fc.title + " " + "https://example.com/" + lang + "/fact-check/" + slug)}`}
            target="_blank"
            rel="noopener"
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
          >
            <MessageCircle className="w-4 h-4" /> {t.detail.whatsapp}
          </a>
        </section>

        {/* Related */}
        {related.length > 0 && (
          <section>
            <h3 className="text-lg font-bold text-brand-dark mb-4">{t.detail.relatedChecks}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/${lang}/fact-check/${rel.slug}`}
                  className="group block bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-all"
                >
                  <div className="mb-2">
                    {rel.verdict && <VerdictBadge verdict={rel.verdict} size="sm" />}
                  </div>
                  <h4 className="text-sm font-semibold text-brand-dark group-hover:text-red-600 transition-colors line-clamp-3">
                    {rel.title}
                  </h4>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}

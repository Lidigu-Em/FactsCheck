import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Calendar,
  User,
  ExternalLink,
  ChevronLeft,
  BookOpen,
  Video,
  Play,
  Flame,
  Eye,
} from "lucide-react";
import type { Locale } from "@/lib/types";
import { getAllFactChecks, getFactCheck } from "@/lib/api";
import { useTranslations } from "@/lib/i18n";
import VerdictBadge from "@/components/ui/VerdictBadge";
import ShareButtons from "@/components/fact-check/ShareButtons";

function getEmbedUrl(url?: string): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com")) {
      const v = u.searchParams.get("v");
      if (v) return `https://www.youtube-nocookie.com/embed/${v}`;
      if (u.pathname.startsWith("/embed/")) return url;
    }
    if (u.hostname === "youtu.be") {
      const id = u.pathname.slice(1).split("?")[0];
      if (id) return `https://www.youtube-nocookie.com/embed/${id}`;
    }
  } catch {
    return null;
  }
  return null;
}

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

  const embedUrl = getEmbedUrl(fc.videoUrl);
  const isDirectVideo =
    fc.videoUrl &&
    (fc.videoUrl.endsWith(".mp4") ||
      fc.videoUrl.endsWith(".webm") ||
      fc.videoUrl.includes("/video/"));

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
          className="inline-flex items-center gap-1.5 text-sm text-brand-muted dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 mb-6 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          {t.detail.backToFeed}
        </Link>

        {/* Category + Verdict + Badges */}
        <div className="flex items-center flex-wrap gap-2 mb-4">
          {fc.category && (
            <span className="text-xs font-semibold text-red-600 dark:text-red-400 uppercase tracking-wide border border-red-200 dark:border-red-900/50 px-2.5 py-1 rounded-full">
              {fc.category.name}
            </span>
          )}
          {fc.verdict && <VerdictBadge verdict={fc.verdict} size="lg" />}
          {fc.isTrending && (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 px-2.5 py-1 rounded-full">
              <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>{t.feed.tabs?.trending ?? "Trending"}</span>
            </span>
          )}
          {fc.videoUrl && (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 border border-purple-300 dark:border-purple-800 px-2.5 py-1 rounded-full">
              <Video className="w-3.5 h-3.5" />
              <span>{t.feed.tabs?.videos ?? "Video"}</span>
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-black text-brand-dark dark:text-white leading-snug mb-4">
          {fc.title}
        </h1>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-6 pb-6 border-b border-gray-100 dark:border-gray-800">
          {fc.author && (
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4" />
              <strong className="text-gray-700 dark:text-gray-200">{fc.author.name}</strong>
              <span className="text-xs text-gray-400">— {fc.author.role}</span>
            </span>
          )}
          <span className="flex items-center gap-1.5" suppressHydrationWarning>
            <Calendar className="w-4 h-4" />
            <span suppressHydrationWarning>
              {new Date(fc.publishDate).toLocaleDateString(lang === "sw" ? "sw-TZ" : "en-GB", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </span>
          {typeof fc.viewsCount === "number" && fc.viewsCount > 0 && (
            <span className="flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-gray-400" />
              <span>
                <strong className="text-gray-700 dark:text-gray-200">{fc.viewsCount.toLocaleString()}</strong>{" "}
                {t.feed.views}
              </span>
            </span>
          )}
          {fc.verificationMethod && (
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" />
              <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded font-mono">
                {fc.verificationMethod.replace("_", " ")}
              </span>
            </span>
          )}
        </div>

        {/* Video Investigation Showcase (if videoUrl is present) */}
        {fc.videoUrl && (
          <div className="mb-8 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#161726] shadow-md">
            <div className="p-3 bg-gray-50 dark:bg-[#1E1F30] border-b border-gray-200 dark:border-gray-800 flex items-center justify-between flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-100 dark:bg-purple-950/50 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                <Video className="w-3.5 h-3.5" />
                {t.feed.watchVideo}
              </span>
              {(fc.videoAuthor || fc.author) && (
                <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-purple-600" />
                  <span>{t.feed.videoBy}:</span>
                  <strong className="text-gray-800 dark:text-gray-200">
                    {(fc.videoAuthor || fc.author)?.name}
                  </strong>
                </span>
              )}
            </div>

            {embedUrl ? (
              <div className="relative aspect-video bg-black">
                <iframe
                  src={embedUrl}
                  title={fc.videoTitle || fc.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              </div>
            ) : isDirectVideo ? (
              <div className="relative aspect-video bg-black">
                <video src={fc.videoUrl} controls className="w-full h-full object-contain" />
              </div>
            ) : (
              <div className="p-4">
                <a
                  href={fc.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 rounded-xl bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
                >
                  <span className="flex items-center gap-2 text-sm font-bold text-purple-700 dark:text-purple-300">
                    <Play className="w-4 h-4 fill-purple-600" />
                    {t.feed.watchVideo}
                  </span>
                  <ExternalLink className="w-4 h-4 text-purple-500" />
                </a>
              </div>
            )}

            {/* Video Metadata: Title, Description, Author Card & Content */}
            <div className="p-5 md:p-6 space-y-4">
              <div>
                <h2 className="text-lg md:text-xl font-bold text-brand-dark dark:text-white leading-snug">
                  {fc.videoTitle || fc.title}
                </h2>
                {(fc.videoDescription || fc.claim || fc.verdictSummary) && (
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 leading-relaxed">
                    {fc.videoDescription || fc.claim || fc.verdictSummary}
                  </p>
                )}
              </div>

              {/* Video Author Details */}
              {(fc.videoAuthor || fc.author) && (
                <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-[#1E1F30] border border-gray-100 dark:border-gray-800 text-xs flex-wrap gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-purple-600/10 text-purple-600 flex items-center justify-center font-bold text-sm shrink-0">
                      {(fc.videoAuthor || fc.author)?.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-gray-800 dark:text-gray-200">
                        {(fc.videoAuthor || fc.author)?.name}
                      </div>
                      <div className="text-gray-500 dark:text-gray-400">
                        {(fc.videoAuthor || fc.author)?.role || "Video Fact-Checker"} ·{" "}
                        {(fc.videoAuthor || fc.author)?.organization || "Kenya Check"}
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 px-2 py-0.5 rounded">
                    {t.feed.videoBy}
                  </span>
                </div>
              )}

              {/* Video Content / Transcript */}
              {fc.videoContent && (
                <div className="pt-3 border-t border-gray-100 dark:border-gray-800">
                  <div className="text-xs font-bold text-purple-700 dark:text-purple-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    {t.feed.videoTranscript}
                  </div>
                  <div className="article-prose text-xs md:text-sm text-gray-600 dark:text-gray-300 bg-gray-50/50 dark:bg-[#12131F] p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{fc.videoContent}</ReactMarkdown>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Featured image (if no videoUrl or if image is also provided) */}
        {fc.image && !fc.videoUrl && (
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
          <section className="mb-8 bg-gray-50 dark:bg-[#161726] rounded-xl p-5 border border-gray-100 dark:border-gray-800">
            <h3 className="text-sm font-bold text-brand-dark dark:text-white uppercase tracking-wide mb-3">
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
                    className="text-red-600 dark:text-red-400 hover:underline leading-snug"
                  >
                    {src.title}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Share & engagement */}
        <ShareButtons
          title={fc.title}
          url={`https://kenyacheck.org/${lang}/fact-check/${slug}`}
          lang={lang}
          initialShares={fc.sharesCount || 0}
          viewsCount={fc.viewsCount || 0}
        />

        {/* Related */}
        {related.length > 0 && (
          <section>
            <h3 className="text-lg font-bold text-brand-dark dark:text-white mb-4">{t.detail.relatedChecks}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/${lang}/fact-check/${rel.slug}`}
                  className="group block bg-white dark:bg-[#161726] rounded-xl border border-gray-100 dark:border-gray-800 p-4 hover:shadow-md transition-all"
                >
                  <div className="mb-2">
                    {rel.verdict && <VerdictBadge verdict={rel.verdict} size="sm" />}
                  </div>
                  <h4 className="text-sm font-semibold text-brand-dark dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors line-clamp-3">
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

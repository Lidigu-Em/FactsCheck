import type { Locale } from "./types";
import type {
  FactCheck, VerdictInfo, CategoryInfo, AuthorInfo,
  SiteSetting, MpoxHubPage, AboutPageData,
} from "./types";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
const STRAPI_TOKEN = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;

// ─── Load local seed data ────────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-require-imports
const rawSeed = require("../data/seed.json");

function buildLocalized<T>(
  item: { locales: Record<string, Partial<T>> } & Record<string, unknown>,
  locale: Locale,
  keys: (keyof T)[]
): T {
  const base: Partial<T> = {};
  const loc = item.locales?.[locale] ?? item.locales?.["en"] ?? {};
  for (const k of keys) base[k] = (loc as Partial<T>)[k];
  return base as T;
}

// ─── Resolve seed verdicts ────────────────────────────────────────────────────
function getVerdicts(locale: Locale): VerdictInfo[] {
  return rawSeed.verdicts.map((v: any) => ({
    slug: v.slug,
    colorCode: v.colorCode,
    iconName: v.iconName,
    name: v.locales[locale]?.name ?? v.locales.en.name,
    description: v.locales[locale]?.description ?? v.locales.en.description,
  }));
}

// ─── Resolve seed categories ─────────────────────────────────────────────────
function getCategories(locale: Locale): CategoryInfo[] {
  return rawSeed.categories.map((c: any) => ({
    slug: c.slug,
    name: c.locales[locale]?.name ?? c.locales.en.name,
    description: c.locales[locale]?.description ?? c.locales.en.description,
  }));
}

// ─── Resolve seed authors ────────────────────────────────────────────────────
function getAuthors(): AuthorInfo[] {
  return rawSeed.authors.map((a: any) => ({
    id: a.id,
    name: a.name,
    role: a.role,
    bio: a.bio,
    organization: a.organization,
    twitterHandle: a.twitterHandle,
  }));
}

// ─── Resolve seed videos ──────────────────────────────────────────────────────
function seedVideos(locale: Locale): FactCheck[] {
  const verdicts = getVerdicts(locale);
  const categories = getCategories(locale);
  const authors = getAuthors();
  const videoCategory = categories.find((c) => c.slug === "videos") || {
    slug: "videos",
    name: locale === "sw" ? "Video" : "Videos",
    description:
      locale === "sw"
        ? "Uchunguzi wa video na ufafanuzi wa medianuwai"
        : "Video investigations and multimedia debunks",
  };

  const videosList = rawSeed.videos || [];
  return videosList.map((v: any) => {
    const loc = v.locales?.[locale] ?? v.locales?.en ?? {};
    const verdict = verdicts.find((item) => item.slug === v.verdictSlug);
    const author = authors.find((a) => a.id === v.authorId);
    const editor = authors.find((a) => a.id === v.editorId);
    const videoAuthor = v.videoAuthorId
      ? authors.find((a) => a.id === v.videoAuthorId)
      : author;

    return {
      contentType: "video",
      slug: v.slug,
      claimDate: v.claimDate || v.publishDate,
      publishDate: v.publishDate,
      verdictSlug: v.verdictSlug || "unproven",
      categorySlug: "videos",
      authorId: v.authorId,
      editorId: v.editorId,
      videoAuthorId: v.videoAuthorId,
      verificationMethod: v.verificationMethod || "VIDEO_INVESTIGATION",
      isFeatured: Boolean(v.isFeatured),
      videoUrl: v.videoUrl,
      videoTitle: loc.videoTitle || loc.title,
      videoDescription:
        loc.videoDescription || loc.claim || loc.verdictSummary || "",
      videoContent: loc.videoContent || loc.explanation || "",
      isTrending: Boolean(v.isTrending),
      viewsCount: typeof v.viewsCount === "number" ? v.viewsCount : 0,
      sharesCount: typeof v.sharesCount === "number" ? v.sharesCount : 0,
      image: v.image,
      sources: v.sources ?? [],
      title: loc.title || loc.videoTitle || "",
      claim: loc.claim || loc.title || "",
      claimant: loc.claimant || "",
      verdictSummary: loc.verdictSummary || loc.videoDescription || "",
      imageCaption: loc.imageCaption || loc.title || "",
      explanation: loc.explanation || loc.videoContent || "",
      verdict,
      category: videoCategory,
      author,
      editor,
      videoAuthor,
    } as FactCheck;
  });
}

// ─── Resolve seed fact-checks ─────────────────────────────────────────────────
function seedFactChecks(locale: Locale): FactCheck[] {
  const verdicts = getVerdicts(locale);
  const categories = getCategories(locale);
  const authors = getAuthors();

  const standardStories = rawSeed.factChecks.map((fc: any) => {
    const loc = fc.locales[locale] ?? fc.locales.en;
    const verdict = verdicts.find((v) => v.slug === fc.verdictSlug);
    const category = categories.find((c) => c.slug === fc.categorySlug);
    const author = authors.find((a) => a.id === fc.authorId);
    const editor = authors.find((a) => a.id === fc.editorId);
    const videoAuthor = fc.videoAuthorId
      ? authors.find((a) => a.id === fc.videoAuthorId)
      : fc.videoUrl
      ? author
      : undefined;
    return {
      contentType: "story",
      slug: fc.slug,
      claimDate: fc.claimDate,
      publishDate: fc.publishDate,
      verdictSlug: fc.verdictSlug,
      categorySlug: fc.categorySlug,
      authorId: fc.authorId,
      editorId: fc.editorId,
      videoAuthorId: fc.videoAuthorId,
      verificationMethod: fc.verificationMethod,
      isFeatured: fc.isFeatured,
      videoUrl: fc.videoUrl,
      videoTitle: loc.videoTitle || (fc.videoUrl ? loc.title : undefined),
      videoDescription:
        loc.videoDescription || (fc.videoUrl ? loc.claim || loc.verdictSummary : undefined),
      videoContent: loc.videoContent || (fc.videoUrl ? loc.explanation : undefined),
      isTrending: fc.isTrending,
      viewsCount: typeof fc.viewsCount === "number" ? fc.viewsCount : 0,
      sharesCount: typeof fc.sharesCount === "number" ? fc.sharesCount : 0,
      image: fc.image,
      sources: fc.sources ?? [],
      title: loc.title,
      claim: loc.claim,
      claimant: loc.claimant,
      verdictSummary: loc.verdictSummary,
      imageCaption: loc.imageCaption,
      explanation: loc.explanation,
      verdict,
      category,
      author,
      editor,
      videoAuthor,
    } as FactCheck;
  });

  const videoStories = seedVideos(locale);
  const allStories = [...standardStories, ...videoStories];
  return allStories.sort(
    (a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
  );
}

// ─── Strapi fetcher (used when STRAPI_URL is set) ────────────────────────────
function formatImageUrl(url: string | undefined): string {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  const base = (STRAPI_URL || "http://localhost:1337").replace(/\/$/, "");
  return `${base}${url.startsWith("/") ? "" : "/"}${url}`;
}

async function strapiGet(endpoint: string): Promise<unknown> {
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (STRAPI_TOKEN) headers["Authorization"] = `Bearer ${STRAPI_TOKEN}`;
  const res = await fetch(`${STRAPI_URL}/api/${endpoint}`, {
    headers,
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Strapi request failed: ${res.status}`);
  return res.json();
}

function mapStrapiFactCheck(item: any): FactCheck {
  const a = item.attributes;
  return {
    id: item.id,
    contentType: "story",
    slug: a.slug,
    claimDate: a.claimDate || a.publishedAt || new Date().toISOString(),
    publishDate: a.publishedAt || new Date().toISOString(),
    verdictSlug: a.verdict?.data?.attributes?.slug || "unverified",
    categorySlug: a.category?.data?.attributes?.slug || "general",
    authorId: a.author?.data?.id ? String(a.author.data.id) : "",
    editorId: a.editor?.data?.id ? String(a.editor.data.id) : undefined,
    verificationMethod: a.verificationMethod || "PROTOCOL_3PFCP",
    isFeatured: Boolean(a.isFeatured),
    videoUrl: a.videoUrl || undefined,
    videoTitle: a.videoTitle || (a.videoUrl ? a.title : undefined),
    videoDescription: a.videoDescription || (a.videoUrl ? a.claim || a.verdictSummary : undefined),
    videoContent: a.videoContent || (a.videoUrl ? a.explanation : undefined),
    videoAuthorId: a.videoAuthor?.data?.id ? String(a.videoAuthor.data.id) : undefined,
    isTrending: Boolean(a.isTrending),
    viewsCount: typeof a.viewsCount === "number" ? a.viewsCount : 0,
    sharesCount: typeof a.sharesCount === "number" ? a.sharesCount : 0,
    image: formatImageUrl(a.featuredImage?.data?.attributes?.url),
    sources: a.sources ?? [],
    title: a.title || "",
    claim: a.claim || "",
    claimant: a.claimant || "",
    verdictSummary: a.verdictSummary || "",
    imageCaption: a.imageCaption || "",
    explanation: a.explanation || "",
    verdict: a.verdict?.data?.attributes
      ? {
          slug: a.verdict.data.attributes.slug,
          name: a.verdict.data.attributes.name,
          colorCode: a.verdict.data.attributes.colorCode || "#DC2626",
          iconName: a.verdict.data.attributes.iconName || "alert-circle",
          description: a.verdict.data.attributes.description || "",
        }
      : undefined,
    category: a.category?.data?.attributes
      ? {
          slug: a.category.data.attributes.slug,
          name: a.category.data.attributes.name,
          description: a.category.data.attributes.description || "",
        }
      : undefined,
    author: a.author?.data?.attributes
      ? {
          id: String(a.author.data.id),
          name: a.author.data.attributes.name,
          role: a.author.data.attributes.role,
          bio: a.author.data.attributes.bio,
          organization: a.author.data.attributes.organization,
          twitterHandle: a.author.data.attributes.twitterHandle,
        }
      : undefined,
    editor: a.editor?.data?.attributes
      ? {
          id: String(a.editor.data.id),
          name: a.editor.data.attributes.name,
          role: a.editor.data.attributes.role,
          bio: a.editor.data.attributes.bio,
          organization: a.editor.data.attributes.organization,
          twitterHandle: a.editor.data.attributes.twitterHandle,
        }
      : undefined,
    videoAuthor: a.videoAuthor?.data?.attributes
      ? {
          id: String(a.videoAuthor.data.id),
          name: a.videoAuthor.data.attributes.name,
          role: a.videoAuthor.data.attributes.role,
          bio: a.videoAuthor.data.attributes.bio,
          organization: a.videoAuthor.data.attributes.organization,
          twitterHandle: a.videoAuthor.data.attributes.twitterHandle,
        }
      : a.author?.data?.attributes && a.videoUrl
      ? {
          id: String(a.author.data.id),
          name: a.author.data.attributes.name,
          role: a.author.data.attributes.role,
          bio: a.author.data.attributes.bio,
          organization: a.author.data.attributes.organization,
          twitterHandle: a.author.data.attributes.twitterHandle,
        }
      : undefined,
  };
}

function mapStrapiVideo(item: any): FactCheck {
  const a = item.attributes || {};
  const authorInfo = a.author?.data?.attributes
    ? {
        id: String(a.author.data.id),
        name: a.author.data.attributes.name,
        role: a.author.data.attributes.role,
        bio: a.author.data.attributes.bio,
        organization: a.author.data.attributes.organization,
        twitterHandle: a.author.data.attributes.twitterHandle,
      }
    : undefined;

  const rawVideoUrl = a.videoUrl || a.url || a.link || a.video_url || "";
  const rawTitle = a.title || a.videoTitle || "Video Investigation";
  const rawDescription =
    a.description || a.videoDescription || a.claim || a.verdictSummary || "";
  const rawContent = a.content || a.videoContent || a.transcript || "";
  const imageUrl =
    a.coverImage?.data?.attributes?.url ||
    a.image?.data?.attributes?.url ||
    a.featuredImage?.data?.attributes?.url ||
    a.thumbnail?.data?.attributes?.url;

  return {
    id: item.id,
    contentType: "video",
    slug: a.slug,
    claimDate: a.claimDate || a.publishedAt || new Date().toISOString(),
    publishDate: a.publishedAt || new Date().toISOString(),
    verdictSlug: a.verdict?.data?.attributes?.slug || "unproven",
    categorySlug: "videos",
    authorId: a.author?.data?.id ? String(a.author.data.id) : "",
    verificationMethod: a.verificationMethod || "VIDEO_INVESTIGATION",
    isFeatured: Boolean(a.isFeatured),
    videoUrl: rawVideoUrl,
    videoTitle: rawTitle,
    videoDescription: rawDescription,
    videoContent: rawContent,
    videoAuthorId: a.author?.data?.id ? String(a.author.data.id) : undefined,
    isTrending: Boolean(a.isTrending),
    viewsCount: typeof a.viewsCount === "number" ? a.viewsCount : 0,
    sharesCount: typeof a.sharesCount === "number" ? a.sharesCount : 0,
    image:
      formatImageUrl(imageUrl) ||
      "https://images.unsplash.com/photo-1584483766114-2cea6facdf57?w=1200&auto=format&fit=crop&q=80",
    sources: a.sources ?? [],
    title: rawTitle,
    claim: a.claim || rawTitle,
    claimant: a.claimant || "",
    verdictSummary: rawDescription,
    imageCaption: a.imageCaption || rawTitle,
    explanation: rawContent || rawDescription,
    verdict: a.verdict?.data?.attributes
      ? {
          slug: a.verdict.data.attributes.slug,
          name: a.verdict.data.attributes.name,
          colorCode: a.verdict.data.attributes.colorCode || "#16A34A",
          iconName: a.verdict.data.attributes.iconName || "video",
          description: a.verdict.data.attributes.description || "",
        }
      : undefined,
    category: {
      slug: "videos",
      name: "Videos",
      description: "Video investigations and multimedia debunks",
    },
    author: authorInfo,
    videoAuthor: authorInfo,
  };
}

// ─── Public API ──────────────────────────────────────────────────────────────
export async function getAllFactChecks(locale: Locale): Promise<FactCheck[]> {
  if (!STRAPI_URL) return seedFactChecks(locale);
  try {
    const [factChecksData, videosData]: [any, any] = await Promise.all([
      strapiGet(
        `fact-checks?populate=*&locale=${locale}&pagination[pageSize]=50&sort=publishedAt:desc`
      ).catch((err) => {
        console.warn("Strapi fetch fact-checks failed:", err);
        return { data: [] };
      }),
      strapiGet(
        `videos?populate=*&locale=${locale}&pagination[pageSize]=50&sort=publishedAt:desc`
      ).catch((err) => {
        console.warn(
          "Strapi fetch videos failed (Make sure Public role has find/findOne enabled under Settings > Users & Permissions Plugin > Roles > Public > Video):",
          err
        );
        return { data: [] };
      }),
    ]);

    let mappedFc = (factChecksData?.data || []).map(mapStrapiFactCheck);
    let mappedVideos = (videosData?.data || []).map(mapStrapiVideo);

    // Independent fallback: If videos are not available in current locale (e.g. 'sw'), fallback to 'en'
    if (mappedVideos.length === 0 && locale !== "en") {
      try {
        const enVideos: any = await strapiGet(
          `videos?populate=*&locale=en&pagination[pageSize]=50&sort=publishedAt:desc`
        ).catch(() => ({ data: [] }));
        if (enVideos?.data?.length > 0) {
          mappedVideos = enVideos.data.map(mapStrapiVideo);
        }
      } catch (err) {
        console.warn("Strapi en fallback for videos failed:", err);
      }
    }

    // Independent fallback: If fact-checks are not in current locale, fallback to 'en'
    if (mappedFc.length === 0 && locale !== "en") {
      try {
        const enFc: any = await strapiGet(
          `fact-checks?populate=*&locale=en&pagination[pageSize]=50&sort=publishedAt:desc`
        ).catch(() => ({ data: [] }));
        if (enFc?.data?.length > 0) {
          mappedFc = enFc.data.map(mapStrapiFactCheck);
        }
      } catch (err) {
        console.warn("Strapi en fallback for fact-checks failed:", err);
      }
    }

    if (mappedFc.length === 0 && mappedVideos.length === 0) {
      return seedFactChecks(locale);
    }

    const combined = [...mappedFc, ...mappedVideos];
    return combined.sort(
      (a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
    );
  } catch (err) {
    console.warn("Strapi fetch failed, falling back to seed:", err);
    return seedFactChecks(locale);
  }
}

export async function getAllVideos(locale: Locale): Promise<FactCheck[]> {
  const all = await getAllFactChecks(locale);
  return all.filter(
    (item) =>
      item.categorySlug === "videos" ||
      item.contentType === "video" ||
      Boolean(item.videoUrl)
  );
}

export async function getFactCheck(
  slug: string,
  locale: Locale
): Promise<FactCheck | null> {
  if (!STRAPI_URL) {
    return seedFactChecks(locale).find((fc) => fc.slug === slug) ?? null;
  }
  try {
    // 1. Try fact-checks collection
    const data: any = await strapiGet(
      `fact-checks?filters[slug][$eq]=${slug}&populate=*&locale=${locale}`
    ).catch(() => null);
    if (data?.data?.length) {
      return mapStrapiFactCheck(data.data[0]);
    }

    // 2. Try videos collection
    const videoData: any = await strapiGet(
      `videos?filters[slug][$eq]=${slug}&populate=*&locale=${locale}`
    ).catch(() => null);
    if (videoData?.data?.length) {
      return mapStrapiVideo(videoData.data[0]);
    }

    if (locale !== "en") {
      const enData: any = await strapiGet(
        `fact-checks?filters[slug][$eq]=${slug}&populate=*&locale=en`
      ).catch(() => null);
      if (enData?.data?.length) {
        return mapStrapiFactCheck(enData.data[0]);
      }
      const enVideoData: any = await strapiGet(
        `videos?filters[slug][$eq]=${slug}&populate=*&locale=en`
      ).catch(() => null);
      if (enVideoData?.data?.length) {
        return mapStrapiVideo(enVideoData.data[0]);
      }
    }
    return seedFactChecks(locale).find((fc) => fc.slug === slug) ?? null;
  } catch (err) {
    console.warn(`Strapi getFactCheck(${slug}) failed:`, err);
    return seedFactChecks(locale).find((fc) => fc.slug === slug) ?? null;
  }
}

export async function getSiteSetting(locale: Locale): Promise<SiteSetting> {
  const raw = rawSeed.siteSetting;
  const loc = raw.locales[locale] ?? raw.locales.en;

  const fallback: SiteSetting = {
    siteName: loc.siteName || "Kenya Check",
    siteTitle: loc.siteTitle || (locale === "sw" ? "Kenya Check EbolaFacts — Ukweli Kuhusu Ebola" : "Kenya Check EbolaFacts — Verified Health Investigations"),
    tagline: loc.tagline || "",
    logo: raw.logo || "",
    logoAlt: loc.logoAlt || "Kenya Check Logo",
    emergencyBannerText: loc.emergencyBannerText,
    emergencyPhone: raw.emergencyPhone,
    emergencyWhatsApp: raw.emergencyWhatsApp,
    aboutBrief: loc.aboutBrief,
    footerText: loc.footerText || (locale === "sw" ? "Kenya Check ni shirika la kwanza na pekee huru la ukaguzi wa ukweli la Jamhuri ya Kidemokrasia ya Kongo lililoidhinishwa na IFCN." : "Kenya Check is the first and only independent fact-checking platform in the DRC certified by the International Fact-Checking Network (IFCN)."),
    footerIfcnNotice: loc.footerIfcnNotice || (locale === "sw" ? "Mwanachama Aliyeidhinishwa wa Kanuni za IFCN" : "Certified Member of the IFCN Code of Principles"),
    footerCopyright: loc.footerCopyright || `© ${new Date().getFullYear()} Kenya Check. All rights reserved.`,
    footerQuickLinks: loc.footerQuickLinks || undefined,
    socialLinks: raw.socialLinks,
  };

  if (!STRAPI_URL) return fallback;

  try {
    const data: any = await strapiGet(`site-setting?populate=*&locale=${locale}`);
    if (!data.data?.attributes) return fallback;
    const a = data.data.attributes;
    return {
      siteName: a.siteName || fallback.siteName,
      siteTitle: a.siteTitle || fallback.siteTitle,
      tagline: a.tagline || fallback.tagline,
      logo: a.logo?.data?.attributes?.url ? formatImageUrl(a.logo.data.attributes.url) : fallback.logo,
      logoAlt: a.logoAlt || fallback.logoAlt,
      emergencyBannerText: a.emergencyBannerText || fallback.emergencyBannerText,
      emergencyPhone: a.emergencyPhone || fallback.emergencyPhone,
      emergencyWhatsApp: a.emergencyWhatsApp || fallback.emergencyWhatsApp,
      aboutBrief: a.aboutBrief || fallback.aboutBrief,
      footerText: a.footerText || fallback.footerText,
      footerIfcnNotice: a.footerIfcnNotice || fallback.footerIfcnNotice,
      footerCopyright: a.footerCopyright || fallback.footerCopyright,
      footerQuickLinks: a.footerQuickLinks || fallback.footerQuickLinks,
      socialLinks: a.socialLinks || fallback.socialLinks,
    };
  } catch {
    return fallback;
  }
}

export async function getMpoxHubPage(locale: Locale): Promise<MpoxHubPage> {
  const raw = rawSeed.mpoxHubPage;
  const loc = raw.locales[locale] ?? raw.locales.en;

  const fallback: MpoxHubPage = {
    heroTitle: loc.heroTitle,
    heroSubtitle: loc.heroSubtitle,
    alertBadgeText: loc.alertBadgeText,
    alertHeadline: loc.alertHeadline,
    alertSummary: loc.alertSummary,
    guidelines: loc.guidelines,
    rumorReportPrompt: loc.rumorReportPrompt,
    feedTitle: loc.feedTitle || (locale === "sw" ? "Ukaguzi wa Habari" : "Fact Check"),
    featuredBadgeText: loc.featuredBadgeText || (locale === "sw" ? "UCHUNGUZI MAALUM" : "FEATURED INVESTIGATION"),
    featuredTitleOverride: loc.featuredTitleOverride || undefined,
    featuredSummaryOverride: loc.featuredSummaryOverride || undefined,
    featuredImageOverride: loc.featuredImageOverride || undefined,
  };

  if (!STRAPI_URL) return fallback;

  try {
    const data: any = await strapiGet(`mpox-hub-page?populate=*&locale=${locale}`);
    if (!data.data?.attributes) return fallback;
    const a = data.data.attributes;
    return {
      heroTitle: a.heroTitle || fallback.heroTitle,
      heroSubtitle: a.heroSubtitle || fallback.heroSubtitle,
      alertBadgeText: a.alertBadgeText || fallback.alertBadgeText,
      alertHeadline: a.alertHeadline || fallback.alertHeadline,
      alertSummary: a.alertSummary || fallback.alertSummary,
      guidelines: a.guidelines || fallback.guidelines,
      rumorReportPrompt: a.rumorReportPrompt || fallback.rumorReportPrompt,
      feedTitle: a.feedTitle || fallback.feedTitle,
      featuredBadgeText: a.featuredBadgeText || fallback.featuredBadgeText,
      featuredArticleSlug: a.featuredArticle?.data?.attributes?.slug || undefined,
      featuredTitleOverride: a.featuredTitleOverride || undefined,
      featuredSummaryOverride: a.featuredSummaryOverride || undefined,
      featuredImageOverride: a.featuredImageOverride?.data?.attributes?.url ? formatImageUrl(a.featuredImageOverride.data.attributes.url) : undefined,
    };
  } catch {
    return fallback;
  }
}

export async function getAboutPage(locale: Locale): Promise<AboutPageData> {
  const fallback: AboutPageData = {};

  if (!STRAPI_URL) return fallback;

  try {
    let data: any = await strapiGet(`about-page?locale=${locale}`);
    if (!data.data?.attributes && locale !== "en") {
      data = await strapiGet(`about-page?locale=en`);
    }
    if (!data.data?.attributes) return fallback;
    const a = data.data.attributes;
    return {
      title: a.title || undefined,
      intro: a.intro || undefined,
      mission: a.mission || undefined,
      verificationSteps: a.verificationSteps || a.protocol3PFCP || undefined,
      protocol3PFCP: a.protocol3PFCP || a.verificationSteps || undefined,
      editorialPrinciples: a.editorialPrinciples || a.ifcnPrinciples || undefined,
      ifcnPrinciples: a.ifcnPrinciples || a.editorialPrinciples || undefined,
      correctionPolicy: a.correctionPolicy || undefined,
      teamSummary: a.teamSummary || undefined,
    };
  } catch {
    return fallback;
  }
}


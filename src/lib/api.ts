import type { Locale } from "./types";
import type {
  FactCheck, VerdictInfo, CategoryInfo, AuthorInfo,
  SiteSetting, MpoxHubPage,
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

// ─── Resolve seed fact-checks ─────────────────────────────────────────────────
function seedFactChecks(locale: Locale): FactCheck[] {
  const verdicts = getVerdicts(locale);
  const categories = getCategories(locale);
  const authors = getAuthors();

  return rawSeed.factChecks.map((fc: any) => {
    const loc = fc.locales[locale] ?? fc.locales.en;
    const verdict = verdicts.find((v) => v.slug === fc.verdictSlug);
    const category = categories.find((c) => c.slug === fc.categorySlug);
    const author = authors.find((a) => a.id === fc.authorId);
    const editor = authors.find((a) => a.id === fc.editorId);
    return {
      slug: fc.slug,
      claimDate: fc.claimDate,
      publishDate: fc.publishDate,
      verdictSlug: fc.verdictSlug,
      categorySlug: fc.categorySlug,
      authorId: fc.authorId,
      editorId: fc.editorId,
      verificationMethod: fc.verificationMethod,
      isFeatured: fc.isFeatured,
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
    } as FactCheck;
  });
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
    slug: a.slug,
    claimDate: a.claimDate || a.publishedAt || new Date().toISOString(),
    publishDate: a.publishedAt || new Date().toISOString(),
    verdictSlug: a.verdict?.data?.attributes?.slug || "unverified",
    categorySlug: a.category?.data?.attributes?.slug || "general",
    authorId: a.author?.data?.id ? String(a.author.data.id) : "",
    editorId: a.editor?.data?.id ? String(a.editor.data.id) : undefined,
    verificationMethod: a.verificationMethod || "PROTOCOL_3PFCP",
    isFeatured: Boolean(a.isFeatured),
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
  };
}

// ─── Public API ──────────────────────────────────────────────────────────────
export async function getAllFactChecks(locale: Locale): Promise<FactCheck[]> {
  if (!STRAPI_URL) return seedFactChecks(locale);
  try {
    const data: any = await strapiGet(
      `fact-checks?populate=*&locale=${locale}&pagination[pageSize]=50&sort=publishedAt:desc`
    );
    if (!data?.data || data.data.length === 0) {
      if (locale !== "en") {
        try {
          const enData: any = await strapiGet(
            `fact-checks?populate=*&locale=en&pagination[pageSize]=50&sort=publishedAt:desc`
          );
          if (enData?.data && enData.data.length > 0) {
            return enData.data.map(mapStrapiFactCheck);
          }
        } catch {
          // ignore
        }
      }
      return seedFactChecks(locale);
    }
    return data.data.map(mapStrapiFactCheck);
  } catch (err) {
    console.warn("Strapi fact-checks fetch failed, falling back to seed:", err);
    return seedFactChecks(locale);
  }
}

export async function getFactCheck(
  slug: string,
  locale: Locale
): Promise<FactCheck | null> {
  if (!STRAPI_URL) {
    return seedFactChecks(locale).find((fc) => fc.slug === slug) ?? null;
  }
  try {
    const data: any = await strapiGet(
      `fact-checks?filters[slug][$eq]=${slug}&populate=*&locale=${locale}`
    );
    if (!data.data?.length) {
      if (locale !== "en") {
        const enData: any = await strapiGet(
          `fact-checks?filters[slug][$eq]=${slug}&populate=*&locale=en`
        );
        if (enData?.data?.length) {
          return mapStrapiFactCheck(enData.data[0]);
        }
      }
      return seedFactChecks(locale).find((fc) => fc.slug === slug) ?? null;
    }
    return mapStrapiFactCheck(data.data[0]);
  } catch (err) {
    console.warn(`Strapi getFactCheck(${slug}) failed:`, err);
    return seedFactChecks(locale).find((fc) => fc.slug === slug) ?? null;
  }
}

export async function getSiteSetting(locale: Locale): Promise<SiteSetting> {
  const raw = rawSeed.siteSetting;
  const loc = raw.locales[locale] ?? raw.locales.en;

  const fallback: SiteSetting = {
    siteName: loc.siteName || "CONGO CHECK",
    siteTitle: loc.siteTitle || (locale === "sw" ? "Congo Check MpoxFacts — Ukweli Kuhusu Mpox" : "Congo Check MpoxFacts — Verified Health Investigations"),
    tagline: loc.tagline || "MpoxFacts",
    logo: raw.logo || "",
    logoAlt: loc.logoAlt || "Congo Check Logo",
    emergencyBannerText: loc.emergencyBannerText,
    emergencyPhone: raw.emergencyPhone,
    emergencyWhatsApp: raw.emergencyWhatsApp,
    aboutBrief: loc.aboutBrief,
    footerText: loc.footerText || (locale === "sw" ? "Congo Check ni shirika la kwanza na pekee huru la ukaguzi wa ukweli la Jamhuri ya Kidemokrasia ya Kongo lililoidhinishwa na IFCN." : "Congo Check is the first and only independent fact-checking platform in the DRC certified by the International Fact-Checking Network (IFCN)."),
    footerIfcnNotice: loc.footerIfcnNotice || (locale === "sw" ? "Mwanachama Aliyeidhinishwa wa Kanuni za IFCN" : "Certified Member of the IFCN Code of Principles"),
    footerCopyright: loc.footerCopyright || `© ${new Date().getFullYear()} Congo Check. All rights reserved.`,
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
      logo: a.logo?.data?.attributes?.url ? `${STRAPI_URL}${a.logo.data.attributes.url}` : fallback.logo,
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
    feedTitle: loc.feedTitle || (locale === "sw" ? "Ukaguzi wa Habari" : "Fact Checks"),
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
      featuredImageOverride: a.featuredImageOverride?.data?.attributes?.url ? `${STRAPI_URL}${a.featuredImageOverride.data.attributes.url}` : undefined,
    };
  } catch {
    return fallback;
  }
}

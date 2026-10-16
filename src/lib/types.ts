// ─── Shared Types ────────────────────────────────────────────────────────────

export type Locale = "en" | "sw";

export interface VerdictInfo {
  slug: string;
  name: string;
  colorCode: string;
  iconName: string;
  description: string;
}

export interface CategoryInfo {
  slug: string;
  name: string;
  description: string;
}

export interface AuthorInfo {
  id: string;
  name: string;
  role: string;
  bio: string;
  organization: string;
  twitterHandle?: string;
}

export interface SourceRef {
  title: string;
  url: string;
}

export interface FactCheck {
  slug: string;
  claimDate: string;
  publishDate: string;
  verdictSlug: string;
  categorySlug: string;
  authorId: string;
  editorId?: string;
  verificationMethod: string;
  isFeatured: boolean;
  image: string;
  sources: SourceRef[];
  // localized
  title: string;
  claim: string;
  claimant: string;
  verdictSummary: string;
  imageCaption: string;
  explanation: string;
  // resolved
  verdict?: VerdictInfo;
  category?: CategoryInfo;
  author?: AuthorInfo;
  editor?: AuthorInfo;
}

export interface FooterLinkItem {
  label: string;
  url: string;
}

export interface SiteSetting {
  siteName: string;
  siteTitle?: string;
  tagline: string;
  logo?: string;
  logoAlt?: string;
  emergencyBannerText: string;
  emergencyPhone: string;
  emergencyWhatsApp: string;
  aboutBrief: string;
  footerText?: string;
  footerIfcnNotice?: string;
  footerCopyright: string;
  footerQuickLinks?: FooterLinkItem[];
  socialLinks: {
    facebook?: string;
    twitter?: string;
    whatsapp?: string;
    youtube?: string;
  };
}

export interface Guideline {
  icon: string;
  title: string;
  desc: string;
}

export interface MpoxHubPage {
  heroTitle: string;
  heroSubtitle: string;
  alertBadgeText: string;
  alertHeadline: string;
  alertSummary: string;
  guidelines: Guideline[];
  rumorReportPrompt: string;
  feedTitle?: string;
  featuredBadgeText?: string;
  featuredArticleSlug?: string;
  featuredTitleOverride?: string;
  featuredSummaryOverride?: string;
  featuredImageOverride?: string;
}

export interface AboutPageData {
  title?: string;
  intro?: string;
  mission?: string;
  verificationSteps?: string;
  protocol3PFCP?: string;
  editorialPrinciples?: string;
  ifcnPrinciples?: string;
  correctionPolicy?: string;
  teamSummary?: string;
}



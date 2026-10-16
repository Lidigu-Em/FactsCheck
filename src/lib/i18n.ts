import type { Locale } from "./types";

export const locales: Locale[] = ["en", "sw"];
export const defaultLocale: Locale = "en";

const translations = {
  en: {
    nav: {
      mpoxfacts: "EbolaFacts",
      factchecks: "Fact Checks",
      about: "About",
      report: "Report a Rumor",
    },
    factCard: {
      readMore: "Read Full Investigation",
      claim: "CLAIM",
      verdict: "VERDICT",
      by: "By",
      on: "on",
      sources: "Verified Sources",
    },
    feed: {
      title: "Fact Checks",
      filter: "Filter by Rating",
      all: "All",
      search: "Search fact checks...",
      noResults: "No fact checks found for your search.",
      featured: "Featured Investigation",
    },
    hub: {
      reportButton: "Submit a Rumor",
      whatsappShare: "Share on WhatsApp",
      learnMore: "Read Our Methodology",
    },
    detail: {
      claimBox: "The Claim Being Verified",
      claimedBy: "Claimed by",
      dateCirculated: "Circulated around",
      verificationMethod: "Verification protocol",
      sources: "Verified Sources & References",
      share: "Share this fact check",
      whatsapp: "Share on WhatsApp",
      copyLink: "Copy Link",
      backToFeed: "← Back to EbolaFacts",
      relatedChecks: "Related Fact Checks",
    },
    report: {
      title: "Report a Rumor — Ripoti Uvumi",
      subtitle: "Spotted dangerous health misinformation? Send us the claim for investigation.",
      fields: {
        claim: "What is the claim?",
        claimPlaceholder: "Describe the rumor or paste the message here...",
        platform: "Where did you see it?",
        url: "Link to post or video (optional)",
        location: "Your location (optional, city/region)",
        contact: "Your contact info (optional, for follow-up)",
      },
      submit: "Submit for Investigation",
      successTitle: "Thank you! Your submission has been received.",
      successText: "Our verification desk will review this claim and publish the fact-check if relevant.",
    },
    emergency: {
      banner: "Ebola Emergency Hotline (DRC): 109 / 110 | Africa CDC: +251 11 551 7700",
    },
    footer: {
      ifcn: "Certified Member of the IFCN Code of Principles",
      about: "About Kenya Check",
      methodology: "Our Methodology",
      corrections: "Correction Policy",
    },
    verdicts: {
      false: "False",
      true: "True",
      misleading: "Misleading",
      unproven: "Unproven",
    },
    about: {
      title: "About Kenya Check & EbolaFacts",
      ifcnBadge: "IFCN Certified Fact-Checker",
      mission: "Mission",
      methodology: "Our 3PFCP Verification Protocol",
      principles: "Editorial Principles",
      corrections: "Correction Policy",
      team: "Our Team",
      steps: [
        { n: "1", title: "Identify the Claim", desc: "Locating viral rumors on WhatsApp, Facebook, TikTok and community radio." },
        { n: "2", title: "Verify the Source", desc: "Tracing origin to primary publication, audio broadcast, or public figure statement." },
        { n: "3", title: "Consult Official Evidence", desc: "Cross-referencing WHO, Africa CDC, Ministry of Health bulletins, and peer-reviewed science." },
        { n: "4", title: "Expert Consultation", desc: "Interviewing medical officers, epidemiologists, and frontline health workers." },
        { n: "5", title: "Publish the Verdict", desc: "Delivering clear rated fact-check available in English and Kiswahili." },
      ],
    },
    platforms: {
      WHATSAPP: "WhatsApp",
      FACEBOOK: "Facebook",
      TIKTOK: "TikTok",
      X_TWITTER: "X / Twitter",
      COMMUNITY_RADIO: "Community Radio",
      WORD_OF_MOUTH: "Word of Mouth",
    },
    lang: { en: "English", sw: "Kiswahili" },
  },
  sw: {
    nav: {
      mpoxfacts: "Ukweli Kuhusu Ebola",
      factchecks: "Ukaguzi wa Habari",
      about: "Kuhusu Sisi",
      report: "Ripoti Uvumi",
    },
    factCard: {
      readMore: "Soma Uchunguzi Kamili",
      claim: "MADAI",
      verdict: "UAMUZI",
      by: "Na",
      on: "tarehe",
      sources: "Vyanzo Vilivyothibitishwa",
    },
    feed: {
      title: "Ukaguzi wa Habari",
      filter: "Chuja kwa Uamuzi",
      all: "Yote",
      search: "Tafuta ukaguzi wa habari...",
      noResults: "Hakuna ukaguzi wa habari uliooana na utafutaji wako.",
      featured: "Uchunguzi Maalum",
    },
    hub: {
      reportButton: "Tuma Uvumi",
      whatsappShare: "Shiriki WhatsApp",
      learnMore: "Soma Mbinu Zetu",
    },
    detail: {
      claimBox: "Madai Yanayochunguzwa",
      claimedBy: "Yanayodaiwa na",
      dateCirculated: "Yalisambazwa takriban",
      verificationMethod: "Itifaki ya uthibitishaji",
      sources: "Vyanzo Vilivyothibitishwa",
      share: "Shiriki ukaguzi huu",
      whatsapp: "Shiriki WhatsApp",
      copyLink: "Nakili Kiungo",
      backToFeed: "← Rudi Ukweli Kuhusu Ebola",
      relatedChecks: "Ukaguzi Unaohusiana",
    },
    report: {
      title: "Ripoti Uvumi — Report a Rumor",
      subtitle: "Umesikia taarifa ya uongo au hatari kuhusu afya? Tuma kwa timu yetu ya ukaguzi.",
      fields: {
        claim: "Ni madai gani?",
        claimPlaceholder: "Elezea uvumi au bandika ujumbe hapa...",
        platform: "Umeona wapi?",
        url: "Kiungo cha chapisho au video (hiari)",
        location: "Mahali ulipo (hiari, mji/mkoa)",
        contact: "Mawasiliano yako (hiari, kwa majibu)",
      },
      submit: "Tuma kwa Uchunguzi",
      successTitle: "Asante! Taarifa yako imepokelewa.",
      successText: "Dawati letu la ukaguzi litakagua madai haya na kuchapisha ukaguzi wa habari iwapo ni muhimu.",
    },
    emergency: {
      banner: "Nambari ya Dharura ya Ebola (DRC): 109 / 110 | Africa CDC: +251 11 551 7700",
    },
    footer: {
      ifcn: "Mwanachama Aliyeidhinishwa wa Kanuni za IFCN",
      about: "Kuhusu Kenya Check",
      methodology: "Mbinu Zetu",
      corrections: "Sera ya Masahihisho",
    },
    verdicts: {
      false: "Uongo",
      true: "Kweli",
      misleading: "Upotoshaji",
      unproven: "Haijathibitishwa",
    },
    about: {
      title: "Kuhusu Kenya Check & Ukweli wa Ebola",
      ifcnBadge: "Mkaguzi wa Habari Aliyeidhinishwa na IFCN",
      mission: "Dhamira",
      methodology: "Itifaki Yetu ya Uthibitishaji wa 3PFCP",
      principles: "Kanuni za Uhariri",
      corrections: "Sera ya Masahihisho",
      team: "Timu Yetu",
      steps: [
        { n: "1", title: "Tambua Madai", desc: "Kutafuta uvumi unaosambaa kwenye WhatsApp, Facebook, TikTok na redio za jamii." },
        { n: "2", title: "Thibitisha Chanzo", desc: "Kufuatilia asili ya chapisho, ujumbe wa sauti, au kauli ya mtu maarufu." },
        { n: "3", title: "Angalia Ushahidi Rasmi", desc: "Kulinganisha na ripoti za WHO, Africa CDC, Wizara ya Afya, na utafiti wa kisayansi." },
        { n: "4", title: "Shauriana na Wataalamu", desc: "Kuzungumza na madaktari, wataalam wa magonjwa, na wafanyakazi wa afya wa mstari wa mbele." },
        { n: "5", title: "Chapisha Uamuzi", desc: "Kutoa ukaguzi wa habari wenye uamuzi wazi, katika Kiingereza na Kiswahili." },
      ],
    },
    platforms: {
      WHATSAPP: "WhatsApp",
      FACEBOOK: "Facebook",
      TIKTOK: "TikTok",
      X_TWITTER: "X / Twitter",
      COMMUNITY_RADIO: "Redio ya Jamii",
      WORD_OF_MOUTH: "Maneno ya Mdomo",
    },
    lang: { en: "English", sw: "Kiswahili" },
  },
} as const;

export type Translations = typeof translations.en;

export function useTranslations(locale: Locale): Translations {
  return translations[locale] as unknown as Translations;
}

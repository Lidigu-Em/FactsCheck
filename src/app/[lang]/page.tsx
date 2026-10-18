import type { Locale } from "@/lib/types";
import Link from "next/link";
import { getAllFactChecks, getMpoxHubPage } from "@/lib/api";
import { useTranslations } from "@/lib/i18n";
import FactCard from "@/components/fact-check/FactCard";
import {
  Shield, Droplets, Hospital, AlertTriangle, MessageCircle, ArrowRight,
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  shield: Shield,
  wash: Droplets,
  hospital: Hospital,
};

export const metadata = {
  title: "Kenya Check — Fact Check",
  description: "Verified bilingual fact-checks and investigations by Kenya Check.",
};

export default async function HomePage({ params }: { params: { lang: Locale } }) {
  const { lang } = params;
  const t = useTranslations(lang);
  const [factChecks, hub] = await Promise.all([
    getAllFactChecks(lang),
    getMpoxHubPage(lang),
  ]);

  // 6 latest fact checks for landing page
  const latestFactChecks = factChecks.slice(0, 6);

  return (
    <div>
      {/* ── 1. Fact Check (First section after Navbar) ───────────────── */}
      <section className="max-w-6xl mx-auto px-4 py-10 md:py-12">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-brand-dark tracking-tight">
              {hub.feedTitle || t.feed.title}
            </h1>
          </div>
          <Link
            href={`/${lang}/fact-checks`}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-red-600 hover:text-red-700 transition-colors"
          >
            {t.feed.viewAll} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Grid of 6 latest cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestFactChecks.map((fc) => (
            <FactCard key={fc.slug} fc={fc} lang={lang} />
          ))}
        </div>

        {/* Link / CTA to navigate to full fact checks page */}
        <div className="text-center mt-10">
          <Link
            href={`/${lang}/fact-checks`}
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3.5 rounded-xl shadow-md transition-colors text-base"
          >
            {t.feed.viewAll} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ── 2. Hero & Health Information (Below Fact Checks) ─────────── */}
      <section className="bg-brand-dark text-white py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-red-600/20 border border-red-500/40 text-red-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-5 uppercase tracking-widest">
            <AlertTriangle className="w-3.5 h-3.5" />
            EbolaFacts
          </div>
          <h2 className="text-2xl md:text-4xl font-black leading-tight mb-4">{hub.heroTitle}</h2>
          <p className="text-gray-300 text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-8">
            {hub.heroSubtitle}
          </p>
          <a
            href={`/${lang}/report`}
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-xl transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            {t.hub.reportButton}
          </a>
        </div>
      </section>

      {/* ── 3. Health Alert Card ─────────────────────────────────────── */}
      <section className="bg-amber-50 border-b border-amber-200">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <span className="inline-flex items-center gap-1.5 bg-amber-500 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
                <AlertTriangle className="w-3 h-3" />
                {hub.alertBadgeText}
              </span>
              <h3 className="text-xl font-bold text-amber-900 mb-2">{hub.alertHeadline}</h3>
              <p className="text-amber-800 text-sm leading-relaxed">{hub.alertSummary}</p>
            </div>
            <div className="md:w-72 grid grid-cols-1 gap-3">
              {hub.guidelines.map((g, i) => {
                const Icon = iconMap[g.icon] ?? Shield;
                return (
                  <div key={i} className="flex items-start gap-3 bg-white border border-amber-200 rounded-xl p-3 shadow-sm">
                    <div className="bg-amber-100 rounded-lg p-2 shrink-0">
                      <Icon className="w-4 h-4 text-amber-700" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-amber-900 mb-0.5">{g.title}</div>
                      <div className="text-xs text-amber-700 leading-relaxed">{g.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. Rumor report prompt ───────────────────────────────────── */}
      <section className="bg-gradient-to-r from-red-600 to-red-700 text-white py-5 px-4">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-medium text-sm text-red-100 text-center sm:text-left">{hub.rumorReportPrompt}</p>
          <a
            href={`/${lang}/report`}
            className="inline-flex items-center gap-2 bg-white text-red-600 font-bold text-sm px-5 py-2.5 rounded-xl whitespace-nowrap hover:bg-red-50 transition-colors shrink-0"
          >
            {t.hub.reportButton} <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>
    </div>
  );
}



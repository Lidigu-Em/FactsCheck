"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import { MessageCircle, CheckCircle2, Send } from "lucide-react";
import type { Locale } from "@/lib/types";
import { useTranslations } from "@/lib/i18n";

const PLATFORMS = [
  "WHATSAPP", "FACEBOOK", "TIKTOK", "X_TWITTER", "COMMUNITY_RADIO", "WORD_OF_MOUTH",
] as const;

const KENYAN_COUNTIES = [
  "Baringo", "Bomet", "Bungoma", "Busia", "Elgeyo Marakwet", "Embu", "Garissa",
  "Homa Bay", "Isiolo", "Kajiado", "Kakamega", "Kericho", "Kiambu", "Kilifi",
  "Kirinyaga", "Kisii", "Kisumu", "Kitui", "Kwale", "Laikipia", "Lamu",
  "Machakos", "Makueni", "Mandera", "Marsabit", "Meru", "Migori", "Mombasa",
  "Murang'a", "Nairobi", "Nakuru", "Nandi", "Narok", "Nyamira", "Nyandarua",
  "Nyeri", "Samburu", "Siaya", "Taita Taveta", "Tana River", "Tharaka Nithi",
  "Trans Nzoia", "Turkana", "Uasin Gishu", "Vihiga", "Wajir", "West Pokot",
  "Other / Outside Kenya"
] as const;

export default function ReportPage() {
  const { lang } = useParams() as { lang: Locale };
  const t = useTranslations(lang);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    claimText: "",
    sourcePlatform: "WHATSAPP",
    sourceUrl: "",
    location: "",
    reporterContact: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // In production: POST to /api/claim-reports via Strapi
    await new Promise((r) => setTimeout(r, 600));
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-black text-brand-dark mb-3">{t.report.successTitle}</h2>
        <p className="text-gray-600 leading-relaxed">{t.report.successText}</p>
        <a
          href={`/${lang}`}
          className="mt-6 inline-block bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors"
        >
          ← {t.nav.mpoxfacts}
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="w-14 h-14 rounded-2xl bg-red-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-red-600/20">
          <MessageCircle className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-3xl font-black text-brand-dark dark:text-white">{t.report.title}</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-[#161726] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 space-y-5">
        {/* Claim text */}
        <div>
          <label className="block text-sm font-semibold text-brand-dark dark:text-white mb-1.5">
            {t.report.fields.claim} <span className="text-red-500">*</span>
          </label>
          <textarea
            name="claimText"
            required
            rows={4}
            value={form.claimText}
            onChange={handleChange}
            placeholder={t.report.fields.claimPlaceholder}
            className="w-full border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 bg-white dark:bg-[#1E1F30] text-brand-dark dark:text-white placeholder-gray-400 resize-none"
          />
        </div>

        {/* Platform */}
        <div>
          <label className="block text-sm font-semibold text-brand-dark dark:text-white mb-1.5">
            {t.report.fields.platform} <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {PLATFORMS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setForm((f) => ({ ...f, sourcePlatform: p }))}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  form.sourcePlatform === p
                    ? "bg-brand-dark dark:bg-red-600 text-white border-transparent shadow-sm"
                    : "bg-white dark:bg-[#1E1F30] text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-800 hover:border-gray-400 dark:hover:border-gray-700"
                }`}
              >
                {(t.platforms as Record<string, string>)[p] ?? p}
              </button>
            ))}
          </div>
        </div>

        {/* Source URL */}
        <div>
          <label className="block text-sm font-semibold text-brand-dark dark:text-white mb-1.5">
            {t.report.fields.url}
          </label>
          <input
            name="sourceUrl"
            type="url"
            value={form.sourceUrl}
            onChange={handleChange}
            placeholder="https://..."
            className="w-full border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 bg-white dark:bg-[#1E1F30] text-brand-dark dark:text-white placeholder-gray-400"
          />
        </div>

        {/* Location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-brand-dark dark:text-white mb-1.5">
              {t.report.fields.location}
            </label>
            <select
              name="location"
              value={form.location}
              onChange={handleChange}
              className="w-full border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 bg-white dark:bg-[#1E1F30] text-brand-dark dark:text-white"
            >
              <option value="">
                {lang === "sw" ? "-- Chagua Kaunti (Hiari) --" : "-- Select County (Optional) --"}
              </option>
              {KENYAN_COUNTIES.map((county) => (
                <option key={county} value={county} className="bg-white dark:bg-[#161726] text-brand-dark dark:text-white">
                  {county}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-brand-dark dark:text-white mb-1.5">
              {t.report.fields.contact}
            </label>
            <input
              name="reporterContact"
              value={form.reporterContact}
              onChange={handleChange}
              placeholder="+254... or email"
              className="w-full border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 bg-white dark:bg-[#1E1F30] text-brand-dark dark:text-white placeholder-gray-400"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-colors mt-2"
        >
          <Send className="w-4 h-4" />
          {t.report.submit}
        </button>
      </form>
    </div>
  );
}

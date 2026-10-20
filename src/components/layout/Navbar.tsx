"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X, Languages, Globe } from "lucide-react";
import type { Locale } from "@/lib/types";
import { useTranslations } from "@/lib/i18n";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/ui/ThemeToggle";

interface NavbarProps {
  lang: Locale;
  siteName: string;
  tagline?: string;
  logo?: string;
  logoAlt?: string;
}

export default function Navbar({ lang, siteName, tagline, logo, logoAlt }: NavbarProps) {
  const t = useTranslations(lang);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const otherLang: Locale = lang === "en" ? "sw" : "en";
  const altPath = pathname.replace(`/${lang}`, `/${otherLang}`);

  const navLinks = [
    { href: `/${lang}/fact-checks`, label: t.nav.factchecks },
    { href: `/${lang}/about`, label: t.nav.about },
  ];

  return (
    <header className="bg-black/95 dark:bg-black/95 backdrop-blur-md text-white sticky top-0 z-40 shadow-xl border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-between gap-6 h-20">

        {/* ── Logo ─────────────────────────────────────────── */}
        <Link href={`/${lang}`} className="flex items-center gap-3.5 shrink-0 py-2">
          {logo ? (
            <img
              src={logo}
              alt={logoAlt || siteName || "Kenya Check Logo"}
              className="h-12 sm:h-14 md:h-16 w-auto max-w-[260px] object-contain transition-transform hover:scale-[1.02]"
            />
          ) : (
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-11 h-11 rounded-xl bg-red-600 text-white font-black text-2xl shadow-md">✓</span>
              <div className="flex flex-col">
                <span className="font-black text-xl sm:text-2xl leading-none text-white tracking-tight uppercase">
                  {siteName || "KENYA CHECK"}
                </span>
                {tagline ? (
                  <span className="text-[10px] text-red-400 font-bold uppercase tracking-widest mt-1">
                    {tagline}
                  </span>
                ) : null}
              </div>
            </div>
          )}
        </Link>

        {/* ── Desktop nav + actions (spaced like CANEX) ─────── */}
        <div className="hidden md:flex items-center gap-8 ml-auto">
          {/* Nav links */}
          <nav className="flex items-center gap-7">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-sm font-semibold text-gray-200 hover:text-white transition-colors tracking-wide"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Action buttons (pill style like CANEX) */}
          <div className="flex items-center gap-3.5 pl-4 border-l border-gray-800">
            <Link
              href={`/${lang}/report`}
              className="bg-red-600 hover:bg-red-700 text-white text-sm font-bold px-5 py-2.5 rounded-full transition-all shadow-md shadow-red-950/40 hover:shadow-red-700/30 whitespace-nowrap"
            >
              {t.nav.report}
            </Link>

            <ThemeToggle />

            <Link
              href={altPath}
              className="flex items-center gap-1.5 text-xs font-semibold text-gray-300 hover:text-white border border-gray-700 hover:border-gray-400 px-3.5 py-2 rounded-full transition-all"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{t.lang[otherLang]}</span>
            </Link>
          </div>
        </div>

        {/* ── Mobile menu button ─────────────────────────────── */}
        <div className="flex md:hidden items-center gap-2.5">
          <ThemeToggle />
          <button
            className="text-white p-2 rounded-lg hover:bg-gray-800/80 transition-colors"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* ── Mobile menu dropdown ─────────────────────────────── */}
      {open && (
        <div className="md:hidden bg-black/95 border-t border-gray-800 px-6 py-5 flex flex-col gap-4">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="text-gray-200 hover:text-white font-semibold py-2 text-base tracking-wide"
            >
              {label}
            </Link>
          ))}
          <Link
            href={`/${lang}/report`}
            onClick={() => setOpen(false)}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-full text-center transition-all text-sm mt-1"
          >
            {t.nav.report}
          </Link>
          <Link
            href={altPath}
            onClick={() => setOpen(false)}
            className="flex items-center justify-center gap-2 text-gray-400 hover:text-white text-sm py-2 border border-gray-800 rounded-full mt-1"
          >
            <Languages className="w-4 h-4" />
            <span>{lang === "en" ? "Badilisha hadi Kiswahili" : "Switch to English"}</span>
          </Link>
        </div>
      )}
    </header>
  );
}

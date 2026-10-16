"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X, Languages, Globe } from "lucide-react";
import type { Locale } from "@/lib/types";
import { useTranslations } from "@/lib/i18n";
import { usePathname } from "next/navigation";

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
  // Swap the language prefix in the current path
  const altPath = pathname.replace(`/${lang}`, `/${otherLang}`);

  const navLinks = [
    { href: `/${lang}`, label: t.nav.mpoxfacts },
    { href: `/${lang}/about`, label: t.nav.about },
  ];

  return (
    <header className="bg-brand-dark text-white sticky top-0 z-40 shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href={`/${lang}`} className="flex items-center gap-2.5">
          {logo ? (
            <img
              src={logo}
              alt={logoAlt || siteName || "Logo"}
              className="h-9 w-auto max-w-[140px] object-contain rounded"
            />
          ) : (
            <span className="text-red-400 font-black text-2xl tracking-tight">✓</span>
          )}
          <div>
            <div className="font-black text-lg leading-none text-white tracking-tight">{siteName || "KENYA CHECK"}</div>
            {tagline ? (
              <div className="text-xs text-red-400 font-semibold uppercase tracking-widest">{tagline}</div>
            ) : null}
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
            >
              {label}
            </Link>
          ))}
          <Link
            href={`/${lang}/report`}
            className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            {t.nav.report}
          </Link>
        </nav>

        {/* Language switcher + mobile hamburger */}
        <div className="flex items-center gap-3">
          <Link
            href={altPath}
            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-gray-300 hover:text-white border border-gray-600 hover:border-gray-400 px-3 py-1.5 rounded-full transition-all"
          >
            <Globe className="w-3.5 h-3.5" />
            {t.lang[otherLang]}
          </Link>
          <button
            className="md:hidden text-white"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-brand-dark border-t border-gray-700 px-4 py-4 flex flex-col gap-3">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="text-gray-300 hover:text-white font-medium py-2"
            >
              {label}
            </Link>
          ))}
          <Link
            href={`/${lang}/report`}
            onClick={() => setOpen(false)}
            className="bg-red-600 text-white font-semibold px-4 py-2 rounded-lg text-center"
          >
            {t.nav.report}
          </Link>
          <Link
            href={altPath}
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 text-gray-400 text-sm"
          >
            <Languages className="w-4 h-4" />
            {lang === "en" ? "Kiswahili" : "English"}
          </Link>
        </div>
      )}
    </header>
  );
}

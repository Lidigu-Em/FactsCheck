import Link from "next/link";
import { Facebook, Twitter, Youtube, MessageCircle, Award } from "lucide-react";
import type { Locale } from "@/lib/types";
import type { SiteSetting } from "@/lib/types";
import { useTranslations } from "@/lib/i18n";

interface FooterProps {
  lang: Locale;
  site: SiteSetting;
}

export default function Footer({ lang, site }: FooterProps) {
  const t = useTranslations(lang);

  return (
    <footer className="bg-brand-dark text-gray-300 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-gray-700">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              {site.logo ? (
                <img
                  src={site.logo}
                  alt={site.logoAlt || site.siteName}
                  className="h-8 w-auto max-w-[120px] object-contain rounded"
                />
              ) : null}
              <div>
                <div className="text-white font-black text-xl leading-none">{site.siteName || "KENYA CHECK"}</div>
                {site.tagline ? (
                  <div className="text-red-400 text-xs font-semibold uppercase tracking-widest">{site.tagline}</div>
                ) : null}
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              {site.footerText || site.aboutBrief}
            </p>
            {/* IFCN badge */}
            <div className="flex items-center gap-2 text-xs text-yellow-400 font-semibold">
              <Award className="w-4 h-4 shrink-0" />
              <span>{site.footerIfcnNotice || t.footer.ifcn}</span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Links</h3>
            <ul className="space-y-2 text-sm">
              {site.footerQuickLinks && site.footerQuickLinks.length > 0 ? (
                site.footerQuickLinks.map((link, idx) => (
                  <li key={idx}>
                    <Link href={link.url} className="hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))
              ) : (
                <>
                  <li>
                    <Link href={`/${lang}/fact-checks`} className="hover:text-white transition-colors">
                      {t.nav.factchecks}
                    </Link>
                  </li>
                  <li>
                    <Link href={`/${lang}/about`} className="hover:text-white transition-colors">
                      {t.footer.methodology}
                    </Link>
                  </li>
                  <li>
                    <Link href={`/${lang}/report`} className="hover:text-white transition-colors">
                      {t.nav.report}
                    </Link>
                  </li>
                  <li>
                    <Link href={`/${lang}/about#corrections`} className="hover:text-white transition-colors">
                      {t.footer.corrections}
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Social + Emergency */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Connect</h3>
            <div className="flex gap-3 mb-6">
              {site.socialLinks.facebook && (
                <a href={site.socialLinks.facebook} target="_blank" rel="noopener" aria-label="Facebook"
                   className="text-gray-400 hover:text-blue-400 transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
              )}
              {site.socialLinks.twitter && (
                <a href={site.socialLinks.twitter} target="_blank" rel="noopener" aria-label="X / Twitter"
                   className="text-gray-400 hover:text-sky-400 transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
              )}
              {site.socialLinks.whatsapp && (
                <a href={site.socialLinks.whatsapp} target="_blank" rel="noopener" aria-label="WhatsApp"
                   className="text-gray-400 hover:text-green-400 transition-colors">
                  <MessageCircle className="w-5 h-5" />
                </a>
              )}
              {site.socialLinks.youtube && (
                <a href={site.socialLinks.youtube} target="_blank" rel="noopener" aria-label="YouTube"
                   className="text-gray-400 hover:text-red-400 transition-colors">
                  <Youtube className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <span>{site.footerCopyright}</span>
          <div className="flex gap-4">
            <Link href="/en" className="hover:text-gray-300">English</Link>
            <Link href="/sw" className="hover:text-gray-300">Kiswahili</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

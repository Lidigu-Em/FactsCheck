import type { Locale } from "@/lib/types";
import { locales } from "@/lib/i18n";
import { getSiteSetting } from "@/lib/api";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import EmergencyBanner from "@/components/layout/EmergencyBanner";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: { lang: Locale };
}) {
  const site = await getSiteSetting(params.lang);
  return {
    title: site.siteTitle || site.siteName,
    description: site.tagline,
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: Locale };
}) {
  const { lang } = params;
  const site = await getSiteSetting(lang);

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div>
        {site.emergencyBannerText ? (
          <EmergencyBanner text={site.emergencyBannerText} />
        ) : null}
        <Navbar
          lang={lang}
          siteName={site.siteName}
          logo={site.logo}
          logoAlt={site.logoAlt}
          tagline={site.tagline}
        />
        <main>{children}</main>
      </div>
      <Footer lang={lang} site={site} />
    </div>
  );
}

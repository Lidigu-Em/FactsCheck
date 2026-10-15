import type { Locale } from "@/lib/types";
import { useTranslations } from "@/lib/i18n";
import { getSiteSetting } from "@/lib/api";
import { Award, CheckCircle2 } from "lucide-react";

export default async function AboutPage({ params }: { params: { lang: Locale } }) {
  const { lang } = params;
  const t = useTranslations(lang);
  const site = await getSiteSetting(lang);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-yellow-50 border border-yellow-200 text-yellow-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
          <Award className="w-3.5 h-3.5" />
          {t.about.ifcnBadge}
        </div>
        <h1 className="text-3xl font-black text-brand-dark mb-3">{t.about.title}</h1>
        <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto">{site.aboutBrief}</p>
      </div>

      {/* Mission */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-brand-dark mb-3 border-l-4 border-red-600 pl-4">{t.about.mission}</h2>
        <p className="text-gray-700 leading-relaxed">
          {lang === "en"
            ? "Congo Check is the leading independent fact-checking organization in the Democratic Republic of the Congo and Central/East Africa. Our MpoxFacts desk is dedicated to investigating, verifying, and debunking dangerous health misinformation related to Mpox (monkeypox), epidemics, and public health emergencies. We publish all findings bilingually in English and Kiswahili to serve the widest possible East and Central African audience."
            : "Congo Check ni shirika huru linaloongoza kwa ukaguzi wa taarifa nchini Jamhuri ya Kidemokrasia ya Kongo na Afrika ya Kati na Mashariki. Dawati letu la MpoxFacts lina jukumu la kuchunguza, kuthibitisha, na kukanusha taarifa hatari za kiafya zinazohusu Mpox, magonjwa ya mlipuko, na dharura za afya ya umma. Tunachapisha matokeo yetu kwa Kiingereza na Kiswahili ili kutumikia wasomaji wengi zaidi wa Afrika ya Mashariki na Kati."
          }
        </p>
      </section>

      {/* 3PFCP Protocol */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-brand-dark mb-5 border-l-4 border-red-600 pl-4">
          {t.about.methodology}
        </h2>
        <div className="space-y-4">
          {t.about.steps.map((step) => (
            <div key={step.n} className="flex gap-4 bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
              <div className="w-9 h-9 rounded-full bg-red-600 text-white flex items-center justify-center font-black text-sm shrink-0">
                {step.n}
              </div>
              <div>
                <h3 className="font-bold text-brand-dark mb-1">{step.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* IFCN Principles */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-brand-dark mb-3 border-l-4 border-red-600 pl-4">
          {t.about.principles}
        </h2>
        <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
          {[
            lang === "en"
              ? "Non-partisanship and fairness: Congo Check applies the same standard of scrutiny to all claims regardless of political affiliation or ideology."
              : "Usawa na kutokupendelea upande: Congo Check inatumia viwango sawa vya ukaguzi kwa madai yote bila kujali msimamo wa kisiasa.",
            lang === "en"
              ? "Transparency of sources: We always name primary sources and provide links to evidence so readers can verify our work independently."
              : "Uwazi wa vyanzo: Daima tunaitaja vyanzo vya kimsingi na kutoa viungo vya ushahidi ili wasomaji waweze kuthibitisha kazi yetu kwa uhuru.",
            lang === "en"
              ? "Transparency of funding and organization: We are committed to full financial transparency as required by IFCN signatory standards."
              : "Uwazi wa ufadhili: Tumejitolea kwa uwazi kamili wa kifedha kama unavyohitajika na viwango vya IFCN.",
            lang === "en"
              ? "Transparency of methodology: We publish our verification protocol and explain how claims were checked."
              : "Uwazi wa mbinu: Tunachapisha itifaki yetu ya uthibitishaji na kuelezea jinsi madai yalivyokaguliwa.",
            lang === "en"
              ? "Open and honest corrections policy: We correct errors promptly and transparently with clear correction notices."
              : "Sera ya masahihisho ya wazi: Tunasahihisha makosa haraka na kwa uwazi na taarifa wazi za masahihisho.",
          ].map((principle, i) => (
            <div key={i} className="flex gap-3 mb-3 last:mb-0">
              <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
              <p className="text-sm text-gray-700 leading-relaxed">{principle}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Correction Policy */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-brand-dark mb-3 border-l-4 border-red-600 pl-4">
          {t.about.corrections}
        </h2>
        <p className="text-gray-700 leading-relaxed">
          {lang === "en"
            ? "If you believe Congo Check has made an error in a published fact-check, please contact us with documented evidence at corrections@congocheck.net. Corrections are published at the top of affected articles and summarized in our monthly correction log. We follow the IFCN correction guidelines."
            : "Ikiwa unaamini Congo Check imefanya kosa katika ukaguzi wa habari uliochapishwa, tafadhali wasiliana nasi kwa ushahidi wa nyaraka kwa corrections@congocheck.net. Masahihisho yanachapishwa juu ya makala yaliyoathiriwa na kufupishwa katika kumbukumbu yetu ya kila mwezi ya masahihisho. Tunafuata mwongozo wa IFCN wa masahihisho."
          }
        </p>
      </section>
    </div>
  );
}

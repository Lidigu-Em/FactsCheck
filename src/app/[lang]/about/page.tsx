import type { Locale } from "@/lib/types";
import { useTranslations } from "@/lib/i18n";
import { getSiteSetting, getAboutPage } from "@/lib/api";
import { Award, CheckCircle2, ShieldCheck, Search, FileCheck, Users, Scale } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const stepIcons = [Search, FileCheck, Scale, Users, ShieldCheck];

const defaultPrinciplesEn = [
  {
    num: "1",
    title: "Truth and Verification First",
    items: [
      {
        subtitle: "Radical Verification",
        text: "We do not publish rumors or unverified claims. Every fact, quote, and piece of multimedia must be cross-referenced with at least two independent, reliable sources before publication.",
      },
      {
        subtitle: "Primary Source Dependency",
        text: "We prioritize original documents, official data, direct interviews, and firsthand metadata over secondary reporting or hearsay.",
      },
    ],
  },
  {
    num: "2",
    title: "Absolute Transparency",
    items: [
      {
        subtitle: "Open Methodology",
        text: "We explicitly show our work. Every fact-check and investigation must detail how we arrived at our conclusion, including links to public data, archived webpages, and the tools used.",
      },
      {
        subtitle: "Clear Correction Policy",
        text: "When we make a mistake, we correct it promptly and transparently. Corrections will be clearly labeled at the top of the article, detailing what was wrong and what was updated.",
      },
      {
        subtitle: "Disclosure of Interests",
        text: "We maintain a strict conflict-of-interest policy. Any financial, personal, or professional ties related to a story must be fully disclosed to our audience.",
      },
    ],
  },
  {
    num: "3",
    title: "Non-Partisanship and Fairness",
    items: [
      {
        subtitle: "Issue-Focused, Not Party-Focused",
        text: "We investigate disinformation and rumors regardless of their political, ideological, or corporate origins. We apply the same rigorous standards of proof to all sides.",
      },
      {
        subtitle: "Right of Reply",
        text: "Before publishing an investigative piece or a damaging fact-check about an individual or organization, we must provide them a fair and meaningful opportunity to respond to the specific allegations.",
      },
    ],
  },
  {
    num: "4",
    title: "Digital Integrity and Protection",
    items: [
      {
        subtitle: "Anti-Amplification Protocols",
        text: 'We do not inadvertently spread rumours by repeating sensational headlines. We use visual cues (like "FALSE" watermarks on manipulated images) and careful framing to debunk lies without giving them viral traction.',
      },
    ],
  },
  {
    num: "5",
    title: "Responsible Use of AI",
    items: [
      {
        subtitle: "",
        text: "We use artificial intelligence tools strictly for data processing and analysis. We never use AI to generate editorial content, fake imagery, or unverified summaries.",
      },
    ],
  },
  {
    num: "6",
    title: "Source Protection",
    items: [
      {
        subtitle: "",
        text: "We protect the anonymity of whistle-blowers and vulnerable sources using secure, encrypted communication channels, while continually verifying their credibility behind the scenes.",
      },
    ],
  },
];

const defaultPrinciplesSw = [
  {
    num: "1",
    title: "Ukweli na Uthibitishaji Kwanza (Truth and Verification First)",
    items: [
      {
        subtitle: "Uthibitishaji wa Kina",
        text: "Hatuchapishi uvumi au madai yasiyothibitishwa. Kila ukweli, nukuu, na picha/video lazima vithibitishwe na vyanzo viwili huru na vya kuaminika kabla ya kuchapishwa.",
      },
      {
        subtitle: "Utegemezi wa Vyanzo vya Msingi",
        text: "Tunapa kipaumbele nyaraka halisi, takwimu rasmi, mahojiano ya moja kwa moja, na metadata ya msingi badala ya ripoti za upili au maneno ya kuambiwa.",
      },
    ],
  },
  {
    num: "2",
    title: "Uwazi Kamili (Absolute Transparency)",
    items: [
      {
        subtitle: "Mbinu ya Wazi",
        text: "Tunaonyesha kazi yetu waziwazi. Kila ukaguzi wa habari lazima uelezee jinsi tulivyofikia hitimisho letu, ikiwa ni pamoja na viungo vya data ya umma, kurasa zilizohifadhiwa, na zana zilizotumiwa.",
      },
      {
        subtitle: "Sera ya Masahihisho ya Wazi",
        text: "Tunapofanya kosa, tunalisahihisha haraka na kwa uwazi. Masahihisho yatawekwa wazi juu ya makala, yakieleza kosa lilikuwa nini na nini kimesahihishwa.",
      },
      {
        subtitle: "Kuweka Wazi Maslahi",
        text: "Tunazingatia sera kali ya kuzuia mgongano wa kimaslahi. Maslahi yoyote ya kifedha, kibinafsi, au kitaaluma yanayohusiana na hadithi lazima yawekwe wazi kwa wasomaji wetu.",
      },
    ],
  },
  {
    num: "3",
    title: "Kutopendelea Upande na Usawa (Non-Partisanship and Fairness)",
    items: [
      {
        subtitle: "Kuzingatia Suala, Si Chama",
        text: "Tunachunguza upotoshaji na uvumi bila kujali msimamo wao wa kisiasa, kiitikadi, au kibiashara. Tunatumia viwango vile vile vya uthibitisho kwa pande zote.",
      },
      {
        subtitle: "Haki ya Kujibu",
        text: "Kabla ya kuchapisha uchunguzi au ukaguzi unaoweza kuathiri sifa ya mtu au shirika, lazima tuwape nafasi ya haki na maana ya kujibu madai husika.",
      },
    ],
  },
  {
    num: "4",
    title: "Uadilifu wa Kidijitali na Ulinzi (Digital Integrity and Protection)",
    items: [
      {
        subtitle: "Kuzuia Kueneza Uvumi",
        text: 'Hatusambazi uvumi bila kukusudia kwa kurudia vichwa vya habari vya kushtua. Tunatumia alama za picha (kama vile chapa ya "UONGO" kwenye picha zilizohaririwa) kukanusha uongo bila kuufanya usambae zaidi.',
      },
    ],
  },
  {
    num: "5",
    title: "Matumizi ya Kuwajibika ya Akili Bandia (Responsible Use of AI)",
    items: [
      {
        subtitle: "",
        text: "Tunatumia zana za akili bandia (AI) madhubuti kwa uchakataji na uchambuzi wa data pekee. Kamwe hatutumii AI kuzalisha maudhui ya uhariri, picha za uongo, au muhtasari usioidhinishwa.",
      },
    ],
  },
  {
    num: "6",
    title: "Ulinzi wa Vyanzo (Source Protection)",
    items: [
      {
        subtitle: "",
        text: "Tunalinda usiri wa watoa taarifa na vyanzo vilivyo katika hatari kwa kutumia njia salama zilizosimbwa, huku tukiendelea kuthibitisha uaminifu wao kwa siri.",
      },
    ],
  },
];

export default async function AboutPage({ params }: { params: { lang: Locale } }) {
  const { lang } = params;
  const t = useTranslations(lang);
  const [site, about] = await Promise.all([
    getSiteSetting(lang),
    getAboutPage(lang),
  ]);

  const principles = lang === "sw" ? defaultPrinciplesSw : defaultPrinciplesEn;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-yellow-50 border border-yellow-200 text-yellow-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
          <Award className="w-3.5 h-3.5" />
          {t.about.ifcnBadge}
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-brand-dark mb-4">{about.title || t.about.title}</h1>
        <p className="text-gray-700 text-base md:text-lg leading-relaxed max-w-2xl mx-auto font-medium">
          {about.intro || t.about.intro || site.aboutBrief}
        </p>
      </div>

      {/* Mission */}
      <section className="mb-12 bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm">
        <h2 className="text-2xl font-black text-brand-dark mb-4 border-l-4 border-red-600 pl-4">{t.about.mission}</h2>
        {about.mission ? (
          <div className="article-prose text-gray-700 leading-relaxed">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{about.mission}</ReactMarkdown>
          </div>
        ) : (
          <div className="space-y-4 text-gray-700 leading-relaxed">
            {lang === "en" ? (
              <>
                <p>
                  In an era dominated by clickbait, artificial intelligence (AI) and algorithms that prioritize engagement over accuracy, the primary goal is to tell the truth and be factual by prioritizing strict verification protocols and accurate, evidence-based reporting.
                </p>
                <p className="font-medium text-brand-dark">
                  We will actively dismantle coordinated campaigns by exposing the source, intent, and deceptive tactics used by bad actors.
                </p>
              </>
            ) : (
              <>
                <p>
                  Katika enzi inayotawaliwa na vichwa vya habari vya mitego (clickbait), akili bandia (AI), na algoriti zinazopendelea mwingiliano badala ya usahihi, lengo letu kuu ni kusema ukweli na kuwa sahihi kwa kuweka kipaumbele kwenye itifaki kali za uthibitishaji na ripoti sahihi zenye ushahidi.
                </p>
                <p className="font-medium text-brand-dark">
                  Tutavunja kikamilifu kampeni zilizoratibiwa za upotoshaji kwa kufichua chanzo, nia, na mbinu za udanganyifu zinazotumiwa na watendaji wabaya.
                </p>
              </>
            )}
          </div>
        )}
      </section>

      {/* Our Verification Steps */}
      <section className="mb-12">
        <h2 className="text-2xl font-black text-brand-dark mb-6 border-l-4 border-red-600 pl-4">
          {t.about.methodology}
        </h2>
        {about.verificationSteps || about.protocol3PFCP ? (
          <div className="article-prose text-gray-700 leading-relaxed bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{about.verificationSteps || about.protocol3PFCP}</ReactMarkdown>
          </div>
        ) : (
          <div className="space-y-4">
            {t.about.steps.map((step, idx) => {
              const Icon = stepIcons[idx] ?? Search;
              return (
                <div key={step.n} className="flex gap-4 bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:border-red-100 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-black text-sm shrink-0">
                    {step.n}
                  </div>
                  <div>
                    <h3 className="font-bold text-brand-dark text-base mb-1 flex items-center gap-2">
                      <Icon className="w-4 h-4 text-red-600 inline" />
                      {step.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Editorial Principles */}
      <section className="mb-12">
        <h2 className="text-2xl font-black text-brand-dark mb-6 border-l-4 border-red-600 pl-4">
          {t.about.principles}
        </h2>
        {about.editorialPrinciples || about.ifcnPrinciples ? (
          <div className="article-prose text-gray-700 leading-relaxed bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{about.editorialPrinciples || about.ifcnPrinciples}</ReactMarkdown>
          </div>
        ) : (
          <div className="space-y-5">
            {principles.map((p) => (
              <div key={p.num} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-7 h-7 rounded-lg bg-red-50 text-red-600 font-bold text-xs flex items-center justify-center shrink-0">
                    {p.num}
                  </span>
                  <h3 className="font-bold text-brand-dark text-lg">{p.title}</h3>
                </div>
                <div className="space-y-3 pl-10">
                  {p.items.map((item, i) => (
                    <div key={i} className="flex gap-2.5 items-start">
                      <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {item.subtitle ? (
                          <strong className="text-brand-dark font-semibold">{item.subtitle}: </strong>
                        ) : null}
                        {item.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Correction Policy */}
      {about.correctionPolicy && (
        <section className="mb-12 bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm">
          <h2 className="text-2xl font-black text-brand-dark mb-4 border-l-4 border-red-600 pl-4">
            {t.about.corrections}
          </h2>
          <div className="article-prose text-gray-700 leading-relaxed">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{about.correctionPolicy}</ReactMarkdown>
          </div>
        </section>
      )}

      {/* Team Summary */}
      {about.teamSummary && (
        <section className="mb-12 bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm">
          <h2 className="text-2xl font-black text-brand-dark mb-4 border-l-4 border-red-600 pl-4">
            {t.about.team}
          </h2>
          <div className="article-prose text-gray-700 leading-relaxed">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{about.teamSummary}</ReactMarkdown>
          </div>
        </section>
      )}
    </div>
  );
}



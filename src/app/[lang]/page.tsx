import { redirect } from "next/navigation";
import type { Locale } from "@/lib/types";

export default function LangRoot({ params }: { params: { lang: Locale } }) {
  redirect(`/${params.lang}/mpoxfacts`);
}

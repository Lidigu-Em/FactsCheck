import { redirect } from "next/navigation";
import type { Locale } from "@/lib/types";

export default function LegacyMpoxFactsRedirect({ params }: { params: { lang: Locale } }) {
  redirect(`/${params.lang}`);
}


import { cookies } from "next/headers";
import type { Locale } from "./locale-store";
import { tFor } from "./i18n";

// Server component'lerden locale okumak icin. Client'in document.cookie'ye
// yazdigi "uy-locale" cookie'sini okur, default "tr".
export async function getServerLocale(): Promise<Locale> {
  const c = await cookies();
  const v = c.get("uy-locale")?.value;
  return v === "en" ? "en" : "tr";
}

export async function getServerT() {
  const locale = await getServerLocale();
  return { t: tFor(locale), locale };
}

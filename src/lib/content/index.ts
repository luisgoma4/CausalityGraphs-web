import { es } from "./es";
import { en } from "./en";
import type { Locale, SiteContent } from "./types";

export type { Locale, SiteContent, AcademyMethod } from "./types";

const content: Record<Locale, SiteContent> = { es, en };

export function getContent(locale: Locale): SiteContent {
  return content[locale];
}

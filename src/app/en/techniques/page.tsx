import type { Metadata } from "next";
import { TechniquesView } from "@/components/views/techniques-view";
import { getContent } from "@/lib/content";

const content = getContent("en");

export const metadata: Metadata = content.techniques.seo;

export default function TechniquesPageEn() {
  return <TechniquesView content={content} />;
}

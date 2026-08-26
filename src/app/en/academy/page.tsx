import type { Metadata } from "next";
import { AcademyView } from "@/components/views/academy-view";
import { getContent } from "@/lib/content";

const content = getContent("en");

export const metadata: Metadata = content.academy.seo;

export default function AcademyPageEn() {
  return <AcademyView content={content} />;
}

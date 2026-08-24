import type { Metadata } from "next";
import { AboutView } from "@/components/views/about-view";
import { getContent } from "@/lib/content";

const content = getContent("en");

export const metadata: Metadata = content.about.seo;

export default function AboutPageEn() {
  return <AboutView content={content} />;
}

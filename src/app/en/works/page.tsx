import type { Metadata } from "next";
import { WorksView } from "@/components/views/works-view";
import { getContent } from "@/lib/content";

const content = getContent("en");

export const metadata: Metadata = content.works.seo;

export default function WorksPageEn() {
  return <WorksView content={content} />;
}

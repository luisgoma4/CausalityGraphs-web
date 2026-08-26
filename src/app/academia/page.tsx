import type { Metadata } from "next";
import { AcademyView } from "@/components/views/academy-view";
import { getContent } from "@/lib/content";

const content = getContent("es");

export const metadata: Metadata = content.academy.seo;

export default function AcademyPage() {
  return <AcademyView content={content} />;
}

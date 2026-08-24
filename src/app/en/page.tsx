import type { Metadata } from "next";
import { HomeView } from "@/components/views/home-view";
import { getContent } from "@/lib/content";

const content = getContent("en");

export const metadata: Metadata = content.home.seo;

export default function HomeEn() {
  return <HomeView content={content} contactHref="/en/contact" techniquesHref="/en/techniques" />;
}

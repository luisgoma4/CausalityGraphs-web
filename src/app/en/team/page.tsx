import type { Metadata } from "next";
import { TeamView } from "@/components/views/team-view";
import { getContent } from "@/lib/content";

const content = getContent("en");

export const metadata: Metadata = content.team.seo;

export default function TeamPageEn() {
  return <TeamView content={content} />;
}

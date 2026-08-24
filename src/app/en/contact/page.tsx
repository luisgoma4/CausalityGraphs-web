import type { Metadata } from "next";
import { ContactView } from "@/components/views/contact-view";
import { getContent } from "@/lib/content";

const content = getContent("en");

export const metadata: Metadata = content.contact.seo;

export default function ContactPageEn() {
  return <ContactView content={content} />;
}

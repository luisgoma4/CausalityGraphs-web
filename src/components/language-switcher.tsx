"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { SiteContent } from "@/lib/content";

function alternatePath(pathname: string, targetLocale: "es" | "en") {
  const isEnglish = pathname === "/en" || pathname.startsWith("/en/");
  const esPath = isEnglish ? pathname.replace(/^\/en/, "") || "/" : pathname;

  if (targetLocale === "es") return esPath;
  return esPath === "/" ? "/en" : `/en${esPath}`;
}

export function LanguageSwitcher({
  content,
  onNavigateAction,
}: {
  content: SiteContent;
  onNavigateAction?: () => void;
}) {
  const pathname = usePathname();

  return (
    <div className="language-switcher" aria-label="Language">
      <Link
        href={alternatePath(pathname, "es")}
        aria-current={content.locale === "es" ? "true" : undefined}
        className={content.locale === "es" ? "language-switcher-active" : undefined}
        onClick={onNavigateAction}
      >
        {content.languageSwitcher.es}
      </Link>
      <span aria-hidden="true">/</span>
      <Link
        href={alternatePath(pathname, "en")}
        aria-current={content.locale === "en" ? "true" : undefined}
        className={content.locale === "en" ? "language-switcher-active" : undefined}
        onClick={onNavigateAction}
      >
        {content.languageSwitcher.en}
      </Link>
    </div>
  );
}

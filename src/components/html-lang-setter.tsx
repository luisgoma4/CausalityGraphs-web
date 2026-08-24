"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function HtmlLangSetter() {
  const pathname = usePathname();

  useEffect(() => {
    const isEnglish = pathname === "/en" || pathname.startsWith("/en/");
    document.documentElement.lang = isEnglish ? "en" : "es";
  }, [pathname]);

  return null;
}

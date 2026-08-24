"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getContent } from "@/lib/content";
import { LanguageSwitcher } from "@/components/language-switcher";

export function SiteHeader() {
  const pathname = usePathname();
  const locale = pathname === "/en" || pathname.startsWith("/en/") ? "en" : "es";
  const content = getContent(locale);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="site-header">
        <div className="container nav-row">
          <Link href={locale === "en" ? "/en" : "/"} className="brand-lockup">
            <span className="brand-dot" />
            <span>
              <strong>Causality</strong>
              <small>Graphs</small>
            </span>
          </Link>

          <nav className="site-nav site-nav-desktop" aria-label="Primary">
            {content.nav.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="language-switcher-desktop">
            <LanguageSwitcher content={content} />
          </div>

          <button
            type="button"
            className="nav-toggle"
            aria-expanded={open}
            aria-controls="mobile-drawer-nav"
            onClick={() => setOpen(true)}
          >
            <span className="sr-only">{content.navMenu.openLabel}</span>
            <span className="nav-toggle-bar" />
            <span className="nav-toggle-bar" />
            <span className="nav-toggle-bar" />
          </button>
        </div>
      </header>

      <div className={`mobile-drawer-backdrop ${open ? "is-open" : ""}`} onClick={() => setOpen(false)} aria-hidden="true" />

      <div className={`mobile-drawer ${open ? "is-open" : ""}`} role="dialog" aria-modal="true" aria-label={content.navMenu.openLabel}>
        <div className="mobile-drawer-header">
          <button type="button" className="mobile-drawer-close" onClick={() => setOpen(false)}>
            {content.navMenu.closeLabel}
          </button>
        </div>
        <nav id="mobile-drawer-nav" className="site-nav mobile-drawer-nav" aria-label="Primary">
          {content.nav.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
              {item.label}
            </Link>
          ))}
          <LanguageSwitcher content={content} />
        </nav>
      </div>
    </>
  );
}

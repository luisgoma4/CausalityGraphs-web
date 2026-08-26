"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import { getContent } from "@/lib/content";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ThemeToggle } from "@/components/theme-toggle";

export function SiteHeader() {
  const pathname = usePathname();
  const locale = pathname === "/en" || pathname.startsWith("/en/") ? "en" : "es";
  const content = getContent(locale);
  const [open, setOpen] = useState(false);

  return (
    <>
      <a href="#main-content" className="skip-link sr-only">
        {content.a11y.skipToContent}
      </a>
      <Dialog.Root open={open} onOpenChange={setOpen}>
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
            <div className="header-controls-desktop">
              <LanguageSwitcher content={content} />
              <ThemeToggle content={content} />
            </div>

            <Dialog.Trigger asChild>
              <button type="button" className="nav-toggle">
                <span className="sr-only">{content.navMenu.openLabel}</span>
                <span className="nav-toggle-bar" />
                <span className="nav-toggle-bar" />
                <span className="nav-toggle-bar" />
              </button>
            </Dialog.Trigger>
          </div>
        </header>

        <Dialog.Portal>
          <Dialog.Overlay className="mobile-dialog-overlay" />
          <Dialog.Content className="mobile-dialog-content">
            <div className="mobile-dialog-header">
              <Dialog.Title className="sr-only">{content.navMenu.openLabel}</Dialog.Title>
              <Dialog.Close asChild>
                <button type="button" className="mobile-dialog-close">
                  {content.navMenu.closeLabel}
                </button>
              </Dialog.Close>
            </div>
            <nav className="site-nav mobile-dialog-nav" aria-label="Primary">
              {content.nav.map((item) => (
                <Dialog.Close asChild key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </Dialog.Close>
              ))}
              <div className="mobile-dialog-controls">
                <LanguageSwitcher content={content} onNavigateAction={() => setOpen(false)} />
                <ThemeToggle content={content} />
              </div>
            </nav>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}

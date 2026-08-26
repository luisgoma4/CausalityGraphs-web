"use client";

import { useEffect, useState } from "react";
import type { SiteContent } from "@/lib/content";

type Theme = "light" | "dark";

const THEME_STORAGE_KEY = "theme";

// Binary light/dark toggle, no explicit third "system" option in the UI:
// the anti-flash script in layout.tsx already resolves "system" into a
// concrete data-theme value before React ever mounts, so there is no
// observable "system" state left to expose once the page has rendered —
// only "the value the user has not overridden yet" vs. "light" vs. "dark".
// A visitor can always return to following the OS preference by clearing
// site data; adding a third button state here would need tri-state
// aria-pressed semantics (unsupported) for a control most visitors will
// use at most once per session.
export function ThemeToggle({ content }: { content: SiteContent }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // The anti-flash inline script (src/app/layout.tsx) already resolved
    // and applied data-theme before hydration. Read it back from the DOM
    // rather than re-reading localStorage, so there is a single source of
    // truth and no risk of a hydration mismatch.
    const syncFromDom = () => {
      const applied = document.documentElement.getAttribute("data-theme");
      setTheme(applied === "dark" ? "dark" : "light");
      setMounted(true);
    };
    syncFromDom();
  }, []);

  const toggleTheme = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // localStorage can throw in private-browsing/blocked-storage contexts;
      // the theme still applies for the current page view.
    }
    setTheme(next);
  };

  const label = theme === "dark" ? content.themeToggle.switchToLightLabel : content.themeToggle.switchToDarkLabel;

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={label}
      aria-pressed={mounted ? theme === "dark" : undefined}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        width="18"
        height="18"
        className="theme-toggle-icon theme-toggle-icon-sun"
      >
        <circle cx="12" cy="12" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <g stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <line x1="12" y1="1.5" x2="12" y2="4" />
          <line x1="12" y1="20" x2="12" y2="22.5" />
          <line x1="1.5" y1="12" x2="4" y2="12" />
          <line x1="20" y1="12" x2="22.5" y2="12" />
          <line x1="4.4" y1="4.4" x2="6.1" y2="6.1" />
          <line x1="17.9" y1="17.9" x2="19.6" y2="19.6" />
          <line x1="4.4" y1="19.6" x2="6.1" y2="17.9" />
          <line x1="17.9" y1="6.1" x2="19.6" y2="4.4" />
        </g>
      </svg>
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        width="18"
        height="18"
        className="theme-toggle-icon theme-toggle-icon-moon"
      >
        <path
          fill="currentColor"
          d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a.6.6 0 0 0-.8-.7A9.5 9.5 0 1 0 21.2 15.3a.6.6 0 0 0-.7-.8Z"
        />
      </svg>
    </button>
  );
}

import type { Metadata, Viewport } from "next";
import { Manrope, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { HtmlLangSetter } from "@/components/html-lang-setter";

const bodyFont = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const monoFont = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono-face",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

// Sets data-theme on <html> before hydration to avoid a flash of the wrong
// color scheme. Mirrors the localStorage-first, system-preference-fallback
// pattern; see docs/03-design-system.md §4. No UI toggle yet — that's a
// separate component (out of scope for this task).
const themeInitScript = `(function(){try{var t=localStorage.getItem("theme");if(t!=="light"&&t!=="dark"){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";}document.documentElement.setAttribute("data-theme",t);}catch(e){}})();`;

export const metadata: Metadata = {
  title: "Causality Graphs",
  description:
    "Causal consulting for pharma using DAGs and dynamic causal models in complex or non-ideal study designs.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${bodyFont.variable} ${monoFont.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <HtmlLangSetter />
        <div className="site-background" />
        <SiteHeader />
        <main>{children}</main>
      </body>
    </html>
  );
}

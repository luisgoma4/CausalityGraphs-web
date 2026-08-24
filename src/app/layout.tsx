import type { Metadata } from "next";
import { Manrope, Fraunces } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { HtmlLangSetter } from "@/components/html-lang-setter";

const bodyFont = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const displayFont = Fraunces({
  subsets: ["latin"],
  variable: "--font-display-face",
  display: "swap",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Causality Graphs",
  description:
    "Causal consulting for pharma using DAGs and dynamic causal models in complex or non-ideal study designs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${bodyFont.variable} ${displayFont.variable}`}>
      <body>
        <HtmlLangSetter />
        <div className="site-background" />
        <SiteHeader />
        <main>{children}</main>
      </body>
    </html>
  );
}

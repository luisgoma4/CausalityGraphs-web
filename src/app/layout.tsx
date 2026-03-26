import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { navItems } from "@/lib/site-content";

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
    <html lang="en">
      <body>
        <div className="site-background" />
        <header className="site-header">
          <div className="container nav-row">
            <Link href="/" className="brand-lockup">
              <span className="brand-dot" />
              <span>
                <strong>Causality</strong>
                <small>Graphs</small>
              </span>
            </Link>
            <nav className="site-nav" aria-label="Primary">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}

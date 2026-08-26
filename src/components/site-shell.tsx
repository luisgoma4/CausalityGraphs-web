import Link from "next/link";
import type { SiteContent } from "@/lib/content";

export function SiteShell({
  children,
  content,
  eyebrow,
  title,
  intro,
}: {
  children: React.ReactNode;
  content: SiteContent;
  eyebrow: string;
  title: string;
  intro: string;
}) {
  return (
    <div id="main-content" tabIndex={-1} className="page-shell">
      <section className="hero-band">
        <div className="container">
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="page-title">{title}</h1>
          <p className="page-intro">{intro}</p>
        </div>
      </section>
      <div className="container section-stack">{children}</div>
      <footer className="site-footer">
        <div className="container footer-grid">
          <div>
            <p className="brand-mark">Causality Graphs</p>
            <p className="footer-copy">{content.footer.tagline}</p>
          </div>
          <nav className="footer-nav" aria-label="Footer">
            {content.nav.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  );
}

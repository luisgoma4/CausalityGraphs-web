import Link from "next/link";
import { navItems } from "@/lib/site-content";

export function SiteShell({
  children,
  eyebrow,
  title,
  intro,
}: {
  children: React.ReactNode;
  eyebrow: string;
  title: string;
  intro: string;
}) {
  return (
    <div className="page-shell">
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
            <p className="footer-copy">
              Scientific consulting for pharmacological evidence where ideal study conditions are not available.
            </p>
          </div>
          <nav className="footer-nav" aria-label="Footer">
            {navItems.map((item) => (
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

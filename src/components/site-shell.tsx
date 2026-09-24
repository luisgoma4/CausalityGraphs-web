import Image from "next/image";
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
            <p className="brand-mark">
              <Image
                src="/causality-monograma.png"
                alt=""
                aria-hidden="true"
                width={1114}
                height={696}
                className="brand-monogram"
              />
              <Image
                src="/causality-nombre.png"
                alt="Causality Graphs"
                width={1166}
                height={312}
                className="brand-wordmark"
              />
            </p>
            <p className="footer-copy">{content.footer.tagline}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

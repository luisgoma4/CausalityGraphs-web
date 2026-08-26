import Link from "next/link";
import { GraphHero } from "@/components/graph-hero";
import type { SiteContent } from "@/lib/content";

export function HomeView({ content, contactHref, techniquesHref }: {
  content: SiteContent;
  contactHref: string;
  techniquesHref: string;
}) {
  const { home } = content;

  return (
    <div id="main-content" tabIndex={-1} className="page-shell home-shell">
      <GraphHero label={content.a11y.graphLabel} unavailableMessage={content.a11y.graphUnavailable} />
      <div className="page-content">
        <section className="home-hero">
          <div className="container hero-grid hero-grid-single">
            <div className="hero-copy hero-copy-wide">
              <p className="eyebrow">{home.hero.eyebrow}</p>
              <h1 className="hero-title">{home.hero.title}</h1>
              <p className="hero-intro">{home.hero.intro}</p>
              <div className="hero-chip-row">
                {home.hero.chips.map((chip) => (
                  <span key={chip} className="hero-chip">
                    {chip}
                  </span>
                ))}
              </div>
              <div className="hero-actions">
                <Link href={contactHref} className="button button-primary">
                  {home.hero.primaryCta}
                </Link>
                <Link href={techniquesHref} className="button button-secondary">
                  {home.hero.secondaryCta}
                </Link>
              </div>
              <div className="metric-grid">
                {home.metrics.map((metric) => (
                  <article key={metric.value} className="metric-card">
                    <h2>{metric.value}</h2>
                    <p>{metric.label}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="container section-stack">
          <section className="trust-panel">
            <p className="eyebrow">{home.trust.eyebrow}</p>
            <div className="split-heading">
              <h2>{home.trust.heading}</h2>
              <p>{home.trust.body}</p>
            </div>
          </section>

          <section className="section-grid">
            <div>
              <p className="eyebrow">{home.services.eyebrow}</p>
              <h2 className="section-title">{home.services.heading}</h2>
            </div>
            <div className="card-grid">
              {home.services.cards.map((card) => (
                <article key={card.title} className="glass-card">
                  <h3>{card.title}</h3>
                  <p>{card.description}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="section-grid reverse">
            <div className="insight-stack">
              <p className="eyebrow">{home.why.eyebrow}</p>
              <h2 className="section-title">{home.why.heading}</h2>
            </div>
            <div className="bullet-panel">
              {home.why.points.map((point) => (
                <article key={point} className="timeline-card">
                  <span className="timeline-dot" />
                  <p>{point}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="section-grid">
            <div>
              <p className="eyebrow">{home.techniquesPreview.eyebrow}</p>
              <h2 className="section-title">{home.techniquesPreview.heading}</h2>
            </div>
            <div className="card-grid">
              {home.techniquesPreview.cards.map((technique) => (
                <article key={technique.name} className="glass-card">
                  <h3>{technique.name}</h3>
                  <p>{technique.summary}</p>
                  <small>{technique.useCase}</small>
                </article>
              ))}
            </div>
          </section>

          <section className="section-grid reverse">
            <div>
              <p className="eyebrow">{home.work.eyebrow}</p>
              <h2 className="section-title">{home.work.heading}</h2>
            </div>
            <div className="case-stack">
              {home.work.cases.map((item) => (
                <article key={item.title} className="case-card">
                  <div className="case-header">
                    <h3>{item.title}</h3>
                    <span>{home.work.caseLabel}</span>
                  </div>
                  <p>
                    <strong>Challenge:</strong> {item.challenge}
                  </p>
                  <p>
                    <strong>Method:</strong> {item.method}
                  </p>
                  <p>
                    <strong>Outcome:</strong> {item.outcome}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section className="section-grid">
            <div>
              <p className="eyebrow">{home.philosophy.eyebrow}</p>
              <h2 className="section-title">{home.philosophy.heading}</h2>
            </div>
            <div className="principles-panel">
              {home.philosophy.principles.map((principle) => (
                <article key={principle} className="principle">
                  <span />
                  <p>{principle}</p>
                </article>
              ))}
              <div className="team-preview">
                <p className="eyebrow">{home.philosophy.teamPreviewEyebrow}</p>
                <div className="team-mini-grid">
                  {content.team.members.map((member) => (
                    <div key={member.name}>
                      <h3>{member.name}</h3>
                      <p>{member.role}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="cta-panel">
            <div>
              <p className="eyebrow">{home.cta.eyebrow}</p>
              <h2>{home.cta.heading}</h2>
            </div>
            <Link href={contactHref} className="button button-primary">
              {home.cta.buttonLabel}
            </Link>
          </section>
        </section>
      </div>
    </div>
  );
}

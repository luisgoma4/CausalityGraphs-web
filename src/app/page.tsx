import Link from "next/link";
import { GraphHero } from "@/components/graph-hero";
import {
  featuredCases,
  heroChips,
  heroMetrics,
  principles,
  serviceCards,
  techniqueCards,
  teamMembers,
  valuePoints,
} from "@/lib/site-content";

export default function Home() {
  return (
    <div className="page-shell home-shell">
      <GraphHero />
      <div className="page-content">
        <section className="home-hero">
          <div className="container hero-grid hero-grid-single">
            <div className="hero-copy hero-copy-wide">
              <p className="eyebrow">Causal consulting for pharma</p>
              <h1 className="hero-title">
                Better study interpretation for pharmacological evidence that comes with real-world constraints.
              </h1>
              <p className="hero-intro">
                Causality Graphs works with pharma, clinical research, and biostatistics teams to map assumptions,
                review confounding structure, and support evidence decisions using directed acyclic graphs and dynamic
                causal models.
              </p>
              <div className="hero-chip-row">
                {heroChips.map((chip) => (
                  <span key={chip} className="hero-chip">
                    {chip}
                  </span>
                ))}
              </div>
              <div className="hero-actions">
                <Link href="/contact" className="button button-primary">
                  Book a consultation
                </Link>
                <Link href="/techniques" className="button button-secondary">
                  Explore techniques
                </Link>
              </div>
              <div className="metric-grid">
                {heroMetrics.map((metric) => (
                  <article key={metric.value} className="metric-card card-sheen">
                    <h2>{metric.value}</h2>
                    <p>{metric.label}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="container section-stack">
          <section className="trust-panel card-sheen">
            <p className="eyebrow">Built for technical stakeholders</p>
            <div className="split-heading">
              <h2>Built for clinical teams, biostatistics groups, translational medicine, and evidence strategy leaders.</h2>
              <p>
                The approach is designed for research environments where methodological rigor, internal alignment, and
                practical decision-making all have to coexist.
              </p>
            </div>
          </section>

          <section className="section-grid">
            <div>
              <p className="eyebrow">What we do</p>
              <h2 className="section-title">Study interpretation, assumption mapping, and evidence strategy for non-ideal designs.</h2>
            </div>
            <div className="card-grid">
              {serviceCards.map((card) => (
                <article key={card.title} className="glass-card card-sheen">
                  <h3>{card.title}</h3>
                  <p>{card.description}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="section-grid reverse">
            <div className="insight-stack">
              <p className="eyebrow">Why it matters</p>
              <h2 className="section-title">When trial conditions are imperfect, decision risk sits in the structure as much as the numbers.</h2>
            </div>
            <div className="bullet-panel">
              {valuePoints.map((point) => (
                <article key={point} className="timeline-card">
                  <span className="timeline-dot" />
                  <p>{point}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="section-grid">
            <div>
              <p className="eyebrow">Techniques preview</p>
              <h2 className="section-title">Methods chosen to answer causal questions, not to decorate an analysis plan.</h2>
            </div>
            <div className="card-grid">
              {techniqueCards.map((technique) => (
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
              <p className="eyebrow">Selected work</p>
              <h2 className="section-title">Representative consulting situations where explicit causal reasoning changed the recommendation.</h2>
            </div>
            <div className="case-stack">
              {featuredCases.map((item) => (
                <article key={item.title} className="case-card card-sheen">
                  <div className="case-header">
                    <h3>{item.title}</h3>
                    <span>{"Problem -> method -> impact"}</span>
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
              <p className="eyebrow">Philosophy</p>
              <h2 className="section-title">The work is collaborative, assumption-aware, and designed to hold up across teams.</h2>
            </div>
            <div className="principles-panel">
              {principles.map((principle) => (
                <article key={principle} className="principle">
                  <span />
                  <p>{principle}</p>
                </article>
              ))}
              <div className="team-preview">
                <p className="eyebrow">Team snapshot</p>
                <div className="team-mini-grid">
                  {teamMembers.map((member) => (
                    <div key={member.name}>
                      <h3>{member.name}</h3>
                      <p>{member.role}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="cta-panel card-sheen">
            <div>
              <p className="eyebrow">Start a conversation</p>
              <h2>Bring us the study, the constraint, and the decision you need to support. We keep the first conversation focused and confidential.</h2>
            </div>
            <Link href="/contact" className="button button-primary">
              Contact Causality Graphs
            </Link>
          </section>
        </section>
      </div>
    </div>
  );
}

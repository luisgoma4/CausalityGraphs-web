import { SiteShell } from "@/components/site-shell";
import type { SiteContent } from "@/lib/content";

export function WorksView({ content }: { content: SiteContent }) {
  const { works } = content;

  return (
    <SiteShell content={content} eyebrow={works.eyebrow} title={works.title} intro={works.intro}>
      <section className="section-grid">
        <div>
          <p className="eyebrow">{works.framing.eyebrow}</p>
          <h2 className="section-title">{works.framing.heading}</h2>
        </div>
        <div className="card-grid">
          {works.cases.map((item) => (
            <article key={item.title} className="case-card card-sheen">
              <div className="case-header">
                <h3>{item.title}</h3>
                <span>{works.caseLabel}</span>
              </div>
              <p>
                <strong>Constraint:</strong> {item.challenge}
              </p>
              <p>
                <strong>Method:</strong> {item.method}
              </p>
              <p>
                <strong>Impact:</strong> {item.outcome}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-grid reverse">
        <div>
          <p className="eyebrow">{works.problemTypes.eyebrow}</p>
          <h2 className="section-title">{works.problemTypes.heading}</h2>
        </div>
        <div className="bullet-panel">
          {works.problemTypes.points.map((point) => (
            <article key={point} className="timeline-card">
              <span className="timeline-dot" />
              <p>{point}</p>
            </article>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}

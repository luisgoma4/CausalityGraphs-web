import { SiteShell } from "@/components/site-shell";
import { featuredCases } from "@/lib/site-content";

export default function WorksPage() {
  return (
    <SiteShell
      eyebrow="Representative work"
      title="Selected engagements where causal structure changed the conversation."
      intro="These examples show the kind of problems Causality Graphs is built to support: pharmacological evidence under imperfect controls, temporal complexity, or interpretation risk."
    >
      <section className="section-grid">
        <div>
          <p className="eyebrow">How projects are framed</p>
          <h2 className="section-title">Each engagement is organized around a decision, not just an analysis request.</h2>
        </div>
        <div className="card-grid">
          {featuredCases.map((item) => (
            <article key={item.title} className="case-card card-sheen">
              <div className="case-header">
                <h3>{item.title}</h3>
                <span>Representative format</span>
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
          <p className="eyebrow">Typical problem types</p>
          <h2 className="section-title">The consultancy focuses on evidence situations where conventional reading is not enough.</h2>
        </div>
        <div className="bullet-panel">
          {[
            "Single-arm pharmacological studies that need stronger interpretation boundaries.",
            "Longitudinal treatment response where dose changes, timing, or adaptation matter.",
            "Confounding-heavy observational evidence that needs explicit causal assumptions.",
            "Incomplete blinding or operational constraints that affect how outcomes should be read.",
          ].map((point) => (
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

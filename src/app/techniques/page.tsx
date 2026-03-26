import { SiteShell } from "@/components/site-shell";
import { detailedTechniques } from "@/lib/site-content";

export default function TechniquesPage() {
  return (
    <SiteShell
      eyebrow="Method stack"
      title="Techniques for causal clarity in pharmacological research."
      intro="This page explains the methodological toolkit behind the consultancy. The emphasis is not methodological theater, but disciplined reasoning that supports real evidence decisions."
    >
      <section className="technique-list">
        {detailedTechniques.map((technique, index) => (
          <article key={technique.title} className="technique-card card-sheen">
            <div className="technique-index">0{index + 1}</div>
            <div>
              <h2>{technique.title}</h2>
              <p>{technique.description}</p>
            </div>
            <div className="technique-bullets">
              {technique.bullets.map((bullet) => (
                <p key={bullet}>{bullet}</p>
              ))}
            </div>
          </article>
        ))}
      </section>
    </SiteShell>
  );
}

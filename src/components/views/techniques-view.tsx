import { SiteShell } from "@/components/site-shell";
import type { SiteContent } from "@/lib/content";

export function TechniquesView({ content }: { content: SiteContent }) {
  const { techniques } = content;

  return (
    <SiteShell content={content} eyebrow={techniques.eyebrow} title={techniques.title} intro={techniques.intro}>
      <section className="technique-list">
        {techniques.items.map((technique, index) => (
          <article key={technique.title} className="technique-card">
            <div className="technique-index">0{index + 1}</div>
            <div>
              <h3>{technique.title}</h3>
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

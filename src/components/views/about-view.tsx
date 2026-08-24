import { SiteShell } from "@/components/site-shell";
import type { SiteContent } from "@/lib/content";

export function AboutView({ content }: { content: SiteContent }) {
  const { about } = content;

  return (
    <SiteShell content={content} eyebrow={about.eyebrow} title={about.title} intro={about.intro}>
      <section className="section-grid">
        <div>
          <p className="eyebrow">{about.mission.eyebrow}</p>
          <h2 className="section-title">{about.mission.heading}</h2>
        </div>
        <div className="glass-card">
          <p>{about.mission.body}</p>
        </div>
      </section>

      <section className="section-grid reverse">
        <div>
          <p className="eyebrow">{about.operating.eyebrow}</p>
          <h2 className="section-title">{about.operating.heading}</h2>
        </div>
        <div className="principles-panel">
          {about.principles.map((principle) => (
            <article key={principle} className="principle">
              <span />
              <p>{principle}</p>
            </article>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}

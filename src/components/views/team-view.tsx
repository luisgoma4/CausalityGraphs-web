import { SiteShell } from "@/components/site-shell";
import type { SiteContent } from "@/lib/content";

export function TeamView({ content }: { content: SiteContent }) {
  const { team } = content;

  return (
    <SiteShell content={content} eyebrow={team.eyebrow} title={team.title} intro={team.intro}>
      <section className="editorial-team">
        {team.members.map((member, index) => (
          <article key={member.name} className={`member-card member-card-${(index % 3) + 1}`}>
            <p className="member-index">0{index + 1}</p>
            <h2>{member.name}</h2>
            <h3>{member.role}</h3>
            <p>{member.focus}</p>
          </article>
        ))}
      </section>

      <section className="initiative-panel">
        <div className="initiative-lead">
          <p className="eyebrow">{team.initiative.eyebrow}</p>
          <h2 className="section-title">{team.initiative.heading}</h2>
        </div>
        <div className="initiative-body">
          {team.initiative.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <div className="initiative-points">
          {team.initiative.points.map((point) => (
            <article key={point.title} className="initiative-point">
              <h3>{point.title}</h3>
              <p>{point.description}</p>
            </article>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}

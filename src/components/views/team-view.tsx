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
    </SiteShell>
  );
}

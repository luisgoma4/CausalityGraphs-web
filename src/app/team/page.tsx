import { SiteShell } from "@/components/site-shell";
import { teamMembers } from "@/lib/site-content";

export default function TeamPage() {
  return (
    <SiteShell
      eyebrow="Research-minded team"
      title="A small expert group built for high-trust scientific collaboration."
      intro="The team layout is intentionally editorial rather than corporate. The emphasis is on methodological focus, collaboration style, and the kind of rigor clients can expect."
    >
      <section className="editorial-team">
        {teamMembers.map((member, index) => (
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

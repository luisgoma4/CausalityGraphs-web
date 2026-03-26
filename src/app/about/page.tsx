import { SiteShell } from "@/components/site-shell";
import { principles } from "@/lib/site-content";

export default function AboutPage() {
  return (
    <SiteShell
      eyebrow="Why this brand exists"
      title="Causal clarity for evidence environments that are structurally difficult."
      intro="Causality Graphs exists because many pharmacological decisions must be made under conditions that are incomplete, constrained, or impossible to idealize. The answer is not to pretend the structure is simple. The answer is to model it honestly."
    >
      <section className="section-grid">
        <div>
          <p className="eyebrow">Mission</p>
          <h2 className="section-title">Bring explicit causal reasoning into places where ambiguity usually gets buried.</h2>
        </div>
        <div className="glass-card">
          <p>
            The consultancy helps teams clarify what can reasonably be claimed, where the risks sit, and how to move
            from partial evidence to stronger decisions without overstating certainty.
          </p>
        </div>
      </section>

      <section className="section-grid reverse">
        <div>
          <p className="eyebrow">Operating principles</p>
          <h2 className="section-title">The work stays rigorous, practical, and readable across technical audiences.</h2>
        </div>
        <div className="principles-panel">
          {principles.map((principle) => (
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

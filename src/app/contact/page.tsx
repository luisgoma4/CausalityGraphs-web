import { SiteShell } from "@/components/site-shell";
import { contactDetails } from "@/lib/site-content";

export default function ContactPage() {
  return (
    <SiteShell
      eyebrow="Contact"
      title="Tell us about the study and the decision you are trying to support."
      intro="Use the form as a starting point for a confidential, focused conversation. The structure is intentionally simple so teams can describe the scientific problem without friction."
    >
      <section className="contact-layout">
        <form className="contact-form card-sheen">
          <label>
            Name
            <input type="text" name="name" placeholder="Your name" />
          </label>
          <label>
            Organization
            <input type="text" name="organization" placeholder="Company or research group" />
          </label>
          <label>
            Email
            <input type="email" name="email" placeholder="you@example.com" />
          </label>
          <label>
            Project type
            <select name="projectType" defaultValue="DAG review">
              <option>DAG review</option>
              <option>Dynamic causal modeling</option>
              <option>Study interpretation</option>
              <option>Evidence strategy</option>
            </select>
          </label>
          <label className="full-span">
            Brief description
            <textarea
              name="description"
              rows={6}
              placeholder="Describe the study design, key constraints, and the decision you need to support."
            />
          </label>
          <button type="submit" className="button button-primary">
            Send inquiry
          </button>
        </form>

        <aside className="contact-aside">
          {contactDetails.map((item) => (
            <article key={item.label} className="glass-card">
              <p className="eyebrow">{item.label}</p>
              <h2>{item.value}</h2>
            </article>
          ))}
        </aside>
      </section>
    </SiteShell>
  );
}

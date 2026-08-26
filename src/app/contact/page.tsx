import { SiteShell } from "@/components/site-shell";
import { ContactForm } from "@/components/contact-form";
import { contactDetails } from "@/lib/site-content";

export default function ContactPage() {
  return (
    <SiteShell
      eyebrow="Contact"
      title="Tell us about the study and the decision you are trying to support."
      intro="Use the form as a starting point for a confidential, focused conversation. The structure is intentionally simple so teams can describe the scientific problem without friction."
    >
      <section className="contact-layout">
        <ContactForm />

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

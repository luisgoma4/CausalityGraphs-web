import { SiteShell } from "@/components/site-shell";
import { ContactForm } from "@/components/contact-form";
import type { SiteContent } from "@/lib/content";

export function ContactView({ content }: { content: SiteContent }) {
  const { contact } = content;

  return (
    <SiteShell content={content} eyebrow={contact.eyebrow} title={contact.title} intro={contact.intro}>
      <section className="contact-layout">
        <ContactForm content={content} />

        <aside className="contact-aside">
          {contact.details.map((item, index) => (
            <article key={item.label} className="glass-card">
              <p className="eyebrow">{item.label}</p>
              <h2 className={index < 2 ? "type-data-md" : undefined}>{item.value}</h2>
            </article>
          ))}
        </aside>
      </section>
    </SiteShell>
  );
}

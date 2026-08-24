import { SiteShell } from "@/components/site-shell";
import type { SiteContent } from "@/lib/content";

export function ContactView({ content }: { content: SiteContent }) {
  const { contact } = content;

  return (
    <SiteShell content={content} eyebrow={contact.eyebrow} title={contact.title} intro={contact.intro}>
      <section className="contact-layout">
        <form className="contact-form card-sheen">
          <label>
            {contact.form.nameLabel}
            <input type="text" name="name" placeholder={contact.form.namePlaceholder} />
          </label>
          <label>
            {contact.form.organizationLabel}
            <input type="text" name="organization" placeholder={contact.form.organizationPlaceholder} />
          </label>
          <label>
            {contact.form.emailLabel}
            <input type="email" name="email" placeholder={contact.form.emailPlaceholder} />
          </label>
          <label>
            {contact.form.projectTypeLabel}
            <select name="projectType" defaultValue={contact.form.projectTypeOptions[0]}>
              {contact.form.projectTypeOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </label>
          <label className="full-span">
            {contact.form.descriptionLabel}
            <textarea name="description" rows={6} placeholder={contact.form.descriptionPlaceholder} />
          </label>
          <button type="submit" className="button button-primary">
            {contact.form.submitLabel}
          </button>
        </form>

        <aside className="contact-aside">
          {contact.details.map((item) => (
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

import { SiteShell } from "@/components/site-shell";
import type { SiteContent } from "@/lib/content";

export function ContactView({ content }: { content: SiteContent }) {
  const { contact } = content;

  return (
    <SiteShell content={content} eyebrow={contact.eyebrow} title={contact.title} intro={contact.intro}>
      <section className="contact-layout">
        <form className="contact-form">
          <label htmlFor="contact-name">
            {contact.form.nameLabel}
            <input id="contact-name" type="text" name="name" placeholder={contact.form.namePlaceholder} />
          </label>
          <label htmlFor="contact-organization">
            {contact.form.organizationLabel}
            <input
              id="contact-organization"
              type="text"
              name="organization"
              placeholder={contact.form.organizationPlaceholder}
            />
          </label>
          <label htmlFor="contact-email">
            {contact.form.emailLabel}
            <input id="contact-email" type="email" name="email" placeholder={contact.form.emailPlaceholder} />
          </label>
          <label htmlFor="contact-project-type">
            {contact.form.projectTypeLabel}
            <select id="contact-project-type" name="projectType" defaultValue={contact.form.projectTypeOptions[0]}>
              {contact.form.projectTypeOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </label>
          <label className="full-span" htmlFor="contact-description">
            {contact.form.descriptionLabel}
            <textarea
              id="contact-description"
              name="description"
              rows={6}
              placeholder={contact.form.descriptionPlaceholder}
            />
          </label>
          <button type="submit" className="button button-primary">
            {contact.form.submitLabel}
          </button>
        </form>

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

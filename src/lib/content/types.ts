export type Locale = "es" | "en";

export type NavItem = { href: string; label: string };

export type Seo = { title: string; description: string };

export type MetricCard = { value: string; label: string };
export type ServiceCard = { title: string; description: string };
export type TechniqueCard = { name: string; summary: string; useCase: string };
export type CaseStudy = { title: string; challenge: string; method: string; outcome: string };
export type DetailedTechnique = { title: string; description: string; bullets: string[] };
export type TeamMember = { name: string; role: string; focus: string };
export type ContactDetail = { label: string; value: string };

/**
 * Every user-facing string on the site, grouped by page/section so a
 * translator or copy editor can review one page at a time. `es.ts` and
 * `en.ts` both implement this type, so a missing key fails the build.
 */
export type SiteContent = {
  locale: Locale;
  htmlLang: string;
  meta: Seo;
  nav: NavItem[];
  navMenu: { openLabel: string; closeLabel: string };
  languageSwitcher: { es: string; en: string };
  footer: {
    tagline: string;
  };
  hero3d: { caption: string };

  home: {
    seo: Seo;
    hero: {
      eyebrow: string;
      title: string;
      intro: string;
      chips: string[];
      primaryCta: string;
      secondaryCta: string;
    };
    metrics: MetricCard[];
    trust: { eyebrow: string; heading: string; body: string };
    services: { eyebrow: string; heading: string; cards: ServiceCard[] };
    why: { eyebrow: string; heading: string; points: string[] };
    techniquesPreview: { eyebrow: string; heading: string; cards: TechniqueCard[] };
    work: { eyebrow: string; heading: string; caseLabel: string; cases: CaseStudy[] };
    philosophy: {
      eyebrow: string;
      heading: string;
      principles: string[];
      teamPreviewEyebrow: string;
    };
    cta: { eyebrow: string; heading: string; buttonLabel: string };
  };

  about: {
    seo: Seo;
    eyebrow: string;
    title: string;
    intro: string;
    mission: { eyebrow: string; heading: string; body: string };
    operating: { eyebrow: string; heading: string };
    principles: string[];
  };

  contact: {
    seo: Seo;
    eyebrow: string;
    title: string;
    intro: string;
    form: {
      nameLabel: string;
      namePlaceholder: string;
      organizationLabel: string;
      organizationPlaceholder: string;
      emailLabel: string;
      emailPlaceholder: string;
      projectTypeLabel: string;
      projectTypeOptions: string[];
      descriptionLabel: string;
      descriptionPlaceholder: string;
      submitLabel: string;
    };
    details: ContactDetail[];
  };

  team: {
    seo: Seo;
    eyebrow: string;
    title: string;
    intro: string;
    members: TeamMember[];
  };

  techniques: {
    seo: Seo;
    eyebrow: string;
    title: string;
    intro: string;
    items: DetailedTechnique[];
  };

  works: {
    seo: Seo;
    eyebrow: string;
    title: string;
    intro: string;
    framing: { eyebrow: string; heading: string };
    caseLabel: string;
    cases: CaseStudy[];
    problemTypes: { eyebrow: string; heading: string; points: string[] };
  };
};

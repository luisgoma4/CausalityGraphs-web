import type { SiteContent } from "./types";

/**
 * English content. Structure mirrors `es.ts` exactly — edit copy per
 * page/section without touching component code.
 */
export const en: SiteContent = {
  locale: "en",
  htmlLang: "en",
  meta: {
    title: "Causality Graphs",
    description:
      "Causal consulting for pharma using DAGs and dynamic causal models in complex or non-ideal study designs.",
  },
  nav: [
    { href: "/en", label: "Home" },
    { href: "/en/works", label: "Works" },
    { href: "/en/techniques", label: "Techniques" },
    { href: "/en/about", label: "About Us" },
    { href: "/en/team", label: "Team" },
    { href: "/en/contact", label: "Contact" },
  ],
  navMenu: { openLabel: "Menu", closeLabel: "Close" },
  languageSwitcher: { es: "Español", en: "English" },
  footer: {
    tagline: "Scientific consulting for pharmacological evidence where ideal study conditions are not available.",
  },
  hero3d: { caption: "Scroll to move through the causal field." },

  home: {
    seo: {
      title: "Causality Graphs — Causal consulting for pharma",
      description:
        "Causal consulting for pharma using DAGs and dynamic causal models in complex or non-ideal study designs.",
    },
    hero: {
      eyebrow: "Causal consulting for pharma",
      title: "Do you need DAG analysis?",
      intro:
        "Causality Graphs works with pharma, clinical research, and biostatistics teams to map assumptions, review confounding structure, and support evidence decisions using directed acyclic graphs (DAG's) and dynamic causal models (DCM).",
      chips: ["Single-arm studies", "Partial blinding", "Longitudinal response", "Evidence strategy"],
      primaryCta: "Book a consultation",
      secondaryCta: "Explore techniques",
    },
    metrics: [
      {
        value: "Assumption mapping",
        label: "Make confounding, mediation, and selection logic explicit before interpretation hardens.",
      },
      {
        value: "Dynamic modeling",
        label: "Bring time, feedback, and evolving treatment response into the causal picture.",
      },
      {
        value: "Decision support",
        label: "Support evidence strategy when controls are limited, partial, or operationally imperfect.",
      },
    ],
    trust: {
      eyebrow: "Built for technical stakeholders",
      heading:
        "Built for clinical teams, biostatistics groups, translational medicine, and evidence strategy leaders.",
      body: "The approach is designed for research environments where methodological rigor, internal alignment, and practical decision-making all have to coexist.",
    },
    services: {
      eyebrow: "What we do",
      heading: "Study interpretation, assumption mapping, and evidence strategy for non-ideal designs.",
      cards: [
        {
          title: "Causal study design support",
          description:
            "Frame the causal question, clarify the estimand, and make design tradeoffs visible before analysis choices become default assumptions.",
        },
        {
          title: "DAG review and modeling",
          description:
            "Build and review graph-based representations of exposure, outcome, mediation, and confounding pathways to support defensible interpretation.",
        },
        {
          title: "Dynamic causal analysis",
          description:
            "Model systems that evolve through time when treatment response, adaptation, feedback, and pathway timing cannot be ignored.",
        },
        {
          title: "Evidence strategy guidance",
          description:
            "Translate causal reasoning into practical recommendations for study interpretation, internal alignment, and next-step evidence decisions.",
        },
      ],
    },
    why: {
      eyebrow: "Why it matters",
      heading: "When trial conditions are imperfect, decision risk sits in the structure as much as the numbers.",
      points: [
        "Many pharmacological studies operate with limited controls, partial blinding, evolving treatment pathways, or observational contamination.",
        "Standard summaries can look convincing while still hiding confounding, collider bias, selection effects, or pathway ambiguity.",
        "Explicit causal structure makes tradeoffs discussable, assumptions inspectable, and interpretation more defensible across teams.",
      ],
    },
    techniquesPreview: {
      eyebrow: "Techniques preview",
      heading: "Methods chosen to answer causal questions, not to decorate an analysis plan.",
      cards: [
        {
          name: "Directed Acyclic Graphs",
          summary: "Map assumptions, identify adjustment sets, and make hidden structure legible.",
          useCase: "Useful when teams need a shared causal language before modeling begins.",
        },
        {
          name: "Dynamic causal models",
          summary: "Represent how biological and treatment systems evolve rather than treating time as a nuisance.",
          useCase: "Useful for longitudinal response, feedback, adaptation, and mechanistic interpretation.",
        },
        {
          name: "Counterfactual reasoning",
          summary: "Anchor interpretation in explicit what-if contrasts instead of loose correlational claims.",
          useCase: "Useful when decision-makers need clarity on treatment effect questions under constraints.",
        },
        {
          name: "Sensitivity analysis",
          summary: "Stress-test conclusions against unmeasured bias, structural uncertainty, and model dependence.",
          useCase: "Useful when evidence quality is limited but choices still need to be made.",
        },
      ],
    },
    work: {
      eyebrow: "Selected work",
      heading: "Representative consulting situations where explicit causal reasoning changed the recommendation.",
      caseLabel: "Problem -> method -> impact",
      cases: [
        {
          title: "Single-arm oncology signal review",
          challenge: "A promising response pattern was difficult to interpret without a concurrent control.",
          method:
            "DAG refinement plus explicit counterfactual framing around likely confounding and selection processes.",
          outcome: "The study team gained a clearer interpretation boundary and a more credible next-evidence strategy.",
        },
        {
          title: "Longitudinal treatment response mapping",
          challenge: "Dose changes, dropouts, and symptom dynamics blurred the treatment story over time.",
          method: "Dynamic causal modeling to separate temporal structure, pathway timing, and evolving response states.",
          outcome: "The resulting model supported better reasoning about progression, timing, and endpoint relevance.",
        },
        {
          title: "Partial-blinding evidence interpretation",
          challenge: "Operational realities introduced expectation effects and outcome interpretation risk.",
          method: "Structured causal assumptions, mediation review, and sensitivity framing for interpretation robustness.",
          outcome: "Leadership received a cleaner account of what could be claimed and what required caution.",
        },
      ],
    },
    philosophy: {
      eyebrow: "Philosophy",
      heading: "The work is collaborative, assumption-aware, and designed to hold up across teams.",
      principles: [
        "Make assumptions explicit before they become invisible defaults.",
        "Separate structural signal from statistical convenience.",
        "Use causal thinking to improve decisions, not just analysis complexity.",
      ],
      teamPreviewEyebrow: "Team snapshot",
    },
    cta: {
      eyebrow: "Start a conversation",
      heading:
        "Bring us the study, the constraint, and the decision you need to support. We keep the first conversation focused and confidential.",
      buttonLabel: "Contact Causality Graphs",
    },
  },

  about: {
    seo: {
      title: "About — Causality Graphs",
      description: "Why Causality Graphs exists and the operating principles behind the consultancy.",
    },
    eyebrow: "Why this brand exists",
    title: "Causal clarity for evidence environments that are structurally difficult.",
    intro:
      "Causality Graphs exists because many pharmacological decisions must be made under conditions that are incomplete, constrained, or impossible to idealize. The answer is not to pretend the structure is simple. The answer is to model it honestly.",
    mission: {
      eyebrow: "Mission",
      heading: "Bring explicit causal reasoning into places where ambiguity usually gets buried.",
      body: "The consultancy helps teams clarify what can reasonably be claimed, where the risks sit, and how to move from partial evidence to stronger decisions without overstating certainty.",
    },
    operating: {
      eyebrow: "Operating principles",
      heading: "The work stays rigorous, practical, and readable across technical audiences.",
    },
    principles: [
      "Make assumptions explicit before they become invisible defaults.",
      "Separate structural signal from statistical convenience.",
      "Use causal thinking to improve decisions, not just analysis complexity.",
    ],
  },

  contact: {
    seo: {
      title: "Contact — Causality Graphs",
      description: "Start a confidential conversation about a study, constraint, or decision you need to support.",
    },
    eyebrow: "Contact",
    title: "Tell us about the study and the decision you are trying to support.",
    intro:
      "Use the form as a starting point for a confidential, focused conversation. The structure is intentionally simple so teams can describe the scientific problem without friction.",
    form: {
      nameLabel: "Name",
      namePlaceholder: "Your name",
      organizationLabel: "Organization",
      organizationPlaceholder: "Company or research group",
      emailLabel: "Email",
      emailPlaceholder: "you@example.com",
      projectTypeLabel: "Project type",
      projectTypeOptions: ["DAG review", "Dynamic causal modeling", "Study interpretation", "Evidence strategy"],
      descriptionLabel: "Brief description",
      descriptionPlaceholder: "Describe the study design, key constraints, and the decision you need to support.",
      submitLabel: "Send inquiry",
    },
    details: [
      { label: "Email", value: "luis.gomez.epr@proton.me" },
      { label: "Phone", value: "+34 638 542 664" },
      { label: "Typical scope", value: "Pharmacological study reports, DAG analysis, dynamic modeling, evidence strategy" },
      { label: "Response style", value: "Confidential, focused, and ready to present" },
    ],
  },

  team: {
    seo: {
      title: "Team — Causality Graphs",
      description: "Meet the small expert group behind Causality Graphs.",
    },
    eyebrow: "Research-minded team",
    title: "A small expert group built for high-trust scientific collaboration.",
    intro:
      "The team layout is intentionally editorial rather than corporate. The emphasis is on methodological focus, collaboration style, and the kind of rigor clients can expect.",
    members: [
      {
        name: "Dr. Alex Sospedra",
        role: "Modeling expert",
        focus: "DAG design, scientific decisions and architecture for constrained pharmacological studies.",
      },
      {
        name: "Daniel Rico",
        role: "Data Analyst",
        focus: "Denoising, correlating and parameter recovery",
      },
      {
        name: "Luis Gómez",
        role: "Founder and Strategy Lead",
        focus: "Strategy and approach, communicator, operations officer",
      },
    ],
  },

  techniques: {
    seo: {
      title: "Techniques — Causality Graphs",
      description: "The methodological toolkit behind the consultancy: DAGs, dynamic causal models, and more.",
    },
    eyebrow: "Method stack",
    title: "Techniques for causal clarity in pharmacological research.",
    intro:
      "This page explains the methodological toolkit behind the consultancy. The emphasis is not methodological theater, but disciplined reasoning that supports real evidence decisions.",
    items: [
      {
        title: "Directed Acyclic Graphs",
        description:
          "DAGs give teams a compact way to express assumptions about exposures, outcomes, confounders, mediators, and selection processes before statistical habits take over.",
        bullets: [
          "Clarify which variables should be adjusted for and which should not.",
          "Expose hidden sources of bias in complex pharmacological evidence settings.",
          "Support cross-functional alignment between clinical, stats, and strategy teams.",
        ],
      },
      {
        title: "Dynamic causal models",
        description:
          "When biology and treatment effects evolve over time, a static snapshot can mislead. Dynamic causal models help represent timing, feedback, and changing states.",
        bullets: [
          "Useful for longitudinal treatment response and adaptation effects.",
          "Bring temporal structure into the interpretation rather than treating it as noise.",
          "Help reason about interventions within evolving systems.",
        ],
      },
      {
        title: "Time-varying confounding",
        description:
          "Some variables are both consequences of prior treatment and determinants of future treatment or outcomes. These settings need more care than routine adjustment.",
        bullets: [
          "Separate evolving confounding from causal pathways.",
          "Avoid naive adjustments that distort the estimand.",
          "Improve interpretation for sequential treatment settings.",
        ],
      },
      {
        title: "Mediation and pathways",
        description:
          "Understanding whether an effect travels through a mechanistic pathway, an operational artifact, or a measurement process often changes the scientific story.",
        bullets: [
          "Distinguish direct and indirect effects where it matters.",
          "Support biomarker and mechanism-driven interpretation.",
          "Reveal when a pathway assumption is doing too much work.",
        ],
      },
      {
        title: "Sensitivity analysis",
        description:
          "Good consulting does not stop at a single preferred model. It shows how conclusions move when assumptions weaken or alternative structures are considered.",
        bullets: [
          "Stress-test claims under limited evidence quality.",
          "Make uncertainty visible without collapsing into indecision.",
          "Help stakeholders understand the shape of the risk, not just its existence.",
        ],
      },
      {
        title: "Evidence synthesis under constraints",
        description:
          "When ideal trial conditions are unavailable, multiple imperfect sources often have to be brought into one disciplined reasoning frame.",
        bullets: [
          "Link different evidence fragments through explicit structure.",
          "Support decision-making when studies are non-ideal or partially comparable.",
          "Turn fragmented evidence into a coherent strategic narrative.",
        ],
      },
    ],
  },

  works: {
    seo: {
      title: "Works — Causality Graphs",
      description: "Selected engagements where causal structure changed the conversation.",
    },
    eyebrow: "Representative work",
    title: "Selected engagements where causal structure changed the conversation.",
    intro:
      "These examples show the kind of problems Causality Graphs is built to support: pharmacological evidence under imperfect controls, temporal complexity, or interpretation risk.",
    framing: {
      eyebrow: "How projects are framed",
      heading: "Each engagement is organized around a decision, not just an analysis request.",
    },
    caseLabel: "Representative format",
    cases: [
      {
        title: "Single-arm oncology signal review",
        challenge: "A promising response pattern was difficult to interpret without a concurrent control.",
        method:
          "DAG refinement plus explicit counterfactual framing around likely confounding and selection processes.",
        outcome: "The study team gained a clearer interpretation boundary and a more credible next-evidence strategy.",
      },
      {
        title: "Longitudinal treatment response mapping",
        challenge: "Dose changes, dropouts, and symptom dynamics blurred the treatment story over time.",
        method: "Dynamic causal modeling to separate temporal structure, pathway timing, and evolving response states.",
        outcome: "The resulting model supported better reasoning about progression, timing, and endpoint relevance.",
      },
      {
        title: "Partial-blinding evidence interpretation",
        challenge: "Operational realities introduced expectation effects and outcome interpretation risk.",
        method: "Structured causal assumptions, mediation review, and sensitivity framing for interpretation robustness.",
        outcome: "Leadership received a cleaner account of what could be claimed and what required caution.",
      },
    ],
    problemTypes: {
      eyebrow: "Typical problem types",
      heading: "The consultancy focuses on evidence situations where conventional reading is not enough.",
      points: [
        "Single-arm pharmacological studies that need stronger interpretation boundaries.",
        "Longitudinal treatment response where dose changes, timing, or adaptation matter.",
        "Confounding-heavy observational evidence that needs explicit causal assumptions.",
        "Incomplete blinding or operational constraints that affect how outcomes should be read.",
      ],
    },
  },
};

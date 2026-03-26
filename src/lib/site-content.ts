export const navItems = [
  { href: "/", label: "Home" },
  { href: "/works", label: "Works" },
  { href: "/techniques", label: "Techniques" },
  { href: "/about", label: "About Us" },
  { href: "/team", label: "Team" },
  { href: "/contact", label: "Contact" },
];

export const heroMetrics = [
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
];

export const heroChips = ["Single-arm studies", "Partial blinding", "Longitudinal response", "Evidence strategy"];

export const serviceCards = [
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
];

export const valuePoints = [
  "Many pharmacological studies operate with limited controls, partial blinding, evolving treatment pathways, or observational contamination.",
  "Standard summaries can look convincing while still hiding confounding, collider bias, selection effects, or pathway ambiguity.",
  "Explicit causal structure makes tradeoffs discussable, assumptions inspectable, and interpretation more defensible across teams.",
];

export const techniqueCards = [
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
];

export const featuredCases = [
  {
    title: "Single-arm oncology signal review",
    challenge: "A promising response pattern was difficult to interpret without a concurrent control.",
    method: "DAG refinement plus explicit counterfactual framing around likely confounding and selection processes.",
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
];

export const detailedTechniques = [
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
];

export const principles = [
  "Make assumptions explicit before they become invisible defaults.",
  "Separate structural signal from statistical convenience.",
  "Use causal thinking to improve decisions, not just analysis complexity.",
];

export const teamMembers = [
  {
    name: "Dr. Elena Maris",
    role: "Founder and Causal Strategy Lead",
    focus: "DAG design, estimand framing, and decision architecture for constrained pharmacological studies.",
  },
  {
    name: "Jonas Vale",
    role: "Dynamic Systems Specialist",
    focus: "Time-varying treatment response, mechanistic reasoning, and longitudinal model structure.",
  },
  {
    name: "Mira Sol",
    role: "Evidence Interpretation Consultant",
    focus: "Sensitivity framing, translational communication, and alignment across clinical and statistical stakeholders.",
  },
];

export const contactDetails = [
  { label: "Email", value: "hello@causalitygraphs.com" },
  { label: "Typical scope", value: "Study interpretation, DAG review, dynamic modeling, evidence strategy" },
  { label: "Response style", value: "Confidential, focused, and scientifically collaborative" },
];

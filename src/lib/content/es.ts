import type { SiteContent } from "./types";

/**
 * Spanish content — the site's default language. Structure mirrors
 * `en.ts` exactly — edit copy per page/section without touching component code.
 */
export const es: SiteContent = {
  locale: "es",
  htmlLang: "es",
  meta: {
    title: "Causality Graphs",
    description:
      "Consultoría causal para la industria farmacéutica: DAGs y modelos causales dinámicos para diseños de estudio complejos o no ideales.",
  },
  nav: [
    { href: "/", label: "Inicio" },
    { href: "/works", label: "Proyectos" },
    { href: "/techniques", label: "Técnicas" },
    { href: "/academia", label: "Academia" },
    { href: "/about", label: "Sobre nosotros" },
    { href: "/team", label: "Equipo" },
    { href: "/contact", label: "Contacto" },
  ],
  navMenu: { openLabel: "Menú", closeLabel: "Cerrar" },
  languageSwitcher: { es: "Español", en: "English" },
  themeToggle: {
    switchToDarkLabel: "Cambiar a modo oscuro",
    switchToLightLabel: "Cambiar a modo claro",
  },
  a11y: {
    skipToContent: "Saltar al contenido principal",
    graphLabel: "Grafo causal animado que ilustra variables de tratamiento, confusores y resultado",
    graphUnavailable: "Visualización interactiva no disponible; se muestra una versión estática.",
  },
  footer: {
    tagline: "Consultoría científica para evidencia farmacológica cuando las condiciones de estudio ideales no están disponibles.",
  },

  academy: {
    seo: {
      title: "Academia — Causality Graphs",
      description:
        "Glosario técnico de los métodos de descubrimiento causal e inferencia causal que usa la consultora: PC, GES, LiNGAM y más.",
    },
    eyebrow: "Glosario de métodos",
    title: "Academia: los métodos de descubrimiento causal detrás del trabajo.",
    intro:
      "Una referencia técnica breve para responsables de bioestadística y equipos clínicos: qué hace cada algoritmo, qué supuestos exige y cuándo tiene sentido usarlo.",
    tocHeading: "Índice de métodos",
    tocMobileButtonLabel: "Índice",
    tocMobileTitle: "Índice de métodos",
    tocMobileCloseLabel: "Cerrar",
    comingSoonBadge: "En preparación",
    comparisonTable: {
      heading: "Comparativa de métodos disponibles",
      caption: "Supuestos, complejidad y robustez de los métodos de descubrimiento causal disponibles.",
      methodHeader: "Método",
      assumptionsHeader: "Supuestos",
      complexityHeader: "Complejidad",
      robustnessHeader: "Robustez",
    },
    methods: [
      {
        id: "pc",
        name: "PC (Peter-Clark)",
        status: "disponible",
        summary:
          "Algoritmo de descubrimiento causal basado en tests de independencia condicional que reconstruye la estructura de un grafo a partir de datos observacionales.",
        body: [
          {
            kind: "paragraph",
            text: "El algoritmo PC parte de un grafo completo no dirigido y elimina progresivamente las aristas entre pares de variables que resultan condicionalmente independientes dado algún subconjunto de las demás variables. Cada arista eliminada representa la ausencia de una relación causal directa detectable con los datos disponibles. El resultado es un grafo esqueleto sobre el que se orientan después las aristas restantes aplicando reglas locales (por ejemplo, la identificación de estructuras en V o colisionadores) hasta donde la evidencia lo permite.",
          },
          {
            kind: "paragraph",
            text: "El resultado no es un DAG único sino un CPDAG (grafo parcialmente dirigido de una clase de equivalencia de Markov): un conjunto de aristas dirigidas donde la dirección causal es identificable sin ambigüedad, y aristas no dirigidas donde varias orientaciones son igualmente compatibles con los datos observados. PC no fuerza una dirección donde los datos no la determinan.",
          },
          {
            kind: "code",
            text: "X ⊥⊥ Y | Z   →   eliminar arista X—Y del esqueleto",
          },
          {
            kind: "paragraph",
            text: "Los supuestos clave son fidelidad (faithfulness) —las independencias observadas en los datos reflejan la estructura del grafo y no cancelaciones casuales de parámetros—, suficiencia causal —no hay confusores no medidos entre las variables incluidas— y tests de independencia condicional fiables, que en la práctica requieren tamaños muestrales razonables cuando el número de variables crece.",
          },
          {
            kind: "paragraph",
            text: "En consultoría se usa como primer paso exploratorio cuando el equipo tiene múltiples variables candidatas y quiere una hipótesis estructural de partida, antes de refinarla con conocimiento de dominio.",
          },
        ],
        comparison: {
          assumptions: ["Suficiencia causal (sin confusores no medidos)", "Fidelidad (faithfulness)", "Aciclicidad"],
          complexity: "medium",
          complexityLabel: "Media",
          robustnessLevel: "warning",
          robustnessLabel: "Sensible a errores de test en grafos densos o alta dimensión",
        },
      },
      {
        id: "ges",
        name: "GES (Greedy Equivalence Search)",
        status: "disponible",
        summary:
          "Búsqueda voraz sobre el espacio de clases de equivalencia de Markov que optimiza directamente un criterio de bondad de ajuste penalizado.",
        body: [
          {
            kind: "paragraph",
            text: "GES explora el espacio de CPDAGs en dos fases. En la fase de avance añade aristas una a una, aceptando en cada paso el cambio que más mejora una puntuación penalizada (habitualmente BIC), hasta que ninguna adición mejora la puntuación. En la fase de retroceso elimina aristas siguiendo la misma lógica voraz, refinando el resultado de la primera fase.",
          },
          {
            kind: "paragraph",
            text: "A diferencia de PC, que decide arista a arista mediante tests de independencia, GES evalúa la calidad global de cada estructura candidata con una puntuación estadística. Esto tiende a ser más robusto frente a errores acumulados de tests individuales cuando el modelo subyacente se ajusta razonablemente bien al criterio de puntuación elegido.",
          },
          {
            kind: "paragraph",
            text: "Bajo los supuestos habituales (fidelidad, suficiencia causal y una familia de modelos donde la puntuación es consistente), GES converge asintóticamente a la clase de equivalencia de Markov correcta. El resultado, igual que en PC, es un CPDAG: la dirección de algunas aristas puede quedar sin determinar.",
          },
          {
            kind: "paragraph",
            text: "Se usa cuando interesa una puntuación global interpretable (BIC) y el conjunto de variables es de tamaño moderado a grande, donde encadenar muchos tests de independencia condicional —como hace PC— sería más frágil.",
          },
        ],
        comparison: {
          assumptions: ["Suficiencia causal", "Fidelidad", "Score descomponible (p.ej. BIC)"],
          complexity: "high",
          complexityLabel: "Alta",
          robustnessLevel: "success",
          robustnessLabel: "Más estable que PC en muestras finitas, pero computacionalmente costoso",
        },
      },
      {
        id: "lingam",
        name: "LiNGAM (Linear Non-Gaussian Acyclic Model)",
        status: "disponible",
        summary:
          "Modelo lineal acíclico no gaussiano que identifica la dirección causal explotando la asimetría estadística de los residuos, no solo la estructura de independencias.",
        body: [
          {
            kind: "paragraph",
            text: "LiNGAM asume que cada variable es una combinación lineal de sus causas directas más un término de ruido, y que ese ruido no es gaussiano. Esa no-gaussianidad es la pieza clave: en un modelo lineal gaussiano, causa y efecto son estadísticamente indistinguibles por simetría, pero con residuos no gaussianos la dirección causal correcta deja una firma estadística asimétrica detectable, típicamente mediante análisis de componentes independientes (ICA).",
          },
          {
            kind: "paragraph",
            text: "A diferencia de PC y GES, que se detienen en una clase de equivalencia, LiNGAM puede identificar un DAG completamente dirigido a partir de datos puramente observacionales, sin necesitar restricciones adicionales del investigador para resolver la orientación de las aristas.",
          },
          {
            kind: "paragraph",
            text: "El precio de esa identificabilidad más fuerte es un supuesto más restrictivo: linealidad de las relaciones y no gaussianidad de todos los términos de ruido salvo, como mucho, uno. Cuando estos supuestos no se cumplen razonablemente, la dirección estimada puede ser incorrecta con confianza aparente.",
          },
          {
            kind: "paragraph",
            text: "Es útil cuando hay evidencia de que las relaciones son aproximadamente lineales y las distribuciones de las variables (o de los residuos tras un ajuste preliminar) se alejan claramente de la normalidad, algo frecuente en datos biológicos con colas pesadas o asimetría.",
          },
        ],
        comparison: {
          assumptions: ["Linealidad", "Ruido no gaussiano", "Suficiencia causal", "Aciclicidad"],
          complexity: "low",
          complexityLabel: "Baja",
          robustnessLevel: "warning",
          robustnessLabel: "Identificación fuerte si se cumple no-gaussianidad; falla si el ruido es gaussiano",
        },
      },
      {
        id: "fci",
        name: "FCI (Fast Causal Inference)",
        status: "en-preparacion",
        summary:
          "Extensión de PC que admite confusores latentes no medidos, sin exigir el supuesto de suficiencia causal.",
        body: [],
      },
      {
        id: "do-calculus",
        name: "Intervención y do-calculus",
        status: "en-preparacion",
        summary:
          "Cálculo formal para estimar el efecto de intervenciones hipotéticas a partir de un grafo causal y datos puramente observacionales.",
        body: [],
      },
      {
        id: "mediacion",
        name: "Mediación causal",
        status: "en-preparacion",
        summary:
          "Descomposición de un efecto total en vías directas e indirectas a través de variables mediadoras.",
        body: [],
      },
    ],
  },

  home: {
    seo: {
      title: "Causality Graphs — Consultoría causal para farma",
      description:
        "Consultoría causal para la industria farmacéutica: DAGs y modelos causales dinámicos para diseños de estudio complejos o no ideales.",
    },
    hero: {
      eyebrow: "Consultoría causal para farma",
      title: "¿Necesitas un análisis DAG?",
      intro:
        "Causality Graphs trabaja con equipos de farma, investigación clínica y bioestadística para mapear supuestos, revisar la estructura de confusión y respaldar decisiones de evidencia mediante grafos acíclicos dirigidos (DAG) y modelos causales dinámicos (DCM).",
      chips: ["Estudios de un solo brazo", "Cegamiento parcial", "Respuesta longitudinal", "Estrategia de evidencia"],
      primaryCta: "Reservar una consulta",
      secondaryCta: "Explorar técnicas",
    },
    metrics: [
      {
        value: "Mapeo de supuestos",
        label: "Hacer explícita la lógica de confusión, mediación y selección antes de que la interpretación se fije.",
      },
      {
        value: "Modelado dinámico",
        label: "Incorporar el tiempo, la retroalimentación y la respuesta cambiante al tratamiento en el análisis causal.",
      },
      {
        value: "Apoyo a la decisión",
        label: "Respaldar la estrategia de evidencia cuando los controles son limitados, parciales o operativamente imperfectos.",
      },
    ],
    trust: {
      eyebrow: "Pensado para interlocutores técnicos",
      heading:
        "Pensado para equipos clínicos, grupos de bioestadística, medicina traslacional y responsables de estrategia de evidencia.",
      body: "El enfoque está diseñado para entornos de investigación donde el rigor metodológico, la alineación interna y la toma de decisiones práctica deben convivir.",
    },
    services: {
      eyebrow: "Qué hacemos",
      heading: "Interpretación de estudios, mapeo de supuestos y estrategia de evidencia para diseños no ideales.",
      cards: [
        {
          title: "Apoyo al diseño de estudios causales",
          description:
            "Enmarcar la pregunta causal, clarificar el estimando y hacer visibles las decisiones de diseño antes de que se conviertan en supuestos por defecto.",
        },
        {
          title: "Revisión y modelado de DAG",
          description:
            "Construir y revisar representaciones gráficas de exposición, resultado, mediación y vías de confusión para respaldar una interpretación defendible.",
        },
        {
          title: "Análisis causal dinámico",
          description:
            "Modelar sistemas que evolucionan en el tiempo cuando la respuesta al tratamiento, la adaptación, la retroalimentación y el momento de las vías no pueden ignorarse.",
        },
        {
          title: "Orientación de estrategia de evidencia",
          description:
            "Traducir el razonamiento causal en recomendaciones prácticas para la interpretación del estudio, la alineación interna y las siguientes decisiones de evidencia.",
        },
      ],
    },
    why: {
      eyebrow: "Por qué importa",
      heading: "Cuando las condiciones del ensayo son imperfectas, el riesgo de decisión está tanto en la estructura como en los números.",
      points: [
        "Muchos estudios farmacológicos operan con controles limitados, cegamiento parcial, vías de tratamiento cambiantes o contaminación observacional.",
        "Los resúmenes estándar pueden parecer convincentes mientras ocultan confusión, sesgo de colisión, efectos de selección o ambigüedad de vías.",
        "Una estructura causal explícita hace que las decisiones sean discutibles, los supuestos inspeccionables y la interpretación más defendible entre equipos.",
      ],
    },
    techniquesPreview: {
      eyebrow: "Vista previa de técnicas",
      heading: "Métodos elegidos para responder preguntas causales, no para decorar un plan de análisis.",
      cards: [
        {
          name: "Grafos acíclicos dirigidos",
          summary: "Mapear supuestos, identificar conjuntos de ajuste y hacer legible la estructura oculta.",
          useCase: "Útil cuando los equipos necesitan un lenguaje causal compartido antes de empezar a modelar.",
        },
        {
          name: "Modelos causales dinámicos",
          summary: "Representar cómo evolucionan los sistemas biológicos y de tratamiento en lugar de tratar el tiempo como un estorbo.",
          useCase: "Útil para respuesta longitudinal, retroalimentación, adaptación e interpretación mecanicista.",
        },
        {
          name: "Razonamiento contrafactual",
          summary: "Anclar la interpretación en contrastes explícitos de \"qué pasaría si\" en lugar de afirmaciones correlacionales vagas.",
          useCase: "Útil cuando quienes deciden necesitan claridad sobre preguntas de efecto del tratamiento bajo restricciones.",
        },
        {
          name: "Análisis de sensibilidad",
          summary: "Poner a prueba las conclusiones frente a sesgos no medidos, incertidumbre estructural y dependencia del modelo.",
          useCase: "Útil cuando la calidad de la evidencia es limitada pero aun así hay que decidir.",
        },
      ],
    },
    work: {
      eyebrow: "Trabajo seleccionado",
      heading: "Situaciones de consultoría representativas donde el razonamiento causal explícito cambió la recomendación.",
      caseLabel: "Problema -> método -> impacto",
      cases: [
        {
          title: "Revisión de señal oncológica de un solo brazo",
          challenge: "Un patrón de respuesta prometedor era difícil de interpretar sin un control concurrente.",
          method:
            "Refinamiento del DAG junto con un encuadre contrafactual explícito sobre los probables procesos de confusión y selección.",
          outcome: "El equipo del estudio obtuvo un límite de interpretación más claro y una estrategia de próxima evidencia más creíble.",
        },
        {
          title: "Mapeo longitudinal de la respuesta al tratamiento",
          challenge: "Los cambios de dosis, los abandonos y la dinámica de síntomas difuminaron la historia del tratamiento con el tiempo.",
          method: "Modelado causal dinámico para separar la estructura temporal, el momento de las vías y los estados de respuesta cambiantes.",
          outcome: "El modelo resultante respaldó un mejor razonamiento sobre progresión, tiempos y relevancia del criterio de valoración.",
        },
        {
          title: "Interpretación de evidencia con cegamiento parcial",
          challenge: "Las realidades operativas introdujeron efectos de expectativa y riesgo en la interpretación de resultados.",
          method: "Supuestos causales estructurados, revisión de mediación y encuadre de sensibilidad para una interpretación robusta.",
          outcome: "La dirección recibió una explicación más clara de qué se podía afirmar y qué requería cautela.",
        },
      ],
    },
    philosophy: {
      eyebrow: "Filosofía",
      heading: "El trabajo es colaborativo, consciente de los supuestos y está diseñado para sostenerse entre equipos.",
      principles: [
        "Hacer explícitos los supuestos antes de que se conviertan en valores por defecto invisibles.",
        "Separar la señal estructural de la conveniencia estadística.",
        "Usar el pensamiento causal para mejorar decisiones, no solo la complejidad del análisis.",
      ],
      teamPreviewEyebrow: "Vista rápida del equipo",
    },
    cta: {
      eyebrow: "Inicia una conversación",
      heading:
        "Cuéntanos el estudio, la restricción y la decisión que necesitas respaldar. Mantenemos la primera conversación enfocada y confidencial.",
      buttonLabel: "Contactar con Causality Graphs",
    },
  },

  about: {
    seo: {
      title: "Sobre nosotros — Causality Graphs",
      description: "Por qué existe Causality Graphs y los principios de trabajo detrás de la consultora.",
    },
    eyebrow: "Por qué existe esta marca",
    title: "Claridad causal para entornos de evidencia estructuralmente difíciles.",
    intro:
      "Causality Graphs existe porque muchas decisiones farmacológicas deben tomarse en condiciones incompletas, restringidas o imposibles de idealizar. La respuesta no es fingir que la estructura es simple. La respuesta es modelarla con honestidad.",
    mission: {
      eyebrow: "Misión",
      heading: "Llevar el razonamiento causal explícito a lugares donde la ambigüedad suele quedar enterrada.",
      body: "La consultora ayuda a los equipos a clarificar qué se puede afirmar razonablemente, dónde están los riesgos y cómo pasar de evidencia parcial a decisiones más sólidas sin sobreestimar la certeza.",
    },
    operating: {
      eyebrow: "Principios de trabajo",
      heading: "El trabajo se mantiene riguroso, práctico y legible para audiencias técnicas.",
    },
    principles: [
      "Hacer explícitos los supuestos antes de que se conviertan en valores por defecto invisibles.",
      "Separar la señal estructural de la conveniencia estadística.",
      "Usar el pensamiento causal para mejorar decisiones, no solo la complejidad del análisis.",
    ],
  },

  contact: {
    seo: {
      title: "Contacto — Causality Graphs",
      description: "Inicia una conversación confidencial sobre un estudio, restricción o decisión que necesitas respaldar.",
    },
    eyebrow: "Contacto",
    title: "Cuéntanos sobre el estudio y la decisión que intentas respaldar.",
    intro:
      "Usa el formulario como punto de partida para una conversación confidencial y enfocada. La estructura es intencionadamente simple para que los equipos puedan describir el problema científico sin fricción.",
    form: {
      nameLabel: "Nombre",
      namePlaceholder: "Tu nombre",
      organizationLabel: "Organización",
      organizationPlaceholder: "Empresa o grupo de investigación",
      emailLabel: "Correo electrónico",
      emailPlaceholder: "tu@ejemplo.com",
      projectTypeLabel: "Tipo de proyecto",
      projectTypeOptions: ["Revisión de DAG", "Modelado causal dinámico", "Interpretación de estudios", "Estrategia de evidencia"],
      descriptionLabel: "Descripción breve",
      descriptionPlaceholder: "Describe el diseño del estudio, las restricciones clave y la decisión que necesitas respaldar.",
      submitLabel: "Enviar consulta",
    },
    details: [
      { label: "Correo electrónico", value: "luis.gomez.epr@proton.me" },
      { label: "Teléfono", value: "+34 638 542 664" },
      { label: "Alcance habitual", value: "Informes de estudios farmacológicos, análisis DAG, modelado dinámico, estrategia de evidencia" },
      { label: "Estilo de respuesta", value: "Confidencial, enfocado y listo para presentar" },
    ],
  },

  team: {
    seo: {
      title: "Equipo — Causality Graphs",
      description: "Conoce al pequeño grupo de expertos detrás de Causality Graphs.",
    },
    eyebrow: "Equipo con mentalidad de investigación",
    title: "Un pequeño grupo experto construido para una colaboración científica de alta confianza.",
    intro:
      "La presentación del equipo es intencionadamente editorial en lugar de corporativa. El énfasis está en el enfoque metodológico, el estilo de colaboración y el tipo de rigor que los clientes pueden esperar.",
    members: [
      {
        name: "Dr. Alex Sospedra",
        role: "Experto en modelado",
        focus: "Diseño de DAG, decisiones científicas y arquitectura para estudios farmacológicos con restricciones.",
      },
      {
        name: "Daniel Rico",
        role: "Analista de datos",
        focus: "Eliminación de ruido, correlación y recuperación de parámetros",
      },
      {
        name: "Luis Gómez",
        role: "Fundador y responsable de estrategia",
        focus: "Estrategia y enfoque, comunicación, operaciones",
      },
    ],
  },

  techniques: {
    seo: {
      title: "Técnicas — Causality Graphs",
      description: "El conjunto de herramientas metodológicas detrás de la consultora: DAGs, modelos causales dinámicos y más.",
    },
    eyebrow: "Conjunto de métodos",
    title: "Técnicas para la claridad causal en investigación farmacológica.",
    intro:
      "Esta página explica el conjunto de herramientas metodológicas detrás de la consultora. El énfasis no está en el teatro metodológico, sino en un razonamiento disciplinado que respalda decisiones de evidencia reales.",
    items: [
      {
        title: "Grafos acíclicos dirigidos",
        description:
          "Los DAG dan a los equipos una forma compacta de expresar supuestos sobre exposiciones, resultados, factores de confusión, mediadores y procesos de selección antes de que los hábitos estadísticos tomen el control.",
        bullets: [
          "Clarificar qué variables deben ajustarse y cuáles no.",
          "Exponer fuentes ocultas de sesgo en entornos complejos de evidencia farmacológica.",
          "Respaldar la alineación entre equipos clínicos, de estadística y de estrategia.",
        ],
      },
      {
        title: "Modelos causales dinámicos",
        description:
          "Cuando la biología y los efectos del tratamiento evolucionan con el tiempo, una instantánea estática puede engañar. Los modelos causales dinámicos ayudan a representar el tiempo, la retroalimentación y los estados cambiantes.",
        bullets: [
          "Útiles para la respuesta longitudinal al tratamiento y los efectos de adaptación.",
          "Incorporan la estructura temporal a la interpretación en lugar de tratarla como ruido.",
          "Ayudan a razonar sobre intervenciones dentro de sistemas en evolución.",
        ],
      },
      {
        title: "Confusión variable en el tiempo",
        description:
          "Algunas variables son a la vez consecuencia de un tratamiento previo y determinantes del tratamiento o los resultados futuros. Estos escenarios necesitan más cuidado que un ajuste rutinario.",
        bullets: [
          "Separar la confusión cambiante de las vías causales.",
          "Evitar ajustes ingenuos que distorsionen el estimando.",
          "Mejorar la interpretación en escenarios de tratamiento secuencial.",
        ],
      },
      {
        title: "Mediación y vías",
        description:
          "Entender si un efecto viaja a través de una vía mecanicista, un artefacto operativo o un proceso de medición a menudo cambia la historia científica.",
        bullets: [
          "Distinguir efectos directos e indirectos cuando importa.",
          "Respaldar la interpretación basada en biomarcadores y mecanismos.",
          "Revelar cuándo un supuesto de vía está haciendo demasiado trabajo.",
        ],
      },
      {
        title: "Análisis de sensibilidad",
        description:
          "Una buena consultoría no se detiene en un único modelo preferido. Muestra cómo se mueven las conclusiones cuando los supuestos se debilitan o se consideran estructuras alternativas.",
        bullets: [
          "Poner a prueba las afirmaciones bajo calidad de evidencia limitada.",
          "Hacer visible la incertidumbre sin caer en la indecisión.",
          "Ayudar a las partes interesadas a entender la forma del riesgo, no solo su existencia.",
        ],
      },
      {
        title: "Síntesis de evidencia bajo restricciones",
        description:
          "Cuando no se dispone de condiciones ideales de ensayo, a menudo hay que reunir varias fuentes imperfectas en un único marco de razonamiento disciplinado.",
        bullets: [
          "Vincular distintos fragmentos de evidencia mediante una estructura explícita.",
          "Respaldar la toma de decisiones cuando los estudios no son ideales o son parcialmente comparables.",
          "Convertir evidencia fragmentada en una narrativa estratégica coherente.",
        ],
      },
    ],
  },

  works: {
    seo: {
      title: "Proyectos — Causality Graphs",
      description: "Proyectos seleccionados donde la estructura causal cambió la conversación.",
    },
    eyebrow: "Trabajo representativo",
    title: "Proyectos seleccionados donde la estructura causal cambió la conversación.",
    intro:
      "Estos ejemplos muestran el tipo de problemas que Causality Graphs está preparada para respaldar: evidencia farmacológica bajo controles imperfectos, complejidad temporal o riesgo de interpretación.",
    framing: {
      eyebrow: "Cómo se enmarcan los proyectos",
      heading: "Cada proyecto se organiza en torno a una decisión, no solo a una solicitud de análisis.",
    },
    caseLabel: "Formato representativo",
    cases: [
      {
        title: "Revisión de señal oncológica de un solo brazo",
        challenge: "Un patrón de respuesta prometedor era difícil de interpretar sin un control concurrente.",
        method:
          "Refinamiento del DAG junto con un encuadre contrafactual explícito sobre los probables procesos de confusión y selección.",
        outcome: "El equipo del estudio obtuvo un límite de interpretación más claro y una estrategia de próxima evidencia más creíble.",
      },
      {
        title: "Mapeo longitudinal de la respuesta al tratamiento",
        challenge: "Los cambios de dosis, los abandonos y la dinámica de síntomas difuminaron la historia del tratamiento con el tiempo.",
        method: "Modelado causal dinámico para separar la estructura temporal, el momento de las vías y los estados de respuesta cambiantes.",
        outcome: "El modelo resultante respaldó un mejor razonamiento sobre progresión, tiempos y relevancia del criterio de valoración.",
      },
      {
        title: "Interpretación de evidencia con cegamiento parcial",
        challenge: "Las realidades operativas introdujeron efectos de expectativa y riesgo en la interpretación de resultados.",
        method: "Supuestos causales estructurados, revisión de mediación y encuadre de sensibilidad para una interpretación robusta.",
        outcome: "La dirección recibió una explicación más clara de qué se podía afirmar y qué requería cautela.",
      },
    ],
    problemTypes: {
      eyebrow: "Tipos de problema habituales",
      heading: "La consultora se centra en situaciones de evidencia donde una lectura convencional no basta.",
      points: [
        "Estudios farmacológicos de un solo brazo que necesitan límites de interpretación más sólidos.",
        "Respuesta longitudinal al tratamiento donde importan los cambios de dosis, el tiempo o la adaptación.",
        "Evidencia observacional con mucha confusión que necesita supuestos causales explícitos.",
        "Cegamiento incompleto o restricciones operativas que afectan a cómo deben leerse los resultados.",
      ],
    },
  },
};

# ADR 0001 — Export estático en GitHub Pages con i18n manual duplicado

- Fecha: 2026-08-25
- Estado: aceptada (implementada; documentada a posteriori)

## Contexto

Causality Graphs necesita un sitio de marketing B2B (contenido casi estático, sin cuentas de usuario ni datos mutables) que comunique rigor científico a equipos de farma/clínica evaluando servicios de consultoría causal. El sitio debe existir en español (mercado principal) e inglés (paridad completa), con un elemento visual insignia (grafo DAG 3D animado) y sin presupuesto de hosting recurrente. El repositorio (`CausalityGraphs/`) ya aloja el dominio propio vía Cloudflare DNS, y el flujo de despliegue existente en la organización es GitHub Actions → GitHub Pages.

Estos hechos —sin backend necesario, presupuesto cero de hosting, DNS ya en Cloudflare, CI ya orientado a GitHub Pages— son los que fuerzan la decisión, no una preferencia tecnológica abstracta.

## Decisión

Usamos **Next.js App Router con `output: "export"`** (export 100% estático, sin servidor Next en producción) para el renderizado, desplegado a **GitHub Pages** vía `.github/workflows/deploy.yml` en la raíz del repo, con **Cloudflare únicamente para DNS** del dominio propio.

Para el bilingüismo, usamos **duplicación manual de árbol de rutas** (`src/app/**` para ES en la raíz, `src/app/en/**` para EN) en vez de un segmento dinámico `[locale]` o una librería de i18n como `next-intl`. Cada página es un wrapper delgado que llama `getContent(locale)` y renderiza el mismo componente de vista compartido (`src/components/views/*-view.tsx`), pasando hrefs específicos de locale como props. El contrato de contenido es el tipo `SiteContent` (`src/lib/content/types.ts`), implementado íntegramente por `es.ts` y `en.ts` — una clave de traducción que falta es un error de compilación.

## Alternativas consideradas

| Opción | A favor | En contra | Por qué no |
|---|---|---|---|
| Next.js con SSR/ISR en Vercel | Habilita features server-side futuras (formularios, CMS, A/B testing) sin fricción | Coste recurrente o gestión de plan gratuito con límites; exige re-apuntar DNS y renunciar a la integración GitHub Pages ya montada | El sitio no tiene hoy ninguna necesidad de servidor; pagar esa complejidad por adelantado no está justificado por el brief |
| Segmento dinámico `[locale]` + `next-intl` (o similar) con `generateStaticParams` | Escala mejor a 3+ idiomas; enrutado y negociación de idioma centralizados; menos riesgo de deriva estructural entre árboles | Con export estático exige generar explícitamente cada ruta por locale en build time; capa de indirección y dependencia nueva para resolver un problema de solo 2 idiomas y 6 páginas | El coste de la librería/abstracción supera el beneficio al tamaño actual del sitio; se puede migrar después si el catálogo de idiomas o páginas crece |
| CMS headless (Sanity/Contentful) para el contenido | Edición de copy sin PR; posible flujo editorial para no-desarrolladores | Introduce una dependencia externa, un contrato de datos no tipado en compilación, y complejidad de build (fetch en build time) | El copy cambia con poca frecuencia y el mantenedor único es también quien escribe código; el tipo `SiteContent` da más seguridad (error de compilación) que un CMS sin schema validation equivalente |
| Librería de componentes UI (Flowbite, shadcn/ui) | Velocidad de desarrollo, componentes accesibles por defecto | Se probó Flowbite Drawer concretamente y no renderizaba correctamente para el menú móvil; los supuestos visuales de una librería chocan con el requisito de marca de "nunca sentirse como plantilla genérica de agencia" | Descartada tras prueba real, no solo por preferencia — ver historial de git de la rama `visual-redesign-responsive` |

## Consecuencias

**Positivas:**

- Hosting gratuito, sin servidor que mantener ni parchear; superficie de ataque mínima (no hay backend que comprometer).
- El pipeline de CI/CD ya existente (GitHub Actions → Pages) se reutiliza sin cambios de infraestructura.
- El contrato de contenido tipado (`SiteContent`) da a la duplicación manual de rutas una red de seguridad real: no puede haber una página en inglés con una clave de copy faltante sin que falle `tsc`.
- Cloudflare queda limitado a su rol más simple (DNS), reduciendo puntos de configuración a auditar.

**Negativas y deuda asumida:**

- No hay mecanismo automático que garantice que ambos árboles de rutas (`es`/`en`) tengan la misma *estructura* de páginas — el tipo solo protege el *contenido*, no el enrutado. Añadir una página nueva exige recordar crearla en ambos árboles.
- Cualquier feature futura que requiera servidor (formulario de contacto real con envío de correo, CMS con fetch en runtime, autenticación) no puede añadirse sin decidir explícitamente abandonar el export estático o mover parte de la funcionalidad a un servicio de terceros basado en JS de cliente (p. ej. Formspree).
- La duplicación manual de rutas no escala con gracia más allá de 2-3 idiomas: cada idioma adicional multiplica el árbol de páginas.
- No hay observabilidad ni analítica confirmada — un sitio estático en GitHub Pages no da telemetría de servidor por defecto; cualquier medición exige instrumentación de cliente añadida explícitamente.

**Coste de revertir:** medio-alto, y depende de qué parte se revierta.

- Revertir el export estático (pasar a SSR/ISR en Vercel u otro runtime con servidor): coste medio — requiere quitar `output: "export"` de `next.config.ts`, mover el hosting, re-apuntar DNS en Cloudflare al nuevo proveedor, y auditar que ninguna página dependa de comportamiento específico de export estático. No exige reescribir componentes de vista.
- Revertir la duplicación manual de rutas a un `[locale]` dinámico: coste alto — exige reescribir el árbol de `src/app/**`, introducir `generateStaticParams` para generar cada combinación locale×página en build time, y re-cablear todos los `href` internos que hoy se pasan a mano como props locale-specific en cada `page.tsx`. Es la decisión más cara de revertir de las dos porque toca cada página del sitio, no solo configuración.

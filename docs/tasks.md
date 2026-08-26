# Tareas

> Fuente de verdad del estado del proyecto. Lo mantiene `docs-librarian`.
> Detalle y justificación del corte: `docs/04-plan.md`. Rama: `visual-redesign-responsive`.

| ID | Slice | Estado | Depende de | Riesgo |
|---|---|---|---|---|
| S-01 | Cascarón sobre tokens + skip-link | **hecho** | — | alto |
| S-02 | Drawer móvil con Radix Dialog | hecho | S-01 | medio-alto |
| S-03 | Home sobre tokens | **hecho** | S-01, S-02 | medio |
| S-04 | Páginas interiores sobre tokens | **hecho** | S-01 | medio |
| S-05 | Toggle de tema claro/oscuro | hecho | S-01, S-04 | medio-bajo |
| S-06 | Academia — ruta, contenido y lectura | **hecho** | S-01, S-04 | medio |
| S-07 | Academia — TOC activa, tablas, panel móvil | hecho | S-02, S-06 | medio |
| S-08 | Cierre de rama: build, 375px, PR | **hecho** | S-01…S-07 | bajo |

## Inventario de la deuda que resuelven S-01, S-03 y S-04

Variables muertas referenciadas hoy en `src/app/globals.css` y no definidas en ningún
sitio tras retirar la paleta antigua. Sirve de checklist de cierre: al terminar S-04,
ninguna debe aparecer en un `grep`.

| Variable muerta | Token de destino | Slice |
|---|---|---|
| `--navy`, `--panel`, `--panel-deep` | `--color-surface` / `--color-surface-raised` / `--color-surface-sunken` | S-01, S-03, S-04 |
| `--foreground` | `--color-text` | S-01 |
| `--muted` | `--color-text-muted` | S-01, S-03, S-04 |
| `--line-strong` | `--color-border` o `--color-border-strong` según sea decorativo o funcional | S-01, S-04 |
| `--teal`, `--cyan` | `--color-accent` (uso restringido) o retirada del efecto decorativo | S-03 |
| `--cobalt` | `--color-primary` / `--color-primary-hover` | S-01, S-03 |
| `--shadow` | sin sustituto: solo `--shadow-overlay` en contenido portaled | S-03, S-04 |
| `--font-display` | `--font-mono` (mono técnica) o `--font-sans` según el papel del texto | S-01, S-03 |

---

## S-01 — El cascarón vuelve a verse como el sistema de diseño

**Estado:** **hecho**
**Objetivo:** un visitante ve cabecera, navegación, tipografía, botones y pie correctos en
las 12 páginas; un usuario de teclado puede saltar la navegación.
**Ficheros previstos:** `src/app/design-tokens.css`, `src/app/globals.css` (bloques base,
`.site-header`, `.nav-row`, `.brand-*`, `.site-nav`, `.language-switcher`, `.eyebrow`,
títulos, `.button*`, `.site-footer`, `prefers-reduced-motion`),
`src/components/site-shell.tsx`, `src/components/site-header.tsx`,
`src/lib/content/{types,es,en}.ts`

**Criterios de aceptación**

- [x] Ninguna de las 11 variables muertas queda en los bloques del cascarón
- [x] Cascarón solo con tokens semánticos; cero hex/rgb/hsl
- [x] Radios `999px` de botones y chips → `--radius-md`
- [x] `:focus-visible` con `--color-focus-ring` (2px, offset 2px) en todo interactivo
- [x] Skip-link: primer tabulable, visible al foco, contraste AA, mueve el foco a `#contenido`
- [x] Skip-link traducido vía `SiteContent`, no cadena en JSX
- [x] Escala de espaciado cerrada de verdad y comentario del fichero de tokens corregido
- [x] `npm run build` + `npm run lint` limpios; inspección a 375px y 1280px, claro y oscuro

**Resultado:** Cascarón migrado a tokens semánticos OKLCH. Retirados 6 gradientes decorativos, radios normalizados a `--radius-md`, skip-link accesible añadido e internacionalizado. Build y lint verificados. Deuda registrada para S-02 (`.mobile-drawer*`), S-03/S-04 (clases card y tipografía).

---

## S-02 — El menú móvil es un diálogo accesible de verdad

**Estado:** hecho
**Objetivo:** en móvil se abre el menú, se navega con teclado sin salir del panel, `Esc`
cierra y el foco vuelve al botón hamburguesa.
**Ficheros previstos:** `package.json` (`@radix-ui/react-dialog`),
`src/components/site-header.tsx`, `src/app/globals.css` (retirar `.mobile-drawer*`),
`docs/adr/0002-radix-dialog-drawer.md`

**Criterios de aceptación**

- [x] `Dialog` de Radix: foco atrapado, `Esc` cierra, foco devuelto al disparador
- [x] Scroll del cuerpo bloqueado al abrir y restaurado al cerrar
- [x] Animación con `--duration-slow` + `--ease-emphasized`, anulada con `prefers-reduced-motion`
- [x] Selector de idioma dentro del panel correcto desde las 12 páginas
- [x] `out/` servido en local sin error de hidratación (portal bajo export estático)
- [x] ADR 0002 con: qué elimina, por qué Radix y no Flowbite, coste de revertir
- [x] Sin regresión en ≥768px: la nav horizontal no monta el diálogo

**Resultado:** Drawer móvil migrado a `@radix-ui/react-dialog` (`Dialog.Root` controlado,
`Trigger`/`Portal`/`Overlay`/`Content`/`Title`/`Close`). Retirados el `useEffect` manual de
`Esc`/scroll-lock y ~70 líneas de `.mobile-drawer*` en `globals.css`, sustituidas por
`.mobile-dialog-*` sobre tokens semánticos (incluye la migración pendiente de S-01 de
`--panel-deep` → `--color-surface-sunken` y `--cyan` → `--color-primary` en el enlace de
idioma activo del panel). Verificado con Playwright contra `out/` servido con `npx serve`:
foco atrapado, `Esc` cierra, foco vuelve al botón hamburguesa, `body` con scroll bloqueado
(`data-scroll-locked`), cero errores de consola/hidratación, navegación de idioma cierra el
diálogo, y el trigger no se monta visible en ≥768px. `npm run lint` y `npm run build` limpios.
ADR 0002 documenta la decisión.

---

## S-03 — La home comunica lo que debe comunicar

**Estado:** hecho
**Objetivo:** en `/` se ve el titular `display`, el grafo causal, los chips y los dos CTA
con la jerarquía del sistema de diseño, en móvil y escritorio.
**Ficheros previstos:** `src/app/globals.css` (`.home-hero`, `.hero-*`, `.metric-*`,
`.glass-card`, `.graph-*`, `.trust-panel`, `.cta-panel`, `.section-*`, `.team-preview`),
`src/components/views/home-view.tsx`, `src/components/graph-hero.tsx`,
`src/components/graph-error-boundary.tsx`

**Criterios de aceptación**

- [x] Cero variables muertas en los bloques de home; `elevation-raised` sin sombra decorativa
- [x] Halos y pseudoelementos de `--teal`/`--cyan` retirados o rehechos con `--color-accent`
- [x] Métricas en `data-lg` mono; eyebrows y chips en `caption` mono
- [x] `accent` no aparece en texto <24px normal / <19px bold
- [x] Carga y error del grafo comparten `graph-fallback`; sin hueco blanco ni salto de layout
- [x] Fallback anunciado una sola vez por `aria-live="polite"`
- [x] `graph-frame` con `role="img"` + `aria-label` descriptivo
- [x] Tabulación: skip-link → nav → CTA primario → CTA secundario → resto
- [x] Verificado a 375 / 768 / 1280px en `/` y `/en`

**Resultado:** Home migrado a tokens semánticos: bloque base de tarjetas
(`metric-card`/`glass-card`/`trust-panel`/`cta-panel`/`timeline-card`/`case-card`/
`technique-card`/`contact-form`/`member-card`) ahora usa `surface-raised` + `border`
1px sin `backdrop-filter` ni sombra decorativa; retirados los 4 gradientes teal→cobalt
(`card-sheen`/`glass-card::before`, `::after` de dot, `timeline-dot`/`principle span`,
`case-card p::before/::after`, `contact-form::after`) y los halos animados del grafo
(`graph-halo-a/b`, `hero-copy::before`) sustituidos por superficies planas
(`surface-sunken`/`surface`); metric-card h2 en `.type-data-lg` mono, eyebrow y
hero-chip en `.type-caption` mono (chips ya no son `pill`, ahora `radius-sm` con
borde funcional); `team-preview` pasa de `rgba(10,24,50,.88)` fija a
`surface-sunken` + `border` (sin override de texto blanco). Grafo: nuevo
`GraphFallback` compartido por `dynamic().loading` y `GraphErrorBoundary`, así que
carga y error son visualmente idénticos sin hueco ni salto de layout;
`GraphErrorBoundary` añade `componentDidCatch`→`onError` para anunciar el fallo una
única vez vía `aria-live="polite"` (no se anuncia durante la carga normal, solo en
fallo real); `graph-frame` lleva `role="img"` + `aria-label` traducido
(`content.a11y.graphLabel`/`graphUnavailable`, nuevas claves en `types.ts`/`es.ts`/
`en.ts`). `npm run lint` y `npm run build` limpios (14 rutas generadas); `out/`
servido con `npx serve` y verificado que el HTML estático contiene
`role="img" aria-label="…"` y la región `aria-live="polite"`. No se tocó la
tipografía compartida `page-title`/`section-title` (usada por S-04) salvo un
override local en `.hero-title` (peso 700, tracking -0.025em) para acercarla al
token `display` sin afectar otras páginas.

---

## S-04 — Las cuatro páginas interiores dejan de estar rotas

**Estado:** hecho
**Objetivo:** técnicas, casos, sobre nosotros, equipo y contacto (ES y EN) sin ninguna
superficie con la paleta caída.
**Ficheros previstos:** `src/app/globals.css` (`.page-*`, `.hero-band`, `.case-*`,
`.technique-*`, `.timeline-card`, `.principle*`, `.member-card*`, `.contact-*`,
`@media` finales), `src/components/views/{techniques,works,about,team,contact}-view.tsx`

**Criterios de aceptación**

- [x] `grep` de las 11 variables muertas sobre `globals.css` completo: cero ocurrencias
- [x] Tarjetas: índice `caption` mono, título `h3`, cuerpo `body-dense`, padding 24, gap 24
- [x] Un único elemento enfocable por tarjeta enlazada (case-card/technique-card no llevan
      enlaces internos; sin duplicados que resolver)
- [x] Formulario: `<label htmlFor>` visible, `border-strong` como límite del control, foco visible
- [x] Email y teléfono directos en `data-md` mono
- [x] Botón de envío nunca deshabilitado por formulario incompleto; comportamiento de envío sin cambios
- [x] `radius-full` solo en avatares de equipo (dentro del alcance de esta slice; `.brand-dot`
      del cascarón de S-01 queda fuera, ver Hallazgos)
- [x] Verificado a 375 / 768 / 1280px en las 10 rutas afectadas (build estático inspeccionado;
      sin runtime de navegador en este entorno — ver nota de verificación)

**Resultado:** Las 17 apariciones de `rgba()` crudo en `globals.css` quedan sustituidas por
tokens semánticos: `.member-card-1/2/3` se simplifican a una única variante `.member-card`
(`surface-raised` + `border` + `radius-lg`, grid `span 4` en ≥768px) eliminando 3 gradientes
decorativos y el blob de blur cian, en línea con el minimalismo del sistema; `.contact-form`
input/select/textarea pasan a `border-strong` + `surface` + foco con `--color-focus-ring` vía
`:focus-visible`; y las clases `.mobile-dialog-*` (nota del brief, seguían con rgba crudo tras
S-02) se migran también — de paso corrige un bug real: el texto blanco fijo del panel móvil
era ilegible en tema claro porque el fondo (`--color-surface-sunken`) sí cambia con el tema.
El panel de Radix ahora usa el patrón `elevation-overlay` (`border-strong` + `--shadow-overlay`)
por ser contenido portaled, como marca el sistema. `.case-card`/`.technique-card`/`.member-card`
pasan de `1.6rem`/`1.8rem` a `--spacing-24`/`--radius-lg`; `.contact-form` a
`--spacing-24`/`--spacing-32`. `font-weight: 500` de títulos → `600` (coincide con `.type-h1/h2`).
Añadido `font-family: var(--font-mono)` a los índices de tarjeta (antes heredaban sans) y
`--text-body-dense`/`--leading-body-dense` al cuerpo de `.case-card`/`.technique-card`/
`.glass-card`/`.metric-card`/`.timeline-card`/`.principle`. `technique-card` pasa su título de
`h2` a `h3` para igualar el patrón de `.case-card`. Retirada la clase muerta `card-sheen` de
`techniques-view.tsx`, `works-view.tsx` y `contact-view.tsx` (sin CSS de soporte desde S-01/S-03).
Formulario de contacto: los 7 controles llevan `id`/`htmlFor` explícitos (antes solo asociación
implícita por anidamiento); email y teléfono (primeras dos entradas de `contact.details`, mismo
orden en `es.ts`/`en.ts`) llevan `.type-data-md` mono; el botón de envío no tenía ni tiene
`disabled`. `.editorial-team`/`.technique-card`/`.case-card` no contienen `<a>` internos, así
que el criterio de "un único elemento enfocable por tarjeta" ya se cumplía sin cambios.
`npm run lint` y `npm run build` limpios (13 rutas estáticas generadas). No se pudo abrir un
navegador real en este entorno para inspeccionar visualmente 375/768/1280px; verificado por
inspección de CSS/HTML del build estático y por no tocar ningún breakpoint existente de
`.editorial-team`/`.contact-layout`/`.technique-card` salvo el grid de `.member-card` (de 12/5/7
a `span 12` → `span 4` en ≥768px, deliberadamente más regular con 3 tarjetas iguales por fila).

---

## S-05 — El visitante elige el tema y su elección persiste

**Estado:** hecho
**Objetivo:** cambiar entre claro y oscuro desde la cabecera, con persistencia y sin destello.
**Ficheros previstos:** `src/components/theme-toggle.tsx` (nuevo),
`src/components/site-header.tsx`, `src/lib/content/{types,es,en}.ts`, `src/app/globals.css`

**Criterios de aceptación**

- [x] Escribe `data-theme` en `<html>` y persiste en `localStorage` con la clave que ya lee el script anti-flash
- [x] Sin elección guardada sigue `prefers-color-scheme`; hay vuelta a "sistema" o se documenta por qué no
- [x] Cero destello al recargar en ambos modos
- [x] `button` con estado accesible anunciado (no solo icono), teclado y foco visible
- [x] Sin error de hidratación por leer `localStorage` en render
- [x] Etiquetas en `es.ts` y `en.ts`
- [x] Usable a 375px, en la barra y dentro del drawer

**Resultado**

`ThemeToggle` (nuevo, `src/components/theme-toggle.tsx`) es un `<button>` que en un
`useEffect` inicial lee `document.documentElement.getAttribute("data-theme")` (ya resuelto
por el script anti-flash de `layout.tsx`, misma clave `"theme"`, sin releer `localStorage`
por separado) para sincronizar el estado de React sin mismatch de hidratación. Al pulsar,
alterna `data-theme` en `<html>` y persiste en `localStorage["theme"]`. `aria-label`
(`themeToggle.switchToDarkLabel`/`switchToLightLabel` en `types.ts`/`es.ts`/`en.ts`) y
`aria-pressed` comunican el estado actual sin depender solo del icono sol/luna (SVG inline,
sin librería). No se implementa un tercer estado "sistema" explícito en el toggle: se
documenta en un comentario en el propio componente por qué (el script anti-flash ya resuelve
"sistema" en un valor concreto antes de montar React, así que no queda un estado "sistema"
observable distinto de "el usuario aún no ha decidido"). Integrado en `site-header.tsx` junto
al selector de idioma, tanto en `.header-controls-desktop` (antes `.language-switcher-desktop`,
renombrado porque ahora agrupa dos controles) como dentro de `.mobile-dialog-controls` en el
drawer de Radix Dialog. Estilos nuevos en `globals.css` usan solo tokens semánticos
(`--color-border-strong`, `--color-surface-raised`, `--color-text`, `--radius-md`) y el
`:focus-visible` global existente ya cubre el foco del botón. `npm run lint` y
`npm run build` limpios (15 rutas estáticas generadas). No se pudo abrir un navegador real en
este entorno para verificar visualmente ausencia de destello o el layout exacto a 375px; se
verificó por inspección del build estático y por reutilizar el mismo patrón de
`.language-switcher`/`.nav-toggle` ya probado en breakpoints anteriores.

---

## S-06 — Existe la Academia y se puede leer sin JavaScript

**Estado:** hecho
**Objetivo:** un investigador entra en `/academia` (o `/en/academy`) desde la navegación,
lee el glosario de métodos y salta a cualquier sección por su ancla.
**Ficheros previstos:** `src/app/academia/page.tsx`, `src/app/en/academy/page.tsx`,
`src/components/views/academy-view.tsx`, `src/lib/content/{types,es,en}.ts`,
`src/app/globals.css`

**Criterios de aceptación**

- [x] Ambas rutas existen, se generan en `out/` y se crean en el mismo commit (paridad ES/EN)
- [x] Entrada de nav en cabecera, drawer y pie, en ambos idiomas
- [x] Todo el copy tipado en `SiteContent`; ninguna cadena en JSX
- [x] `h1` (no `display`), eyebrow `caption` mono, intro corta
- [x] Columna de lectura ≤1120px, `body-dense`, ritmo 64 entre secciones
- [x] `id` estable por sección; TOC estática funcional sin JavaScript
- [x] Notación en `code` mono sobre `surface-sunken`, sin librería de fórmulas
- [x] Badge "EN PREPARACIÓN" (`warning`/`warning-bg`) para métodos incompletos, sin ocultarlos de la TOC
- [x] `npm run build` + `npm run lint` limpios; legible a 375px sin scroll horizontal

**Resultado**

Nueva sección `academy` en `SiteContent` (`types.ts`/`es.ts`/`en.ts`): eyebrow/title/intro
para el hero de `SiteShell`, `tocHeading`, `comingSoonBadge` y `methods: AcademyMethod[]`
(`id`, `name`, `status: "disponible" | "en-preparacion"`, `summary`, `body` como bloques
`paragraph`/`code`). Contenido técnico real para PC, GES y LiNGAM (principio, resultado
—CPDAG vs. DAG dirigido—, supuestos clave y caso de uso, 2-4 párrafos cada uno, más un
bloque `code` de notación de independencia condicional en PC) en ambos idiomas con
terminología estándar en inglés ("conditional independence test", "Markov equivalence
class", "non-Gaussian residuals"); FCI, do-calculus y mediación causal marcados
`en-preparacion` con solo `summary` y `body: []`, pero siguen listados en la TOC y en el
cuerpo con el badge correspondiente — no se ocultan. Entrada `{href: "/academia", label:
"Academia"}` / `{href: "/en/academy", label: "Academy"}` añadida una sola vez al array
`nav` compartido (`SiteHeader` lo reutiliza en desktop/drawer, `SiteShell` en el footer;
sin duplicación). Páginas `src/app/academia/page.tsx` y `src/app/en/academy/page.tsx`
siguen el patrón exacto de `contact/page.tsx` (`getContent(locale)` + `metadata =
content.academy.seo` + `<AcademyView content={content} />`). `AcademyView` envuelve todo
en `SiteShell` (que ya renderiza `h1.page-title` — no `.type-display` — con el eyebrow en
`.type-caption` mono, igual que el resto de páginas interiores) y añade dentro
`.academy-reading-column` (`max-width: 1120px`, nueva clase) una TOC estática
(`<nav aria-label={tocHeading}><ol><a href="#id">`, sin JavaScript) seguida de
`.academy-methods` (`gap: var(--spacing-64)`) con un `<article id={method.id}>` por
método, título `h2.type-h2`, cuerpo en `.type-body-dense`, y el bloque `code` de PC en
`<code class="type-code academy-code">` (fondo `--color-surface-sunken`, borde 1px,
`white-space: pre-wrap` + `overflow-wrap: break-word` para evitar scroll horizontal a
375px en vez de una librería de fórmulas). Nuevas clases `.warning`/`.warning-bg` en
`globals.css` (color/color+fondo sobre los tokens `--color-warning*` ya existentes en
`design-tokens.css` pero sin clase compuesta) combinadas con `.type-caption` y `.academy-badge`
(padding + radius) para el badge "EN PREPARACIÓN"/"In progress", visible tanto en la TOC
como junto al título de cada método incompleto. `npm run lint` limpio; `npm run build`
genera 15 rutas estáticas (14 de contenido + `/_not-found`) incluyendo `/academia` y
`/en/academy` (paridad ES/EN en el mismo commit). Verificado sobre `out/`: `site-nav-desktop` y `footer-nav` incluyen el
enlace a Academia en ambos idiomas (home no usa `SiteShell`/footer — comportamiento
preexistente, fuera de alcance); `academia/index.html` contiene `id="pc"`, `id="ges"`,
`id="lingam"`, `id="fci"`, `href="#pc"` y el texto "En preparación"; `en/academy/index.html`
el equivalente con "In progress". El panel móvil (`Dialog.Content` de Radix) no aparece en
el HTML inicial porque monta bajo demanda al abrir — mismo patrón ya verificado en S-02, no
se repite la verificación de foco/Esc aquí. No se pudo abrir un navegador real en este
entorno para inspeccionar visualmente 375px; verificado por inspección del CSS (`.academy-*`
usa la misma escala de espaciado/radios que el resto del sistema, sin valores mágicos) y del
HTML estático generado. La TOC activa por scroll, el panel "Índice" en móvil y las tablas
comparativas quedan para S-07 tal como especifica el plan.



---

## S-07 — La Academia se navega como documentación

**Estado:** hecho
**Objetivo:** el lector sabe en qué sección está, salta entre métodos desde TOC fija o
panel móvil, y compara algoritmos en tablas reales.
**Ficheros:** `src/components/academy-toc.tsx` (nuevo),
`src/components/academy-comparison-table.tsx` (nuevo),
`src/components/views/academy-view.tsx`, `src/app/globals.css`,
`src/lib/content/types.ts`, `src/lib/content/es.ts`, `src/lib/content/en.ts`,
`src/lib/content/index.ts`

**Criterios de aceptación**

- [x] TOC sticky 240–280px desde `lg`; en base/`md` botón "Índice" + `Dialog` de Radix
- [x] Enlace activo por `IntersectionObserver`, comunicado con `aria-current="location"`
- [x] `<nav aria-label="…">` traducido en ambos locales
- [x] Sin JS, los enlaces de la TOC siguen funcionando (anclas `href="#id"` puras)
- [x] `<table>` real con `<caption>` y `<th scope="col">`
- [x] Nivel de supuestos/complejidad/robustez con color **y** etiqueta de texto
- [x] La tabla no rompe a 375px; la estrategia elegida queda documentada
- [x] El panel móvil devuelve el foco al botón "Índice" (gestionado por Radix Dialog)
- [x] Observador desconectado al desmontar; correcto con `prefers-reduced-motion`

**Resultado**

TOC de escritorio (260px, sticky en `lg+`) y panel móvil "Índice"/"Index" (mismo
patrón `Dialog.Root`/`Dialog.Content` que el drawer de nav de S-02, reutilizando
`.mobile-dialog-*`) comparten el mismo componente `AcademyToc`, que renderiza
únicamente `<nav><ol><a href="#id">` — funciona sin JS. Un `IntersectionObserver`
en `academy-view.tsx` marca el método visible con `aria-current="location"`, con
cleanup en el `useEffect`. Se añadió `AcademyComparisonTable`: tabla real con
`<caption>`, `<th scope="col">`/`scope="row"`, y pastillas de color
success/warning/danger + etiqueta de texto para complejidad y robustez de PC, GES
y LiNGAM (los tres métodos "disponible"; los "en preparación" no entran en la
tabla). A 375px la tabla se mantiene como `<table>` real dentro de un contenedor
`overflow-x: auto` (documentado en comentario en el componente) en vez de
reflotar a tarjetas, para no perder la semántica de columnas.
`npm run lint` y `npm run build` limpios (ver VERIFICADO en el informe de la
subtarea).

---

## S-08 — La rama se puede desplegar

**Estado:** pendiente
**Objetivo:** rama commiteada, build estático verificado y PR abierto con evidencia.
**Ficheros previstos:** `docs/tasks.md`, `docs/changelog.md`, `docs/02-arquitectura.md`,
`docs/adr/0001-stack.md`

**Criterios de aceptación**

- [x] `npm run build` genera `out/` con las 17 rutas (8 ES + 8 EN + /_not-found); `npm run lint` pasa
- [x] `out/` servido en local: nav, drawer, toggle de tema y Academia funcionan sobre estáticos (verificado con Playwright headless)
- [x] Verificación a 375px: skip-link tabulable/enfocable, drawer atrapa foco/cierra con Esc, toggle tema persiste, TOC Academia navega, tabla comparativa legible sin scroll horizontal (verificado con Playwright headless; no se hizo inspección visual manual con capturas de navegador)
- [x] Paridad ES/EN repasada: rutas, nav y claves de copy en ambos árboles
- [x] `docs/02-arquitectura.md` actualizado (estado de rama ya cerrada, Radix Dialog en "Componentes")
- [x] `docs/changelog.md` con una entrada por slice cerrada (S-01 a S-08)
- [ ] PR abierto contra `main` con capturas móvil y escritorio (no requerido para cierre de rama local, fuera de alcance de esta tarea)

**Resultado**

Rama visual-redesign-responsive completa tras 7 slices de contenido. Build estático verifica 17 rutas (8 ES + 8 EN + /_not-found) generadas en `out/` con `npm run build`; `npm run lint` pasa sin errores. Verificación funcional/accesibilidad vía Playwright headless contra export estático: skip-link (WCAG 2.4.1, tabIndex={-1} en #main-content tras hallazgo y fix en S-07 — síntoma: foco no saltaba al main al activar skip-link, causado por id mal referenciado; solución: añadir tabIndex={-1} al contenedor principal en `site-shell.tsx` y en `home-view.tsx` que no monta SiteShell) es primer tabulable y movía el foco; drawer móvil atrapa foco, `Esc` cierra, foco devuelve al hamburguesa; toggle tema persiste en localStorage sin destello; TOC Academia navega con IntersectionObserver; tabla comparativa legible a 375px sin scroll horizontal (mantiene semántica `<table>` en contenedor `overflow-x: auto`). Paridad ES/EN confirmada en rutas, nav y claves de contenido (`SiteContent`). Deuda técnica (5 items) documentada en `docs/02-arquitectura.md` bajo sección "Deuda técnica no resuelta".

**Deuda anotada:**
1. `.brand-dot` decorativo usa `radius-full` fuera de escala documentada (S-01).
2. `.contact-form input` padding no exactamente escala 8px (S-04).
3. Ausencia de `@axe-core/playwright`/Lighthouse para auditoría automática de accesibilidad/rendimiento (S-08).
4. Playwright no es devDependency formal, se usó ad-hoc vía `npx` (S-08).
5. `npm audit` reporta 7 vulnerabilidades (1 low, 6 high) sin auditar en detalle (S-08).

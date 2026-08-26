# Plan de slices — Causality Graphs

> Fecha: 2026-08-25 · Rama de trabajo: `visual-redesign-responsive`
> Fuentes: `docs/01-brief.md`, `docs/02-arquitectura.md`, `docs/03-design-system.md`, `docs/adr/0001-stack.md`
> Estado de tareas (fuente de verdad de progreso): `docs/tasks.md`

## Punto de partida real

El sistema de diseño está aprobado y `src/app/design-tokens.css` ya está implementado e
importado desde `globals.css`. El swap tipográfico (Fraunces → IBM Plex Mono) y el script
inline anti-flash de `data-theme` ya están hechos.

**Pero el sitio está visualmente degradado ahora mismo.** Verificado por inspección:
`src/app/globals.css` (1120 líneas de reglas de componente) sigue referenciando **11
variables que ya no existen** en ningún sitio:

```
--navy  --teal  --cobalt  --cyan  --muted  --line-strong
--panel  --panel-deep  --shadow  --font-display  --foreground
```

Compila y pasa lint porque un `var()` sin definir no es un error de CSS: cae al valor
inicial (transparente / negro / fuente por defecto). Esto no es una tarea de pulido: es
la deuda que bloquea todo lo demás, porque cualquier pantalla nueva construida encima
heredaría reglas rotas.

## Cómo está cortado este plan

Rebanadas verticales: cada una atraviesa contenido tipado → vista → CSS/tokens →
verificación, y termina en algo que un visitante puede ver o hacer. No hay ninguna slice
del tipo "migrar todo el CSS" ni "crear todos los tipos": la migración se corta **por
superficie visible** (cascarón, home, páginas interiores), de modo que cada slice cierra
con una pantalla concreta correcta y demostrable, no con un porcentaje de un fichero.

Orden = (1) riesgo técnico, (2) camino crítico del visitante, (3) el resto.

| Orden | Slice | Por qué está aquí |
|---|---|---|
| S-01 | Cascarón sobre tokens + skip-link | Riesgo máximo: toca las reglas base que heredan las 12 páginas |
| S-02 | Drawer móvil con Radix Dialog | Riesgo técnico: primera dependencia Radix + portal bajo export estático |
| S-03 | Home sobre tokens | Camino crítico: el filtro de 8 segundos del brief |
| S-04 | Páginas interiores sobre tokens | Cierra la regresión visual; sin esto no hay PR |
| S-05 | Toggle de tema claro/oscuro | Primera vez que el modo claro se ejerce de verdad |
| S-06 | Academia — ruta, contenido y lectura | Pantalla nueva; la mitad que funciona sin JS |
| S-07 | Academia — TOC activa, tablas y panel móvil | La mitad interactiva, separada porque no cabe con S-06 |
| S-08 | Cierre de la rama: build, 375px, PR | Convierte el trabajo en algo desplegable |

Recordatorio de restricciones ya fijadas (no se re-discuten en ninguna slice): export
estático obligatorio, paridad de rutas ES/EN manual, UI solo React + Tailwind v4 + Radix,
color solo por token OKLCH, espaciado solo en la escala de 8px.

---

### S-01 — El cascarón vuelve a verse como el sistema de diseño

**Objetivo:** un visitante ve, en cualquiera de las 12 páginas, una cabecera, navegación,
tipografía, botones y pie correctos según `03-design-system.md`; y un usuario de teclado
puede saltar la navegación con un enlace visible al foco.

**Depende de:** — (primera slice)

**Ficheros previstos:**
- `src/app/design-tokens.css` (corrección de la escala de espaciado, ver criterios)
- `src/app/globals.css` (bloques: `html`, `body`, `a`, `.site-background`, `.site-header`,
  `.container`, `.nav-row`, `.brand-*`, `.site-nav`, `.language-switcher`, `.sr-only`,
  `.eyebrow`, títulos, `.button*`, `.site-footer`, `.footer-*`, bloque
  `prefers-reduced-motion`)
- `src/components/site-shell.tsx`, `src/components/site-header.tsx` (skip-link + destino)
- `src/lib/content/types.ts`, `es.ts`, `en.ts` (clave `a11y.skipToContent`)

**Criterios de aceptación:**
- [ ] `grep -o 'var(--[a-z0-9-]*)' src/app/globals.css` no devuelve ninguna de las 11
      variables muertas dentro de los bloques listados arriba (las restantes quedan para
      S-03/S-04, y están inventariadas en `docs/tasks.md`)
- [ ] Cabecera, nav, botones primario/secundario y pie usan solo tokens semánticos
      (`--color-*`, `--radius-*`, `--spacing-*`, `--duration-*`) — cero hex/rgb/hsl
- [ ] Los radios `999px` de botones y chips del cascarón pasan a `--radius-md` (decisión
      explícita del sistema de diseño §5)
- [ ] Todo interactivo del cascarón tiene `:focus-visible` con `--color-focus-ring`,
      2px, offset 2px; ninguno usa solo `outline: none`
- [ ] Skip-link: primer elemento tabulable del DOM, invisible hasta el foco, visible y
      con contraste AA al enfocarse, y su destino `#contenido` recibe el foco al activarlo
- [ ] Skip-link traducido en ambos locales vía `SiteContent` (no string en JSX)
- [ ] La escala de espaciado queda realmente cerrada: hoy `--spacing-8: 8px` genera
      `p-8`, no `p-2`, y el multiplicador `--spacing` por defecto de Tailwind v4 sigue
      permitiendo `p-3`/`p-5`. Se decide y documenta el mapeo definitivo (anular la base o
      renombrar las claves) y el comentario del fichero de tokens deja de mentir
- [ ] Verificación: `npm run build` y `npm run lint` limpios; inspección visual en 375px
      y 1280px de `/` y `/en` en ambos modos de color

**Riesgo:** alto — es el bloque de CSS del que heredan todas las páginas; un error aquí
se propaga a las 12 rutas a la vez. Mitigación: se cierra con captura visual antes/después
de la cabecera y el pie en los dos anchos.

---

### S-02 — El menú móvil es un diálogo accesible de verdad

**Objetivo:** en móvil, un visitante abre el menú, navega con teclado sin salirse del
panel, lo cierra con `Esc` y el foco vuelve al botón hamburguesa.

**Depende de:** S-01 (tokens del cascarón ya migrados)

Va segunda, antes que cualquier pantalla, por dos razones: es la primera vez que el
proyecto instala Radix (hay que comprobar que un componente con portal y `useEffect`
hidrata bien bajo `output: "export"` antes de apoyar la Academia en ese mismo primitivo),
y porque migrar a tokens el drawer hecho a mano para acto seguido tirarlo sería trabajo
desperdiciado — por eso S-01 no toca `.mobile-drawer*`.

**Ficheros previstos:**
- `package.json` (`@radix-ui/react-dialog` — única dependencia nueva del plan)
- `src/components/site-header.tsx` (sustituye estado `useState` + clases `is-open`)
- `src/app/globals.css` (retira `.mobile-drawer`, `.mobile-drawer-backdrop`,
  `.mobile-drawer-header`, `.mobile-drawer-close`, `.mobile-drawer-nav` y las reglas
  `@media (max-width: 767px)` asociadas)
- `docs/adr/0002-radix-dialog-drawer.md`

**Criterios de aceptación:**
- [ ] El drawer es `Dialog` de Radix: foco atrapado, `Esc` cierra, foco devuelto al
      disparador, `aria-modal` y `aria-labelledby` gestionados por el primitivo
- [ ] El scroll del cuerpo queda bloqueado con el panel abierto y se restaura al cerrar
- [ ] Animación de entrada/salida con `--duration-slow` + `--ease-emphasized`, anulada
      bajo `prefers-reduced-motion`
- [ ] El selector de idioma dentro del panel sigue llevando a la ruta equivalente del
      otro árbol desde cualquiera de las 12 páginas
- [ ] `npm run build` genera `out/` sin error de hidratación ni de `document` en build
      (riesgo real del portal bajo export estático) — verificado sirviendo `out/`
- [ ] ADR 0002 registra: qué elimina (≈70 líneas de CSS y el estado a mano), por qué
      Radix y no volver a Flowbite (descartado en su día por render incorrecto), y coste
      de revertir
- [ ] Sin regresión en ≥768px: la nav horizontal no monta el diálogo

**Riesgo:** medio-alto — primera dependencia de UI del proyecto y primer componente con
portal en un build estático.

---

### S-03 — La home comunica lo que debe comunicar

**Objetivo:** un responsable de bioestadística abre `/` y en 8 segundos ve el titular
`display`, el grafo causal, los chips de capacidad y los dos CTA con la jerarquía del
sistema de diseño, en móvil y en escritorio.

**Depende de:** S-01, S-02

**Ficheros previstos:**
- `src/app/globals.css` (`.home-hero`, `.hero-grid`, `.hero-copy`, `.hero-title`,
  `.hero-intro`, `.hero-chip*`, `.hero-actions`, `.metric-*`, `.glass-card`,
  `.graph-frame`, `.graph-*`, `.trust-panel`, `.cta-panel`, `.section-*`, `.team-preview`)
- `src/components/views/home-view.tsx`
- `src/components/graph-hero.tsx`, `src/components/graph-error-boundary.tsx`

**Criterios de aceptación:**
- [ ] Cero variables muertas en los bloques de home; superficies con
      `elevation-raised` (`surface-raised` + `border` 1px), sin sombra decorativa
- [ ] Los halos y `::before/::after` decorativos que usaban `--teal`/`--cyan` se retiran
      o se rehacen con `--color-accent`; ningún gradiente decorativo genérico sobrevive
- [ ] Métricas en `data-lg` mono y eyebrows/chips en `caption` mono — el rol de la mono
      queda visible, que es la razón del swap tipográfico
- [ ] `accent` no se usa en texto por debajo de 24px normal / 19px bold (límite de
      contraste 3.62:1 documentado en el sistema de diseño)
- [ ] Estado de carga y de error del grafo comparten el mismo `graph-fallback` estático:
      nunca hay hueco en blanco ni salto de layout
- [ ] El fallback anuncia una sola vez por `aria-live="polite"` que la visualización
      interactiva no está disponible; el texto del hero nunca vive dentro del canvas
- [ ] `graph-frame` decorativo expone `role="img"` + `aria-label` descriptivo
- [ ] Orden de tabulación: skip-link → nav → CTA primario → CTA secundario → resto
- [ ] Patrón de 3 niveles verificado a 375 / 768 / 1280px en `/` y `/en`

**Riesgo:** medio — mucha superficie decorativa apoyada en la paleta antigua; el grafo 3D
es el elemento más frágil del sitio.

---

### S-04 — Las cuatro páginas interiores dejan de estar rotas

**Objetivo:** un evaluador recorre técnicas, casos, sobre nosotros, equipo y contacto (y
sus gemelas en inglés) sin encontrar ni una sola superficie con la paleta caída.

**Depende de:** S-01

**Ficheros previstos:**
- `src/app/globals.css` (`.page-shell`, `.page-content`, `.hero-band`, `.page-title`,
  `.page-intro`, `.case-*`, `.technique-*`, `.timeline-card`, `.principle*`,
  `.bullet-panel`, `.editorial-team`, `.member-card*`, `.contact-layout`,
  `.contact-form`, `.contact-aside`, `.full-span`, y las `@media (max-width: …)` finales)
- `src/components/views/{techniques,works,about,team,contact}-view.tsx`

**Criterios de aceptación:**
- [ ] Tras esta slice, `grep` de las 11 variables muertas sobre `globals.css` no devuelve
      **ninguna** ocurrencia en todo el fichero
- [ ] Tarjetas de caso y de técnica: índice en `caption` mono, título `h3`, cuerpo
      `body-dense`, padding 24, gap de rejilla 24 — según §1 del sistema de diseño
- [ ] Cada tarjeta enlazada tiene un único elemento enfocable (sin enlaces duplicados
      dentro de la misma tarjeta)
- [ ] Formulario de contacto: `<label htmlFor>` visible en todos los campos, borde
      `border-strong` (no `border`) por ser el único límite del control, foco visible, y
      el email/teléfono directos en `data-md` mono como pide la Pantalla 4
- [ ] El botón de envío nunca se deshabilita por "formulario incompleto"; el
      comportamiento actual de envío no se modifica en esta slice (sigue siendo estático,
      ver No-alcance del brief)
- [ ] `member-card` conserva `radius-full` solo en avatares; el resto pasa a la escala
      de 3 radios
- [ ] 375 / 768 / 1280px verificado en las 10 rutas afectadas (5 ES + 5 EN)

**Riesgo:** medio — volumen alto de reglas, pero cada página es independiente y el
patrón ya quedó fijado en S-01 y S-03. Si no cabe en una sesión, se parte en
S-04a (técnicas + casos) y S-04b (sobre nosotros + equipo + contacto).

---

### S-05 — El visitante elige el tema y su elección persiste

**Objetivo:** un visitante cambia entre claro y oscuro desde la cabecera, la elección
sobrevive a la recarga y a la navegación entre páginas, y no hay destello al cargar.

**Depende de:** S-01, S-04 (para que el modo claro se pueda juzgar en todas las páginas)

Va después de la migración a propósito: el toggle es el primer momento en que el modo
claro se ejerce de verdad en todo el sitio, y sirve como verificación cruzada de que los
tokens se usaron por su nombre semántico y no por el color que tienen en oscuro.

**Ficheros previstos:**
- `src/components/theme-toggle.tsx` (nuevo)
- `src/components/site-header.tsx` (colocación en nav y dentro del drawer)
- `src/lib/content/types.ts`, `es.ts`, `en.ts` (etiquetas accesibles del control)
- `src/app/globals.css` (estilos del control)

**Criterios de aceptación:**
- [ ] El control escribe `data-theme` en `<html>` y lo persiste en `localStorage` con la
      misma clave que ya lee el script anti-flash de `layout.tsx`
- [ ] Sin elección guardada, el sitio sigue `prefers-color-scheme`; elegir manualmente lo
      anula, y existe forma de volver a "sistema" o queda documentado por qué no
- [ ] Cero destello de tema incorrecto al recargar en ambos modos (el script inline ya
      existente no se rompe)
- [ ] El control es un `button` con `aria-pressed` o `aria-label` que dice el estado, no
      solo un icono; alcanzable por teclado y con foco visible
- [ ] No hay error de hidratación por leer `localStorage` en render (lectura en efecto o
      estado inicial diferido)
- [ ] Etiquetas presentes en `es.ts` y `en.ts` (una clave ausente es error de compilación)
- [ ] Visible y usable a 375px, tanto en la barra como dentro del drawer

**Riesgo:** medio-bajo — el mecanismo de aplicación ya existe; el riesgo real es la
desincronización script inline ↔ React durante la hidratación.

---

### S-06 — Existe la Academia y se puede leer sin JavaScript

**Objetivo:** un investigador entra en `/academia` (o `/en/academy`) desde la navegación,
lee el glosario de métodos causales y salta a cualquier sección por su ancla.

**Depende de:** S-01, S-04

**Ficheros previstos:**
- `src/app/academia/page.tsx`, `src/app/en/academy/page.tsx`
- `src/components/views/academy-view.tsx`
- `src/lib/content/types.ts` (tipos nuevos: `AcademyContent`, `AcademySection`,
  `AcademyMethod`, `MethodComparisonRow`), `es.ts`, `en.ts`
- `src/lib/content/types.ts` → `nav` (entrada nueva en ambos locales)
- `src/app/globals.css` (`.academy-*`)

**Criterios de aceptación:**
- [ ] Ambas rutas existen y se generan en `out/` (paridad ES/EN creada en el mismo
      commit, según el checklist de riesgo del brief)
- [ ] La entrada de nav aparece en cabecera, drawer y pie en ambos idiomas
- [ ] Todo el contenido vive tipado en `SiteContent`: ninguna cadena de copy en el JSX
- [ ] Cabecera de página con `h1` (no `display`), eyebrow `caption` mono e intro corta,
      tal como fija la Pantalla 3
- [ ] Columna de lectura a 1120px máximo, cuerpo en `body-dense`, ritmo de 64 entre
      secciones editoriales
- [ ] Cada sección tiene `id` estable y la TOC —aún estática, lista de enlaces `#id`—
      funciona con JavaScript desactivado
- [ ] Bloques de notación en `code` mono sobre `surface-sunken`; **sin librería de
      fórmulas** (ver Decisiones)
- [ ] Un método marcado como incompleto muestra el badge `caption` "EN PREPARACIÓN"
      (`warning` / `warning-bg`) y sigue apareciendo en la TOC
- [ ] `npm run build` y `npm run lint` limpios; legible a 375px sin scroll horizontal

**Riesgo:** medio — el volumen de contenido nuevo (traducido a dos idiomas) es la parte
cara, no la técnica. Si el copy no está listo, la slice se cierra con 3 métodos reales y
el resto marcados "EN PREPARACIÓN", que es exactamente para lo que existe ese estado.

---

### S-07 — La Academia se navega como documentación

**Objetivo:** el lector ve en todo momento en qué sección está, salta entre métodos desde
una TOC fija en escritorio o un panel en móvil, y compara algoritmos en tablas reales.

**Depende de:** S-02 (el primitivo `Dialog` ya validado), S-06

Separada de S-06 porque la capa interactiva —observador de scroll, panel móvil, tablas
comparativas con semántica de encabezados— no cabe con la creación de la ruta y el
contenido en una sola sesión.

**Ficheros previstos:**
- `src/components/academy-toc.tsx` (nuevo)
- `src/components/academy-comparison-table.tsx` (nuevo)
- `src/components/views/academy-view.tsx`
- `src/app/globals.css`

**Criterios de aceptación:**
- [ ] TOC fija (sticky, 240–280px) a partir de `lg`; en base/`md` colapsa a un botón
      "Índice" que abre un `Dialog` de Radix con la misma lista
- [ ] El enlace activo se sincroniza con el scroll vía `IntersectionObserver` y se
      comunica con `aria-current="location"`, no solo con color
- [ ] La TOC es `<nav aria-label="…">` traducido en ambos locales
- [ ] Sin JS, los enlaces de la TOC siguen funcionando (no hay regresión frente a S-06)
- [ ] Tablas comparativas: `<table>` real con `<caption>` y `<th scope="col">`; nivel de
      supuestos/complejidad/robustez con `success`/`warning`/`danger` suaves **y** una
      etiqueta de texto (el color nunca es el único portador de significado)
- [ ] La tabla no rompe a 375px: scroll horizontal contenido y anunciado, o
      reorganización a lista — decidido y documentado, no accidental
- [ ] El panel móvil devuelve el foco al botón "Índice" al cerrarse
- [ ] `IntersectionObserver` desconectado al desmontar; nada se rompe con
      `prefers-reduced-motion`

**Riesgo:** medio — el estado activo por scroll es la fuente habitual de parpadeo y de
fugas de observador.

---

### S-08 — La rama se puede desplegar

**Objetivo:** el trabajo deja de vivir solo en local: rama commiteada, build estático
verificado y PR abierto con evidencia.

**Depende de:** S-01 … S-07

Esta slice existe **además** de la migración porque `docs/02-arquitectura.md` lista como
pendiente algo que ninguna slice anterior cubre: el rediseño responsive de 3 niveles se
verifica pantalla a pantalla dentro de S-03/S-04/S-06, pero **el cierre de la rama en sí**
—los 9 ficheros sin commitear, el build limpio, el PR ausente— no es parte de ninguna
pantalla. Es pequeña y mecánica, y por eso mismo es la que se olvida.

**Ficheros previstos:** `docs/tasks.md`, `docs/changelog.md`, `docs/02-arquitectura.md`
(actualizar la sección de estado de rama), `docs/adr/0001-stack.md` (fila de Componentes
y de Estilos, tras S-02)

**Criterios de aceptación:**
- [ ] `npm run build` produce `out/` con las 14 rutas (7 ES + 7 EN) y `npm run lint` pasa
- [ ] `out/` servido en local: navegación, drawer, toggle de tema y Academia funcionan
      sobre ficheros estáticos, no solo en `next dev`
- [ ] Verificación explícita a 375px de las 7 pantallas, en claro y en oscuro
- [ ] Repaso de paridad ES/EN: misma estructura de rutas, mismas entradas de nav, ninguna
      clave de copy huérfana
- [ ] `docs/02-arquitectura.md` deja de listar como "pendiente de verificar" lo ya
      verificado, y la tabla de decisiones refleja Radix en la fila "Componentes"
- [ ] `docs/changelog.md` con una entrada por slice cerrada
- [ ] PR abierto contra `main` con resumen y capturas móvil/escritorio

**Riesgo:** bajo — pero es el único punto donde el trabajo se vuelve reversible y
revisable; sin él, siete slices siguen siendo un directorio local.

---

## Fuera de este plan

Explícitamente no planificado, por No-alcance de `docs/01-brief.md`: backend o API propia,
envío real de formulario o correo transaccional, CMS headless, analítica o error tracking,
cuentas de usuario, blog o publicaciones, i18n dinámico (`next-intl` / segmento
`[locale]`), y suite de tests automatizados. Cualquiera de ellas exige antes un ADR nuevo;
las tres primeras, además, revisar el hosting.

## Nota sobre verificación

Este plan no tiene criterios de "test automatizado" porque el proyecto no tiene suite
configurada y montarla está fuera de alcance. La verificación de cada slice es, por tanto,
explícitamente manual y está enunciada como tal en sus criterios: `npm run build`,
`npm run lint`, e inspección en 375 / 768 / 1280px en ambos modos de color. Ninguna slice
se cierra diciendo "funciona" sin haber ejecutado eso.

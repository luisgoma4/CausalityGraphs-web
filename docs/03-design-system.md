# Sistema de diseño — Causality Graphs

> Fecha: 2026-08-25 · Sustituye cualquier sistema de tokens anterior en `globals.css`.
> Stack: React + Tailwind CSS v4 + primitivos Radix UI. Ver skill `engineering-style`
> (no negociable): color solo en OKLCH por token semántico, espaciado en escala
> estricta de 8px, bordes finos de 1px, sin gradientes decorativos.

## Dirección de marca para este sistema

**Sobrio institucional + técnico denso.** No es un sitio SaaS de captación rápida:
es la superficie de evaluación de una consultora científica que un responsable de
bioestadística de farma revisa antes de coger el teléfono (ver `docs/01-brief.md`).
La referencia no es "landing page bonita", es "documentación técnica de alto nivel
con una capa de marca" — más cerca de una hoja de datos clínica o un paper con buen
maquetado que de una plantilla de agencia.

Inspiración traducida (no copiada) desde `docs/awesome-design-md/design-md/`:

- **ClickHouse** — un único acento de marca que hace todo el trabajo de color
  (aquí: azul institucional, no amarillo), superficies "panel oscuro apenas más
  claro que el canvas" en vez de sombras, cifras/datos destacados con tipografía
  mono, sin degradados decorativos.
- **Linear** — jerarquía construida por tamaño/peso tipográfico y espaciado, no por
  efectos; bordes hairline sistemáticos; densidad alta sin sensación de desorden.
- **ClickHouse + Linear combinados** justifican la decisión de pareja tipográfica
  sans + mono (sección 2) en vez de sans + serif editorial: transmite "ingeniería/
  academia", no "revista de producto".

## 0. Decisión de tipografía — cambio respecto al sitio actual

El sitio actual carga `Manrope` (sans) + `Fraunces` (serif editorial, `--font-display-face`
en `layout.tsx`). Fraunces comunica "boutique premium", no "rigor clínico/técnico denso".

**Decisión:** mantener Manrope como family sans (ya cargada, grotesk humanista con
buen rango de pesos, apta para densidad), **sustituir Fraunces por una mono técnica**
(IBM Plex Mono o JetBrains Mono vía `next/font/google`) para el segundo — y único
otro — papel tipográfico permitido por la regla de "máximo dos familias". La mono se
reserva para: cifras/métricas destacadas, nombres de método/técnica, etiquetas de
tabla, eyebrows, y bloques de "notación" en la página academia.

Esto es un cambio de implementación (no lo ejecuto yo, ver contrato de agente): swap
en `src/app/layout.tsx` de `Fraunces` → `IBM_Plex_Mono` o `JetBrains_Mono`, variable
`--font-mono`. Documentado también en `HALLAZGOS`.

## 1. Rejilla y espaciado — base 8px

Única escala permitida, mapeada a `--spacing-*` de Tailwind v4 en el fichero de tokens:

```
8   16   24   32   40   48   64   80   96   128
```

| Uso | Valor |
|---|---|
| Gap entre elementos inline (icono+texto, chip) | 8 |
| Padding interno de componentes pequeños (badge, input) | 8–16 |
| Padding interno de tarjeta | 24 |
| Gap entre tarjetas en grid | 24 |
| Padding interno de panel grande / sidebar | 32 |
| Separación entre bloques de un formulario | 24–32 |
| Padding vertical de banda de página (hero, sección) — móvil | 48 |
| Padding vertical de banda de página — tablet | 64 |
| Padding vertical de banda de página — escritorio | 96 |
| Ritmo entre secciones editoriales largas (academia) | 64 |
| Máximo salto de layout (sidebar TOC / columna ancha) | 128 |

Gutters de contenedor: móvil 16, tablet 24, escritorio 32. Ancho máximo de contenido
editorial: 1280px (secciones normales), 1120px (columna de lectura densa de
academia, más estrecha a propósito para longitud de línea legible ~75–85 caracteres
en mono/sans a 16px).

Nada fuera de esta escala. Un `gap-3` (12px) o `p-5` (20px) de Tailwind por defecto
está prohibido salvo que se remapee esa clave en `@theme` a un múltiplo de 8.

## 2. Tipografía

Dos familias, máximo permitido:

- **Sans (`--font-sans`)** — Manrope. UI, cuerpo de texto, navegación, botones,
  titulares editoriales.
- **Mono (`--font-mono`)** — IBM Plex Mono / JetBrains Mono (ver decisión §0).
  Cifras destacadas, nombres de técnica/método (`DAG`, `PC-algorithm`,
  `dynamic causal model`), eyebrows/etiquetas en mayúsculas, tablas de datos,
  notación de la página academia, timestamps.

Escala modular ≈ **1.250**, base 16px:

| Token | Tamaño | Interlineado | Peso | Tracking | Familia | Uso |
|---|---|---|---|---|---|---|
| `display` | 56px (clamp 40–56) | 60px (1.07) | 700 | -0.025em | sans | Hero de home únicamente |
| `h1` | 39px (clamp 32–39) | 44px (1.13) | 700 | -0.02em | sans | Título de página |
| `h2` | 31px (clamp 26–31) | 38px (1.23) | 600 | -0.015em | sans | Título de sección |
| `h3` | 25px | 32px (1.28) | 600 | -0.01em | sans | Título de tarjeta / subsección |
| `h4` | 20px | 28px (1.4) | 600 | -0.005em | sans | Título de componente pequeño |
| `body` | 16px | 26px (1.625) | 400 | 0 | sans | Párrafo por defecto |
| `body-dense` | 15px | 24px (1.6) | 400 | 0 | sans | Párrafo denso (academia, tablas) |
| `small` | 14px | 20px (1.43) | 400 | 0 | sans | Texto secundario, ayuda de formulario |
| `caption` | 12px | 16px (1.33) | 600 | 0.06em, mayúsculas | mono | Eyebrow, badge, etiqueta de tabla |
| `data-lg` | 40px | 44px (1.1) | 700 | -0.015em | mono | Cifra/estadística destacada |
| `data-md` | 20px | 26px (1.3) | 600 | 0 | mono | Valor de tabla/métrica en línea |
| `code` | 14px | 22px (1.57) | 400 | 0 | mono | Notación, snippets, nombres técnicos inline |

Principios: los pesos de titular no pasan de 700; el cuerpo se queda en 400/600. La
jerarquía se construye con tamaño + tracking negativo en titulares grandes, no con
más de dos pesos por nivel. `body-dense` existe explícitamente para la página
academia (más texto por pantalla, interlineado algo más cerrado pero ≥1.5 exigido
por WCAG 1.4.8).

## 3. Color — tokens semánticos en OKLCH

Paleta de marca: azul institucional profundo (`primary`, H≈264 — clínico, no
"SaaS azul genérico" por su baja croma y su tono ligeramente violáceo) + un único
acento cálido de cobre/ámbar (`accent`, H≈55–60) reservado para cifras destacadas,
resaltado de aristas del grafo causal y el estado activo de la tabla de contenidos
de academia — nunca para superficies grandes. Esto traduce el patrón "un acento hace
todo el trabajo" de ClickHouse sin heredar su paleta literal.

Todos los valores están definidos en `oklch(L C H)` y resueltos a sRGB para el
cálculo de contraste (ver bloque `CONTRASTE` al final de este documento — ratios
calculados, no estimados, con conversión OKLCH→sRGB estándar de Björn Ottosson).

### Modo claro

| Token | oklch() | Hex resuelto | Uso |
|---|---|---|---|
| `surface` | `oklch(0.98 0.003 250)` | `#f7f9fa` | Fondo de página |
| `surface-raised` | `oklch(1.00 0 0)` | `#ffffff` | Tarjetas, inputs, popovers |
| `surface-sunken` | `oklch(0.955 0.004 250)` | `#eef0f3` | Filas alternas de tabla, fondos de código |
| `text` | `oklch(0.20 0.02 260)` | `#11161f` | Texto principal |
| `text-muted` | `oklch(0.42 0.02 260)` | `#474d58` | Texto secundario |
| `text-inverse` | `oklch(0.98 0.005 250)` | `#f6f9fc` | Texto sobre superficies oscuras/`primary` |
| `border` | `oklch(0.88 0.006 260)` | `#d5d8db` | Divisor decorativo (hairline, no funcional) |
| `border-strong` | `oklch(0.60 0.014 260)` | `#767c86` | Borde funcional de componente (input, botón secundario, tarjeta interactiva) |
| `primary` | `oklch(0.38 0.13 264)` | `#1d3c86` | Acción primaria, enlaces activos, foco de marca |
| `primary-hover` | `oklch(0.32 0.14 264)` | `#0b2978` | Estado hover/pressed de `primary` |
| `primary-fg` | `oklch(0.98 0.005 250)` | `#f6f9fc` | Texto/ícono sobre `primary` |
| `focus-ring` | `oklch(0.55 0.16 264)` | `#406bce` | Anillo de foco visible (todos los interactivos) |
| `accent` | `oklch(0.62 0.16 55)` | `#cc6600` | Cifras destacadas, resaltado de arista del grafo, TOC activo |
| `accent-fg` | `oklch(0.16 0.02 60)` | `#140b05` | Texto sobre `accent` sólido |
| `success` | `oklch(0.40 0.12 150)` | `#005820` | Texto/ícono de éxito sobre `success-bg` |
| `success-bg` | `oklch(0.94 0.035 150)` | `#dcf2df` | Fondo suave de éxito |
| `warning` | `oklch(0.50 0.15 75)` | `#935200` | Texto/ícono de aviso sobre `warning-bg` |
| `warning-bg` | `oklch(0.95 0.045 80)` | `#ffeccd` | Fondo suave de aviso |
| `danger` | `oklch(0.46 0.19 25)` | `#a90017` | Texto/ícono de error sobre `danger-bg` |
| `danger-bg` | `oklch(0.95 0.03 25)` | `#ffe7e4` | Fondo suave de error |

### Modo oscuro (mismos nombres semánticos)

| Token | oklch() | Hex resuelto | Uso |
|---|---|---|---|
| `surface` | `oklch(0.17 0.014 260)` | `#0c1016` | Fondo de página |
| `surface-raised` | `oklch(0.215 0.016 260)` | `#151a21` | Tarjetas, inputs, popovers |
| `surface-sunken` | `oklch(0.135 0.013 260)` | `#06080d` | Filas alternas de tabla, fondos de código |
| `text` | `oklch(0.96 0.006 250)` | `#eff2f6` | Texto principal |
| `text-muted` | `oklch(0.72 0.02 260)` | `#9da5b1` | Texto secundario |
| `text-inverse` | `oklch(0.17 0.014 260)` | `#0c1016` | Texto sobre superficies claras/`primary` |
| `border` | `oklch(0.32 0.02 260)` | `#2d333d` | Divisor decorativo |
| `border-strong` | `oklch(0.50 0.02 260)` | `#767c86` | Borde funcional de componente |
| `primary` | `oklch(0.74 0.135 264)` | `#7fa9ff` | Acción primaria, enlaces activos |
| `primary-hover` | `oklch(0.80 0.12 264)` | `#96bdff` | Estado hover/pressed |
| `primary-fg` | `oklch(0.14 0.02 264)` | `#060911` | Texto/ícono sobre `primary` |
| `focus-ring` | `oklch(0.78 0.14 264)` | `#89b5ff` | Anillo de foco visible |
| `accent` | `oklch(0.78 0.15 60)` | `#fc9e47` | Cifras destacadas, resaltado de arista, TOC activo |
| `accent-fg` | `oklch(0.15 0.02 60)` | `#110904` | Texto sobre `accent` sólido |
| `success` | `oklch(0.74 0.15 150)` | `#5ac576` | Texto/ícono de éxito |
| `success-bg` | `oklch(0.25 0.05 150)` | `#0d2814` | Fondo suave de éxito |
| `warning` | `oklch(0.80 0.15 80)` | `#f0b135` | Texto/ícono de aviso |
| `warning-bg` | `oklch(0.27 0.05 80)` | `#332305` | Fondo suave de aviso |
| `danger` | `oklch(0.74 0.17 25)` | `#ff7a73` | Texto/ícono de error |
| `danger-bg` | `oklch(0.27 0.05 25)` | `#3b1c1a` | Fondo suave de error |

`border` es puramente decorativo (divisores de lista, hairlines entre filas) y no
está sujeto al 3:1 de WCAG 1.4.11 porque no delimita por sí solo un componente
interactivo. Cualquier borde que sea el único indicador del límite de un componente
(input, botón secundario, tarjeta clicable, control de Radix) **debe** usar
`border-strong`, verificado a ≥3:1 contra `surface` en ambos modos (ver tabla de
contraste).

## 4. Modo oscuro — mecanismo

`prefers-color-scheme` por defecto + atributo `data-theme="light"|"dark"` en
`<html>` para override manual (persistido en `localStorage`, sin flash: el atributo
se fija antes de hidratar, en un script inline mínimo en `layout.tsx` — igual patrón
que ya usa `html-lang-setter.tsx` para `lang`). Mismos nombres de token en ambos
modos; solo cambian los valores `oklch()` resueltos en el bloque `:root` /
`[data-theme="dark"]` del fichero de tokens.

## 5. Radios, bordes y sombras

Máximo 3 radios:

| Token | Valor | Uso |
|---|---|---|
| `radius-sm` | 4px | Badges, inputs pequeños, controles de tabla |
| `radius-md` | 8px | Botones, inputs, tarjetas estándar |
| `radius-lg` | 12px | Paneles grandes, diálogos, tarjetas de hero |

Sin radio `pill`/`full` en badges o botones — decisión deliberada frente al sitio
actual (que usa `border-radius: 999px` en chips, botones y el drawer): la esquina
muy redondeada lee como "producto SaaS", no como "ficha técnica". Excepción: avatares
circulares de equipo (`radius-full`, uso puntual, no forma parte de la escala de
componentes).

Bordes: siempre 1px, `border` (decorativo) o `border-strong` (funcional). Nunca 2px+.

Máximo 3 elevaciones, sin sombra decorativa (regla 4 de `engineering-style`):

| Token | Tratamiento | Uso |
|---|---|---|
| `elevation-flat` | Sin borde, mismo `surface` que el fondo | Cuerpo de página, nav, hero |
| `elevation-raised` | `surface-raised` + `border` 1px | Tarjetas, inputs, filas de tabla agrupadas |
| `elevation-overlay` | `surface-raised` + `border-strong` 1px + `shadow-overlay` | Contenido portaled de Radix (`Dialog`, `Popover`, `Tooltip`, `DropdownMenu`) que se superpone a contenido arbitrario |

`shadow-overlay` es la única sombra del sistema y existe por necesidad funcional
(separar un overlay portaled del contenido bajo él), no por decoración de tarjeta:
`0 8px 24px oklch(0.20 0.02 260 / 0.16)` en claro, `0 8px 24px oklch(0 0 0 / 0.48)`
en oscuro. Nunca se usa sombra en tarjetas de contenido en línea de flujo — ahí la
separación es 1px de `border`.

## 6. Movimiento

| Token | Valor |
|---|---|
| `duration-fast` | 150ms — hover, foco, toggles pequeños |
| `duration-base` | 250ms — apertura de menú/popover, acordeón, transición de tab |
| `duration-slow` | 400ms — drawer móvil, diálogo, transición de página |
| `ease-standard` | `cubic-bezier(0.4, 0, 0.2, 1)` — la mayoría de transiciones |
| `ease-emphasized` | `cubic-bezier(0.16, 1, 0.3, 1)` — entradas de overlay/drawer, más "asentado" |

El grafo 3D del hero (`graph-canvas.tsx`) usa velocidad de propagación causal —
lenta a media, nunca rebote — como ya establece `AGENT.md`; sus duraciones internas
de animación no forman parte de esta escala de UI porque no son transiciones CSS,
pero deben respetar el mismo principio de "no bouncy" y el bloque siguiente.

`prefers-reduced-motion: reduce` — obligatorio en todo el sistema:
- Todas las `transition`/`animation` CSS pasan a `0.01ms`, 1 iteración (ya
  implementado en `globals.css` actual, se conserva).
- El grafo 3D detiene animación continua de cámara/nodos y muestra layout estático;
  transiciones de aparición de nodos se sustituyen por aparición instantánea.
- Ningún contenido esencial depende de que la animación se reproduzca — el fallback
  de `graph-error-boundary.tsx` ya garantiza esto para fallo de WebGL; con
  `reduced-motion` el canvas sigue renderizando pero congelado, no cae al fallback.

## 7. Puntos de ruptura — móvil primero

Diseño base a 375px, ampliación progresiva. Se usan los breakpoints por defecto de
Tailwind v4 (sin redefinir `--breakpoint-*`, evita divergencia con utilidades
`sm:`/`md:`/`lg:`/`xl:` estándar):

| Nombre | Ancho | Rol |
|---|---|---|
| base | 0–639px | Diseño de referencia (375px), 1 columna, drawer de nav, TOC de academia colapsada tras botón |
| `sm` | ≥640px | Teléfono grande / tablet en vertical estrecha: 2 columnas en grids de tarjetas cortas |
| `md` | ≥768px | Tablet: nav horizontal si cabe, 2–3 columnas, TOC de academia sigue colapsada u off-canvas |
| `lg` | ≥1024px | Escritorio: layout de 2/3 columnas, TOC de academia fija en sidebar, tablas comparativas a ancho completo |
| `xl` | ≥1280px | Escritorio ancho: ancho máximo de contenido alcanzado (1280 / 1120 lectura densa), sin más columnas, más aire lateral |

Patrón de 3 niveles por componente (mobile base → tablet → desktop), nunca
desktop-first con overrides — ya en curso en la rama `visual-redesign-responsive`,
este sistema lo formaliza como regla, no como parche puntual.

---

# Patrones de pantalla principales

Todas las pantallas comparten: foco visible con `focus-ring` (2px offset 2px,
nunca solo `outline: none`), orden de tabulación = orden DOM/visual (sin `tabindex`
positivo), `alt` descriptivo en toda imagen no decorativa (`alt=""` explícito en
decorativas), `<label>` asociado por `htmlFor`/`id` en todo campo de formulario
(nunca solo `placeholder`), y una región `aria-live="polite"` para anunciar cambios
asíncronos relevantes (envío de formulario, cambio de filtro, fallback del grafo 3D).

## Patrón reutilizable: estado vacío y estado de error

Para no repetirlo en cada pantalla: cualquier lista/colección (works, técnicas,
resultados de filtro, tabla comparativa de algoritmos) usa el mismo componente de
estado vacío y de error:

- **Vacío** — icono lineal simple (`radius-sm`, sin relleno), `h4` + `body` corto
  explicando por qué no hay resultados (p. ej. filtro sin coincidencias) y una
  acción para salir del estado (botón "quitar filtros"). Fondo `surface`, sin
  `border`.
- **Error** — mismo layout, ícono de alerta en `danger`, texto en `text` (no en
  `danger`, para no forzar el color de marca de error sobre párrafos largos),
  botón de reintento si la causa es reintentable (p. ej. WebGL) o enlace de
  contacto si no lo es. Anunciado vía `aria-live="assertive"` en el momento en que
  aparece (a diferencia del resto de cambios, que son `polite`).

---

## Pantalla 1 — Home (`/`, `/en`)

**Propósito:** filtro de 8 segundos — comunicar "esto es una consultora científica
de inferencia causal, seria y capaz" antes de que el visitante decida seguir
leyendo (historia de usuario 1 del brief).

**Jerarquía visual:** el ojo va primero al **titular `display`** ("Prueba causalidad,
no solo correlación" o equivalente de `en.ts`), luego al **grafo 3D animado** a su
derecha (o debajo en móvil) como prueba visual del método, después a la fila de
chips de capacidades (`caption` en mono) y a los dos CTA (`primary` + `secondary`).
Debajo, franja de métricas en `data-lg` mono (credibilidad cuantificada) y tarjetas
de servicio.

**Estructura de maqueta (texto):**

```
[ nav sticky: logo | nav horizontal (lg) / hamburguesa (base) | selector idioma ]
[ hero: eyebrow caption | h(display) | body intro | hero-chip-row | 2 CTA ]
[ hero: graph-frame (3D DAG) — apilado bajo el texto en base, a la derecha en lg ]
[ franja de métricas: 3 data-lg + label caption ]
[ sección: 3 tarjetas de servicio/técnica destacada, elevation-raised ]
[ sección: trust-panel (credenciales/afiliación) ]
[ cta-panel de cierre: invitación a contacto ]
[ footer ]
```

**Estados obligatorios:**

| Estado | Qué ocurre |
|---|---|
| **Cargando** | El grafo 3D se monta de forma asíncrona (WebGL/Three.js). Mientras carga: se muestra un `graph-fallback` estático — la misma composición de nodos/aristas del DAG pero como SVG/CSS estático en `surface-sunken`, sin animación — para que nunca haya un hueco en blanco. El resto del hero (texto, CTA) no depende del 3D y se pinta de inmediato (SSG). Sin spinner sobre el texto: el spinner solo tendría sentido dentro de `graph-frame`, y se sustituye directamente por el fallback estático en vez de un loader, porque el fallback ya es contenido válido. |
| **Vacío** | No aplica en runtime: el contenido de home es 100% estático y tipado (`SiteContent`), una clave ausente es error de compilación, no un hueco visible en producción. Documentado explícitamente en vez de omitido, según instrucción. |
| **Error** | Fallo de WebGL/Three.js (contexto no disponible, excepción de render) → `graph-error-boundary.tsx` sustituye `graph-canvas` por el mismo `graph-fallback` estático usado en "cargando", con un `<figure>`/`aria-live="polite"` que anuncia "Visualización interactiva no disponible; se muestra una versión estática" una sola vez. El texto esencial del hero nunca vive solo dentro del canvas (ya cumplido: `AGENT.md`). |
| **Con datos** | Grafo 3D renderizado e interactivo (rotación/zoom suave si el input lo permite), métricas y tarjetas pobladas desde `SiteContent`. |

**Accesibilidad:** `graph-frame` tiene `role="img"` + `aria-label` describiendo el
grafo ("Grafo causal animado que ilustra variables de tratamiento, confusores y
resultado") cuando es puramente decorativo/no interactivo; si se añade interacción
real (arrastrar nodos), pasa a un componente enfocable con instrucciones de teclado
anunciadas. Orden de tabulación: skip-link → nav → CTA primario del hero → CTA
secundario → resto de la página. Botón "saltar al contenido" visible al enfocar
(actualmente ausente — ver `HALLAZGOS`).

---

## Pantalla 2 — Listado de Works / Techniques (`/works`, `/techniques` + `/en/*`)

**Propósito:** que un investigador o evaluador de proveedores juzgue aplicabilidad
metodológica en formato problema → método → resultado (historias 2–3 del brief).

**Jerarquía visual:** título de página (`h1`) + intro (`body`) primero, luego una
**fila de filtro por categoría/técnica** (chips `caption` mono, no pill —
`radius-sm`), después la rejilla de tarjetas. Dentro de cada tarjeta: índice
(`caption` mono, p. ej. `01 / CASO`), título `h3`, cuerpo `body-dense`, y — en
techniques — una etiqueta de complejidad/madurez usando los tokens semánticos
(`success`/`warning` suaves, nunca color crudo) para señalar rápidamente qué
técnica es más establecida.

**Estructura de maqueta (texto):**

```
[ nav ]
[ hero-band ligero: eyebrow | h1 | page-intro ]
[ fila de filtro: chips de categoría (toggle múltiple, Radix ToggleGroup) ]
[ grid de tarjetas: 1 col (base) → 2 col (sm/md) → 3 col (lg) ]
  [ tarjeta: index caption | h3 | body-dense | meta (etiqueta madurez / sector) ]
[ franja final: CTA a contacto o a la página academia para profundizar en método ]
[ footer ]
```

**Estados obligatorios:**

| Estado | Qué ocurre |
|---|---|
| **Cargando** | El listado en sí es estático (SSG, sin fetch runtime). El único estado de carga real es el filtro client-side: al pulsar un chip, el filtrado es síncrono en memoria y no debería mostrar loader — si en el futuro se pagina o se carga de un índice separado, se usan tarjetas `skeleton` (bloques `surface-sunken` con animación de opacidad respetando `prefers-reduced-motion`) del mismo tamaño que la tarjeta real, nunca layout shift. |
| **Vacío** | Combinación de filtros sin resultados: mensaje "Ningún caso coincide con estos filtros" (patrón reutilizable de arriba) + botón "Quitar filtros". Este es el estado vacío real y significativo de esta pantalla — no se omite. |
| **Error** | No hay llamada de red que pueda fallar en la versión estática actual (contenido embebido en build). Si se introduce un índice de búsqueda cargado por JS en el futuro, error = fallo al cargar ese índice → mismo patrón de error reutilizable, con reintento. Documentado explícitamente como "no aplica hoy" en vez de omitido. |
| **Con datos** | Grid completo de tarjetas con filtro activo (si lo hay) reflejado en el chip seleccionado (`aria-pressed="true"`) y anunciado vía `aria-live="polite"` ("Mostrando 4 de 9 casos"). |

**Accesibilidad:** los chips de filtro son un `ToggleGroup` de Radix (mecánica de
teclado/ARIA ya resuelta por el primitivo, ver §1 de `engineering-style`), navegables
con flechas y `Tab`/`Shift+Tab` para entrar/salir del grupo. Cada tarjeta es un único
elemento enfocable (el título envuelve el enlace completo, no enlaces duplicados
dentro de la tarjeta).

---

## Pantalla 3 — Academia (nueva, `/academia` + `/en/academy` o ruta equivalente)

**Propósito:** página única, técnica y densa, "a modo de academia" — glosario de
métodos causales, comparativas de algoritmos, contenido tipo documentación
académica. Es la pantalla que más se aleja del resto del sitio en densidad: aquí se
premia la lectura larga, no la conversión inmediata.

**Jerarquía visual:** a diferencia de home/works, el ojo no va a un titular grande
sino a la **tabla de contenidos (TOC)** como mapa de navegación — es la primera
decisión que toma el lector ("¿qué sección busco?"). El `h1` de la página es
deliberadamente más contenido (usa `h1`, no `display`) para no competir con la TOC.
Dentro de cada sección: `h2` de método, `body-dense` de explicación, bloques `code`/
`data-md` para notación y tablas comparativas de algoritmos (`<table>` real, no
divs), y una barra de anclas activa sincronizada con scroll.

**Estructura de maqueta (texto):**

```
[ nav ]
[ page-header denso: eyebrow "GLOSARIO METODOLÓGICO" | h1 | page-intro corto ]
[ layout de 2 columnas en lg+ : ]
  [ sidebar TOC fija (sticky, ancho 240–280px): lista de anclas por método,
    estado activo resaltado con accent + borde izquierdo 2px ]
  [ columna de lectura (max-width 1120px, body-dense) : ]
    [ sección por método/algoritmo, cada una con: ]
      [ h2 nombre del método | caption mono con familia (p. ej. "CAUSAL DISCOVERY") ]
      [ body-dense: definición ]
      [ tabla comparativa: columnas Supuestos | Complejidad | Robustez a ruido,
        con celdas usando success/warning/danger suaves para nivel ]
      [ bloque `code`: notación / pseudocódigo si aplica ]
[ en base/md: TOC colapsa a un botón "Índice" que abre un panel Radix (Popover o
  Sheet) con la misma lista de anclas, en vez de sidebar fija ]
[ footer ]
```

**Estados obligatorios** (el cliente pidió explícitamente que se especifiquen los
cuatro, incluso siendo contenido mayormente estático):

| Estado | Qué ocurre |
|---|---|
| **Cargando** | Contenido de texto y tablas es estático (SSG), se pinta de inmediato. El único elemento que puede tardar es el resaltado de sintaxis/notación matemática si se usa una librería cliente (p. ej. KaTeX) para fórmulas: mientras carga, se muestra la notación en texto plano monoespaciado (ya legible, sin salto de layout) en vez de un hueco o spinner. La sincronización TOC↔scroll (IntersectionObserver) tampoco bloquea: hasta que hidrata, los anclas siguen siendo enlaces `#id` funcionales sin JS. |
| **Vacío** | **Explícitamente mínimo, tal como advierte el encargo:** el contenido es estático y tipado, por lo que no hay un "índice vacío" en producción. El único vacío real y con valor de diseño es una **entrada de glosario marcada como incompleta** (método listado en la TOC pero con contenido "en preparación") — se muestra con un badge `caption` "EN PREPARACIÓN" (`warning`/`warning-bg`) en vez de ocultarse, para no romper la TOC ni fingir que el método no existe. |
| **Error** | **Explícitamente mínimo:** no hay llamada de red en la carga de la página. Si una fórmula con KaTeX falla al renderizar, se degrada a texto plano (ya cubierto en "cargando") — no es un estado de error visible aparte, es el mismo fallback. No se diseña un estado de error de página completo porque no hay ninguna operación que pueda fallar tras el build estático. |
| **Con datos** | Vista completa: TOC con estado activo sincronizado al scroll, todas las secciones y tablas comparativas pobladas, notación renderizada. |

**Accesibilidad:** la TOC es una lista `<nav aria-label="Índice del glosario">` con
`<a href="#ancla">`; el estado activo se comunica no solo por color (`accent` +
borde) sino con `aria-current="location"` en el enlace activo. Las tablas
comparativas usan `<th scope="col">`/`<caption>` reales. El panel móvil de TOC es un
`Dialog`/`Sheet` de Radix (foco atrapado, cierre con `Esc`, devuelve el foco al
botón "Índice" al cerrar) — sustituye cualquier drawer hecho a mano; ver
`HALLAZGOS` sobre el drawer de nav actual.

---

## Pantalla 4 — Contacto (`/contact` + `/en/contact`)

**Propósito:** cero fricción para que un visitante cualificado inicie conversación
(historia 5 del brief). Según `docs/02-arquitectura.md`, hoy no hay envío
server-side confirmado — el formulario puede resolver por `mailto:` o quedar
preparado para un proveedor de formularios estático (Formspree y similares) sin
romper el export estático. El diseño cubre ambos casos.

**Jerarquía visual:** el ojo va primero a los **datos de contacto directos**
(email/teléfono, `h2` + `data-md` mono para el propio email/teléfono como si fuera
un dato técnico, no solo texto) porque son la vía de menor fricción; el formulario
es la vía alternativa para quien prefiere estructurar su consulta.

**Estructura de maqueta (texto):**

```
[ nav ]
[ hero-band: eyebrow | h1 "Hablemos de tu estudio" | page-intro ]
[ layout 2 columnas en lg (1.1fr formulario / 0.9fr aside), 1 columna en base : ]
  [ formulario (elevation-raised, padding 32): ]
    [ label+input: nombre | label+input: email | label+select: rol/organización |
      label+textarea: mensaje (full-span) | botón primario "Enviar" ]
  [ aside contacto (elevation-raised, padding 32): ]
    [ h2 "Contacto directo" | data-md email (enlace mailto) | data-md teléfono
      (enlace tel) | lista de redes/afiliaciones si aplica ]
[ footer ]
```

**Estados obligatorios:**

| Estado | Qué ocurre |
|---|---|
| **Cargando** | Al enviar: botón pasa a estado disabled + texto "Enviando…" + icono de progreso indeterminado en `primary-fg` (sin bloquear el resto de la página), campos del formulario quedan `readOnly` durante el envío. Duración de transición del botón: `duration-fast`. |
| **Vacío** | No hay una lista de datos que pueda estar vacía en esta pantalla (los datos de contacto son estáticos y siempre presentes por contrato de tipos). Si en el futuro se añade un módulo "casos recientes" o "miembros del equipo" en el aside, reutiliza el patrón de estado vacío general. Documentado explícitamente. |
| **Error** | Validación de campo: mensaje inline bajo el campo en `danger`, `role="alert"`, el campo obtiene `aria-invalid="true"` y `aria-describedby` apuntando al mensaje; el foco se mueve al primer campo inválido al intentar enviar. Error de envío (si hay backend/servicio externo y falla la petición): banner `elevation-raised` con `border-strong` en `danger`, ícono, texto explicando el fallo y una vía de escape explícita ("o escríbenos directamente a [email]"), anunciado con `aria-live="assertive"`. |
| **Con datos** | Tras envío correcto: el formulario se sustituye por una confirmación (`h3` + `body`, icono `success`) dentro del mismo contenedor, anunciada por `aria-live="polite"` ("Mensaje enviado. Te responderemos en 1–2 días laborables."), sin recargar la página. |

**Accesibilidad:** cada `<input>`/`<select>`/`<textarea>` tiene `<label htmlFor>`
visible (nunca solo `placeholder` como etiqueta — el `contact-form label` actual ya
usa labels, mantenerlo). Orden de tabulación: nombre → email → rol → mensaje →
enviar → (aside) email directo → teléfono. El botón de envío nunca se deshabilita
por "formulario incompleto" de forma silenciosa: siempre es pulsable, y al pulsarse
con campos inválidos dispara la validación descrita arriba (deshabilitar
proactivamente un botón sin explicar por qué es una trampa de accesibilidad).

---

# Verificación de contraste

Todos los ratios calculados sobre el color OKLCH resuelto a sRGB (conversión
estándar Oklab de Björn Ottosson → sRGB con gamma-companding), no estimados.
Umbral WCAG AA: 4.5:1 texto normal, 3:1 texto grande (≥24px o ≥19px bold) y
elementos de interfaz no decorativos.

## Modo claro

| Par | Ratio | Umbral | Resultado |
|---|---|---|---|
| `text` sobre `surface` | 17.10:1 | 4.5:1 | Cumple |
| `text` sobre `surface-raised` | 18.10:1 | 4.5:1 | Cumple |
| `text-muted` sobre `surface` | 7.99:1 | 4.5:1 | Cumple |
| `text-muted` sobre `surface-raised` | 8.46:1 | 4.5:1 | Cumple |
| `primary-fg` sobre `primary` (botón primario) | 9.69:1 | 4.5:1 | Cumple |
| `primary` sobre `surface` (texto de enlace/marca) | 9.69:1 | 4.5:1 | Cumple |
| `border-strong` sobre `surface` (borde funcional) | 3.73:1 | 3:1 | Cumple |
| `accent-fg` sobre `accent` (badge sólido) | 5.07:1 | 4.5:1 | Cumple |
| `accent` sobre `surface` (texto/dato destacado) | 3.62:1 | 3:1 (uso en `data-lg`, texto grande) | Cumple — no usar `accent` en texto <19px bold/24px normal |
| `success` sobre `success-bg` | 7.34:1 | 4.5:1 | Cumple |
| `warning` (`warning-fg`) sobre `warning-bg` | 12.69:1 | 4.5:1 | Cumple |
| `danger` sobre `danger-bg` | 6.62:1 | 4.5:1 | Cumple |
| `text` sobre `success-bg`/`warning-bg`/`danger-bg` (párrafo dentro de badge/alerta) | 15.4 / 15.6 / 15.4 : 1 | 4.5:1 | Cumple |
| Blanco sobre `success`/`warning`/`danger` sólidos (badge invertido) | 8.64 / 6.12 / 7.79 : 1 | 4.5:1 | Cumple |

## Modo oscuro

| Par | Ratio | Umbral | Resultado |
|---|---|---|---|
| `text` sobre `surface` | 17.03:1 | 4.5:1 | Cumple |
| `text` sobre `surface-raised` | 15.60:1 | 4.5:1 | Cumple |
| `text-muted` sobre `surface` | 7.71:1 | 4.5:1 | Cumple |
| `text-muted` sobre `surface-raised` | 7.06:1 | 4.5:1 | Cumple |
| `primary-fg` sobre `primary` (botón primario) | 8.53:1 | 4.5:1 | Cumple |
| `primary` sobre `surface` (texto de enlace/marca) | 8.19:1 | 4.5:1 | Cumple |
| `border-strong` sobre `surface` (borde funcional) | 3.19:1 | 3:1 | Cumple |
| `accent-fg` sobre `accent` (badge sólido) | 9.49:1 | 4.5:1 | Cumple |
| `accent` sobre `surface` (texto/dato destacado) | 9.21:1 | 3:1 / 4.5:1 | Cumple en ambos umbrales |
| `success` sobre `success-bg` | 7.24:1 | 4.5:1 | Cumple |
| `warning` sobre `warning-bg` | 7.98:1 | 4.5:1 | Cumple |
| `danger` sobre `danger-bg` | 6.04:1 | 4.5:1 | Cumple |
| `text` sobre `success-bg`/`warning-bg`/`danger-bg` | 14.0 / 13.5 / 13.7 : 1 | 4.5:1 | Cumple |

Nota: `border` (decorativo, 1.36:1 claro / 1.51:1 oscuro) se documenta como **no
sujeto** al umbral 3:1 porque nunca es el único indicador de un componente
interactivo — ver regla en §3. Si un componente nuevo usa `border` como único límite
de un control, es un defecto de implementación, no una excepción válida de este
sistema.

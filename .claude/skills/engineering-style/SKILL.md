---
name: engineering-style
description: Reglas de estilo de ingeniería no negociables para este proyecto — stack permitido (React + Tailwind v4 + Radix), color solo desde tokens OKLCH semánticos, escala de espaciado estricta de 8px, y un lenguaje visual minimalista de alto contraste sin gradientes genéricos. Úsalo al elegir stack, al definir el sistema de diseño, y al implementar cualquier componente o pantalla.
---

# Reglas de estilo de ingeniería

Estas reglas son restricciones duras del proyecto, no preferencias. `web-architect`
las aplica al elegir stack; `ui-designer` las aplica al definir tokens; `frontend-builder`
las aplica al implementar. Un valor que las incumple no es un hallazgo de estilo: es un
`BLOQUEO` o una reescritura.

## 1. Stack cerrado

Único stack permitido para interfaz: **React + Tailwind CSS v4 + primitivos de Radix UI**
(`@radix-ui/react-*` sin envoltorios de terceros tipo shadcn salvo que el usuario lo pida
explícitamente). Nada de otra librería de componentes, otro framework de CSS, ni CSS-in-JS.

- Cualquier interacción con estado accesible complejo (diálogo, menú, tooltip, acordeón,
  select, tabs, switch) se construye sobre el primitivo Radix correspondiente, no a mano.
  Un drawer, un dropdown o un modal hecho a mano en vez de con Radix es deuda, no una
  elección: anótalo en `HALLAZGOS` si lo encuentras y en `ADR` si hay que migrarlo.
- Radix aporta la mecánica (foco, teclado, ARIA, portal); el estilo sale siempre de
  Tailwind v4 + los tokens de este documento. Nunca de los estilos por defecto del
  primitivo.
- Añadir cualquier dependencia de UI fuera de esta lista requiere justificación explícita
  en el ADR correspondiente — no se instala "porque hace falta rápido".

## 2. Color — solo tokens semánticos en OKLCH

Prohibido cualquier valor de color literal (`hex`, `rgb`, `hsl`, clases de color crudo de
Tailwind como `bg-blue-500`) fuera de la definición de tokens. Todo color se define una
vez en `oklch()` y se consume por su nombre semántico.

- Define la paleta en `@theme` (Tailwind v4) usando `oklch(L C H)` para cada token:
  `surface`, `surface-raised`, `surface-sunken`, `text`, `text-muted`, `text-inverse`,
  `border`, `border-strong`, `primary`, `primary-hover`, `primary-fg`, `focus-ring`,
  `success`/`warning`/`danger`/`info` (+ variantes `-bg` y `-fg`). Mismo conjunto que
  describe la skill `design-tokens`, pero expresado en OKLCH, no en hex.
- OKLCH se elige porque permite ajustar luminosidad (L) sin arrastrar el matiz (H) al
  derivar estados de pasada de ratón, fondos suaves o modo oscuro — ajusta L y C,
  conserva H, y el token se mantiene "el mismo color" perceptualmente.
- Verificación de contraste (regla de `design-tokens` y `web-quality-bar`) sigue siendo
  obligatoria: calcula el ratio sobre el color resuelto, no sobre los parámetros OKLCH.
- Si un componente necesita un color que no está en la paleta, no se improvisa: se
  añade como token nuevo con nombre semántico, o se pide en `BLOQUEOS`.

## 3. Espaciado — escala estricta de 8px

Esto **sustituye** la escala base-4 por defecto de la skill `design-tokens` para este
proyecto. Única escala permitida:

```
8, 16, 24, 32, 40, 48, 64, 80, 96, 128
```

Nada intermedio (nada de 4, 12, 20, 28...). Todo margen, padding, gap o tamaño de icono
sale de esta escala, mapeada a la escala de espaciado de Tailwind (`space-*`, `gap-*`,
`p-*`, `m-*` configurados en `@theme` sobre múltiplos de 8px, no los por defecto de
Tailwind si no coinciden). Un valor a medio camino entre dos pasos de la escala es
siempre un error, no un ajuste fino legítimo.

## 4. Lenguaje visual — minimalista de alto contraste, sin gradientes genéricos

- **Prohibidos los gradientes decorativos genéricos** (fondos degradados tipo SaaS,
  blobs de color, "mesh gradients"). Si hace falta profundidad o énfasis, se logra con
  contraste de valor (claro/oscuro) y espaciado, no con degradados.
- Bordes finos de **1px**, siempre `border-zinc-800/50` (o el token equivalente en la
  paleta semántica del punto 2 si `zinc` no es el token final elegido — pero la
  *opacidad al 50% sobre un borde oscuro fino* es el patrón, no `zinc` en sí si la marca
  usa otra escala neutra). Nunca bordes de 2px+ ni sombras como sustituto de un borde.
- Alto contraste como principio por defecto: superficies casi planas, texto y bordes que
  se leen sin esfuerzo, sin capas de sombra suave para dar "profundidad de tarjeta". La
  jerarquía se construye con tipografía, espaciado (regla 3) y color semántico (regla 2),
  no con efectos.
- Esto no exime del listón de `web-quality-bar` (contraste AA, `prefers-reduced-motion`,
  etc.) — es una restricción adicional sobre el lenguaje visual, no un atajo para saltarse
  accesibilidad.

## Cómo se aplica en cada fase

- **`/web:stack`** — `web-architect` fija React + Tailwind v4 + Radix en la tabla de
  decisiones de `docs/02-arquitectura.md` como la fila "Componentes", con esta skill como
  justificación, salvo que el brief dé una razón concreta para desviarse (en cuyo caso se
  documenta como excepción en el ADR).
- **`/web:design`** — `ui-designer` escribe `docs/03-design-system.md` con la paleta en
  OKLCH y la escala de 8px, no la de 4px por defecto de `design-tokens`.
- **`/web:build`** — `frontend-builder` implementa diálogos/menús/tooltips con primitivos
  Radix, consume solo tokens (nunca clases de color crudo de Tailwind ni valores fuera de
  la escala de 8px), y usa bordes de 1px sin gradientes.
- **`/web:review`** — `code-reviewer` trata un color literal, un valor de espaciado fuera
  de escala, un gradiente decorativo o un componente interactivo hecho a mano en vez de
  con Radix como hallazgo de severidad ALTA, no como preferencia de estilo.

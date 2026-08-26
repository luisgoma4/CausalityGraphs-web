# Estado del proceso — orquestador web

> Fecha: 2026-08-25 · Sesión pausada a petición del usuario para incorporar a un
> diseñador que aportará más herramientas al proceso. Este documento es el punto de
> retoma: léelo antes de continuar en vez de reconstruir el contexto desde la
> conversación.

## Qué es este repo

`CausalityGraphs/site/` — sitio de marketing en Next.js (App Router, TypeScript,
Tailwind CSS v4, React 19) para una consultora de inferencia causal en farma. Ya está
**construido y desplegado** (export estático a GitHub Pages, DNS por Cloudflare). No es
un proyecto nuevo. Detalle completo en `../CLAUDE.md` (raíz de `site/`).

## Qué se instaló y qué hace

Se instaló un **orquestador de agentes** en `.claude/` (ver `.claude/CLAUDE.md`, la
"constitución"): el hilo principal delega todo el trabajo pesado a subagentes y el
estado del proyecto vive en `docs/*.md`, no en la conversación. Fases:

`/web:brief → /web:stack → /web:design → /web:plan → /web:build → /web:verify → /web:review → /web:ship`

Piezas relevantes:

- **Agentes** (`.claude/agents/*.md`): `repo-scout`, `web-architect`, `ui-designer`,
  `frontend-builder`, `backend-builder`, `test-engineer`, `qa-verifier`,
  `code-reviewer`, `docs-librarian`.
- **Skills** (`.claude/skills/*/SKILL.md`): `design-tokens`, `web-quality-bar`,
  `slice-protocol`, y **`engineering-style`** (nueva, ver abajo).
- **Comandos** en `.claude/commands/web/*.md`, uno por fase, más `/web:status`.

## Qué se ha hecho en esta sesión

1. **`CLAUDE.md`** de `site/` reescrito con la arquitectura real (i18n manual
   duplicado ES/`en/`, modelo de contenido tipado, componente 3D del héroe, deploy
   estático). Cambio sin commitear.

2. **Backfill de `docs/`** — los ficheros `01-brief.md`, `02-arquitectura.md` y
   `docs/adr/0001-stack.md` eran plantillas vacías pese a que el sitio ya existe.
   Se rellenaron con la realidad actual (no con un producto inventado). Estado: escritos,
   sin commitear.

3. **Nueva skill `engineering-style`** (`.claude/skills/engineering-style/SKILL.md`) con
   las reglas de estilo de ingeniería que pidió el usuario, y cableada en:
   - `web-architect.md` — el stack de interfaz es una restricción dada, no una opción.
   - `ui-designer.md` — sustituye la escala base-4/hex por defecto de `design-tokens`
     por 8px/OKLCH en este proyecto.
   - `frontend-builder.md` — la lee antes de implementar; si copia un componente que la
     incumple, lo anota en `HALLAZGOS` en vez de propagarlo.
   - `code-reviewer.md` — nueva categoría 6 de hallazgos (severidad ALTA).
   - `.claude/CLAUDE.md` — Regla 8, resumen + puntero a la skill.

   **Reglas fijadas:**
   - Interfaz solo con React + Tailwind CSS v4 + primitivos de Radix UI. Ninguna otra
     librería de componentes sin justificar en un ADR.
   - Color solo por tokens semánticos definidos en `oklch(L C H)`. Prohibido
     hex/rgb/hsl o clases de color crudo de Tailwind fuera de la definición de tokens.
   - Espaciado en escala estricta de 8px: `8, 16, 24, 32, 40, 48, 64, 80, 96, 128`.
   - Lenguaje visual minimalista de alto contraste: bordes finos de 1px
     (`border-zinc-800/50` o el token neutro equivalente), sin gradientes decorativos
     genéricos.

## Estado real del código (importante, no confundir con lo de arriba)

El código **actual no cumple** las reglas de `engineering-style` todavía:

- El drawer móvil está hecho a mano en CSS/estado (se probó Flowbite Drawer, se quitó
  por no renderizar bien) — no usa Radix.
- No se ha verificado si los colores actuales están en hex o en OKLCH.
- Espaciado actual no auditado contra la escala de 8px.

Además, la rama `visual-redesign-responsive` (rama activa, sin PR abierto) tiene
cambios sin commitear y **sin build ni lint verificados en esta sesión**:
`src/app/globals.css`, `src/app/layout.tsx`, `src/components/graph-hero.tsx`,
`src/components/views/home-view.tsx`, `src/lib/content/{en,es,types}.ts`.

## Decisiones que quedaron abiertas (pendientes de responder al retomar)

1. **Alcance de `engineering-style` sobre lo ya existente** — ¿se aplica solo hacia
   adelante (lo nuevo cumple, lo viejo se anota como deuda) o se abre una slice para
   migrar ya el drawer/colores/espaciado actuales? Sin decidir.
2. **Verificación de la rama actual** — falta ejecutar `npm run build` y `npm run lint`
   sobre `visual-redesign-responsive` antes de commitear nada. Sin hacer.
3. **`/contact`** — el backfill no pudo confirmar si el formulario envía de verdad o
   solo muestra datos estáticos (email/teléfono). Quedó como suposición explícita en
   `docs/01-brief.md`, no como hecho verificado.
4. **Paridad estructural ES/EN** — no hay ningún mecanismo que fuerce que una página
   nueva se replique en ambos árboles de rutas (`src/app/**` y `src/app/en/**`); solo el
   tipo `SiteContent` fuerza paridad de *contenido*, no de *rutas*. Riesgo anotado, sin
   resolver.

## Próximo paso natural al retomar

Con el diseñador ya incorporado, el siguiente comando del pipeline es `/web:design`
(Fase 2) — `ui-designer` define `docs/03-design-system.md` con la dirección visual que
aporte el diseñador, ya sujeta a las reglas de `engineering-style` (OKLCH, 8px, Radix,
sin gradientes). Antes de lanzarlo, decide los tres puntos pendientes de arriba, sobre
todo el alcance de migración (punto 1), porque determina si `ui-designer` diseña solo
para lo nuevo o también especifica la migración de lo existente.

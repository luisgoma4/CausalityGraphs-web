# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # dev server at http://localhost:3000
npm run build    # production build (webpack, static export to out/)
npm run start    # serve a production build
npm run lint     # eslint
```

No test suite is configured. `npm run build` uses `--webpack` explicitly (not Turbopack) — see `AGENTS.md`/`node_modules/next/dist/docs/` before changing build tooling, since this Next.js version (16.2.1) may differ from training-data assumptions.

## Architecture

Next.js App Router, TypeScript, Tailwind CSS v4, React 19. Deployed as a **static export** (`output: "export"` in `next.config.ts`) to GitHub Pages via the repo-root `.github/workflows/deploy.yml`; Cloudflare handles DNS. Do not add server-only Next.js features (route handlers with dynamic behavior, middleware requiring a runtime, etc.) without discussing hosting implications — they will break the static export.

### i18n: manually duplicated routes, not next-intl/App Router locale segments

There is no `[locale]` dynamic segment. Spanish is the default at the root paths (`/`, `/about`, `/contact`, `/team`, `/techniques`, `/works`), and English is a **parallel, manually duplicated route tree** under `src/app/en/**` (`/en`, `/en/about`, ...). Each pair of pages (e.g. `src/app/contact/page.tsx` and `src/app/en/contact/page.tsx`) is a thin wrapper that calls `getContent("es")` / `getContent("en")` and renders the same shared view component from `src/components/views/`, passing locale-appropriate hrefs (e.g. `contactHref="/contact"` vs `contactHref="/en/contact"`) as props — internal links are not derived automatically from locale.

When adding a page or changing nav/link structure, **both trees must be updated in lockstep** — there is no shared routing logic that keeps them in sync. `HtmlLangSetter` (`src/components/html-lang-setter.tsx`) fixes up `<html lang>` client-side since the root layout hardcodes `lang="es"`.

### Content model

`src/lib/content/types.ts` defines `SiteContent`, one big type covering every user-facing string on the site, grouped by page/section. `src/lib/content/es.ts` and `en.ts` each implement the full type — a missing translation key is a type error, not a silent fallback. `src/lib/content/index.ts` exposes `getContent(locale)`. Prefer editing copy here over hardcoding strings in JSX; page components should stay thin (content + locale-specific hrefs in, JSX out).

### Views vs. pages vs. shell

- `src/app/**/page.tsx` — one per route per locale; only wires `getContent(locale)` + hrefs into a view.
- `src/components/views/*-view.tsx` — the actual page implementation, shared across both locale trees, taking `content: SiteContent` as a prop.
- `src/components/site-shell.tsx` — shared hero band + footer wrapper used by (most) views.
- `src/components/site-header.tsx` — nav + language switcher + mobile drawer (hand-rolled CSS/state, not a component library — Flowbite was tried and removed; see git history if reintroducing a drawer library).

### Contact form (Web3Forms)

`src/components/contact-form.tsx` is the only interactive form on the site. It is a
client component that takes `SiteContent` and posts to Web3Forms from the browser —
there is no backend, and there cannot be one under static export.

Two things about it are load-bearing and easy to break:

- **The access key is inlined at build time** from `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY`
  (`.env.local` locally, the `WEB3FORMS_ACCESS_KEY` repo secret in CI, wired into the
  build step's `env:`). It is not read at runtime. If it is missing the component
  throws during a production build on purpose, rather than shipping a form that
  answers "sent" and drops every message — which is exactly what happened once.
- **The `botcheck` honeypot must stay `display: none`.** Not `.sr-only`: that leaves
  the input rendered and in the accessibility tree, where browser autofill can put a
  value in it, and any value makes Web3Forms silently discard the submission while
  still answering `success: true`.

All of its user-facing strings — labels, placeholders, and the sending/success/error
states — come from `content.contact.form`, so a missing translation is a type error.
See `../incidencias.md` (INC-001) for the full history.

### 3D hero graph

`src/components/graph-hero.tsx` (thin wrapper) + `src/components/graph-canvas.tsx` (the actual DAG/network visual, built on `@react-three/fiber` + `@react-three/drei`/`three`) render the site's signature animated node-link visual. `src/components/graph-error-boundary.tsx` wraps it so a WebGL/Three.js failure degrades gracefully instead of crashing the page. Respect `prefers-reduced-motion` and keep essential text out of canvas-only rendering — see the design brief below.

### Design/brand direction

`AGENT.md` at the repo root (one level up, `CausalityGraphs/AGENT.md`) is the design brief: brand positioning (scientific, premium, pharma/clinical research consultancy), visual language (DAG/node-link motifs, deep navy + teal/cyan accents, restrained 3D and motion), content architecture, and quality bar. Treat it as the source of truth over generic "modern SaaS site" defaults — avoid plain centered heroes, icon-grid cards, flat layouts; motion should read as causation/propagation (smooth, slow-to-medium tempo, not bouncy).

The site is being reworked mobile-first (see `visual-redesign-responsive` branch): components use a 3-tier responsive pattern (mobile base → tablet → desktop breakpoints) rather than desktop-first with mobile overrides.

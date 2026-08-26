# Arquitectura

> Fecha: 2026-08-25 · ADR relacionado: docs/adr/0001-stack.md
> Documento reconstruido a posteriori: describe decisiones ya tomadas e implementadas, no una propuesta.

## Clasificación del producto

**Sitio de contenido** — SEO relevante para captación B2B, contenido casi estático (copy centralizado y tipado, sin datos mutables en runtime), interactividad limitada al visual 3D del hero y a navegación/menú móvil. No hay sesión de usuario, no hay estado de servidor mutable. Sesgo por defecto correcto: generación estática, mínimo JS de cliente salvo donde el visual DAG lo requiere.

## Tabla de decisiones

| Decisión | Elegido | Por qué | Alternativa descartada | Coste de revertir |
|---|---|---|---|---|
| Renderizado | Next.js App Router con `output: "export"` (export estático, sin servidor Next en producción) | Sitio de contenido sin estado de servidor; permite hosting gratuito en GitHub Pages con Cloudflare solo para DNS | SSR/ISR con Next en un runtime con servidor (Vercel, Node) | Medio — quitar `output: "export"`, mover hosting fuera de GitHub Pages, revisar cualquier uso de APIs no compatibles con export (route handlers dinámicos, middleware con runtime) |
| Enrutado | Ficheros duplicados por locale (`src/app/**` para ES, `src/app/en/**` para EN), sin librería de i18n ni segmento `[locale]` dinámico | Con export estático, un `[locale]` dinámico exige generar rutas estáticas para cada locale via `generateStaticParams`; la duplicación manual evita esa capa de indirección para solo 2 idiomas y 6 páginas | `next-intl` o segmento `[locale]` con `generateStaticParams` | Alto — migrar exige reescribir el árbol de rutas, introducir negociación de idioma, y re-cablear todos los `href` internos que hoy están construidos a mano en cada página |
| Datos y persistencia | Ninguno — contenido estático tipado en `src/lib/content/{es,en}.ts`, implementando el tipo `SiteContent` de `types.ts` | No hay contenido mutable en runtime; una clave de copy que falta es error de compilación, no fallback silencioso — máxima seguridad para un sitio de marketing sin CMS | CMS headless (Sanity, Contentful) o MDX | Bajo-medio — introducir un CMS no rompe el export estático (se puede seguir generando en build time), pero exige reescribir la capa de contenido y el flujo de publicación |
| Autenticación | Ninguna | No hay áreas privadas ni cuentas de usuario en el alcance del producto | — | N/A — añadirla implicaría runtime de servidor, incompatible con export estático puro |
| Estado de servidor | Ninguno (no hay fetch a APIs externas en build ni en runtime, más allá de lo verificado) | Contenido 100% estático incluido en el bundle | — | N/A |
| Estado de cliente | Local a componentes vía `useState`/hooks de React (p. ej. estado abierto/cerrado del drawer móvil en `site-header.tsx`, animación del canvas 3D) | Complejidad de estado mínima; no hay necesidad de una librería de estado global | Zustand/Redux u otra librería de estado global | Bajo — el estado es local y aislado por componente |
| Estilos | Tailwind CSS v4 con tokens propios en `@theme` (`globals.css`), incluyendo tokens de color de línea/paleta añadidos en la rama de rediseño | Alineado con el brief de marca (`AGENT.md`): azul marino profundo + acentos teal/cian como tokens reutilizables en vez de valores mágicos dispersos | CSS Modules puro, styled-components, otro framework de utilidades | Bajo-medio — Tailwind es solo capa de utilidades sobre CSS estándar; migrar exige reescribir clases pero no la estructura de componentes |
| Componentes | Hechos a mano (sin librería de componentes UI de uso exhaustivo); drawer móvil con `@radix-ui/react-dialog` tras probar y descartar Flowbite Drawer (no renderizaba bien) | Drawer necesita control fino sobre focus trap + scroll-lock + estilos sobre tokens del sistema; Radix Dialog proporciona accesibilidad nativa y portales transparentes con export estático | Flowbite Drawer, shadcn/ui completo | Bajo — Dialog de Radix es un componente accesible aislado; el resto de UI es CSS/React a mano como previamente |
| Formularios y validación | No hay formulario con submit real verificado en este barrido (contacto se resuelve con datos estáticos: email/teléfono) | Sin backend no hay a dónde enviar un submit; export estático no puede procesar server-side | Formspree/Netlify Forms u otro servicio de terceros para formularios estáticos | Bajo si se añade un servicio externo (solo JS de cliente); requiere decidir explícitamente qué proveedor |
| Correo | No implementado | Sin backend para procesar envíos | Servicio transaccional (Resend, SendGrid) detrás de un formulario | Medio — exige backend o servicio de terceros nuevo, y gestión de secretos (no hay hoy) |
| Trabajos en segundo plano | No aplica | Sitio sin trabajos asíncronos ni colas | — | N/A |
| Observabilidad | No confirmada en este barrido (sin analítica ni error tracking visto en el código revisado) | Fuera del alcance verificado; no se ha auditado explícitamente | Google Analytics, Plausible, Sentry | Bajo — cualquiera de estas es JS de cliente añadido, compatible con export estático |
| Despliegue | GitHub Pages, build vía `.github/workflows/deploy.yml` en la raíz del repo (un nivel por encima de `site/`), DNS gestionado por Cloudflare (ver `CNAME`) | Gratuito, sin servidor que mantener, adecuado para un sitio de contenido estático | Vercel, Netlify | Medio — mover a Vercel/Netlify es sencillo técnicamente (ambos soportan Next nativo) pero exige gestionar de nuevo el DNS en Cloudflare y decidir si se conserva el export estático o se aprovecha SSR |

## Estructura de carpetas

```
site/
├── src/
│   ├── app/
│   │   ├── page.tsx                # / (home, ES)
│   │   ├── about/page.tsx          # /about (ES)
│   │   ├── academia/page.tsx       # /academia (ES, nuevo en S-06)
│   │   ├── contact/page.tsx        # /contact (ES)
│   │   ├── team/page.tsx           # /team (ES)
│   │   ├── techniques/page.tsx     # /techniques (ES)
│   │   ├── works/page.tsx          # /works (ES)
│   │   ├── en/
│   │   │   ├── page.tsx            # /en (réplica EN de home)
│   │   │   ├── about/page.tsx
│   │   │   ├── academy/page.tsx    # /en/academy (EN, nuevo en S-06)
│   │   │   ├── contact/page.tsx
│   │   │   ├── team/page.tsx
│   │   │   ├── techniques/page.tsx
│   │   │   └── works/page.tsx
│   │   ├── layout.tsx              # layout raíz, lang="es" hardcodeado, HtmlLangSetter cliente
│   │   └── globals.css             # tokens Tailwind v4 (@theme) con design-tokens
│   ├── components/
│   │   ├── site-shell.tsx          # hero band + footer compartido, skip-link con tabIndex={-1}
│   │   ├── site-header.tsx         # nav + selector idioma + drawer móvil (Radix Dialog) + toggle tema
│   │   ├── theme-toggle.tsx        # toggle claro/oscuro (nuevo S-05)
│   │   ├── html-lang-setter.tsx    # corrige <html lang> en cliente
│   │   ├── graph-hero.tsx          # wrapper del visual 3D
│   │   ├── graph-canvas.tsx        # escena DAG en @react-three/fiber
│   │   ├── graph-error-boundary.tsx # fallback accesible con aria-live
│   │   ├── academy-toc.tsx         # TOC sticky/modal para Academia (nuevo S-07)
│   │   ├── academy-comparison-table.tsx  # tabla comparativa PC/GES/LiNGAM (nuevo S-07)
│   │   └── views/
│   │       ├── home-view.tsx       # home con main-content#tabIndex={-1}
│   │       ├── academy-view.tsx    # Academia con lectura-column y métodos (nuevo S-06)
│   │       └── *-view.tsx          # otras páginas, compartidas ES/EN
│   └── lib/
│       └── content/
│           ├── types.ts            # tipo SiteContent + AcademyMethod (ampliado S-06)
│           ├── es.ts               # implementación ES con sección academy
│           ├── en.ts               # implementación EN con sección academy
│           └── index.ts            # getContent(locale)
├── public/                          # activos estáticos
├── next.config.ts                   # output: "export", trailingSlash: true
└── (repo root, un nivel arriba) .github/workflows/deploy.yml
```

## Modelo de datos

No hay entidades persistentes ni base de datos. El único "modelo de datos" es el tipo `SiteContent` (`src/lib/content/types.ts`): un árbol tipado por sección de página (`nav`, `home`, `about`, `techniques`, `works`, `team`, `contact`, `academy`, `footer`, ...) con subtipos reutilizables (`NavItem`, `Seo`, `MetricCard`, `ServiceCard`, `TechniqueCard`, `CaseStudy`, `DetailedTechnique`, `TeamMember`, `ContactDetail`, `AcademyMethod`). Nueva en S-06: `AcademyMethod` (`{ id: string, name, status: "disponible" | "en-preparacion", summary, body: Paragraph[] | CodeBlock[] }`). Cada locale (`es.ts`, `en.ts`) es una implementación completa de ese tipo — el compilador de TypeScript hace de esquema de validación, garantizando que métodos "en-preparacion" con cuerpo vacío siguen tipados correctamente.

## Flujos críticos

**Selección de idioma:** el usuario cambia de idioma vía el selector en `site-header.tsx`, que enlaza a la ruta equivalente en el otro árbol (p. ej. `/techniques` ↔ `/en/techniques`). No hay redirección automática por cabecera `Accept-Language` ni cookie de preferencia — cada página conoce su propio locale de forma estática en build time (`getContent("es")` / `getContent("en")` cableado en el `page.tsx` correspondiente).

**Contacto:** el visitante llega a `/contact` (o `/en/contact`) y actúa sobre datos estáticos (email/teléfono) — no hay validación de formulario ni envío server-side que documentar como flujo crítico, salvo que se confirme lo contrario revisando `contact-view.tsx` directamente.

## Límites y supuestos operativos

- Volumen esperado: bajo/medio, tráfico B2B de evaluación de proveedores, no consumo masivo (supuesto, no medido).
- Concurrencia: no aplica en el sentido tradicional — el sitio es HTML/CSS/JS estático servido por GitHub Pages/CDN de Cloudflare, sin backend que pueda saturarse.
- Tamaño máximo de subida: no aplica, no hay subida de ficheros por parte del usuario.
- Retención de datos: no aplica, no se capturan datos de usuario en servidor.

---

## Proceso de verificación

**Nota de proceso:** La rama usa un modelo de verificación diferido. Cada slice es marcada como "hecho" en base a que su builder verifique `npm run build` + `npm run lint` al cerrar la slice, pero la verificación visual y de accesibilidad exhaustiva (375px, 1280px, claro, oscuro, navegación por teclado, contraste AA) ocurre una sola vez al final del proyecto en **S-08**, no slice a slice. Esto acelera la iteración en S-01…S-07 y centraliza la auditoría final en un solo punto de verificación. Cualquier regresión visual o de accesibilidad encontrada en S-08 requiere iterar en la slice correspondiente.

## Estado de la rama `visual-redesign-responsive` — cerrada (2026-08-26)

Esta rama (completada, sin PR abierto) implementa un rediseño mobile-first con 7 slices de contenido cerradas:

**Decidido, implementado y verificado:**
- Patrón responsive de 3 niveles (móvil base → tablet → escritorio) en lugar de desktop-first con overrides, tocando `globals.css`, `layout.tsx`, `graph-hero.tsx` y `home-view.tsx`.
- Menú móvil tipo drawer con `@radix-ui/react-dialog` (antes CSS/estado manual) — se probó Flowbite Drawer primero y se descartó por no renderizar correctamente; decisión documentada en `docs/adr/0002-radix-dialog-drawer.md`.
- i18n ES/EN: árbol `src/app/en/**`, `src/lib/content/{en,es,types}.ts`, selector de idioma en header, paridad ES/EN verificada en rutas, nav y copy.
- Tokens de color de línea (border, border-strong, etc.) añadidos a `@theme` en Tailwind (`globals.css`), alineados con la paleta navy/teal/cian del brief.
- Nueva sección Academia (`/academia`, `/en/academy`) con 5 métodos de causal discovery (PC, GES, LiNGAM disponibles; FCI, do-calculus, mediación en-preparacion), TOC estática funcional sin JS, tabla comparativa real.
- Skip-link fix (WCAG 2.4.1): `tabIndex={-1}` añadido a `#main-content` en `site-shell.tsx` y `home-view.tsx` (hallazgo en verificación e2e de S-07: foco no saltaba al activar skip-link).

**Verificado al cierre (2026-08-26):**
- `npm run build` genera `out/` con 17 rutas (8 ES + 8 EN + /_not-found); `npm run lint` pasa sin errores.
- Verificación funcional/accesibilidad vía Playwright headless contra export estático: skip-link (primer tabulable, mueve foco), drawer (atrapa foco, `Esc` cierra, foco devuelto), toggle tema (persiste sin destello), TOC Academia (IntersectionObserver + `aria-current`), tabla comparativa (legible a 375px sin scroll horizontal).
- Paridad ES/EN en rutas, nav, contenido tipado confirmada.
- Build estático sin hidratos errors, navegación sin JS (TOC Academia funciona con anclas puras).

**Nota:** Verificación de 375px fue vía Playwright headless (interacción/accesibilidad), no captura visual manual con navegador; PR abierto no requerido para cierre de rama local.

---

## Deuda técnica no resuelta (anotada para futura iteración)

Anotada durante S-01…S-08, fuera del alcance de esta rama:

1. **`.brand-dot` decorativo (S-01):** Usa `radius-full` como decoración en el cascarón (no es avatar de usuario). Fuera de la escala documentada de radios (`--radius-sm/md/lg`). Decidir si estandarizar a `--radius-md` o documentar explícitamente que `radius-full` está permitido para decoración.

2. **`.contact-form input` padding (S-04):** No es exactamente escala 8px tras normalización. Verificar si es deliberado para UI de control específico o si requiere normalización futura.

3. **Auditoría de accesibilidad/rendimiento automatizada (S-08):** Ausencia de `@axe-core/playwright` o Lighthouse en CI. Verificación actual es funcional/Playwright headless manual; recomendar introducir pruebas automatizadas de accesibilidad (WCAG 2.1 AA) y auditoría de rendimiento (Lighthouse Core Web Vitals).

4. **Playwright como devDependency (S-08):** No está formalmente instalado en `package.json` devDependencies. Se usó ad-hoc vía `npx` en verificación de S-02 y S-07. Decidir si formalizarlo como dependencia para CI o mantener como herramienta manual de verificación.

5. **npm audit: 7 vulnerabilidades sin auditar (S-08):** `npm audit` reporta 1 low y 6 high. No investigadas en detalle; requiere revisión antes de despliegue a producción. Ejecutar `npm audit` y priorizar por impacto en export estático y dependencias de build.

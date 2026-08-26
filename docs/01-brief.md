# Brief — Causality Graphs (sitio web de marketing)

> Estado: reconstruido a posteriori a partir del sitio ya construido y desplegado · Fecha: 2026-08-25

## Problema

Los equipos de farma/clínica que evalúan un partner de inferencia causal (DAGs, modelos causales dinámicos) para estudios difíciles —diseños de un solo brazo, controles limitados, no doble ciego— no tienen forma de evaluar rápidamente la credibilidad científica y metodológica de Causality Graphs antes de contactar. El sitio existe para resolver ese primer filtro: comunicar rigor y capacidad técnica lo bastante rápido como para generar una llamada o un email cualificado.

## Usuarios

| Perfil | Contexto de uso | Qué necesita conseguir |
|---|---|---|
| Responsable de bioestadística / R&D en farma | Escritorio, sesión de evaluación de proveedores, a veces revisita en móvil | Entender qué técnicas usa la consultora y si aplican a su diseño de estudio |
| Investigador clínico / traslacional | Escritorio, buscando referencias metodológicas | Ver casos de uso concretos (problema → método → resultado) |
| Responsable de evidencia regulatoria | Escritorio, evaluación rápida | Confirmar credibilidad del equipo y datos de contacto directos |
| Visitante angloparlante | Cualquier dispositivo | Poder leer el sitio completo en inglés, con paridad de contenido |

Escritorio es el contexto principal (evaluación de proveedores B2B), pero el sitio se usa y se navega también en móvil — de ahí el rediseño mobile-first en curso.

## Historias de usuario

Ya servidas por las páginas existentes:

1. Como responsable de R&D, quiero ver en la home una propuesta de valor clara y un elemento visual que comunique "grafos causales" para decidir en segundos si sigo leyendo.
2. Como investigador, quiero una página de técnicas que explique el catálogo metodológico (DAGs, modelos dinámicos, razonamiento contrafactual, etc.) en lenguaje serio pero comprensible.
3. Como evaluador de proveedores, quiero ver casos de trabajo (works) en formato problema → método → resultado para juzgar aplicabilidad a mi caso.
4. Como visitante, quiero conocer al equipo (team) para evaluar credibilidad antes de contactar.
5. Como visitante cualificado, quiero una página de contacto simple con email/teléfono y sin fricción para iniciar conversación.
6. Como visitante angloparlante, quiero navegar el sitio completo en inglés (`/en/**`) con el mismo contenido y estructura que la versión en español.
7. Como visitante en móvil, quiero un menú de navegación utilizable (drawer) y un layout que no se rompa en pantallas pequeñas.

## Criterios de aceptación del producto

Observables en el sitio actual:

- [x] Existen las 6 páginas: inicio (`/`), técnicas (`/techniques`), casos (`/works`), sobre nosotros (`/about`), equipo (`/team`), contacto (`/contact`) — y su réplica completa bajo `/en/**`.
- [x] Cada página en español tiene su equivalente en inglés con el mismo contenido tipado (una clave de copy que falta es error de compilación, no un fallback).
- [x] La home incluye un hero con visual 3D de grafo DAG animado (`graph-hero.tsx` / `graph-canvas.tsx`), con fallback si WebGL falla (`graph-error-boundary.tsx`).
- [x] El sitio compila como export estático (`next build` → `out/`) y se sirve desde GitHub Pages con dominio propio vía Cloudflare.
- [x] Existe un selector de idioma en la navegación y un `<html lang>` corregido en cliente (`html-lang-setter.tsx`) porque el layout raíz fija `lang="es"`.
- [ ] *(en curso, rama `visual-redesign-responsive`, sin commitear)* El sitio no se rompe en 375px de ancho y usa un patrón de 3 niveles responsive (móvil → tablet → escritorio) en vez de desktop-first con overrides.

## No-alcance

La sección más valiosa del documento — qué NO cubre el sitio hoy y no debe asumirse como pendiente accidental:

- Sin backend ni API propia: no hay route handlers dinámicos, no hay base de datos, no hay CMS. Todo el copy vive tipado en `src/lib/content/{es,en}.ts`.
- Sin formulario de contacto funcional server-side: contacto se resuelve por datos estáticos (email/teléfono), no por un formulario que envíe correo o persista leads (no hay envío de correo, no hay backend para procesarlo).
- Sin cuentas de usuario, login ni áreas privadas.
- Sin blog, insights, publicaciones ni FAQ — mencionados como "páginas futuras opcionales" en `AGENT.md` pero no implementados.
- Sin i18n dinámico (`next-intl`, segmentos `[locale]`, negociación de idioma por cabecera): el bilingüismo es una duplicación manual de rutas mantenida a mano.
- Sin CMS headless ni edición de contenido sin tocar código — cualquier cambio de copy es un PR.
- Sin analítica ni observabilidad configurada explícitamente en el código revisado (no confirmado si existe algo a nivel de GitHub Pages/Cloudflare; no verificado en este barrido).
- Sin tests automatizados (no hay suite configurada).

## Restricciones

- Plazo: sin plazo formal — desarrollo continuo por iteración de marca/diseño.
- Presupuesto: no aplica (proyecto de marketing propio, sin partida documentada).
- Idiomas: español (raíz) e inglés (`/en/**`), paridad completa obligatoria por el sistema de tipos.
- Normativa: sin gestión de datos personales de usuarios (no hay formularios que capturen PII en servidor); no se ha auditado accesibilidad ni RGPD explícitamente en este barrido.
- Integraciones obligatorias: ninguna de terceros en tiempo de ejecución (no hay CMS, no hay analytics SDK confirmado, no hay proveedor de email).
- Debe seguir siendo compatible con **export estático** (`output: "export"`) porque el despliegue es GitHub Pages + Cloudflare DNS — cualquier feature que requiera un runtime de servidor (middleware, route handlers dinámicos, ISR) rompe el despliegue actual y no puede introducirse sin decidir explícitamente un cambio de hosting.
- Quién mantendrá esto: el propio desarrollador/diseñador del proyecto (sin equipo dedicado documentado).

## Suposiciones

Marcadas como tales, no como hechos — no verificadas exhaustivamente en este barrido:

- Se asume que no hay analítica de tráfico configurada (no se ha revisado `layout.tsx` línea a línea buscando scripts de terceros más allá de lo leído).
- Se asume que el volumen de tráfico es bajo/medio (sitio de marketing B2B especializado, no consumo masivo) — sin datos reales que lo confirmen.
- Se asume que el formulario de contacto (si existe visualmente en `/contact`) es solo `mailto:`/enlaces directos y no un submit real, dado que no hay backend — pendiente de confirmar leyendo `contact-view.tsx` si se necesita precisión total.

## Riesgos

| Riesgo | Impacto | Mitigación |
|---|---|---|
| La rama `visual-redesign-responsive` tiene cambios sin commitear y sin build verificado | Posible regresión visual o de build al desplegar | Verificar `npm run build` limpio antes de abrir PR; ver sección de estado de rama en `docs/02-arquitectura.md` |
| Mantenimiento manual de dos árboles de rutas (`es`/`en`) sin mecanismo que fuerce sincronía estructural (solo de copy vía tipos) | Deriva de estructura entre idiomas si se añade una página sin replicarla | Checklist de PR: toda página nueva se crea en ambos árboles a la vez |
| Dependencia de export estático limita features futuras (formularios server-side, CMS) | Bloquea evolución hacia sitio con backend sin migrar hosting | Documentado en ADR 0001 como coste de revertir conocido |

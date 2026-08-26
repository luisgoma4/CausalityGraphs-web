# ADR 0002 — Radix `Dialog` para el menú móvil, en vez de estado a mano

- Fecha: 2026-08-26
- Estado: aceptada

## Contexto

El drawer móvil (`site-header.tsx`) se implementaba con `useState(false)` +
un `useEffect` que escuchaba `keydown` a mano para cerrar con `Esc` y bloqueaba
el scroll del `body` manipulando `document.body.style.overflow` directamente.
No había gestión de foco: al abrir, el foco no se movía al panel; al navegar
con Tab dentro del drawer, se podía salir a elementos detrás del overlay (sin
focus trap); y al cerrar, el foco no volvía al botón hamburguesa que lo abrió.
Esto incumple el criterio de aceptación de S-02 y el estándar WAI-ARIA APG
para el patrón "dialog" (modal).

El plan de la rama (`docs/04-plan.md`) ya identifica esta slice como la única
que introduce una dependencia nueva en todo el rediseño, y señala explícitamente
que Flowbite (su componente `Drawer`) se probó antes en este mismo proyecto y
se descartó por no renderizar correctamente el menú móvil — ver ADR 0001,
tabla de alternativas, y el historial de git de `visual-redesign-responsive`.

## Decisión

Usamos **`@radix-ui/react-dialog`** para el menú móvil. Sustituye por completo:

- El `useState`/`useEffect` de gestión de `Esc` y bloqueo de scroll.
- Los atributos `role="dialog"` / `aria-modal` / `aria-label` puestos a mano.
- ~70 líneas de CSS de `.mobile-drawer*` en `globals.css` (backdrop, panel,
  header, botón de cierre, nav), sustituidas por clases equivalentes
  (`.mobile-dialog-*`) que estilan los primitivos unstyled de Radix
  (`Dialog.Overlay`, `Dialog.Content`) usando los mismos tokens semánticos.

`Dialog.Root` es controlado (`open`/`onOpenChange`) porque `LanguageSwitcher`
necesita poder cerrar el diálogo de forma programática (`onNavigateAction`)
al pulsar un enlace de idioma, y los enlaces de navegación del panel se
envuelven en `Dialog.Close asChild` para cerrar al navegar sin lógica manual.

## Alternativas consideradas

| Opción | A favor | En contra | Por qué no |
|---|---|---|---|
| Mantener el estado a mano, añadir un focus trap manual (p. ej. `focus-trap-react` o un `useEffect` con `querySelectorAll` de elementos focuseables) | Cero dependencias nuevas más allá de la que ya se necesitaría | Reimplementa lo que un `Dialog` de referencia ya resuelve correctamente (trap, restore de foco, `aria-hidden` del resto del árbol, `Esc`); alto riesgo de bugs sutiles de accesibilidad no cubiertos por tests manuales | El coste de mantenimiento de una implementación de focus-trap propia supera el de una dependencia de 24 paquetes, bien probada y ya evaluada como aceptable por el ADR 0001 |
| Flowbite `Drawer` | Ya está en el ecosistema del stack original del sitio | Descartada en una prueba real anterior de este mismo proyecto: el drawer no renderizaba correctamente (ver ADR 0001) | No se reintenta una opción ya invalidada por evidencia directa |
| Headless UI (`@headlessui/react`) `Dialog` | API similar a Radix, también sin estilos | Segunda dependencia de "primitivos accesibles" en el proyecto sin motivo — Radix ya es el estándar elegido en `engineering-style` para el resto del sistema de diseño | Mantener una única librería de primitivos evita dos superficies de API distintas para el mismo patrón |

## Consecuencias

**Positivas:**

- Foco atrapado dentro del panel, `Esc` cierra, y el foco vuelve al botón
  hamburguesa al cerrar — gestionado por el primitivo, no por código propio.
- Bloqueo de scroll del `body` gestionado por Radix (añade
  `data-scroll-locked` al `body` mientras el diálogo está abierto); se retira
  el `document.body.style.overflow` manual.
- El resto del árbol queda `aria-hidden` mientras el diálogo está abierto,
  algo que la implementación anterior no hacía.
- Animación de apertura/cierre vía `data-state="open|closed"` que expone
  Radix, usando `--duration-slow` + `--ease-emphasized` de los tokens de
  movimiento del sistema, y anulada automáticamente por la regla global
  `@media (prefers-reduced-motion: reduce)` ya existente en `design-tokens.css`
  (fuerza `animation-duration: 0.01ms` a todo el árbol).

**Negativas y deuda asumida:**

- Primera y única dependencia de UI nueva en todo el plan de rediseño; añade
  ~24 paquetes transitivos a `node_modules` (peso de build, no de runtime
  visible: Radix Dialog es pequeño en el bundle final).
- El portal de Radix renderiza fuera del árbol de React del `SiteHeader`
  (vía `document.body` por defecto); bajo export estático de Next.js esto es
  el riesgo real a verificar — confirmado sin error de hidratación sirviendo
  `out/` (ver verificación en el cierre de esta slice).

**Coste de revertir:** bajo. El árbol de `Dialog.*` está confinado a
`site-header.tsx`; volver a un `<div>` con estado a mano exige reintroducir el
`useEffect` de `Esc`/scroll-lock y las clases CSS retiradas, sin tocar ningún
otro componente ni el modelo de contenido.

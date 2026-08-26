---
description: Fase 2 — Define el sistema de diseño (tokens, color, tipografía, componentes, estados)
argument-hint: "[referencias visuales, marca o tono deseado, opcional]"
---

# Fase 2 — Sistema de diseño

Dirección visual pedida: $ARGUMENTS

## Procedimiento

1. Lee `docs/01-brief.md` y `docs/02-arquitectura.md`. Si falta alguno, para.

2. Si el usuario no ha dado dirección visual, hazle **tres preguntas y ninguna más**:
   el tono (sobrio institucional / cálido cercano / técnico denso / editorial), si hay
   marca previa con colores y tipografías, y si prefiere una librería de componentes
   existente o un sistema propio.

3. Delega en `ui-designer`:

   > Lee `docs/01-brief.md` y `docs/02-arquitectura.md`. Define el sistema de diseño
   > completo y escríbelo en `docs/03-design-system.md`, más el fichero de tokens en el
   > formato que use el stack elegido. Dirección visual: $ARGUMENTS.
   > Verifica el contraste de cada par texto/fondo y anota el ratio. Define modo claro
   > y oscuro a la vez. Especifica los cuatro estados (cargando, vacío, error, con
   > datos) para los patrones de pantalla principales.

4. Delega en `frontend-builder` la implementación **solo del fichero de tokens y el
   layout base** (tipografía, reset, contenedor, modo oscuro). Nada de componentes
   todavía.

5. Enseña al usuario la paleta y la escala tipográfica resultantes con sus valores
   concretos y los ratios de contraste. Pide confirmación.

## Regla

Si al implementar una slice alguien necesita inventar un valor visual, esta fase ha
fallado. Todo valor debe salir de un token con nombre.

Al terminar, indica: `Siguiente: /web:plan`

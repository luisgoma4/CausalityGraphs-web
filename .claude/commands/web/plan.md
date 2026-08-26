---
description: Fase 3 — Descompone el proyecto en slices verticales con dependencias y criterios de aceptación
argument-hint: "[restricción de alcance o de plazo, opcional]"
---

# Fase 3 — Plan de slices

Restricciones: $ARGUMENTS

## Procedimiento

1. Lee `docs/01-brief.md`, `docs/02-arquitectura.md` y `docs/03-design-system.md`.
   Si falta alguno, para y di cuál.

2. Delega en `web-architect`:

   > Descompón el proyecto en slices verticales y escribe `docs/04-plan.md` y
   > `docs/tasks.md`. Cada slice atraviesa UI → API → datos → test y entrega algo que
   > un usuario puede ver o hacer. Prohibido planificar por capas horizontales.
   > Ordena por: riesgo técnico primero, luego camino crítico del usuario, luego el
   > resto. Cada slice lleva id, objetivo, dependencias, ficheros previstos, criterios
   > de aceptación en casillas de verificación, y nivel de riesgo.
   > Restricciones adicionales: $ARGUMENTS

3. Revisa el plan tú mismo antes de enseñarlo, contra estos criterios:
   - ¿Alguna slice es demasiado grande para una sesión de trabajo? → pártela.
   - ¿Hay slices que solo tocan una capa? → están mal cortadas.
   - ¿La slice más incierta está al principio? → si no, reordena.
   - ¿Cada criterio de aceptación es verificable ejecutando algo? → si no, reescríbelo.
   - ¿La primera slice produce algo desplegable y visible? → debería.

4. Presenta al usuario la lista de slices en una tabla: id, título, depende de, riesgo.
   Nada más. Los detalles están en el fichero.

Al terminar, indica: `Siguiente: /web:build S-01`

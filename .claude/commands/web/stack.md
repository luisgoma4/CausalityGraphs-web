---
description: Fase 1 — Elige el stack y define la arquitectura, con ADR y justificación
argument-hint: "[preferencias o restricciones técnicas, opcional]"
---

# Fase 1 — Stack y arquitectura

Preferencias del usuario: $ARGUMENTS

## Procedimiento

1. Lee `docs/01-brief.md`. Si no existe, para y dile al usuario que ejecute
   `/web:brief` primero.

2. Si hay código previo, lanza `repo-scout` para conocer el terreno. Un stack existente
   pesa mucho: cambiarlo requiere una razón escrita.

3. Delega en `web-architect` con este encargo:

   > Lee `docs/01-brief.md`. Clasifica el producto (sitio de contenido / aplicación /
   > híbrido / herramienta interna). Elige el stack y escribe
   > `docs/02-arquitectura.md` y `docs/adr/0001-stack.md`. Incluye la tabla de
   > decisiones con las columnas: decisión, opción elegida, por qué, alternativa
   > descartada, coste de revertir. Considera estas preferencias del usuario:
   > $ARGUMENTS. Si el brief no permite decidir algo, devuélvelo en BLOQUEOS en lugar
   > de suponerlo.

4. Presenta al usuario la propuesta en **una tabla de máximo 12 filas** y las tres
   decisiones más discutibles con su alternativa. Pide confirmación.

5. Solo tras la confirmación, delega en `devops-engineer` el arranque del repositorio:
   estructura de carpetas, versión del runtime fijada, `.gitignore`, `.env.example`,
   scripts uniformes (`dev`, `build`, `test`, `lint`, `typecheck`, `format`),
   formateador y linter.

## Reglas

- Lo aburrido que funciona gana. Una tecnología novedosa necesita un problema del brief
  que la justifique.
- Cada dependencia de peso se justifica en una línea o no entra.
- Verifica versiones y APIs actuales con Context7 si está disponible. No confíes en la
  memoria del modelo para números de versión.

Al terminar, indica: `Siguiente: /web:design`

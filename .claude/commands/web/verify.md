---
description: Fase 5 — Ejecuta la batería completa de verificación (tipos, lint, tests, build, a11y, rendimiento, navegador)
argument-hint: "[ruta o slice a verificar, opcional; por defecto todo]"
---

# Fase 5 — Verificar

Alcance: $ARGUMENTS (si está vacío, verifica el proyecto completo)

Delega **todo** en `qa-verifier`:

> Ejecuta la batería completa sobre: $ARGUMENTS.
> Comprueba en orden: instalación limpia, typecheck, lint, tests, build de producción,
> e2e, accesibilidad automática en las rutas clave, Core Web Vitals, comprobación
> manual en navegador de los criterios de aceptación, y consola sin errores.
> Usa el MCP de navegador si está disponible; si no, la CLI de Playwright o Lighthouse.
> Devuelve la tabla PASS/FAIL con evidencia. Distingue siempre FAIL de NO VERIFICADO.
> No arregles nada.

## Al recibir el informe

- Si sale **APTO**: dilo en una línea y propón `/web:review` o la siguiente slice.
- Si sale **NO APTO**: enruta cada fallo bloqueante al agente que corresponde
  (`frontend-builder`, `backend-builder`, `test-engineer`) con el diagnóstico concreto,
  y vuelve a verificar. Máximo dos ciclos; al tercero, para y consulta al usuario.

## Regla

Nunca reportes al usuario "todo correcto" si alguna fila está en `NO VERIFICADO`.
Di exactamente qué se comprobó y qué no.

---
description: Fase 6 — Revisión adversarial de seguridad, correctitud, accesibilidad y rendimiento antes de integrar
argument-hint: "[rama, rango de commits o rutas; por defecto los cambios sin integrar]"
---

# Fase 6 — Revisión

Alcance: $ARGUMENTS

## Procedimiento

1. Determina el alcance real. Si `$ARGUMENTS` está vacío, usa los cambios respecto a la
   rama principal (`git diff --stat` para dimensionar, no para leer).

2. Delega en `code-reviewer`:

   > Revisa: <alcance>. Aplica la regla de admisión: solo reporta un hallazgo si puedes
   > describir un escenario concreto de fallo (qué entrada o estado → qué sale mal).
   > Nada de preferencias estilísticas. Ordena de más grave a menos, con
   > fichero:línea y el arreglo concreto.

3. Presenta al usuario **solo** los hallazgos CRÍTICO y ALTO en el mensaje, con una
   línea cada uno. Los MEDIO y BAJO, en un recuento y disponibles si los pide.

4. Pregunta qué arreglar. Enruta cada arreglo aprobado al builder correspondiente con
   el hallazgo íntegro como encargo.

5. Tras los arreglos, ejecuta `/web:verify` sobre lo tocado.

## Regla

Un hallazgo CRÍTICO de seguridad no se negocia: se arregla antes de continuar, o se
documenta explícitamente como riesgo aceptado por el usuario en `docs/adr/`.

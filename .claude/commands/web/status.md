---
description: Estado del proyecto en 10 líneas — fase actual, slices, bloqueos y siguiente paso
model: haiku
allowed-tools: Read, Glob, Bash
---

# Estado

Lee `docs/tasks.md`, `docs/04-plan.md` y el último commit. Si `docs/` no existe, di qué
fase falta ejecutar y termina.

Responde exactamente con esto y nada más:

```
FASE: <la fase completada más avanzada, de 0 a 7>
SLICES: <n hechas / n en curso / n bloqueadas / n pendientes>
EN CURSO: <id y título, o "ninguna">
BLOQUEOS: <los que haya, una línea cada uno, o "ninguno">
ÚLTIMO CAMBIO: <fecha y resumen del último commit>
DEUDA ANOTADA: <n ítems en el changelog marcados como deuda>
SIGUIENTE: <el comando concreto a ejecutar>
```

No leas código fuente. No propongas mejoras. No expliques nada más.

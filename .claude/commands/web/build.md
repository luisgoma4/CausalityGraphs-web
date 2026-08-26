---
description: Fase 4 — Implementa una slice vertical completa delegando en los builders
argument-hint: "<id-de-slice> (p. ej. S-03) o descripción libre"
---

# Fase 4 — Construir slice

Slice objetivo: $ARGUMENTS

Este es el bucle de trabajo. **Tú coordinas; no escribes código en el hilo principal.**

## Procedimiento

**1 — Situarse (barato)**

Lee la definición de la slice en `docs/tasks.md`. Si `$ARGUMENTS` no es un id
conocido, busca la coincidencia más cercana y confírmala antes de seguir.

Comprueba las dependencias de la slice. Si alguna no está en `hecho`, avisa y pregunta
si continuar igualmente.

**2 — Reconocer (delegado a `repo-scout`, modelo barato)**

> Tarea: <objetivo de la slice>. Devuelve los ficheros relevantes, las convenciones
> reales del código y los puntos de entrada exactos donde hay que tocar.

No leas ficheros tú mismo. Ese mapa es tu contexto.

**3 — Implementar (delegado, en paralelo cuando se pueda)**

Reparte según lo que toque la slice:

- Servidor, datos, autenticación → `backend-builder`
- Interfaz, rutas, formularios, estilos → `frontend-builder`

Si la slice necesita ambos y el contrato entre ellos está claro (endpoints, tipos),
lánzalos **en paralelo en un solo bloque** y pásale a cada uno el contrato acordado.
Si el contrato aún no está claro, ve en serie: primero servidor, luego interfaz.

A cada builder dale: el objetivo, los criterios de aceptación, el mapa de `repo-scout`
y el contrato. **Nunca le pases el historial de la conversación.**

**4 — Testear (delegado a `test-engineer`)**

> Escribe los tests que cubren estos criterios de aceptación: <lista>. Ejecuta la
> suite y reporta el resultado real.

**5 — Verificar (delegado a `qa-verifier`)**

Solo si la slice toca interfaz o es la última de un bloque. Para cambios internos
pequeños, basta con el paso 4.

**6 — Cerrar (delegado a `docs-librarian`)**

> Marca la slice <id> según su estado real. Añade la entrada al changelog. Señala
> cualquier incoherencia entre lo planificado y lo implementado.

**7 — Informar (tú, corto)**

Al usuario: qué funciona ahora que antes no, qué ficheros cambiaron, qué está
verificado y qué no, y cuál es la siguiente slice. Máximo 10 líneas.

## Reglas del bucle

- Una slice por invocación. Si el usuario pide tres, hazlas de una en una y confirma
  entre medias.
- Si un builder devuelve `BLOQUEOS`, **no improvises la decisión**: llévasela al
  usuario o al `web-architect` según sea de producto o de arquitectura.
- Si algo falla dos veces seguidas, detente y pide ayuda en lugar de reintentar. El
  tercer intento del mismo enfoque nunca funciona.
- No refactorices lo que no toca la slice. Anótalo en el changelog como deuda.

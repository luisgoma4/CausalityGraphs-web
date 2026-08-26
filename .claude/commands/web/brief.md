---
description: Fase 0 — Convierte una idea vaga en un brief con alcance, criterios de aceptación y no-alcance
argument-hint: "[descripción de la idea, o vacío para que te pregunte]"
---

# Fase 0 — Brief

Idea de partida: $ARGUMENTS

Tu trabajo es convertir esto en `docs/01-brief.md`. **No escribas código. No elijas
stack todavía.**

## Procedimiento

1. Si el directorio ya tiene código, lanza `repo-scout` para saber qué hay. Si está
   vacío, sáltatelo.

2. Identifica lo que falta para poder decidir. Agrupa **todo** en una sola tanda de
   como máximo cinco preguntas. Prioriza las que más cambian el resultado:
   quién lo usa, qué tiene que conseguir, qué datos maneja, si necesita cuentas de
   usuario, si el SEO importa, y cuál es la restricción real (plazo, presupuesto, quién
   lo mantendrá).

   Para cada pregunta, **propón tu opción por defecto**. Así el usuario puede
   responder "todo por defecto salvo la 3".

3. Con las respuestas, escribe `docs/01-brief.md` con esta estructura:

   - **Problema** — qué duele hoy, en dos frases. Sin la solución dentro.
   - **Usuarios** — quiénes son y en qué contexto lo usan (móvil en la calle, escritorio
     con tiempo, ambos).
   - **Historias de usuario** — entre 3 y 7, priorizadas, en formato
     *"Como X quiero Y para Z"*. Si salen más de 7, la primera versión es demasiado
     grande.
   - **Criterios de aceptación del producto** — observables y medibles. "Rápido" no
     vale; "la portada carga en menos de 2 s en 4G" sí.
   - **No-alcance** — lista explícita de lo que **no** se hará en esta versión. Esta
     sección es la más valiosa del documento; si está vacía, no has terminado.
   - **Restricciones** — plazo, presupuesto, idiomas, cumplimiento normativo,
     integraciones obligatorias, quién mantendrá esto.
   - **Riesgos** — máximo tres, con su mitigación.

4. Muestra al usuario un resumen de 10 líneas y pídele confirmación explícita antes de
   pasar a la fase siguiente.

## Criterio de calidad

Un brief está terminado cuando otra persona podría construir el producto sin volver a
preguntarte nada esencial. Si tienes que rellenar huecos con suposiciones, escríbelas
como suposiciones marcadas, no como hechos.

Al terminar, indica: `Siguiente: /web:stack`

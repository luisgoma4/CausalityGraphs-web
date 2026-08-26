---
name: slice-protocol
description: Protocolo para cortar, implementar y cerrar slices verticales de trabajo web. Úsalo al planificar el proyecto, al empezar una slice y al decidir si una slice puede darse por terminada.
---

# Protocolo de slices verticales

## Qué es una slice

Un corte que atraviesa toda la pila y entrega algo que un usuario puede ver o hacer.

```
   UI  ────┐
   API ────┤  una slice
  DATOS────┤
  TEST ────┘
```

**Bien cortada:** *"un visitante se registra con email y llega al panel"* — toca
formulario, validación, endpoint, tabla de usuarios, sesión y test e2e.

**Mal cortada:** *"crear todos los modelos de datos"*, *"maquetar todas las páginas"*,
*"configurar la autenticación"*. Son capas: al terminarlas no hay nada que enseñar y
los errores de integración aparecen todos juntos al final.

## Cómo se corta

1. Parte de una historia de usuario del brief.
2. Pregunta: *¿qué es lo mínimo que hace esto real?* Ese es el objetivo de la slice.
3. Todo lo demás va a slices posteriores, escrito explícitamente para que no se olvide.
4. Si no cabe en una sesión de trabajo, pártela por el eje que menos acoplamiento
   genere: normalmente por caso de uso (crear antes que editar antes que borrar), no
   por capa.

## Orden

1. **La slice más incierta primero.** Si algo puede tumbar el diseño, que se sepa el
   día 2, no el día 40.
2. **El camino crítico del usuario después.** Aquello sin lo cual el producto no tiene
   sentido.
3. **El resto por valor.**

La primera slice del proyecto debería producir algo desplegable, aunque sea mínimo. Un
"hola mundo" en producción vale más que tres semanas de andamiaje local.

## Ciclo de una slice

```
mapear → implementar → testear → verificar → cerrar
```

1. **Mapear** — `repo-scout` devuelve dónde tocar y con qué convenciones. Nunca se
   empieza a escribir sin este paso.
2. **Implementar** — `backend-builder` y `frontend-builder`, en paralelo solo si el
   contrato entre ambos ya está fijado.
3. **Testear** — `test-engineer` escribe un test por criterio de aceptación.
4. **Verificar** — `qa-verifier` ejecuta la batería. Solo si toca interfaz o cierra un
   bloque.
5. **Cerrar** — `docs-librarian` actualiza `tasks.md` y `changelog.md`.

## Definición de terminado

Una slice está terminada cuando **todo** esto es cierto:

- [ ] Todos sus criterios de aceptación se cumplen y hay un test que lo demuestra.
- [ ] Typecheck, lint y build pasan.
- [ ] La suite de tests completa está en verde (no solo los nuevos).
- [ ] Cumple el listón de `web-quality-bar` en lo que le aplique.
- [ ] No hay `TODO`, código comentado ni `console.log` de depuración.
- [ ] `docs/tasks.md` y `docs/changelog.md` actualizados.
- [ ] La deuda generada está anotada, no escondida.

Si algo no se cumple, la slice está **en curso**, no hecha. Marcarla como hecha porque
"casi está" es la forma más rápida de perder el control de un proyecto.

## Contrato entre builders

Cuando frontend y backend van en paralelo, el contrato se fija **antes** y por escrito:

```
POST /api/registro
  entrada:  { email: string, password: string }
  éxito:    201 { userId: string }
  errores:  400 { campo: string, mensaje: string }   // validación
            409 { mensaje: string }                  // email ya existe
```

Sin contrato escrito, van en serie. Un contrato improvisado cuesta más que la espera.

## Cuándo parar y preguntar

- Un builder devuelve un `BLOQUEO` que es una decisión de producto.
- Lo mismo falla dos veces seguidas.
- La slice necesita una dependencia nueva de peso.
- Lo implementado contradice el plan o la arquitectura.

En los cuatro casos: para, resume en tres líneas y pregunta. No improvises.

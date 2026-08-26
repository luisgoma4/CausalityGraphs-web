---
description: Fase 7 — Prepara y ejecuta la puesta en producción con checklist de lanzamiento
argument-hint: "[entorno: preview | production]"
---

# Fase 7 — Desplegar

Entorno: $ARGUMENTS (por defecto `preview`)

## Puerta de entrada

No se despliega sin que se cumplan las tres condiciones:

1. `/web:verify` con resultado APTO, ejecutado sobre el estado actual del código.
2. `/web:review` sin hallazgos CRÍTICO abiertos.
3. `docs/tasks.md` refleja el estado real.

Si alguna falta, dilo y para. No preguntes si saltárselas.

## Procedimiento

1. Delega en `devops-engineer`:

   > Prepara el despliegue a <entorno>. Verifica variables de entorno completas y
   > presentes en el destino, build de producción reproducible, migraciones de base de
   > datos explícitas y reversibles, cabeceras de seguridad, `robots.txt` y
   > `sitemap.xml`, metaetiquetas y Open Graph, páginas 404 y 500, registro de errores
   > activo, y plan de reversión escrito. Recorre el checklist de lanzamiento y devuelve
   > qué está marcado y qué falta.
   > No ejecutes ninguna acción destructiva ni irreversible: propónla en BLOQUEOS.

2. Presenta el checklist al usuario: marcados / total, y la lista de lo que falta.

3. Ejecuta el despliegue solo con confirmación explícita del usuario para
   `production`. Para `preview`, adelante.

4. Tras desplegar, comprueba en el destino real: la portada carga, el camino crítico
   funciona, no hay errores en consola, y el registro de errores recibe eventos. Delega
   esta comprobación en `qa-verifier` contra la URL desplegada.

## Regla

Producción se toca con confirmación explícita y con la reversión escrita de antemano.
Si no hay plan de reversión, no hay despliegue.

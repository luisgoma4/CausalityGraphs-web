---
name: design-tokens
description: Método para definir tokens de diseño coherentes — escala de espaciado, tipografía modular, color semántico con contraste verificado, radios, sombras, movimiento y modo oscuro. Úsalo al crear o extender el sistema de diseño de un proyecto web.
---

# Tokens de diseño

Un token es un valor con nombre semántico. Si aparece un número mágico en un
componente, falta un token.

## 1. Espaciado — base 4

Escala fija: `4, 8, 12, 16, 24, 32, 48, 64, 96, 128`. Nada intermedio.

Nombres por función, no por tamaño: `space-inline-xs`, `space-stack-md`,
`space-section-lg`. Así el token sobrevive a un rediseño.

## 2. Tipografía — escala modular

Elige una razón (1,200 para interfaces densas; 1,250 equilibrada; 1,333 editorial) y
deriva desde 16 px de base.

Cada nivel define cuatro cosas, no solo el tamaño:

| Nivel | Tamaño | Interlineado | Grosor | Espaciado |
|---|---|---|---|---|
| display | 48 px | 1,1 | 700 | −0,02em |
| h1 | 32 px | 1,2 | 700 | −0,01em |
| h2 | 24 px | 1,3 | 600 | 0 |
| h3 | 20 px | 1,4 | 600 | 0 |
| body | 16 px | 1,6 | 400 | 0 |
| small | 14 px | 1,5 | 400 | 0 |
| caption | 12 px | 1,4 | 500 | 0,01em |

Reglas: cuanto más grande el texto, menor el interlineado y más negativo el espaciado.
El cuerpo de texto nunca baja de 16 px ni de 1,5 de interlineado. Máximo dos familias
tipográficas; una bien usada suele bastar. Longitud de línea entre 45 y 75 caracteres.

## 3. Color — semántico y verificado

Nombra por **función**, jamás por valor. `color-danger`, no `color-rojo`: el día que el
rojo pase a naranja, el nombre sigue siendo cierto.

Conjunto mínimo:

```
surface            fondo de página
surface-raised     tarjetas, menús desplegables
surface-sunken     zonas hundidas, código
text               texto principal
text-muted         texto secundario
text-inverse       texto sobre fondos de color
border             bordes y separadores
border-strong      bordes de campos de formulario
primary            acción principal
primary-hover      su estado de pasada de ratón
primary-fg         texto sobre primary
focus-ring         anillo de foco
success / warning / danger / info        + su variante -bg suave y -fg
```

**Verificación obligatoria.** Calcula el ratio de contraste de cada par y anótalo:

| Par | Ratio | Mínimo | ¿Cumple? |
|---|---|---|---|
| text sobre surface | 12,6:1 | 4,5:1 | sí |
| text-muted sobre surface | 4,8:1 | 4,5:1 | sí |
| primary-fg sobre primary | 5,2:1 | 4,5:1 | sí |
| border-strong sobre surface | 3,4:1 | 3:1 | sí |

El fallo más común es `text-muted`: se elige por estética y se queda en 3,2:1.

## 4. Modo oscuro — a la vez, no después

Mismos nombres, distintos valores. No es invertir: en oscuro se reduce el contraste
máximo (blanco puro sobre negro puro deslumbra; usa `#e8e8e8` sobre `#141414`), las
sombras dejan de funcionar como elevación (usa fondos más claros) y los colores
saturados necesitan bajar la saturación y subir la luminosidad.

## 5. Radios, bordes y elevación

Máximo tres radios (`sm` 4 px, `md` 8 px, `lg` 16 px) más `full` para píldoras y
avatares. Máximo tres elevaciones. Más de eso es ruido que nadie percibe.

## 6. Movimiento

| Token | Duración | Uso |
|---|---|---|
| `motion-fast` | 150 ms | pasada de ratón, foco |
| `motion-base` | 250 ms | desplegables, acordeones |
| `motion-slow` | 400 ms | modales, transiciones de página |

Curvas: `ease-out` para lo que entra, `ease-in` para lo que sale. Todo dentro de una
consulta `prefers-reduced-motion: reduce` que lo desactive.

## 7. Puntos de ruptura

`sm 640 · md 768 · lg 1024 · xl 1280 · 2xl 1536`. Móvil primero: los estilos base son
los de móvil y los puntos de ruptura solo añaden.

## Implementación

Publica los tokens como variables CSS en `:root` y sobreescribe el bloque de color en
`[data-theme="dark"]` o en `prefers-color-scheme: dark`. Si el stack usa un framework
de utilidades, mapea sus nombres a estas mismas variables en su configuración: un solo
origen de verdad.

## Prueba de fuego

Coge tres componentes ya implementados y busca valores literales de color, tamaño o
espaciado. Cada uno que encuentres es un token que falta o un token que nadie supo
encontrar. Ambos casos son un fallo del sistema, no del implementador.

---
name: web-quality-bar
description: Listón de calidad no negociable para cualquier web o web-app entregada — accesibilidad, rendimiento, seguridad, SEO, resiliencia y responsive. Úsalo al implementar interfaz, al revisar código, al verificar antes de cerrar una slice y antes de desplegar.
---

# Listón de calidad

Esto no es una lista de deseos: es la definición de "terminado". Una entrega que
incumple cualquier punto marcado como **[bloqueante]** no está terminada.

## Accesibilidad

- **[bloqueante]** Todo lo interactivo es alcanzable y operable con teclado, en un
  orden lógico. El foco es siempre visible; nunca se elimina el contorno sin sustituirlo.
- **[bloqueante]** Contraste WCAG AA: 4,5:1 en texto normal, 3:1 en texto grande y en
  componentes de interfaz. Verificado con calculadora, no a ojo.
- **[bloqueante]** Cada campo de formulario tiene una `<label>` asociada. El
  marcador de posición no es una etiqueta.
- **[bloqueante]** Imágenes con `alt` descriptivo; las decorativas con `alt=""`.
  Botones de solo icono con nombre accesible.
- **[bloqueante]** La información nunca se transmite solo por color.
- Estructura de encabezados coherente: un `h1` por página, sin saltos de nivel.
- Un enlace para saltar al contenido principal.
- Cambios asíncronos anunciados con `aria-live`.
- `prefers-reduced-motion` respetado.
- Zoom al 200 % sin pérdida de contenido ni scroll horizontal.

## Rendimiento

- **[bloqueante]** LCP < 2,5 s · INP < 200 ms · CLS < 0,1, en móvil simulado.
- **[bloqueante]** Nada de saltos de maquetación: imágenes, iframes y anuncios con
  dimensiones reservadas.
- Imágenes en formato moderno, dimensionadas al uso real, con carga diferida salvo la
  primera visible.
- Fuentes con `font-display: swap` y precarga de la crítica. Subconjunto si es posible.
- Sin cascadas de peticiones: lo que se puede pedir en paralelo, en paralelo.
- JavaScript de la ruta principal por debajo de 200 KB comprimidos. Si se supera,
  justificarlo.
- Sin trabajo en cliente que pueda hacerse en servidor o en tiempo de compilación.

## Seguridad

- **[bloqueante]** Cero secretos en el repositorio y cero en el bundle de cliente.
- **[bloqueante]** Toda entrada validada en servidor con esquema explícito.
- **[bloqueante]** Autorización comprobada por recurso, no solo por ruta.
- **[bloqueante]** Sin inserción de HTML sin sanear.
- Cabeceras: CSP, HSTS, `X-Content-Type-Options: nosniff`, `Referrer-Policy`,
  `Permissions-Policy`.
- Cookies con `HttpOnly`, `Secure` y `SameSite`.
- Límite de peticiones en autenticación y en endpoints de escritura.
- Los mensajes de error no filtran consultas, rutas ni versiones.
- Dependencias sin vulnerabilidades conocidas de gravedad alta.

## Resiliencia

- **[bloqueante]** Cada vista tiene sus cuatro estados: cargando, vacío, error y con
  datos.
- **[bloqueante]** Los fallos de red se manejan: mensaje comprensible y una vía de
  recuperación. Nunca una pantalla en blanco.
- Páginas 404 y 500 propias, con navegación de vuelta.
- Los formularios no pierden lo escrito cuando falla el envío.
- Doble envío prevenido en operaciones que crean o cobran.

## SEO y compartición

*(bloqueante solo en sitios públicos indexables)*

- Título y meta descripción únicos por página.
- URL canónica correcta.
- Open Graph y Twitter Card con imagen.
- `robots.txt` y `sitemap.xml` presentes y correctos.
- Datos estructurados cuando el tipo de contenido lo admita.
- HTML semántico: el contenido principal existe sin JavaScript en las rutas indexables.

## Responsive

- **[bloqueante]** Funciona a 375 px de ancho sin scroll horizontal.
- Objetivos táctiles de al menos 44 × 44 px.
- Probado a 375, 768, 1024 y 1440 px.
- Tablas que se adaptan o hacen scroll dentro de su contenedor, no rompen la página.

## Cómo usar este listón

Al **implementar**: repásalo antes de dar por hecho un componente.
Al **revisar**: cada incumplimiento bloqueante es un hallazgo ALTO o CRÍTICO.
Al **verificar**: los puntos automatizables (contraste, axe, CWV, cabeceras) se
comprueban ejecutando herramientas, no leyendo código.

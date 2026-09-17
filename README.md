# Papel Vegetal — plantilla de estudio de tatuaje

> **Sitio de demostración.** «Papel Vegetal, estudio de tatuaje» es un **negocio
> ficticio**. El nombre, la dirección (Travesa da Calcografía, 3 · Santiago de
> Compostela), el teléfono (981 00 00 34), el horario, las tarifas y las tres personas
> del equipo son **datos de muestra inventados**. No corresponden a ningún negocio real.
> La página lleva `noindex, nofollow` a propósito.
>
> **No hay ninguna fotografía de tatuajes.** Los diez diseños de flash están dibujados
> en SVG para esta plantilla: no se usa obra de ningún tatuador identificable.

**Demo:** https://alvarotaiagu.github.io/plantilla-tatuajes-web/

---

## El concepto: «Calco»

Antes de que entre la aguja, un tatuaje es una línea violeta sobre la piel. El calco es
el momento en que el dibujo deja el papel y se decide de verdad: se mira en el espejo,
se gira, se cambia de sitio, y solo entonces hay vuelta de hoja. Toda la web imita ese
paso:

- Cada dibujo aparece **primero como trazo** y solo después se **entinta**. El del hero
  lo hace solo; los de la hoja de flash, al pasar el cursor por encima.
- El violeta de la plantilla (`#6C3BF4`) es el violeta del papel hectográfico, y
  aparece también como **desencaje de impresión**: una copia desplazada detrás de cada
  línea, como un riso mal registrado.
- La cortina de entrada **escribe el nombre a línea** antes de levantarse.
- La banda diagonal avanza como el papel bajo la mano.

Registro visual: cartel de serigrafía sobre papel hueso, tipografía ancha y rara, dos
tintas planas y mucho aire. Nada de fondo negro ni condensada industrial.

## Mapa de secciones

| # | Sección | Qué hace |
|---|---|---|
| — | Cortina | El nombre se traza y la cortina se levanta. Se quita siempre, haya GSAP o no |
| — | Hero | Titular palabra a palabra, serpiente que se dibuja y se entinta, tres contadores |
| — | Banda | Marquesina diagonal con la velocidad ligada al scroll |
| 01 | Hoja de flash | Nueve diseños con precio y tamaño; se desencajan por columnas al hacer scroll y se entintan al pasar por encima |
| 02 | Del calco a la piel | Los cuatro pasos, con la regla superior que se dibuja al llegar |
| 03 | Quién dibuja | Tres artistas representados **por su dibujo**, no por una foto |
| 04 | Tarifas | Tabla de precios y condiciones (señal, retoque, mayoría de edad) |
| 05 | Antes y después | Cuidados, sin una sola promesa médica |
| — | Preguntas | Acordeón nativo (`<details>`), accesible por teclado |
| 06 | Pedir cita | Formulario de muestra con casilla de 18 años, horario en vivo y mapa bajo clic |

## Recursos de movimiento

1. **Lenis** como único motor de scroll.
2. **Trazado de línea** (`stroke-dasharray` + `pathLength="1"`) — el recurso
   protagonista: cada `.trazo` se dibuja y cada `.tinta` entra después.
3. **Cortina de entrada** con el nombre escribiéndose.
4. **Titulares palabra a palabra**.
5. **Marquesina diagonal** con velocidad ligada al scroll.
6. **Parallax por columnas** en la hoja de flash (cada columna a su ritmo).
7. **Botones magnéticos** y **cursor** en forma de mirilla que engorda y cambia de texto.
8. **Contadores** y regla del proceso que se dibuja al entrar.

## Cómo reskinearlo a un estudio real

1. **Los dibujos son lo primero que hay que cambiar.** Están en línea dentro de
   `index.html` (para poder animarlos) y como archivos en `assets/flash/`. Cada uno
   necesita dos grupos: `<g class="trazo">` con las líneas y `<g class="tinta">` con las
   manchas. Si se sustituyen por fotos reales del estudio, hay que quitar las clases
   `.trazo`/`.tinta` y el bloque 4 de `js/main.js`.
   Si un SVG nuevo se añade como archivo, pásale `pathLength="1"` a cada `<path>` y
   `<circle>`: es lo que hace que la línea se dibuje igual de rápido en trazos largos y
   cortos.
2. **Datos del negocio** — el `application/ld+json` del `<head>`, la sección `#cita`, el
   `<footer>` y la consulta del mapa (sección 15 de `js/main.js`).
   Quitar `noindex, nofollow` y el sello de demostración.
3. **Horario** — sección 12 de `js/main.js`: días y minutos de apertura, más el `<dl>`
   de `#cita`.
4. **Tarifas** — la `<table>` de `#tarifas` y la lista de condiciones de al lado.
5. **Paleta y tipografía** — las variables de `:root` en `css/estilo.css` y el `<link>`
   de Google Fonts. Cambiar `--violeta` cambia el sitio entero, incluido el desencaje.
6. **Textos legales** — `legal.html`, incluida la parte de cookies y la de salud.

## Decisiones tomadas

- **Cero fotografías.** Un estudio ficticio no puede enseñar tatuajes reales sin usar
  obra ajena, así que todo es dibujo propio. Los artistas se presentan por su estilo
  dibujado, no por un retrato.
- **Sin `aggregateRating` ni `review`** en los datos estructurados, y sin testimonios
  atribuidos a ninguna plataforma.
- **Ninguna promesa médica.** Los cuidados están escritos como lo que se dice en el
  mostrador, y remiten al médico ante cualquier problema.
- **Mayoría de edad explícita**, en las condiciones y como casilla del formulario.
- **La cortina se quita siempre**, aunque GSAP no cargue: si no, taparía la página.
- **El contenido sigue vivo con `prefers-reduced-motion`**: el estado del estudio, los
  contadores y el acordeón funcionan igual; lo que se apaga es el movimiento.
- **Sin GSAP la página se lee entera**: los estados «vacíos» viven bajo `.has-motion`.

## Créditos

Ver [`CREDITOS.md`](CREDITOS.md). Todo el dibujo es propio de la plantilla.

## Técnico

HTML + CSS + un `main.js`. Sin framework, sin build, sin backend, sin npm. GSAP,
ScrollTrigger y Lenis por CDN. Se abre con doble clic en `index.html` y se publica tal
cual en GitHub Pages.

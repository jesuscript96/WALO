# CLAUDE.md — WALO web

Contexto para agentes (Claude Code, etc.). Leer también `README.md`.

## Proyecto

Web de **WALO**, estudio de diseño de iluminación arquitectónica con base en
Madrid, trabajando en Europa ("La luz como arquitectura" / "Lighting as
architecture"). Astro 7 (salida estática) + GSAP/ScrollTrigger + TypeScript.
Español por defecto en `/`, inglés en `/en`.

## Publicación — leer antes de tocar nada

- `main` = producción. Vercel (proyecto `walo`, equipo `jesusvchs-projects`)
  está conectado al repo: **cada push a `main` publica en
  https://walo-delta.vercel.app**. Otras ramas generan previews.
- No usar `vercel deploy --prod` desde local: desincroniza producción y GitHub.
- Antes de hacer push: `npm run build` y `npx astro check` deben pasar sin errores.
- Tras hacer push, comprobar que la URL de producción sirve el cambio.
- Si el usuario pide "súbelo" o "publícalo": commit + push a `main`.

## Comandos

`npm run dev` (puerto 4321) · `npm run build` · `npx astro check` · `npm run preview`

## Arquitectura

- `src/i18n/index.ts`: textos de UI de ambos idiomas (`ui.es` / `ui.en` con la
  misma forma), rutas localizadas (`paths`), anclas (`ids`), `EMAIL`.
- `src/data/projects.ts`: fuente única de los proyectos. Cada uno genera
  `/proyectos/<slug>` y `/en/projects/<slug>` (vía `getStaticPaths`) y aparece en
  el desplegable del header, el índice de la home y el footer.
- `src/components/pages/{Home,Project,Contact}.astro`: páginas reales; los
  archivos de `src/pages/` solo las instancian con `lang`.
- `src/layouts/Base.astro`: head/SEO (canonical, hreflang), header, footer. Cada
  página pasa `alternates={{ es, en }}` para el selector de idioma.
- `src/styles/global.css`: un solo CSS con tokens en `:root`. Tema por bloque con
  `data-theme="light|dark"` (define `--bg --fg --mut --line --err`) y acento con
  `data-accent="ember|ultra|aurora"` (define `--accent`).
- `src/scripts/*.ts`: JS de cliente, importado desde `<script>` en componentes.

## Sistema visual (decisiones del cliente, no derivables del código)

- Concepto rector de marca: **la "O" como dispositivo** — Sol (disco macizo,
  día) / Eclipse (anillo, noche). Wordmark = "WAL" + círculo de 0.72em,
  margin-left 0.07em, letter-spacing -0.045em, peso 600; variante eclipse = anillo
  de borde 0.095em.
- Tipografía oficial: **Hanken Grotesk** (display) + **JetBrains Mono**
  (etiquetas en mayúsculas con tracking amplio).
- Color: negro `#0B0B0C` + blanco como base. Acentos/CTA: Brasa `#FF5A36`, Hora
  azul `#6674FF`, Aurora `#3FDDA0` (texto negro encima). El amarillo señal del
  manual (`#E9E700`) **dejó de ser color principal** por petición del cliente
  (sept. 2026); no reintroducirlo sin que lo pidan.
- El cliente quiere **minimalismo fuerte**. Referencias: burr.studio (imágenes
  que caen a distinto ritmo al hacer scroll), arvoarquitectura.com,
  barozziveiga.com, harquitectes.com, kkaa.co.jp. Estructura de página de
  proyecto inspirada en polight.es/arco-2025 (hero + ficha, bloques, galería,
  FAQs, CTA, formulario) pero con estilo WALO.

## Home: "El Ciclo de la Luz"

- La bola (`.light-cycle`, overlay fijo) recorre las secciones `main [data-cycle]`
  con posiciones en `KEYS` (`src/scripts/home.ts`) y toma el color de cada
  `data-ball`. Al llegar al contacto (sección oscura) se abre en anillo y encaja
  en `.footer-o`. El color se anima en la variable `--ball` de `<html>`, que
  también usan la O del header y el indicador de fase.
- De día `mix-blend-mode: multiply` (actúa como filtro de color); de noche `screen`.
- La timeline se recalcula al cambiar el ancho o la altura del documento.
- Palabras del título del hero: blancas + `mix-blend-mode: difference`. **No
  animar ni transformar su contenedor**: aísla el blend y el texto desaparece
  (anima cada palabra).
- La galería usa parallax multivelocidad propio (`data-speed` / `data-drift`).

## Formulario

`ContactForm.astro` + `src/scripts/form.ts`. Nombre obligatorio + correo **o**
teléfono + consentimiento. Sin `endpoint` el envío se simula; con `endpoint` se
hace POST JSON. `?form=error` fuerza el estado de error. Aún no hay servicio de
correo conectado.

## Convenciones

- Todo texto visible en **ES y EN**. Comentarios de código en español.
- Colores siempre con tokens/variables, nunca hex sueltos en componentes.
- Respetar `prefers-reduced-motion` (sin bola ni parallax).
- Placeholders marcados con comentario (`placeholder`): imágenes de Unsplash,
  textos de proyectos, correo `hola@walo.studio`, redes sociales.

## Verificación visual

Las pestañas ocultas congelan `requestAnimationFrame` (GSAP no avanza) y algunas
capturas no componen `mix-blend-mode`/vídeo. Verificar animaciones en un
navegador visible o con Chrome headless (puppeteer) haciendo scroll real.

# WALO — Lighting Design Studio · web

Sitio estático en **Astro** (salida SSG, desplegable en Vercel sin servidor).

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # genera dist/
npx astro check  # tipos
```

## Rutas

| ES (por defecto)            | EN                          |
| --------------------------- | --------------------------- |
| `/`                         | `/en`                       |
| `/proyectos/<slug>`         | `/en/projects/<slug>`       |
| `/contacto`                 | `/en/contact`               |

Sandboxes antiguos (noindex): `/animations`, `/photometry` (en `public/`).

## Dónde se edita cada cosa

- **Textos de interfaz ES/EN** → `src/i18n/index.ts` (incluye el correo `EMAIL`).
- **Proyectos (4)** → `src/data/projects.ts`: nombre, ficha, bloques
  (alcance / concepto / sistemas / resultado), FAQs, imágenes y color de acento.
  Añadir un objeto crea automáticamente sus dos páginas, su entrada en el
  desplegable "Proyectos", en el índice y en el footer.
- **Estilos** → `src/styles/global.css` (tokens al principio).
- **Home** → `src/components/pages/Home.astro` · animación de la bola en `src/scripts/home.ts`.

## Color

Base negro `#0B0B0C` + blanco. El amarillo deja de ser el color principal; los
acentos/CTA son tres luces que rotan por la web:

| Token      | Nombre     | Hex       |
| ---------- | ---------- | --------- |
| `--ember`  | Brasa      | `#FF5A36` |
| `--ultra`  | Hora azul  | `#6674FF` |
| `--aurora` | Aurora     | `#3FDDA0` |

Los tres admiten texto negro encima (contraste AA). Cada sección/proyecto fija
su acento con `data-accent="ember|ultra|aurora"`. En la home la bola toma el
color de la sección en la que está (`data-ball`) y al final encaja en la O del
footer.

## Formulario

`src/components/ContactForm.astro` (home, proyectos y contacto). Valida nombre +
correo **o** teléfono + consentimiento, con mensajes de éxito y error.
Todavía **no envía correo**: sin `endpoint` el envío se simula. Para conectarlo
(Formspree, Resend, función de Vercel…) pasar `endpoint="https://…"`; se hace
`POST` JSON `{name, email, phone, message, page, lang}` y cualquier respuesta
no‑2xx muestra el error. Para ver el estado de error: añadir `?form=error` a la URL.

## Placeholders pendientes

Nombres/textos de proyectos, superficies, imágenes (Unsplash), correo
`hola@walo.studio` y enlaces de Instagram/LinkedIn.

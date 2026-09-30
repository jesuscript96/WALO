# WALO — Lighting Design Studio · web

Web del estudio de diseño de iluminación **WALO** (Madrid → Europa).
Sitio estático en **Astro** + GSAP, en español e inglés.

- **Producción:** https://walo-delta.vercel.app
- **Repositorio:** https://github.com/jesuscript96/WALO

---

## 1. Primeros pasos (una sola vez)

Requisitos: **Node.js ≥ 22.12** (recomendado 24, el mismo que usa Vercel), `git`
y una cuenta de GitHub con acceso de escritura a este repo.

```bash
git clone https://github.com/jesuscript96/WALO.git
cd WALO
npm install
npm run dev          # abre http://localhost:4321
```

Para poder hacer `git push` hay que estar autenticado en GitHub. Lo más cómodo:
`brew install gh && gh auth login` (elegir HTTPS y "Login with a web browser").

## 2. Cómo se publica (importante)

**`main` es producción.** Vercel está conectado a este repositorio:

| Acción                               | Resultado                                                      |
| ------------------------------------ | -------------------------------------------------------------- |
| `git push` a `main`                  | Vercel construye y publica en producción en ~1 min             |
| `git push` a cualquier otra rama     | Vercel crea una **preview** con su propia URL (para enseñar cambios) |

No hace falta instalar ni usar la CLI de Vercel. **No despliegues con
`vercel --prod` desde tu ordenador**: publica archivos locales sin pasar por
GitHub y producción y repo se desincronizan.

Flujo de cada cambio:

```bash
git pull                 # trae lo último
npm run dev              # trabaja viendo los cambios en local
npm run build            # debe terminar sin errores
npx astro check          # 0 errores de tipos
git add -A
git commit -m "Describe el cambio"
git push                 # → producción
```

El estado del despliegue aparece en GitHub (icono junto al commit) y en el
panel de Vercel del proyecto `walo`.

## 3. Comandos

```bash
npm run dev       # servidor local con recarga en caliente
npm run build     # genera dist/ (lo mismo que hace Vercel)
npm run preview   # sirve dist/ en local
npx astro check   # comprobación de tipos
```

## 4. Rutas

| ES (por defecto)    | EN                    |
| ------------------- | --------------------- |
| `/`                 | `/en`                 |
| `/proyectos/<slug>` | `/en/projects/<slug>` |
| `/contacto`         | `/en/contact`         |

Sandboxes antiguos (noindex, no enlazados): `/animations`, `/photometry` (en `public/`).

## 5. Dónde se edita cada cosa

```
src/
  i18n/index.ts           Textos de interfaz ES/EN, rutas y correo de contacto (EMAIL)
  data/projects.ts        Los proyectos: ficha, textos ES/EN, FAQs, imágenes, color
  styles/global.css       Todos los estilos (tokens de color/tipografía al principio)
  layouts/Base.astro      <head>, SEO/hreflang, header y footer comunes
  components/
    Header.astro          Menú, desplegable "Proyectos", selector ES/EN, menú móvil
    Footer.astro
    ContactForm.astro     Formulario (home, proyectos, contacto)
    pages/Home.astro      Home
    pages/Project.astro   Plantilla de página de proyecto
    pages/Contact.astro   Página de contacto
  pages/                  Rutas (finas: solo llaman a components/pages/*)
  scripts/                JS del cliente: home.ts (bola + galería), form.ts, site.ts, project.ts
public/assets/            Imágenes y vídeo
```

- **Añadir o editar un proyecto**: un objeto en `src/data/projects.ts` crea
  automáticamente sus dos páginas (ES/EN) y sus entradas en el desplegable, el
  índice de la home y el footer.
- **Cualquier texto nuevo** debe existir en ES y EN.

## 6. Color

Base negro `#0B0B0C` + blanco. El amarillo del manual ya **no** es el color
principal; los acentos/CTA son tres luces que rotan por la web:

| Token      | Nombre    | Hex       |
| ---------- | --------- | --------- |
| `--ember`  | Brasa     | `#FF5A36` |
| `--ultra`  | Hora azul | `#6674FF` |
| `--aurora` | Aurora    | `#3FDDA0` |

Los tres admiten texto negro encima (contraste AA). Cada sección/proyecto fija
su acento con `data-accent="ember|ultra|aurora"`. En la home la bola toma el
color de la sección en la que está (`data-ball`) y al final encaja en la O del
footer.

## 7. Formulario

`src/components/ContactForm.astro`. Valida nombre + correo **o** teléfono +
consentimiento, con mensajes de éxito y error. Todavía **no envía correo**: sin
`endpoint` el envío se simula. Para conectarlo (Formspree, Resend, función de
Vercel…) pasar `endpoint="https://…"`; se hace `POST` JSON
`{name, email, phone, message, page, lang}` y cualquier respuesta no‑2xx muestra
el error. Para ver el estado de error: añadir `?form=error` a la URL.

## 8. Pendiente

- Placeholders: nombres/textos de proyectos, superficies, imágenes (Unsplash),
  correo `hola@walo.studio` y enlaces de Instagram/LinkedIn.
- Conectar el formulario a un servicio de correo.
- Decidir si se eliminan o redirigen `/animations` y `/photometry`.

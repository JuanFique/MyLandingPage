# Portafolio — Juan David Fique Velasco

Portafolio de edición de video y motion graphics. Sitio estático hecho con **Next.js (App Router)** y **React**, sin base de datos ni dependencias de runtime extra. El contenido vive en archivos JSON, así que agregar o editar un proyecto no requiere tocar código.

**Sitio:** <https://juandavidfiquevelasco.vercel.app>

## Qué incluye

- Home con propuesta de valor, disponibilidad, CV descargable y proyectos en mosaico.
- Páginas de proyecto tipo *case study* (rol, reto, enfoque, resultado, galería ampliable y siguiente proyecto).
- Modo claro y oscuro según el sistema, `prefers-reduced-motion` respetado.
- Accesibilidad WCAG 2.2 AA verificada con axe en cada cambio (ver `e2e/`).
- SEO: metadatos y Open Graph por página, datos estructurados (JSON-LD), sitemap, robots y manifest.
- Video de YouTube con carga diferida: no se descarga nada de terceros hasta que alguien le da play.

## Cómo correrlo

Requiere Node 20.9 o superior (`.nvmrc` apunta a 22).

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # compila para producción
npm run start    # sirve el build
npm run lint
npm run test:e2e # pruebas con Playwright + axe (corre `npm run build` antes)
```

Para las pruebas en un entorno sin descarga de navegadores, apunta `PW_CHROMIUM_PATH` a un Chromium ya instalado.

## Dónde editar el contenido

| Qué | Dónde |
|---|---|
| Titular, disponibilidad, "Sobre mí", datos destacados, enlaces | `content/site.json` |
| Un proyecto | `content/projects/<nombre>.json` |
| Imágenes y videos de un proyecto | `public/projects/<nombre>/` |
| CV en PDF | `public/cv/` |

Guía completa de campos: [`content/README.md`](./content/README.md) y [`content/MEDIA.md`](./content/MEDIA.md).

## Estructura

```
app/          páginas, layout, sitemap, robots, manifest, íconos y estilos (globals.css)
components/   Header, Footer, ProjectCard, Gallery, VideoPlayer, HeroReel, Reveal, CopyEmail
content/      textos y datos en JSON
lib/          lectura de proyectos y media, URL del sitio, datos estructurados
e2e/          pruebas de accesibilidad, teclado y SEO
docs/         auditoría (docs/AUDIT.md) y textos antes/después (docs/COPY.md)
```

## Despliegue

Desplegado en Vercel. El *Root Directory* del proyecto en Vercel debe ser `portafolio-audiovisual`. La URL pública se define en `content/site.json` (`url`) y alimenta el sitemap, el robots y las imágenes para compartir.

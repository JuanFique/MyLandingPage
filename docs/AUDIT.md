# Auditoría del portafolio — Fase 0 (diagnóstico)

> Fecha: 2026-10-05 · Rama: `chore/portfolio-optimization` · Commit base: `9aac0b6`
> Alcance: solo lectura. Ningún archivo del sitio fue modificado en esta fase.

## 0. Resumen ejecutivo

El sitio está **técnicamente sano**: Lighthouse 95–100 en todas las categorías, 0 violaciones de axe-core en 8 rutas × 3 anchos, sin scroll horizontal, sin errores de consola (salvo el 404 esperado). La base de código es pequeña, limpia y bien comentada.

Los problemas reales no son técnicos sino de **comunicación**:

1. **El hero no dice qué buscas ni por qué contratarte.** "Transformo ideas en experiencias audiovisuales" es intercambiable con cualquier portafolio.
2. **Contradicción de credenciales**: el hero dice "Ingeniero en Multimedia"; "Sobre mí" dice "Estudiante de ingeniería en multimedia". Un reclutador lo nota y resta confianza.
3. **Ningún proyecto tiene resultado** (alcance, uso real, feedback del cliente, plazo, nota). Describen proceso, no impacto.
4. **No hay CV descargable** y LinkedIn solo aparece en el footer.
5. **"Sobre mí" está lleno de frases de relleno** ("experiencias visuales dinámicas e innovadoras", repetida dos veces; "adaptabilidad, aprendizaje rápido y resolución de problemas").
6. Estética correcta pero **de plantilla**: fondo oscuro + acento azul + badge tipo pastilla + h1 genérico.

> **Nota de audiencia:** el prompt habla de "reclutadores técnicos", pero este es un portafolio **audiovisual / motion design**, no de desarrollo. Las recomendaciones de UI/copy se orientan a reclutadores de agencias, productoras, equipos de marketing/contenido y estudios. Si el objetivo es otro (p. ej. roles de multimedia/front-end), dímelo porque cambia la Fase 3 y 4.

---

## 1. Stack, estructura y despliegue

| Aspecto | Detalle |
|---|---|
| Framework | **Next.js 16.3.6** (App Router), **React 19.2.8**, JavaScript (sin TypeScript) |
| Ubicación | La app vive en la subcarpeta `portafolio-audiovisual/` (no en la raíz del repo) |
| Estilos | Un solo `app/globals.css` (~600 líneas) con tokens CSS en `:root`. Sin Tailwind ni CSS Modules |
| Fuentes | `next/font/google` → Space Grotesk (headings, autoalojada, preload automático). Cuerpo: `system-ui` |
| Contenido | JSON en `content/` (`site.json` + `projects/*.json`), leídos con `fs` en build. Media autodetectada por nombre en `public/projects/<slug>/` |
| Imágenes | `next/image` (AVIF/WebP + `srcset` automáticos). Videos vía fachada de YouTube (`youtube-nocookie`) |
| Rutas | `/`, `/proyectos/[slug]` (6, SSG), `not-found`, `sitemap.xml`, `robots.txt`, `opengraph-image.jpg` |
| Dependencias | Solo `next`, `react`, `react-dom`; dev: `eslint`, `eslint-config-next`. Muy liviano ✅ |
| Lint | `eslint` (core-web-vitals) → **0 errores, 0 warnings** |
| Build | `next build` → **OK**, 13 páginas estáticas |
| Tests | **No existen** (ni unitarios ni e2e) |
| CI | No hay workflows de GitHub Actions |
| Despliegue | **Vercel** (inferido: `lib/site-url.js` usa `VERCEL_PROJECT_PRODUCTION_URL`, `.gitignore` incluye `.vercel`). No hay `vercel.json`; el Root Directory en Vercel debe ser `portafolio-audiovisual` — [TODO: confirmar URL de producción] |

---

## 2. Línea base de métricas

Medido sobre `next build && next start` en local (Chromium headless, Lighthouse con throttling simulado). **Los valores en producción pueden diferir** (red real, CDN de Vercel). INP no se puede medir en laboratorio; se reporta TBT como proxy.

### Lighthouse

| Página | Dispositivo | Perf | A11y | Best Pr. | SEO | LCP | CLS | TBT | Peso |
|---|---|---|---|---|---|---|---|---|---|
| `/` | Móvil | **95** | 100 | 100 | 100 | **2.9 s** | 0 | 110 ms | 265 KiB |
| `/` | Escritorio | 100 | 100 | 100 | 100 | 0.6 s | 0 | 0 ms | 347 KiB |
| `/proyectos/hitos-caldas` | Móvil | 100 | 100 | 100 | 100 | 1.9 s | 0 | 40 ms | 261 KiB |
| `/proyectos/hitos-caldas` | Escritorio | 100 | 100 | 100 | 100 | 0.5 s | 0 | 0 ms | 291 KiB |

Oportunidades que reporta Lighthouse (todas menores):
- **LCP móvil del home = 2.9 s**, con **1.15 s de "element render delay"**. El elemento LCP medido es el *logo* del header porque el `h1` y el reel arrancan con `opacity: 0` (animación `fade-up` con retrasos escalonados de hasta 270 ms + 500 ms de duración). La animación de entrada retrasa el LCP real.
- JS no usado: ~28 KiB (runtime de Next; poco margen).
- JS legacy (polyfills): ~13 KiB.
- CSS render-blocking: 1 hoja (~80–120 ms en móvil).
- Imágenes de tarjetas en escritorio: `sizes="33vw"` sobredimensiona (pide 640w para ~360 px CSS) → ~56 KiB desperdiciados.

### axe-core (WCAG 2.0/2.1/2.2 A+AA + best-practice)

| Ancho | Rutas | Violaciones | Revisión manual pendiente |
|---|---|---|---|
| 320 px | 8 | **0** | 0 |
| 768 px | 8 | **0** | 0 |
| 1280 px | 8 | **0** | 1 (`color-contrast` en la flecha `→` decorativa, `aria-hidden`; falso positivo) |

### Contraste calculado manualmente

| Par | Ratio | AA |
|---|---|---|
| Texto secundario (65 %) sobre fondo | 7.10:1 | ✅ |
| Texto secundario sobre tarjeta | 6.49:1 | ✅ |
| `--accent-text` sobre fondo | 6.24:1 | ✅ |
| Blanco sobre botón `--accent` | 4.70:1 | ✅ (justo) |
| Anillo de foco sobre fondo | 5.12:1 | ✅ |
| Bordes (`--border-color`) sobre fondo | 1.42:1 | ⚠️ Solo decorativo; aceptable porque los botones se identifican por su texto |

---

## 3. Hallazgos

Severidad: **Crítico** (bloquea o daña la impresión en los primeros 30 s) · **Alto** (impacto claro, arreglar pronto) · **Medio** · **Bajo** (pulido).

### A11y

| # | Sev. | Hallazgo | Dónde |
|---|---|---|---|
| A1 | Alto | **No hay skip link** ("Saltar al contenido"). Con teclado hay que pasar por logo + 3 links del nav en cada página | `app/layout.js` |
| A2 | Medio | **Menú móvil no se cierra con `Esc`** ni al hacer clic fuera; el foco no vuelve al botón | `components/Header.js` |
| A3 | Medio | **Doble tab-stop por tarjeta** (título enlazado + "Ver proyecto →" apuntan al mismo sitio): 12 paradas para 6 proyectos, y el lector de pantalla anuncia "Ver proyecto" sin contexto | `components/ProjectCard.js` |
| A4 | Medio | **Animaciones de entrada con `opacity: 0`** en hero y en todo `main` (`template.js`). Respeta `prefers-reduced-motion` ✅, pero el contenido es invisible durante ~0.8 s y en capturas/impresión las secciones con `Reveal` quedan ocultas hasta hacer scroll | `globals.css` §11, `Reveal.js`, `template.js` |
| A5 | Bajo | Objetivos táctiles < 24 px de alto: logo (19 px), links del footer (22 px), títulos de tarjeta (23 px). Pasan WCAG 2.5.8 por la excepción de espaciado, pero quedan justos en móvil | `globals.css` |
| A6 | Bajo | Enlaces que abren pestaña nueva (WhatsApp, YouTube, LinkedIn) no lo anuncian | `Footer.js`, `page.js` |
| A7 | Bajo | Al activar la fachada de YouTube, el foco no pasa al `iframe` (se pierde en el `body`) | `VideoPlayer.js` |
| A8 | Bajo | `alt` de galería genérico ("Fotograma 1 de …"). Útil, pero no describe el contenido | `proyectos/[slug]/page.js` |
| A9 | Bajo | En móvil la foto de "Sobre mí" aparece **antes** del `h2` "Sobre mí": el retrato llega sin contexto | `page.js` / `.about-brief` |
| ✅ | — | `lang="es"`, landmarks `header/nav/main/footer`, un solo `h1` por página, jerarquía h1→h2→h3 correcta, foco visible en todo, `aria-expanded/controls` en el menú, `role="status"` en "Copiar correo", `prefers-reduced-motion` respetado (CSS + JS), fachada de YouTube con `aria-label` | — |

### Performance

| # | Sev. | Hallazgo | Dónde |
|---|---|---|---|
| P1 | Medio | **LCP móvil 2.9 s** por la animación `fade-up` del hero (render delay 1.15 s). Es lo único que impide 100 en móvil | `globals.css` §11 |
| P2 | Bajo | `sizes` de tarjetas sobredimensionado en escritorio (33vw vs. ~360 px reales) | `ProjectCard.js` |
| P3 | Bajo | Imágenes fuente pesadas en el repo (7.5 MB; `fallas-de-mercado/still-4.jpg` = 1.1 MB). `next/image` las optimiza al servir, así que **no afecta al visitante**, pero infla el repo y el tiempo de optimización en frío | `public/projects/` |
| P4 | Bajo | Póster del reel de 1920×1080 / 115 KB; aceptable vía `next/image` | `public/reel/poster.jpg` |
| ✅ | — | Fachada de YouTube (no carga ~1 MB de terceros), `next/font` autoalojada con preload, `media-frame` con `aspect-ratio` (CLS = 0), solo 3 dependencias | — |

### UI

| # | Sev. | Hallazgo |
|---|---|---|
| U1 | **Crítico** | **Estética de plantilla**: fondo gris oscuro + azul `#2667FF` + badge-pastilla + h1 de 3 líneas + reel a la derecha es el layout por defecto de miles de portafolios. Nada visual comunica *tu* voz como motion designer (que es justo lo que vendes) |
| U2 | Alto | **El botón de play tapa el texto "REEL 2026"** del póster del reel (el círculo azul cae encima del título). Primera impresión del hero |
| U3 | Alto | **Las tarjetas no muestran al cliente** (IEIE – Universidad Distrital, UMNG, @ryugamedev). El cliente es la señal de credibilidad más fuerte y solo aparece dentro del detalle |
| U4 | Medio | El orden de los proyectos es automático (año ↓, luego alfabético). **No puedes elegir cuál va primero**; hoy abre la cortinilla (portada = una "M" sobre cian, poco representativa) |
| U5 | Medio | Todos los proyectos son `featured`: "Proyectos destacados" = "todos los proyectos". No hay jerarquía (1 caso grande + resto en grid) |
| U6 | Medio | La página de proyecto **termina en seco**: sin "siguiente proyecto", sin CTA de contacto, sin enlace al video en YouTube |
| U7 | Medio | Galería sin ampliación (no se pueden ver los stills en grande) |
| U8 | Bajo | Sistema de espaciado y tipografía existe (tokens) pero hay `style={{}}` inline repetidos en `[slug]/page.js` y `not-found.js` |
| U9 | Bajo | Sitio solo oscuro, sin `color-scheme: dark` declarado → barras de scroll y controles nativos en claro. No hay modo claro (`prefers-color-scheme` ignorado) |
| U10 | Bajo | Sin estado "activo" en el nav ni `:focus-within` en tarjetas (el hover levanta la tarjeta, el foco no) |

### UX (prueba de 10 segundos de un reclutador)

| Pregunta | Respuesta actual | Veredicto |
|---|---|---|
| ¿Quién eres? | Nombre en el logo (pequeño, 16 px) | ⚠️ Débil |
| ¿Qué haces? | Badge + párrafo del hero | ✅ Se entiende |
| ¿Qué buscas / para qué te contrato? | No se dice (¿empleo, freelance, prácticas?, ¿ciudad/remoto?) | ❌ |
| ¿Cuál es tu mejor trabajo? | Reel (bien) + 6 tarjetas sin jerarquía | ⚠️ |
| ¿Cómo te contacto? | "Contactarme" (link de bajo contraste visual) + email/WhatsApp al final | ⚠️ |
| ¿CV / LinkedIn? | Sin CV. LinkedIn solo en footer | ❌ |

| # | Sev. | Hallazgo |
|---|---|---|
| X1 | **Crítico** | **No hay CV descargable** |
| X2 | **Crítico** | No se dice **qué rol/tipo de trabajo buscas ni disponibilidad/ubicación** |
| X3 | Alto | LinkedIn y YouTube solo en el footer; el CTA secundario del hero es un link gris poco visible |
| X4 | Medio | Exposición del número de WhatsApp en el HTML (scrapers/spam). Decisión tuya |
| X5 | Bajo | Handle de YouTube autogenerado (`@juandavidfiquevelasco8680`) se ve poco profesional |

### Copy

| # | Sev. | Hallazgo | Texto actual |
|---|---|---|---|
| C1 | **Crítico** | **Contradicción de titulación** | Hero: "Ingeniero en Multimedia" · Sobre mí: "Estudiante de ingeniería en multimedia" |
| C2 | **Crítico** | **Ningún proyecto tiene resultado/impacto** (vistas, uso por la institución, feedback, plazo, presupuesto, nota) | Todos los `*.json` |
| C3 | Alto | h1 genérico, sin propuesta de valor | "Transformo ideas en experiencias audiovisuales." |
| C4 | Alto | "Sobre mí": relleno y repetición. La frase "transformando/transformar ideas y requerimientos en experiencias visuales … innovadoras" aparece **2 veces**; "adaptabilidad, aprendizaje rápido y resolución de problemas" es cliché; el 3.er párrafo es gramaticalmente incompleto ("Con habilidades en…", "Utilizando software como…") | `content/site.json` |
| C5 | Medio | **Ortografía**: "guión" → **"guion"** (RAE 2010, sin tilde) en 4 lugares; inconsistencia "postproducción" / "posproducción" | `ryu-gamedev.json`, `fallas-de-mercado.json`, categoría |
| C6 | Medio | Anglicismos innecesarios mezclados: "storytelling", "research", "brief", "timing", "pacing", "gags" | Varios JSON |
| C7 | Medio | Contradicciones técnicas que un profesional notaría: "animación **frame-by-frame** con **rig**" (son técnicas distintas); "**largo formato**" para 30 s; "animación **estática**" | `bolsa-ninja.json`, `hitos-caldas.json` |
| C8 | Medio | Título de proyecto en MAYÚSCULAS de clickbait ("NO necesitas programar BIEN para hacer BUENOS JUEGOS") como título de tarjeta; mejor un título descriptivo + el título original como cita | `ryu-gamedev.json` |
| C9 | Medio | "Mi rol" son listas largas de tareas sin priorizar (10+ ítems en Ryu) | Varios JSON |
| C10 | Bajo | "Solución" que solo dice "El trabajo se organizó en cinco fases:" | `ryu-gamedev.json` |
| C11 | Bajo | "normalización de LUFS" / "aplicación de LUFS estándar" → "normalización de sonoridad a −14 LUFS (estándar de YouTube)" [TODO: confirmar valor] | `ryu-gamedev.json` |

### SEO

| # | Sev. | Hallazgo |
|---|---|---|
| S1 | Medio | **Twitter card de proyectos hereda título/descr. del home** (el `og:` sí es del proyecto, el `twitter:` no) | `proyectos/[slug]/page.js` |
| S2 | Medio | Sin **datos estructurados** (`Person`, y `VideoObject`/`CreativeWork` por proyecto) |
| S3 | Medio | `og:image` y sitemap dependen de `VERCEL_PROJECT_PRODUCTION_URL`; `site.json` no tiene `url`. En local apuntan a `localhost:3000` (ok en Vercel, frágil si cambias de host) |
| S4 | Bajo | Sin `manifest`, `apple-touch-icon`, `theme-color`; favicon es el `.ico` por defecto de create-next-app [TODO: verificar] |
| S5 | Bajo | Sin `alternates.canonical` |
| S6 | Bajo | Sitemap sin `lastModified` |
| S7 | Bajo | Meta description del home genérica |
| ✅ | — | Title y description por página, OG image 1200×630, `robots.txt`, `sitemap.xml` con todos los proyectos, 404 personalizada, `lang`, `locale es_CO` |

### Código

| # | Sev. | Hallazgo |
|---|---|---|
| K1 | Medio | **Sin tests ni CI**. Mínimo recomendable: un smoke e2e con Playwright + axe (ya se usó en esta auditoría desde fuera del repo) — requiere tu permiso por ser dependencia dev |
| K2 | Bajo | `README.md` es el boilerplate de create-next-app (un reclutador técnico que abra el repo lo verá) |
| K3 | Bajo | Assets sin usar de la plantilla: `public/next.svg`, `vercel.svg`, `globe.svg`, `file.svg`, `window.svg` |
| K4 | Bajo | Año del copyright fijo (`© 2026`) |
| K5 | Bajo | Estilos inline repetidos en `[slug]/page.js` y `not-found.js` |
| K6 | Bajo | `getProjectBySlug` relee todos los JSON del disco en cada llamada (irrelevante hoy por ser SSG) |
| K7 | Bajo | No hay `.nvmrc`/`engines`; el proyecto depende de Next 16 (Node ≥ 20) |

### Enlaces

- Internos: 8/8 rutas responden 200 (y `/no-existe` → 404 personalizada). ✅
- Externos (LinkedIn, canal y 7 videos de YouTube): **no verificables desde este entorno** (la política de red bloquea youtube.com y linkedin.com). [TODO: confirmar que todos los videos son públicos o "no listados" y que el perfil de LinkedIn carga]

---

## 4. Plan de fases propuesto

| Fase | Contenido principal | Hallazgos | Esfuerzo | Impacto |
|---|---|---|---|---|
| **1 · Accesibilidad** | Skip link, menú con `Esc`/clic fuera/foco de retorno, tarjeta con un solo enlace (área clicable completa), foco al iframe, aviso de pestaña nueva, targets ≥ 24–44 px, orden foto/heading, `color-scheme` | A1–A9 | Bajo (~2 h) | Medio (ya partes de 100/0 violaciones; es pulido real de teclado/lector) |
| **2 · Performance** | Quitar `opacity:0` del LCP (animar solo `transform` o eliminar el retraso en hero), `sizes` correctos, recompresión de fuentes de imagen en el repo, revisar CSS crítico | P1–P4 | Bajo (~1–2 h) | Medio (95 → ~100 móvil) |
| **3 · Rediseño UI/UX** | 2 direcciones visuales a elegir → hero con propuesta de valor + CTAs (CV/LinkedIn/contacto), proyecto destacado grande + grid, cliente visible en tarjetas, orden manual, case study con resultado y "siguiente proyecto", lightbox de galería, sistema tipográfico y tokens claro/oscuro | U1–U10, X1–X3 | **Alto (~1–2 días)** | **Muy alto** |
| **4 · Copy** | Propuesta de valor, bio concreta, proyectos con verbo + qué + resultado, ortografía y tono | C1–C11 | Medio (depende de tus datos) | **Muy alto** |
| **5 · SEO y detalles** | Twitter cards por proyecto, JSON-LD `Person` + `VideoObject`, manifest/iconos/theme-color, canonical, `lastModified`, CV accesible, README, limpieza de assets, año dinámico | S1–S7, K2–K4 | Bajo-medio (~3 h) | Medio |
| **6 · Verificación** | Lighthouse + axe vs. esta línea base, QA 320/768/1280, resumen final | — | Bajo | — |

> Sugerencia: como el mayor impacto está en **Copy (4)** y **UI (3)**, conviene que me pases los datos del bloque de preguntas **antes** de la Fase 3, para diseñar con contenido real y no con placeholders.

---

## 5. Preguntas para ti (datos que no puedo inventar)

1. **Titulación**: ¿eres *estudiante* (¿qué semestre? ¿fecha estimada de grado?) o ya *Ingeniero en Multimedia* graduado? (C1)
2. **Qué buscas**: ¿empleo de tiempo completo, prácticas/pasantía, freelance? ¿Qué roles (editor, motion designer, postproductor, animador 3D…)? ¿Ciudad / remoto? ¿Disponibilidad? (X2)
3. **CV**: ¿tienes un PDF actualizado para subir? (X1)
4. **Resultados por proyecto** (cualquiera que sea real): vistas en YouTube, si la institución lo usa/publicó, feedback del cliente, plazo de entrega, nota o reconocimiento, duración del video. (C2)
5. **Proyecto estrella**: ¿cuál quieres que se vea primero? ¿Y en qué orden el resto? (U4)
6. **Bolsa ninja**: ¿fue animación *pose-to-pose/keyframes con rig* o realmente *frame-by-frame*? (C7)
7. **Ryu**: ¿a cuántos LUFS normalizaste? ¿Tienes permiso para citar las vistas del video? (C11)
8. **Dominio**: ¿cuál es la URL de producción en Vercel / dominio propio? (S3)
9. **Audiencia**: ¿confirmas que apuntas a roles audiovisuales (agencias, productoras, marketing) y no a desarrollo? (Resumen)
10. **WhatsApp público**: ¿lo mantienes visible o prefieres solo email + LinkedIn? (X4)
11. **Tests**: ¿me autorizas a añadir `@playwright/test` + `@axe-core/playwright` como devDependencies para un smoke test e2e + accesibilidad? (K1)

---

## 6. Respuestas del autor (2026-10-05)

| # | Tema | Respuesta | Afecta a |
|---|---|---|---|
| 1 | Titulación | **Estudiante de décimo semestre** de Ingeniería en Multimedia → el hero debe dejar de decir "Ingeniero" | C1 |
| 2 | Objetivo | **Prácticas**, rol principal **editor de video**, **Bogotá o remoto** | X2, C3 |
| 3 | CV | Tiene PDF; pendiente de recibir el archivo → irá en `public/` | X1 |
| 4 | Resultados | Cátedra (IEIE): entregas en **menos de una semana** cada una, para revisión, corrección y publicación en la plataforma de cursos · Ryu: **3.8k vistas** · Cortinilla 25 años: **nota 5.0** · Bolsa ninja: **nota 5.0** · Fallas de mercado: **primer lugar** de la clase, **nota 5.0** | C2 |
| 5 | Orden | 1. Bolsa ninja (estrella) · 2. Introducción a la Cátedra · 3. Hitos de Caldas · 4. Cortinilla 25 años · 5. Fallas de mercado · 6. Ryu | U4, U5 |
| 6 | Técnica Bolsa ninja | **Keyframes sobre rig** (no frame-by-frame) | C7 |
| 7 | Audio Ryu | Normalizado a **−14 LUFS** | C11 |
| 8 | URL producción | `https://juandavidfiquevelasco.vercel.app` → fijar en `site.json` | S3 |
| 9 | WhatsApp | Se mantiene visible | X4 |
| 10 | Tests | Autorizado añadir `@playwright/test` + `@axe-core/playwright` (devDependencies) | K1 |
| — | Enlaces | YouTube `https://www.youtube.com/@juandavidfiquevelasco8680` y LinkedIn `https://www.linkedin.com/in/juandavidfique` confirmados por el autor (coinciden con `site.json`) | Enlaces |

---

## Anexo: metodología

- `npm ci`, `npm run lint`, `npm run build`, `next start` en el puerto 3100.
- Lighthouse (CLI, preset móvil por defecto y `--preset=desktop`) sobre `/` y `/proyectos/hitos-caldas`.
- `@axe-core/playwright` con tags `wcag2a, wcag2aa, wcag21a, wcag21aa, wcag22aa, best-practice` sobre 8 rutas a 320, 768 y 1280 px.
- Script Playwright propio: orden de tabulación y estilo de foco, headings, landmarks, metadatos, tamaño de objetivos, scroll horizontal, `Esc` en menú, `prefers-reduced-motion`, `prefers-color-scheme: light`, errores de consola, capturas completas.
- Contraste calculado con la fórmula de luminancia relativa WCAG sobre los tokens de `globals.css`.
- Las herramientas de auditoría se instalaron en un directorio temporal **fuera del repo**; no se añadió ninguna dependencia al proyecto.

---

## 7. Registro de la Fase 1 (Accesibilidad)

Resueltos: A1 (skip link), A2 (menú: `Esc`, clic fuera, retorno del foco), A3 (un solo enlace por tarjeta, tarjeta completa clicable y con foco visible), A5 (objetivos táctiles ≥ 44 px en logo, nav, footer, botón de menú y "Copiar correo"; áreas ampliadas en "Contactarme" y "Todos los proyectos"), A6 (aviso de pestaña nueva para lectores), A7 (el foco pasa al iframe de YouTube), A9 (el `h2` "Sobre mí" precede a la foto), `color-scheme: dark` + `theme-color`, `aria-label` en el `nav`.
Pendientes por diseño: A4 (animaciones de entrada) se aborda en la Fase 2 junto con el LCP; A8 (alt de galería) se redactará en la Fase 4 con descripciones reales.

| Medida | Antes | Después |
|---|---|---|
| axe (7 rutas × 3 anchos) | 0 violaciones | 0 violaciones (21 pruebas automatizadas) |
| Lighthouse A11y (móvil/escritorio) | 100 / 100 | 100 / 100 |
| Paradas de Tab por tarjeta | 2 | 1 |
| Skip link / `Esc` en menú / foco al iframe | no / no / no | sí / sí / sí |
| Pruebas e2e en el repo | 0 | 27 (`npm run test:e2e`) |

Nota: `npm audit` reporta una vulnerabilidad *high* en `braces` (cadena de `eslint-config-next`, solo desarrollo, no llega al sitio). Corregirla implicaría un cambio mayor de versión, así que no se tocó.

---

## 8. Registro de la Fase 2 (Performance y Core Web Vitals)

Cambios:
- **P1 / A4:** las animaciones de entrada (`page-enter`, `fade-up`) ya no animan `opacity` desde 0, solo `transform`. El contenido está visible desde el primer cuadro; antes el texto del hero no "contaba" para el LCP hasta ~0.8 s después.
- **CSS render-blocking:** `experimental.inlineCss` incrusta el CSS en el HTML (se elimina la hoja externa). *Insight de render-blocking: 0 → sin hallazgos.*
- **P2:** `sizes` de las tarjetas ajustado al ancho real (`360px` en escritorio). *Insight de entrega de imágenes: sin hallazgos.*
- **P3 / P4:** imágenes fuente recomprimidas (máx. 1600 px, JPEG mozjpeg q80): **7.6 MB → 2.8 MB** en `public/`. Mismos nombres y proporción 16:9.
- **K3:** eliminados 5 SVG sin usar de la plantilla de create-next-app.

| Lighthouse móvil (mediana de 3 corridas, local) | Antes | Después |
|---|---|---|
| Home — Perf / A11y / BP / SEO | 95 / 100 / 100 / 100 | **100** / 100 / 100 / 100 (rango 98–100) |
| Home — LCP | 2.9 s | 1.8 s (rango 1.7–2.4 s) |
| Home — CLS | 0 | 0 |
| Home — TBT (proxy de INP) | 110 ms | 50 ms |
| Home — peso transferido | 265 KiB | 273 KiB (sin contar imágenes bajo el pliegue) |
| Página de proyecto — Perf | 100 | 100 (LCP 1.6–2.3 s) |
| Escritorio — todas las categorías | 100 | 100 |

Meta ≥ 95 en las cuatro categorías en móvil: **cumplida**.

Pendiente / no accionable: ~27 KiB de JS "no usado" es el runtime de React/Next (no se puede recortar sin cambiar de stack). La variación de LCP entre corridas (1.7–2.4 s) es ruido del throttling simulado. Las métricas de campo reales (CrUX) solo estarán disponibles con tráfico en producción.

---

## 9. Registro de la Fase 3 (Rediseño UI/UX — opción A "Sala de edición")

Decisiones del autor: opción A; orden de proyectos 1. Introducción a la Cátedra (destacado) · 2. Bolsa ninja · 3. Hitos · 4. Cortinilla · 5. Fallas de mercado · 6. Ryu; CV en PDF sin referencias y con "Estudiante de último semestre" en lugar de "Ingeniero"; logros (hackatón, certificado IEIE) **no** se muestran en el sitio.

**Sistema**
- Tokens de color claro/oscuro (siguen `prefers-color-scheme`), todos ≥ 4.5:1. Acento único "REC" (`#FF5A36` / `#C8381A`).
- Escala tipográfica 12–56 px (~1.4) y espaciado en múltiplos de 4 px.
- Tipografía: Inter Tight 700 para títulos (un solo archivo de ~23 KB); texto y metadatos con fuentes del sistema (`system-ui`, `ui-monospace`). *Desviación de la propuesta:* Inter y JetBrains Mono se descartaron porque sumaban ~85 KB y bajaban el rendimiento móvil a 93–94 (el póster del reel, LCP en móvil, compartía ancho de banda con ellas).

**Estructura y componentes**
- Header fijo con barra de progreso de lectura (CSS puro, oculta con "reducir movimiento") y CTA "Descargar CV".
- Hero: disponibilidad ("Busco prácticas como editor de video · Bogotá o remoto"), titular, párrafo con clientes reales y 3 CTA (CV, Escríbeme, LinkedIn). La píldora "Ver reel" ya no tapa el título del póster (U2).
- Franja de resultados reales: 3.8k vistas · entrega en < 1 semana · nota 5.0 en 3 proyectos.
- Proyectos en mosaico: el primero 2×2, tarjetas tipo "clip" con resultado y duración sobre la miniatura, cliente visible (U3), orden manual con `order` (U4, U5), "playhead" al pasar el cursor o enfocar.
- Sobre mí con línea de estudios y herramientas agrupadas (del CV).
- Contacto con Escríbeme, WhatsApp, LinkedIn, CV y correo copiable.
- Página de proyecto tipo case study: ficha técnica (rol, contexto, resultado, herramientas, duración), video, enlace a YouTube, El reto → Enfoque → Resultado, galería con ampliación (`<dialog>` nativo, flechas, Esc, foco gestionado) (U7), créditos, siguiente proyecto y CTA (U6).
- 404 con el mismo sistema.

**Verificación**

| Medida | Fase 2 | Fase 3 |
|---|---|---|
| Lighthouse móvil home (mediana de 5) | 100 / 100 / 100 / 100 | 97 / 100 / 100 / 100 (rango 96–100) |
| LCP móvil home | 1.8 s (texto) | 2.4 s (póster del reel; observado sin throttling: 0.11 s) |
| Lighthouse móvil proyecto | 100 | 98–99 / 100 / 100 / 100 |
| CLS | 0 | 0 |
| axe (7 rutas × 3 anchos × 2 temas) | 21 pruebas, 0 violaciones | 42 pruebas, 0 violaciones |
| Pruebas e2e | 27 | 51 |

---

## 10. Registro de la Fase 4 (Redacción y contenido)

El antes/después completo, campo por campo, está en [`docs/COPY.md`](./COPY.md).

- **C1:** sin contradicción de titulación: todo el sitio dice "estudiante de último/décimo semestre".
- **C2:** cada proyecto tiene resultado real (nota 5.0, primer lugar, 3.8k vistas, entrega en < 1 semana).
- **C3/C4:** párrafo del hero con clientes reales; "Sobre mí" reescrito en 3 párrafos concretos (qué busco, qué hago bien, qué he hecho), sin repeticiones ni clichés.
- **C5:** "guion" sin tilde; "postproducción" unificado.
- **C6:** anglicismos innecesarios reemplazados (storytelling, research, brief, gags, pacing); se conservan términos técnicos del oficio (keyframes, rig, timing, easing, motion design).
- **C7:** Bolsa ninja: "keyframes sobre rig" (no frame-by-frame), "primer proyecto de animación de personaje" (no "largo formato"); Hitos: sin "animación estática".
- **C8:** el título de Ryu pasa a "Edición de video para @ryugamedev"; el título original del video se cita en el resumen.
- **C9:** "Mi rol" acotado y ordenado por importancia.
- **C10/C11:** fases del video de Ryu reescritas; audio "normalizado a −14 LUFS (el estándar de YouTube)".
- **A8:** cada fotograma de la galería tiene texto alternativo descriptivo (campo `stillAlts`), escrito mirando la imagen.

Hallazgo: el video de "Hitos de Francisco José de Caldas" tenía la errata **"MIEMRBO DE LA EXPEDICIÓN BOTÁNICA"**. *Resuelto:* el autor publicó una versión corregida; el sitio enlaza el nuevo video y usa el fotograma corregido. También se actualizó el link del reel (versión sin el error) y se reescribió la frase del hero.

Verificación: lint y build OK, 51/51 pruebas e2e (axe sin violaciones en ambos temas).

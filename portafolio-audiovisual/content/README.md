# Cómo agregar o editar un proyecto

Cada proyecto es UN archivo en `content/projects/`. No hay que tocar código.

## Agregar un proyecto (5 pasos)

1. Copia un archivo existente (por ejemplo `bolsa-ninja.json`) dentro de la misma carpeta.
2. Renómbralo: **el nombre del archivo es la dirección de la página.**
   `mi-proyecto-nuevo.json` → `/proyectos/mi-proyecto-nuevo`
   Usa minúsculas, guiones en vez de espacios y sin tildes ni ñ.
3. Cambia los valores (deja intactos los nombres de la izquierda).
4. Guarda. Si `npm run dev` está corriendo, recarga el navegador (F5).
5. Si algo está mal, la terminal te dirá qué archivo y qué campo.

## Campos

| Campo | ¿Obligatorio? | Notas |
|---|---|---|
| `title` | Sí | Título del proyecto |
| `category` | Sí | Animación / Motion design educativo / Divulgación / explicativo / Edición y postproducción narrativa |
| `year` | Sí | Número **sin comillas**: `2026` |
| `description` | Sí | Texto corto que sale en la tarjeta del Home |
| `summary` | Sí | Presentación al inicio de la página del proyecto |
| `role` | Sí | Qué hiciste TÚ, específicamente |
| `tools` | Sí | Lista: `["Blender", "Adobe Premiere Pro"]` |
| `context` | No | Línea de contexto: "Cliente: …" o "Proyecto académico — …" |
| `problem` | No | Problema / brief |
| `solution` | No | Solución / enfoque |
| `steps` | No | Lista de fases: `[{ "title": "…", "text": "…" }]` |
| `credits` | No | Lista de créditos: `["Música: …"]` |
| `featured` | No | `true` = aparece en "Proyectos destacados" del Home |
| `youtube` | No | Enlace del video en YouTube ("no listado"). Ver `content/MEDIA.md` |
| `order` | No | Posición en el Home: `1` = tarjeta grande destacada, luego `2`, `3`… Sin `order`, va al final (por año) |
| `client` | No | Cliente o contexto CORTO para la tarjeta, ej. `"IEIE · Universidad Distrital"` |
| `highlight` | No | Resultado en pocas palabras, sale sobre la miniatura: `"Nota 5.0"`, `"3.8k vistas"` |
| `result` | No | Resultado en una frase, sección "Resultado" del caso |
| `stillAlts` | No | Lista con la descripción de cada fotograma (`still-1`, `still-2`…), en el mismo orden. La leen los lectores de pantalla |
| `duration` | No | Duración del video, ej. `"0:30"` o `"~15 min"` |

**Los campos opcionales que no uses, bórralos del archivo.** No los dejes vacíos: si no existen, la página simplemente no dibuja esa sección.

## Imágenes y videos

No van en el JSON: se colocan en `public/projects/<nombre-del-proyecto>/` con nombres fijos (`cover.jpg`, `still-1.jpg`…). Todos los detalles están en `content/MEDIA.md`.

## Datos generales del sitio (`content/site.json`)

Un solo archivo con lo que no es de un proyecto en particular:

- `email`: el correo del botón "Escríbeme".
- `linkedin` y `youtube`: enlaces del hero, contacto y pie de página. Para agregar o quitar una red hay que editar `components/Footer.js`.
- `whatsapp`: tu número con código de país, solo dígitos, sin `+` ni espacios (Colombia: `57` + 10 dígitos, ej. `573001234567`). Si lo dejas vacío (`""`), el enlace de WhatsApp no aparece. `whatsappMessage` es el mensaje que le aparece escrito a quien te escribe.
- `url` (opcional): la dirección de tu sitio, ej. `"https://tu-dominio.com"`. Si no la pones, se toma sola de Vercel; solo úsala si el sitemap o la vista previa muestran una dirección equivocada.
- `reelYoutube`: el enlace de YouTube de tu reel (hero del Home). Si pones archivos propios en `public/reel/` (`reel.mp4`), esos tienen prioridad.
- `about`: el texto de "Sobre mí", un párrafo por línea de la lista. La foto es `public/about.jpg`.
- `name`, `headline`, `lede`, `availability`: nombre, titular, párrafo y disponibilidad del hero.
- `education`: línea de estudios de "Sobre mí".
- `cv`: ruta del CV en PDF (`public/cv/…`). Para actualizarlo, reemplaza el archivo con el mismo nombre.
- `stats`: los 3 datos de la franja bajo el hero (`value` + `label`). Solo datos reales y verificables.
- `skills`: herramientas agrupadas de "Sobre mí".

## Errores típicos de JSON

- **Falta una coma** entre dos líneas, o **sobra una** después de la última línea de un bloque.
- **Comillas dobles dentro de un texto** rompen el archivo. Escríbelas con barra: `\"gags de comedia\"`.
- **Un texto no puede tener saltos de línea.** Va todo en una sola línea, aunque sea larga.
- `"year": "2026"` (con comillas) es un error; debe ser `"year": 2026`.

## Orden

Los proyectos con `order` salen primero, en ese orden (el `1` es la tarjeta grande). Los que no lo tienen van después, del más reciente al más antiguo según `year`.

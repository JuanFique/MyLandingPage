# Guía de multimedia

El sitio detecta tus imágenes y videos **por el nombre del archivo**. No hay que anotar rutas en ningún JSON: si el archivo existe con el nombre correcto, se usa; si no existe, se muestra el espacio reservado de siempre.

## Dónde va cada archivo

Cada proyecto tiene su carpeta en `public/projects/`, con el mismo nombre que su JSON (`hitos-caldas.json` → `public/projects/hitos-caldas/`).

| Archivo | Para qué sirve |
|---|---|
| `cover.jpg` | Imagen principal: sale en la tarjeta del Home y arriba en la página del proyecto. **Opcional:** si no existe, se usa `still-1.jpg` en su lugar |
| `still-1.jpg`, `still-2.jpg`, `still-3.jpg`… | Galería del proyecto, en orden numérico |
| `video.mp4` (y opcional `video.webm`) | Video propio. Solo si NO usas YouTube |
| `public/reel/reel.mp4` (y opcional `reel.webm`) | Reel corto del hero del Home |
| `public/reel/poster.jpg` | Imagen que se ve mientras carga el reel |

- Los nombres van **en minúscula y exactos**. Extensiones de imagen aceptadas: `jpg`, `jpeg`, `png`, `webp`, `avif`.
- **Qué se muestra como imagen o video principal de un proyecto**, en este orden: 1) YouTube, 2) `video.mp4`, 3) `cover.jpg`, 4) el espacio reservado.
- Si un proyecto no tiene nada, se ve exactamente igual que antes. Puedes ir agregando material proyecto por proyecto.

## Imágenes

- **Tamaño:** entre 2000 y 2400 px en el lado largo. No hace falta preparar versiones pequeñas: el sitio genera solo la que necesita cada pantalla.
- **Formato:** JPG con calidad 80–85 (en Photoshop, "Exportar como"). Evita PNG para fotografías o fotogramas: pesan mucho más.
- **Peso:** apunta a menos de 1 MB por imagen.
- **Proporción:** 16:9 es lo ideal. Las tarjetas del Home recortan a 16:10 y la galería a 16:9, siempre desde el centro, así que **deja lo importante al centro** del encuadre.

## Video en YouTube (recomendado para las piezas completas)

1. Sube el video a YouTube con visibilidad **"No listado"**. Recuerda que "no listado" no es privado: cualquiera que tenga el enlace puede verlo.
2. Copia el enlace del video (por ejemplo `https://youtu.be/XXXXXXXXXXX`).
3. En el JSON del proyecto agrega una línea nueva: `"youtube": "https://youtu.be/XXXXXXXXXXX",` (funciona con cualquier tipo de enlace de YouTube).

El reproductor de YouTube **no se descarga hasta que alguien le da play**: al cargar la página solo se ve tu imagen `cover.jpg` con un botón. Esto mantiene el sitio rápido.

Si un video usa material de terceros (como los clips de videojuegos de Ryu GameDev), YouTube puede aplicar reclamos automáticos de derechos de autor. Para esos casos es más seguro enlazar el video que ya está publicado en el canal del cliente.

## Video propio (para piezas cortas y para el reel)

Se hace con **ffmpeg** (en Windows: `winget install ffmpeg` desde una terminal; HandBrake es una alternativa con interfaz gráfica). Sustituye `entrada.mov` por tu archivo.

**Reel del hero** (10–15 s, sin sonido, 720p). Genera las dos versiones: el navegador elige la que mejor reproduce.
```
ffmpeg -i entrada.mov -t 12 -vf "scale=-2:720" -c:v libx264 -crf 24 -preset slow -pix_fmt yuv420p -movflags +faststart -an reel.mp4
ffmpeg -i entrada.mov -t 12 -vf "scale=-2:720" -c:v libvpx-vp9 -crf 36 -b:v 0 -an reel.webm
```

**Imagen de póster del reel** (un fotograma del segundo 1):
```
ffmpeg -i reel.mp4 -ss 00:00:01 -frames:v 1 poster.jpg
```

**Video de proyecto con sonido** (solo piezas cortas, como "Bolsa ninja" de 30 s):
```
ffmpeg -i entrada.mov -vf "scale=-2:720" -c:v libx264 -crf 23 -preset slow -pix_fmt yuv420p -movflags +faststart -c:a aac -b:a 128k video.mp4
```

**Pesos de referencia:** el reel debería quedar por debajo de 3–5 MB. Un video propio solo tiene sentido si pesa menos de unos 20 MB; si es más largo o pesado, usa YouTube. `-crf` controla la calidad: número más alto = archivo más liviano y menos calidad.

## Cómo comprobar que quedó bien

Abre el sitio en Chrome, pulsa `F12` → pestaña **Lighthouse** → "Analyze page load". Mide rendimiento, accesibilidad y SEO. Hazlo sobre el sitio ya publicado, no sobre `npm run dev`: la versión de desarrollo es más lenta a propósito.

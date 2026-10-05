import fs from 'node:fs';
import path from 'node:path';
import { getImageProps } from 'next/image';

// ============================================================
// DETECTOR DE MATERIAL MULTIMEDIA
// El sitio busca archivos con nombres fijos dentro de /public.
// No hay que anotar rutas en ningún JSON: si el archivo existe, se usa.
//
//   public/projects/<slug>/cover.jpg        imagen principal (también .png .webp .avif).
//                                           Opcional: si no existe, se usa still-1 como portada.
//   public/projects/<slug>/still-1.jpg      galería: still-1, still-2, still-3…
//   public/projects/<slug>/video.mp4        video propio (opcional, además .webm)
//   public/reel/reel.mp4                    reel del hero (opcional, además .webm)
//   public/reel/poster.jpg                  imagen que se ve antes de que cargue el reel
//
// Como YouTube va en el JSON del proyecto ("youtube"), aquí solo hay
// archivos propios. Igual que lib/projects.js, esto solo corre en el servidor.
// ============================================================

const PUBLIC_DIR = path.join(process.cwd(), 'public');

const COVER = /^cover\.(jpe?g|png|webp|avif)$/i;
const STILL = /^still-\d+\.(jpe?g|png|webp|avif)$/i;
const POSTER = /^poster\.(jpe?g|png|webp|avif)$/i;

const VIDEO_TYPES = { mp4: 'video/mp4', webm: 'video/webm' };

// Lista los archivos de una carpeta; si la carpeta no existe, devuelve [] (no es un error).
function listFiles(dir) {
  try {
    return fs.readdirSync(dir);
  } catch {
    return [];
  }
}

// Busca "<baseName>.mp4" y "<baseName>.webm". Devuelve las que existan,
// en ese orden: el navegador usa la primera que sepa reproducir.
function findVideoSources(files, baseName, urlPrefix) {
  return ['mp4', 'webm'].flatMap(ext => {
    const file = files.find(f => f.toLowerCase() === `${baseName}.${ext}`);
    return file ? [{ src: `${urlPrefix}/${file}`, type: VIDEO_TYPES[ext] }] : [];
  });
}

// Material de UN proyecto. Nunca falla: si no hay nada, todo viene vacío.
export function findProjectMedia(slug) {
  const urlPrefix = `/projects/${slug}`;
  const files = listFiles(path.join(PUBLIC_DIR, 'projects', slug));

  const explicitCover = files.find(f => COVER.test(f));
  const stills = files
    .filter(f => STILL.test(f))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true })); // still-2 antes que still-10

  // La portada (miniatura de la tarjeta, póster del video) es cover.jpg si existe;
  // si no, el primer still. Así cada proyecto tiene miniatura sin duplicar archivos.
  const cover = explicitCover ?? stills[0];

  return {
    cover: cover ? `${urlPrefix}/${cover}` : null,
    stills: stills.map(f => `${urlPrefix}/${f}`),
    videoSources: findVideoSources(files, 'video', urlPrefix),
  };
}

// Imagen fija del reel (public/reel/poster.jpg). Devuelve null si no existe.
export function findReelPoster() {
  const poster = listFiles(path.join(PUBLIC_DIR, 'reel')).find(f => POSTER.test(f));
  return poster ? `/reel/${poster}` : null;
}

// Reel del hero. Devuelve null si no hay ningún archivo de video.
export function findReel() {
  const files = listFiles(path.join(PUBLIC_DIR, 'reel'));
  const sources = findVideoSources(files, 'reel', '/reel');
  if (sources.length === 0) return null;

  return { sources, poster: findReelPoster() };
}

// Dirección OPTIMIZADA de una imagen para usarla como `poster` de un <video>.
// A diferencia de <Image>, un poster acepta UNA sola dirección (no varios tamaños),
// así que hay que elegir el ancho a mano. Next pide el DOBLE del ancho que le des
// (para pantallas retina) y lo redondea al tamaño estándar siguiente:
//   cssWidth 540 → 1080 px   |   cssWidth 600 → 1200 px
// Pon aquí más o menos la mitad del ancho al que se verá el video en escritorio.
export function getPosterUrl(src, cssWidth) {
  return getImageProps({
    src,
    alt: '',
    width: cssWidth,
    height: Math.round((cssWidth * 9) / 16),
  }).props.src;
}

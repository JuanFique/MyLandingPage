import site from '@/content/site.json';

// Dirección pública del sitio (ej. https://tu-dominio.com), SIN barra final.
// La necesitan el sitemap, el robots.txt y las imágenes para compartir, porque deben
// llevar direcciones completas. Se decide así, en este orden:
//   1. "url" en content/site.json, si la escribes (por ejemplo al comprar tu dominio).
//   2. VERCEL_PROJECT_PRODUCTION_URL: Vercel la entrega solo al compilar y siempre
//      apunta a tu dominio de producción (el propio si lo tienes; si no, el .vercel.app).
//   3. http://localhost:3000, para trabajar en tu computador.
export function getSiteUrl() {
  const fromFile = site.url?.trim();
  if (fromFile) return fromFile.replace(/\/+$/, '');

  const fromVercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (fromVercel) return `https://${fromVercel}`;

  return 'http://localhost:3000';
}

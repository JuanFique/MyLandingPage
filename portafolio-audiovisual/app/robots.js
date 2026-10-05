import { getSiteUrl } from '@/lib/site-url';

// Next convierte esto en /robots.txt: permite que los buscadores lean todo el sitio
// y les indica dónde está el sitemap.
export default function robots() {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${getSiteUrl()}/sitemap.xml`,
  };
}

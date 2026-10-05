import site from '@/content/site.json';

// Next convierte esto en /manifest.webmanifest: lo leen los navegadores móviles
// al "agregar a la pantalla de inicio" y define el nombre y los íconos de la app.
export default function manifest() {
  return {
    name: `${site.name} — ${site.headline}`,
    short_name: 'J. D. Fique',
    description: site.metaDescription,
    lang: 'es',
    start_url: '/',
    display: 'standalone',
    background_color: '#0E0F11',
    theme_color: '#0E0F11',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}

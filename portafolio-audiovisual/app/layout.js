import { Inter_Tight } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import site from '@/content/site.json';
import { getSiteUrl } from '@/lib/site-url';
import { personJsonLd, toJsonLd } from '@/lib/structured-data';
import './globals.css';
import { GoogleAnalytics } from '@next/third-parties/google'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <GoogleAnalytics gaId="G-1BQFME7R2S" />
      </body>
    </html>
  )
}

// next/font descarga la fuente al compilar y la sirve desde tu propio sitio.
// Solo se carga Inter Tight en peso 700 (el único que usan títulos y logo): un archivo
// pequeño. Texto y metadatos usan fuentes del sistema (ver --font-body y --font-mono en
// globals.css), así no compiten por ancho de banda con el póster del reel, que es el LCP en móvil.
const interTight = Inter_Tight({ subsets: ['latin'], weight: '700', variable: '--font-inter-tight' });

// Tema claro/oscuro según el sistema: barras de scroll y controles nativos lo siguen.
export const viewport = {
  colorScheme: 'dark light',
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#1E1E24' },
    { media: '(prefers-color-scheme: light)', color: '#F0F6F6' },
  ],
};

export const metadata = {
  // metadataBase convierte las direcciones relativas (como la imagen para compartir)
  // en direcciones completas, que es lo que exigen WhatsApp, LinkedIn y compañía.
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: `${site.name} — ${site.headline}`,
    template: `%s — ${site.name}`,
  },
  description: site.metaDescription,
  applicationName: site.name,
  authors: [{ name: site.name, url: getSiteUrl() }],
  creator: site.name,
  alternates: { canonical: '/' },
  // Open Graph: lo que se muestra al pegar tu enlace en WhatsApp, LinkedIn, etc.
  // La imagen sale sola de app/opengraph-image.jpg.
  openGraph: {
    title: `${site.name} — ${site.headline}`,
    description: site.metaDescription,
    siteName: site.name,
    locale: 'es_CO',
    type: 'website',
    url: '/',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${site.name} — ${site.headline}`,
    description: site.metaDescription,
  },
};

// El layout envuelve TODAS las páginas: lo que pongas aquí se repite en cada una.
// `children` es la página concreta que se está visitando en ese momento.
export default function RootLayout({ children }) {
  return (
    <html lang="es" className={interTight.variable}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLd(personJsonLd()) }} />
        {/* Skip link: primer elemento enfocable; permite saltar la navegación con teclado. */}
        <a href="#contenido" className="skip-link">Saltar al contenido</a>
        <Header />
        <main id="contenido" tabIndex={-1}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
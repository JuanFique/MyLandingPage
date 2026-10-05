import { Space_Grotesk } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getSiteUrl } from '@/lib/site-url';
import './globals.css';

// next/font descarga la fuente al compilar y la sirve desde tu propio sitio
// (sin pedirla a Google cada vez que alguien entra). `variable` crea una
// variable CSS que usamos en globals.css como --font-heading.
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
});

// Título y descripción que ven Google y las redes sociales.
const title = 'Juan David Fique Velasco — Portafolio audiovisual';
const description = 'Portafolio de Juan David Fique Velasco: producción audiovisual, motion graphics, edición y narrativa visual.';

export const metadata = {
  // metadataBase convierte las direcciones relativas (como la imagen para compartir)
  // en direcciones completas, que es lo que exigen WhatsApp, LinkedIn y compañía.
  metadataBase: new URL(getSiteUrl()),
  title,
  description,
  // Open Graph: lo que se muestra al pegar tu enlace en WhatsApp, LinkedIn, etc.
  // La imagen sale sola de app/opengraph-image.jpg.
  openGraph: {
    title,
    description,
    siteName: 'Juan David Fique Velasco',
    locale: 'es_CO',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title, description },
};

// El layout envuelve TODAS las páginas: lo que pongas aquí se repite en cada una.
// `children` es la página concreta que se está visitando en ese momento.
export default function RootLayout({ children }) {
  return (
    <html lang="es" className={spaceGrotesk.variable}>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
import { Space_Grotesk } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import './globals.css';

// next/font descarga la fuente al compilar y la sirve desde tu propio sitio
// (sin pedirla a Google cada vez que alguien entra). `variable` crea una
// variable CSS que usamos en globals.css como --font-heading.
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
});

// Título y descripción que ven Google y las redes sociales.
export const metadata = {
  title: 'Juan David Fique Velasco — Portafolio audiovisual',
  description: 'Portafolio de Juan David Fique Velasco: producción audiovisual, motion graphics, edición y narrativa visual.',
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
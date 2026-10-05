import site from '@/content/site.json';

// Sin 'use client': no tiene estado ni clics, así que se dibuja en el servidor.
// Los enlaces vienen de content/site.json: para cambiarlos no hace falta tocar este archivo.
export default function Footer() {
  return (
    <footer className="site-footer container">
      <span>© 2026 Juan David Fique Velasco. Todos los derechos reservados.</span>
      <div className="social-links">
        {/* target="_blank" abre en pestaña nueva; rel="noopener noreferrer" es la
            medida de seguridad estándar que debe acompañarlo. */}
        <a href={site.youtube} target="_blank" rel="noopener noreferrer">
          YouTube<span className="sr-only"> (se abre en una pestaña nueva)</span>
        </a>
        <a href={site.linkedin} target="_blank" rel="noopener noreferrer">
          LinkedIn<span className="sr-only"> (se abre en una pestaña nueva)</span>
        </a>
      </div>
    </footer>
  );
}

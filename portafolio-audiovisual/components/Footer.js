import site from '@/content/site.json';

const NEW_TAB = <span className="sr-only"> (se abre en una pestaña nueva)</span>;

// Sin 'use client': no tiene estado, se dibuja en el servidor.
export default function Footer() {
  return (
    <footer className="site-footer container">
      <span>© {new Date().getFullYear()} {site.name}</span>
      <div className="footer-links">
        <a href={site.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn{NEW_TAB}</a>
        <a href={site.youtube} target="_blank" rel="noopener noreferrer">YouTube{NEW_TAB}</a>
        <a href={site.cv} download>CV <span className="sr-only">(PDF)</span></a>
      </div>
    </footer>
  );
}

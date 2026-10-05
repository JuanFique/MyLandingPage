import Link from 'next/link';

// Archivo especial: Next lo muestra cuando alguien visita una URL que no existe
// o cuando una página llama a notFound().
export default function NotFound() {
  return (
    <section className="container not-found">
      <p className="mono">Error 404 · Clip no encontrado</p>
      <h1>Esta página no existe o cambió de lugar.</h1>
      <div className="hero-actions">
        <Link href="/#proyectos" className="btn btn--primary">Ver proyectos</Link>
        <Link href="/" className="btn btn--ghost">Ir al inicio</Link>
      </div>
    </section>
  );
}

import Link from 'next/link';

// Archivo especial: Next lo muestra cada vez que alguien visita una URL
// que no existe, o cuando una página llama a notFound().
export default function NotFound() {
  return (
    <section className="container" style={{ textAlign: 'center' }}>
      <h1 style={{ marginBottom: '1rem' }}>Página no encontrada</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
        La página que buscas no existe o cambió de lugar.
      </p>
      <Link href="/#proyectos" className="btn">Ver proyectos</Link>
    </section>
  );
}
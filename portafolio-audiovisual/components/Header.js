'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import site from '@/content/site.json';

// 'use client' es necesario porque este componente tiene ESTADO (menú abierto/cerrado).
export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef(null);
  const toggleRef = useRef(null);

  const closeMenu = () => setMenuOpen(false);

  // Con el menú abierto: Esc lo cierra (devolviendo el foco al botón) y un clic fuera también.
  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = event => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        toggleRef.current?.focus();
      }
    };
    const onPointerDown = event => {
      if (!headerRef.current?.contains(event.target)) setMenuOpen(false);
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [menuOpen]);

  return (
    <header className="site-header" ref={headerRef}>
      <div className="container nav-bar">
        <Link href="/" className="logo" onClick={closeMenu}>
          <span className="rec-dot" aria-hidden="true" />
          {site.name}
        </Link>

        <button
          ref={toggleRef}
          type="button"
          className="nav-toggle"
          aria-expanded={menuOpen}
          aria-controls="nav-links"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          Menú
        </button>

        <nav id="nav-links" aria-label="Principal" className={menuOpen ? 'nav-links is-open' : 'nav-links'}>
          <Link href="/#proyectos" onClick={closeMenu}>Proyectos</Link>
          <Link href="/#sobre-mi" onClick={closeMenu}>Sobre mí</Link>
          <Link href="/#contacto" onClick={closeMenu}>Contacto</Link>
          <a href={site.cv} className="nav-cv" download onClick={closeMenu}>
            Descargar CV <span className="sr-only">(PDF)</span>
          </a>
        </nav>
      </div>
      {/* Barra de progreso de lectura, puramente decorativa */}
      <div className="scroll-progress" aria-hidden="true" />
    </header>
  );
}

'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

// 'use client' (arriba) es necesario porque este componente tiene ESTADO:
// recuerda si el menú está abierto o cerrado y reacciona a clics.
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
        <Link href="/" className="logo" onClick={closeMenu}>Juan David Fique Velasco</Link>

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
        </nav>
      </div>
    </header>
  );
}

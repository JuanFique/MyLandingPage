'use client';

import { useState } from 'react';
import Link from 'next/link';

// 'use client' (arriba) es necesario porque este componente tiene ESTADO:
// recuerda si el menú está abierto o cerrado y reacciona a clics.
// Sin esa línea, Next lo dibujaría una sola vez en el servidor y el botón no haría nada.
export default function Header() {
  // useState devuelve [valor actual, función para cambiarlo]. Empieza cerrado (false).
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="site-header">
      <div className="container nav-bar">
        <Link href="/" className="logo" onClick={closeMenu}>Juan David Fique Velasco</Link>

        <button
          className="nav-toggle"
          aria-expanded={menuOpen}
          aria-controls="nav-links"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          Menú
        </button>

        <nav id="nav-links" className={menuOpen ? 'nav-links is-open' : 'nav-links'}>
          <Link href="/#proyectos" onClick={closeMenu}>Proyectos</Link>
          <Link href="/#sobre-mi" onClick={closeMenu}>Sobre mí</Link>
          <Link href="/#contacto" onClick={closeMenu}>Contacto</Link>
        </nav>
      </div>
    </header>
  );
}
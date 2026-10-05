'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

// Galería de fotogramas con ampliación.
// Usa <dialog> nativo: atrapa el foco, se cierra con Esc y devuelve el foco al botón
// que lo abrió, sin librerías. Las flechas ← → cambian de imagen.
export default function Gallery({ stills, title, alts = [] }) {
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const [current, setCurrent] = useState(null); // índice abierto, o null

  const open = index => setCurrent(index);

  // Se abre DESPUÉS de dibujar su contenido, y el foco va al botón "Cerrar".
  useEffect(() => {
    const dialog = dialogRef.current;
    if (current !== null && dialog && !dialog.open) {
      dialog.showModal();
      closeRef.current?.focus();
    }
  }, [current]);
  const close = () => dialogRef.current?.close();
  const step = delta => setCurrent(index => (index + delta + stills.length) % stills.length);

  useEffect(() => {
    const dialog = dialogRef.current;
    const onClose = () => setCurrent(null);
    dialog?.addEventListener('close', onClose);
    return () => dialog?.removeEventListener('close', onClose);
  }, []);

  const onKeyDown = event => {
    if (event.key === 'ArrowRight') step(1);
    if (event.key === 'ArrowLeft') step(-1);
  };

  // Clic en el fondo oscuro (fuera del contenido) cierra.
  const onDialogClick = event => {
    if (event.target === dialogRef.current) close();
  };

  // Texto alternativo: la descripción del JSON ("stillAlts") si existe; si no, uno genérico.
  const alt = index => alts[index] ?? `Fotograma ${index + 1} de ${stills.length} de ${title}`;

  return (
    <>
      <ul className="gallery-grid" role="list">
        {stills.map((still, index) => (
          <li key={still}>
            <button type="button" className="gallery-item" onClick={() => open(index)}>
              <span className="media-frame">
                <Image src={still} alt={alt(index)} fill sizes="(min-width: 768px) 280px, 50vw" />
              </span>
              <span className="sr-only">: ampliar</span>
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        className="lightbox"
        aria-label={`Galería de ${title}`}
        onKeyDown={onKeyDown}
        onClick={onDialogClick}
      >
        {current !== null && (
          <>
            <div className="lightbox-bar">
              <p className="mono" aria-live="polite">
                {current + 1} / {stills.length}
              </p>
              <div className="lightbox-controls">
                <button type="button" onClick={() => step(-1)} aria-label="Fotograma anterior">←</button>
                <button type="button" onClick={() => step(1)} aria-label="Fotograma siguiente">→</button>
                <button type="button" onClick={close} ref={closeRef}>Cerrar</button>
              </div>
            </div>
            <div className="media-frame">
              <Image src={stills[current]} alt={alt(current)} fill sizes="96vw" />
            </div>
          </>
        )}
      </dialog>
    </>
  );
}

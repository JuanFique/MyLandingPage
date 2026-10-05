'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

// Vista previa al pasar el cursor por una tarjeta de proyecto: los fotogramas del proyecto
// se suceden sobre la miniatura, sincronizados con la línea de reproducción (CSS).
//
// - Las imágenes NO se descargan al cargar la página: se montan en el primer hover/foco.
// - Con "reducir movimiento" no se activa.
// - En pantallas táctiles (sin hover) no hace nada: se ve la portada de siempre.
export default function ClipPreview({ frames, sizes }) {
  const ref = useRef(null);
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    const card = ref.current?.closest('.clip');
    if (!card || frames.length < 2) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(hover: hover)').matches) return;

    const arm = () => setArmed(true);
    card.addEventListener('pointerenter', arm, { once: true });
    card.addEventListener('focusin', arm, { once: true });
    return () => {
      card.removeEventListener('pointerenter', arm);
      card.removeEventListener('focusin', arm);
    };
  }, [frames.length]);

  return (
    <div ref={ref} className="clip-preview" aria-hidden="true" style={{ '--frames': frames.length }}>
      {armed &&
        frames.map((src, index) => (
          <Image
            key={src}
            src={src}
            alt=""
            fill
            sizes={sizes}
            style={{ animationDelay: `calc(var(--frame-dur) * ${index})` }}
          />
        ))}
    </div>
  );
}

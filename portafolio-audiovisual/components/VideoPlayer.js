'use client';

import { useState } from 'react';
import Image from 'next/image';

// Reproductor de YouTube con "fachada": al cargar la página NO se descarga nada
// de YouTube, solo se ve una imagen con un botón de play. El reproductor real
// (más de 1 MB de scripts de terceros) se carga únicamente si la persona
// hace clic. Es una de las mejoras de rendimiento más grandes que hay.
//   sizes: qué tan ancha se dibuja la imagen (por defecto, ancho completo de página;
//          en el hero, que es la mitad, se pasa un valor menor para no descargar de más).
export default function VideoPlayer({
  youtubeId,
  title,
  poster,
  sizes = '(min-width: 1180px) 1140px, 100vw',
}) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <div className="media-frame">
        {/* youtube-nocookie.com: la versión de YouTube que no instala cookies de seguimiento */}
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`}
          title={`Video: ${title}`}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <div className="media-frame">
      {poster && (
        // alt="" porque la imagen es decorativa: el botón de abajo ya explica qué hay.
        <Image
          src={poster}
          alt=""
          fill
          sizes={sizes}
          preload
        />
      )}
      <button
        type="button"
        className="play-button"
        onClick={() => setPlaying(true)}
        aria-label={`Reproducir video: ${title}`}
      >
        <span>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      </button>
    </div>
  );
}

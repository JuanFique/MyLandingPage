'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

// Reproductor de YouTube con "fachada": al cargar la página NO se descarga nada
// de YouTube, solo se ve una imagen con un botón de play. El reproductor real
// (más de 1 MB de scripts de terceros) se carga únicamente si la persona
// hace clic. Es una de las mejoras de rendimiento más grandes que hay.
//   label: texto visible del botón de play (el nombre accesible incluye el título).
//   sizes: qué tan ancha se dibuja la imagen (por defecto, ancho completo de página;
//          en el hero, que es la mitad, se pasa un valor menor para no descargar de más).
export default function VideoPlayer({
  youtubeId,
  title,
  poster,
  sizes = '(min-width: 1180px) 1140px, 100vw',
  label = 'Reproducir',
}) {
  const [playing, setPlaying] = useState(false);
  const iframeRef = useRef(null);

  // Al activar el play, el botón desaparece: pasamos el foco al reproductor para no
  // dejar a quien usa teclado o lector de pantalla "en el vacío".
  useEffect(() => {
    if (playing) iframeRef.current?.focus();
  }, [playing]);

  if (playing) {
    return (
      <div className="media-frame">
        {/* youtube-nocookie.com: la versión de YouTube que no instala cookies de seguimiento */}
        <iframe
          ref={iframeRef}
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
          fetchPriority="high"
        />
      )}
      <button
        type="button"
        className="play-button"
        onClick={() => setPlaying(true)}
        aria-label={`${label}: ${title}`}
      >
        <span className="play-pill" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
          <span className="play-label">{label}</span>
        </span>
      </button>
    </div>
  );
}

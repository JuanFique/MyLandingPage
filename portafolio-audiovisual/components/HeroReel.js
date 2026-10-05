'use client';

import { useEffect, useRef, useSyncExternalStore } from 'react';

// --- Leer la preferencia "reducir movimiento" del sistema ---
// useSyncExternalStore es la herramienta de React para leer algo que vive
// FUERA de React (aquí, un ajuste del sistema operativo) y re-dibujar si cambia.
function subscribeToReducedMotion(onChange) {
  const query = window.matchMedia('(prefers-reduced-motion: reduce)');
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}
const getReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const getReducedMotionOnServer = () => false; // en el servidor no hay ajuste que leer

// Reel corto en bucle y sin sonido para el hero.
//   - Solo se reproduce cuando está en pantalla (ahorra batería y datos).
//   - Si el sistema pidió "reducir movimiento", NO se reproduce solo:
//     se muestra la imagen fija y aparecen controles para que la persona elija.
export default function HeroReel({ sources, poster }) {
  const videoRef = useRef(null);
  const reduceMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotion,
    getReducedMotionOnServer
  );

  useEffect(() => {
    const video = videoRef.current;

    if (reduceMotion) {
      video.pause();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {}); // el navegador puede negarse; no pasa nada
        } else {
          video.pause();
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [reduceMotion]);

  return (
    <div className="media-frame">
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        preload="metadata"
        poster={poster}
        controls={reduceMotion}
        aria-label="Reel de proyectos, sin sonido"
      >
        {sources.map(source => (
          <source key={source.src} src={source.src} type={source.type} />
        ))}
      </video>
    </div>
  );
}

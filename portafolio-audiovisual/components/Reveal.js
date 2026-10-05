'use client';

import { useEffect, useRef, useState } from 'react';

// Envuelve cualquier contenido y lo hace aparecer suavemente cuando el
// visitante llega a él con el scroll.
//
// Diseño defensivo — el contenido SIEMPRE es visible salvo que todo esto se cumpla:
//   1. JavaScript está funcionando (este código corre solo en el navegador).
//   2. La persona NO pidió "reducir movimiento" en su sistema.
//   3. El elemento está todavía por debajo de la pantalla al cargar.
// Así no hay parpadeos, ni contenido invisible si algo falla.
export default function Reveal({ children, delay = 0 }) {
  const ref = useRef(null);

  // 'visible' = estado inicial (también el que llega en el HTML del servidor)
  // 'hidden'  = esperando su turno, invisible
  // 'shown'   = ya apareció
  const [state, setState] = useState('visible');

  useEffect(() => {
    const element = ref.current;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Si ya está en pantalla (o arriba de ella), no se oculta.
    if (element.getBoundingClientRect().top < window.innerHeight) return;

    setState('hidden');

    // IntersectionObserver avisa cuando el elemento entra en pantalla,
    // sin tener que escuchar el scroll a cada pixel.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState('shown');
          observer.disconnect(); // aparece una sola vez
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const stateClass = state === 'hidden' ? 'reveal--hidden' : state === 'shown' ? 'reveal--shown' : '';

  return (
    <div
      ref={ref}
      className={['reveal', stateClass].filter(Boolean).join(' ')}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

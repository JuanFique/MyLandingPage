import Image from 'next/image';
import { preload } from 'react-dom';
import HeroReel from '@/components/HeroReel';
import ProjectCard from '@/components/ProjectCard';
import CopyEmail from '@/components/CopyEmail';
import Reveal from '@/components/Reveal';
import VideoPlayer from '@/components/VideoPlayer';
import site from '@/content/site.json';
import { findReel, findReelPoster, getPosterUrl } from '@/lib/media';
import { extractYoutubeId, getAllProjects } from '@/lib/projects';

export default function Home() {
  // Enlace directo a WhatsApp (formato oficial wa.me). Solo existe si pones tu número en
  // content/site.json ("whatsapp": código de país + número, solo dígitos). El mensaje es opcional.
  const whatsappUrl = site.whatsapp
    ? `https://wa.me/${site.whatsapp}` +
      (site.whatsappMessage ? `?text=${encodeURIComponent(site.whatsappMessage)}` : '')
    : null;

  // Los proyectos vienen de los archivos content/projects/*.json.
  // El .filter() es el mismo de siempre: solo los marcados como destacados.
  const featuredProjects = getAllProjects().filter(project => project.featured);

  // Reel del hero. Orden de prioridad:
  //   1. Archivos propios en public/reel/ (reel.mp4 / reel.webm): se reproduce solo, en bucle.
  //   2. Enlace de YouTube en content/site.json ("reelYoutube"): imagen con botón de play.
  //   3. Placeholder, si no hay ninguno de los dos.
  const reel = findReel();
  const reelYoutubeId = site.reelYoutube ? extractYoutubeId(site.reelYoutube) : null;

  // Imagen del reel de YouTube: tu public/reel/poster.jpg si existe; si no, la
  // miniatura que YouTube genera para el video.
  const reelYoutubePoster = reelYoutubeId
    ? findReelPoster() ?? `https://i.ytimg.com/vi/${reelYoutubeId}/maxresdefault.jpg`
    : undefined;

  // El `poster` de un <video> no puede ser un componente <Image>:
  // getPosterUrl nos da la dirección de la versión optimizada (en escritorio el reel mide ~540 px).
  const reelPoster = reel?.poster ? getPosterUrl(reel.poster, 540) : undefined;

  // En celular el reel es lo más grande de la pantalla (LCP). Este preload le dice al
  // navegador que descargue su póster de inmediato y con prioridad alta.
  if (reelPoster) {
    preload(reelPoster, { as: 'image', fetchPriority: 'high' });
  }

  // Un componente solo puede devolver UN elemento raíz; <>...</> es un
  // contenedor invisible para poder devolver varias secciones seguidas.
  return (
    <>
      {/* HERO */}
      <section className="hero container">
        <div className="hero-content">
          <span className="hero-badge">Producción audiovisual · Motion &amp; narrativa</span>
          <h1>Transformo ideas en experiencias audiovisuales.</h1>
          <p>
            Ingeniero en Multimedia enfocado en producción audiovisual, motion graphics,
            edición y narrativa visual — no solo edito video, dirijo cómo se cuenta una historia.
          </p>
          <div className="hero-actions">
            <a href="#proyectos" className="btn">Ver proyectos</a>
            <a href="#contacto" className="link-underline">Contactarme</a>
          </div>
        </div>
        <div className="hero-media">
          {reel ? (
            <HeroReel sources={reel.sources} poster={reelPoster} />
          ) : reelYoutubeId ? (
            <VideoPlayer
              youtubeId={reelYoutubeId}
              title="Reel de Juan David Fique Velasco"
              poster={reelYoutubePoster}
              sizes="(min-width: 900px) 50vw, 100vw"
            />
          ) : (
            <div className="media-placeholder" style={{ minHeight: 280 }}>
              Reel corto (pendiente)
            </div>
          )}
        </div>
      </section>

      {/* PROYECTOS DESTACADOS */}
      <section id="proyectos" className="container">
        <Reveal>
          <div className="section-title">
            <h2>Proyectos destacados</h2>
          </div>
        </Reveal>
        <div className="project-grid">
          {/* .map() dentro del JSX: una tarjeta por proyecto.
              `key` ayuda a React a distinguir cada elemento de la lista.
              `delay` escalona la aparición de las tarjetas de una misma fila. */}
          {featuredProjects.map((project, index) => (
            <Reveal key={project.slug} delay={(index % 3) * 100}>
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* SOBRE MÍ (extracto) */}
      <section id="sobre-mi" className="container">
        <Reveal>
          <h2 className="about-heading">Sobre mí</h2>
          <div className="about-brief">
            <div className="about-photo">
              <Image
                src="/about.jpg"
                alt="Retrato de Juan David Fique Velasco"
                fill
                sizes="280px"
              />
            </div>
            <div className="about-text">
              {/* El texto vive en content/site.json ("about"): un párrafo por elemento. */}
              {site.about.map(paragraph => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* CONTACTO */}
      <section id="contacto" className="container">
        <Reveal>
          <div className="contact-cta">
            <h2>¿Trabajamos juntos?</h2>
            <div className="hero-actions">
              <a href={`mailto:${site.email}`} className="btn">Escríbeme</a>
              {whatsappUrl && (
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="link-underline">
                  WhatsApp<span className="sr-only"> (se abre en una pestaña nueva)</span>
                </a>
              )}
            </div>
            <CopyEmail email={site.email} />
          </div>
        </Reveal>
      </section>
    </>
  );
}

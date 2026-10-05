import Image from 'next/image';
import { preload } from 'react-dom';
import HeroReel from '@/components/HeroReel';
import ProjectCard from '@/components/ProjectCard';
import ToolTag from '@/components/ToolTag';
import CopyEmail from '@/components/CopyEmail';
import Reveal from '@/components/Reveal';
import VideoPlayer from '@/components/VideoPlayer';
import site from '@/content/site.json';
import { findReel, findReelPoster, getPosterUrl } from '@/lib/media';
import { extractYoutubeId, getAllProjects } from '@/lib/projects';

const NEW_TAB = <span className="sr-only"> (se abre en una pestaña nueva)</span>;

function DownloadIcon() {
  return (
    <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M12 4v11m0 0-4-4m4 4 4-4M5 20h14" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Home() {
  // Enlace directo a WhatsApp (formato oficial wa.me), solo si hay número en content/site.json.
  const whatsappUrl = site.whatsapp
    ? `https://wa.me/${site.whatsapp}` +
      (site.whatsappMessage ? `?text=${encodeURIComponent(site.whatsappMessage)}` : '')
    : null;

  // Proyectos marcados como destacados, en el orden definido por "order" en cada JSON.
  // El primero es la tarjeta grande del mosaico.
  const projects = getAllProjects().filter(project => project.featured);

  // Reel del hero. Prioridad: archivos propios en public/reel/ → YouTube ("reelYoutube") → placeholder.
  const reel = findReel();
  const reelYoutubeId = site.reelYoutube ? extractYoutubeId(site.reelYoutube) : null;
  const reelYoutubePoster = reelYoutubeId
    ? findReelPoster() ?? `https://i.ytimg.com/vi/${reelYoutubeId}/maxresdefault.jpg`
    : undefined;
  const reelPoster = reel?.poster ? getPosterUrl(reel.poster, 540) : undefined;
  if (reelPoster) {
    preload(reelPoster, { as: 'image', fetchPriority: 'high' });
  }

  return (
    <>
      {/* HERO: quién soy, qué busco y cómo contactarme, en la primera pantalla */}
      <section className="hero container">
        <div className="hero-content">
          <p className="eyebrow mono">
            <span className="rec-dot" aria-hidden="true" />
            {site.availability}
          </p>
          <h1>{site.headline}<span className="accent" aria-hidden="true">.</span></h1>
          <p className="hero-lede">{site.lede}</p>
          <div className="hero-actions">
            <a href={site.cv} className="btn btn--primary" download>
              <DownloadIcon />
              Descargar CV <span className="sr-only">(PDF)</span>
            </a>
            <a href="#contacto" className="btn btn--ghost">Escríbeme</a>
            <a href={site.linkedin} className="text-link" target="_blank" rel="noopener noreferrer">
              LinkedIn <span className="arrow" aria-hidden="true">↗</span>{NEW_TAB}
            </a>
          </div>
        </div>

        <div className="hero-media">
          {reel ? (
            <HeroReel sources={reel.sources} poster={reelPoster} />
          ) : reelYoutubeId ? (
            <VideoPlayer
              youtubeId={reelYoutubeId}
              title={`Demo reel de ${site.name}`}
              poster={reelYoutubePoster}
              label="Ver reel"
              sizes="(min-width: 1180px) 600px, (min-width: 960px) 52vw, 100vw"
            />
          ) : (
            <div className="media-placeholder" style={{ minHeight: 280 }}>Reel corto (pendiente)</div>
          )}
          <p className="timecode mono" aria-hidden="true">
            <span>Demo reel</span>
            <span>2026</span>
          </p>
        </div>
      </section>

      {/* RESULTADOS: datos reales, verificables, en una línea */}
      <div className="container">
        <dl className="stats">
          {site.stats.map(stat => (
            <div className="stat" key={stat.label}>
              <dt>{stat.label}</dt>
              <dd>{stat.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* PROYECTOS */}
      <section id="proyectos" className="container" aria-labelledby="proyectos-title">
        <div className="section-head">
          <h2 id="proyectos-title">Proyectos</h2>
          <p className="mono">{projects.length} piezas · edición, motion y 3D</p>
        </div>
        <div className="project-grid">
          {projects.map((project, index) => (
            <Reveal key={project.slug} delay={index === 0 ? 0 : ((index - 1) % 3) * 80}>
              <ProjectCard project={project} featured={index === 0} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* SOBRE MÍ */}
      <section id="sobre-mi" className="container" aria-labelledby="sobre-mi-title">
        <Reveal>
          <div className="about">
            <div className="about-photo">
              <Image src="/about.jpg" alt={`Retrato de ${site.name}`} fill sizes="320px" />
            </div>
            <div className="about-text">
              <h2 id="sobre-mi-title">Sobre mí</h2>
              <p className="about-education">{site.education}</p>
              {site.about.map(paragraph => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              <dl className="skills">
                {site.skills.map(skill => (
                  <div key={skill.group}>
                    <dt className="mono">{skill.group}</dt>
                    <dd>
                      <ul className="track-list" role="list">
                        {skill.tools.map(tool => (
                          <ToolTag key={tool} name={tool} />
                        ))}
                      </ul>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </Reveal>
      </section>

      {/* CONTACTO */}
      <section id="contacto" className="container" aria-labelledby="contacto-title">
        <Reveal>
          <div className="contact">
            <p className="eyebrow mono">
              <span className="rec-dot" aria-hidden="true" />
              {site.availability}
            </p>
            <h2 id="contacto-title">¿Tienes una vacante de prácticas en edición de video?</h2>
            <div className="contact-actions">
              <a href={`mailto:${site.email}`} className="btn btn--primary">Escríbeme</a>
              {whatsappUrl && (
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn btn--ghost">
                  WhatsApp{NEW_TAB}
                </a>
              )}
              <a href={site.linkedin} target="_blank" rel="noopener noreferrer" className="btn btn--ghost">
                LinkedIn{NEW_TAB}
              </a>
              <a href={site.cv} className="btn btn--ghost" download>
                <DownloadIcon />
                CV <span className="sr-only">(PDF)</span>
              </a>
            </div>
            <CopyEmail email={site.email} />
          </div>
        </Reveal>
      </section>
    </>
  );
}

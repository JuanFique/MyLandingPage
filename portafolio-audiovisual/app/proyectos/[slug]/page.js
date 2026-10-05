import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Gallery from '@/components/Gallery';
import Reveal from '@/components/Reveal';
import VideoPlayer from '@/components/VideoPlayer';
import site from '@/content/site.json';
import { getPosterUrl } from '@/lib/media';
import { getAllProjects, getNextProject, getProjectBySlug } from '@/lib/projects';

const NEW_TAB = <span className="sr-only"> (se abre en una pestaña nueva)</span>;

// Elige qué mostrar como media principal, en este orden de prioridad:
//   1. Video de YouTube (campo "youtube" del JSON) → reproductor con fachada
//   2. Video propio (public/projects/<slug>/video.mp4 o .webm)
//   3. Imagen de portada (cover.jpg)
//   4. Placeholder (mientras aún no hay material)
function MainMedia({ project }) {
  const { cover, videoSources } = project.media;

  if (project.youtubeId) {
    return <VideoPlayer youtubeId={project.youtubeId} title={project.title} poster={cover} />;
  }

  if (videoSources.length > 0) {
    // El poster de un <video> no puede ser <Image>; getPosterUrl da la versión optimizada.
    const poster = cover ? getPosterUrl(cover, 600) : undefined;

    return (
      <div className="media-frame">
        {/* preload="none": el navegador no descarga el video hasta que alguien le da play */}
        <video controls playsInline preload="none" poster={poster}>
          {videoSources.map(source => (
            <source key={source.src} src={source.src} type={source.type} />
          ))}
        </video>
      </div>
    );
  }

  if (cover) {
    return (
      <div className="media-frame">
        {/* `preload`: esta imagen suele ser lo más grande de la página (LCP),
            así que le pedimos al navegador que la descargue cuanto antes. */}
        <Image
          src={cover}
          alt={`Imagen de ${project.title}`}
          fill
          sizes="(min-width: 1180px) 1140px, 100vw"
          preload
        />
      </div>
    );
  }

  return (
    <div className="media-placeholder" style={{ minHeight: 380 }}>
      Video o imagen principal (pendiente)
    </div>
  );
}

// 1. Le dice a Next QUÉ páginas construir al compilar el sitio:
//    una por cada archivo de content/projects/. Si agregas un archivo
//    nuevo, su página aparece sola en la próxima compilación.
export function generateStaticParams() {
  return getAllProjects().map(project => ({ slug: project.slug }));
}

// 2. El título y la descripción de CADA página (lo que ve Google
//    y lo que se muestra al compartir el enlace).
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) return {};

  const title = `${project.title} — Juan David Fique Velasco`;
  const cover = project.media.cover;

  return {
    title,
    description: project.summary,
    // Al compartir ESTE proyecto, la vista previa usa su propia portada (versión optimizada
    // de ~1200 px, liviana). Sin portada no se define nada aquí y vale la imagen general.
    ...(cover && {
      openGraph: {
        title,
        description: project.summary,
        type: 'website',
        images: [{ url: getPosterUrl(cover, 600), width: 1200, height: 675 }],
      },
    }),
  };
}

// 3. La página: un "case study" — ficha técnica, reto → enfoque → resultado, galería,
//    y al final el siguiente proyecto y una invitación a contactar.
export default async function ProjectPage({ params }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug); // undefined si no existe

  if (!project) {
    notFound();
  }

  const next = getNextProject(slug);
  const youtubeUrl = project.youtubeId ? `https://www.youtube.com/watch?v=${project.youtubeId}` : null;

  return (
    <>
      <section className="case-header container" aria-labelledby="case-title">
        <Link href="/#proyectos" className="text-link back-link">← Todos los proyectos</Link>
        <p className="clip-meta mono">
          <span>{project.category}</span>
          <span>{project.year}</span>
        </p>
        <h1 id="case-title">{project.title}</h1>
        <p className="case-lede">{project.summary}</p>

        <dl className="case-facts">
          <div className="fact-role">
            <dt className="mono">Mi rol</dt>
            <dd>{project.role}</dd>
          </div>
          {project.context && (
            <div>
              <dt className="mono">Contexto</dt>
              <dd>{project.context.replace(/^Cliente:\s*/, '')}</dd>
            </div>
          )}
          {project.highlight && (
            <div className="fact-result">
              <dt className="mono">Resultado</dt>
              <dd>{project.highlight}</dd>
            </div>
          )}
          <div>
            <dt className="mono">Herramientas</dt>
            <dd>
              <ul className="track-list" role="list">
                {project.tools.map(tool => (
                  <li className="track" key={tool}>{tool}</li>
                ))}
              </ul>
            </dd>
          </div>
          {project.duration && (
            <div>
              <dt className="mono">Duración</dt>
              <dd>{project.duration}</dd>
            </div>
          )}
        </dl>
      </section>

      {/* Sin <Reveal>: la media principal debe estar presente desde el primer momento */}
      <section className="case-media container" aria-label="Video del proyecto">
        <MainMedia project={project} />
        {youtubeUrl && (
          <p className="timecode mono">
            <span>{project.duration ?? ''}</span>
            <a href={youtubeUrl} className="text-link" target="_blank" rel="noopener noreferrer">
              Ver en YouTube <span className="arrow" aria-hidden="true">↗</span>{NEW_TAB}
            </a>
          </p>
        )}
      </section>

      <section className="container">
        <div className="case-sections">
          {project.problem && (
            <Reveal>
              <div className="case-section">
                <h2>El reto</h2>
                <p>{project.problem}</p>
              </div>
            </Reveal>
          )}

          {project.solution && (
            <Reveal>
              <div className="case-section">
                <h2>Enfoque</h2>
                <div>
                  <p>{project.solution}</p>
                  {project.steps && (
                    <ol className="steps-list">
                      {project.steps.map(step => (
                        <li key={step.title}>
                          <strong>{step.title}</strong> — {step.text}
                        </li>
                      ))}
                    </ol>
                  )}
                </div>
              </div>
            </Reveal>
          )}

          {project.result && (
            <Reveal>
              <div className="case-section">
                <h2>Resultado</h2>
                <p className="result-callout">
                  <span className="rec-dot" aria-hidden="true" />
                  {project.result}
                </p>
              </div>
            </Reveal>
          )}

          {project.media.stills.length > 0 && (
            <Reveal>
              <div className="case-section">
                <h2>Fotogramas</h2>
                <Gallery stills={project.media.stills} title={project.title} alts={project.stillAlts} />
              </div>
            </Reveal>
          )}

          {project.credits && (
            <Reveal>
              <div className="case-section">
                <h2>Créditos</h2>
                <ul className="credits-list" role="list">
                  {project.credits.map(credit => (
                    <li key={credit}>{credit}</li>
                  ))}
                </ul>
              </div>
            </Reveal>
          )}
        </div>
      </section>

      <section className="container" aria-label="Seguir explorando">
        <div className="case-next">
          {next && next.slug !== project.slug && (
            <article className="next-card">
              <div className="media-frame">
                {next.media.cover && <Image src={next.media.cover} alt="" fill sizes="240px" />}
              </div>
              <div>
                <p className="mono">Siguiente proyecto</p>
                <h2>
                  <Link href={`/proyectos/${next.slug}`}>{next.title}</Link>
                </h2>
              </div>
            </article>
          )}
          <div className="contact">
            <h2>¿Te sirve este perfil para tu equipo?</h2>
            <div className="contact-actions">
              <Link href="/#contacto" className="btn btn--primary">Contactarme</Link>
              <a href={site.cv} className="btn btn--ghost" download>
                Descargar CV <span className="sr-only">(PDF)</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

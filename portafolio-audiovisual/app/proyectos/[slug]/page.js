import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Reveal from '@/components/Reveal';
import VideoPlayer from '@/components/VideoPlayer';
import { getPosterUrl } from '@/lib/media';
import { getAllProjects, getProjectBySlug } from '@/lib/projects';

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

// 3. La página. `params` trae la parte variable de la URL:
//    en /proyectos/hitos-caldas → { slug: 'hitos-caldas' }.
//    Es una promesa en las versiones recientes de Next, por eso el `await`.
export default async function ProjectPage({ params }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug); // undefined si no existe

  // Si el slug no corresponde a ningún proyecto, muestra la página 404.
  if (!project) {
    notFound();
  }

  // En JSX, `condición && <html>` dibuja el html solo si la condición se cumple:
  // es el mismo patrón de "campo opcional" de la Fase 2, con otra sintaxis.
  return (
    <>
      <section className="project-header container">
        <Link href="/#proyectos" className="back-link">← Todos los proyectos</Link>

        <div className="project-meta">
          <span>{project.category}</span>
          <span>{project.year}</span>
        </div>
        <h1>{project.title}</h1>
        {project.context && <p className="project-client">{project.context}</p>}
        <p className="project-summary">{project.summary}</p>

        <div className="role-callout">
          <span className="label">Mi rol</span>
          <p>{project.role}</p>
        </div>
      </section>

      {/* Sin <Reveal>: la media principal debe estar presente desde el primer momento */}
      <section className="container">
        <MainMedia project={project} />
      </section>

      {(project.problem || project.solution) && (
        <section className="container">
          <Reveal>
            <div className="two-col">
              {project.problem && (
                <div>
                  <h2>Problema / brief</h2>
                  <p>{project.problem}</p>
                </div>
              )}
              {project.solution && (
                <div>
                  <h2>Solución / enfoque</h2>
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
              )}
            </div>
          </Reveal>
        </section>
      )}

      <section className="container">
        <Reveal>
          <h2 style={{ marginBottom: '0.75rem', fontSize: '1rem' }}>Herramientas</h2>
          <div className="tools-list">
            {project.tools.map(tool => (
              <span className="tag" key={tool}>{tool}</span>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="container">
        <Reveal>
          <h2 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Galería</h2>
          <div className="gallery-grid">
            {project.media.stills.length > 0
              ? project.media.stills.map((still, index) => (
                  <div className="media-frame" key={still}>
                    <Image
                      src={still}
                      alt={`Fotograma ${index + 1} de ${project.title}`}
                      fill
                      sizes="(min-width: 768px) 25vw, 50vw"
                    />
                  </div>
                ))
              : [1, 2, 3, 4].map(n => (
                  <div className="media-placeholder" key={n}>Still {n}</div>
                ))}
          </div>
        </Reveal>
      </section>

      {project.credits && (
        <section className="container">
          <Reveal>
            <h2 style={{ marginBottom: '0.75rem', fontSize: '1rem' }}>Créditos</h2>
            <ul className="credits-list">
              {project.credits.map(credit => (
                <li key={credit}>{credit}</li>
              ))}
            </ul>
          </Reveal>
        </section>
      )}
    </>
  );
}

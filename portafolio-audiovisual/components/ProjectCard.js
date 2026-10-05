import Link from 'next/link';
import Image from 'next/image';
import ClipPreview from '@/components/ClipPreview';
import ToolTag from '@/components/ToolTag';

// Tarjeta tipo "clip": miniatura con duración y resultado, metadatos en mono.
// `featured` = la tarjeta grande del mosaico (título mayor y herramientas visibles).
export default function ProjectCard({ project, featured = false }) {
  const detailUrl = `/proyectos/${project.slug}`;
  const sizes = featured
    ? '(min-width: 1180px) 760px, (min-width: 1024px) 64vw, 100vw'
    : '(min-width: 1180px) 360px, (min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw';

  return (
    <article className={featured ? 'clip clip--featured' : 'clip'}>
      <div className="clip-thumb media-frame">
        {project.media.cover ? (
          // alt="" porque el título (justo debajo) ya nombra el proyecto.
          <Image src={project.media.cover} alt="" fill sizes={sizes} />
        ) : (
          <div className="media-placeholder">IMG — {project.title}</div>
        )}
        <ClipPreview frames={project.media.stills} sizes={sizes} />
        {project.highlight && (
          <span className="clip-tag clip-tag--result">
            <span className="rec-dot" aria-hidden="true" />
            {project.highlight}
          </span>
        )}
        {project.duration && (
          <span className="clip-tag clip-tag--duration">
            <span className="sr-only">Duración: </span>
            {project.duration}
          </span>
        )}
      </div>

      <div className="clip-meta mono">
        <span>{project.client ?? project.category}</span>
        <span>{project.year}</span>
      </div>

      <h3 className="clip-title">
        <Link href={detailUrl}>{project.title}</Link>
      </h3>

      <p className="clip-desc">{project.description}</p>

      {featured && (
        <ul className="track-list" role="list" aria-label="Herramientas">
          {project.tools.map(tool => (
            <ToolTag key={tool} name={tool} />
          ))}
        </ul>
      )}

      {/* Texto visual, no enlace: toda la tarjeta se activa desde el enlace del título. */}
      <span className="text-link clip-cta" aria-hidden="true">
        Ver caso <span className="arrow">→</span>
      </span>
    </article>
  );
}

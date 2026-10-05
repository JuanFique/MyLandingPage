import Link from 'next/link';
import Image from 'next/image';

// Esto es tu createProjectCard(project) de la Fase 2, convertido en componente.
// `{ project }` recibe la "prop" que le pasa quien lo usa:  <ProjectCard project={...} />
export default function ProjectCard({ project }) {
  const detailUrl = `/proyectos/${project.slug}`;

  return (
    <article className="project-card">
      {project.media.cover ? (
        <div className="media-frame">
          {/* `sizes` le dice al navegador qué tan ancha se dibujará la imagen (1/3 de la
              pantalla en escritorio, todo el ancho en móvil) para que descargue una versión
              del tamaño justo y no la original. alt="" porque el título aparece justo debajo. */}
          <Image
            src={project.media.cover}
            alt=""
            fill
            sizes="(min-width: 1180px) 360px, (min-width: 768px) 30vw, 100vw"
          />
        </div>
      ) : (
        <div className="media-placeholder">IMG — {project.title}</div>
      )}
      <div className="project-meta">
        <span>{project.category}</span>
        <span>{project.year}</span>
      </div>
      <h3 className="project-title">
        <Link href={detailUrl}>{project.title}</Link>
      </h3>
      <p className="project-desc">{project.description}</p>
      {/* Texto visual, no enlace: toda la tarjeta se activa desde el enlace del título
          (ver .project-title a::after). Así hay una sola parada de teclado por tarjeta. */}
      <span className="link-underline" aria-hidden="true">
        Ver proyecto <span className="arrow">→</span>
      </span>
    </article>
  );
}

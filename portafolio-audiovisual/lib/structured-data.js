import site from '@/content/site.json';
import { getSiteUrl } from './site-url';

// Datos estructurados (schema.org) en JSON-LD: se los entregas a Google para que entienda
// quién eres y qué es cada página. Solo incluye datos que ya son públicos en el sitio.

// `<` se escapa para que ningún texto pueda cerrar la etiqueta <script> por accidente.
export function toJsonLd(data) {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

export function personJsonLd() {
  const baseUrl = getSiteUrl();
  const tools = site.skills.flatMap(skill => skill.tools);

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: site.name,
    jobTitle: site.headline,
    description: site.metaDescription,
    url: baseUrl,
    image: `${baseUrl}/about.jpg`,
    email: `mailto:${site.email}`,
    address: { '@type': 'PostalAddress', addressLocality: 'Bogotá', addressCountry: 'CO' },
    knowsAbout: tools,
    sameAs: [site.linkedin, site.youtube],
  };
}

export function projectJsonLd(project) {
  const baseUrl = getSiteUrl();
  const url = `${baseUrl}/proyectos/${project.slug}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.summary,
    url,
    dateCreated: String(project.year),
    inLanguage: 'es',
    creator: { '@type': 'Person', name: site.name, url: baseUrl },
    keywords: project.tools.join(', '),
    ...(project.media.cover && { image: `${baseUrl}${project.media.cover}` }),
    ...(project.youtubeId && { video: `https://www.youtube.com/watch?v=${project.youtubeId}` }),
  };
}

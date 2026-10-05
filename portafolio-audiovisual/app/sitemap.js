import { getAllProjects } from '@/lib/projects';
import { getSiteUrl } from '@/lib/site-url';

// Next convierte lo que devuelve esta función en /sitemap.xml: la lista de páginas
// que le entregas a Google para que las encuentre. Cada proyecto nuevo aparece solo.
export default function sitemap() {
  const baseUrl = getSiteUrl();

  return [
    { url: baseUrl, changeFrequency: 'monthly', priority: 1 },
    ...getAllProjects().map(project => ({
      url: `${baseUrl}/proyectos/${project.slug}`,
      changeFrequency: 'yearly',
      priority: 0.7,
    })),
  ];
}

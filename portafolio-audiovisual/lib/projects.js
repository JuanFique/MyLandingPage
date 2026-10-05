import fs from 'node:fs';
import path from 'node:path';
import { findProjectMedia } from './media';

// ============================================================
// LECTOR DE PROYECTOS
// Lee los archivos content/projects/*.json y los entrega a las páginas.
//
// IMPORTANTE: este archivo usa `fs` (leer archivos del disco), que solo
// existe en el servidor. Impórtalo únicamente desde páginas y componentes
// SIN 'use client'. Si lo importas desde uno con 'use client', Next da error.
// ============================================================

const PROJECTS_DIR = path.join(process.cwd(), 'content', 'projects');

// Campos que TODO proyecto debe tener para que su tarjeta y su página funcionen.
const REQUIRED_FIELDS = ['title', 'category', 'year', 'description', 'summary', 'role', 'tools'];

// Acepta un enlace de YouTube (watch, youtu.be, embed, shorts) o el ID suelto,
// y devuelve solo el ID de 11 caracteres. Devuelve null si no reconoce nada.
export function extractYoutubeId(value) {
  const match = String(value).match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/)|^)([A-Za-z0-9_-]{11})(?:[?&#/]|$)/
  );
  return match ? match[1] : null;
}

// Lee UN archivo, lo valida y le agrega el slug (que es el nombre del archivo:
// hitos-caldas.json → slug "hitos-caldas"; así nunca pueden desincronizarse).
function readProject(fileName) {
  const slug = fileName.replace(/\.json$/, '');

  let data;
  try {
    data = JSON.parse(fs.readFileSync(path.join(PROJECTS_DIR, fileName), 'utf-8'));
  } catch (error) {
    throw new Error(
      `No se pudo leer content/projects/${fileName}: ${error.message}. ` +
      `Revisa que no falten comas, comillas o llaves.`
    );
  }

  const missing = REQUIRED_FIELDS.filter(field => data[field] === undefined || data[field] === '');
  if (missing.length > 0) {
    throw new Error(`content/projects/${fileName} no tiene estos campos obligatorios: ${missing.join(', ')}`);
  }

  if (!Number.isInteger(data.year)) {
    throw new Error(`content/projects/${fileName}: "year" debe ser un número (ej. 2026), sin comillas.`);
  }

  if (!Array.isArray(data.tools) || data.tools.length === 0) {
    throw new Error(`content/projects/${fileName}: "tools" debe ser una lista con al menos una herramienta.`);
  }

  // Campo opcional "youtube": se guarda solo el ID, sin importar cómo lo hayas pegado.
  let youtubeId = null;
  if (data.youtube !== undefined) {
    youtubeId = extractYoutubeId(data.youtube);
    if (!youtubeId) {
      throw new Error(
        `content/projects/${fileName}: "youtube" no parece un enlace ni un ID de YouTube. ` +
        `Pega el enlace completo del video, por ejemplo https://youtu.be/XXXXXXXXXXX`
      );
    }
  }

  // Material detectado automáticamente en /public/projects/<slug>/
  return { slug, ...data, youtubeId, media: findProjectMedia(slug) };
}

// Todos los proyectos, del más reciente al más antiguo
// (si hay empate de año, por orden alfabético del título).
export function getAllProjects() {
  return fs
    .readdirSync(PROJECTS_DIR)
    .filter(fileName => fileName.endsWith('.json'))
    .map(readProject)
    .sort((a, b) => b.year - a.year || a.title.localeCompare(b.title, 'es'));
}

// Un proyecto por su slug, o undefined si no existe.
export function getProjectBySlug(slug) {
  return getAllProjects().find(project => project.slug === slug);
}

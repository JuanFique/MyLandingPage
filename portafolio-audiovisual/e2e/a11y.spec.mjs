import { test, expect } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';

const routes = [
  '/',
  '/proyectos/bolsa-ninja',
  '/proyectos/introduccion-catedra',
  '/proyectos/hitos-caldas',
  '/proyectos/cortinilla-25-anos-multimedia',
  '/proyectos/fallas-de-mercado',
  '/proyectos/ryu-gamedev',
  '/esta-pagina-no-existe', // 404
];
const widths = [320, 768, 1280];
const schemes = ['dark', 'light'];

for (const colorScheme of schemes) {
  for (const width of widths) {
    for (const route of routes) {
      test(`axe sin violaciones WCAG 2.2 AA: ${route} @${width}px ${colorScheme}`, async ({ page }) => {
        await page.emulateMedia({ colorScheme });
        await page.setViewportSize({ width, height: 800 });
        await page.goto(route, { waitUntil: 'networkidle' });
        const { violations } = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'])
          .analyze();
        expect(violations.map(v => `${v.id}: ${v.nodes[0].target}`)).toEqual([]);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
        expect(overflow).toBe(false);
      });
    }
  }
}

test('skip link es la primera parada de Tab y lleva al contenido', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: 'Saltar al contenido' });
  await expect(skip).toBeFocused();
  await expect(skip).toBeInViewport();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
});

test('cada tarjeta de proyecto tiene una sola parada de teclado', async ({ page }) => {
  await page.goto('/');
  const cards = page.locator('.clip');
  const count = await cards.count();
  expect(count).toBeGreaterThan(0);
  for (let i = 0; i < count; i++) {
    await expect(cards.nth(i).locator('a')).toHaveCount(1);
  }
});

test('menú móvil: Esc lo cierra y devuelve el foco; clic fuera también', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 700 });
  await page.goto('/');
  const toggle = page.getByRole('button', { name: 'Menú' });
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Escape');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(toggle).toBeFocused();

  await toggle.click();
  await page.mouse.click(10, 650);
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
});

test('la fachada de YouTube pasa el foco al reproductor', async ({ page }) => {
  await page.goto('/proyectos/bolsa-ninja');
  await page.getByRole('button', { name: /Reproducir/ }).click();
  await expect(page.locator('iframe')).toBeFocused();
});

test('objetivos de clic de al menos 24 px en enlaces y botones visibles', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto('/');
  const small = await page.evaluate(() =>
    [...document.querySelectorAll('header a, header button, footer a, .hero-actions a')]
      .filter(e => e.offsetParent !== null)
      .map(e => [e.textContent.trim().slice(0, 25), e.getBoundingClientRect().height])
      .filter(([, h]) => h < 24)
  );
  expect(small).toEqual([]);
});

test('sin errores de consola en el home', async ({ page }) => {
  const errors = [];
  page.on('console', m => m.type() === 'error' && errors.push(m.text()));
  page.on('pageerror', e => errors.push(e.message));
  await page.goto('/', { waitUntil: 'networkidle' });
  expect(errors).toEqual([]);
});

test('galería: abre ampliación con foco en Cerrar, flechas navegan, Esc cierra y devuelve el foco', async ({ page }) => {
  await page.goto('/proyectos/bolsa-ninja');
  const thumbs = page.locator('.gallery-item');
  await thumbs.nth(0).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(page.getByRole('button', { name: 'Cerrar' })).toBeFocused();
  await expect(dialog).toContainText('1 / 4');
  await page.keyboard.press('ArrowRight');
  await expect(dialog).toContainText('2 / 4');
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(thumbs.nth(0)).toBeFocused();
});

test('el CV en PDF existe y se ofrece como descarga', async ({ page, request }) => {
  await page.goto('/');
  const href = await page.getByRole('link', { name: /Descargar CV/ }).first().getAttribute('href');
  const response = await request.get(href);
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toContain('pdf');
});

test('los proyectos aparecen en el orden definido', async ({ page }) => {
  await page.goto('/');
  const titles = await page.locator('.clip-title').allTextContents();
  expect(titles[0]).toContain('Introducción a la Cátedra');
  expect(titles[1]).toContain('Bolsa ninja');
});

// ---------- SEO y metadatos ----------

const SITE = 'https://juandavidfiquevelasco.vercel.app';

test('home: title, description, canonical, Open Graph y Twitter con la URL de producción', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Juan David Fique Velasco — Editor de video/);
  const meta = sel => page.locator(sel).getAttribute('content');
  expect(await meta('meta[name="description"]')).toContain('Bogotá');
  expect(await page.locator('link[rel="canonical"]').getAttribute('href')).toBe(SITE);
  expect(await meta('meta[property="og:image"]')).toContain(`${SITE}/opengraph-image.jpg`);
  expect(await meta('meta[name="twitter:card"]')).toBe('summary_large_image');
  expect(await meta('meta[name="twitter:image"]')).toContain(SITE);
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
});

test('proyectos: título propio, canonical y Twitter card propios (no los del home)', async ({ page }) => {
  await page.goto('/proyectos/bolsa-ninja');
  await expect(page).toHaveTitle('Bolsa ninja — Juan David Fique Velasco');
  expect(await page.locator('link[rel="canonical"]').getAttribute('href')).toBe(`${SITE}/proyectos/bolsa-ninja`);
  expect(await page.locator('meta[name="twitter:title"]').getAttribute('content')).toBe('Bolsa ninja');
  expect(await page.locator('meta[property="og:image"]').first().getAttribute('content')).toContain('bolsa-ninja');
});

test('datos estructurados: Person en todas las páginas y CreativeWork en proyectos, JSON válido', async ({ page }) => {
  await page.goto('/proyectos/ryu-gamedev');
  const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
  const data = blocks.map(b => JSON.parse(b));
  const person = data.find(d => d['@type'] === 'Person');
  expect(person.name).toBe('Juan David Fique Velasco');
  expect(person.sameAs).toEqual(expect.arrayContaining([expect.stringContaining('linkedin.com')]));
  const work = data.find(d => d['@type'] === 'CreativeWork');
  expect(work.url).toBe(`${SITE}/proyectos/ryu-gamedev`);
  expect(work.dateCreated).toBe('2025');
});

test('robots, sitemap y manifest responden y son coherentes', async ({ request }) => {
  const robots = await request.get('/robots.txt');
  expect(await robots.text()).toContain(`Sitemap: ${SITE}/sitemap.xml`);

  const sitemap = await (await request.get('/sitemap.xml')).text();
  expect(sitemap.match(/<loc>/g)).toHaveLength(7); // home + 6 proyectos
  expect(sitemap).toContain('<lastmod>');
  expect(sitemap).toContain(`${SITE}/proyectos/introduccion-catedra`);

  const manifest = await (await request.get('/manifest.webmanifest')).json();
  expect(manifest.lang).toBe('es');
  for (const icon of manifest.icons) {
    expect((await request.get(icon.src)).status()).toBe(200);
  }
  expect((await request.get('/favicon.ico')).status()).toBe(200);
  expect((await request.get('/apple-icon.png')).status()).toBe(200);
});

test('enlaces internos del home y de un proyecto responden 200', async ({ page, request }) => {
  for (const route of ['/', '/proyectos/hitos-caldas']) {
    await page.goto(route);
    const hrefs = await page.locator('a[href^="/"]').evaluateAll(links => [...new Set(links.map(a => a.getAttribute('href')))]);
    for (const href of hrefs) {
      const path = href.split('#')[0] || '/';
      const response = await request.get(path);
      expect(response.status(), `${route} → ${href}`).toBe(200);
    }
  }
});

test('enlaces externos abren en pestaña nueva con noopener noreferrer', async ({ page }) => {
  await page.goto('/');
  const external = await page.locator('a[target="_blank"]').evaluateAll(links => links.map(a => [a.href, a.rel]));
  expect(external.length).toBeGreaterThan(0);
  for (const [href, rel] of external) {
    expect(rel, href).toContain('noopener');
    expect(rel, href).toContain('noreferrer');
  }
});

test('404: página propia con estado 404 y salida clara', async ({ page }) => {
  const response = await page.goto('/esta-pagina-no-existe');
  expect(response.status()).toBe(404);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('no existe');
  await expect(page.getByRole('link', { name: 'Ver proyectos' })).toBeVisible();
});

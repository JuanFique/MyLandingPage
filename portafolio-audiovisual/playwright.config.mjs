import { defineConfig } from '@playwright/test';

// Pruebas e2e sobre el build de producción (`npm run build` antes de correrlas).
// En entornos sin descarga de navegadores, PW_CHROMIUM_PATH apunta a un Chromium ya instalado.
const executablePath = process.env.PW_CHROMIUM_PATH || undefined;

export default defineConfig({
  testDir: './e2e',
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:3100',
    launchOptions: { executablePath, args: ['--no-sandbox'] },
  },
  webServer: {
    command: 'npx next start -p 3100',
    url: 'http://localhost:3100',
    reuseExistingServer: true,
  },
});

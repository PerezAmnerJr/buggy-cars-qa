import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  // El sitio es público y a veces lento
  timeout: 60000,

  // Sin reintentos: repetir un test crearía más usuarios o votaría dos veces
  retries: 0,

  // Un test a la vez: el Caso 3 usa el usuario que crea el Caso 1
  workers: 1,

  use: {
    baseURL: 'https://buggy.justtestit.org',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },

  // Navegador utilizado (se documenta en el README)
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],

  reporter: [['list'], ['html', { open: 'never' }]],
});
import { test, expect } from '@playwright/test';

const URL = 'https://umg.edu.gt/info/miumg_estudiantes';

test.describe('MIUMG Estudiantes - verificación de elementos', () => {
  test('carga, título y encabezado principal', async ({ page }) => {
    await page.goto(URL, { waitUntil: 'domcontentloaded' });

    await expect(page).toHaveTitle(/Mi UMG.*estudiantes/i);

    // H1: "Acceso a Plataforma MiUMG estudiante"
    await expect(
      page.getByRole('heading', { level: 1, name: /Acceso a Plataforma MIUMG.*estudiante/i })
    ).toBeVisible();
  });

  test('enlaces clave del texto informativo', async ({ page }) => {
    await page.goto(URL);

    // Link a la plataforma miUMG (apps.umg.edu.gt)
    const miUMG = page.getByRole('link', { name: /miUMG/i });
    await expect(miUMG).toBeVisible();
    await expect(miUMG).toHaveAttribute('href', /\/\/apps\.umg\.edu\.gt/);

    // Link a recuperación de contraseña
    const recuperar = page.getByRole('link', { name: /recuperaci[oó]n de contrase[nñ]a/i });
    await expect(recuperar).toBeVisible();
    await expect(recuperar).toHaveAttribute('href', /info\/recuperacion_contrasena/);

    // Link de “puedes consultar aquí” en el alert
    const masInfo = page.getByRole('link', { name: /puedes consultar aqu[ií]/i });
    await expect(masInfo).toBeVisible();
    await expect(masInfo).toHaveAttribute('href', /miUMGBienvenida\/estudiante/);
  });

  test('navbar e idioma, botón MiUMG y messenger flotante', async ({ page }) => {
    await page.goto(URL);

    // Selector por texto visible ESP/ENG
    await expect(page.getByRole('link', { name: 'ESP' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'ENG' })).toBeVisible();

    // Botón MiUMG (imagen dentro del botón)
    await expect(page.locator('button.miumg img[alt="miumg"]')).toBeVisible();

    // Botón flotante de Messenger
    const messenger = page.locator('a.messenger-button');
    await expect(messenger).toBeVisible();
    await expect(messenger).toHaveAttribute('href', /m\.me\/u\.marianogalvez/);
  });

  test('footer: teléfono y correo visibles', async ({ page }) => {
    await page.goto(URL);

    // Teléfono PBX
    const tel = page.getByRole('link', { name: /PBX:\s*2411\s*1800/i });
    await expect(tel).toHaveAttribute('href', 'tel:24111800');

    // Correo info@umg.edu.gt
    const mail = page.getByRole('link', { name: /info@umg\.edu\.gt/i });
    await expect(mail).toHaveAttribute('href', 'mailto:info@umg.edu.gt');
  });

  test('assets principales cargan (sin bloquear analytics)', async ({ page }) => {
    await page.route('**/*', route => {
      const url = route.request().url();
      // Deja pasar todo, pero podrías bloquear trackers si quieres:
      if (/googletagmanager|facebook|fbevents/.test(url)) return route.abort(); // opcional
      return route.continue();
    });

    await page.goto(URL);

    // CSS esenciales referenciados en el <head>
    await expect(await page.evaluate(() => !!document.querySelector('link[href="/css/bootstrap.css"]'))).toBeTruthy();
    await expect(await page.evaluate(() => !!document.querySelector('link[href="/app.css"]'))).toBeTruthy();
  });
});
// playwright.config.js
import { defineConfig } from '@playwright/test';    
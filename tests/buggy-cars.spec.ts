import { test, expect, type Page } from '@playwright/test';

// Login único: carné + hora (indicación del ejercicio)
const ahora = new Date();
const hora = `${ahora.getHours()}${ahora.getMinutes()}${ahora.getSeconds()}`;
const usuario = {
  login: `1790227230_${hora}`,
  firstName: 'Amner',
  lastName: 'Perez',
  password: 'Qa*Buggy2026', // 12 caracteres: mayúscula, minúscula, número y especial
};

// Llena y envía el formulario de registro
async function registrar(page: Page, login: string, password: string) {
  await page.goto('/register');
  await page.locator('#username').fill(login);
  await page.locator('#firstName').fill(usuario.firstName);
  await page.locator('#lastName').fill(usuario.lastName);
  await page.locator('#password').fill(password);
  await page.locator('#confirmPassword').fill(password);
  await page.getByRole('button', { name: 'Register' }).click();
}

// Lee el número del contador "Votes: N"
async function leerVotos(page: Page) {
  const texto = await page.locator('h4', { hasText: 'Votes:' }).innerText();
  return Number(texto.replace(/\D/g, ''));
}

// Casos 1 y 3 en serie: el Caso 3 usa el usuario que crea el Caso 1
test.describe('HU-1 y HU-3: registro y votación', () => {
  test.describe.configure({ mode: 'serial' });

  test('Caso 1 (HU-1 C1, C2): registrar un usuario nuevo con datos válidos', async ({ page }) => {
    await test.step('Registrar usuario con todos los campos y clave válida', async () => {
      await registrar(page, usuario.login, usuario.password);
      console.log(`Usuario creado: ${usuario.login}`);
    });

    await test.step('Verificar que el sitio confirma el registro', async () => {
      await expect(page.locator('.result.alert-success')).toContainText('Registration is successful');
    });
  });

  test('Caso 3 (HU-3 C1, C2, C4): votar por el primer auto de Overall Rating', async ({ page }) => {
    await test.step('Iniciar sesión con el usuario registrado', async () => {
      await page.goto('/');
      await page.locator('input[name="login"]').fill(usuario.login);
      await page.locator('input[name="password"]').fill(usuario.password);
      await page.getByRole('button', { name: 'Login' }).click();
      await expect(page.getByText(`Hi, ${usuario.firstName}`)).toBeVisible();
    });

    await test.step('Abrir el primer auto de la lista Overall Rating', async () => {
      await page.goto('/overall');
      // La primera fila tiene 3 enlaces al mismo auto (imagen, nombre y "View more"): se usa el primero
      await page.locator('table tbody tr').first().locator('a[href*="/model/"]').first().click();
      await expect(page.getByRole('button', { name: 'Vote!' })).toBeVisible();
    });

    const votosAntes = await test.step('Leer el contador de votos', async () => {
      return await leerVotos(page);
    });

    await test.step('Votar dejando un comentario', async () => {
      await page.locator('#comment').fill(`Voto de prueba QA ${usuario.login}`);
      await page.getByRole('button', { name: 'Vote!' }).click();
    });

        await test.step('Verificar la confirmación y que el contador aumenta en 1', async () => {
      // El sitio tarda varios segundos en confirmar el voto
      await expect(page.getByText('Thank you for your vote!')).toBeVisible({ timeout: 20000 });
      // Sitio compartido: otros usuarios pueden votar al mismo tiempo,
      // por eso se verifica que el contador aumente al menos en 1
      await expect.poll(() => leerVotos(page), { timeout: 20000 }).toBeGreaterThanOrEqual(votosAntes + 1);
    });
  });
});

// Caso 2 aparte: si falla (defecto), no impide ejecutar el Caso 3
test('Caso 2 (HU-1 C2): rechazar una clave de 7 caracteres', async ({ page }) => {
  await test.step('Registrar con clave de 7 caracteres que cumple los demás criterios', async () => {
    await registrar(page, `${usuario.login}_c2`, 'Qa1*bcd'); // 7: mayúscula, minúscula, número y especial
  });

  await test.step('Verificar que el registro es rechazado', async () => {
    await expect(page.locator('.result.alert-danger')).toBeVisible();
    await expect(page.locator('.result.alert-success')).toHaveCount(0);
  });
});
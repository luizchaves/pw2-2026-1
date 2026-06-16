import { expect, test } from '@playwright/test';

test('landing page shows public navigation and CTAs', async ({ page }) => {
  await page.goto('/');

  await expect(
    page.getByRole('heading', {
      name: /Acompanhe sua carteira sem planilhas soltas\./i,
    }),
  ).toBeVisible();
  await expect(page.getByRole('navigation').getByRole('link', { name: /Entrar/i })).toHaveAttribute(
    'href',
    '/login',
  );
  await expect(
    page.getByRole('navigation').getByRole('link', { name: /Cadastrar/i }),
  ).toHaveAttribute('href', '/register');
  await expect(page.getByRole('link', { name: /Criar conta/i })).toHaveAttribute(
    'href',
    '/register',
  );
});

test('register validates password confirmation before submitting', async ({ page }) => {
  await page.goto('/register');

  await page.getByPlaceholder('Seu nome').fill('Maria Investidora');
  await page.getByPlaceholder('voce@email.com').fill('maria@example.com');
  await page.getByPlaceholder('Minimo de 6 caracteres').fill('segredo123');
  await page.getByPlaceholder('Repita sua senha').fill('diferente123');
  await page.getByRole('button', { name: /Criar conta/i }).click();

  await expect(page.getByText('As senhas não conferem')).toBeVisible();
});

test('anonymous users are redirected from dashboard to login', async ({ page }) => {
  await page.goto('/dashboard');

  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole('heading', { level: 1, name: 'Entrar' })).toBeVisible();
});

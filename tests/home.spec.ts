
import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('should load the home page correctly', async ({ page }) => {
    await page.goto('/');

    // Check if the main title is visible
    await expect(page.getByRole('heading', { name: /escanear comida/i })).toBeVisible();

    // Check if the scan button is visible and clickable
    const scanButton = page.getByRole('button', { name: /escanear/i });
    await expect(scanButton).toBeVisible();
    await expect(scanButton).toBeEnabled();

    // Check if the language toggle button is visible
    const languageButton = page.getByRole('button').filter({ has: page.locator('svg') }).first();
    await expect(languageButton).toBeVisible();

    // Check if bottom navigation is present
    await expect(page.getByText('Inicio')).toBeVisible();
    await expect(page.getByText('Recetas')).toBeVisible();
    await expect(page.getByText('Favoritos')).toBeVisible();
    await expect(page.getByText('Más')).toBeVisible();
  });

  test('should toggle language correctly', async ({ page }) => {
    await page.goto('/');

    // Initially should be in Spanish
    await expect(page.getByRole('heading', { name: /escanear comida/i })).toBeVisible();

    // Click language toggle button
    const languageButton = page.getByRole('button').filter({ has: page.locator('svg') }).first();
    await languageButton.click();

    // Should switch to English
    await expect(page.getByRole('heading', { name: /scan food/i })).toBeVisible();
    await expect(page.getByText('Home')).toBeVisible();
    await expect(page.getByText('Recipes')).toBeVisible();

    // Click again to switch back to Spanish
    await languageButton.click();
    await expect(page.getByRole('heading', { name: /escanear comida/i })).toBeVisible();
    await expect(page.getByText('Inicio')).toBeVisible();
  });

  test('should navigate to scan page when clicking scan button', async ({ page }) => {
    await page.goto('/');

    // Mock camera permissions to avoid browser permission dialog
    await page.context().grantPermissions(['camera']);

    // Click the main scan button
    const scanButton = page.getByRole('button', { name: /escanear/i });
    await scanButton.click();

    // Should navigate to scan page
    await expect(page.getByText('Centra la comida en el marco')).toBeVisible();
    await expect(page.getByRole('button', { name: /tomar foto/i })).toBeVisible();
  });

  test('should navigate back to home when clicking Inicio', async ({ page }) => {
    await page.goto('/');

    // Mock camera permissions
    await page.context().grantPermissions(['camera']);

    // Navigate to scan page
    await page.getByRole('button', { name: /escanear/i }).click();
    await expect(page.getByText('Centra la comida en el marco')).toBeVisible();

    // Click Inicio in bottom navigation
    await page.getByText('Inicio').click();

    // Should be back on home page
    await expect(page.getByRole('heading', { name: /escanear comida/i })).toBeVisible();
    await expect(page.getByText('Take a photo of your food')).toBeVisible();
  });
});

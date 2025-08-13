
import { test, expect } from '@playwright/test';

test.describe('Fixed Navigation Stack Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Scenario 1: Favorites → Brócoli → Back should return to Favorites', async ({ page }) => {
    // Navigate to favorites
    await page.click('[data-testid="favorites-nav"]');
    await expect(page).toHaveURL('/favorites');

    // Click on Brócoli
    await page.click('text=Brócoli');
    await expect(page).toHaveURL('/product/brocoli');

    // Back should go to favorites
    await page.click('[data-testid="back-button"]');
    await expect(page).toHaveURL('/favorites');
  });

  test('Scenario 2: Favorites → Brócoli → Coles → Back → Back', async ({ page }) => {
    // Navigate to favorites
    await page.click('[data-testid="favorites-nav"]');
    await expect(page).toHaveURL('/favorites');

    // Click on Brócoli
    await page.click('text=Brócoli');
    await expect(page).toHaveURL('/product/brocoli');

    // Click on Coles de Bruselas from similar products
    await page.click('text=Coles de Bruselas');
    await expect(page).toHaveURL('/product/coles-de-bruselas');

    // First back - should go to Brócoli
    await page.click('[data-testid="back-button"]');
    await expect(page).toHaveURL('/product/brocoli');

    // Second back - should go to favorites
    await page.click('[data-testid="back-button"]');
    await expect(page).toHaveURL('/favorites');
  });

  test('Scenario 3: Explore → Product → Back', async ({ page }) => {
    // Navigate to explore
    await page.click('text=Explorar');
    await expect(page).toHaveURL('/explore');

    // Click on a product
    await page.click('text=Aguacate');
    await expect(page).toHaveURL('/product/aguacate');

    // Back should go to explore
    await page.click('[data-testid="back-button"]');
    await expect(page).toHaveURL('/explore');
  });

  test('Scenario 4: Bottom nav resets stack properly', async ({ page }) => {
    // Navigate to favorites
    await page.click('[data-testid="favorites-nav"]');
    await expect(page).toHaveURL('/favorites');

    // Navigate to product
    await page.click('text=Brócoli');
    await expect(page).toHaveURL('/product/brocoli');

    // Click home in bottom nav - should reset stack
    await page.click('[data-testid="home-nav"]');
    await expect(page).toHaveURL('/');

    // Navigate to explore
    await page.click('text=Explorar');
    await expect(page).toHaveURL('/explore');

    // Navigate to product
    await page.click('text=Aguacate');
    await expect(page).toHaveURL('/product/aguacate');

    // Back should go to home (stack was reset), not favorites
    await page.click('[data-testid="back-button"]');
    await expect(page).toHaveURL('/');
  });
});

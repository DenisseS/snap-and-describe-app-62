
import { test, expect } from '@playwright/test';

test.describe('Final Navigation Stack Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Scenario 1: Favorites → Brócoli → Back should return to Favorites', async ({ page }) => {
    // Navigate to favorites via bottom nav
    await page.click('[data-testid="favorites-nav"]');
    await expect(page).toHaveURL('/favorites');

    // Click on Brócoli product
    await page.click('text=Brócoli');
    await expect(page).toHaveURL('/product/brocoli');

    // Back should go to favorites
    await page.click('[data-testid="back-button"]');
    await expect(page).toHaveURL('/favorites');
  });

  test('Scenario 2: Favorites → Brócoli → Coles → Back → Back should work correctly', async ({ page }) => {
    // Navigate to favorites via bottom nav
    await page.click('[data-testid="favorites-nav"]');
    await expect(page).toHaveURL('/favorites');

    // Click on Brócoli product
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

  test('Scenario 3: Deep navigation through similar products', async ({ page }) => {
    // Navigate to favorites
    await page.click('[data-testid="favorites-nav"]');
    await expect(page).toHaveURL('/favorites');

    // Navigate through multiple products
    await page.click('text=Brócoli');
    await expect(page).toHaveURL('/product/brocoli');

    await page.click('text=Coles de Bruselas');
    await expect(page).toHaveURL('/product/coles-de-bruselas');

    await page.click('text=Brócoli');
    await expect(page).toHaveURL('/product/brocoli');

    // Navigate through the stack backwards
    await page.click('[data-testid="back-button"]');
    await expect(page).toHaveURL('/product/coles-de-bruselas');

    await page.click('[data-testid="back-button"]');
    await expect(page).toHaveURL('/product/brocoli');

    await page.click('[data-testid="back-button"]');
    await expect(page).toHaveURL('/favorites');
  });

  test('Scenario 4: Bottom nav resets stack correctly', async ({ page }) => {
    // Build up a navigation stack
    await page.click('[data-testid="favorites-nav"]');
    await page.click('text=Brócoli');
    await page.click('text=Coles de Bruselas');
    await expect(page).toHaveURL('/product/coles-de-bruselas');

    // Click home in bottom nav - should reset stack
    await page.click('[data-testid="home-nav"]');
    await expect(page).toHaveURL('/');

    // Navigate to explore and then a product
    await page.click('text=Explorar');
    await expect(page).toHaveURL('/explore');

    await page.click('text=Aguacate');
    await expect(page).toHaveURL('/product/aguacate');

    // Back should go to home (stack was reset), not to previous products
    await page.click('[data-testid="back-button"]');
    await expect(page).toHaveURL('/');
  });

  test('Scenario 5: Explore navigation works correctly', async ({ page }) => {
    // Navigate to explore
    await page.click('text=Explorar');
    await expect(page).toHaveURL('/explore');

    // Navigate to a product
    await page.click('text=Aguacate');
    await expect(page).toHaveURL('/product/aguacate');

    // Back should go to explore
    await page.click('[data-testid="back-button"]');
    await expect(page).toHaveURL('/explore');
  });
});

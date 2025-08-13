
import { test, expect } from '@playwright/test';

test.describe('Navigation Stack Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Scenario 1: Sequential navigation through products', async ({ page }) => {
    // Navigate to explore
    await page.click('text=Explorar');
    await expect(page).toHaveURL('/explore');

    // Click on "Coles de Bruselas" product
    await page.click('text=Coles de Bruselas');
    await expect(page).toHaveURL('/product/coles-de-bruselas');

    // Click on "Brócoli" from similar products
    await page.click('text=Brócoli');
    await expect(page).toHaveURL('/product/brocoli');

    // First back - should go to Coles de Bruselas
    await page.click('[data-testid="back-button"]');
    await expect(page).toHaveURL('/product/coles-de-bruselas');

    // Second back - should go to explore
    await page.click('[data-testid="back-button"]');
    await expect(page).toHaveURL('/explore');
  });

  test('Scenario 2: Bottom navigation reset', async ({ page }) => {
    // Navigate to explore
    await page.click('text=Explorar');
    await expect(page).toHaveURL('/explore');

    // Navigate to product A
    await page.click('text=Coles de Bruselas');
    await expect(page).toHaveURL('/product/coles-de-bruselas');

    // Navigate to product B
    await page.click('text=Brócoli');
    await expect(page).toHaveURL('/product/brocoli');

    // Press Home in bottom navigation - should reset stack
    await page.click('[data-testid="home-nav"]');
    await expect(page).toHaveURL('/');

    // Navigate back to explore
    await page.click('text=Explorar');
    await expect(page).toHaveURL('/explore');

    // Navigate to product C
    await page.click('text=Aguacate');
    await expect(page).toHaveURL('/product/aguacate');

    // Back should go to home (not to previous product chain)
    await page.click('[data-testid="back-button"]');
    await expect(page).toHaveURL('/');
  });

  test('Scenario 3: Favorites navigation', async ({ page }) => {
    // Navigate to favorites
    await page.click('[data-testid="favorites-nav"]');
    await expect(page).toHaveURL('/favorites');

    // Click on Brócoli
    await page.click('text=Brócoli');
    await expect(page).toHaveURL('/product/brocoli');

    // Click on Coles de Bruselas
    await page.click('text=Coles de Bruselas');
    await expect(page).toHaveURL('/product/coles-de-bruselas');

    // First back - should go to Brócoli
    await page.click('[data-testid="back-button"]');
    await expect(page).toHaveURL('/product/brocoli');

    // Second back - should go to favorites
    await page.click('[data-testid="back-button"]');
    await expect(page).toHaveURL('/favorites');
  });

  test('Scenario 4: Custom back handler override', async ({ page }) => {
    // Navigate to a page with custom back behavior
    await page.goto('/camera');
    
    // Custom back should work (fallback to home)
    await page.click('[data-testid="back-button"]');
    await expect(page).toHaveURL('/');
  });
});

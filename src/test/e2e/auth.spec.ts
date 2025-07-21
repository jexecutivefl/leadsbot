import { test, expect } from '@playwright/test';

test.describe('Authentication E2E Tests', () => {
  test('should display login page', async ({ page }) => {
    await page.goto('/login');
    await expect(page).toHaveTitle(/Leadsbot/);
    await expect(page.locator('h1')).toContainText('Login');
  });

  test('should display register page', async ({ page }) => {
    await page.goto('/register');
    await expect(page).toHaveTitle(/Leadsbot/);
    await expect(page.locator('h1')).toContainText('Register');
  });

  test('should navigate between login and register', async ({ page }) => {
    await page.goto('/login');
    await page.click('text=Create account');
    await expect(page).toHaveURL(/.*register/);
    
    await page.click('text=Already have an account');
    await expect(page).toHaveURL(/.*login/);
  });
}); 
import { test, expect } from '@playwright/test';

test.describe('Leads Management E2E Tests', () => {
  test('should display leads page', async ({ page }) => {
    await page.goto('/leads');
    await expect(page).toHaveTitle(/Leadsbot/);
    await expect(page.locator('h1')).toContainText('Leads');
  });

  test('should display new lead button', async ({ page }) => {
    await page.goto('/leads');
    await expect(page.locator('text=New Lead')).toBeVisible();
  });

  test('should navigate to new lead page', async ({ page }) => {
    await page.goto('/leads');
    await page.click('text=New Lead');
    await expect(page).toHaveURL(/.*leads\/new/);
    await expect(page.locator('h1')).toContainText('New Lead');
  });

  test('should display lead form fields', async ({ page }) => {
    await page.goto('/leads/new');
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="phone"]')).toBeVisible();
    await expect(page.locator('select[name="status"]')).toBeVisible();
  });

  test('should display qualified leads page', async ({ page }) => {
    await page.goto('/leads/qualified');
    await expect(page).toHaveTitle(/Leadsbot/);
    await expect(page.locator('h1')).toContainText('Qualified Leads');
  });
}); 
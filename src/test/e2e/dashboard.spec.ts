import { test, expect } from '@playwright/test';

test.describe('Dashboard E2E Tests', () => {
  test('should display dashboard page', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveTitle(/Leadsbot/);
    await expect(page.locator('h1')).toContainText('Dashboard');
  });

  test('should display navigation sidebar', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page.locator('[data-testid="sidebar"]')).toBeVisible();
    await expect(page.locator('text=Dashboard')).toBeVisible();
    await expect(page.locator('text=Leads')).toBeVisible();
    await expect(page.locator('text=Analytics')).toBeVisible();
    await expect(page.locator('text=AI Chat')).toBeVisible();
    await expect(page.locator('text=Settings')).toBeVisible();
  });

  test('should navigate to different pages', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Navigate to Leads
    await page.click('text=Leads');
    await expect(page).toHaveURL(/.*leads/);
    
    // Navigate to Analytics
    await page.click('text=Analytics');
    await expect(page).toHaveURL(/.*analytics/);
    
    // Navigate to AI Chat
    await page.click('text=AI Chat');
    await expect(page).toHaveURL(/.*ai-chat/);
    
    // Navigate to Settings
    await page.click('text=Settings');
    await expect(page).toHaveURL(/.*settings/);
    
    // Navigate back to Dashboard
    await page.click('text=Dashboard');
    await expect(page).toHaveURL(/.*dashboard/);
  });
}); 
// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('ShopSmart E2E – Home Page', () => {
  test('should load the home page and display ShopSmart', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=ShopSmart')).toBeVisible();
  });

  test('should have navigation links', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=Home')).toBeVisible();
    await expect(page.locator('text=Products')).toBeVisible();
  });

  test('should navigate to Products page', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Products');
    await expect(page).toHaveURL(/\/products/);
  });

  test('should navigate to Login page', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Login');
    await expect(page).toHaveURL(/\/login/);
  });
});

test.describe('ShopSmart E2E – Login Flow', () => {
  test('should show login form', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('should show Register link on login page', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('text=Register')).toBeVisible();
  });

  test('should navigate to Register page', async ({ page }) => {
    await page.goto('/login');
    await page.click('a:has-text("Register")');
    await expect(page).toHaveURL(/\/register/);
  });
});

test.describe('ShopSmart E2E – Cart', () => {
  test('should navigate to cart page', async ({ page }) => {
    await page.goto('/cart');
    await expect(page).toHaveURL(/\/cart/);
  });
});

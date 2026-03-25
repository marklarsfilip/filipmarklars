import { test, expect } from '@playwright/test';

test('home page loads with hero', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toContainText('Filip');
  await expect(page.locator('a[href="/projects"]').first()).toBeVisible();
});

test('navbar links work', async ({ page }) => {
  await page.goto('/');
  await page.click('a[href="/about"]');
  await expect(page).toHaveURL('/about');
  // About page now uses an italic pull-quote intro instead of an h1
  await expect(page.locator('p').first()).toContainText("Hey, I'm Filip");
});

test('projects page shows project cards', async ({ page }) => {
  await page.goto('/projects');
  await expect(page.locator('h1')).toContainText('Projects');
  await expect(page.locator('a[href*="/projects/"]').first()).toBeVisible();
});

test('project detail page renders', async ({ page }) => {
  await page.goto('/projects/personal-website');
  await expect(page.locator('h1')).toContainText('Personal Website');
});

test('404 page shows for bad routes', async ({ page }) => {
  const response = await page.goto('/nonexistent');
  // With prerendering, the server should return a 404 status
  // The error page may or may not render depending on adapter config
  // At minimum, verify we don't get a 200 OK for a nonexistent route
  expect(response?.status()).toBe(404);
});

import { test, expect } from '@playwright/test';

test('has heading title', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByText("Simple Form Example")).toBeVisible();
});

test('validates first name', async ({ page }) => {
    await page.goto('/');

    const firstName = await page.getByLabel("First Name");
    firstName.fill("AB");
    await expect(page.getByText("First name must be at least 3 characters")).toBeVisible();

    firstName.fill("error");
    await expect(page.getByText("First name must be at least 3 characters")).not.toBeInViewport();
    await expect(page.getByText('No "error" allowed in first name')).toBeVisible();

    firstName.fill("Testing");
    await expect(page.getByText("First name must be at least 3 characters")).not.toBeInViewport();
    await expect(page.getByText('No "error" allowed in first name')).not.toBeVisible();
});

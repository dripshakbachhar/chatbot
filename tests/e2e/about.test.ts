import { expect, test } from "@playwright/test";

test.describe("About Page", () => {
  test("renders product information and repository link", async ({ page }) => {
    await page.goto("/about");

    await expect(
      page.getByRole("heading", {
        name: "A focused AI workspace for conversations and documents.",
      })
    ).toBeVisible();

    await expect(
      page.getByRole("heading", { name: "Supported AI models" })
    ).toBeVisible();

    await expect(
      page.getByRole("link", { name: "Repository" })
    ).toHaveAttribute("href", "https://github.com/dripshakbachhar/chatbot");

    await expect(
      page.getByRole("link", { name: "Back to chat" })
    ).toHaveAttribute("href", "/");
  });

  test("is reachable from the chat navigation", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "About" }).first().click();
    await expect(page).toHaveURL(/\/about$/);
    await expect(
      page.getByRole("heading", {
        name: "A focused AI workspace for conversations and documents.",
      })
    ).toBeVisible();
  });

  test("is reachable from the mobile chat header", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    await expect(
      page.getByRole("link", { name: "About this chatbot" })
    ).toBeVisible();

    await page.getByRole("link", { name: "About this chatbot" }).click();
    await expect(page).toHaveURL(/\/about$/);
  });
});

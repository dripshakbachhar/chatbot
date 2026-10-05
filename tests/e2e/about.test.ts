import { expect, test } from "@playwright/test";

test.describe("About Page", () => {
  test("renders the project overview and current models", async ({ page }) => {
    await page.goto("/about");

    await expect(
      page.getByRole("heading", { name: "A focused chatbot built for useful work." })
    ).toBeVisible();
    await expect(page.getByRole("heading", { name: "What it provides" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Current model selection" })).toBeVisible();
    await expect(page.getByText("DeepSeek V3.2", { exact: true })).toBeVisible();
    await expect(page.getByText("Kimi K2.5", { exact: true })).toBeVisible();
    await expect(page.getByRole("link", { name: "Back to chat" })).toHaveAttribute(
      "href",
      "/"
    );
  });
});

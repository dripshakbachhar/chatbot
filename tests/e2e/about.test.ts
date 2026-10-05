import { expect, test } from "@playwright/test";

test.describe("About page", () => {
  test("renders and links back to chat", async ({ page }) => {
    await page.goto("/about");

    await expect(
      page.getByRole("heading", {
        name: "A focused workspace for AI conversations",
      })
    ).toBeVisible();
    await expect(page.getByText("DeepSeek V3.2")).toBeVisible();

    await page.getByRole("link", { name: "Back to chat" }).click();
    await expect(page).toHaveURL("/");
  });
});

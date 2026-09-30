import { expect, test } from "@playwright/test";
import { validateImageFile } from "@/lib/security/file-validation";

test.describe("File upload security validation", () => {
  test("accepts JPEG content with matching MIME type", async () => {
    const file = new Blob(
      [new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10])],
      { type: "image/jpeg" }
    );

    await expect(validateImageFile(file)).resolves.toBeNull();
  });

  test("accepts PNG content with matching MIME type", async () => {
    const file = new Blob(
      [new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])],
      { type: "image/png" }
    );

    await expect(validateImageFile(file)).resolves.toBeNull();
  });

  test("rejects MIME-spoofed image content", async () => {
    const file = new Blob(["not an image"], { type: "image/png" });

    await expect(validateImageFile(file)).resolves.toBe(
      "File contents do not match PNG type"
    );
  });

  test("rejects unsupported MIME types", async () => {
    const file = new Blob(["plain text"], { type: "text/plain" });

    await expect(validateImageFile(file)).resolves.toBe(
      "File type should be JPEG or PNG"
    );
  });
});

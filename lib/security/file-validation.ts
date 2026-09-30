export const MAX_IMAGE_SIZE = 4 * 1024 * 1024;

const JPEG_SIGNATURE = [0xff, 0xd8, 0xff];
const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

function startsWithSignature(bytes: Uint8Array, signature: number[]) {
  return signature.every((byte, index) => bytes[index] === byte);
}

export async function validateImageFile(file: Blob): Promise<string | null> {
  if (file.size > MAX_IMAGE_SIZE) {
    return "File size should be less than 4MB";
  }

  if (!["image/jpeg", "image/png"].includes(file.type)) {
    return "File type should be JPEG or PNG";
  }

  const bytes = new Uint8Array(await file.slice(0, 8).arrayBuffer());

  if (
    file.type === "image/jpeg" &&
    !startsWithSignature(bytes, JPEG_SIGNATURE)
  ) {
    return "File contents do not match JPEG type";
  }

  if (
    file.type === "image/png" &&
    !startsWithSignature(bytes, PNG_SIGNATURE)
  ) {
    return "File contents do not match PNG type";
  }

  return null;
}

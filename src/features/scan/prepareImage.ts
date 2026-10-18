import { ACCEPTED_TYPES, MAX_UPLOAD_BYTES } from "@/lib/letter";

export const MAX_IMAGE_SIDE = 2000;
const JPEG_QUALITY = 0.85;

export type PrepareError = "unsupported_type" | "too_large";
export type PrepareResult = { ok: true; file: Blob } | { ok: false; error: PrepareError };

const isAccepted = (type: string) => (ACCEPTED_TYPES as readonly string[]).includes(type);

/**
 * Makes a picked file ready for upload: photos are downscaled to at most 2000 px on the
 * longest side and re-encoded as JPEG (EXIF orientation applied, metadata such as GPS dropped).
 * PDFs pass through unchanged.
 */
export async function prepareUpload(file: Blob): Promise<PrepareResult> {
  if (file.type === "application/pdf") {
    return file.size > MAX_UPLOAD_BYTES ? { ok: false, error: "too_large" } : { ok: true, file };
  }
  if (!file.type.startsWith("image/")) return { ok: false, error: "unsupported_type" };

  const jpeg = await reencodeImage(file).catch(() => null);
  // Undecodable in this browser: send the original if the server accepts it as is.
  const result = jpeg ?? (isAccepted(file.type) ? file : null);
  if (!result) return { ok: false, error: "unsupported_type" };
  if (result.size > MAX_UPLOAD_BYTES) return { ok: false, error: "too_large" };
  return { ok: true, file: result };
}

/** Longest side scaled down to `max`, never up. */
export function fitWithin(width: number, height: number, max = MAX_IMAGE_SIDE) {
  const scale = Math.min(1, max / Math.max(width, height));
  return { width: Math.round(width * scale), height: Math.round(height * scale) };
}

async function reencodeImage(file: Blob): Promise<Blob | null> {
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  try {
    const { width, height } = fitWithin(bitmap.width, bitmap.height);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) return null;
    // JPEG has no transparency: paint white first so transparent PNGs don't turn black.
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, width, height);
    context.imageSmoothingQuality = "high";
    context.drawImage(bitmap, 0, 0, width, height);
    return await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY));
  } finally {
    bitmap.close();
  }
}

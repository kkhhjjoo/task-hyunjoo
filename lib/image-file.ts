const EXT_TO_MIME: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  jpg2: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  heic: "image/heic",
  heif: "image/heif",
  bmp: "image/bmp",
  avif: "image/avif",
};

const ALLOWED_MIMES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/heic",
  "image/heif",
  "image/bmp",
  "image/avif",
  "image/pjpeg",
  "image/x-png",
]);

/** Windows 등에서 file.type이 비어 있을 때 확장자로 MIME 추론 */
export function resolveImageMime(file: File): string {
  const fromType = file.type?.toLowerCase().trim();
  if (fromType && fromType !== "application/octet-stream") {
    if (fromType === "image/jpg") return "image/jpeg";
    return fromType;
  }

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  return EXT_TO_MIME[ext] ?? "";
}

export function isAllowedImage(file: File): boolean {
  const mime = resolveImageMime(file);
  return ALLOWED_MIMES.has(mime);
}

export function getImageMimeError(file: File): string | null {
  if (!file.size) return "빈 파일은 업로드할 수 없습니다.";
  if (file.size > 5 * 1024 * 1024) return "파일 크기는 5MB 이하여야 합니다.";

  const mime = resolveImageMime(file);
  if (!mime || !ALLOWED_MIMES.has(mime)) {
    return "JPG, PNG, WEBP, GIF 형식의 이미지만 업로드할 수 있습니다.";
  }
  return null;
}

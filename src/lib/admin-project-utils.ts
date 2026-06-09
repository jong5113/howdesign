export function createSlug(value: string) {
  const slug = value
    .trim()
    .toLowerCase()
    .normalize("NFKC")
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");

  return slug || `project-${Date.now()}`;
}

export function createFilePath(slug: string, file: File, index: number) {
  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const safeName = file.name
    .replace(/\.[^/.]+$/, "")
    .normalize("NFKC")
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();

  return `${slug}/${String(index + 1).padStart(2, "0")}-${Date.now()}-${safeName || "image"}.${extension}`;
}

export function getStoragePathFromPublicUrl(publicUrl: string) {
  const marker = "/storage/v1/object/public/portfolio/";
  const [, path] = publicUrl.split(marker);
  return path || null;
}

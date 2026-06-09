export const PORTFOLIO_BUCKET = "portfolio";

export function createSlug(value: string) {
  const slug = value
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug.length >= 3 ? slug : `project-${Date.now()}`;
}

export function createSafeSlug(input: string) {
  return createSlug(input);
}

export function createSafeStorageFolder(slug: string, title = "") {
  const safeSlug = createSafeSlug(slug);

  if (safeSlug.startsWith("project-") && title) {
    const safeTitle = createSafeSlug(title);
    return safeTitle.startsWith("project-") ? safeSlug : safeTitle;
  }

  return safeSlug;
}

export function isSafeStoragePath(path: string) {
  return /^[a-z0-9/_.*.-]+$/.test(path);
}

export function createFilePath(slug: string, file: File, index: number) {
  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const timestamp = Date.now();
  const random = crypto.randomUUID().slice(0, 8);

  return `${slug}/image-${String(index + 1).padStart(3, "0")}-${timestamp}-${random}.${extension}`;
}

export function getStoragePathFromPublicUrl(publicUrl: string) {
  const marker = `/storage/v1/object/public/${PORTFOLIO_BUCKET}/`;
  const [, path] = publicUrl.split(marker);
  return path || null;
}

export type StorageErrorDetails = {
  message: string;
  name: string;
  statusCode: string;
  error: string;
  details: string;
  hint: string;
  json: string;
  stringValue: string;
};

type UnknownRecord = Record<string, unknown>;

function getErrorField(error: unknown, field: string) {
  if (error && typeof error === "object" && field in error) {
    const value = (error as UnknownRecord)[field];
    return typeof value === "string" || typeof value === "number" ? String(value) : "";
  }

  return "";
}

export function getStorageErrorDetails(error: unknown): StorageErrorDetails {
  let json = "";

  try {
    json = JSON.stringify(error);
  } catch {
    json = "";
  }

  const stringValue = String(error);

  return {
    message: getErrorField(error, "message"),
    name: getErrorField(error, "name"),
    statusCode: getErrorField(error, "statusCode"),
    error: getErrorField(error, "error"),
    details: getErrorField(error, "details"),
    hint: getErrorField(error, "hint"),
    json,
    stringValue,
  };
}

export function formatStorageError(error: unknown) {
  const details = getStorageErrorDetails(error);
  const parts = [
    details.message ? `message: ${details.message}` : "",
    details.name ? `name: ${details.name}` : "",
    details.statusCode ? `statusCode: ${details.statusCode}` : "",
    details.error ? `error: ${details.error}` : "",
    details.details ? `details: ${details.details}` : "",
    details.hint ? `hint: ${details.hint}` : "",
    details.json && details.json !== "{}" ? `json: ${details.json}` : "",
    details.stringValue && details.stringValue !== "[object Object]" ? `string: ${details.stringValue}` : "",
  ].filter(Boolean);

  return parts.join(" / ") || "Storage 오류 세부 정보가 비어 있습니다. bucket 이름, Storage policy, 파일 크기/타입을 확인하세요.";
}

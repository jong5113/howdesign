"use client";

import { ChangeEvent, DragEvent, FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";

import {
  createFilePath,
  createSafeStorageFolder,
  createSlug,
  formatStorageError,
  getStoragePathFromPublicUrl,
  isSafeStoragePath,
  PORTFOLIO_BUCKET,
} from "@/lib/admin-project-utils";
import { hasSupabaseConfig, supabaseClient } from "@/lib/supabase/client";
import type { PortfolioCategory } from "@/lib/types";

type ProjectFormState = {
  title: string;
  slug: string;
  category: PortfolioCategory;
  subtitle: string;
  location: string;
  area: string;
  scope: string;
  duration: string;
  year: string;
  description: string;
  coverImageUrl: string;
  featured: boolean;
  published: boolean;
  displayOrder: string;
  coverObjectPosition: string;
};

type ProjectRow = {
  id: string;
  title: string | null;
  slug: string | null;
  category: PortfolioCategory | null;
  subtitle: string | null;
  location: string | null;
  area: string | null;
  scope: string | null;
  duration: string | null;
  year: string | number | null;
  description: string | null;
  cover_image_url: string | null;
  featured: boolean | null;
  published: boolean | null;
  display_order: number | null;
  cover_object_position?: string | null;
};

type ImageRow = {
  id: string;
  image_url: string | null;
  alt: string | null;
  display_order: number | null;
};

type ManagedImage =
  | {
      kind: "existing";
      id: string;
      imageUrl: string;
      alt: string;
    }
  | {
      kind: "new";
      id: string;
      file: File;
      previewUrl: string;
    };

type SavedImage = {
  imageUrl: string;
  alt: string;
};

type SupabaseErrorLike = {
  message?: string;
  details?: string;
  hint?: string;
  code?: string;
};

type AdminProjectEditFormProps = {
  projectId: string;
};

const manualCoverId = "__manual-cover-url__";

const emptyForm: ProjectFormState = {
  title: "",
  slug: "",
  category: "commercial",
  subtitle: "",
  location: "",
  area: "",
  scope: "",
  duration: "",
  year: "",
  description: "",
  coverImageUrl: "",
  featured: false,
  published: true,
  displayOrder: "100",
  coverObjectPosition: "center center",
};

function formatSupabaseError(error: SupabaseErrorLike) {
  return [
    error.message ? `message: ${error.message}` : "",
    error.details ? `details: ${error.details}` : "",
    error.hint ? `hint: ${error.hint}` : "",
    error.code ? `code: ${error.code}` : "",
  ]
    .filter(Boolean)
    .join(" / ");
}

function isDuplicateSlugError(error: SupabaseErrorLike) {
  const errorText = formatSupabaseError(error).toLowerCase();
  return error.code === "23505" || errorText.includes("duplicate") || errorText.includes("unique");
}

function getImageUrl(image: ManagedImage) {
  return image.kind === "existing" ? image.imageUrl : image.previewUrl;
}

function getStoragePaths(images: ImageRow[]) {
  return images
    .map((image) => (image.image_url ? getStoragePathFromPublicUrl(image.image_url) : null))
    .filter((path): path is string => Boolean(path))
    .filter((path, index, paths) => paths.indexOf(path) === index);
}

async function cleanupUploadedImages(paths: string[]) {
  if (!supabaseClient || paths.length === 0) {
    return;
  }

  const { error } = await supabaseClient.storage.from(PORTFOLIO_BUCKET).remove(paths);

  if (error) {
    console.error("[Admin edit] Uploaded file cleanup failed.", {
      bucket: PORTFOLIO_BUCKET,
      paths,
      errorDetails: formatStorageError(error),
      rawError: error,
    });
  }
}

export function AdminProjectEditForm({ projectId }: AdminProjectEditFormProps) {
  const [form, setForm] = useState<ProjectFormState>(emptyForm);
  const [images, setImages] = useState<ManagedImage[]>([]);
  const [deletedImages, setDeletedImages] = useState<ImageRow[]>([]);
  const [coverImageId, setCoverImageId] = useState(manualCoverId);
  const [savedSlug, setSavedSlug] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const canSave = useMemo(
    () => Boolean(form.title.trim() && form.slug.trim() && (images.length > 0 || form.coverImageUrl.trim()) && hasSupabaseConfig),
    [form.coverImageUrl, form.slug, form.title, images.length],
  );

  useEffect(() => {
    async function loadProject() {
      if (!supabaseClient || !hasSupabaseConfig) {
        setErrorMessage("Supabase 환경변수가 설정되어 있지 않습니다.");
        setIsLoading(false);
        return;
      }

      let { data: project, error: projectError } = await supabaseClient
        .from("portfolio_projects")
        .select(
          "id, title, slug, category, subtitle, location, area, scope, duration, year, description, cover_image_url, cover_object_position, featured, published, display_order",
        )
        .eq("id", projectId)
        .maybeSingle<ProjectRow>();

      if (projectError && projectError.message.includes("cover_object_position")) {
        const fallbackResult = await supabaseClient
          .from("portfolio_projects")
          .select(
            "id, title, slug, category, subtitle, location, area, scope, duration, year, description, cover_image_url, featured, published, display_order",
          )
          .eq("id", projectId)
          .maybeSingle<ProjectRow>();

        project = fallbackResult.data;
        projectError = fallbackResult.error;
      }

      if (projectError || !project) {
        console.error("[Admin edit] Failed to load project.", projectError);
        setErrorMessage(projectError?.message || "프로젝트를 찾을 수 없습니다.");
        setIsLoading(false);
        return;
      }

      const { data: projectImages, error: imagesError } = await supabaseClient
        .from("portfolio_images")
        .select("id, image_url, alt, display_order")
        .eq("project_id", projectId)
        .order("display_order", { ascending: true });

      if (imagesError) {
        console.error("[Admin edit] Failed to load project images.", imagesError);
        setErrorMessage(imagesError.message);
        setIsLoading(false);
        return;
      }

      const nextImages = ((projectImages || []) as ImageRow[])
        .filter((image) => Boolean(image.image_url))
        .map((image) => ({
          kind: "existing" as const,
          id: image.id,
          imageUrl: image.image_url || "",
          alt: image.alt || project.title || "",
        }));
      const coverImageUrl = project.cover_image_url || "";
      const coverImage = nextImages.find((image) => image.imageUrl === coverImageUrl);

      setForm({
        title: project.title || "",
        slug: project.slug || "",
        category: project.category || "commercial",
        subtitle: project.subtitle || "",
        location: project.location || "",
        area: project.area || "",
        scope: project.scope || "",
        duration: project.duration || "",
        year: project.year ? String(project.year) : "",
        description: project.description || "",
        coverImageUrl,
        featured: Boolean(project.featured),
        published: Boolean(project.published),
        displayOrder: String(project.display_order ?? 100),
        coverObjectPosition: project.cover_object_position || "center center",
      });
      setImages(nextImages);
      setCoverImageId(coverImage?.id || manualCoverId);
      setSavedSlug(project.slug || "");
      setIsLoading(false);
    }

    void loadProject();
  }, [projectId]);

  useEffect(() => {
    return () => {
      images.forEach((image) => {
        if (image.kind === "new") {
          URL.revokeObjectURL(image.previewUrl);
        }
      });
    };
  }, [images]);

  function updateField(field: keyof ProjectFormState, value: string | boolean) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function addFiles(fileList: FileList | File[]) {
    const selectedFiles = Array.from(fileList).filter((file) => file.type.startsWith("image/"));

    if (selectedFiles.length === 0) {
      return;
    }

    const nextImages = selectedFiles.map((file) => ({
      kind: "new" as const,
      id: `${file.name}-${file.lastModified}-${crypto.randomUUID()}`,
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    setImages((current) => [...current, ...nextImages]);
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files) {
      addFiles(event.target.files);
      event.target.value = "";
    }
  }

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setIsDragging(false);
    addFiles(event.dataTransfer.files);
  }

  function moveImage(index: number, direction: "up" | "down") {
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= images.length) {
      return;
    }

    setImages((current) => {
      const next = [...current];
      [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
      return next;
    });
  }

  function removeImage(index: number) {
    setImages((current) => {
      const next = [...current];
      const [removedImage] = next.splice(index, 1);

      if (removedImage?.kind === "existing") {
        setDeletedImages((deleted) => [
          ...deleted,
          {
            id: removedImage.id,
            image_url: removedImage.imageUrl,
            alt: removedImage.alt,
            display_order: index + 1,
          },
        ]);
      }

      if (removedImage?.kind === "new") {
        URL.revokeObjectURL(removedImage.previewUrl);
      }

      if (removedImage?.id === coverImageId) {
        setCoverImageId(next[0]?.id || manualCoverId);
      }

      return next;
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setErrorMessage("");

    if (!supabaseClient || !hasSupabaseConfig) {
      setErrorMessage("Supabase 환경변수가 설정되어 있지 않습니다.");
      return;
    }

    if (!canSave) {
      setErrorMessage("title, slug, cover image 또는 gallery image가 필요합니다.");
      return;
    }

    const client = supabaseClient;
    const slug = createSlug(form.slug);
    const storageFolder = createSafeStorageFolder(slug, form.title);
    setIsSaving(true);

    try {
      setMessage("Uploading new images...");
      const savedImages: SavedImage[] = [];
      const uploadedPaths: string[] = [];

      for (const [index, image] of images.entries()) {
        if (image.kind === "existing") {
          savedImages.push({
            imageUrl: image.imageUrl,
            alt: image.alt,
          });
          continue;
        }

        const path = createFilePath(storageFolder, image.file, index);
        if (!isSafeStoragePath(path)) {
          throw new Error("Storage 경로에 사용할 수 없는 문자가 있습니다. slug를 영어 소문자와 하이픈으로 수정해주세요.");
        }
        const uploadLog = {
          bucket: PORTFOLIO_BUCKET,
          path,
          fileName: image.file.name,
          fileType: image.file.type,
          fileSize: image.file.size,
          slug,
          storageFolder,
          step: "uploading image",
        };
        console.log("[Admin edit] Uploading image.", uploadLog);
        setMessage(`Uploading to ${PORTFOLIO_BUCKET}/${path}`);
        const { data: uploadData, error: uploadError } = await client.storage
          .from(PORTFOLIO_BUCKET)
          .upload(path, image.file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) {
          const formattedError = formatStorageError(uploadError);
          console.error("[Admin edit] Storage upload failed.", {
            ...uploadLog,
            errorDetails: formattedError,
            rawError: uploadError,
          });
          await cleanupUploadedImages(uploadedPaths);
          throw new Error(`Storage 업로드 실패로 프로젝트 저장을 중단했습니다. ${formattedError}`);
        }

        uploadedPaths.push(uploadData.path);
        console.log("[Admin edit] Upload complete.", {
          bucket: PORTFOLIO_BUCKET,
          path: uploadData.path,
          slug,
          storageFolder,
          step: "upload complete",
        });

        const { data: publicUrlData } = client.storage.from(PORTFOLIO_BUCKET).getPublicUrl(uploadData.path);
        savedImages.push({
          imageUrl: publicUrlData.publicUrl,
          alt: form.title.trim(),
        });
      }

      const coverIndex = images.findIndex((image) => image.id === coverImageId);
      const coverImageUrl =
        coverImageId === manualCoverId
          ? form.coverImageUrl.trim()
          : savedImages[coverIndex]?.imageUrl || savedImages[0]?.imageUrl || form.coverImageUrl.trim();

      setMessage("Updating project...");
      const projectPayload = {
        title: form.title.trim(),
        slug,
        category: form.category,
        subtitle: form.subtitle.trim() || null,
        location: form.location.trim() || null,
        area: form.area.trim() || null,
        scope: form.scope.trim() || null,
        duration: form.duration.trim() || null,
        year: form.year.trim() || null,
        description: form.description.trim() || null,
        cover_image_url: coverImageUrl || null,
        cover_object_position: form.coverObjectPosition.trim() || "center center",
        featured: form.featured,
        published: form.published,
        display_order: Number(form.displayOrder) || 100,
      };

      let { error: projectError } = await client
        .from("portfolio_projects")
        .update(projectPayload)
        .eq("id", projectId);

      if (projectError && projectError.message.includes("cover_object_position")) {
        const fallbackPayload = { ...projectPayload };
        delete (fallbackPayload as Partial<typeof fallbackPayload>).cover_object_position;
        const fallbackResult = await client
          .from("portfolio_projects")
          .update(fallbackPayload)
          .eq("id", projectId);

        projectError = fallbackResult.error;
      }

      if (projectError) {
        console.error("[Admin edit] Project update failed.", projectError);
        await cleanupUploadedImages(uploadedPaths);

        if (isDuplicateSlugError(projectError)) {
          throw new Error("이미 사용 중인 slug입니다. slug를 바꿔주세요.");
        }

        throw new Error(`프로젝트 수정 실패: ${formatSupabaseError(projectError)}`);
      }

      setMessage("Saving gallery images...");
      const { error: deleteImagesError } = await client.from("portfolio_images").delete().eq("project_id", projectId);

      if (deleteImagesError) {
        console.error("[Admin edit] Image reset failed.", deleteImagesError);
        throw new Error(`기존 이미지 정리 실패: ${formatSupabaseError(deleteImagesError)}`);
      }

      if (savedImages.length > 0) {
        const { error: insertImagesError } = await client.from("portfolio_images").insert(
          savedImages.map((image, index) => ({
            project_id: projectId,
            image_url: image.imageUrl,
            alt: image.alt || form.title.trim(),
            display_order: index + 1,
          })),
        );

        if (insertImagesError) {
          console.error("[Admin edit] Image insert failed.", insertImagesError);
          await cleanupUploadedImages(uploadedPaths);
          throw new Error(`이미지 저장 실패: ${formatSupabaseError(insertImagesError)}`);
        }
      }

      const storagePaths = getStoragePaths(deletedImages);

      if (storagePaths.length > 0) {
        const { error: storageDeleteError } = await client.storage.from(PORTFOLIO_BUCKET).remove(storagePaths);

        if (storageDeleteError) {
          console.error("[Admin edit] Removed image storage cleanup failed.", storageDeleteError);
          setMessage(`저장은 완료됐지만 Storage 이미지 정리에 실패했습니다: ${storageDeleteError.message}`);
        }
      }

      setDeletedImages([]);
      setForm((current) => ({ ...current, slug, coverImageUrl: coverImageUrl || "" }));
      setSavedSlug(slug);
      setMessage("Complete. 프로젝트가 수정되었습니다.");
    } catch (error) {
      const nextError = error instanceof Error ? error.message : "수정 중 오류가 발생했습니다.";
      console.error("[Admin edit] Save failed.", error);
      setErrorMessage(nextError);
      window.alert(nextError);
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return <p className="text-[13px] text-muted">Loading project...</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-10">
      {errorMessage ? (
        <div className="border border-foreground px-4 py-3 text-[13px] leading-6" role="alert">
          {errorMessage}
        </div>
      ) : null}
      {message ? <p className="text-[13px] text-muted">{message}</p> : null}

      <div className="grid gap-5 lg:grid-cols-2">
        <label className="grid gap-2 text-[12px] uppercase tracking-[0.08em]">
          Title / 현장명(한글)
          <input
            value={form.title}
            onChange={(event) => updateField("title", event.target.value)}
            className="border-b border-line bg-transparent py-2 text-[15px] normal-case tracking-normal outline-none"
            placeholder="예: 대동장어 여의도점"
            required
          />
        </label>
        <label className="grid gap-2 text-[12px] uppercase tracking-[0.08em]">
          Slug
          <input
            value={form.slug}
            onChange={(event) => updateField("slug", createSlug(event.target.value))}
            className="border-b border-line bg-transparent py-2 text-[15px] normal-case tracking-normal outline-none"
            required
          />
          <span className="text-[11px] normal-case tracking-normal text-muted">
            영어 소문자, 숫자, 하이픈만 권장합니다. 변경하면 공개 상세페이지 주소도 함께 바뀝니다.
          </span>
        </label>
        <label className="grid gap-2 text-[12px] uppercase tracking-[0.08em]">
          Category
          <select
            value={form.category}
            onChange={(event) => updateField("category", event.target.value as PortfolioCategory)}
            className="border-b border-line bg-transparent py-2 text-[15px] normal-case tracking-normal outline-none"
          >
            <option value="commercial">Commercial</option>
            <option value="residential">Residential</option>
          </select>
        </label>
        <label className="grid gap-2 text-[12px] uppercase tracking-[0.08em]">
          Date of Completion
          <input
            value={form.year}
            onChange={(event) => updateField("year", event.target.value)}
            className="border-b border-line bg-transparent py-2 text-[15px] normal-case tracking-normal outline-none"
            placeholder="예: May. 2026"
          />
        </label>
        <label className="grid gap-2 text-[12px] uppercase tracking-[0.08em]">
          Display Order
          <input
            value={form.displayOrder}
            onChange={(event) => updateField("displayOrder", event.target.value)}
            className="border-b border-line bg-transparent py-2 text-[15px] normal-case tracking-normal outline-none"
            inputMode="numeric"
            placeholder="낮은 숫자가 먼저 노출됩니다"
          />
        </label>
        <label className="grid gap-2 text-[12px] uppercase tracking-[0.08em]">
          Cover Position
          <input
            value={form.coverObjectPosition}
            onChange={(event) => updateField("coverObjectPosition", event.target.value)}
            className="border-b border-line bg-transparent py-2 text-[15px] normal-case tracking-normal outline-none"
            placeholder="center center"
          />
          <span className="text-[11px] normal-case tracking-normal text-muted">
            Thumbnail focus. Examples: center center, center top, center 35%
          </span>
        </label>
        {[
          { field: "subtitle", label: "Subtitle / 현장명(영문)", placeholder: "예: DAEDONG EEL YEOUIDO" },
          { field: "location", label: "Site / 위치", placeholder: "예: 서울 여의도" },
          { field: "area", label: "Area", placeholder: "예: 198.9 m2 / 60 py" },
          { field: "scope", label: "Scope", placeholder: "예: Interior Design" },
          { field: "duration", label: "Duration", placeholder: "예: 8 weeks" },
        ].map(({ field, label, placeholder }) => (
          <label key={field} className="grid gap-2 text-[12px] uppercase tracking-[0.08em]">
            {label}
            <input
              value={form[field as keyof Pick<typeof form, "subtitle" | "location" | "area" | "scope" | "duration">]}
              onChange={(event) =>
                updateField(
                  field as keyof Pick<typeof form, "subtitle" | "location" | "area" | "scope" | "duration">,
                  event.target.value,
                )
              }
              className="border-b border-line bg-transparent py-2 text-[15px] normal-case tracking-normal outline-none"
              placeholder={placeholder}
            />
          </label>
        ))}
        <label className="grid gap-2 text-[12px] uppercase tracking-[0.08em] lg:col-span-2">
          Description
          <textarea
            value={form.description}
            onChange={(event) => updateField("description", event.target.value)}
            className="min-h-28 border-b border-line bg-transparent py-2 text-[15px] normal-case tracking-normal outline-none"
          />
        </label>
      </div>

      <div className="flex flex-wrap gap-6 text-[12px] uppercase tracking-[0.08em]">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(event) => updateField("featured", event.target.checked)}
          />
          Featured
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(event) => updateField("published", event.target.checked)}
          />
          Published
        </label>
      </div>

      <section className="grid gap-5">
        <div className="grid gap-3">
          <p className="text-[12px] uppercase tracking-[0.08em]">Cover Image</p>
          {form.coverImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={form.coverImageUrl} alt="" className="aspect-[3/2] w-full max-w-sm object-cover" />
          ) : null}
          <label className="flex items-center gap-2 text-[12px] uppercase tracking-[0.08em]">
            <input
              type="radio"
              name="coverImage"
              checked={coverImageId === manualCoverId}
              onChange={() => setCoverImageId(manualCoverId)}
            />
            Use cover image URL
          </label>
          <input
            value={form.coverImageUrl}
            onChange={(event) => {
              updateField("coverImageUrl", event.target.value);
              setCoverImageId(manualCoverId);
            }}
            className="border-b border-line bg-transparent py-2 text-[13px] outline-none"
            placeholder="cover_image_url"
          />
        </div>

        <label
          onDrop={handleDrop}
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          className={`grid min-h-36 cursor-pointer place-items-center border border-line px-5 py-8 text-center text-[12px] uppercase tracking-[0.08em] ${
            isDragging ? "bg-[#f7f7f7]" : "bg-transparent"
          }`}
        >
          <input type="file" accept="image/*" multiple onChange={handleFileChange} className="sr-only" />
          이미지 추가 업로드
        </label>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((image, index) => (
            <figure key={image.id} className="grid gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={getImageUrl(image)} alt="" className="aspect-[3/2] w-full object-cover" />
              <figcaption className="grid gap-2 text-[11px] uppercase tracking-[0.08em] text-muted">
                <p>Display Order: {index + 1}</p>
                <label className="flex items-center gap-2 text-foreground">
                  <input
                    type="radio"
                    name="coverImage"
                    checked={coverImageId === image.id}
                    onChange={() => setCoverImageId(image.id)}
                  />
                  Set as cover image
                </label>
                <div className="flex gap-3">
                  <button type="button" onClick={() => moveImage(index, "up")} disabled={index === 0}>
                    Up
                  </button>
                  <button
                    type="button"
                    onClick={() => moveImage(index, "down")}
                    disabled={index === images.length - 1}
                  >
                    Down
                  </button>
                  <button type="button" onClick={() => removeImage(index)}>
                    Delete
                  </button>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={!canSave || isSaving}
          className="border border-foreground px-5 py-3 text-[12px] uppercase tracking-[0.08em] disabled:border-line disabled:text-muted"
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
        {savedSlug ? (
          <>
            <Link href={`/portfolio/${savedSlug}`} className="text-[12px] uppercase tracking-[0.08em] underline">
              View Project
            </Link>
            <Link href="/admin/projects" className="text-[12px] uppercase tracking-[0.08em] underline">
              Back to Admin
            </Link>
          </>
        ) : null}
      </div>
    </form>
  );
}

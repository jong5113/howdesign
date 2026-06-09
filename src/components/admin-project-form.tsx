"use client";

import { ChangeEvent, DragEvent, FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { createFilePath, createSlug } from "@/lib/admin-project-utils";
import { hasSupabaseConfig, supabaseClient } from "@/lib/supabase/client";
import type { PortfolioCategory } from "@/lib/types";

type UploadImage = {
  id: string;
  file: File;
  previewUrl: string;
};

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
  featured: boolean;
  published: boolean;
  displayOrder: string;
};

type InsertedProject = {
  id: string;
  slug: string;
};

type SupabaseErrorLike = {
  message?: string;
  details?: string;
  hint?: string;
  code?: string;
};

type SubmitStatus = "idle" | "uploading" | "creating" | "saving-images" | "complete" | "error";

const initialFormState: ProjectFormState = {
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
  featured: false,
  published: true,
  displayOrder: "100",
};

function formatSupabaseError(error: SupabaseErrorLike) {
  const parts = [
    error.message ? `message: ${error.message}` : "",
    error.details ? `details: ${error.details}` : "",
    error.hint ? `hint: ${error.hint}` : "",
    error.code ? `code: ${error.code}` : "",
  ].filter(Boolean);

  return parts.join(" / ") || "알 수 없는 Supabase 오류";
}

function isDuplicateSlugError(error: SupabaseErrorLike) {
  const errorText = formatSupabaseError(error).toLowerCase();
  return error.code === "23505" || errorText.includes("duplicate") || errorText.includes("unique");
}

export function AdminProjectForm() {
  const [form, setForm] = useState<ProjectFormState>(initialFormState);
  const [images, setImages] = useState<UploadImage[]>([]);
  const [coverIndex, setCoverIndex] = useState(0);
  const [slugEdited, setSlugEdited] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");
  const [savedSlug, setSavedSlug] = useState("");

  const canSubmit = useMemo(
    () => Boolean(form.title.trim() && form.slug.trim() && images.length > 0 && hasSupabaseConfig),
    [form.slug, form.title, images.length],
  );

  useEffect(() => {
    return () => {
      images.forEach((image) => URL.revokeObjectURL(image.previewUrl));
    };
  }, [images]);

  function updateField(field: keyof ProjectFormState, value: string | boolean) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function updateTitle(title: string) {
    setForm((current) => ({
      ...current,
      title,
      slug: slugEdited ? current.slug : createSlug(title),
    }));
  }

  function addFiles(fileList: FileList | File[]) {
    const selectedFiles = Array.from(fileList).filter((file) => file.type.startsWith("image/"));

    if (selectedFiles.length === 0) {
      return;
    }

    setImages((current) => [
      ...current,
      ...selectedFiles.map((file) => ({
        id: `${file.name}-${file.lastModified}-${crypto.randomUUID()}`,
        file,
        previewUrl: URL.createObjectURL(file),
      })),
    ]);
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

  function removeImage(index: number) {
    setImages((current) => {
      const next = [...current];
      const [removedImage] = next.splice(index, 1);

      if (removedImage) {
        URL.revokeObjectURL(removedImage.previewUrl);
      }

      return next;
    });
    setCoverIndex((current) => Math.max(0, Math.min(current, images.length - 2)));
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

    if (coverIndex === index) {
      setCoverIndex(targetIndex);
    } else if (coverIndex === targetIndex) {
      setCoverIndex(index);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setErrorMessage("");
    setSavedSlug("");
    setSubmitStatus("idle");

    if (!supabaseClient || !hasSupabaseConfig) {
      const nextError = "Supabase 환경변수가 설정되어 있지 않습니다.";
      console.error("[Admin upload] Missing Supabase config.");
      setErrorMessage(nextError);
      return;
    }

    const client = supabaseClient;

    if (!canSubmit) {
      setErrorMessage("필수 항목과 이미지를 확인해주세요. title, slug, 이미지가 필요합니다.");
      return;
    }

    if (!form.published) {
      setMessage("Published가 꺼져 있어 저장 후 공개 페이지에는 보이지 않을 수 있습니다.");
    }

    setIsSubmitting(true);

    try {
      const slug = createSlug(form.slug);
      setSubmitStatus("uploading");
      setMessage("Uploading images...");

      const uploadedImages = [];

      for (const [index, image] of images.entries()) {
        const path = createFilePath(slug, image.file, index);
        const { data: uploadData, error: uploadError } = await client.storage
          .from("portfolio")
          .upload(path, image.file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) {
          const formattedError = formatSupabaseError(uploadError);
          console.error("[Admin upload] Storage upload failed.", {
            bucket: "portfolio",
            path,
            error: uploadError,
          });
          throw new Error(
            `Storage 업로드 실패: ${formattedError}. Supabase Storage bucket 또는 policy를 확인하세요.`,
          );
        }

        const { data: publicUrlData } = client.storage.from("portfolio").getPublicUrl(uploadData.path);

        uploadedImages.push({
          imageUrl: publicUrlData.publicUrl,
          displayOrder: index + 1,
        });
      }

      const coverImageUrl = uploadedImages[coverIndex]?.imageUrl || uploadedImages[0]?.imageUrl;
      setSubmitStatus("creating");
      setMessage("Creating project...");

      const { data: project, error: projectError } = await client
        .from("portfolio_projects")
        .insert({
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
          cover_image_url: coverImageUrl,
          featured: form.featured,
          published: form.published,
          display_order: Number(form.displayOrder) || 100,
        })
        .select("id, slug")
        .single<InsertedProject>();

      if (projectError || !project) {
        console.error("[Admin upload] portfolio_projects insert failed.", projectError);

        if (projectError && isDuplicateSlugError(projectError)) {
          throw new Error("이미 사용 중인 slug입니다. slug를 바꿔주세요.");
        }

        throw new Error(
          `portfolio_projects 저장 실패: ${
            projectError ? formatSupabaseError(projectError) : "프로젝트 row가 반환되지 않았습니다."
          }`,
        );
      }

      setSubmitStatus("saving-images");
      setMessage("Saving gallery images...");

      const { error: imagesError } = await client.from("portfolio_images").insert(
        uploadedImages.map((image) => ({
          project_id: project.id,
          image_url: image.imageUrl,
          alt: form.title.trim(),
          display_order: image.displayOrder,
        })),
      );

      if (imagesError) {
        console.error("[Admin upload] portfolio_images insert failed.", imagesError);
        throw new Error(`portfolio_images 저장 실패: ${formatSupabaseError(imagesError)}`);
      }

      setSubmitStatus("complete");
      setSavedSlug(project.slug);
      setMessage("Complete. 프로젝트가 저장되었습니다.");
    } catch (error) {
      setSubmitStatus("error");
      const nextError = error instanceof Error ? error.message : "저장 중 알 수 없는 오류가 발생했습니다.";
      console.error("[Admin upload] Save Project failed.", error);
      setErrorMessage(nextError);
      window.alert(nextError);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-10">
      <div className="grid gap-3">
        {errorMessage ? (
          <div className="border border-foreground px-4 py-3 text-[13px] leading-6" role="alert">
            <p className="mb-1 uppercase tracking-[0.08em]">Save failed</p>
            <p>{errorMessage}</p>
          </div>
        ) : null}
        {message ? (
          <div className="border border-line px-4 py-3 text-[13px] leading-6 text-muted">
            <p className="uppercase tracking-[0.08em]">Status</p>
            <p>
              {message}
              {submitStatus !== "idle" ? ` (${submitStatus})` : ""}
            </p>
          </div>
        ) : null}
        {!form.published ? (
          <p className="text-[12px] leading-5 text-muted">
            Published가 꺼져 있습니다. 저장은 가능하지만 공개 포트폴리오 페이지에는 보이지 않을 수 있습니다.
          </p>
        ) : null}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <label className="grid gap-2 text-[12px] uppercase tracking-[0.08em]">
          Title / 현장명(한글)
          <input
            value={form.title}
            onChange={(event) => updateTitle(event.target.value)}
            className="border-b border-line bg-transparent py-2 text-[15px] normal-case tracking-normal outline-none"
            placeholder="예: 대동장어 여의도점"
            required
          />
        </label>
        <label className="grid gap-2 text-[12px] uppercase tracking-[0.08em]">
          Slug
          <input
            value={form.slug}
            onChange={(event) => {
              setSlugEdited(true);
              updateField("slug", createSlug(event.target.value));
            }}
            className="border-b border-line bg-transparent py-2 text-[15px] normal-case tracking-normal outline-none"
            required
          />
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

      <section className="grid gap-4">
        <label
          onDrop={handleDrop}
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          className={`grid min-h-40 cursor-pointer place-items-center border border-line px-5 py-10 text-center text-[12px] uppercase tracking-[0.08em] ${
            isDragging ? "bg-[#f7f7f7]" : "bg-transparent"
          }`}
        >
          <input type="file" accept="image/*" multiple onChange={handleFileChange} className="sr-only" />
          이미지를 드래그하거나 클릭해서 여러 장 업로드
        </label>

        {images.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {images.map((image, index) => (
              <figure key={image.id} className="grid gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image.previewUrl} alt="" className="aspect-[3/2] w-full object-cover" />
                <figcaption className="grid gap-2 text-[11px] uppercase tracking-[0.08em] text-muted">
                  <label className="flex items-center gap-2 text-foreground">
                    <input
                      type="radio"
                      name="coverImage"
                      checked={coverIndex === index}
                      onChange={() => setCoverIndex(index)}
                    />
                    대표 이미지
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
                      Remove
                    </button>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        ) : null}
      </section>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={!canSubmit || isSubmitting}
          className="border border-foreground px-5 py-3 text-[12px] uppercase tracking-[0.08em] disabled:border-line disabled:text-muted"
        >
          {isSubmitting ? "Saving..." : "Save Project"}
        </button>
        {savedSlug && submitStatus === "complete" ? (
          <Link href={`/portfolio/${savedSlug}`} className="text-[12px] uppercase tracking-[0.08em] underline">
            View Project
          </Link>
        ) : null}
      </div>
    </form>
  );
}

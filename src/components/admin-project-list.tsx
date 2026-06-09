"use client";

import { useState } from "react";
import Link from "next/link";

import { getStoragePathFromPublicUrl } from "@/lib/admin-project-utils";
import { hasSupabaseConfig, supabaseClient } from "@/lib/supabase/client";
import type { PortfolioCategory } from "@/lib/types";

export type AdminProject = {
  id: string;
  title: string | null;
  slug: string | null;
  category: PortfolioCategory | null;
  year: number | null;
  published: boolean | null;
  featured: boolean | null;
  created_at: string | null;
};

type ProjectImage = {
  image_url: string | null;
};

type AdminProjectListProps = {
  initialProjects: AdminProject[];
  initialError?: string;
};

export function AdminProjectList({ initialProjects, initialError = "" }: AdminProjectListProps) {
  const [projects, setProjects] = useState<AdminProject[]>(initialProjects);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState(initialError);

  async function loadProjects() {
    setIsLoading(true);
    setErrorMessage("");

    if (!supabaseClient || !hasSupabaseConfig) {
      setErrorMessage("Supabase 환경변수가 설정되어 있지 않습니다.");
      setIsLoading(false);
      return;
    }

    const { data, error } = await supabaseClient
      .from("portfolio_projects")
      .select("id, title, slug, category, year, published, featured, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[Admin projects] Failed to load projects.", error);
      setErrorMessage(error.message);
      setIsLoading(false);
      return;
    }

    setProjects((data || []) as AdminProject[]);
    setIsLoading(false);
  }

  async function toggleProject(project: AdminProject, field: "published" | "featured") {
    if (!supabaseClient) {
      return;
    }

    setMessage("");
    setErrorMessage("");

    const nextValue = !project[field];
    const { error } = await supabaseClient
      .from("portfolio_projects")
      .update({ [field]: nextValue })
      .eq("id", project.id);

    if (error) {
      console.error(`[Admin projects] Failed to update ${field}.`, error);
      setErrorMessage(error.message);
      return;
    }

    setProjects((current) =>
      current.map((item) => (item.id === project.id ? { ...item, [field]: nextValue } : item)),
    );
    setMessage(`${project.title || "프로젝트"} ${field} 값을 변경했습니다.`);
  }

  async function deleteProject(project: AdminProject) {
    if (!supabaseClient) {
      return;
    }

    const confirmed = window.confirm(
      `${project.title || "프로젝트"}를 삭제할까요? DB row와 연결된 이미지 row가 삭제됩니다.`,
    );

    if (!confirmed) {
      return;
    }

    setMessage("");
    setErrorMessage("");

    const { data: images, error: imagesError } = await supabaseClient
      .from("portfolio_images")
      .select("image_url")
      .eq("project_id", project.id);

    if (imagesError) {
      console.error("[Admin projects] Failed to load images before delete.", imagesError);
      setErrorMessage(imagesError.message);
      return;
    }

    const storagePaths = ((images || []) as ProjectImage[])
      .map((image) => (image.image_url ? getStoragePathFromPublicUrl(image.image_url) : null))
      .filter((path): path is string => Boolean(path));

    if (storagePaths.length > 0) {
      const { error: storageError } = await supabaseClient.storage.from("portfolio").remove(storagePaths);

      if (storageError) {
        console.error("[Admin projects] Storage image delete failed.", storageError);
        setErrorMessage(`Storage 이미지 삭제 실패: ${storageError.message}`);
        return;
      }
    }

    const { error } = await supabaseClient.from("portfolio_projects").delete().eq("id", project.id);

    if (error) {
      console.error("[Admin projects] Project delete failed.", error);
      setErrorMessage(error.message);
      return;
    }

    setProjects((current) => current.filter((item) => item.id !== project.id));
    setMessage(`${project.title || "프로젝트"}를 삭제했습니다.`);
  }

  return (
    <section className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link href="/admin/projects/new" className="text-[12px] uppercase tracking-[0.09em] underline">
          New Project
        </Link>
        <button type="button" onClick={loadProjects} className="text-[12px] uppercase tracking-[0.09em]">
          Refresh
        </button>
      </div>

      {errorMessage ? (
        <div className="border border-foreground px-4 py-3 text-[13px] leading-6" role="alert">
          {errorMessage}
        </div>
      ) : null}
      {message ? <p className="text-[13px] text-muted">{message}</p> : null}

      {isLoading ? <p className="text-[13px] text-muted">Loading projects...</p> : null}

      {!isLoading && projects.length === 0 ? (
        <p className="text-[13px] text-muted">등록된 프로젝트가 없습니다.</p>
      ) : null}

      {projects.length > 0 ? (
        <div className="grid border-t border-line">
          {projects.map((project) => (
            <div
              key={project.id}
              className="grid gap-4 border-b border-line py-4 text-[13px] sm:grid-cols-[1.5fr_0.8fr_0.5fr_0.8fr_0.8fr_auto] sm:items-center"
            >
              <div>
                <p>{project.title}</p>
                <p className="text-[11px] text-muted">{project.slug}</p>
              </div>
              <p className="capitalize text-muted">{project.category}</p>
              <p>{project.year}</p>
              <button
                type="button"
                onClick={() => toggleProject(project, "published")}
                className="w-fit text-left underline-offset-4 hover:underline"
              >
                Published: {project.published ? "On" : "Off"}
              </button>
              <button
                type="button"
                onClick={() => toggleProject(project, "featured")}
                className="w-fit text-left underline-offset-4 hover:underline"
              >
                Featured: {project.featured ? "On" : "Off"}
              </button>
              <div className="flex gap-4 text-[12px] uppercase tracking-[0.09em]">
                <Link href={`/admin/projects/${project.id}/edit`} className="underline-offset-4 hover:underline">
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => deleteProject(project)}
                  className="uppercase tracking-[0.09em] text-muted"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}

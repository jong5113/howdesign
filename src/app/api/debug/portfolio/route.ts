import { NextResponse } from "next/server";

import {
  IMAGE_SELECT_COLUMNS,
  PROJECT_SELECT_COLUMNS,
  type PortfolioImageRow,
  type PortfolioProjectRow,
} from "@/lib/portfolio";
import {
  hasSupabaseConfig,
  supabaseAnonKeyExists,
  supabaseClient,
  supabaseUrlExists,
  supabaseUrlPreview,
} from "@/lib/supabase/client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type ProjectPreview = Pick<
  PortfolioProjectRow,
  "title" | "slug" | "published" | "featured" | "category"
> & {
  cover_image_url_exists: boolean;
};

type ProjectBySlugPreview = Pick<
  PortfolioProjectRow,
  "id" | "title" | "slug" | "category" | "cover_image_url" | "published" | "featured"
> | null;

type ImagePreview = Pick<PortfolioImageRow, "image_url" | "display_order">;

type DebugError = {
  message: string;
};

type DebugPortfolioResponse = {
  env: {
    supabaseUrlExists: boolean;
    supabaseAnonKeyExists: boolean;
    supabaseUrlPreview: string | null;
  };
  requestedSlug: string | null;
  publicProjectsCount: number | null;
  allProjectsPreview: ProjectPreview[];
  rawProjectBySlug: ProjectBySlugPreview;
  publishedProjectBySlug: ProjectBySlugPreview;
  images: ImagePreview[];
  error: DebugError | null;
  errors: {
    allProjects?: DebugError;
    publicProjectsCount?: DebugError;
    rawProjectBySlug?: DebugError;
    publishedProjectBySlug?: DebugError;
    images?: DebugError;
  };
};

const noStoreHeaders = {
  "Cache-Control": "no-store",
};

function projectToPreview(project: PortfolioProjectRow): ProjectPreview {
  return {
    title: project.title,
    slug: project.slug,
    published: project.published,
    featured: project.featured,
    category: project.category,
    cover_image_url_exists: Boolean(project.cover_image_url),
  };
}

function projectToSlugPreview(project: PortfolioProjectRow | null): ProjectBySlugPreview {
  if (!project) {
    return null;
  }

  return {
    id: project.id,
    title: project.title,
    slug: project.slug,
    category: project.category,
    cover_image_url: project.cover_image_url,
    published: project.published,
    featured: project.featured,
  };
}

function createBaseResponse(slug: string | null): DebugPortfolioResponse {
  return {
    env: {
      supabaseUrlExists,
      supabaseAnonKeyExists,
      supabaseUrlPreview,
    },
    requestedSlug: slug,
    publicProjectsCount: null,
    allProjectsPreview: [],
    rawProjectBySlug: null,
    publishedProjectBySlug: null,
    images: [],
    error: null,
    errors: {},
  };
}

function firstError(errors: DebugPortfolioResponse["errors"]) {
  return (
    errors.allProjects ||
    errors.publicProjectsCount ||
    errors.rawProjectBySlug ||
    errors.publishedProjectBySlug ||
    errors.images ||
    null
  );
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const slug = url.searchParams.get("slug")?.trim() || null;
  const response = createBaseResponse(slug);

  if (!hasSupabaseConfig || !supabaseClient) {
    return NextResponse.json(
      {
        ...response,
        error: {
          message:
            "Supabase environment variables are missing. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
        },
      },
      {
        headers: noStoreHeaders,
      },
    );
  }

  try {
    const { data: allProjects, error: allProjectsError } = await supabaseClient
      .from("portfolio_projects")
      .select(PROJECT_SELECT_COLUMNS)
      .order("created_at", { ascending: false })
      .limit(10);

    if (allProjectsError) {
      response.errors.allProjects = { message: allProjectsError.message };
    } else {
      response.allProjectsPreview = ((allProjects || []) as PortfolioProjectRow[]).map(projectToPreview);
    }

    const { count: publicProjectsCount, error: countError } = await supabaseClient
      .from("portfolio_projects")
      .select("id", {
        count: "exact",
        head: true,
      })
      .eq("published", true);

    if (countError) {
      response.errors.publicProjectsCount = { message: countError.message };
    } else {
      response.publicProjectsCount = publicProjectsCount ?? 0;
    }

    if (slug) {
      const { data: rawProject, error: rawProjectError } = await supabaseClient
        .from("portfolio_projects")
        .select(PROJECT_SELECT_COLUMNS)
        .eq("slug", slug)
        .limit(1)
        .maybeSingle();

      if (rawProjectError) {
        response.errors.rawProjectBySlug = { message: rawProjectError.message };
      } else {
        response.rawProjectBySlug = projectToSlugPreview(rawProject as PortfolioProjectRow | null);
      }

      const { data: publishedProject, error: publishedProjectError } = await supabaseClient
        .from("portfolio_projects")
        .select(PROJECT_SELECT_COLUMNS)
        .eq("slug", slug)
        .eq("published", true)
        .limit(1)
        .maybeSingle();

      if (publishedProjectError) {
        response.errors.publishedProjectBySlug = { message: publishedProjectError.message };
      } else {
        response.publishedProjectBySlug = projectToSlugPreview(
          publishedProject as PortfolioProjectRow | null,
        );
      }

      const imageProjectId = response.publishedProjectBySlug?.id || response.rawProjectBySlug?.id;

      if (imageProjectId) {
        const { data: images, error: imagesError } = await supabaseClient
          .from("portfolio_images")
          .select(IMAGE_SELECT_COLUMNS)
          .eq("project_id", imageProjectId)
          .order("display_order", { ascending: true })
          .order("created_at", { ascending: true });

        if (imagesError) {
          response.errors.images = { message: imagesError.message };
        } else {
          response.images = ((images || []) as PortfolioImageRow[]).map((image) => ({
            image_url: image.image_url,
            display_order: image.display_order,
          }));
        }
      }
    }

    return NextResponse.json(
      {
        ...response,
        error: firstError(response.errors),
      },
      {
        headers: noStoreHeaders,
      },
    );
  } catch (error) {
    return NextResponse.json(
      {
        ...response,
        error: {
          message: error instanceof Error ? error.message : "Unknown Supabase debug error",
        },
      },
      {
        headers: noStoreHeaders,
      },
    );
  }
}

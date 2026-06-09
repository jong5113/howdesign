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

type DebugPortfolioResponse = {
  env: {
    supabaseUrlExists: boolean;
    supabaseAnonKeyExists: boolean;
    supabaseUrlPreview: string | null;
  };
  project: Pick<
    PortfolioProjectRow,
    "title" | "slug" | "cover_image_url" | "published" | "featured"
  > | null;
  images: Array<Pick<PortfolioImageRow, "image_url" | "alt" | "display_order">>;
  error: {
    message: string;
  } | null;
};

export async function GET(request: Request) {
  const url = new URL(request.url);
  const slug = url.searchParams.get("slug")?.trim() || "daedong-eel-yeouido";
  const response: DebugPortfolioResponse = {
    env: {
      supabaseUrlExists,
      supabaseAnonKeyExists,
      supabaseUrlPreview,
    },
    project: null,
    images: [],
    error: null,
  };

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
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  }

  try {
    const { data: project, error: projectError } = await supabaseClient
      .from("portfolio_projects")
      .select(PROJECT_SELECT_COLUMNS)
      .eq("slug", slug)
      .eq("published", true)
      .limit(1)
      .maybeSingle();

    if (projectError) {
      return NextResponse.json(
        {
          ...response,
          error: {
            message: projectError.message,
          },
        },
        {
          headers: {
            "Cache-Control": "no-store",
          },
        },
      );
    }

    if (!project) {
      return NextResponse.json(
        {
          ...response,
          error: {
            message: `No published project found for slug: ${slug}`,
          },
        },
        {
          headers: {
            "Cache-Control": "no-store",
          },
        },
      );
    }

    const projectRow = project as PortfolioProjectRow;
    const { data: images, error: imagesError } = await supabaseClient
      .from("portfolio_images")
      .select(IMAGE_SELECT_COLUMNS)
      .eq("project_id", projectRow.id)
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: true });

    return NextResponse.json(
      {
        ...response,
        project: {
          title: projectRow.title,
          slug: projectRow.slug,
          cover_image_url: projectRow.cover_image_url,
          published: projectRow.published,
          featured: projectRow.featured,
        },
        images: ((images || []) as PortfolioImageRow[]).map((image) => ({
          image_url: image.image_url,
          alt: image.alt,
          display_order: image.display_order,
        })),
        error: imagesError ? { message: imagesError.message } : null,
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
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
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  }
}

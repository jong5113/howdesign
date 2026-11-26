import { unstable_cache } from "next/cache";
import { cache } from "react";

import { hasSupabaseConfig, supabaseClient } from "@/lib/supabase/client";
import {
  getFeaturedSamplePortfolios,
  getPortfolioSampleBySlug,
  getPublishedSamplePortfolios,
  samplePortfolios,
} from "@/lib/sample-portfolio";
import type { PortfolioCategory, PortfolioItem } from "@/lib/types";

export const PROJECT_SELECT_COLUMNS = `
  id,
  title,
  slug,
  category,
  subtitle,
  location,
  area,
  scope,
  duration,
  year,
  description,
  cover_image_url,
  cover_object_position,
  featured,
  published,
  display_order,
  created_at
`;

export const PROJECT_LIST_SELECT_COLUMNS = `
  id,
  title,
  slug,
  category,
  subtitle,
  location,
  area,
  cover_image_url,
  cover_object_position,
  featured,
  published,
  display_order,
  created_at
`;

export const PROJECT_DETAIL_SELECT_COLUMNS = `
  id,
  title,
  slug,
  category,
  subtitle,
  location,
  area,
  scope,
  duration,
  year,
  description,
  cover_image_url,
  cover_object_position,
  featured,
  published,
  display_order,
  created_at
`;

export const IMAGE_SELECT_COLUMNS = `
  id,
  project_id,
  image_url,
  alt,
  display_order,
  created_at
`;

export type PortfolioProjectRow = {
  id: string;
  title: string | null;
  slug: string | null;
  category: PortfolioCategory | null;
  subtitle: string | null;
  location: string | null;
  area: string | null;
  scope?: string | null;
  duration?: string | null;
  year?: string | number | null;
  description?: string | null;
  cover_image_url: string | null;
  cover_object_position?: string | null;
  featured: boolean | null;
  published: boolean | null;
  display_order: number | null;
  created_at: string | null;
};

export type PortfolioImageRow = {
  id: string;
  project_id: string;
  image_url: string | null;
  alt: string | null;
  display_order: number | null;
  created_at: string | null;
};

type GalleryImageRow = Pick<PortfolioImageRow, "image_url">;

type PortfolioDetailRow = PortfolioProjectRow & {
  portfolio_images?: GalleryImageRow[] | null;
};

function isPortfolioCategory(category: unknown): category is PortfolioCategory {
  return category === "residential" || category === "commercial";
}

function normalizeText(value: string | null | undefined) {
  return value?.trim() || "";
}

function normalizeObjectPosition(value: string | null | undefined) {
  const position = normalizeText(value);

  if (!position) {
    return "center center";
  }

  return /^[a-zA-Z0-9.%\s-]+$/.test(position) ? position : "center center";
}

export function normalizeProject(
  project: PortfolioProjectRow,
  images: GalleryImageRow[] = [],
): PortfolioItem | null {
  const title = normalizeText(project.title);
  const slug = normalizeText(project.slug);
  const category = normalizeText(project.category) as PortfolioCategory;
  const fallbackPortfolio = slug ? getPortfolioSampleBySlug(slug) : null;
  const fallbackCoverImage = fallbackPortfolio?.coverImage || samplePortfolios[0]?.coverImage || "";
  const coverImageUrl = normalizeText(project.cover_image_url);

  if (
    !project.id ||
    !title ||
    !slug ||
    !isPortfolioCategory(category)
  ) {
    return null;
  }

  return {
    id: project.id,
    title,
    slug,
    category,
    subtitle: normalizeText(project.subtitle),
    location: normalizeText(project.location),
    area: normalizeText(project.area),
    scope: normalizeText(project.scope),
    duration: normalizeText(project.duration),
    year: project.year ? String(project.year) : "",
    description: normalizeText(project.description),
    coverImage: coverImageUrl || fallbackCoverImage,
    coverImageUrl,
    coverObjectPosition: normalizeObjectPosition(project.cover_object_position),
    gallery: images
      .map((image) => normalizeText(image.image_url))
      .filter(Boolean),
    featured: Boolean(project.featured),
    published: Boolean(project.published),
    order: project.display_order ?? 100,
    createdAt: project.created_at || undefined,
  };
}

const PUBLIC_PORTFOLIO_REVALIDATE_SECONDS = 600;
export const PORTFOLIO_CACHE_TAG = "portfolio-projects";

async function fetchProjectList() {
  if (!hasSupabaseConfig || !supabaseClient) {
    console.error("[Supabase] Portfolio query skipped because Supabase environment variables are missing.");
    return null;
  }

  const client = supabaseClient;
  const queryProjects = (columns: string) =>
    client
      .from("portfolio_projects")
      .select(columns)
      .eq("published", true)
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false })
      .overrideTypes<PortfolioProjectRow[], { merge: false }>();

  try {
    let { data, error } = await queryProjects(PROJECT_LIST_SELECT_COLUMNS);

    if (error && error.message.includes("cover_object_position")) {
      ({ data, error } = await queryProjects(PROJECT_LIST_SELECT_COLUMNS.replace("cover_object_position,", "")));
    }

    if (error) {
      console.error("[Supabase] Failed to fetch portfolio_projects.", error.message);
      return null;
    }

    return (data || [])
      .map((project) => normalizeProject(project))
      .filter((project): project is PortfolioItem => Boolean(project));
  } catch (error) {
    console.error("[Supabase] Unexpected portfolio_projects fetch error.", error);
    return null;
  }
}

async function fetchProjectImages(projectId: string) {
  if (!hasSupabaseConfig || !supabaseClient) {
    return [];
  }

  const { data, error } = await supabaseClient
    .from("portfolio_images")
    .select("image_url")
    .eq("project_id", projectId)
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error || !data) {
    if (error) {
      console.error("[Supabase] Failed to fetch portfolio_images.", error.message);
    }

    return [];
  }

  return data;
}

// The home and category pages share the same ordered, published summaries.
const getCachedProjectList = unstable_cache(
  fetchProjectList,
  ["portfolio-project-list-v3"],
  { revalidate: PUBLIC_PORTFOLIO_REVALIDATE_SECONDS, tags: [PORTFOLIO_CACHE_TAG] },
);

export async function getPublishedPortfolios() {
  const portfolios = await getCachedProjectList();
  return portfolios?.length ? portfolios : getPublishedSamplePortfolios();
}

export async function getFeaturedPortfolios() {
  const portfolios = await getCachedProjectList();
  return portfolios?.length
    ? portfolios.filter((portfolio) => portfolio.featured)
    : getFeaturedSamplePortfolios();
}

export async function getPortfoliosByCategory(category: PortfolioCategory) {
  const portfolios = await getPublishedPortfolios();
  return portfolios.filter((portfolio) => portfolio.category === category);
}

async function getPortfolioBySlugUncached(slug: string) {
  // Next.js route params already contain the decoded slug.
  const normalizedSlug = slug.trim();

  if (hasSupabaseConfig && supabaseClient) {
    const client = supabaseClient;
    const queryProject = (columns: string, includeGallery: boolean) => {
      const query = client
        .from("portfolio_projects")
        .select(includeGallery ? `${columns}, portfolio_images(image_url)` : columns)
        .eq("slug", normalizedSlug)
        .eq("published", true)
        .limit(1);

      if (includeGallery) {
        query
          .order("display_order", { referencedTable: "portfolio_images", ascending: true })
          .order("created_at", { referencedTable: "portfolio_images", ascending: true });
      }

      return query.maybeSingle<PortfolioDetailRow>();
    };

    try {
      let includeGallery = true;
      const loadProject = async () => {
        const result = await queryProject(PROJECT_DETAIL_SELECT_COLUMNS, includeGallery);
        return result.error?.message.includes("cover_object_position")
          ? queryProject(PROJECT_DETAIL_SELECT_COLUMNS.replace("cover_object_position,", ""), includeGallery)
          : result;
      };
      let { data, error } = await loadProject();

      // Older API schemas may not expose the gallery relationship.
      if (error && ["PGRST200", "PGRST201", "42501"].includes(error.code)) {
        includeGallery = false;
        ({ data, error } = await loadProject());
      }

      if (error) {
        console.error("[Supabase] Failed to fetch portfolio project by slug.", error.message);
      }

      if (!error && data) {
        const images = includeGallery ? data.portfolio_images ?? [] : await fetchProjectImages(data.id);
        const portfolio = normalizeProject(data, images);

        if (portfolio) {
          return portfolio;
        }
      }

      const publishedPortfolios = await getCachedProjectList();

      if (publishedPortfolios && publishedPortfolios.length > 0) {
        return undefined;
      }
    } catch (error) {
      console.error("[Supabase] Unexpected portfolio detail fetch error.", error);
      return getPortfolioSampleBySlug(normalizedSlug);
    }
  }

  return getPortfolioSampleBySlug(normalizedSlug);
}

export const getPortfolioBySlug = cache(
  unstable_cache(getPortfolioBySlugUncached, ["portfolio-by-slug-v2"], {
    revalidate: PUBLIC_PORTFOLIO_REVALIDATE_SECONDS,
    tags: [PORTFOLIO_CACHE_TAG],
  }),
);

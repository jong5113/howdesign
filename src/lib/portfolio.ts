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
  scope: string | null;
  duration: string | null;
  year: number | null;
  description: string | null;
  cover_image_url: string | null;
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

function isPortfolioCategory(category: unknown): category is PortfolioCategory {
  return category === "residential" || category === "commercial";
}

function normalizeText(value: string | null | undefined) {
  return value?.trim() || "";
}

export function normalizeProject(
  project: PortfolioProjectRow,
  images: PortfolioImageRow[] = [],
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
    year: project.year || new Date().getFullYear(),
    description: normalizeText(project.description),
    coverImage: coverImageUrl || fallbackCoverImage,
    coverImageUrl,
    gallery: images
      .map((image) => normalizeText(image.image_url))
      .filter(Boolean),
    featured: Boolean(project.featured),
    published: Boolean(project.published),
    order: project.display_order ?? 100,
    createdAt: project.created_at || undefined,
  };
}

async function fetchProjects(options: { featured?: boolean; category?: PortfolioCategory } = {}) {
  if (!hasSupabaseConfig || !supabaseClient) {
    console.error("[Supabase] Portfolio query skipped because Supabase environment variables are missing.");
    return null;
  }

  try {
    let query = supabaseClient
      .from("portfolio_projects")
      .select(PROJECT_SELECT_COLUMNS)
      .eq("published", true)
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (options.featured) {
      query = query.eq("featured", true);
    }

    if (options.category) {
      query = query.eq("category", options.category);
    }

    const { data, error } = await query;

    if (error) {
      console.error("[Supabase] Failed to fetch portfolio_projects.", error.message);
      return null;
    }

    return (data || [])
      .map((project) => normalizeProject(project as PortfolioProjectRow))
      .filter((project): project is PortfolioItem => Boolean(project));
  } catch (error) {
    console.error("[Supabase] Unexpected portfolio_projects fetch error.", error);
    return null;
  }
}

export async function fetchProjectImages(projectId: string) {
  if (!hasSupabaseConfig || !supabaseClient) {
    return [];
  }

  const { data, error } = await supabaseClient
    .from("portfolio_images")
    .select(IMAGE_SELECT_COLUMNS)
    .eq("project_id", projectId)
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error || !data) {
    if (error) {
      console.error("[Supabase] Failed to fetch portfolio_images.", error.message);
    }

    return [];
  }

  return data as PortfolioImageRow[];
}

export async function getPublishedPortfolios() {
  const portfolios = await fetchProjects();

  if (portfolios === null || portfolios.length === 0) {
    return getPublishedSamplePortfolios();
  }

  return portfolios;
}

export async function getFeaturedPortfolios() {
  const portfolios = await fetchProjects({ featured: true });

  if (portfolios === null) {
    return getFeaturedSamplePortfolios();
  }

  if (portfolios.length > 0) {
    return portfolios;
  }

  const publishedPortfolios = await fetchProjects();

  if (publishedPortfolios === null || publishedPortfolios.length === 0) {
    return getFeaturedSamplePortfolios();
  }

  return [];
}

export async function getPortfoliosByCategory(category: PortfolioCategory) {
  const portfolios = await fetchProjects({ category });

  if (portfolios === null) {
    return getPublishedSamplePortfolios().filter((portfolio) => portfolio.category === category);
  }

  if (portfolios.length > 0) {
    return portfolios;
  }

  const publishedPortfolios = await fetchProjects();

  if (publishedPortfolios === null || publishedPortfolios.length === 0) {
    return getPublishedSamplePortfolios().filter((portfolio) => portfolio.category === category);
  }

  return [];
}

export async function getPortfolioBySlug(slug: string) {
  const normalizedSlug = decodeURIComponent(slug).trim();

  if (hasSupabaseConfig && supabaseClient) {
    try {
      const { data, error } = await supabaseClient
        .from("portfolio_projects")
        .select(PROJECT_SELECT_COLUMNS)
        .eq("slug", normalizedSlug)
        .eq("published", true)
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error("[Supabase] Failed to fetch portfolio project by slug.", error.message);
      }

      if (!error && data) {
        const images = await fetchProjectImages((data as PortfolioProjectRow).id);
        const portfolio = normalizeProject(data as PortfolioProjectRow, images);

        if (portfolio) {
          return portfolio;
        }
      }

      const publishedPortfolios = await fetchProjects();

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

export type PortfolioCategory = "residential" | "commercial";

export type PortfolioItem = {
  id: string;
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
  coverImage: string;
  coverImageUrl?: string;
  gallery: string[];
  featured: boolean;
  published: boolean;
  order: number;
  createdAt?: string;
};

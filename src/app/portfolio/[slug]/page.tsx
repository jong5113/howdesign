import Link from "next/link";
import { notFound } from "next/navigation";

import { ProjectGallerySlider } from "@/components/project-gallery-slider";
import { getPortfolioBySlug } from "@/lib/portfolio";
import { categoryEnglishLabels } from "@/lib/sample-portfolio";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type PortfolioDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: PortfolioDetailPageProps) {
  const { slug } = await params;
  const portfolio = await getPortfolioBySlug(slug);

  return {
    title: portfolio?.title || "Portfolio Detail",
  };
}

export default async function PortfolioDetailPage({ params }: PortfolioDetailPageProps) {
  const { slug } = await params;
  const portfolio = await getPortfolioBySlug(slug);

  if (!portfolio) {
    notFound();
  }

  const coverImage = portfolio.coverImageUrl || portfolio.coverImage;
  const galleryImages = [coverImage, ...portfolio.gallery]
    .filter(Boolean)
    .filter((image, index, images) => images.indexOf(image) === index)
    .map((image, index) => ({
      src: image,
      alt: `${portfolio.title} 이미지 ${index + 1}`,
    }));
  const detailMeta = [
    categoryEnglishLabels[portfolio.category],
    portfolio.location,
    portfolio.area,
    portfolio.scope,
    portfolio.duration,
    String(portfolio.year),
  ].filter(Boolean);

  return (
    <div className="px-5 pb-16 pt-36 sm:px-10 sm:pt-44 lg:px-12">
      <article className="mx-auto max-w-[1320px]">
        <div className="mb-8 flex items-center justify-between text-[13px] uppercase tracking-[0.09em] text-muted">
          <Link href="/portfolio" className="underline-offset-4 hover:underline">
            Back to Portfolio
          </Link>
          <Link href="/contact" className="underline-offset-4 hover:underline">
            Contact
          </Link>
        </div>

        <header className="mb-5 max-w-5xl">
          <h1 className="text-[21px] font-normal leading-8 sm:text-[24px]">{portfolio.title}</h1>
          {portfolio.subtitle ? <p className="mt-1 text-[12px] text-muted">{portfolio.subtitle}</p> : null}
          <p className="mt-3 text-[14px] uppercase leading-6 tracking-[0.09em] text-muted">
            {detailMeta.join(" / ")}
          </p>
        </header>

        <ProjectGallerySlider images={galleryImages} />

        {portfolio.description ? (
          <p className="max-w-2xl py-8 text-[13px] leading-6 text-muted sm:py-10">{portfolio.description}</p>
        ) : null}

        <div className="mt-10 flex gap-6 text-[13px] uppercase tracking-[0.09em] text-muted">
          <Link href="/portfolio" className="underline-offset-4 hover:underline">
            Back to Portfolio
          </Link>
          <Link href="/contact" className="underline-offset-4 hover:underline">
            Contact
          </Link>
        </div>
      </article>
    </div>
  );
}

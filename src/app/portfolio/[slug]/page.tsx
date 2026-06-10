import Link from "next/link";
import { notFound } from "next/navigation";

import { ProjectLightboxGallery } from "@/components/project-lightbox-gallery";
import { getPortfolioBySlug } from "@/lib/portfolio";
import { getDetailInfoRows } from "@/lib/portfolio-display";

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
  const detailRows = getDetailInfoRows(portfolio);
  const galleryImages = [coverImage, ...portfolio.gallery]
    .filter(Boolean)
    .filter((image, index, images) => images.indexOf(image) === index);

  return (
    <div className="px-5 pb-16 pt-44 sm:px-6 sm:pt-52 lg:px-6 lg:pt-56">
      <article className="mx-auto grid max-w-[1760px] gap-10 lg:grid-cols-[280px_1fr] lg:gap-12 xl:grid-cols-[320px_1fr]">
        <aside className="grid content-start gap-12 text-[12px] leading-6 text-muted lg:sticky lg:top-44 lg:self-start">
          <nav className="grid gap-1.5 text-[11px] uppercase tracking-[0.1em]" aria-label="상세 페이지 메뉴">
            <Link href="/portfolio" className="w-fit text-foreground underline-offset-4 hover:underline">
              All
            </Link>
            <Link href="/portfolio/residential" className="w-fit underline-offset-4 hover:underline">
              Residential
            </Link>
            <Link href="/portfolio/commercial" className="w-fit underline-offset-4 hover:underline">
              Commercial
            </Link>
            <Link href="/contact" className="w-fit underline-offset-4 hover:underline">
              Contact
            </Link>
          </nav>

          <section className="grid gap-5">
            {detailRows.map((row) => (
              <div key={row.label} className="grid gap-1.5">
                <p className="text-[10px] uppercase tracking-[0.1em] text-muted">{row.label}</p>
                <p className="text-[12px] leading-6 text-foreground">{row.value}</p>
              </div>
            ))}
          </section>

        </aside>

        <ProjectLightboxGallery
          images={galleryImages.map((image, index) => ({
            src: image,
            alt: `${portfolio.title} 이미지 ${index + 1}`,
          }))}
          className="columns-1 gap-1.5 sm:columns-2 lg:columns-3"
        />
      </article>
    </div>
  );
}

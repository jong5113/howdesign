import Link from "next/link";
import { notFound } from "next/navigation";

import { ProjectLightboxGallery } from "@/components/project-lightbox-gallery";
import { getPortfolioBySlug } from "@/lib/portfolio";
import { getDetailInfoRows } from "@/lib/portfolio-display";

export const revalidate = 600;

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
    <div className="px-5 pb-20 pt-10 sm:px-6 sm:pt-12 lg:px-8 lg:pt-14">
      <article className="mx-auto grid max-w-[1760px] gap-11 lg:grid-cols-[300px_1fr] lg:gap-14 xl:grid-cols-[340px_1fr]">
        <aside className="grid content-start gap-12 text-[12px] leading-6 text-muted lg:sticky lg:top-10 lg:self-start">
          <nav className="grid gap-2 text-[11px] uppercase tracking-[0.14em]" aria-label="Project navigation">
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

          <section className="grid gap-6 border-t border-line pt-8">
            {detailRows.map((row) => (
              <div key={row.label} className="grid gap-2">
                <p className="text-[10px] uppercase tracking-[0.16em] text-muted">{row.label}</p>
                <p className="text-[13px] leading-7 text-foreground">{row.value}</p>
              </div>
            ))}
          </section>

        </aside>

        <ProjectLightboxGallery
          images={galleryImages.map((image, index) => ({
            src: image,
            alt: `${portfolio.title} image ${index + 1}`,
          }))}
          className="columns-1 gap-2 sm:columns-2 lg:columns-3"
        />
      </article>
    </div>
  );
}

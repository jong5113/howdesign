import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

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
  const detailMeta = [
    categoryEnglishLabels[portfolio.category],
    portfolio.location,
    portfolio.area,
    portfolio.scope,
    portfolio.duration,
    String(portfolio.year),
  ].filter(Boolean);

  return (
    <div className="px-5 pb-16 pt-24 sm:px-10 lg:px-12">
      <article className="mx-auto max-w-[1760px]">
        <div className="mb-8 flex items-center justify-between text-[11px] uppercase tracking-[0.09em] text-muted">
          <Link href="/portfolio" className="underline-offset-4 hover:underline">
            Back to Portfolio
          </Link>
          <Link href="/contact" className="underline-offset-4 hover:underline">
            Contact
          </Link>
        </div>

        <header className="mb-5 max-w-5xl">
          <h1 className="text-[16px] font-normal leading-6 sm:text-[18px]">{portfolio.title}</h1>
          {portfolio.subtitle ? <p className="mt-1 text-[11px] text-muted">{portfolio.subtitle}</p> : null}
          <p className="mt-3 text-[11px] uppercase leading-5 tracking-[0.09em] text-muted">
            {detailMeta.join(" / ")}
          </p>
        </header>

        <figure className="relative aspect-[4/3] overflow-hidden sm:aspect-[16/9]">
          <Image
            src={coverImage}
            alt={portfolio.title}
            fill
            priority
            unoptimized
            sizes="100vw"
            className="object-cover"
          />
        </figure>

        {portfolio.description ? (
          <p className="max-w-2xl py-8 text-[12px] leading-6 text-muted sm:py-10">{portfolio.description}</p>
        ) : null}

        <div className="grid gap-7 sm:gap-10">
          {portfolio.gallery.map((image, index) => (
            <figure
              key={`${portfolio.slug}-${index}`}
              className="relative aspect-[4/3] overflow-hidden sm:aspect-[16/9]"
            >
              <Image
                src={image}
                alt={`${portfolio.title} 이미지 ${index + 1}`}
                fill
                unoptimized
                sizes="100vw"
                className="object-cover"
              />
            </figure>
          ))}
        </div>

        <div className="mt-10 flex gap-6 text-[11px] uppercase tracking-[0.09em] text-muted">
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

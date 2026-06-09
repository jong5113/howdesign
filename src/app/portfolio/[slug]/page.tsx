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

  return (
    <div className="px-4 pb-14 pt-14 sm:px-6 lg:px-8">
      <article className="mx-auto max-w-[1760px]">
        <div className="mb-4 flex items-center justify-between text-[10px] uppercase tracking-wide text-muted">
          <Link href="/portfolio" className="underline-offset-4 hover:underline">
            Portfolio
          </Link>
          <Link href="/contact" className="underline-offset-4 hover:underline">
            Contact
          </Link>
        </div>

        <header className="mb-5 grid gap-5 border-b border-line pb-4 lg:grid-cols-[1fr_1.5fr]">
          <div>
            <p className="mb-1 text-[10px] uppercase tracking-wide text-muted">
              {categoryEnglishLabels[portfolio.category]}
            </p>
            <h1 className="text-sm font-normal leading-6">{portfolio.title}</h1>
            {portfolio.subtitle ? <p className="mt-1 text-[11px] text-muted">{portfolio.subtitle}</p> : null}
          </div>

          <div className="grid gap-x-8 gap-y-2 text-[10px] leading-5 sm:grid-cols-5">
            <p>
              <span className="block text-muted">Location</span>
              {portfolio.location}
            </p>
            <p>
              <span className="block text-muted">Area</span>
              {portfolio.area}
            </p>
            <p>
              <span className="block text-muted">Scope</span>
              {portfolio.scope}
            </p>
            <p>
              <span className="block text-muted">Duration</span>
              {portfolio.duration}
            </p>
            <p>
              <span className="block text-muted">Year</span>
              {portfolio.year}
            </p>
          </div>
        </header>

        <figure className="relative aspect-[4/5] overflow-hidden sm:aspect-[16/9]">
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
          <p className="max-w-2xl py-7 text-[11px] leading-6 text-muted">{portfolio.description}</p>
        ) : null}

        <div className="grid gap-7 sm:gap-9">
          {portfolio.gallery.map((image, index) => (
            <figure
              key={`${portfolio.slug}-${index}`}
              className="relative aspect-[4/5] overflow-hidden sm:aspect-[16/10]"
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

        <Link href="/contact" className="mt-10 inline-block text-[10px] uppercase tracking-wide underline-offset-4 hover:underline">
          Contact
        </Link>
      </article>
    </div>
  );
}

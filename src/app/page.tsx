import Link from "next/link";

import { PortfolioGrid } from "@/components/portfolio-grid";
import { getFeaturedPortfolios } from "@/lib/portfolio";

export const revalidate = 600;

export default async function HomePage() {
  const featuredPortfolios = await getFeaturedPortfolios();

  return (
    <div className="px-5 pb-16 pt-8 sm:px-10 sm:pt-12 lg:px-12">
      <div className="mx-auto max-w-[1440px]">
        <div className="mb-6 flex items-center justify-between text-[11px] uppercase tracking-[0.09em] text-muted">
          <p>Works</p>
          <Link href="/portfolio" className="text-foreground underline-offset-4 hover:underline">
            Portfolio
          </Link>
        </div>
        <PortfolioGrid items={featuredPortfolios} />
      </div>
    </div>
  );
}

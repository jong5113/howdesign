import Link from "next/link";

import { PortfolioGrid } from "@/components/portfolio-grid";
import { getFeaturedPortfolios } from "@/lib/portfolio";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  const featuredPortfolios = await getFeaturedPortfolios();

  return (
    <div className="px-4 pb-14 pt-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1760px]">
        <div className="mb-4 flex items-center justify-between text-[10px] uppercase tracking-wide text-muted">
          <p>Works Archive</p>
          <Link href="/portfolio" className="text-foreground underline-offset-4 hover:underline">
            View All
          </Link>
        </div>
        <PortfolioGrid items={featuredPortfolios} />
      </div>
    </div>
  );
}

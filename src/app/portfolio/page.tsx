import { PageIntro } from "@/components/page-intro";
import { PortfolioFilter } from "@/components/portfolio-filter";
import { PortfolioGrid } from "@/components/portfolio-grid";
import { getPublishedPortfolios } from "@/lib/portfolio";

export const metadata = {
  title: "Portfolio",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function PortfolioPage() {
  const portfolios = await getPublishedPortfolios();

  return (
    <div className="px-4 pb-14 pt-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1760px]">
        <PageIntro eyebrow="Works" title="Portfolio" />
        <PortfolioFilter active="all" />
        <PortfolioGrid items={portfolios} />
      </div>
    </div>
  );
}

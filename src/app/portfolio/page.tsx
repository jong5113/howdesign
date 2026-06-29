import { PortfolioFilter } from "@/components/portfolio-filter";
import { PortfolioGrid } from "@/components/portfolio-grid";
import { getPublishedPortfolios } from "@/lib/portfolio";

export const metadata = {
  title: "Portfolio",
};

export const revalidate = 600;

export default async function PortfolioPage() {
  const portfolios = await getPublishedPortfolios();

  return (
    <div className="px-5 pb-16 pt-8 sm:px-10 sm:pt-12 lg:px-12">
      <div className="mx-auto max-w-[1440px]">
        <PortfolioFilter active="all" />
        <PortfolioGrid items={portfolios} />
      </div>
    </div>
  );
}

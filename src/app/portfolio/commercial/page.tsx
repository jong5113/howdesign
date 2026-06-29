import { PortfolioFilter } from "@/components/portfolio-filter";
import { PortfolioGrid } from "@/components/portfolio-grid";
import { getPortfoliosByCategory } from "@/lib/portfolio";

export const metadata = {
  title: "Commercial Portfolio",
};

export const revalidate = 600;

export default async function CommercialPortfolioPage() {
  const portfolios = await getPortfoliosByCategory("commercial");

  return (
    <div className="px-5 pb-16 pt-8 sm:px-10 sm:pt-12 lg:px-12">
      <div className="mx-auto max-w-[1440px]">
        <PortfolioFilter active="commercial" />
        <PortfolioGrid items={portfolios} />
      </div>
    </div>
  );
}

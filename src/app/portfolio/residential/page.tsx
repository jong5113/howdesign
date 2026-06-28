import { PageIntro } from "@/components/page-intro";
import { PortfolioFilter } from "@/components/portfolio-filter";
import { PortfolioGrid } from "@/components/portfolio-grid";
import { getPortfoliosByCategory } from "@/lib/portfolio";

export const metadata = {
  title: "Residential Portfolio",
};

export const revalidate = 600;

export default async function ResidentialPortfolioPage() {
  const portfolios = await getPortfoliosByCategory("residential");

  return (
    <div className="px-5 pb-16 pt-8 sm:px-10 sm:pt-12 lg:px-12">
      <div className="mx-auto max-w-[1440px]">
        <PageIntro eyebrow="Works" title="Residential" />
        <PortfolioFilter active="residential" />
        <PortfolioGrid items={portfolios} />
      </div>
    </div>
  );
}

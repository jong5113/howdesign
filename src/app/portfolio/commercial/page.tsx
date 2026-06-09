import { PageIntro } from "@/components/page-intro";
import { PortfolioFilter } from "@/components/portfolio-filter";
import { PortfolioGrid } from "@/components/portfolio-grid";
import { getPortfoliosByCategory } from "@/lib/portfolio";

export const metadata = {
  title: "Commercial Portfolio",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CommercialPortfolioPage() {
  const portfolios = await getPortfoliosByCategory("commercial");

  return (
    <div className="px-4 pb-14 pt-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1760px]">
        <PageIntro eyebrow="Works" title="Commercial" />
        <PortfolioFilter active="commercial" />
        <PortfolioGrid items={portfolios} />
      </div>
    </div>
  );
}

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
    <div className="px-5 pb-16 pt-24 sm:px-10 lg:px-12">
      <div className="mx-auto max-w-[1760px]">
        <PageIntro eyebrow="Works" title="Commercial" />
        <PortfolioFilter active="commercial" />
        <PortfolioGrid items={portfolios} />
      </div>
    </div>
  );
}

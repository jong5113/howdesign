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
    <div className="public-shell portfolio-page">
      <div className="site-container">
        <PortfolioFilter
          active="residential"
          description="생활의 흐름과 취향을 세심하게 반영한 주거 프로젝트입니다."
        />
        <PortfolioGrid items={portfolios} />
      </div>
    </div>
  );
}

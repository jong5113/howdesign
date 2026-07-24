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
    <div className="public-shell portfolio-page">
      <div className="site-container">
        <PortfolioFilter
          active="all"
          description="주거와 상업 공간의 조건을 해석해 완성한 HOW DESIGN의 프로젝트입니다."
        />
        <PortfolioGrid items={portfolios} />
      </div>
    </div>
  );
}

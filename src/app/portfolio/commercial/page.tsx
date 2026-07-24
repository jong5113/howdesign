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
    <div className="public-shell portfolio-page">
      <div className="site-container">
        <PortfolioFilter
          active="commercial"
          description="브랜드의 경험과 운영 방식을 공간으로 구체화한 상업 프로젝트입니다."
        />
        <PortfolioGrid items={portfolios} />
      </div>
    </div>
  );
}

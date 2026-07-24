import { PortfolioCard } from "@/components/portfolio-card";
import type { PortfolioItem } from "@/lib/types";

type PortfolioGridProps = {
  items: PortfolioItem[];
  startIndex?: number;
};

export function PortfolioGrid({ items, startIndex = 0 }: PortfolioGridProps) {
  if (items.length === 0) {
    return <p className="portfolio-grid__empty">표시할 포트폴리오가 없습니다.</p>;
  }

  return (
    <div className="portfolio-grid">
      {items.map((item, index) => (
        <PortfolioCard key={item.slug} item={item} priority={index < 3} index={index + startIndex} />
      ))}
    </div>
  );
}

import { PortfolioCard } from "@/components/portfolio-card";
import type { PortfolioItem } from "@/lib/types";

type PortfolioGridProps = {
  items: PortfolioItem[];
};

export function PortfolioGrid({ items }: PortfolioGridProps) {
  if (items.length === 0) {
    return <p className="py-20 text-center text-xs text-muted">표시할 포트폴리오가 없습니다.</p>;
  }

  return (
    <div className="grid gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, index) => (
        <PortfolioCard key={item.slug} item={item} priority={index < 4} />
      ))}
    </div>
  );
}

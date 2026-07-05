import { PortfolioCard } from "@/components/portfolio-card";
import type { PortfolioItem } from "@/lib/types";

type PortfolioGridProps = {
  items: PortfolioItem[];
};

export function PortfolioGrid({ items }: PortfolioGridProps) {
  if (items.length === 0) {
    return <p className="py-24 text-center text-[12px] leading-6 text-muted">표시할 포트폴리오가 없습니다.</p>;
  }

  return (
    <div className="grid gap-x-5 gap-y-10 sm:grid-cols-2 sm:gap-y-11 lg:grid-cols-3 lg:gap-x-6 lg:gap-y-12">
      {items.map((item, index) => (
        <PortfolioCard key={item.slug} item={item} priority={index < 4} />
      ))}
    </div>
  );
}

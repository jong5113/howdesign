import Link from "next/link";

import type { PortfolioCategory } from "@/lib/types";

type PortfolioFilterValue = "all" | PortfolioCategory;

type PortfolioFilterProps = {
  active: PortfolioFilterValue;
};

const filters: Array<{ href: string; label: string; value: PortfolioFilterValue }> = [
  { href: "/portfolio", label: "All", value: "all" },
  { href: "/portfolio/residential", label: "Residential", value: "residential" },
  { href: "/portfolio/commercial", label: "Commercial", value: "commercial" },
];

export function PortfolioFilter({ active }: PortfolioFilterProps) {
  return (
    <nav className="mb-5 flex flex-wrap gap-5 text-[10px] uppercase tracking-wide" aria-label="포트폴리오 필터">
      {filters.map((filter) => (
        <Link
          key={filter.value}
          href={filter.href}
          className={filter.value === active ? "text-foreground" : "text-muted"}
        >
          {filter.label}
        </Link>
      ))}
    </nav>
  );
}

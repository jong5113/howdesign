import Link from "next/link";

type PortfolioFilterProps = {
  activeCategory?: "all" | "residential" | "commercial";
  active?: "all" | "residential" | "commercial";
  showFilters?: boolean;
  title?: string;
  className?: string;
};

const filters = [
  {
    label: "ALL",
    href: "/portfolio",
    value: "all",
  },
  {
    label: "RESIDENTIAL",
    href: "/portfolio/residential",
    value: "residential",
  },
  {
    label: "COMMERCIAL",
    href: "/portfolio/commercial",
    value: "commercial",
  },
] as const;

export function PortfolioFilter({
  activeCategory,
  active,
  showFilters,
  title = "WORK",
  className = "",
}: PortfolioFilterProps) {
  const current = active || activeCategory || "all";
  const shouldShowFilters = showFilters ?? Boolean(active || activeCategory);

  return (
    <div className={`grid gap-3 text-[12px] uppercase tracking-[0.09em] ${className}`}>
      <p className="text-foreground">{title}</p>
      {shouldShowFilters ? (
        <nav className="flex flex-wrap gap-4 text-muted" aria-label="Work categories">
          {filters.map((filter) => (
            <Link
              key={filter.href}
              href={filter.href}
              className={filter.value === current ? "text-foreground" : "underline-offset-4 hover:underline"}
            >
              {filter.label}
            </Link>
          ))}
        </nav>
      ) : null}
    </div>
  );
}

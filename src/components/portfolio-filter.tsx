type PortfolioFilterProps = {
  activeCategory?: "all" | "residential" | "commercial";
  active?: "all" | "residential" | "commercial";
  showFilters?: boolean;
  title?: string;
  description?: string;
  className?: string;
};

export function PortfolioFilter({
  title = "WORK",
  description = "완성된 주거 및 상업 공간을 한눈에 살펴보세요.",
  className = "",
}: PortfolioFilterProps) {
  return (
    <header className={`portfolio-heading ${className}`}>
      <div>
        <p className="architecture-label">Selected portfolio</p>
        <h1>{title}</h1>
      </div>
      <p>{description}</p>
    </header>
  );
}

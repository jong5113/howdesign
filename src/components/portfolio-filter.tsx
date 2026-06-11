type PortfolioFilterProps = {
  activeCategory?: "all" | "residential" | "commercial";
  active?: "all" | "residential" | "commercial";
  showFilters?: boolean;
  title?: string;
  className?: string;
};

export function PortfolioFilter({
  title = "WORK",
  className = "",
}: PortfolioFilterProps) {
  return (
    <div className={`mb-8 grid sm:mb-10 lg:mb-12 ${className}`}>
      <h1 className="text-[34px] font-normal uppercase tracking-[0.08em] text-foreground sm:text-[46px] lg:text-[56px]">
        {title}
      </h1>
    </div>
  );
}

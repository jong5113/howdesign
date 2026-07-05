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
    <div className={`mb-9 grid sm:mb-11 lg:mb-12 ${className}`}>
      <h1 className="text-[32px] font-normal uppercase leading-none tracking-[0.08em] text-foreground sm:text-[44px] lg:text-[54px]">
        {title}
      </h1>
    </div>
  );
}

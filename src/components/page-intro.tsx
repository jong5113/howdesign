type PageIntroProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  className?: string;
};

function normalizePortfolioLabel(value = "") {
  return value.toUpperCase() === "PORTFOLIO" ? "WORK" : value;
}

export function PageIntro({ eyebrow, title, description, className = "" }: PageIntroProps) {
  return (
    <header className={`grid gap-3 ${className}`}>
      {eyebrow ? (
        <p className="text-[11px] uppercase tracking-[0.09em] text-muted">{normalizePortfolioLabel(eyebrow)}</p>
      ) : null}
      {title ? <h1 className="text-[18px] font-normal">{normalizePortfolioLabel(title)}</h1> : null}
      {description ? <p className="max-w-2xl text-[13px] leading-6 text-muted">{description}</p> : null}
    </header>
  );
}

type PageIntroProps = {
  eyebrow?: string;
  title: string;
};

export function PageIntro({ eyebrow, title }: PageIntroProps) {
  return (
    <header className="mb-4 flex items-end justify-between border-b border-line pb-3">
      <div>
        {eyebrow ? <p className="mb-1 text-[10px] uppercase text-muted">{eyebrow}</p> : null}
        <h1 className="text-xs font-normal uppercase tracking-wide">{title}</h1>
      </div>
    </header>
  );
}

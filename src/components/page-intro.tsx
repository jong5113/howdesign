type PageIntroProps = {
  eyebrow?: string;
  title: string;
};

export function PageIntro({ eyebrow, title }: PageIntroProps) {
  return (
    <header className="mb-3 flex items-end justify-between">
      <div>
        {eyebrow ? <p className="mb-1 text-[10px] uppercase text-muted">{eyebrow}</p> : null}
        <h1 className="text-[12px] font-normal uppercase tracking-[0.09em]">{title}</h1>
      </div>
    </header>
  );
}

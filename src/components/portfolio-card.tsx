import Image from "next/image";
import Link from "next/link";

import { categoryEnglishLabels } from "@/lib/sample-portfolio";
import type { PortfolioItem } from "@/lib/types";

type PortfolioCardProps = {
  item: PortfolioItem;
  priority?: boolean;
};

export function PortfolioCard({ item, priority = false }: PortfolioCardProps) {
  const coverImage = item.coverImageUrl || item.coverImage;

  return (
    <Link href={`/portfolio/${item.slug}`} className="block">
      <figure className="relative aspect-[3/2] overflow-hidden">
        <Image
          src={coverImage}
          alt={item.title}
          fill
          priority={priority}
          unoptimized
          sizes="(min-width: 1280px) 22vw, (min-width: 1024px) 30vw, (min-width: 640px) 46vw, 100vw"
          className="object-cover"
        />
      </figure>
      <div className="mt-2.5 grid gap-1 leading-none">
        <h2 className="text-[14px] font-normal text-foreground">{item.title}</h2>
        <p className="text-[12px] text-muted">
          {categoryEnglishLabels[item.category]} / {item.location} / {item.year}
        </p>
      </div>
    </Link>
  );
}

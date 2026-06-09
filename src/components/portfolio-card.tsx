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
      <figure className="relative aspect-[4/5] overflow-hidden">
        <Image
          src={coverImage}
          alt={item.title}
          fill
          priority={priority}
          unoptimized
          sizes="(min-width: 1536px) 24vw, (min-width: 1024px) 32vw, (min-width: 640px) 48vw, 100vw"
          className="object-cover"
        />
      </figure>
      <div className="mt-2 grid gap-0.5 text-[10px] leading-4">
        <h2 className="font-normal">{item.title}</h2>
        <p className="text-muted">
          {categoryEnglishLabels[item.category]} / {item.location} / {item.year}
        </p>
      </div>
    </Link>
  );
}

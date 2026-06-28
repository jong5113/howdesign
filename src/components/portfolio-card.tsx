import Image from "next/image";
import Link from "next/link";

import { getAreaLine, getProjectTitleLine, getSiteLine } from "@/lib/portfolio-display";
import { getOptimizedImageUrl } from "@/lib/image-utils";
import type { PortfolioItem } from "@/lib/types";

type PortfolioCardProps = {
  item: PortfolioItem;
  priority?: boolean;
};

export function PortfolioCard({ item, priority = false }: PortfolioCardProps) {
  const coverImage = getOptimizedImageUrl(item.coverImageUrl || item.coverImage, {
    width: 900,
    quality: 78,
    resize: "cover",
  });
  const siteLine = getSiteLine(item);
  const areaLine = getAreaLine(item);

  return (
    <Link href={`/portfolio/${item.slug}`} className="block">
      <figure className="relative aspect-[3/2] overflow-hidden">
        <Image
          src={coverImage}
          alt={item.title}
          fill
          priority={priority}
          sizes="(min-width: 1280px) 22vw, (min-width: 1024px) 30vw, (min-width: 640px) 46vw, 100vw"
          className="object-cover"
        />
      </figure>
      <div className="mt-3 grid gap-1.5 leading-tight">
        <h2 className="text-[13px] font-normal uppercase tracking-[0.02em] text-foreground">
          {getProjectTitleLine(item)}
        </h2>
        {siteLine ? <p className="text-[12px] text-muted">{siteLine}</p> : null}
        {areaLine ? <p className="text-[12px] text-muted">{areaLine}</p> : null}
      </div>
    </Link>
  );
}

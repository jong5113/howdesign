import Link from "next/link";

import { PortfolioMedia } from "@/components/portfolio-media";
import { getAreaLine, getProjectTitleLine, getSiteLine } from "@/lib/portfolio-display";
import type { PortfolioItem } from "@/lib/types";

type PortfolioCardProps = {
  item: PortfolioItem;
  priority?: boolean;
  index?: number;
};

export function PortfolioCard({ item, priority = false, index = 0 }: PortfolioCardProps) {
  const originalCoverImage = item.coverImageUrl || item.coverImage;
  const siteLine = getSiteLine(item);
  const areaLine = getAreaLine(item);
  const coverObjectPosition = item.coverObjectPosition || "center center";

  return (
    <Link href={`/portfolio/${item.slug}`} className="portfolio-card group">
      <div className="portfolio-card__index">
        <span>{String(index + 1).padStart(2, "0")}</span>
        <span>{item.category}</span>
      </div>
      <PortfolioMedia
        src={originalCoverImage}
        alt={getProjectTitleLine(item)}
        objectPosition={coverObjectPosition}
        priority={priority}
        sizes="(max-width: 639px) calc(100vw - 40px), (max-width: 767px) calc(100vw - 64px), (max-width: 1023px) calc(50vw - 44px), (max-width: 1759px) calc(33.33vw - 48px), 539px"
        className="portfolio-card__media"
        imageClassName="transition-transform duration-500 ease-out group-hover:scale-[1.015]"
      />
      <div className="portfolio-card__content">
        <h2 className="portfolio-card__title">
          {getProjectTitleLine(item)}
        </h2>
        <div className="portfolio-card__facts">
          {siteLine ? <p>{siteLine}</p> : null}
          {areaLine ? <p>{areaLine}</p> : null}
        </div>
      </div>
    </Link>
  );
}

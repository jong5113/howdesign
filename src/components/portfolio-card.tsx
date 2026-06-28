"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import { getAreaLine, getProjectTitleLine, getSiteLine } from "@/lib/portfolio-display";
import { getOptimizedImageUrl } from "@/lib/image-utils";
import type { PortfolioItem } from "@/lib/types";

type PortfolioCardProps = {
  item: PortfolioItem;
  priority?: boolean;
};

export function PortfolioCard({ item, priority = false }: PortfolioCardProps) {
  const originalCoverImage = item.coverImageUrl || item.coverImage;
  const optimizedCoverImage = useMemo(
    () =>
      getOptimizedImageUrl(originalCoverImage, {
        width: 1200,
        quality: 82,
        resize: "cover",
      }),
    [originalCoverImage],
  );
  const [imageSrc, setImageSrc] = useState(optimizedCoverImage);
  const [showImage, setShowImage] = useState(Boolean(optimizedCoverImage));
  const siteLine = getSiteLine(item);
  const areaLine = getAreaLine(item);

  return (
    <Link href={`/portfolio/${item.slug}`} className="block">
      <figure className="relative aspect-[4/3] w-full overflow-hidden bg-[#f5f5f5]">
        {showImage ? (
          <Image
            src={imageSrc}
            alt=""
            fill
            priority={priority}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover object-center"
            onError={() => {
              if (imageSrc !== originalCoverImage && originalCoverImage) {
                setImageSrc(originalCoverImage);
                return;
              }

              setShowImage(false);
            }}
          />
        ) : null}
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

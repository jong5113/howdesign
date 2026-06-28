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

function getVerticalFocus(position: string) {
  const normalizedPosition = position.trim().toLowerCase();
  const parts = normalizedPosition.split(/\s+/);
  const verticalValue = parts[1] || parts[0] || "center";

  if (verticalValue === "top") {
    return "0%";
  }

  if (verticalValue === "bottom") {
    return "100%";
  }

  if (/^\d+(\.\d+)?%$/.test(verticalValue)) {
    return verticalValue;
  }

  return "50%";
}

export function PortfolioCard({ item, priority = false }: PortfolioCardProps) {
  const originalCoverImage = item.coverImageUrl || item.coverImage;
  const optimizedCoverImage = useMemo(
    () =>
      getOptimizedImageUrl(originalCoverImage, {
        width: 1200,
        quality: 82,
        resize: "contain",
      }),
    [originalCoverImage],
  );
  const [imageSrc, setImageSrc] = useState(optimizedCoverImage);
  const [showImage, setShowImage] = useState(Boolean(optimizedCoverImage));
  const siteLine = getSiteLine(item);
  const areaLine = getAreaLine(item);
  const coverObjectPosition = item.coverObjectPosition || "center center";
  const verticalFocus = getVerticalFocus(coverObjectPosition);

  return (
    <Link href={`/portfolio/${item.slug}`} className="block">
      <figure className="relative aspect-[3/2] w-full overflow-hidden bg-[#f5f5f5]">
        {showImage ? (
          <Image
            src={imageSrc}
            alt=""
            width={1200}
            height={900}
            priority={priority}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="absolute left-0 h-auto w-full max-w-none"
            style={{
              top: verticalFocus,
              transform: `translateY(-${verticalFocus})`,
            }}
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

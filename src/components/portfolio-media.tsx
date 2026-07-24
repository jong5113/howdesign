"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

import { getOptimizedImageUrl } from "@/lib/image-utils";

type PortfolioMediaProps = {
  src?: string | null;
  alt?: string;
  objectPosition?: string;
  priority?: boolean;
  sizes: string;
  width?: number;
  className?: string;
  imageClassName?: string;
};

export function PortfolioMedia({
  src,
  alt = "",
  objectPosition = "center center",
  priority = false,
  sizes,
  width = 1600,
  className = "",
  imageClassName = "",
}: PortfolioMediaProps) {
  const originalImage = src?.trim() || "";
  const optimizedImage = useMemo(
    () =>
      getOptimizedImageUrl(originalImage, {
        width,
        quality: 84,
        resize: "contain",
      }),
    [originalImage, width],
  );
  const [failedImages, setFailedImages] = useState<string[]>([]);
  const imageSrc = failedImages.includes(optimizedImage) ? originalImage : optimizedImage;
  const isVisible = Boolean(imageSrc) && !failedImages.includes(imageSrc);

  return (
    <div className={`relative overflow-hidden bg-[#ecece7] ${className}`} aria-hidden={!isVisible}>
      {isVisible ? (
        <Image
          src={imageSrc}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className={`block object-cover ${imageClassName}`}
          style={{ objectPosition }}
          onError={() => {
            setFailedImages((currentImages) =>
              currentImages.includes(imageSrc) ? currentImages : [...currentImages, imageSrc],
            );
          }}
        />
      ) : null}
    </div>
  );
}

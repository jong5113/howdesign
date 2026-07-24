"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

import { getOptimizedImageUrl } from "@/lib/image-utils";
import type { PortfolioItem } from "@/lib/types";

type PreviewImageProps = {
  project: PortfolioItem;
  className?: string;
  imageClassName?: string;
  sizes: string;
  priority?: boolean;
};

export function PreviewImage({
  project,
  className = "",
  imageClassName = "",
  sizes,
  priority = false,
}: PreviewImageProps) {
  const originalImage = project.coverImageUrl || project.coverImage;
  const optimizedImage = useMemo(
    () =>
      getOptimizedImageUrl(originalImage, {
        width: 1800,
        quality: 84,
        resize: "cover",
      }),
    [originalImage],
  );
  const [imageSrc, setImageSrc] = useState(optimizedImage);
  const [hasImage, setHasImage] = useState(Boolean(optimizedImage));
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <span className={`dp-image ${className}`} aria-hidden="true">
      <span className="dp-image__placeholder" />
      {hasImage ? (
        <Image
          src={imageSrc}
          alt=""
          fill
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          sizes={sizes}
          className={`dp-image__media ${isLoaded ? "is-loaded" : ""} ${imageClassName}`}
          style={{ objectPosition: project.coverObjectPosition || "center center" }}
          onLoad={() => setIsLoaded(true)}
          onError={() => {
            if (imageSrc !== originalImage && originalImage) {
              setImageSrc(originalImage);
              setIsLoaded(false);
              return;
            }

            setHasImage(false);
          }}
        />
      ) : null}
    </span>
  );
}

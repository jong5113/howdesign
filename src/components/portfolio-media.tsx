"use client";

import {
  ResilientImage,
  useImageFallbackState,
} from "@/components/resilient-image";

type PortfolioMediaProps = {
  src?: string | null;
  alt?: string;
  objectPosition?: string;
  priority?: boolean;
  sizes: string;
  className?: string;
  imageClassName?: string;
};

export function PortfolioMedia({
  src,
  alt = "",
  objectPosition = "center center",
  priority = false,
  sizes,
  className = "",
  imageClassName = "",
}: PortfolioMediaProps) {
  const originalImage = src?.trim() || "";
  const { getImageMode, handleImageError } = useImageFallbackState();
  const imageMode = getImageMode(originalImage);
  const isVisible = Boolean(originalImage) && imageMode !== "broken";

  return (
    <div className={`relative overflow-hidden bg-[#ecece7] ${className}`} aria-hidden={!isVisible}>
      {isVisible ? (
        <ResilientImage
          src={originalImage}
          mode={imageMode}
          onLoadError={handleImageError}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className={`block object-cover ${imageClassName}`}
          style={{ objectPosition }}
        />
      ) : null}
    </div>
  );
}

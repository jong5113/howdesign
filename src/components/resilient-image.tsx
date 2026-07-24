"use client";

import Image, { type ImageProps } from "next/image";
import { useCallback, useState } from "react";

import {
  getNextImageLoadMode,
  type AttemptedImageLoadMode,
  type ImageLoadMode,
} from "@/lib/image-utils";

type ResilientImageProps = Omit<
  ImageProps,
  "src" | "unoptimized" | "onError"
> & {
  src: string;
  mode: ImageLoadMode;
  onLoadError: (src: string, failedMode: AttemptedImageLoadMode) => void;
};

export function ResilientImage({
  src,
  mode,
  onLoadError,
  alt,
  ...imageProps
}: ResilientImageProps) {
  if (!src || mode === "broken") {
    return null;
  }

  const loadMode: AttemptedImageLoadMode =
    mode === "original" ? "original" : "optimized";

  return (
    <Image
      key={`${src}:${loadMode}`}
      {...imageProps}
      src={src}
      alt={alt}
      unoptimized={loadMode === "original"}
      onError={(event) => {
        event.currentTarget.style.visibility = "hidden";
        onLoadError(src, loadMode);
      }}
    />
  );
}

export function useImageFallbackState() {
  const [imageModes, setImageModes] = useState<
    ReadonlyMap<string, ImageLoadMode>
  >(() => new Map());

  const getImageMode = useCallback(
    (src: string): ImageLoadMode => imageModes.get(src) ?? "optimized",
    [imageModes],
  );

  const handleImageError = useCallback(
    (src: string, failedMode: AttemptedImageLoadMode) => {
      if (!src) {
        return;
      }

      setImageModes((currentModes) => {
        const currentMode = currentModes.get(src) ?? "optimized";
        const nextMode = getNextImageLoadMode(currentMode, failedMode);

        if (nextMode === currentMode) {
          return currentModes;
        }

        const nextModes = new Map(currentModes);
        nextModes.set(src, nextMode);
        return nextModes;
      });
    },
    [],
  );

  return {
    getImageMode,
    handleImageError,
  };
}

"use client";

import Image from "next/image";
import { Fragment, MouseEvent, type ReactNode, useCallback, useEffect, useMemo, useState } from "react";

import { getOptimizedImageUrl } from "@/lib/image-utils";

export type ProjectLightboxImage = {
  src: string;
  alt?: string;
};

type ProjectLightboxGalleryProps = {
  images: ProjectLightboxImage[];
  className?: string;
  afterFirst?: ReactNode;
};

export function ProjectLightboxGallery({
  images,
  className = "",
  afterFirst,
}: ProjectLightboxGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [originalImageUrls, setOriginalImageUrls] = useState<Set<string>>(
    () => new Set(),
  );
  const [brokenImageUrls, setBrokenImageUrls] = useState<Set<string>>(
    () => new Set(),
  );
  const visibleImages = useMemo(
    () =>
      images.filter(
        (image) => image.src.trim() && !brokenImageUrls.has(image.src),
      ),
    [brokenImageUrls, images],
  );
  const safeActiveIndex =
    activeIndex === null || visibleImages.length === 0
      ? null
      : Math.min(activeIndex, visibleImages.length - 1);
  const activeImage =
    safeActiveIndex === null ? null : visibleImages[safeActiveIndex];
  const hasMultipleImages = visibleImages.length > 1;

  const openLightbox = useCallback(
    (index: number) => {
      if (index < 0 || index >= visibleImages.length) {
        return;
      }

      setActiveIndex(index);
    },
    [visibleImages.length],
  );

  const closeLightbox = useCallback(() => {
    setActiveIndex(null);
  }, []);

  const showPrevious = useCallback(() => {
    if (!hasMultipleImages || safeActiveIndex === null) {
      return;
    }

    setActiveIndex(
      safeActiveIndex === 0 ? visibleImages.length - 1 : safeActiveIndex - 1,
    );
  }, [hasMultipleImages, safeActiveIndex, visibleImages.length]);

  const showNext = useCallback(() => {
    if (!hasMultipleImages || safeActiveIndex === null) {
      return;
    }

    setActiveIndex(
      safeActiveIndex === visibleImages.length - 1 ? 0 : safeActiveIndex + 1,
    );
  }, [hasMultipleImages, safeActiveIndex, visibleImages.length]);

  useEffect(() => {
    if (activeIndex === null) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeLightbox();
      }

      if (event.key === "ArrowLeft") {
        showPrevious();
      }

      if (event.key === "ArrowRight") {
        showNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeIndex, closeLightbox, showNext, showPrevious]);

  const handleOverlayClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      closeLightbox();
    }
  };

  const markImageForOriginalUrl = useCallback((src: string) => {
    setOriginalImageUrls((currentUrls) => {
      const nextUrls = new Set(currentUrls);
      nextUrls.add(src);
      return nextUrls;
    });
  }, []);

  const markImageAsBroken = useCallback((src: string) => {
    setBrokenImageUrls((currentUrls) => {
      const nextUrls = new Set(currentUrls);
      nextUrls.add(src);
      return nextUrls;
    });
  }, []);

  const handleImageError = useCallback(
    (src: string) => {
      if (!originalImageUrls.has(src)) {
        markImageForOriginalUrl(src);
        return;
      }

      markImageAsBroken(src);
    },
    [markImageAsBroken, markImageForOriginalUrl, originalImageUrls],
  );

  const getGalleryImageSrc = useCallback(
    (src: string) =>
      originalImageUrls.has(src)
        ? src
        : getOptimizedImageUrl(src, {
            width: 1400,
            quality: 82,
            resize: "contain",
          }),
    [originalImageUrls],
  );

  const getLightboxImageSrc = useCallback(
    (src: string) =>
      originalImageUrls.has(src)
        ? src
        : getOptimizedImageUrl(src, {
            width: 2000,
            quality: 85,
            resize: "contain",
          }),
    [originalImageUrls],
  );

  if (visibleImages.length === 0) {
    return <div className="project-gallery-empty" aria-hidden="true" />;
  }

  return (
    <>
      <section className={className}>
        {visibleImages.map((image, index) => (
          <Fragment key={`${image.src}-${index}`}>
            <figure className={`project-gallery-item project-gallery-item--${index + 1}`}>
              <button
                type="button"
                className="block w-full cursor-pointer border-0 bg-transparent p-0 text-left"
                onClick={() => openLightbox(index)}
                aria-label={`Open image ${index + 1}`}
              >
                <Image
                  src={getGalleryImageSrc(image.src)}
                  alt={image.alt ?? ""}
                  width={1400}
                  height={933}
                  sizes={
                    index === 0
                      ? "(min-width: 1240px) 1240px, 100vw"
                      : "(min-width: 1240px) 572px, (min-width: 1024px) calc(50vw - 48px), 100vw"
                  }
                  className="project-gallery-image block h-auto w-full"
                  priority={index === 0}
                  decoding="async"
                  unoptimized={originalImageUrls.has(image.src)}
                  onError={() => handleImageError(image.src)}
                />
              </button>
              {index > 0 ? <figcaption>{String(index + 1).padStart(2, "0")} / INTERIOR VIEW</figcaption> : null}
            </figure>
            {index === 0 ? afterFirst : null}
          </Fragment>
        ))}
      </section>

      {activeImage ? (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/96 px-4 py-6"
          onClick={handleOverlayClick}
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
        >
          <button
            type="button"
            className="fixed right-4 top-4 z-50 flex h-12 w-12 cursor-pointer items-center justify-center border-0 bg-transparent text-[22px] font-light leading-none text-neutral-900 transition-opacity hover:opacity-50 sm:right-6 sm:top-6 sm:h-14 sm:w-14 sm:text-[26px]"
            onClick={closeLightbox}
            aria-label="Close image viewer"
          >
            X
          </button>

          <div className="flex max-w-full items-center justify-center gap-2 sm:gap-4 lg:gap-6">
            {hasMultipleImages ? (
              <button
                type="button"
                className="flex h-16 w-12 shrink-0 cursor-pointer items-center justify-center border-0 bg-transparent text-[34px] font-light leading-none text-neutral-900 transition-opacity hover:opacity-50 sm:h-20 sm:w-16 sm:text-[44px] lg:h-24 lg:w-20 lg:text-[58px]"
                onClick={showPrevious}
                aria-label="Show previous image"
              >
                {"<"}
              </button>
            ) : null}

            <Image
              src={getLightboxImageSrc(activeImage.src)}
              alt={activeImage.alt ?? ""}
              width={2000}
              height={1333}
              sizes="86vw"
              className="max-h-[85vh] max-w-[78vw] object-contain sm:max-w-[84vw] lg:max-w-[86vw]"
              loading="eager"
              decoding="async"
              unoptimized={originalImageUrls.has(activeImage.src)}
              onError={() => handleImageError(activeImage.src)}
            />

            {hasMultipleImages ? (
              <button
                type="button"
                className="flex h-16 w-12 shrink-0 cursor-pointer items-center justify-center border-0 bg-transparent text-[34px] font-light leading-none text-neutral-900 transition-opacity hover:opacity-50 sm:h-20 sm:w-16 sm:text-[44px] lg:h-24 lg:w-20 lg:text-[58px]"
                onClick={showNext}
                aria-label="Show next image"
              >
                {">"}
              </button>
            ) : null}
          </div>

          {hasMultipleImages ? (
            <p className="mt-4 text-xs tracking-[0.18em] text-neutral-600">
              {(safeActiveIndex ?? 0) + 1} / {visibleImages.length}
            </p>
          ) : null}
        </div>
      ) : null}
    </>
  );
}

export default ProjectLightboxGallery;

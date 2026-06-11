"use client";

import { KeyboardEvent, MouseEvent, useCallback, useEffect, useState } from "react";

type ProjectLightboxImage = {
  src: string;
  alt?: string;
};

type ProjectLightboxGalleryProps = {
  images: ProjectLightboxImage[];
  className?: string;
};

export function ProjectLightboxGallery({ images, className = "" }: ProjectLightboxGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const isOpen = activeIndex !== null;
  const activeImage = activeIndex !== null ? images[activeIndex] : null;
  const hasMultipleImages = images.length > 1;

  function closeLightbox() {
    setActiveIndex(null);
  }

  const showPrevious = useCallback(() => {
    setActiveIndex((current) => {
      if (current === null) {
        return current;
      }

      return current === 0 ? images.length - 1 : current - 1;
    });
  }, [images.length]);

  const showNext = useCallback(() => {
    setActiveIndex((current) => {
      if (current === null) {
        return current;
      }

      return current === images.length - 1 ? 0 : current + 1;
    });
  }, [images.length]);

  function stopClick(event: MouseEvent) {
    event.stopPropagation();
  }

  function handleThumbnailKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setActiveIndex(index);
    }
  }

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") {
        closeLightbox();
      }

      if (event.key === "ArrowLeft" && hasMultipleImages) {
        showPrevious();
      }

      if (event.key === "ArrowRight" && hasMultipleImages) {
        showNext();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [hasMultipleImages, isOpen, images.length, showNext, showPrevious]);

  function renderImageButton(image: ProjectLightboxImage, index: number, imageClassName = "block h-auto w-full") {
    return (
      <button
        type="button"
        onClick={() => setActiveIndex(index)}
        onKeyDown={(event) => handleThumbnailKeyDown(event, index)}
        className="block w-full cursor-pointer bg-transparent p-0 text-left"
        aria-label={`${image.alt || "Project image"} 크게 보기`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image.src} alt={image.alt || ""} className={imageClassName} />
      </button>
    );
  }

  return (
    <>
      <section className={className} aria-label="프로젝트 이미지 갤러리">
        {images.map((image, index) => (
          <figure key={`${image.src}-${index}`} className="mb-1.5 break-inside-avoid">
            {renderImageButton(image, index)}
          </figure>
        ))}
      </section>

      {isOpen && activeImage ? (
        <div
          className="fixed inset-0 z-50 grid bg-white/95 px-4 py-5 sm:px-8"
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
          onClick={closeLightbox}
        >
          <div className="grid h-full grid-rows-[auto_1fr_auto] gap-4">
            <div className="flex items-center justify-between text-[12px] uppercase tracking-[0.09em] text-muted">
              <span>
                {activeIndex + 1} / {images.length}
              </span>
              <button
                type="button"
                onClick={closeLightbox}
                className="flex h-12 w-12 items-center justify-center text-[32px] font-light leading-none text-foreground transition-opacity hover:opacity-55 sm:h-14 sm:w-14 sm:text-[40px]"
                aria-label="Close image viewer"
              >
                ×
              </button>
            </div>

            <div className="flex min-h-0 items-center justify-center gap-3 sm:gap-5" onClick={stopClick}>
              {hasMultipleImages ? (
                <button
                  type="button"
                  onClick={showPrevious}
                  className="flex h-16 w-12 shrink-0 items-center justify-center text-[36px] font-light leading-none text-foreground transition-opacity hover:opacity-55 sm:h-20 sm:w-16 sm:text-[48px] lg:h-24 lg:w-20 lg:text-[64px]"
                  aria-label="Previous image"
                >
                  {"<"}
                </button>
              ) : null}

              <div className="grid min-h-0 place-items-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={activeImage.src}
                  alt={activeImage.alt || ""}
                  className="max-h-[82vh] max-w-[calc(94vw-72px)] object-contain sm:max-h-[85vh] sm:max-w-[85vw]"
                />
              </div>

              {hasMultipleImages ? (
                <button
                  type="button"
                  onClick={showNext}
                  className="flex h-16 w-12 shrink-0 items-center justify-center text-[36px] font-light leading-none text-foreground transition-opacity hover:opacity-55 sm:h-20 sm:w-16 sm:text-[48px] lg:h-24 lg:w-20 lg:text-[64px]"
                  aria-label="Next image"
                >
                  {">"}
                </button>
              ) : null}
            </div>

            <p className="text-center text-[11px] uppercase tracking-[0.09em] text-muted">
              ESC / ← / →
            </p>
          </div>
        </div>
      ) : null}
    </>
  );
}

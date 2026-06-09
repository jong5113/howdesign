"use client";

import { KeyboardEvent, useState } from "react";
import Image from "next/image";

type GalleryImage = {
  src: string;
  alt?: string;
};

type ProjectGallerySliderProps = {
  images: GalleryImage[];
};

export function ProjectGallerySlider({ images }: ProjectGallerySliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentImage = images[currentIndex];
  const hasMultipleImages = images.length > 1;

  function showPrevious() {
    setCurrentIndex((index) => (index === 0 ? images.length - 1 : index - 1));
  }

  function showNext() {
    setCurrentIndex((index) => (index === images.length - 1 ? 0 : index + 1));
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!hasMultipleImages) {
      return;
    }

    if (event.key === "ArrowLeft") {
      showPrevious();
    }

    if (event.key === "ArrowRight") {
      showNext();
    }
  }

  if (!currentImage) {
    return null;
  }

  return (
    <section
      className="grid gap-4"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label="프로젝트 이미지 슬라이더"
    >
      <div className="relative">
        <figure className="relative mx-auto aspect-[4/3] max-h-[72vh] overflow-hidden bg-background sm:aspect-[3/2]">
          <Image
            src={currentImage.src}
            alt={currentImage.alt || "프로젝트 이미지"}
            fill
            priority={currentIndex === 0}
            unoptimized
            sizes="100vw"
            className="object-contain"
          />
        </figure>

        {hasMultipleImages ? (
          <div className="mt-3 flex items-center justify-between text-[12px] uppercase tracking-[0.09em] text-muted">
            <button type="button" onClick={showPrevious} className="underline-offset-4 hover:underline">
              ← Prev
            </button>
            <span>
              {currentIndex + 1} / {images.length}
            </span>
            <button type="button" onClick={showNext} className="underline-offset-4 hover:underline">
              Next →
            </button>
          </div>
        ) : null}
      </div>

      {hasMultipleImages ? (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((image, index) => (
            <button
              key={`${image.src}-${index}`}
              type="button"
              onClick={() => setCurrentIndex(index)}
              className={`shrink-0 border ${
                index === currentIndex ? "border-foreground" : "border-line"
              }`}
              aria-label={`${index + 1}번째 이미지 보기`}
            >
              <span className="relative block h-12 w-14 sm:h-14 sm:w-16">
                <Image
                  src={image.src}
                  alt=""
                  fill
                  unoptimized
                  sizes="64px"
                  className="object-cover"
                />
              </span>
            </button>
          ))}
        </div>
      ) : null}
    </section>
  );
}

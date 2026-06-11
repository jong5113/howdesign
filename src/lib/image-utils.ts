type ImageOptimizationOptions = {
  width?: number;
  quality?: number;
  resize?: "cover" | "contain" | "fill";
};

export function getOptimizedImageUrl(
  url: string,
  options: ImageOptimizationOptions = {},
) {
  if (!url) {
    return url;
  }

  try {
    const imageUrl = new URL(url);

    if (!imageUrl.pathname.includes("/storage/v1/object/public/")) {
      return url;
    }

    imageUrl.pathname = imageUrl.pathname.replace(
      "/storage/v1/object/public/",
      "/storage/v1/render/image/public/",
    );

    if (options.width) {
      imageUrl.searchParams.set("width", String(options.width));
    }

    if (options.quality) {
      imageUrl.searchParams.set("quality", String(options.quality));
    }

    if (options.resize) {
      imageUrl.searchParams.set("resize", options.resize);
    }

    return imageUrl.toString();
  } catch {
    return url;
  }
}

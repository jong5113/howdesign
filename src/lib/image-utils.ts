export type ImageLoadMode = "optimized" | "original" | "broken";
export type AttemptedImageLoadMode = Exclude<ImageLoadMode, "broken">;

export function getNextImageLoadMode(
  currentMode: ImageLoadMode,
  failedMode: AttemptedImageLoadMode,
): ImageLoadMode {
  if (currentMode !== failedMode) {
    return currentMode;
  }

  return failedMode === "optimized" ? "original" : "broken";
}

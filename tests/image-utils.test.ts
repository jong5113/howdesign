import { strictEqual } from "node:assert";
import { test } from "node:test";

import {
  getNextImageLoadMode,
  type ImageLoadMode,
} from "../src/lib/image-utils";

test("an optimized image retries once with the original URL", () => {
  const originalMode = getNextImageLoadMode("optimized", "optimized");

  strictEqual(originalMode, "original");
  strictEqual(
    getNextImageLoadMode(originalMode, "optimized"),
    "original",
    "a duplicate optimized error must not consume the original retry",
  );
});

test("an original URL failure becomes permanently broken", () => {
  const brokenMode = getNextImageLoadMode("original", "original");

  strictEqual(brokenMode, "broken");
  strictEqual(
    getNextImageLoadMode(brokenMode, "original"),
    "broken",
    "a duplicate original error must not create another retry",
  );
});

test("the complete fallback sequence has only two load modes", () => {
  let mode: ImageLoadMode = "optimized";

  mode = getNextImageLoadMode(mode, "optimized");
  strictEqual(mode, "original");

  mode = getNextImageLoadMode(mode, "original");
  strictEqual(mode, "broken");
});

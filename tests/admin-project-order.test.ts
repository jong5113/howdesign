import { deepStrictEqual, strictEqual } from "node:assert";
import { test } from "node:test";

import { moveItemByOffset, reorderItems } from "../src/lib/admin-project-order";

const projects = [{ id: "a" }, { id: "b" }, { id: "c" }, { id: "d" }];

test("reorders a dragged project before the target", () => {
  const reordered = reorderItems(projects, "d", "b", "before");

  deepStrictEqual(
    reordered.map((project) => project.id),
    ["a", "d", "b", "c"],
  );
});

test("reorders a dragged project after the target", () => {
  const reordered = reorderItems(projects, "a", "c", "after");

  deepStrictEqual(
    reordered.map((project) => project.id),
    ["b", "c", "a", "d"],
  );
});

test("moves a project by one position for keyboard and touch controls", () => {
  const moved = moveItemByOffset(projects, "b", 1);

  deepStrictEqual(
    moved.map((project) => project.id),
    ["a", "c", "b", "d"],
  );
  strictEqual(moveItemByOffset(projects, "a", -1), projects);
});

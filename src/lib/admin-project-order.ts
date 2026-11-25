export type DropPlacement = "before" | "after";

type OrderedItem = {
  id: string;
};

export function reorderItems<T extends OrderedItem>(
  items: T[],
  draggedId: string,
  targetId: string,
  placement: DropPlacement,
) {
  if (draggedId === targetId) {
    return items;
  }

  const draggedIndex = items.findIndex((item) => item.id === draggedId);
  const targetIndex = items.findIndex((item) => item.id === targetId);

  if (draggedIndex < 0 || targetIndex < 0) {
    return items;
  }

  const nextItems = [...items];
  const [draggedItem] = nextItems.splice(draggedIndex, 1);
  const nextTargetIndex = nextItems.findIndex((item) => item.id === targetId);
  const insertionIndex = placement === "before" ? nextTargetIndex : nextTargetIndex + 1;

  nextItems.splice(insertionIndex, 0, draggedItem);
  return nextItems;
}

export function moveItemByOffset<T extends OrderedItem>(items: T[], itemId: string, offset: -1 | 1) {
  const currentIndex = items.findIndex((item) => item.id === itemId);
  const nextIndex = currentIndex + offset;

  if (currentIndex < 0 || nextIndex < 0 || nextIndex >= items.length) {
    return items;
  }

  const nextItems = [...items];
  [nextItems[currentIndex], nextItems[nextIndex]] = [nextItems[nextIndex], nextItems[currentIndex]];
  return nextItems;
}

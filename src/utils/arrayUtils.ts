// Accept any array of objects that have the field id: string
export const findItemIndexById = <TItem extends Item>(
  items: TItem[], // enforce id: string field on each item
  id: string // id that will be used for lookup
) => {
  return items.findIndex((item: TItem) => item.id === id);
}

export const moveItem = <TItem>(array: TItem[], from: number, to: number) => {
  const item = array[from];
  return insertItemAtIndex(removeItemAtIndex(array, from), item, to);
}

export const removeItemAtIndex = <TItem>(array: TItem[], index: number) => {
  // Return a copy of the given array without the item with the given index.
  return [...array.slice(0, index), ...array.slice(index + 1)];
}

export const insertItemAtIndex = <TItem>(array: TItem[], item: TItem, index: number) => {
  // Return a copy of the given array with the new item added at the given index.
  return [...array.slice(0, index), item, ...array.slice(index)];
}

type Item = {
  id: string
}

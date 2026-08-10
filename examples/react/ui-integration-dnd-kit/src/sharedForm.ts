export type TodoId = string

export type TodoItem = {
  id: TodoId
  label: string
}

export const initialItems: Array<TodoItem> = [
  { id: 'todo-1', label: 'Collect requirements' },
  { id: 'todo-2', label: 'Sketch the flow' },
  { id: 'todo-3', label: 'Wire the form' },
  { id: 'todo-4', label: 'Polish interactions' },
]

export const initialDoneItems: Array<TodoItem> = [
  { id: 'todo-5', label: 'Review accessibility' },
  { id: 'todo-6', label: 'Ship example' },
]

const itemGroups = ['items', 'doneItems'] as const

export type ItemGroup = (typeof itemGroups)[number]

export const itemGroupLabels: Record<ItemGroup, string> = {
  items: 'Planning',
  doneItems: 'Done',
}

let nextId = initialItems.length + initialDoneItems.length + 1

export function createItem(): TodoItem {
  const id = nextId++

  return {
    id: `todo-${id}`,
    label: `New item ${id}`,
  }
}

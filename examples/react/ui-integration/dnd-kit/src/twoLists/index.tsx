import { DragDropProvider, useDroppable } from '@dnd-kit/react'
import { batch, formOptions, useForm, useSelector } from '@tanstack/react-form'
import { move } from '@dnd-kit/helpers'
import {
  createItem,
  initialDoneItems,
  initialItems,
  itemGroupLabels,
} from '../sharedForm'
import { SortableItem } from './SortableItem'
import type { ReactFormType } from '@tanstack/react-form'
import type { ItemGroup, TodoId, TodoItem } from '../sharedForm'

// Using the same array-field approach as the single-list example caused race
// conditions where React and dnd-kit fought over the UI and crashed when moving
// items across groups. This example avoids that by keeping item data keyed by ID
// and storing ordering separately. If you find a cleaner solution, PRs are
// welcome!
const multiListFormOptions = formOptions({
  defaultValues: {
    items: initialItems.concat(initialDoneItems).reduce(
      (record, item) => {
        record[item.id] = { ...item }
        return record
      },
      {} as Record<string, TodoItem>,
    ),
    itemOrder: {
      items: initialItems.map((item) => item.id),
      doneItems: initialDoneItems.map((item) => item.id),
    },
  },
})

export type MultiListDndForm = ReactFormType<typeof multiListFormOptions>

function formatItems(
  ids: Array<TodoId>,
  tasksById: Record<string, { label: string }>,
) {
  return ids
    .map((id, index) => `${index + 1}. ${tasksById[id].label}`)
    .join('\n')
}

interface SortableListProps {
  form: MultiListDndForm
  group: ItemGroup
  itemIds: Array<TodoId>
}

function SortableList({ form, group, itemIds }: SortableListProps) {
  const { ref } = useDroppable({
    id: `${group}-drop`,
    type: 'column',
    accept: 'item',
  })

  return (
    <section className="list-section" ref={ref}>
      <h3>{itemGroupLabels[group]}</h3>
      <ul className="sortable-list">
        {itemIds.map((id, index) => (
          <SortableItem
            key={id}
            form={form}
            group={group}
            id={id}
            index={index}
          />
        ))}
      </ul>
    </section>
  )
}

export function TwoListsExample() {
  const form = useForm({
    ...multiListFormOptions,
    onSubmit: ({ value }) => {
      const { items, itemOrder } = value

      const stringItems = formatItems(itemOrder.items, items)
      const stringDoneItems = formatItems(itemOrder.doneItems, items)
      alert(
        `Submitted order:\n\n${itemGroupLabels.items}\n${stringItems}\n\n${itemGroupLabels.doneItems}\n${stringDoneItems}`,
      )
    },
  })

  const itemOrder = useSelector(form.atom, (state) => state.values.itemOrder)

  function handleCreate(group: ItemGroup) {
    const item = createItem()
    batch(() => {
      form.pushFieldValue(`itemOrder.${group}`, item.id)
      form.setFieldValue(`items.${item.id}`, item)
    })
  }

  return (
    <section className="example-section">
      <header className="example-header">
        <h2>Two lists</h2>
      </header>

      <form
        className="array-form"
        onSubmit={(event) => {
          event.preventDefault()
          event.stopPropagation()
          form.handleSubmit()
        }}
      >
        <DragDropProvider
          onDragOver={(event) => {
            form.setFieldValue('itemOrder', (items) => move(items, event))
          }}
        >
          <div className="toolbar">
            <button type="submit">Submit</button>
            <button type="button" onClick={() => handleCreate('items')}>
              Add planning item
            </button>
            <button type="button" onClick={() => handleCreate('doneItems')}>
              Add done item
            </button>
          </div>

          <div className="lists-grid">
            <SortableList form={form} group="items" itemIds={itemOrder.items} />
            <SortableList
              form={form}
              group="doneItems"
              itemIds={itemOrder.doneItems}
            />
          </div>
        </DragDropProvider>
      </form>
    </section>
  )
}

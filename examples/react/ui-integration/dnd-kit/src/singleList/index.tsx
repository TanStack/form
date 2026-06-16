import { DragDropProvider } from '@dnd-kit/react'
import { isSortable, useSortable } from '@dnd-kit/react/sortable'
import { formOptions, useForm } from '@tanstack/react-form'
import { createItem, initialItems } from '../sharedForm'
import type { DragEndEvent } from '@dnd-kit/react'
import type { ReactFormType } from '@tanstack/react-form'

const singleListFormOptions = formOptions({
  defaultValues: {
    items: initialItems.map((item) => ({ ...item })),
  },
})

type SingleListForm = ReactFormType<typeof singleListFormOptions>

interface SingleListItemProps {
  form: SingleListForm
  id: string
  index: number
}

function SingleListItem({ form, id, index }: SingleListItemProps) {
  const { handleRef, isDragging, isDropTarget, ref } = useSortable({
    id,
    index,
    group: 'single-list',
    type: 'single-list-item',
    accept: 'single-list-item',
  })
  const fieldName = `items[${index}].label` as const

  return (
    <li
      ref={ref}
      className="sortable-item"
      data-dragging={isDragging}
      data-drop-target={isDropTarget}
    >
      <button
        ref={handleRef}
        type="button"
        className="drag-handle"
        aria-label="Reorder item"
      >
        Drag
      </button>
      <form.Field name={fieldName}>
        {(field) => (
          <label className="item-field">
            <span>Item {index + 1}</span>
            <input
              name={field.name}
              value={field.value}
              onBlur={field.handleBlur}
              onChange={(event) => field.handleChange(event.target.value)}
            />
          </label>
        )}
      </form.Field>
    </li>
  )
}

function formatItems(items: Array<{ label: string }>) {
  return items.map((item, index) => `${index + 1}. ${item.label}`).join('\n')
}

function getSingleListDragEndHandler(
  form: SingleListForm,
): (event: DragEndEvent) => void {
  return (event) => {
    if (event.canceled || !isSortable(event.operation.source)) {
      return
    }

    const { source } = event.operation

    if (source.initialIndex === source.index) {
      return
    }

    form.moveFieldValue('items', source.initialIndex, source.index)
  }
}

export function SingleListExample() {
  const form = useForm({
    ...singleListFormOptions,
    onSubmit: ({ value }) => {
      alert(`Single list order:\n\n${formatItems(value.items)}`)
    },
  })

  return (
    <section className="example-section">
      <header className="example-header">
        <h2>Single list</h2>
      </header>

      <form
        className="array-form"
        onSubmit={(event) => {
          event.preventDefault()
          event.stopPropagation()
          form.handleSubmit()
        }}
      >
        <DragDropProvider onDragEnd={getSingleListDragEndHandler(form)}>
          <div className="toolbar">
            <button type="submit">Submit</button>
            <button
              type="button"
              onClick={() => form.pushFieldValue('items', createItem())}
            >
              Add item
            </button>
          </div>

          <form.ArrayField name="items">
            {(arrayField) => (
              <section className="list-section">
                <h3>Items</h3>
                <ul className="sortable-list">
                  {arrayField.value.map((item, index) => (
                    <SingleListItem
                      key={item.id}
                      form={form}
                      id={item.id}
                      index={index}
                    />
                  ))}
                </ul>
              </section>
            )}
          </form.ArrayField>
        </DragDropProvider>
      </form>
    </section>
  )
}

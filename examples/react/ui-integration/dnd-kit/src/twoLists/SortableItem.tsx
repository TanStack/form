import { useSortable } from '@dnd-kit/react/sortable'
import type { ItemGroup, TodoId } from '../sharedForm'
import type { MultiListDndForm } from '.'

interface SortableItemProps {
  form: MultiListDndForm
  group: ItemGroup
  id: TodoId
  index: number
}

export function SortableItem(props: SortableItemProps) {
  const { form, group, id, index } = props

  const { ref, handleRef, isDragging } = useSortable({
    id,
    index,
    type: 'todo-item',
    accept: 'todo-item',
    group,
  })

  return (
    <li ref={ref} className="sortable-item" data-dragging={isDragging}>
      <button
        ref={handleRef}
        type="button"
        className="drag-handle"
        aria-label="Reorder item"
      >
        Drag
      </button>
      <form.Field name={`items.${id}.label`}>
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

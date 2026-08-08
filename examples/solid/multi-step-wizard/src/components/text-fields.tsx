import { For } from 'solid-js'
import type { Accessor } from 'solid-js'
import type { FieldWithValue } from '@tanstack/solid-form'

export function TextField(props: {
  field: Accessor<FieldWithValue<string>>
  label: string
}) {
  return (
    <div>
      <label>
        <div>{props.label}</div>
        <input
          value={props.field().value}
          onInput={(event) =>
            props.field().handleChange(event.currentTarget.value)
          }
          onBlur={props.field().handleBlur}
          aria-invalid={props.field().meta.isInvalid}
        />
      </label>
      <For each={props.field().errors}>
        {(error) => <div style={{ color: 'red' }}>{error.message}</div>}
      </For>
    </div>
  )
}

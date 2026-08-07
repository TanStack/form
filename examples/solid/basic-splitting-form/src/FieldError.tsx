import { For } from 'solid-js'
import type { Accessor } from 'solid-js'
import type { AnyFieldApi } from '@tanstack/solid-form'

export function FieldError(props: { field: Accessor<AnyFieldApi> }) {
  return (
    <small
      role={props.field().meta.isInvalid ? 'alert' : undefined}
      aria-live="polite"
    >
      <For each={props.field().errors}>
        {(error, index) => (
          <>
            {index() > 0 ? '\n' : ''}
            {error.message}
          </>
        )}
      </For>
    </small>
  )
}

import { For } from 'solid-js'
import { useStore } from '@tanstack/solid-form'
import { useFieldContext } from '../hooks/form-context.tsx'

export default function TextField(props: { label: string }) {
  const field = useFieldContext<string>()

  const errors = useStore(field().store, (state) => state.meta.errors)

  return (
    <div>
      <label>
        <div>{props.label}</div>
        <input
          value={field().state.value}
          onChange={(e) => field().handleChange(e.target.value)}
        />
      </label>
      <For each={errors()}>
        {(error) => <div style={{ color: 'red' }}>{error}</div>}
      </For>
    </div>
  )
}

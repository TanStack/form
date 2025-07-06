// import { useStore } from '@tanstack/solid-form'
import { useFieldContext } from '../hooks/form-context.tsx'
import { For } from 'solid-js'

export default function TextField(props: { label: string }) {
  const field = useFieldContext<string>()

  // const errors = useStore(field().store, (state) => state.meta.errors)

  return (
    <div>
      <label>
        <div>{props.label}</div>
        <input
          value={field().state.value}
          onChange={(e) => field().handleChange(e.target.value)}
        />
      </label>
      {/*
        For some reason using `errors` from the store doesn't work as intended and shows the same error for all fields
        But If you make a change it works correctly after the hot reload
      */}
      <For each={field().state.meta.errors}>
        {(error) => <div style={{ color: 'red' }}>{error}</div>}
      </For>
    </div>
  )
}

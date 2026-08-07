import type { AnySolidFormApi } from '@tanstack/solid-form'

export function FormSubmitButton(props: { form: AnySolidFormApi }) {
  return (
    <props.form.Subscribe
      selector={(state) => [state.canSubmit, state.isSubmitting] as const}
    >
      {(state) => (
        <button type="submit" disabled={!state()[0] || state()[1]}>
          {state()[1] ? '...' : 'Submit'}
        </button>
      )}
    </props.form.Subscribe>
  )
}

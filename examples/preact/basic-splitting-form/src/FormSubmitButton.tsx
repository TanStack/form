import type { AnyPreactFormApi } from '@tanstack/preact-form'

interface FormSubmitButtonProps {
  form: AnyPreactFormApi
}

export function FormSubmitButton(props: FormSubmitButtonProps) {
  const { form } = props
  return (
    <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
      {([canSubmit, isSubmitting]) => (
        <button type="submit" disabled={!canSubmit || isSubmitting}>
          {isSubmitting ? '...' : 'Submit'}
        </button>
      )}
    </form.Subscribe>
  )
}

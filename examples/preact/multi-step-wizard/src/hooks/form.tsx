import { createFormHook, getFormHookHelpers } from '@tanstack/preact-form'
import { TextField } from '../components/text-fields.tsx'

const { fieldComponent } = getFormHookHelpers()

const AppTextField = fieldComponent.strict(TextField, 'field')

function SubscribeButton({ label }: { label: string }) {
  const form = useFormContext()
  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <button type="submit" disabled={isSubmitting}>
          {label}
        </button>
      )}
    </form.Subscribe>
  )
}

export const { appFormOptions, useAppForm, useFormContext } = createFormHook({
  fieldComponents: {
    TextField: AppTextField,
  },
  formComponents: {
    SubscribeButton,
  },
})

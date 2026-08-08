import { createFormHook, getFormHookHelpers } from '@tanstack/preact-form'
import TextField from '../components/text-fields.tsx'

const { fieldComponent } = getFormHookHelpers()

const AppTextField = fieldComponent.strict(TextField, 'field')

function SubscribeButton({ label }: { label: string }) {
  const form = useFormContext()
  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => <button disabled={isSubmitting}>{label}</button>}
    </form.Subscribe>
  )
}

export const {
  appFormOptions,
  getAppFieldGroupHelpers,
  useAppForm,
  useFormContext,
} = createFormHook({
  fieldComponents: {
    TextField: AppTextField,
  },
  formComponents: {
    SubscribeButton,
  },
})

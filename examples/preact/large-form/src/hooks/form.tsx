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

const { appFormOptions, defineAppFieldGroup, useAppForm, useFormContext } =
  createFormHook({
    fieldComponents: {
      TextField: AppTextField,
    },
    formComponents: {
      SubscribeButton,
    },
  })

export { appFormOptions, defineAppFieldGroup, useAppForm }

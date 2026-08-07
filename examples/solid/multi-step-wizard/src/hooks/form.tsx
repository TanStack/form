import { createFormHook, getFormHookHelpers } from '@tanstack/solid-form'
import { TextField } from '../components/text-fields'

const { fieldComponent } = getFormHookHelpers()
const AppTextField = fieldComponent.strict(TextField, 'field')

function SubscribeButton(props: { label: string }) {
  const form = useFormContext()
  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <button type="submit" disabled={isSubmitting()}>
          {props.label}
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

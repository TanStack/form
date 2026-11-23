import { createFormHook, getFormHookHelpers } from '@tanstack/react-form'
import TextField from '../components/text-fields.tsx'
import type { AnyReactFormApi } from '@tanstack/react-form'

const { fieldComponent, formComponent } = getFormHookHelpers()

const AppTextField = fieldComponent.strict()(TextField, 'field')

function SubscribeButtonComponent({
  form,
  label,
}: {
  form: AnyReactFormApi
  label: string
}) {
  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => <button disabled={isSubmitting}>{label}</button>}
    </form.Subscribe>
  )
}

const SubscribeButton = formComponent.create(SubscribeButtonComponent, 'form')

export const { appFormOptions, defineAppFieldGroup, useAppForm } =
  createFormHook({
    fieldComponents: {
      TextField: AppTextField,
    },
    formComponents: {
      SubscribeButton,
    },
  })

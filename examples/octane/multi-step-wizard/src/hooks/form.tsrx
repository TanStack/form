import { createFormHook } from '@tanstack/octane-form'
import { TextField } from '../components/text-fields.tsrx'
import { fieldContext, formContext, useFormContext } from './form-context'

function SubscribeButton({ label }: { label: string }) @{
  const form = useFormContext()

  <form.Subscribe selector={(state) => state.isSubmitting}>
    {(isSubmitting) =>
      <button type="submit" disabled={isSubmitting}>{label}</button>}
  </form.Subscribe>
}

export const { useAppForm, withForm, withFieldGroup } = createFormHook({
  fieldComponents: {
    TextField,
  },
  formComponents: {
    SubscribeButton,
  },
  fieldContext,
  formContext,
})

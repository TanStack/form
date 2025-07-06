import { createFormHook } from '@tanstack/solid-form'
import { lazy } from 'solid-js'
import { fieldContext, formContext, useFormContext } from './form-context.tsx'

const TextField = lazy(() => import('../components/text-fields.tsx'))

function SubscribeButton(props: { label: string }) {
  const form = useFormContext()
  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => <button disabled={isSubmitting}>{props.label}</button>}
    </form.Subscribe>
  )
}

export const { useAppForm, withForm } = createFormHook({
  fieldComponents: {
    TextField,
  },
  formComponents: {
    SubscribeButton,
  },
  fieldContext,
  formContext,
})

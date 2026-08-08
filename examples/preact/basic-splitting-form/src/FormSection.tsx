import { StringField } from './StringField'
import type { PreactFormType } from '@tanstack/preact-form'
import type { sharedFormOptions } from './sharedForm'

interface FormSectionProps {
  form: PreactFormType<typeof sharedFormOptions>
}

export function FormSection(props: FormSectionProps) {
  const { form } = props

  return (
    <>
      <form.Field name="address.street">
        {(field) => <StringField field={field} />}
      </form.Field>
      <form.Field name="address.country">
        {(field) => <StringField field={field} />}
      </form.Field>
    </>
  )
}

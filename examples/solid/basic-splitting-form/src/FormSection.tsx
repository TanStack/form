import { StringField } from './StringField'
import type { SolidFormType } from '@tanstack/solid-form'
import type { sharedFormOptions } from './sharedForm'

interface FormSectionProps {
  form: SolidFormType<typeof sharedFormOptions>
}

export function FormSection(props: FormSectionProps) {
  return (
    <>
      <props.form.Field name="address.street">
        {(field) => <StringField field={field} label="Street" />}
      </props.form.Field>
      <props.form.Field name="address.country">
        {(field) => <StringField field={field} label="Country" />}
      </props.form.Field>
    </>
  )
}

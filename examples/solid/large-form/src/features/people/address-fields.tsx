import type { SolidFormType } from '@tanstack/solid-form'
import type { peopleFormOpts } from './shared-form'

export function AddressFields(props: {
  form: SolidFormType<typeof peopleFormOpts>
}) {
  return (
    <div>
      <h2>Address</h2>
      <props.form.Field name="address.line1">
        {(field) => <field.TextField label="Address Line 1" />}
      </props.form.Field>
      <props.form.Field name="address.line2">
        {(field) => <field.TextField label="Address Line 2" />}
      </props.form.Field>
      <props.form.Field name="address.city">
        {(field) => <field.TextField label="City" />}
      </props.form.Field>
      <props.form.Field name="address.state">
        {(field) => <field.TextField label="State" />}
      </props.form.Field>
      <props.form.Field name="address.zip">
        {(field) => <field.TextField label="ZIP Code" />}
      </props.form.Field>
    </div>
  )
}

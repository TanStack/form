import { peopleFormOpts } from './shared-form.tsx'
import type { ReactFormType } from '@tanstack/react-form'

interface AddressFieldsProps {
  form: ReactFormType<typeof peopleFormOpts>
}

export function AddressFields({ form }: AddressFieldsProps) {
  return (
    <div>
      <h2>Address</h2>
      <form.Field name="address.line1">
        {(field) => <field.TextField label="Address Line 1" />}
      </form.Field>
      <form.Field name="address.line2">
        {(field) => <field.TextField label="Address Line 2" />}
      </form.Field>
      <form.Field name="address.city">
        {(field) => <field.TextField label="City" />}
      </form.Field>
      <form.Field name="address.state">
        {(field) => <field.TextField label="State" />}
      </form.Field>
      <form.Field name="address.zip">
        {(field) => <field.TextField label="ZIP Code" />}
      </form.Field>
    </div>
  )
}

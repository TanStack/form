import { peopleFormOpts } from './shared-form.tsx'
import type { ReactFormType } from '@tanstack/react-form'

interface AddressFieldsProps {
  form: ReactFormType<typeof peopleFormOpts>
}

export function AddressFields({ form }: AddressFieldsProps) {
  return (
    <div>
      <h2>Address</h2>
      <form.Field
        name="address.line1"
        children={(field) => <field.TextField label="Address Line 1" />}
      />
      <form.Field
        name="address.line2"
        children={(field) => <field.TextField label="Address Line 2" />}
      />
      <form.Field
        name="address.city"
        children={(field) => <field.TextField label="City" />}
      />
      <form.Field
        name="address.state"
        children={(field) => <field.TextField label="State" />}
      />
      <form.Field
        name="address.zip"
        children={(field) => <field.TextField label="ZIP Code" />}
      />
    </div>
  )
}

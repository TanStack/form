import { withForm } from '../../hooks/form.tsx'
import { peopleFormOpts } from './shared-form.tsx'

export const AddressFields = withForm({
  ...peopleFormOpts,
  render: (props) => {
    return (
      <div>
        <h2>Address</h2>
        <props.form.AppField
          name="address.line1"
          children={(field) => <field.TextField label="Address Line 1" />}
        />
        <props.form.AppField
          name="address.line2"
          children={(field) => <field.TextField label="Address Line 2" />}
        />
        <props.form.AppField
          name="address.city"
          children={(field) => <field.TextField label="City" />}
        />
        <props.form.AppField
          name="address.state"
          children={(field) => <field.TextField label="State" />}
        />
        <props.form.AppField
          name="address.zip"
          children={(field) => <field.TextField label="ZIP Code" />}
        />
      </div>
    )
  },
})

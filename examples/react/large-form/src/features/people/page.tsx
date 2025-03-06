import { useAppForm } from '../../hooks/form.tsx'
import { AddressFields } from './address-fields.tsx'
import { peopleFormOpts } from './shared-form.tsx'

export const PeoplePage = () => {
  const form = useAppForm({
    ...peopleFormOpts,
    validators: {
      onChange: ({ value }) => {
        const errors = {
          fields: {},
        } as {
          fields: Record<string, string>
        }
        if (!value.fullName) {
          errors.fields.fullName = 'Full name is required'
        }
        if (!value.phone) {
          errors.fields.phone = 'Phone is required'
        }
        if (!value.emergencyContact.fullName) {
          errors.fields['emergencyContact.fullName'] =
            'Emergency contact full name is required'
        }
        if (!value.emergencyContact.phone) {
          errors.fields['emergencyContact.phone'] =
            'Emergency contact phone is required'
        }

        return errors
      },
    },
    onSubmit: ({ value }) => {
      alert(JSON.stringify(value, null, 2))
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
    >
      <h1>Personal Information</h1>
      <form.AppField
        name="fullName"
        children={(field) => <field.TextField label="Full Name" />}
      />
      <form.AppField
        name="email"
        children={(field) => <field.TextField label="Email" />}
      />
      <form.AppField
        name="phone"
        children={(field) => <field.TextField label="Phone" />}
      />
      <AddressFields form={form} />
      <h2>Emergency Contact</h2>
      <form.AppField
        name="emergencyContact.fullName"
        children={(field) => <field.TextField label="Full Name" />}
      />
      <form.AppField
        name="emergencyContact.phone"
        children={(field) => <field.TextField label="Phone" />}
      />
      <form.AppForm>
        <form.SubscribeButton label="Submit" />
      </form.AppForm>
    </form>
  )
}

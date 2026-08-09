import { useAppForm } from '../../hooks/form.tsx'
import { AddressFields } from './address-fields.tsx'
import { FieldGroupEmergencyContact } from './emergency-contact.tsx'
import { peopleFormOpts } from './shared-form.tsx'

export const PeoplePage = () => {
  const form = useAppForm({
    ...peopleFormOpts,
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
      <form.Field
        name="fullName"
        children={(field) => <field.TextField label="Full Name" />}
      />
      <form.Field
        name="email"
        children={(field) => <field.TextField label="Email" />}
      />
      <form.Field
        name="phone"
        children={(field) => <field.TextField label="Phone" />}
      />
      <AddressFields form={form} />
      <h2>Emergency Contact</h2>
      <FieldGroupEmergencyContact
        form={form}
        fields={{
          fullName: 'emergencyContact.fullName',
          phone: 'emergencyContact.phone',
        }}
      />

      <form.AppForm>
        <form.SubscribeButton label="Submit" />
      </form.AppForm>
    </form>
  )
}

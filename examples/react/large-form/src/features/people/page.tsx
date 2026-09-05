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
      <form.Field name="fullName">
        {(field) => <field.TextField label="Full Name" />}
      </form.Field>
      <form.Field name="email">
        {(field) => <field.TextField label="Email" />}
      </form.Field>
      <form.Field name="phone">
        {(field) => <field.TextField label="Phone" />}
      </form.Field>
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

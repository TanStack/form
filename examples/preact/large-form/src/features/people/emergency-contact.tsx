import { defineAppFieldGroup } from '../../hooks/form'

const fieldGroup = defineAppFieldGroup(({ strict }) => ({
  fullName: strict<string>(),
  phone: strict<string>(),
}))

function EmergencyContactFields({
  fields,
}: {
  fields: typeof fieldGroup.fields
}) {
  return (
    <>
      <fields.Field
        name="fullName"
        children={(field) => <field.TextField label="Full Name" />}
      />
      <fields.Field
        name="phone"
        children={(field) => <field.TextField label="Phone" />}
      />
    </>
  )
}

export const FieldGroupEmergencyContact = fieldGroup.bindComponent(
  EmergencyContactFields,
  'fields',
)

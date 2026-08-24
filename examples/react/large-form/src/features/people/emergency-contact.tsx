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
        name="fullName">
        {(field) => <field.TextField label="Full Name" />}
      </fields.Field>
      <fields.Field
        name="phone">
        {(field) => <field.TextField label="Phone" />}
      </fields.Field>
    </>
  )
}

export const FieldGroupEmergencyContact = fieldGroup.bindComponent(
  EmergencyContactFields,
  'fields',
)

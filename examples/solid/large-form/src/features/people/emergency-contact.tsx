import { defineAppFieldGroup } from '../../hooks/form'

const emergencyContactFieldGroup = defineAppFieldGroup(({ strict }) => ({
  fullName: strict<string>(),
  phone: strict<string>(),
}))

function EmergencyContactFields(props: {
  fields: typeof emergencyContactFieldGroup.fields
}) {
  return (
    <>
      <props.fields.Field name="fullName">
        {(field) => <field.TextField label="Full Name" />}
      </props.fields.Field>
      <props.fields.Field name="phone">
        {(field) => <field.TextField label="Phone" />}
      </props.fields.Field>
    </>
  )
}

export const FieldGroupEmergencyContact =
  emergencyContactFieldGroup.bindComponent(EmergencyContactFields, 'fields')

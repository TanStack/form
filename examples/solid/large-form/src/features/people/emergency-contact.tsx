import { getAppFieldGroupHelpers } from '../../hooks/form'

const { defineFields, helper, withFields } = getAppFieldGroupHelpers()

const emergencyContactFields = defineFields({
  fullName: helper.strict<string>(),
  phone: helper.strict<string>(),
})

function EmergencyContactFields(props: {
  fields: typeof emergencyContactFields
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

export const FieldGroupEmergencyContact = withFields(
  emergencyContactFields,
  EmergencyContactFields,
  'fields',
)

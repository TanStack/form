import { getAppFieldGroupHelpers } from '../../hooks/form'

const { defineFields, helper, withFields } = getAppFieldGroupHelpers()

const emergencyContactFields = defineFields({
  fullName: helper.strict<string>(),
  phone: helper.strict<string>(),
})

function EmergencyContactFields({
  fields,
}: {
  fields: typeof emergencyContactFields
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

export const FieldGroupEmergencyContact = withFields(
  emergencyContactFields,
  EmergencyContactFields,
  'fields',
)

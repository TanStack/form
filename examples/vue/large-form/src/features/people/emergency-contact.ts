import { getAppFieldGroupHelpers } from '../../hooks/form.ts'
import EmergencyContactFields from './EmergencyContactFields.vue'

const { defineFields, helper, withFields } = getAppFieldGroupHelpers()

export const emergencyContactFields = defineFields({
  fullName: helper.strict<string>(),
  phone: helper.strict<string>(),
})

export const FieldGroupEmergencyContact = withFields(
  emergencyContactFields,
  EmergencyContactFields,
  'fields',
)

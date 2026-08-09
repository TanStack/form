import { defineAppFieldGroup } from '../../hooks/form.ts'
import EmergencyContactFields from './EmergencyContactFields.vue'

const emergencyContactFieldGroup = defineAppFieldGroup(({ strict }) => ({
  fullName: strict<string>(),
  phone: strict<string>(),
}))

export const emergencyContactFields = emergencyContactFieldGroup.fields

export const FieldGroupEmergencyContact =
  emergencyContactFieldGroup.bindComponent(EmergencyContactFields, 'fields')

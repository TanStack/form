import { defineAppFieldGroup } from '../../hooks/form.js'
import EmergencyContactFields from './EmergencyContactFields.svelte'

const emergencyContactFieldGroup = defineAppFieldGroup(({ strict }) => ({
  fullName: strict<string>(),
  phone: strict<string>(),
}))

export const emergencyContactFields = emergencyContactFieldGroup.fields

export const FieldGroupEmergencyContact =
  emergencyContactFieldGroup.bindComponent(EmergencyContactFields, 'fields')

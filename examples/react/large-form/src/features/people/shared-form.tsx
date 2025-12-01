import { formOptions } from '@tanstack/react-form'

export const peopleFormOpts = formOptions({
  defaultValues: {
    fullName: '',
    email: '',
    phone: '',
    address: {
      line1: '',
      line2: '',
      city: '',
      state: '',
      zip: '',
    },
    emergencyContact: {
      fullName: '',
      phone: '',
    },
  },
  validators: {
    onChangeAsync: async ({ value }) => {
      const errors = {
        fields: {},
      } as {
        fields: Record<string, string>
      }
      if (!value.fullName) {
        errors.fields.fullName = 'Full name is required'
      }
      if (!value.phone) {
        errors.fields.phone = 'Phone is required'
      }
      if (!value.emergencyContact.fullName) {
        errors.fields['emergencyContact.fullName'] =
          'Emergency contact full name is required'
      }
      if (!value.emergencyContact.phone) {
        errors.fields['emergencyContact.phone'] =
          'Emergency contact phone is required'
      }

      return errors
    },
  },
})

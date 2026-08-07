import { appFormOptions } from '../../hooks/form'

export const peopleFormOpts = appFormOptions({
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
  validators: [
    {
      triggers: ['change'],
      run: async ({ value, createErrorMap }) => {
        const errors = createErrorMap()

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
  ],
})

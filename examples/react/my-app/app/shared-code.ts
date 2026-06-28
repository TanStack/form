import { formOptions } from '@tanstack/react-form'

export const formOpts = formOptions({
  defaultValues: {
    firstName: '',
    age: 0,
  },
  validators: [
    {
      // This is the default, but in case you want to keep it explicit.
      runOnServer: false,
      triggers: ['change'],
      run: ({ value, createErrorMap }) => {
        const errors = createErrorMap()

        if (value.age < 8) {
          errors.fields.age = 'Client validation: You must be at least 8'
        }

        return errors.toResult()
      },
    },
    {
      runOnServer: true,
      run: ({ value, createErrorMap }) => {
        const errors = createErrorMap()

        if (!value.firstName.trim()) {
          errors.fields.firstName = 'Server validation: First name is required'
        }

        if (value.age < 13) {
          errors.fields.age = 'Server validation: You must be at least 13'
        }

        return errors.toResult()
      },
    },
  ],
})

import { formOptions } from '@tanstack/react-form'

export const formOpts = formOptions({
  formId: 'profile',
  defaultValues: {
    firstName: '',
    age: 0,
  },
  validators: [
    {
      triggers: ['change'],
      run: ({ value, createErrorMap }) => {
        const errors = createErrorMap()

        if (value.age < 8) {
          errors.addFieldError(
            'age',
            'Client validation: You must be at least 8',
          )
        }

        return errors
      },
    },
    {
      triggers: ['server'],
      // This validator will only run on the server
      skipOnSubmit: true,
      run: ({ value, createErrorMap }) => {
        const errors = createErrorMap()

        if (!value.firstName.trim()) {
          errors.addFieldError(
            'firstName',
            'Server validation: First name is required',
          )
        }

        if (value.age < 13) {
          errors.addFieldError(
            'age',
            'Server validation: You must be at least 13',
          )
        }

        return errors
      },
    },
  ],
})

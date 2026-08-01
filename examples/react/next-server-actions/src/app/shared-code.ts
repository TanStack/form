import { formOptions } from '@tanstack/react-form'

export const formOpts = formOptions({
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
          errors.fields.age = 'Client validation: You must be at least 8'
        }

        return errors
      },
    },
    {
      triggers: ['server'],
      runOnSubmit: false,
      run: ({ value, createErrorMap }) => {
        const errors = createErrorMap()

        if (value.age < 12) {
          errors.fields.age =
            'Server validation: You must be at least 12 to sign up'
        }

        return errors
      },
    },
  ],
})

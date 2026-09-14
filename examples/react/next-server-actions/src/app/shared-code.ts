import { formOptions } from '@tanstack/react-form-nextjs'

export const formOpts = formOptions({
  defaultValues: {
    firstName: '',
    age: 0,
  },
  onServerValidate: ({ value }) => {
    if (value.age < 12) {
      return 'Server validation: You must be at least 12 to sign up'
    }
  },
})

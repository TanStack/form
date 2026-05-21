import { formOptions } from '@tanstack/react-form'

export const sharedFormOptions = formOptions({
  defaultValues: {
    firstName: '',
    lastName: '',
    address: {
      street: '',
      country: '',
    },
  },
})

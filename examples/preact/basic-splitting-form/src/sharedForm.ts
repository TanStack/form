import { formOptions } from '@tanstack/preact-form'

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

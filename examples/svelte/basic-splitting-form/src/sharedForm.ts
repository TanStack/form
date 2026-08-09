import { formOptions } from '@tanstack/svelte-form'

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

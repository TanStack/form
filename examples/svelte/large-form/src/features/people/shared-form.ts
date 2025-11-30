import { formOptions } from '@tanstack/svelte-form'

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
})

import { formOptions } from '@tanstack/angular-form'

export const sharedFormOptions = formOptions({
  defaultValues: {
    firstName: '',
    lastName: '',
    address: { street: '', country: '' },
  },
})

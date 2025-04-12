import { formOptions } from '@tanstack/react-form/server'

export const formOpts = formOptions({
  defaultValues: {
    firstName: '',
    age: 0,
  },
})

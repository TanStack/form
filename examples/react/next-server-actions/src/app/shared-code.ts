import { formOptions } from '@tanstack/react-form'
import { zodValidator } from '@tanstack/zod-form-adapter'

export const formOpts = formOptions({
  defaultValues: {
    firstName: '',
    age: 0,
  },
  validatorAdapter: zodValidator
})

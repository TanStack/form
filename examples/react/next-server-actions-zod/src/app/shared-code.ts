import { formOptions } from '@tanstack/react-form'
import { z } from 'zod'

const clientSchema = z.object({
  age: z.number().min(8),
  firstName: z.string(),
})

export const serverSchema = z.object({
  age: z.number().min(12),
  firstName: z.string(),
})

export const formOpts = formOptions({
  defaultValues: {
    firstName: '',
    age: 0,
  },
  validators: [
    {
      triggers: ['change'],
      run: clientSchema,
    },
    {
      triggers: ['server'],
      runOnSubmit: false,
      run: serverSchema,
    },
  ],
})

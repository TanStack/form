import { formOptions } from '@tanstack/react-form'
import { z } from 'zod'

const clientSchema = z.object({
  age: z.number().min(8),
})

export const serverSchema = z.object({
  age: z.number().min(12),
})

export const formOpts = formOptions.strictSchema(clientSchema, {
  defaultValues: {
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

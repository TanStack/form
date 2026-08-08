import { createValidator } from '@tanstack/vue-form'
import { z } from 'zod'
import { appFormOptions } from '../../hooks/form.ts'

export const step1Schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
})

export const step2Schema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
})

export const stepValidator = createValidator({
  triggers: [
    {
      trigger: 'change',
      when: ({ groupApi, formApi }) => {
        const submissionAttempts =
          groupApi?.state.submissionAttempts ?? formApi.state.submissionAttempts
        return submissionAttempts > 0
      },
    },
  ],
})

export const wizardFormOpts = appFormOptions({
  defaultValues: {
    step1: {
      name: '',
    },
    step2: {
      name: '',
    },
  },
  validators: [
    {
      // Group submission validates only the current step. Direct form
      // submission validates the entire wizard.
      run: z.object({
        step1: step1Schema,
        step2: step2Schema,
      }),
      triggers: [],
    },
  ],
})

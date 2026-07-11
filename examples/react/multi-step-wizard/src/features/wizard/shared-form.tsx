import z from 'zod'
import { createValidator } from '@tanstack/react-form'
import { appFormOptions } from '../../hooks/form.tsx'

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
        const submitTries =
          groupApi?.state.submissionAttempts ?? formApi.state.submissionAttempts
        return submitTries > 0
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
      // This validator is only used when `form.handleSubmit` is called itself.
      // When `form.FormGroup`'s `handleSubmit` is called, it will only validate the current step's schema.
      // This means that this schema will not be called when the user submits the form group, but instead when they submit the entire form.
      run: z.object({
        step1: step1Schema,
        step2: step2Schema,
      }),
      triggers: [],
    },
  ],
})

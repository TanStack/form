import { formOptions } from '@tanstack/react-form'

export const wizardFormOpts = formOptions({
  defaultValues: {
    step1: {
      name: "",
    },
    step2: {
      name: "",
    },
  },
})

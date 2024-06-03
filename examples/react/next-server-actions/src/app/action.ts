'use server'

import { createServerValidate } from '@tanstack/react-form'
import { formOpts } from './shared-code'

const serverValidate = createServerValidate({
  ...formOpts,
  onServerValidate: ({ value }) => {
    if (value.age < 12) {
      return 'Server validation: You must be at least 12 to sign up'
    }
  },
})

export default async function someAction(prev: unknown, formData: FormData) {
  return await serverValidate(formData)
}

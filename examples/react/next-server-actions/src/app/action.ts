'use server'

import {
  ServerValidateError,
  createServerValidate,
} from '@tanstack/react-form/nextjs'
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
  try {
    await serverValidate(formData)
  } catch (e) {
    if (e instanceof ServerValidateError) {
      return e.formState
    }

    // Some other error occurred while validating your form
    throw e
  }

  // Your form has successfully validated!
}

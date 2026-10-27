'use server'

import { createServerValidateHelper } from '@tanstack/react-form'
import { next } from '@tanstack/react-form-nextjs'
import { formOpts } from './shared-code'
import { decode } from 'decode-formdata'

const createServerValidate = createServerValidateHelper({
  framework: next(),
})

const serverValidate = createServerValidate(formOpts, {
  decode: (formData) => decode(formData, { numbers: ['age'] }),
})

export default async function someAction(_prev: unknown, formData: FormData) {
  const result = await serverValidate(formData)

  if (!result.success) {
    return result.serverState
  }

  console.log('validatedData', result.values, result.validatorOutputs)

  // Your form has successfully validated!
  // Return `undefined` to reset the form, or
  // return the server state to preserve it.
  return result.serverState
}

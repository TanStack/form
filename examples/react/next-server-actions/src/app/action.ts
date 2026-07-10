'use server'

import {
  initialServerFormState,
  serverValidateHelper,
} from '@tanstack/react-form'
import { next } from '@tanstack/react-form-nextjs'
import { formOpts } from './shared-code'

const { createServerValidate } = serverValidateHelper({
  framework: next({
    info: {
      numbers: ['age'],
    },
  }),
})

const serverValidate = createServerValidate(formOpts)

export default async function someAction(_prev: unknown, formData: FormData) {
  const result = await serverValidate(formData)

  if (!result.success) {
    return result.serverState
  }

  console.log('validatedData', result.values, result.schemaOutputs)
  // Persist the form data to the database
  // await sql`
  //   INSERT INTO users (name, email, password)
  //   VALUES (${result.values.firstName}, ${result.values.age})
  // `

  // Your form has successfully validated!
  return initialServerFormState
}

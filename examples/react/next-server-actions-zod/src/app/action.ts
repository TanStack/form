'use server'

import {
  ServerValidateError,
  createServerValidate,
} from '@tanstack/react-form-nextjs'
import { z } from 'zod'
import { formOpts } from './shared-code'

const schema = z.object({
  age: z.coerce.number().min(12),
  firstName: z.string(),
})

const serverValidate = createServerValidate({
  ...formOpts,
  onServerValidate: schema,
})

export default async function someAction(prev: unknown, formData: FormData) {
  try {
    const validatedData = await serverValidate(formData)
    console.log('validatedData', validatedData)
    // Persist the form data to the database
    // await sql`
    //   INSERT INTO users (name, email, password)
    //   VALUES (${validatedData.name}, ${validatedData.email}, ${validatedData.password})
    // `
  } catch (e) {
    if (e instanceof ServerValidateError) {
      return e.formState
    }

    // Some other error occurred while validating your form
    throw e
  }

  // Your form has successfully validated!
}

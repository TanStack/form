'use server'

import {
  ServerValidateError,
  createServerValidate,
} from '@tanstack/react-form-nextjs'
import { z } from 'zod'
import { formOpts } from './shared-code'

// Required as `z.coerce.number()` defined the type as `unknown`, so we need to do the coercion and validation manually
const zodAtLeast12 = z
  .custom<number>()
  .refine((value) => Number.isFinite(Number(value)), 'Invalid number')
  .transform((value) => Number(value))
  .refine((value) => value >= 12, 'Age must be at least 12')

const schema = z.object({
  age: zodAtLeast12,
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

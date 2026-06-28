'use server'

import {
  ServerValidateError,
  initialServerFormState,
  serverValidateHelper,
} from '@tanstack/react-form'
import { next } from '@tanstack/react-form-nextjs'
import { formOpts } from './shared-code'
import type { ServerFormState } from '@tanstack/react-form'

const { createServerValidate } = serverValidateHelper({
  framework: next({
    info: {
      numbers: ['age'],
    },
  }),
})

const serverValidate = createServerValidate(formOpts)

type FormValues = typeof formOpts.defaultValues
type FormValidators = NonNullable<typeof formOpts.validators>
type ActionState = ServerFormState<FormValues, FormValidators>

export default async function someAction(
  _prev: unknown,
  formData: FormData,
): Promise<ActionState> {
  try {
    const validatedData = await serverValidate(formData)
    console.log('validatedData', validatedData)
  } catch (error) {
    if (error instanceof ServerValidateError) {
      return error.serverState as ActionState
    }

    throw error
  }

  return initialServerFormState
}

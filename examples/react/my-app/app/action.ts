'use server'

import {
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
  const result = await serverValidate(formData)

  if (!result.success) {
    return result.serverState
  }

  console.log('validatedData', result.values, result.schemaOutputs)

  return initialServerFormState
}

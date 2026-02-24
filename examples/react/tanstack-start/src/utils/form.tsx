import { createServerFn } from '@tanstack/react-start'
import {
  ServerValidateError,
  createServerValidate,
  getFormData,
} from '@tanstack/react-form-start'
import { setResponseStatus } from '@tanstack/react-start/server'
import { formOpts } from './form-isomorphic'

const serverValidate = createServerValidate({
  ...formOpts,
  onServerValidate: ({ value }) => {
    if (value.age < 12) {
      return 'Server validation: You must be at least 12 to sign up'
    }
  },
})

export const handleForm = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => {
    if (!(data instanceof FormData)) {
      throw new Error('Invalid form data')
    }
    return data
  })
  .handler(async (ctx) => {
    try {
      const validatedData = await serverValidate(ctx.data)
      console.log('validatedData', validatedData)
    } catch (e) {
      if (e instanceof ServerValidateError) {
        // Log form errors or do any other logic here
        return e.response
      }

      setResponseStatus(500)
      return 'There was an internal error'
    }

    return 'Form has validated successfully'
  })

export const getFormDataFromServer = createServerFn({ method: 'GET' }).handler(
  async () => {
    return getFormData()
  },
)

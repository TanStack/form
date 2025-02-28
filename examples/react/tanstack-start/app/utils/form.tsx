import { createServerFn } from '@tanstack/react-start'
import { formOptions } from '@tanstack/react-form'
import {
  ServerValidateError,
  createServerValidate,
  getFormData,
} from '@tanstack/react-form/start'
import { setResponseStatus } from '@tanstack/react-start/server'

export const formOpts = formOptions({
  defaultValues: {
    firstName: '',
    age: 0,
  },
})

const serverValidate = createServerValidate({
  ...formOpts,
  onServerValidate: ({ value }) => {
    if (value.age < 12) {
      return 'Server validation: You must be at least 12 to sign up'
    }
  },
})

export const handleForm = createServerFn({
  method: 'POST',
})
  .validator((data: unknown) => {
    if (!(data instanceof FormData)) {
      throw new Error('Invalid form data')
    }
    return data
  })
  .handler(async (ctx) => {
    try {
      await serverValidate(ctx.data)
    } catch (e) {
      if (e instanceof ServerValidateError) {
        // Log form errors or do any other logic here
        return e.response
      }

      // Some other error occurred when parsing the form
      console.error(e)
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

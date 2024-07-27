import { createServerFn } from '@tanstack/start'
import { formOptions } from '@tanstack/react-form'
import {
  ServerValidateError,
  createServerValidate,
  getFormData,
} from '@tanstack/react-form/start'

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

export const handleForm = createServerFn(
  'POST',
  async (formData: FormData, ctx) => {
    try {
      await serverValidate(ctx, formData)
    } catch (e) {
      if (e instanceof ServerValidateError) {
        return e.response
      }

      // Some other error occurred when parsing the form
      console.error(e)
      return new Response('There was an internal error', {
        status: 500,
      })
    }

    return new Response('Form has validated successfully', {
      status: 200,
    })
  },
)

export const getFormDataFromServer = createServerFn('GET', async (_, ctx) => {
  return getFormData(ctx)
})

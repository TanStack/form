import { createServerFn } from '@tanstack/react-start'
import { redirect } from '@tanstack/react-router'
import { formOpts } from './form-isomorphic'
import { createServerValidate } from './form-validator'

const serverValidate = createServerValidate(formOpts)

export const handleForm = createServerFn({ method: 'POST' })
  .validator((data) => {
    if (!(data instanceof FormData)) {
      throw new Error('Invalid form data')
    }
    return data
  })
  .handler(async (ctx) => {
    const result = await serverValidate({ formData: ctx.data })

    if (!result.success) {
      throw redirect({ to: '/', search: {} })
    }

    console.info('validated form value', {
      values: result.values,
      schemaOutputs: result.schemaOutputs,
    })

    throw redirect({
      to: '/',
      search: {
        status: 'success',
      },
    })
  })

export const getFormDataFromServer = createServerFn({
  method: 'GET',
  strict: {
    output: false,
  },
}).handler(async () => {
  return serverValidate.getFormData()
})

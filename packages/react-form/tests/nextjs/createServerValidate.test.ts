import { describe, expect, it } from 'vitest'

import { ServerValidateError, createServerValidate } from '../../src/nextjs'

describe('createServerValidate', () => {
  const syncOnServerValidate = createServerValidate({
    defaultValues: {
      name: '',
    },
    onServerValidate: ({ value }) => {
      const { name } = value
      if (!name) return 'Name is required'
      return
    },
  })

  const asyncOnServerValidate = createServerValidate({
    defaultValues: {
      name: '',
    },
    onServerValidate: async ({ value }) => {
      const errorMessage = await Promise.resolve('Name is required')

      const { name } = value
      if (!name) return errorMessage
      return
    },
  })

  it('onServerValidate throws ServerValidateError', () => {
    const formData = new FormData()
    formData.append('name', '')

    expect(syncOnServerValidate(formData)).rejects.toThrowError(
      ServerValidateError,
    )

    expect(asyncOnServerValidate(formData)).rejects.toThrowError(
      ServerValidateError,
    )
  })

  it('onSeverValidate returns formState', async () => {
    const formData = new FormData()
    formData.append('name', '')

    try {
      await syncOnServerValidate(formData)
    } catch (e) {
      if (e instanceof ServerValidateError) {
        expect(e.formState).toHaveProperty('errors')
        expect(e.formState.errors[0]).toEqual('Name is required')
      }
    }

    try {
      await asyncOnServerValidate(formData)
    } catch (e) {
      if (e instanceof ServerValidateError) {
        expect(e.formState).toHaveProperty('errors')
        expect(e.formState.errors[0]).toEqual('Name is required')
      }
    }
  })
})

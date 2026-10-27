import { describe, expect, it } from 'vitest'
import { createServerValidateHelper, formOptions } from '../src'
import type { ServerFormState } from '../src'

describe('server validation helper', () => {
  it('validates submissions and resolves missing state without persistence', async () => {
    const createServerValidate = createServerValidateHelper({
      framework: {
        getFormData: async (submission: FormData) => submission,
      },
    })
    const serverValidate = createServerValidate(
      formOptions({ defaultValues: { name: '' } }),
      {
        decode: async (submission) => ({
          name: String(submission.get('name') ?? ''),
        }),
      },
    )
    const submission = new FormData()
    submission.set('name', 'Ada')

    const result = await serverValidate(submission)

    expect(result).toMatchObject({
      success: true,
      values: { name: 'Ada' },
      serverState: { values: { name: 'Ada' } },
    })
    await expect(serverValidate.getServerState()).resolves.toBeUndefined()
  })

  it('restores each form state by ID through a destructured reader', async () => {
    const storedStates = new Map<string, ServerFormState<unknown>>()
    const createServerValidate = createServerValidateHelper({
      framework: {
        getFormData: (values: { name: string }) => values,
        persistServerState: {
          setState: async (formId, state) => {
            storedStates.set(formId, state)
          },
          readState: async (formId) => storedStates.get(formId),
        },
      },
    })
    const options = formOptions({
      defaultValues: { name: '' },
      validators: [
        {
          triggers: ['server'],
          run: ({ createErrorMap }) =>
            createErrorMap({ fields: { name: 'Name is unavailable' } }),
        },
      ],
    })
    const profile = createServerValidate(
      { ...options, formId: 'profile' },
      { decode: (values) => values },
    )
    const billing = createServerValidate(
      { ...options, formId: 'billing' },
      { decode: (values) => values },
    )
    const { getServerState } = profile

    await expect(getServerState()).resolves.toBeUndefined()

    const profileResult = await profile({ name: 'Ada' })
    const billingResult = await billing({ name: 'Grace' })

    expect(profileResult.success).toBe(false)
    expect(billingResult.success).toBe(false)
    await expect(getServerState()).resolves.toEqual(profileResult.serverState)
    await expect(billing.getServerState()).resolves.toEqual(
      billingResult.serverState,
    )
  })

  it('rejects state reads when persistence fails', async () => {
    const error = new Error('State is unavailable')
    const createServerValidate = createServerValidateHelper({
      framework: {
        getFormData: (values: { name: string }) => values,
        persistServerState: {
          setState: () => {},
          readState: async () => {
            throw error
          },
        },
      },
    })
    const serverValidate = createServerValidate(
      formOptions({ formId: 'profile', defaultValues: { name: '' } }),
      { decode: (values) => values },
    )

    await expect(serverValidate.getServerState()).rejects.toBe(error)
  })
})

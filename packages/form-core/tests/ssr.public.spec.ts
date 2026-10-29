import { describe, expect, it } from 'vitest'
import {
  createServerValidateHelper,
  createTanStackFormServerPlugin,
  formOptions,
} from '../src'
import type { ServerFormState } from '../src'

describe('server validation helper', () => {
  it('decodes and validates FormData submissions without transport middleware', async () => {
    const createServerValidate = createServerValidateHelper({
      framework: createTanStackFormServerPlugin({
        submittedDataType: new FormData(),
      }),
    })
    const serverValidate = createServerValidate(
      formOptions({
        defaultValues: { name: '' },
        validators: [
          {
            triggers: ['server'],
            run: ({ value, createOutput }) => createOutput(value.name.length),
          },
        ],
      }),
      {
        decode: async (submission) => ({
          name: String(submission.get('name') ?? ''),
        }),
      },
    )
    const submission = new FormData()
    submission.set('name', 'Ada')

    const result = await serverValidate({ formData: submission })

    expect(result).toMatchObject({
      success: true,
      values: { name: 'Ada' },
      validatorOutputs: [3],
      serverState: { values: { name: 'Ada' } },
    })
  })

  it('isolates failed submission state by transport ID through a destructured reader', async () => {
    const storedStates = new Map<string, ServerFormState<unknown>>()
    const createServerValidate = createServerValidateHelper({
      framework: createTanStackFormServerPlugin({
        submittedDataType: { name: '' },
        transportMiddleware: {
          setState: async (transportId, state) => {
            storedStates.set(transportId, state)
          },
          readState: async (transportId) => storedStates.get(transportId),
        },
      }),
    })
    const options = formOptions({
      formId: 'shared-form',
      defaultValues: { name: '' },
      validators: [
        {
          triggers: ['server'],
          run: ({ createErrorMap }) =>
            createErrorMap({ fields: { name: 'Name is unavailable' } }),
        },
      ],
    })
    const profile = createServerValidate(options, {
      transportId: 'profile',
      decode: (values) => values,
    })
    const billing = createServerValidate(options, {
      transportId: 'billing',
      decode: (values) => values,
    })
    const { getServerState } = profile

    await expect(getServerState()).resolves.toBeUndefined()

    const profileResult = await profile({ formData: { name: 'Ada' } })
    const billingResult = await billing({ formData: { name: 'Grace' } })

    expect(profileResult.success).toBe(false)
    expect(billingResult.success).toBe(false)
    await expect(getServerState()).resolves.toMatchObject({
      values: { name: 'Ada' },
      validationResults: [
        { result: { fields: { name: ['Name is unavailable'] } } },
      ],
    })
    await expect(billing.getServerState()).resolves.toMatchObject({
      values: { name: 'Grace' },
      validationResults: [
        { result: { fields: { name: ['Name is unavailable'] } } },
      ],
    })
  })

  it('restores state written through a destructured setter', async () => {
    const storedStates = new Map<string, ServerFormState<unknown>>()
    const createServerValidate = createServerValidateHelper({
      framework: createTanStackFormServerPlugin({
        submittedDataType: { name: '' },
        transportMiddleware: {
          setState: (transportId, state) => {
            storedStates.set(transportId, state)
          },
          readState: async (transportId) => storedStates.get(transportId),
        },
      }),
    })
    const serverValidate = createServerValidate(
      formOptions({ defaultValues: { name: '' } }),
      { transportId: 'profile', decode: (values) => values },
    )
    const { getServerState, setServerState } = serverValidate
    const serverState: ServerFormState<{ name: string }> = {
      values: { name: 'Ada' },
      validationResults: [],
      submissionAttempts: 1,
    }

    setServerState(serverState)

    await expect(getServerState()).resolves.toEqual(serverState)
  })

  it('rejects state reads when transport middleware fails', async () => {
    const error = new Error('State is unavailable')
    const createServerValidate = createServerValidateHelper({
      framework: createTanStackFormServerPlugin({
        submittedDataType: { name: '' },
        transportMiddleware: {
          setState: () => {},
          readState: async () => {
            throw error
          },
        },
      }),
    })
    const serverValidate = createServerValidate(
      formOptions({ defaultValues: { name: '' } }),
      { transportId: 'profile', decode: (values) => values },
    )

    await expect(serverValidate.getServerState()).rejects.toBe(error)
  })
})

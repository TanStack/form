import { describe, expectTypeOf, it } from 'vitest'
import { z } from 'zod'
import {
  createServerValidateHelper,
  createTanStackFormServerPlugin,
  formOptions,
} from '../src'
import type { ServerFormState } from '../src'

describe('server validation helper types', () => {
  it('infers decoder input and requires submissions inside formData', () => {
    const createServerValidate = createServerValidateHelper({
      framework: createTanStackFormServerPlugin({
        submittedDataType: new FormData(),
      }),
    })
    const serverValidate = createServerValidate(
      formOptions({ defaultValues: { name: '' } }),
      {
        decode: async (submission) => {
          expectTypeOf(submission).toEqualTypeOf<FormData>()
          return { name: String(submission.get('name') ?? '') }
        },
      },
    )

    serverValidate({ formData: new FormData() })
    // @ts-expect-error Submissions must be wrapped in formData.
    serverValidate(new FormData())
    // @ts-expect-error The plugin determines the submitted data type.
    serverValidate({ formData: { name: 'Ada' } })
    // @ts-expect-error State readers require transport middleware.
    void serverValidate.getServerState
    // @ts-expect-error State writers require transport middleware.
    void serverValidate.setServerState
  })

  it('keeps form values separate from validator outputs and narrows by success', async () => {
    const createServerValidate = createServerValidateHelper({
      framework: { submittedDataType: new FormData() },
    })
    const options = formOptions({
      defaultValues: { name: '' },
      validators: [
        {
          triggers: ['server'],
          run: z
            .object({ name: z.string() })
            .transform(({ name }) => ({ nameLength: name.length })),
        },
      ],
    })
    const serverValidate = createServerValidate(options, {
      decode: (submission) => ({
        name: String(submission.get('name') ?? ''),
      }),
    })
    const result = await serverValidate({ formData: new FormData() })

    expectTypeOf(result.serverState).toEqualTypeOf<
      ServerFormState<{ name: string }>
    >()
    // @ts-expect-error Values require a successful result.
    void result.values
    // @ts-expect-error Validator outputs require a successful result.
    void result.validatorOutputs

    if (result.success) {
      expectTypeOf(result.values).toEqualTypeOf<{ name: string }>()
      expectTypeOf(result.validatorOutputs).toEqualTypeOf<
        [{ nameLength: number }]
      >()
    } else {
      // @ts-expect-error Failed validation does not expose validated values.
      void result.values
      // @ts-expect-error Failed validation does not expose validator outputs.
      void result.validatorOutputs
    }
  })

  it('requires the decoder to match values inferred from the form options', () => {
    const createServerValidate = createServerValidateHelper({
      framework: { submittedDataType: new FormData() },
    })
    const options = formOptions({ defaultValues: { age: 0 } })

    createServerValidate(options, {
      decode: (submission) => ({ age: Number(submission.get('age')) }),
    })
    createServerValidate(options, {
      decode: async (submission) => ({ age: Number(submission.get('age')) }),
    })

    createServerValidate(options, {
      // @ts-expect-error The form value type is inferred from its options.
      decode: () => ({ age: '13' }),
    })
    createServerValidate(options, {
      // @ts-expect-error Async decoders must also preserve the form value type.
      decode: async () => ({ age: '13' }),
    })
  })

  it('preserves form values in transported state and infers middleware inputs', async () => {
    const storedStates = new Map<string, ServerFormState<unknown>>()
    const createServerValidate = createServerValidateHelper({
      framework: createTanStackFormServerPlugin({
        submittedDataType: { fullName: '' },
        transportMiddleware: {
          setState: (transportId, state) => {
            expectTypeOf(transportId).toEqualTypeOf<string>()
            expectTypeOf(state).toEqualTypeOf<ServerFormState<unknown>>()
            storedStates.set(transportId, state)
          },
          readState: async (transportId) => {
            expectTypeOf(transportId).toEqualTypeOf<string>()
            return storedStates.get(transportId)
          },
        },
      }),
    })
    const serverValidate = createServerValidate(
      formOptions({ defaultValues: { name: '' } }),
      {
        transportId: 'profile',
        decode: (submission) => {
          expectTypeOf(submission).toEqualTypeOf<{ fullName: string }>()
          return { name: submission.fullName }
        },
      },
    )
    const { getServerState, setServerState } = serverValidate
    const result = await serverValidate({ formData: { fullName: 'Ada' } })
    const serverState = await getServerState()

    expectTypeOf(result.serverState).toEqualTypeOf<
      ServerFormState<{ name: string }>
    >()
    expectTypeOf(serverState).toEqualTypeOf<
      ServerFormState<{ name: string }> | undefined
    >()

    setServerState(result.serverState)
    setServerState({
      // @ts-expect-error Transported state must match the form's value shape.
      values: { name: 123 },
      validationResults: [],
      submissionAttempts: 1,
    })
  })

  it('requires a transport ID even when the form has a form ID', () => {
    const createServerValidate = createServerValidateHelper({
      framework: {
        submittedDataType: new FormData(),
        transportMiddleware: {
          setState: () => {},
          readState: () => undefined,
        },
      },
    })

    createServerValidate(
      formOptions({ formId: 'profile', defaultValues: { name: '' } }),
      // @ts-expect-error Transport middleware requires transportId in the config.
      { decode: (submission) => ({ name: String(submission.get('name')) }) },
    )
  })
})

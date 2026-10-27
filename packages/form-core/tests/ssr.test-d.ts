import { describe, expectTypeOf, it } from 'vitest'
import { z } from 'zod'
import { createServerValidateHelper, formOptions } from '../src'
import type { ServerFormState } from '../src'

describe('server validation helper types', () => {
  it('preserves adapter input, form values, validator outputs and saved state', async () => {
    const createServerValidate = createServerValidateHelper({
      framework: {
        getFormData: async ({ formData }: { formData: FormData }) => formData,
      },
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
      decode: async (submission) => {
        expectTypeOf(submission).toEqualTypeOf<FormData>()
        return { name: String(submission.get('name') ?? '') }
      },
    })
    const { getServerState } = serverValidate

    expectTypeOf(serverValidate).parameters.toEqualTypeOf<
      [{ formData: FormData }]
    >()
    expectTypeOf(getServerState).returns.toEqualTypeOf<
      Promise<ServerFormState<{ name: string }> | undefined>
    >()

    const result = await serverValidate({ formData: new FormData() })

    expectTypeOf(result.serverState).toEqualTypeOf<
      ServerFormState<{ name: string }>
    >()
    if (result.success) {
      expectTypeOf(result.values).toEqualTypeOf<{ name: string }>()
      expectTypeOf(result.validatorOutputs).toEqualTypeOf<
        [{ nameLength: number }]
      >()
    } else {
      // @ts-expect-error Failed validation does not expose validated values.
      void result.values
    }
  })

  it('requires the decoder to match values inferred from the form options', () => {
    const createServerValidate = createServerValidateHelper({
      framework: { getFormData: (submission: FormData) => submission },
    })

    createServerValidate(formOptions({ defaultValues: { age: 0 } }), {
      // @ts-expect-error The form value type is inferred from its options.
      decode: () => ({ age: '13' }),
    })
  })
})

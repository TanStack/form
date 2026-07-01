import { describe, expectTypeOf, it } from 'vitest'
import { formOptions, serverValidateHelper } from '@tanstack/form-core'
import { start } from '../src'
import type { ServerFormState, ServerValidateResult } from '@tanstack/form-core'

describe('start server validation types', () => {
  it('preserves discriminated result generics through the helper', async () => {
    const options = formOptions({
      defaultValues: { name: '' },
      validators: [
        {
          run: () => ({
            fields: {
              name: 'Name is required',
            },
          }),
          triggers: ['server'],
        },
      ],
    })

    const { createServerValidate } = serverValidateHelper({
      framework: start(),
    })
    const validate = createServerValidate(options)
    const result = await validate({ formData: {} as FormData })

    if (result.success) {
      expectTypeOf(result.values).toEqualTypeOf<{ name: string }>()
    } else {
      type Values = { name: string }
      type Validators = NonNullable<typeof options.validators>

      expectTypeOf(result.serverState).toEqualTypeOf<
        ServerFormState<Values, Validators>
      >()
    }
  })

  it('preserves start helpers and custom callback return types', async () => {
    const options = formOptions({
      defaultValues: { name: '' },
      validators: [
        {
          run: () => undefined,
          triggers: ['server'],
        },
      ],
    })

    const { createServerValidate, getFormData } = serverValidateHelper({
      framework: start({
        onInvalid: () => ({ status: 'invalid' as const }),
        onValid: () => ({ status: 'valid' as const }),
      }),
    })

    const serverState = await getFormData()
    expectTypeOf(serverState).toEqualTypeOf<ServerFormState<any, any>>()

    const validate = createServerValidate(options)
    const result = await validate({ formData: {} as FormData })

    if ('success' in result) {
      expectTypeOf(result).toEqualTypeOf<
        ServerValidateResult<
          { name: string },
          NonNullable<typeof options.validators>
        >
      >()
    } else {
      expectTypeOf(result).toEqualTypeOf<
        { status: 'invalid' } | { status: 'valid' }
      >()
    }
  })

  it('types form-bound helpers and form data info from values', async () => {
    const options = formOptions({
      defaultValues: { firstName: '', age: 0 },
      validators: [
        {
          run: () => undefined,
          triggers: ['server'],
        },
      ],
    })

    const { createServerValidate } = serverValidateHelper({
      framework: start(),
    })
    const validate = createServerValidate(options, {
      info: {
        numbers: ['age'],
      },
    })

    // @ts-expect-error String fields cannot be configured as numbers.
    createServerValidate(options, { info: { numbers: ['firstName'] } })

    await validate({
      formData: {} as FormData,
      info: {
        numbers: ['age'],
      },
    })

    await validate({
      formData: {} as FormData,
      // @ts-expect-error Invocation info is also typed against form values.
      info: { numbers: ['firstName'] },
    })

    expectTypeOf(validate.getFormData()).toEqualTypeOf<
      Promise<
        ServerFormState<
          { firstName: string; age: number },
          NonNullable<typeof options.validators>
        >
      >
    >()
  })
})

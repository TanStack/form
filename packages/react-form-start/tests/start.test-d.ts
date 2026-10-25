import { describe, expectTypeOf, it } from 'vitest'
import { formOptions } from '@tanstack/form-core'
import { start } from '../src'
import type { ServerFormState } from '@tanstack/form-core'

describe('start server validation types', () => {
  it('preserves discriminated result generics through the factory', async () => {
    const options = formOptions({
      defaultValues: { name: '' },
      validators: [
        {
          run: () => ({
            fields: {
              name: ['Name is required'],
            },
          }),
          triggers: ['server'],
        },
      ],
    })

    const { createServerValidate } = start()
    const validate = createServerValidate(options)
    const result = await validate({ formData: {} as FormData })

    if (result.success) {
      expectTypeOf(result.values).toEqualTypeOf<{ name: string }>()
    } else {
      type Values = { name: string }

      expectTypeOf(result.serverState).toEqualTypeOf<ServerFormState<Values>>()
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

    const { createServerValidate, getFormData } = start({
      onInvalid: () => ({ status: 'invalid' as const }),
      onValid: () => ({ status: 'valid' as const }),
    })

    const serverState = await getFormData()
    expectTypeOf(serverState).toEqualTypeOf<ServerFormState<any>>()

    const validate = createServerValidate(options)
    const result = await validate({ formData: {} as FormData })

    if ('success' in result) {
      if (result.success) {
        expectTypeOf(result.values).toEqualTypeOf<{ name: string }>()
        expectTypeOf(result.validatorOutputs).toEqualTypeOf<[undefined]>()
      } else {
        expectTypeOf(result.serverState).toEqualTypeOf<
          ServerFormState<{ name: string }>
        >()
      }
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

    const { createServerValidate } = start()
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
      Promise<ServerFormState<{ firstName: string; age: number }>>
    >()
  })
})

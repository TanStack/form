import { describe, expectTypeOf, it } from 'vitest'
import { z } from 'zod'
import {
  formOptions,
  serverValidateHelper,
  validateServerValues,
} from '../src'
import type {
  FieldValidators,
  FormOptions,
  FormGroupValidators,
  FormValidators,
  ServerValidateFrameworkPlugin,
} from '../src'

describe('server validation types', () => {
  it('accepts server validators and preserves schema output inference', async () => {
    const options = formOptions({
      defaultValues: { name: '' },
      validators: [
        {
          run: z
            .object({
              name: z.string(),
            })
            .transform(({ name }) => ({ nameLength: name.length })),
          runOnServer: true,
        },
      ],
    })

    const result = await validateServerValues(options, { name: 'Tony' })

    expectTypeOf(result.values).toEqualTypeOf<{ name: string }>()
    expectTypeOf(result.schemaOutputs).toEqualTypeOf<
      readonly [{ nameLength: number }]
    >()
  })

  it('uses a server-only context for runOnServer validators', () => {
    formOptions({
      defaultValues: { name: '' },
      validators: [
        {
          run: (ctx) => {
            expectTypeOf(ctx.event).toEqualTypeOf<'server'>()
            expectTypeOf(ctx.value).toEqualTypeOf<{ name: string }>()
            // @ts-expect-error Server validators do not receive a form API.
            void ctx.formApi
            return undefined
          },
          runOnServer: true,
        },
        {
          run: ({ formApi }) => {
            expectTypeOf(formApi.state.values).toEqualTypeOf<{
              name: string
            }>()
            return undefined
          },
          triggers: [],
        },
        {
          run: ({ formApi }) => {
            expectTypeOf(formApi.state.values).toEqualTypeOf<{
              name: string
            }>()
            return undefined
          },
          runOnServer: false,
          triggers: [],
        },
      ],
    })
  })

  it('rejects server triggers and non-form server validators', () => {
    formOptions({
      defaultValues: { name: '' },
      validators: [
        {
          run: () => undefined,
          triggers: [
            // @ts-expect-error Server validation is configured with runOnServer.
            'server',
          ],
        },
      ],
    })

    const fieldValidators: FieldValidators<{ name: string }, 'name', string> = [
      {
        run: () => undefined,
        triggers: [],
        // @ts-expect-error Field validators cannot run on the server.
        runOnServer: true,
      },
    ]
    const groupValidators: FormGroupValidators<{ name: string }> = [
      {
        run: () => undefined,
        triggers: [],
        // @ts-expect-error Form group validators cannot run on the server.
        runOnServer: true,
      },
    ]

    void fieldValidators
    void groupValidators
  })

  it('preserves plugin-customized validator return signatures', () => {
    const plugin = {
      id: 'react-form-test',
      createServerValidate: <
        TFormData,
        const TFormValidators extends FormValidators<TFormData>,
        TSubmitReturn,
      >(
        _options: FormOptions<TFormData, TFormValidators, TSubmitReturn>,
      ) => {
        return (values: TFormData) => Promise.resolve(values)
      },
    } satisfies ServerValidateFrameworkPlugin

    const { createServerValidate } = serverValidateHelper({ framework: plugin })
    const validate = createServerValidate(
      formOptions({
        defaultValues: { name: '' },
        validators: [
          {
            run: () => undefined,
            runOnServer: true,
          },
        ],
      }),
    )

    expectTypeOf(validate).parameter(0).toEqualTypeOf<{ name: string }>()
  })
})
